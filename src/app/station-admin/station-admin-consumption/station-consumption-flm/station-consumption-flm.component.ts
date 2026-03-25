import { EntCreditDescuento } from './../../../Class/EntCreditDescuento';
import { EntDiscount } from './../../../Class/EntDiscount';
import { CarteraService } from './../../../services/cartera.service';
import { UtilService } from './../../../services/util.service';
import { PrincipalComponent } from './../../../principal/principal.component';
import { EntConsumoFLM } from './../../../Class/EntConsumoFLM';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as XLSX from 'xlsx'

@Component({
    selector: 'app-station-consumption-flota-macarena',
    templateUrl: './station-consumption-flm.component.html',
    styleUrls: ['./station-consumption-flm.component.css'],
})
export class StationConsumptionFLMComponent implements OnInit {
    @Output() submiter = new EventEmitter<EntConsumoFLM>();
    //data  = [{"Recibo":63,"Fecha":"2021-03-09 21:50:40","Cliente":"FLOTA LA MACARENA","Placa":"SOC941","Producto":"DIESEL","Cantidad":5,"Total":42750},{"Recibo":62,"Fecha":"2021-03-09 20:55:36","Cliente":"FLOTA LA MACARENA","Placa":"UPR561","Producto":"DIESEL","Cantidad":10,"Total":85500},{"Recibo":61,"Fecha":"2021-03-09 20:22:07","Cliente":"FLOTA LA MACARENA","Placa":"TFX213","Producto":"CORRIENTE","Cantidad":9,"Total":77760},{"Recibo":60,"Fecha":"2021-03-09 20:04:17","Cliente":"FLOTA LA MACARENA","Placa":"TFX170","Producto":"CORRIENTE","Cantidad":9,"Total":77760},{"Recibo":105,"Fecha":"2021-03-09 19:05:41","Cliente":"FLOTA LA MACARENA","Placa":"SOQ516","Producto":"DIESEL","Cantidad":14.082,"Total":120401},{"Recibo":103,"Fecha":"2021-03-09 17:11:02","Cliente":"FLOTA LA MACARENA","Placa":"UPQ464","Producto":"DIESEL","Cantidad":10,"Total":85500},{"Recibo":59,"Fecha":"2021-03-09 14:48:00","Cliente":"FLOTA LA MACARENA","Placa":"TFX256","Producto":"CORRIENTE","Cantidad":7.878,"Total":68066},{"Recibo":101,"Fecha":"2021-03-09 14:23:54","Cliente":"FLOTA LA MACARENA","Placa":"SWP496","Producto":"DIESEL","Cantidad":17.446,"Total":149163},{"Recibo":58,"Fecha":"2021-03-09 14:05:05","Cliente":"FLOTA LA MACARENA","Placa":"TFX255","Producto":"CORRIENTE","Cantidad":6.189,"Total":53473},{"Recibo":57,"Fecha":"2021-03-09 13:36:05","Cliente":"FLOTA LA MACARENA","Placa":"TFX257","Producto":"CORRIENTE","Cantidad":8.503,"Total":73466},{"Recibo":100,"Fecha":"2021-03-09 13:22:15","Cliente":"FLOTA LA MACARENA","Placa":"WCW370","Producto":"DIESEL","Cantidad":10,"Total":85500},{"Recibo":99,"Fecha":"2021-03-09 10:59:52","Cliente":"FLOTA LA MACARENA","Placa":"SOQ524","Producto":"DIESEL","Cantidad":13.629,"Total":116528},{"Recibo":61,"Fecha":"2021-03-09 10:54:56","Cliente":"FLOTA LA MACARENA","Placa":"SVC151","Producto":"DIESEL","Cantidad":5,"Total":42750},{"Recibo":56,"Fecha":"2021-03-09 10:12:40","Cliente":"FLOTA LA MACARENA","Placa":"TFX224","Producto":"CORRIENTE","Cantidad":9,"Total":77760},{"Recibo":98,"Fecha":"2021-03-09 09:45:47","Cliente":"FLOTA LA MACARENA","Placa":"WYG694","Producto":"DIESEL","Cantidad":60,"Total":513000},{"Recibo":55,"Fecha":"2021-03-09 09:35:16","Cliente":"FLOTA LA MACARENA","Placa":"TFX187","Producto":"CORRIENTE","Cantidad":8.415,"Total":72706},{"Recibo":60,"Fecha":"2021-03-09 08:12:29","Cliente":"FLOTA LA MACARENA","Placa":"SQL790","Producto":"DIESEL","Cantidad":10,"Total":85500},{"Recibo":97,"Fecha":"2021-03-09 06:56:19","Cliente":"FLOTA LA MACARENA","Placa":"SMN285","Producto":"DIESEL","Cantidad":13.582,"Total":116126},{"Recibo":59,"Fecha":"2021-03-09 05:49:30","Cliente":"FLOTA LA MACARENA","Placa":"TFW646","Producto":"DIESEL","Cantidad":8,"Total":68400},{"Recibo":94,"Fecha":"2021-03-09 05:15:34","Cliente":"FLOTA LA MACARENA","Placa":"SOD352","Producto":"DIESEL","Cantidad":12,"Total":102600},{"Recibo":58,"Fecha":"2021-03-09 04:45:46","Cliente":"FLOTA LA MACARENA","Placa":"SYT057","Producto":"DIESEL","Cantidad":5,"Total":42750},{"Recibo":54,"Fecha":"2021-03-09 04:34:37","Cliente":"FLOTA LA MACARENA","Placa":"TFX171","Producto":"CORRIENTE","Cantidad":9,"Total":77760},{"Recibo":40,"Fecha":"2021-03-09 03:43:27","Cliente":"FLOTA LA MACARENA","Placa":"SOR370","Producto":"DIESEL","Cantidad":30,"Total":256500}];
    data = [];
    //data2: EntConsumoFLM[] = [];
    data2 = [];
    dtos: EntCreditDescuento[] = [];
    cero: number = 0;
    codEstacion: EntStation;
    idEstacion: number;
    usuarioEstacion: string;
    consumosAEnviar: EntConsumoFLM = new EntConsumoFLM();
    contadorErrores: number;
    txt;
    lines;
    resultado;
    headers;
    words;
    obj;
    estacionesTerpelPOS = [96, 94, 65, 11, 102];
    estacionesDominus = [92, 95, 61, 62, 98, 21];
    estacionesFuelControl = [91];

