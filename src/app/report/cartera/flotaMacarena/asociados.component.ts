import { EntTipoCupo } from './../../../Class/EntTipoCupo';
import { EntStationType } from './../../../Class/EntStationType';
import { NominaService } from './../../../services/nomina.service';
import { EntStation } from './../../../Class/EntStation';
import { PrincipalComponent } from './../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { dateToISOString, rangedate } from '../../../util/util-lib';
import { fadeTransition } from '../../../routerAnimation';

@Component({
    selector: 'app-asociados',
    templateUrl: './asociados.component.html',
    styleUrls: ['./asociados.component.css'],
    animations: [fadeTransition()],
})
export class AsociadosComponent implements OnInit {
    opcSel;
    paramSel;
    treeParams = [
        {
            id: 0,
            text: 'Consumos Asociados Flota la Macarena',
            report: 'Administracion/RPT_CONSUMOSASOCIADOSMACARENA',
            width: 100,
        },
        {
            id: 1,
            text: 'Cartera Estaciones Clientes',
            report: 'Administracion/RPT_CARTERA_ESTACION',
            width: 100,
        },
        {
            id: 2,
            text: 'Cartera Estación Detallado',
            report: 'Administracion/RPT_CARTERA_ESTACION_DETALLADO',
            width: 100,
        },
        {
            id: 3,
            text: 'Cartera Informe Resúmen',
            report: 'Administracion/RPT_CARTERA_INFORME_RESUMEN',
            width: 100,
        },
    ];
    treeTiposEstaciones = [
        { idTipoEstacion: 1, detalleTipoEstacion: 'GAS' },
        { idTipoEstacion: 2, detalleTipoEstacion: 'LIQUIDOS' },
    ];
    treeTipoCupos = [
        { idTipoCupo: 1, detalleTipoCupo: 'CREDITO' },
        { idTipoCupo: 2, detalleTipoCupo: 'ANTICIPO' },
    ];

    dateIni: string;
    dateL: Date[];
    dateEnd: string;
    lastQuery;
    params: any[];
    showReport = false;
    nameReport;
    widthReport;
    eventSearch = true;
    stationSel: EntStation;
    stations: EntStation[];
    tipoEstacionSeleccionada: EntStationType;
    tipoDeEstaciones: EntStationType[] = this.treeTiposEstaciones;
    tipoCupoSel: EntTipoCupo;
    tipoCupos: EntTipoCupo[] = this.treeTipoCupos;
    nit: number = 860002566; //flota la Macarena
    /*elementos*/
    deEstacion: boolean = false;
    deTipoEstacion: boolean = false;
    deTipoCupo: boolean = false;

    constructor(
        private title: Title,
        private principal: PrincipalComponent,
        private nominaService: NominaService
    ) {
        this.dateL = rangedate(dateToISOString(new Date()), 1);
    }

    ngOnInit() {
        this.dateIni = dateToISOString(this.dateL[0]);
        this.dateEnd = dateToISOString(this.dateL[1]);
        this.getEstaciones();
    }

