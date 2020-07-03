import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../services/storage.service';
import { EntCplLecturasIniciales } from '../../../Class/EntCplLecturasIniciales';
import { until } from 'protractor';
import { PrincipalComponent } from '../../../principal/principal.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
    selector: 'app-ingreso-lecturas',
    templateUrl: './ingreso-lecturas.component.html',
    styleUrls: ['./ingreso-lecturas.component.css']
})
export class IngresoLecturasComponent implements OnInit {
    es;
    stationsAll: EntStation[];
    stationCode;
    stationSel;
    LecturasIniciales: EntCplLecturasIniciales[];
    TurnosEstacion: number;
    Turnos = [];
    TurnoSel = { id: 0, Value: '' };
    Fecha = new Date();
    totalGalones: number = 0;
    totalPesos: number = 0;
    constructor(
        private _NominaService: NominaService,
        private title: Title,
        private _storageService: StorageService,
        private cuadroDialogo: PrincipalComponent


    ) { }

    ngOnInit() {
        this.GetDatosCalendario();
        this.GetEstaciones();
        this.title.setTitle('Cpl  - Simovil');
        this.stationCode = this._storageService.getCurrentStation();
        this.GetTurnos(this.stationCode);
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

    sumarTotales() {
        this.totalGalones = 0;
        this.totalPesos = 0;
        this.LecturasIniciales.forEach(Lectura => {
           if (Lectura.CANTIDAD !== undefined) {
            this.totalGalones += Lectura.CANTIDAD;
            this.totalPesos += Lectura.CANTIDAD * Lectura.PRECIO;
           }

        });
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
        this.Agregar();
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
        }, error => this.cuadroDialogo.showMsg('warn', 'Advertencia', error.error.message));
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

    Guardar(Lecturas) {
        let Contador: number = 0;
        let mensaje: string = 'MANGUERAS SIN LECTURA FINAL : ';
        Lecturas.forEach(element => {
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
                    lecturas: Lecturas
                };
                this._NominaService.InsertCpl(Datos).subscribe(data => {
                    Swal.fire(
                        '¡LECTURAS GUARDADAS!',
                        'Las Lecturas fueron registradas correctamente',
                        'success'
                    );
                    this.LecturasIniciales = [];
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
    Onkey(event) {
        console.log(event);
    }
}