    constructor(
        private nominaService: NominaService,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService,
        private carteraService: CarteraService
    ) {
        this.usuarioEstacion = this.storageService.getCurrentUserDecode().Usuario;
        this.getIdEstacionConsumo();
    }

    ngOnInit(): void {

    }

    getIdEstacionConsumo() {
        this.nominaService.GetStations(this.storageService.getCurrentStation()
        ).subscribe(data => {
            this.codEstacion = data[0];
            this.idEstacion = this.codEstacion.idEstacion;
            console.log('ver id de estación:) ' + this.idEstacion + ', usuario: ' + this.usuarioEstacion);//b
        }, error => console.log(error));
    }

    llenarData2() {

        Object.assign(this.data2, this.data);
        this.partirFecha();
        this.addCampos();
        console.log(JSON.stringify(this.data2));
    }  

    /* add() {
        console.log('listo para recibir archivo.csv');//b
    } */

    dividirFecha(fechaADividir, separador, id) {
        var arrayDeFechas = fechaADividir.split(separador);
        for (var i = 0; i < arrayDeFechas.length; i++) {
            if (i == 0) {
                this.data2[id].Fecha = arrayDeFechas[i];
            }
            if (i == 1) {
                this.data2[id].hora = arrayDeFechas[i];
            }
        }
    }

    partirFecha() {
        var separador = ' ';
        for (var id in this.data2) {
            if (this.data2.hasOwnProperty(id)) {
                this.dividirFecha(this.data2[id].Fecha, separador, id);
            }
        }
    } 

    addCampos() {
        for (var id in this.data2) {
            this.getDescuentos(id);
            this.data2[id].numeroInterno = this.cero;
            this.data2[id].usuarioEds = this.usuarioEstacion;
        } 
    }

    getDescuentos(id) {
        if(this.estacionesTerpelPOS.includes(this.idEstacion)){
            this.carteraService.getDtoAllClteCredito(this.data2[id].IDENTIFICACION, this.data2[id].PRODUCTO, this.idEstacion).subscribe(result => {
                if (result.length == 1) {
                    console.log('%c ver valor descuento: ' + result[0].valorDto + ', cliente: ' + this.data2[id].CLIENTE + ', estación: ' + this.idEstacion, 'color:black; font-weight:bold; background-color:#0f0;');//b
                    this.data2[id].descuento = result[0].valorDto;
                }
                if (result.length == 0) {
                    console.log('%c Cliente: ' + this.data2[id].CLIENTE + 'n☻ tiene descuento registrado; † estación: ' + this.idEstacion, 'color:black; font-weight:bold; background-color:yellow;');
                    this.data2[id].descuento = 0;
                }
            }, error => console.log(error));
        }

        if(this.estacionesDominus.includes(this.idEstacion)){
            this.carteraService.getDtoAllClteCredito(this.data2[id].NIT, this.data2[id].Producto, this.idEstacion).subscribe(result => {
                if (result.length == 1) {
                    console.log('%c ver valor descuento: ' + result[0].valorDto + ', cliente: ' + this.data2[id].CLIENTE + ', estación: ' + this.idEstacion, 'color:black; font-weight:bold; background-color:#0f0;');//b
                    this.data2[id].descuento = Number(result[0].valorDto * Number(this.data2[id].Cantidad)).toFixed(3);                    
                }
                if (result.length == 0) {
                    console.log('%c Cliente: ' + this.data2[id].NIT + ' n☻ tiene descuento registrado; † estación: ' + this.idEstacion, 'color:black; font-weight:bold; background-color:yellow;');
                    this.data2[id].descuento = 0;
                }
            }, error => console.log(error));
        }
        
    }

