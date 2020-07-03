import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { CarteraService } from '../../../../services/cartera.service';
import { EntStation } from '../../../../Class/EntStation';
import { meses } from '../../../../util/util-lib';

@Component({
    selector: 'app-reportes-canastilla',
    templateUrl: './reportes-canastilla.component.html',
    styleUrls: ['./reportes-canastilla.component.css']
})
export class ReportesCanastillaComponent implements OnInit {
    types = [{ id: 0, text: 'Estaciones' }];
    typeSel;
    stations: EntStation[];
    stationSel: EntStation;
    date: string;
    meses = meses;
    FechaIni: Date = new Date;
    FechaFin: Date = new Date;
    es: any;
    treeParams = [
        { id: 0, text: 'Ventas Diarias', report: 'Administracion/RPT_VENTAS_DIARIAS', width: 120 },
        { id: 1, text: 'Ventas Mensual', report: 'Administracion/RPT_VENTAS_MENSUALES', width: 120 },
        { id: 2, text: 'Compras', report: 'Administracion/RPT_PRODUCTOS_COMPRAS', width: 120 },
        { id: 3, text: 'Consolidado', report: 'Administracion/RPT_PRODUCTOS_CONSO_X_RANG_FECHA', width: 120 },
        { id: 4, text: 'Traslados', report: 'Administracion/RPT_PRODUCTOS_TRASLADOS', width: 100 },
        { id: 5, text: 'Bajas', report: 'Administracion/RPT_PRODUCTOS_BAJAS', width: 100 },
        { id: 6, text: 'Lista de Precios', report: 'Administracion/RPT_PRODUCTOS_LISTA_DE_PRECIOS', width: 100 }
        // {
        //   id: 2, text: 'Ventas Por Surtidor', typeChild: 'TIPO', child: [
        //     { id: 'L', text: 'Liquidos' },
        //     { id: 'G', text: 'Gas' }
        //   ],
        //   report: 'Administracion/RPT_SURTIDOR', width: 100
        // },
        // {
        //   id: 4, text: 'Tanques - Control Diario', typeChild: 'TIPO', child: [
        //     { id: 1, text: 'Corriente' },
        //     { id: 2, text: 'Extra' },
        //     { id: 3, text: 'ACPM' }
        //   ],
        //   report: 'Administracion/RPT_TANQUE', width: 100
        // },
        // { id: 5, text: 'Variaciones Totales', report: 'Administracion/RPT_VARIACION', width: 92 },
        // { id: 6, text: 'Balance de gas', report: 'Administracion/RPT_BALANCE_GAS', width: 100 },
        // {
        //   id: 7, text: 'Mayoristas', typeChild: 'TIPO', child: [
        //     { id: true, text: 'Pendiente' },
        //     { id: false, text: 'Todo' }
        //   ]
        // },
        // { id: 8, text: 'Mayoristas Resumen', report: 'Administracion/RPT_MAYORISTA', width: 100 },
        // { id: 9, text: 'Control de mayoristas', report: 'Administracion/RPT_PEDIDO_COMBUSTIBLE', width: 87 },
        // { id: 10, text: 'Certificación Mes', report: 'Administracion/RPT_CIERRE_MES', width: 100 }
    ];
    paramSel;
    opcSel;
    params: any[];
    showReport = false;
    nameReport;
    widthReport;
    stationCod;
    eventSearch = true;
    Mostrar = true;

    constructor(
        private nominaService: NominaService,
        private carteraService: CarteraService,
        private principal: PrincipalComponent,
        private utilService: UtilService,
        private storageService: StorageService,
        private title: Title
    ) {
        this.stationCod = this.storageService.getCurrentStation();
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['Enero ', 'Febrero ', 'Marzo ', 'Abril ', 'Mayo ', 'Junio', 'Julio ', 'Agosto ', 'Septiembre ', 'Octubre ', 'Noviembre ', 'Diciembre '],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
    }

    ngOnInit() {
        this.basicData();
    }

    basicData() {
        this.utilService.loader();
        this.nominaService.GetStations().subscribe(res => {
            this.utilService.loader(false);
            this.stations = res;
            if (this.stationCod) {
                this.stationSel = res.find(e => e.idEstacion == this.stationCod);
            }
        }, error => {
            this.utilService.loader(false);
            console.log(error);
            this.principal.showMsg('error', 'Error', error.error.message);
        });
        this.typeSel = this.types[0];
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

    getInformeTurno() {
        // this.carteraService.getRptTurno
    }

    stringReport($element) {
        if (!this.valid) {
            return;
        }
        switch (this.paramSel.id) {
            case 0:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'FechaIncial']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'FechaFinal']);
                this.params.push([null, 'IdProducto']);
                break;
            case 1:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'IdEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'FechaInicial']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'FechaFinal']);
                this.params.push([null, 'IdProducto']);
                break;
            case 2:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fechaIni']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'fechaFin']);
                break;
            case 3:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fecha']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'FechaFinal']);
                break;
            case 4:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fechaIni']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'FechaFin']);
                break;
            case 5:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'idEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'fechaIni']);
                this.params.push([this.FormatoFecha(this.FechaFin), 'fechaFin']);
                break;
            case 6:
                this.params = [];
                this.params.push([this.stationSel.idEstacion, 'IdEstacion']);
                this.params.push([this.FormatoFecha(this.FechaIni), 'Fecha']);
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

    get valid() {
        if (this.paramSel && this.FechaIni) {
            if (this.paramSel.child && this.paramSel.child.length > 0) {
                return this.opcSel != null ? true : false;
            }
            return true;
        }
        return false;
    }

    clear() {
        this.opcSel = null;
        this.typeSel = this.types[0];
        this.paramSel = null;
        this.date = null;
        if (this.stationCod == null) {
            this.stationSel = null;
        }
    }

    changeReport() {
        switch (this.paramSel.id) {
            case 0:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Canastillas - Simovil');
                this.Mostrar = this.paramSel.id !== 1;
                break;
            case 1:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Canastillas - Simovil');
                this.Mostrar = this.paramSel.id !== 1;
                break;
            case 2:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Canastillas - Simovil');
                this.Mostrar = this.paramSel.id !== 2;
                break;
            case 3:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Canastillas - Simovil');
                this.Mostrar = this.paramSel.id !== 3;
                break;
            case 4:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Canastillas - Simovil');
                this.Mostrar = this.paramSel.id !== 4;
                break;
            case 5:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Reportes Bajas - Simovil');
                this.Mostrar = this.paramSel.id !== 5;
                break;
            case 6:
                this.opcSel = null;
                this.title.setTitle(this.paramSel ? this.paramSel.text : 'Lista de Precios - Simovil');
                this.Mostrar = this.paramSel.id == 6;
                break;
            default:

        }
    }

    FormatoFecha(fecha: Date): string {
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (fecha.getDate());
    }
}
