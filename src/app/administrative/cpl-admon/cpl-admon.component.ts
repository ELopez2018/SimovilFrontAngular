import { Component, OnInit } from '@angular/core';
import { EntAdtvaDatosEstaciones } from '../../Class/EntAdtvaDatosEstaciones';
import { NominaService } from '../../services/nomina.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-cpl-admon',
  templateUrl: './cpl-admon.component.html',
  styleUrls: ['./cpl-admon.component.css']
})
export class CplAdmonComponent implements OnInit {
  stationCode;
  stationsAll: EntAdtvaDatosEstaciones[];
  stationSel;
  verReporteMod: boolean = false;
  showReport: boolean = false;
  boolNovelty = false;
  widthReport: number;
  params:  any[];
  nameReport: string;
  constructor(
    public _NominaService: NominaService,
    public _storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.GetEstaciones();
  }
  GetEstaciones() {
    this.stationCode = this._storageService.getCurrentStation();
    this._NominaService.GetDatosCplAdtiva().subscribe(data => {
      this.stationsAll = data;
    }, error => console.error(error.error.message));
  }

  VerModal(Estacion: any) {
    this.showReport = true;
    this.nameReport = 'Administracion/RPT_CPL_DIARIA_RESUMEN_POR_TURNOS';
    this.widthReport = 120;
    this.params = [];
    this.params.push([Estacion.IDESTACION, 'idEstacion']);
    this.params.push([this.FormatoFecha(Estacion.FECHAULTIMOREG), 'fecha']);
    this.verReporteMod = this.showReport;
  }
  FormatoFecha(fecha: Date): string {
    fecha = new Date(fecha);
    return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (fecha.getDate());
  }
}
