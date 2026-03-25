import { EntCarteraCliente } from './../../../Class/EntCarteraCliente';
import { CarteraService } from './../../../services/cartera.service';
import { EntClient } from './../../../Class/EntClient';
import { EntTipoCupo } from './../../../Class/EntTipoCupo';
import { EntStationType } from './../../../Class/EntStationType';
import { NominaService } from './../../../services/nomina.service';
import { EntStation } from './../../../Class/EntStation';
import { PrincipalComponent } from './../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { dateToISOString, rangedate } from '../../../util/util-lib';
import { fadeTransition } from '../../../routerAnimation';
import { EntAnyos } from '../../../Class/EntAnyos';

@Component({
    selector: 'app-asociados',
    templateUrl: './asociados.component.html',
    styleUrls: ['./asociados.component.css'],
    animations: [fadeTransition()],
    standalone: false
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
            text: 'Cartera Resumen por Cliente',
            report: 'Administracion/RPT_CARTERA_RESUMEN_PORCLIENTE',
            width: 100,
        },
        {
            id: 2,
            text: 'Cartera Estación Detallado',
            report: 'Administracion/RPT_CARTERA_ESTACION_DETALLADO',
            width: 100,
        },
        /* {
            id: 3,
            text: 'Cartera Informe Resúmen',
            report: 'Administracion/RPT_CARTERA_INFORME_RESUMEN',
            width: 100,
        }, */
         {
            id: 4,
            text: 'Cartera Estaciones Clientes',
            report: 'Administracion/RPT_CARTERA_ESTACION',
            width: 100,
        },
         {
            id: 5,
            text: 'Consolidado Semanal Autotanques',
            report: 'Administracion/reporte_semanal_autotanques',
            width: 100,
        },
         {
            id: 6,
            text: 'Relación Consumos Facturación',
            report: 'cartera/RPT_RELACION_CONSUMOS_CARTERA2',
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

    anyos = [
        {idAnyo: 0, detalleAnyo: 2020},
        {idAnyo: 1, detalleAnyo: 2021},
        {idAnyo: 2, detalleAnyo: 2022},
        {idAnyo: 3, detalleAnyo: 2023},
        {idAnyo: 4, detalleAnyo: 2024},
        {idAnyo: 5, detalleAnyo: 2025},
        {idAnyo: 6, detalleAnyo: 2026},
        {idAnyo: 7, detalleAnyo: 2027},
        {idAnyo: 8, detalleAnyo: 2028},
         {idAnyo: 9, detalleAnyo: 2029},
        {idAnyo: 10, detalleAnyo: 2030},
        {idAnyo: 11, detalleAnyo: 2031},
        {idAnyo: 12, detalleAnyo: 2032},
        {idAnyo: 13, detalleAnyo: 2033},
        {idAnyo: 14, detalleAnyo: 2034},
        {idAnyo: 15, detalleAnyo: 2035},
        {idAnyo: 16, detalleAnyo: 2036},
        {idAnyo: 17, detalleAnyo: 2037}
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
    paramAnyo: EntAnyos;
    tipoCupos: EntTipoCupo[] = this.treeTipoCupos;
    nit: number = 860002566; //flota la Macarena
    /*elementos*/
    deEstacion: boolean = false;
    deTipoEstacion: boolean = false;
    deTipoCupo: boolean = false;
    deDesde: boolean = false;
    deHasta: boolean = false;
    deAnyo: boolean = false;
    /**********/
    clienteSel: EntClient;
    porEstacion: boolean;
    porTipoClientes: boolean;
    clientes: EntClient[];
    clientesDeCartera: EntCarteraCliente[];
    anyo: number;
    clienteSelCartera: EntCarteraCliente;

    constructor(
        private title: Title,
        private principal: PrincipalComponent,
        private nominaService: NominaService,
        private carteraService: CarteraService
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
            this.porTipoClientes = false;
            this.deTipoCupo = false;
            this.deAnyo = false;
            this.deDesde = true;
            this.deHasta = true;
        }
        if (this.paramSel.id == 1) {
            this.deEstacion = false;
            this.deTipoEstacion = false;
            this.deTipoCupo = true;
            this.deAnyo = false;
            this.deDesde = false;
            this.deHasta = false;
        }
        if (this.paramSel.id == 2) {
            this.deEstacion = true;
            this.deTipoEstacion = true;
            this.deTipoCupo = false;
            this.deAnyo = false;
            this.deDesde = true;
            this.deHasta = true;
        }

        if (this.paramSel.id == 3) {
            this.deEstacion = true;
            this.deTipoEstacion = false;
            this.porTipoClientes = false;
            this.deTipoCupo = true;
            this.deAnyo = false;
            this.deDesde = true;
            this.deHasta = true;
        }
        if(this.paramSel.id == 4){
            this.deEstacion = true;
            this.deTipoEstacion = false;
            this.porTipoClientes = false;
            this.deTipoCupo = false;
            this.deAnyo = false;
            this.deDesde = true;
            this.deHasta = true;
        }
        if(this.paramSel.id == 5){
            this.deEstacion = false;
            this.deTipoEstacion = false;
            this.porTipoClientes = false;
            this.deTipoCupo = false;
            this.deAnyo = false;
            this.deDesde = true;
            this.deHasta = true;
        }
        if(this.paramSel.id == 6){
            this.deEstacion = false;
            this.deTipoEstacion = false;
            this.deTipoCupo = true;
            this.deAnyo = false;
            this.deDesde = false;
            this.deHasta = false;
        }
    }

    activeEstacion(){
        if(this.paramSel.id == 1 && this.deTipoCupo == true){
            this.deEstacion = true;
            this.deAnyo = true;
        }
        if(this.paramSel.id == 1 && this.porTipoClientes == true){
            this.getClientesDeCartera();
        }
        if(this.paramSel.id == 6 && this.deTipoCupo == true){
            this.deEstacion = true;
            this.deDesde = true;
            this.deHasta = true;
        }
        if(this.paramSel.id == 6 && this.porTipoClientes == true){
            this.getClientesDeCartera();
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
        if(this.paramSel.id == 4){
            this.deTipoEstacion = false;
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

    get validaAnyo(){
        if(this.paramAnyo == undefined){
            return true;
        }else {
            return false;
        }
    }

    get validaTipoCliente(){
        if(this.tipoCupoSel == undefined){
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

    getAnyoValidado(){
        if(this.validaAnyo){
            this.principal.showMsg('error', 'Atención', 'Favor selecciones el año que requiere consultar porque está: '+ this.paramAnyo);
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

    getTipoDeClienteValidado() {
        if (this.validaTipoCliente) {
            this.principal.showMsg(
                'error',
                'Atención',
                'Favor seleccione el tipo de cliente que requiere consultar (C) crédito o (A) anticipo porque está: ' +
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

        if(this.paramSel.id == 1){
            this.getAnyoValidado();
        }

        if (this.paramSel.id == 1 || this.paramSel.id == 2 || this.paramSel.id == 3 || this.paramSel.id == 4 || this.paramSel.id == 6) {
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
            this.params.push([this.tipoCupoSel.idTipoCupo, 'TipoCupo']);
            this.params.push([this.stationSel.idEstacion, 'idEstacion']);
            this.params.push([this.clienteSelCartera.codCliente, 'codCliente']);console.log('códgigo cliente: '+this.clienteSelCartera.codCliente);
            this.params.push([this.paramAnyo.detalleAnyo, 'ANYO']);
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

        if (this.paramSel.id == 4) {
            this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
            this.params.push([this.dateIni, 'FECHA']);
            this.params.push([this.dateEnd, 'FECHA_FIN']);
        }

        if (this.paramSel.id == 5) {
            this.params.push([this.dateIni, 'FECHA']);
            this.params.push([this.dateEnd, 'FECHA_FIN']);
        }

        if (this.paramSel.id == 6) {
            this.params.push([this.clienteSelCartera.codCliente, 'codCliente']);
            console.log('códgigo cliente: '+this.clienteSelCartera.codCliente);
            this.params.push([this.stationSel.idEstacion, 'idEstacion']);
            this.params.push([this.dateIni, 'FechaIni']);
            this.params.push([this.dateEnd, 'FechaFin']);
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
        this.title.setTitle(this.paramSel ? this.paramSel.text : 'Informes Flota la Macarena - Simovil');
    }

    getClientes(){
        this.porEstacion = true;
        this.carteraService.getClientesConSaldosIniciales(this.stationSel.idEstacion).subscribe(data =>{
        this.clientes = data;
        if(this.stationSel.idEstacion){
        this.clienteSel = this.clientes.find(f => f.estacion == this.stationSel.idEstacion)
        }
        if(this.clientes.length == 0){
           console.log('Atención: Aún no hay clientes con saldo histórico para la estación:) '+this.stationSel.nombreEstacion);
           this.principal.showMsg('warn', 'Atención', 'Aún no hay clientes con saldo histórico para la estación: '+this.stationSel.nombreEstacion);
        }
    }, error => {
        console.log('Errores : ', error);
    })
  }

  getClientesDeCartera(){

      if(this.paramSel.id == 4 || this.paramSel.id == 3){
          return;
        }
      this.porTipoClientes = true;

      this.carteraService.getClientesDeCartera(this.stationSel.idEstacion, this.tipoCupoSel.idTipoCupo).subscribe(data =>{
      this.clientesDeCartera = data;
      if(this.stationSel.idEstacion){
        this.clienteSelCartera = this.clientesDeCartera.find(f => f.estacion == this.stationSel.idEstacion)
        }
        if(this.clientesDeCartera.length == 0){
           console.log('Atención: Aún no hay clientes '+this.tipoCupoSel.detalleTipoCupo+' con saldo histórico para la estación:) '+this.stationSel.nombreEstacion);
           this.principal.showMsg('warn', 'Atención', 'Aún no hay clientes '+this.tipoCupoSel.detalleTipoCupo+' con saldo histórico para la estación: '+this.stationSel.nombreEstacion);
        }
      }, error => {
          console.log('Errores: ', error);
      });

  }

}