    getEstaciones() {
        this.nominaService.GetStations().subscribe(
            (res) => {
                this.stations = res;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getElementos() {
        if (this.paramSel.id == 0) {
            this.deEstacion = false;
            this.deTipoEstacion = false;
            this.deTipoCupo = false;
        }
        if (
            this.paramSel.id == 1
        ) {
            this.deEstacion = true;
            this.deTipoEstacion = false;
            this.deTipoCupo = false;
        }
        if (this.paramSel.id == 2) {
            this.deEstacion = true;
            this.deTipoEstacion = true;
            this.deTipoCupo = false;
        }

        if (this.paramSel.id == 3) {
            this.deEstacion = true;
            this.deTipoEstacion = false;
            this.deTipoCupo = true;
        }
    }

    getTipoEstacion() {
        if (this.paramSel.id == 2) {
            this.deTipoEstacion = true;
            console.log(
                'ha seleccionado el tipo de estación: ' +
                    this.tipoEstacionSeleccionada
            );
        }
    }

    getTipoCupo() {
        if (this.paramSel.id == 3) {
            this.deTipoCupo = true;
            console.log('ha seleccionado el tipo de cupo: ' + this.tipoCupoSel);
        }
    }

    get validSearch() {
        if (this.paramSel) {
            return true;
        } else {
            return false;
        }
    }

    get validaEstacion() {
        if (this.stationSel == undefined) {
            return true;
        } else {
            return false;
        }
    }

    get validaTipoEstacion() {
        if (this.tipoEstacionSeleccionada == undefined) {
            return true;
        } else {
            return false;
        }
    }

    get validaTipoCupo() {
        if (this.tipoCupoSel == undefined) {
            return true;
        } else {
            return false;
        }
    }

    getIdLetraTipoDeEstacion() {
        if (this.tipoEstacionSeleccionada.idTipoEstacion == 1) {
            return 'G';
        }
        if (this.tipoEstacionSeleccionada.idTipoEstacion == 2) {
            return 'L';
        }
    }

    getEstacionValidada() {
        if (this.validaEstacion) {
            this.principal.showMsg(
                'error',
                'Atención',
                'Favor seleccione la estación que requiere consultar porque está: ' +
                    this.stationSel
            );
            return;
        }
    }

    getTipoEstacionValidada() {
        if (this.validaTipoEstacion) {
            this.principal.showMsg(
                'error',
                'Atención',
                'Favor seleccione el tipo de estación que requiere consultar (G) GAS o (L) LIQUIDOS porque está: ' +
                    this.tipoEstacionSeleccionada
            );
            return;
        }
    }

    getTipoDeCupoValidado() {
        if (this.validaTipoCupo) {
            this.principal.showMsg(
                'error',
                'Atención',
                'Favor seleccione el tipo de cupo que requiere consultar (C) crédito o (A) anticipo porque está: ' +
                    this.tipoCupoSel
            );
            return;
        }
    }

    getReport($element) {
        if (!this.validSearch) {
            this.principal.showMsg(
                'info',
                'Atención',
                'Aún tiene campos por diligenciar, ' +
                    'Favor seleccione el nombre del reporte: ' +
                    this.paramSel
            );
            return;
        }

        if (
            this.paramSel.id == 1 || this.paramSel.id == 2 || this.paramSel.id == 3
        ) {
            this.getEstacionValidada();
        }

        if (this.paramSel.id == 2) {
            this.getTipoEstacionValidada();
        }

        if (this.paramSel.id == 3) {
            this.getTipoDeCupoValidado();
        }

        if (this.paramSel && this.paramSel.report) {
            this.stringReport($element);
        } else {
            this.eventSearch = !this.eventSearch;
            this.showReport = false;
            setTimeout(() => {
                $element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                });
            }, 300);
        }
    }

    stringReport($element) {
        if (!this.valid) {
            return;
        }
        this.params = [];
        if (this.paramSel.id == 0) {
            this.params.push([this.nit, 'ORGANIZACION_ID']);
            this.params.push([this.dateIni, 'FECHAINI']);
            this.params.push([this.dateEnd, 'FECHAFIN']);
        }

        if (this.paramSel.id == 1) {
            this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
            this.params.push([this.dateIni, 'FECHA']);
            this.params.push([this.dateEnd, 'FECHA_FIN']);
        }

        if (this.paramSel.id == 2) {
            this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
            this.params.push([this.dateIni, 'FECHA']);
            this.params.push([this.dateEnd, 'FECHA_FIN']);
            this.params.push([this.getIdLetraTipoDeEstacion(), 'TIPO']);
        }

        if (this.paramSel.id == 3) {
            this.params.push([this.stationSel.idEstacion, 'IDESTACION']);
            this.params.push([2021, 'AÑOC']);
            this.params.push([this.tipoCupoSel.idTipoCupo, 'TIPO_CUP']);
        }

        this.nameReport = this.paramSel.report;
        this.widthReport = this.paramSel.width;
        this.showReport = true;
        setTimeout(() => {
            $element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }, 300);
    }

    get valid() {
        if (this.paramSel && this.dateIni && this.dateEnd) {
            return true;
        }
        return false;
    }

    clear() {
        this.paramSel = null;
        this.dateIni = dateToISOString(this.dateL[0]);
        this.dateEnd = dateToISOString(this.dateL[1]);
    }

    changeReport() {
        this.opcSel = null;
        this.title.setTitle(
            this.paramSel
                ? this.paramSel.text
                : 'Informes Flota la Macarena - Simovil'
        );
    }
}
