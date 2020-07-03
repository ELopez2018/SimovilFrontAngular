import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';

@Component({
    selector: 'app-report-lecturas',
    templateUrl: './report-lecturas.component.html',
    styleUrls: ['./report-lecturas.component.css']
})
export class ReportLecturasComponent implements OnInit {
    es;
    stationsAll: EntStation[];
    stationCode;
    stationSel;
    TurnoSel;
    PorTurno: boolean;
    Turnos = [];
    showReport = false;
    paramSel;
    opcSel;
    params: any[];
    nameReport;
    widthReport;
    eventSearch = true;
    reporteElegido = { id: 0, text: 'Seleccione el Reporte', report: null, width: 100 };
    Reportes = [
        { id: 1, text: 'Ventas por Turno', report: 'Administracion/RPT_CPL_DIARIA_POR_TURNO', width: 100 },
        { id: 2, text: 'Ventas por Día', report: 'Administracion/RPT_CPL_DIARIA_POR_DIA', width: 100 },
        { id: 3, text: 'Resumen por Turnos', report: 'Administracion/RPT_CPL_DIARIA_RESUMEN_POR_TURNOS', width: 100 },
        { id: 4, text: 'Resumen por Día', report: 'Administracion/RPT_CPL_DIARIA_RESUMEN_POR_DIA', width: 100 },
    ];
    FechaIni = new Date();
    constructor(
        private _NominaService: NominaService,
        private _storageService: StorageService
    ) {


    }

    ngOnInit() {
        this.GetDatosCalendario();
        this.GetEstaciones();
        this.reporteElegido = { id: 0, text: 'Seleccione el Reporte', report: null, width: 100 };
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
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    stringReport($element) {
        if (!this.valid) {
            return;
        }
        switch (this.paramSel.id) {
            case 1:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fecha']);
                this.params.push([this.TurnoSel.id, 'Turno']);
                console.log(this.params);
                break;
            case 2:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fecha']);
                break;
            case 3:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fecha']);
                break;
            case 4:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fecha']);
                break;
        }
        if (this.paramSel.child && this.paramSel.child.length > 0 && this.opcSel) {
            this.params.push([this.opcSel.id, this.paramSel.mtypeChild]);
        }
        this.nameReport = this.paramSel.report;
        this.widthReport = this.paramSel.width;
        this.showReport = true;
        setTimeout(() => {
            $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 300);
    }

    FormatoFecha(fecha: Date): string {
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (fecha.getDate());
    }
    getReport($element) {
        if (this.paramSel && this.paramSel.report) {
            this.stringReport($element);
        } else {
            this.eventSearch = !this.eventSearch;
            this.showReport = false;
            setTimeout(() => {
                $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }, 300);
        }
    }
    get valid() {
        if (this.paramSel && this.FechaIni) {
            if (this.paramSel.child && this.paramSel.child.length > 0) {
                return this.opcSel != null ? true : false;
            }
            return true;
        }
        return false;
    }
    GetTurnos() {
        const turnos = this.stationSel.turno;
        this.Turnos = [];
        let i = 1;
        while (i <= turnos) {
            this.Turnos.push({
                id: i,
                value: 'Turno ' + i
            });
            i = i + 1;
        }
    }
    TipodeReporte() {
        this.PorTurno = false;
        switch (this.paramSel.id) {
            case 1:
                this.PorTurno = true;
                this.GetTurnos();
                break;
            case 3:
                this.PorTurno = true;
                this.GetTurnos();
                break;
        }
    }
}
