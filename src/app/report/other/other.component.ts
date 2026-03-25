import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NominaService } from '../../services/nomina.service';
import { EntStation } from '../../Class/EntStation';
import { PrincipalComponent } from '../../principal/principal.component';
import { UtilService } from '../../services/util.service';
import { CarteraService } from '../../services/cartera.service';
import { fadeTransition } from '../../routerAnimation';
import { meses } from '../../util/util-lib';
import { StorageService } from '../../services/storage.service';
import { Title } from '@angular/platform-browser';
/* import { ConsoleReporter } from 'jasmine'; */

@Component({
    selector: 'app-other',
    templateUrl: './other.component.html',
    styleUrls: ['./other.component.css'],
    animations: [fadeTransition()]
})
export class OtherComponent implements OnInit {

    @ViewChild('mes_01') mes_01: ElementRef;
    @ViewChild('mes_02') mes_02: ElementRef;
    @ViewChild('mes_03') mes_03: ElementRef;
    @ViewChild('mes_04') mes_04: ElementRef;
    @ViewChild('mes_05') mes_05: ElementRef;
    @ViewChild('mes_06') mes_06: ElementRef;
    @ViewChild('mes_07') mes_07: ElementRef;
    @ViewChild('mes_08') mes_08: ElementRef;
    @ViewChild('mes_09') mes_09: ElementRef;
    @ViewChild('mes_10') mes_10: ElementRef;
    @ViewChild('mes_11') mes_11: ElementRef;
    @ViewChild('mes_12') mes_12: ElementRef;
    /* types = [{ id: 0, text: 'Estaciones' }]; */
    /* typeSel: any; */
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
                { id: 3, text: 'ACPM' },
                { id: 4, text: 'SUPREME' }
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
        { id: 10, text: 'Certificación Mes', report: 'Administracion/RPT_CIERRE_MES', width: 100 },
        { id: 11, text: 'Total ventas diarias de canastilla', report: 'canastilla/RPT_TotalVentasDiarias', width: 100}
    ];
    paramSel;
    opcSel;
    params: any[];
    showReport = false;
    nameReport;
    widthReport;
    stationCod;
    eventSearch = true;
    anual = [{id: 0, numero: 2019},
             {id: 1, numero: 2020},
             {id: 2, numero: 2021},
             {id: 3, numero: 2022},
             {id: 4, numero: 2023},
             {id: 5, numero: 2024},
             {id: 6, numero: 2025},
             {id: 7, numero: 2026},
             {id: 8, numero: 2027},
             {id: 9, numero: 2028},
             {id: 10, numero: 2029},
             {id: 11, numero: 2030},
             {id: 12, numero: 2031},
             {id: 13, numero: 2032},
             {id: 14, numero: 2033}
    ];
    anualBoolean: boolean = false;
    mesBoolean: boolean = false;
    yearSeleccionado;
    subconjuntoMeses;
    pilaMes: string[] = [];
    conjuntoMeses = [{id: '01', mes: 'Enero', estado: false},
                     {id: '02', mes: 'Febrero', estado: false},
                     {id: '03', mes: 'Marzo', estado: false},
                     {id: '04', mes: 'Abril', estado: false},
                     {id: '05', mes: 'Mayo', estado: false},
                     {id: '06', mes: 'Junio', estado: false},
                     {id: '07', mes: 'Julio', estado: false},
                     {id: '08', mes: 'Agosto', estado: false},
                     {id: '09', mes: 'Septiembre', estado: false},
                     {id: '10', mes: 'Octubre', estado: false},
                     {id: '11', mes: 'Noviembre', estado: false},
                     {id: '12', mes: 'Diciembre', estado: false},
                    ];
    openCalendario: boolean = false;
    banderaMes: boolean = false;

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

