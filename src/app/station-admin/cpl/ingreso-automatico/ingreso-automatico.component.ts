import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx'
import { NominaService } from '../../../services/nomina.service';
import { StorageService } from '../../../services/storage.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EntStation } from 'e:/SIMOVIL/src/app/Class/EntStation';
import { count } from 'console';
import { forEach } from 'jszip';

@Component({
    selector: 'app-ingreso-automatico',
    templateUrl: './ingreso-automatico.component.html',
    styleUrls: ['./ingreso-automatico.component.css'],
    standalone: false
})
export class IngresoAutomaticoComponent implements OnInit {
  @ViewChild('FileReaderTerpel') ResetFileReaderTerpel: ElementRef;
  @ViewChild('FileReaderDominus') ResetFileReaderDominus: ElementRef;
  stationCode: number;
  stationsAll: import("e:/SIMOVIL/src/app/Class/EntStation").EntStation[];
  stationSel: EntStation
  TurnosEstacion: number;
  LecturasIniciales: any[];
  Turnos: any[];
  Fecha: Date = new Date();
  TurnoSel: any;
  es;
  estacionesTerpelPOS = [96, 94, 65, 11, 102,111,121,131];
  estacionesDominus = [92, 95, 61, 62, 98, 21];
  estacionesFuelControl = [91];
  data = [];
  //data2 = [];
  txt;
  lines;
  resultado;
  headers;
  words;
  obj;
  workbook: any;
  hojas = [];
  estadoLecturas: boolean = true;

  constructor(private _NominaService: NominaService,
    private _storageService: StorageService,
    private cuadroDialogo: PrincipalComponent) { }

  ngOnInit() {
    this.stationCode = Number(this._storageService.getCurrentStation());
    this.GetEstaciones();
    this.GetDatosCalendario();
    this.GetTurnos(this.stationCode);
  }


