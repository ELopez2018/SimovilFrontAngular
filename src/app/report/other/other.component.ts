import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../services/nomina.service';
import { EntStation } from '../../Class/EntStation';
import { PrincipalComponent } from '../../principal/principal.component';
import { UtilService } from '../../services/util.service';
import { CarteraService } from '../../services/cartera.service';
import { fadeTransition } from '../../routerAnimation';
import { meses } from '../../util/util-lib';
import { StorageService } from '../../services/storage.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-other',
    templateUrl: './other.component.html',
    styleUrls: ['./other.component.css'],
    animations: [fadeTransition()]
})
export class OtherComponent implements OnInit {

    types = [{ id: 0, text: 'Estaciones' }];
    typeSel: any;
    stations: EntStation[];
    stationSel: EntStation;
    date: string;
    meses = meses;
    treeParams = [
        { id: 0, text: 'Ventas Turnos Liquidos', report: 'Administracion/RPT_TURNOS_LIQUIDOS', width: 100 },
        { id: 1, text: 'Ventas Turnos Gas', report: 'Administracion/RPT_TURNOS_GNV', width: 100 },
        {
            id: 2, text: 'Ventas Por Surtidor', typeChild: 'TIPO', child: [
                { id: 'L', text: 'Liquidos' },
                { id: 'G', text: 'Gas' }
            ],
            report: 'Administracion/RPT_SURTIDOR', width: 100
        },
        {
            id: 4, text: 'Tanques - Control Diario', typeChild: 'TIPO', child: [
                { id: 1, text: 'Corriente' },
                { id: 2, text: 'Extra' },
                { id: 3, text: 'ACPM' }
            ],
            report: 'Administracion/RPT_TANQUE', width: 100
        },
        { id: 5, text: 'Variaciones Totales', report: 'Administracion/RPT_VARIACION', width: 92 },
        { id: 6, text: 'Balance de gas', report: 'Administracion/RPT_BALANCE_GAS', width: 100 },
        {
            id: 7, text: 'Mayoristas', typeChild: 'TIPO', child: [
                { id: true, text: 'Pendiente' },
                { id: false, text: 'Todo' }
            ]
        },
        { id: 8, text: 'Mayoristas Resumen', report: 'Administracion/RPT_MAYORISTA', width: 100 },
        { id: 9, text: 'Control de mayoristas', report: 'Administracion/RPT_PEDIDO_COMBUSTIBLE', width: 75 },
        { id: 10, text: 'Certificación Mes', report: 'Administracion/RPT_CIERRE_MES', width: 100 }
    ];
    paramSel;
    opcSel;
    params: any[];
    showReport = false;
    nameReport;
    widthReport;
    stationCod;
    eventSearch = true;

    constructor(
        private nominaService: NominaService,
        private principal: PrincipalComponent,
        private utilService: UtilService,
        private storageService: StorageService,
        private title: Title
    ) {
        this.stationCod = this.storageService.getCurrentStation();
        this.basicData();
    }

    ngOnInit() {

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
    Prueba() {
        console.log(this.stationSel);
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
        this.params = [];
        this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
        this.params.push([this.date + '-01', 'FECHA']);
        // this.params.push([this.date + '-', 'FECHA_FINAL']);
        if (this.paramSel.child && this.paramSel.child.length > 0 && this.opcSel) {
            this.params.push([this.opcSel.id, this.paramSel.typeChild]);
        }
        this.nameReport = this.paramSel.report;
        this.widthReport = this.paramSel.width;
        this.showReport = true;
        setTimeout(() => {
            $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 300);
    }

    get valid() {
        if (this.typeSel && this.paramSel && this.stationSel && this.date) {
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
        this.opcSel = null;
        this.title.setTitle(this.paramSel ? this.paramSel.text : 'Informes Otros - Simovil');
    }

}