mesCheckedConEstilo(e: any){
    this.conjuntoMeses.find(meti => {
        if(meti.id == e.target.id && meti.estado == false){
            meti.estado = true;
            console.log('%c meti.estado: '+meti.estado, 'color: blue; font-weight: bold;');//b
            switch (e.target.id) {
                case '01':
                    this.mes_01.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '02':
                    this.mes_02.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '03':
                    this.mes_03.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '04':
                    this.mes_04.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '05':
                    this.mes_05.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '06':
                    this.mes_06.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '07':
                    this.mes_07.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '08':
                    this.mes_08.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '09':
                    this.mes_09.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '10':
                    this.mes_10.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '11':
                    this.mes_11.nativeElement.classList.add('decora_calendario_luz');
                    break;
                case '12':
                    this.mes_12.nativeElement.classList.add('decora_calendario_luz');
                    break;

                default:
                    break;
            }
        }

    });
}

mesCheckedSinEstilo(e: any){
    this.conjuntoMeses.find(meti =>{
        if(meti.id == e.target.id && meti.estado == true){
            meti.estado = false;
            console.log('%c meti.estado: '+meti.estado, 'color: blue; font-weight: bold;');//b
            switch (e.target.id) {
                case '01':
                    this.mes_01.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '02':
                    this.mes_02.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '03':
                    this.mes_03.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '04':
                    this.mes_04.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '05':
                    this.mes_05.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '06':
                    this.mes_06.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '07':
                    this.mes_07.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '08':
                    this.mes_08.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '09':
                    this.mes_09.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '10':
                    this.mes_10.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '11':
                    this.mes_11.nativeElement.classList.remove('decora_calendario_luz');
                    break;
                case '12':
                    this.mes_12.nativeElement.classList.remove('decora_calendario_luz');
                    break;

                default:
                    break;
            }
        }
    });
}

    addMes(mes: any, e: any){
        this.banderaMes = false;
        this.pilaMes.find(item => {
            if(item == mes){
                console.log('El mes: '+mes+', ¡ya está en la lista!');
                this.principal.showMsg('error', 'Información', 'El mes: '+mes+', ¡ya no está en la lista!');
                this.banderaMes = true;
                this.mesCheckedSinEstilo(e);
                this.pilaMes.splice(this.pilaMes.indexOf(mes), 1);
                console.log('%c pila mes: ['+this.pilaMes+']', 'color: yellow; background: #572364;');
            }
        });

        if(!this.banderaMes){
            this.pilaMes.push(mes)
            console.log('pila mes: ['+this.pilaMes+']');
            this.mesCheckedConEstilo(e);
        }

        console.log('%c pila mes: ['+this.pilaMes+']', 'color: yellow; background: purple;');
        this.subconjuntoMeses = this.pilaMes.toString();
    }

    openMsgInfo(){
        this.openCalendario = true;
    }

    closeMsgInfo(){
        this.openCalendario = false;
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
        /* this.typeSel = this.types[0]; */
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

    getBooleanos(){
        if(this.paramSel.id == 11){
            this.anualBoolean = true;
            this.mesBoolean = false;
        }

        if(this.paramSel.id != 11){
            this.anualBoolean = false;
            this.mesBoolean = true;
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

        if(this.paramSel.id == 11){
            this.params.push([this.stationSel.idEstacion, 'idEstacion']);
            this.params.push([this.yearSeleccionado, 'anyo']);
            this.params.push([this.subconjuntoMeses, 'meses']);
        }

        if(this.paramSel.id != 11){
            this.params.push([this.stationSel.idEstacion, 'ID_ESTACION']);
            this.params.push([this.date + '-01', 'FECHA']);
            // this.params.push([this.date + '-', 'FECHA_FINAL']);
        }

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
            //console.log('%c typeSel: '+JSON.stringify(this.typeSel), 'color: yellow; background: #581845;');//b

            /* if (this.typeSel && this.paramSel && this.stationSel && this.date) { */
            if (this.paramSel && this.stationSel) {
            if (this.paramSel.child && this.paramSel.child.length > 0) {
                return this.opcSel != null ? true : false;
            }
            return true;
        }
        return false;
    }

    clear() {
        this.opcSel = null;
        /* this.typeSel = this.types[0]; */
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