  fileChangeTerpel(file: any) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.target.files[0])
    fileReader.onload = (e: any) => {
      const bufferArray = e?.target.result
      const wb = XLSX.read(bufferArray, { type: "buffer" })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]

      this.data = XLSX.utils.sheet_to_json(ws)
      //const fileName = file.name.split(".")[0]


      this.LecturasIniciales.forEach((e) => {
        let Index = this.data.findIndex((element) => e.LEC_INI == element["LECTURA INICIAL"]);
        if (Index >= 0) {
          e.LEC_FIN = this.data[Index]["LECTURA FINAL"];
        }
        if (Index == -1) {
          e.LEC_FIN = e.LEC_INI;
        }
      });
      //console.log(JSON.stringify(this.LecturasIniciales))
    }
  }

  fileChangeDominus(file: any) {
    let data = [];
    const fileReader = new FileReader();
    fileReader.readAsText(file.target.files[0])
    fileReader.onload = (e: any) => {      
      this.txt = fileReader.result;
      this.lines = this.txt.split('\n');
      let NumCierre = '';
      let NumSurtidor = '';
      let NumCierre2 = '';
      let NumSurtidor2 = '';
      let cierres = [];
      let LectIni = '';
      let LectFin = '';
      for (var linea of this.lines) {
        if (linea.includes("SURTIDOR:")) {          
          NumSurtidor = linea.replace(/[^0-9]+/g, "");
          NumSurtidor2 = linea.replace(/[^0-9]+/g, "");
        }
        if (linea.includes("CIERRE:")) {        
          NumCierre = linea.replace(/[^0-9]+/g, "");
          NumCierre2 = linea.replace(/[^0-9]+/g, "");
        }
        if (linea.includes("Ini:")) {
          LectIni = linea.substring(19, linea.length).trim().replace(/[^0-9]+/g, "");
        }
        if (linea.includes("Fin:")) {
          LectFin = linea.substring(19, linea.length).trim().replace(/[^0-9]+/g, "");
        }

        if (NumCierre.length > 0 && NumSurtidor.length > 0) {
          let IndexSurtidor
          if (data.length > 0) {
            IndexSurtidor = data.findIndex((e) => e.surtidor.toString() == NumSurtidor)
            if (IndexSurtidor >= 0) {
              data[IndexSurtidor].cierres.push({
                "cierreNum": NumCierre, "lecturas": []
              })
              data[IndexSurtidor].cierres2.push(NumCierre)
            }
            if (IndexSurtidor <= -1) {
              data.push(
                {
                  "surtidor": NumSurtidor, "cierres2": [NumCierre], "cierres": [{ "cierreNum": NumCierre, "lecturas": [] }]
                })
              NumCierre = '';
              NumSurtidor = '';
            }
            NumCierre = '';
            NumSurtidor = '';
          } else {
            data.push(
              {
                "surtidor": NumSurtidor, "cierres2": [NumCierre], "cierres": [{ "cierreNum": NumCierre, "lecturas": [] }]
              })
            NumCierre = '';
            NumSurtidor = '';
          }

        }

        if (LectIni.length > 0 && LectFin.length > 0 && NumCierre2.length > 0 && NumSurtidor2.length > 0) {
          let IndexSurtidor = data.findIndex((e) => e.surtidor.toString() == NumSurtidor2)
          let IndexCierre = data[IndexSurtidor].cierres.findIndex((e) => e.cierreNum.toString() == NumCierre2)


          if (IndexSurtidor >= 0 && IndexCierre >= 0) {
            data[IndexSurtidor].cierres[IndexCierre].lecturas.push({
              "LEC_INI": LectIni.substring(0, LectFin.length - 3) + '.' + LectIni.substring(LectIni.length - 3, LectIni.length),
              "LEC_FIN": LectFin.substring(0, LectFin.length - 3) + '.' + LectFin.substring(LectFin.length - 3, LectFin.length)
            })
          }
          LectIni = '';
          LectFin = '';
        }

      }

      let cantSur = 0;
      let cierreMayor;
      let cierreMenor;
      let indexCierreMayor;
      let indexCierreMenor; 
      let cantidadLecturas;
      let data2 = [];
      data.forEach((e) => { 
        cierreMayor = Math.max(...e.cierres2);
        cierreMenor = Math.min(...e.cierres2); 
        if (e.cierres2.length > 1) {                   
          indexCierreMayor = data[cantSur].cierres.findIndex((e) => e.cierreNum == cierreMayor)
          indexCierreMenor = data[cantSur].cierres.findIndex((e) => e.cierreNum == cierreMenor)
          cantidadLecturas = 0;

          data[cantSur].cierres[indexCierreMayor].lecturas.forEach((e) => {
            
            e.LEC_INI = data[cantSur].cierres[indexCierreMenor].lecturas[cantidadLecturas].LEC_INI;
            data2.push({
              "LEC_INI": e.LEC_INI,
              "LEC_FIN": e.LEC_FIN
            })
            cantidadLecturas++
          })
          cantidadLecturas=0; 
        }

        if (e.cierres2.length == 1) {
            e.cierres[data[cantSur].cierres.findIndex((e) => e.cierreNum == cierreMayor)].lecturas.forEach((l) => {
              data2.push({
                "LEC_INI": l.LEC_INI,
                "LEC_FIN": l.LEC_FIN
              })
            })
        }                
        cantSur++
      })
      //console.log("data2: ",JSON.stringify(data2))

      this.LecturasIniciales.forEach((e) => {
        let Index = data2.findIndex((element) => e.LEC_INI.toString().includes(element.LEC_INI.toString().substring(0,element.LEC_INI.length-4)));
        
        if (Index >= 0) {
          e.LEC_FIN = data2[Index].LEC_FIN;
        }
        if (Index == -1) {
          e.LEC_FIN = e.LEC_INI;
        }
      }); 
      
    }
  }

  GetDatosCalendario() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: ['enero ', 'febrero ', 'marzo ', 'abril ', 'mayo ', 'junio', 'julio ', 'agosto ', 'septiembre ', 'octubre ', 'noviembre ', 'diciembre '],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };

  }

  GetEstaciones() {
    this._NominaService.GetStations().subscribe(data => {
      this.stationsAll = data;
      if (this.stationCode) {
        this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
        this.TurnosEstacion = this.stationSel.turno;
      }
    }, error => console.error(error.error.message));
  }
  CambiaEstacion() {
    this.TurnosEstacion = this.stationSel.turno;
    //this.Agregar();
    this.GetTurnos(this.stationSel.idEstacion);

  }
  GetLecturasIniciales(idEstacion: number, Fecha: Date, Turno: Number) {
    if (idEstacion === null) {
      return;
    }
    if (idEstacion === undefined) {
      return;
    }
    if (Turno === null) {
      return;
    }
    if (Turno === undefined) {
      return;
    }
    if (Turno === 0) {
      return;
    }
    this.LecturasIniciales = [];
    this._NominaService.getLectInicial(idEstacion, Fecha, Turno).subscribe(data => {
      this.LecturasIniciales = data;
      this.estadoLecturas = false;
    }, error => {
      this.estadoLecturas = true;
      this.data = []
      this.cuadroDialogo.showMsg('warn', 'Advertencia', error.error.message)
    });
  }

  GetTurnos(idEstacion: number) {
    if (!idEstacion) {
      return;
    }
    this._NominaService.getTurnos(idEstacion).subscribe(data => {
      this.TurnosEstacion = data[0].turno;
      let i = 1;
      this.Turnos = [];
      while (i <= this.TurnosEstacion) {
        this.Turnos.push({
          id: i,
          Value: 'Turno ' + i
        });
        i = i + 1;
      }
    }, error => console.error(error.error.message));
  }
  Agregar() {
    this.GetLecturasIniciales(this.stationSel.idEstacion, this.Fecha, this.TurnoSel.id);
  }

  Limpiar() {
    if (this.ResetFileReaderTerpel !== undefined) {
      this.ResetFileReaderTerpel.nativeElement.value = '';
    }
    if (this.ResetFileReaderDominus !== undefined) {
      this.ResetFileReaderDominus.nativeElement.value = '';
    }
    this.estadoLecturas = true;
    this.LecturasIniciales = [];
  }

  Guardar() {
    let Contador: number = 0;
    let mensaje: string = 'MANGUERAS SIN LECTURA FINAL : ';
    this.LecturasIniciales.forEach(element => {
      if (element.LEC_FIN === null) {
        Contador++;
        mensaje += element.DETALLE_MAG + ', ';
      }
    });
    if (Contador > 0) {
      Swal.fire(
        '¡FALTAN LECTURAS!',
        mensaje,
        'error'
      );
      return;
    }
    Swal.fire({
      title: '¿ESTA SEGURO QUE DESEA GUARDAR?',
      text: 'Le recordamos que antes de guardar debe verificar que las lecturas sean correctas, recuerde que una vez las guarde no podrá modificarlas, ¿Desea Continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        const Datos = {
          idEstacion: this.stationSel.idEstacion,
          fecha: this.Fecha,
          turno: this.TurnoSel.id,
          lecturas: this.LecturasIniciales
        };
        this._NominaService.InsertCpl(Datos).subscribe(data => {
          Swal.fire(
            '¡LECTURAS GUARDADAS!',
            'Las Lecturas fueron registradas correctamente',
            'success'
          );
          this.Limpiar();
        }, error => {
          Swal.fire(
            'NO SE GUARDÓ',
            error.error.message,
            'error'
          );
        });
      }
    });

  }

}