    guardar() {
        for (var id in this.data2) {
            this.consumosAEnviar.CONSECUTIVO = this.data2[id].Recibo;
            this.consumosAEnviar.FECHA = this.data2[id].Fecha;
            this.consumosAEnviar.NIT = parseInt(this.data2[id].NIT.substring(0,this.data2[id].NIT.length -1));
            this.consumosAEnviar.CLIENTE = this.data2[id].Cliente;
            this.consumosAEnviar.PLACA = this.data2[id].Placa;
            this.consumosAEnviar.PRODUCTO = this.data2[id].Producto;
            this.consumosAEnviar.CANTIDAD = this.data2[id].Cantidad;
            this.consumosAEnviar.TOTAL = this.data2[id].Total;
            this.consumosAEnviar.HORA = this.data2[id].hora;
            this.consumosAEnviar.descuento = this.data2[id].descuento;
            this.consumosAEnviar.numeroInterno = this.data2[id].numeroInterno;
            this.consumosAEnviar.usuarioEds = this.data2[id].usuarioEds;
            this.consumosAEnviar.idEds = this.idEstacion;
            this.nominaService.insertConsumoClientes(this.consumosAEnviar)
                .subscribe((data) => {
                    this.principalComponent.showMsg('success', 'Éxito', 'Todos los consumos fueron registrados');                    
                    //here limpiar array
                },
                    (error) => {
                        this.contadorErrores += 1;
                        this.principalComponent.showMsg('error', 'no se guardó el consumo', error.error.message);
                    }
                );
                
                //console.log(JSON.stringify(this.consumosAEnviar));
        }
    }

    fileChange(ev){
        var archivo=new FileReader();
        archivo.addEventListener('load',this.leer.bind(this),false);
        archivo.readAsText(ev.target.files[0]);
    } 

    /*fileChange(file: any) {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file.target.files[0])
        fileReader.onload = (e: any) => {
            const bufferArray = e?.target.result
            const wb = XLSX.read(bufferArray, { type: "buffer" })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]

            this.data2 = XLSX.utils.sheet_to_json(ws)
            this.addCampos();
          
            //console.log("info: "+JSON.stringify(this.data2))
        }
    }*/

        leer(ev) {
            this.txt = ev.target.result;
            if (this.txt.includes("\n")) {
                this.lines = this.txt.split("\n");
            }
            if (this.txt.includes("\r\n")) {
                this.lines = this.txt.split("\r\n");
            }
            this.resultado = [];
            this.headers = this.lines[0].replace(/['"]+/g, '').split(',');
            for (var i = 1; i < this.lines.length; i++) {
                this.obj = {};
                this.words = this.lines[i].replace(/['"]+/g, '').split(',');
                for (var j = 0; j < this.words.length; j++) {
                    this.obj[this.headers[j].trim()] = this.words[j];
                }
                this.resultado.push(this.obj);
            }
            this.data = this.resultado;
            this.llenarData2();
        }

    /* leer(ev) {
        this.txt = ev.target.result;
        if (this.txt.includes("\n")) {
            this.lines = this.txt.split("\n");
        }
        if (this.txt.includes("\r\n")) {
            this.lines = this.txt.split("\r\n");
        }
        this.resultado = [];
        this.headers = this.lines[0].replace(/['"]+/g, '').split(',');
        for (var i = 1; i < this.lines.length; i++) {
            this.obj = {};
            this.words = this.lines[i].replace(/['"]+/g, '').split(',');
            for (var j = 0; j < this.words.length; j++) {
                this.obj[this.headers[j].trim()] = this.words[j];
            }
            this.resultado.push(this.obj);
        }
        this.data = this.resultado;
        this.llenarData2();
    } */

    clear() {
        //this. = [];
    }

    select(client: EntConsumoFLM) {
        this.submiter.emit(client);
        this.clear();
    }

}
