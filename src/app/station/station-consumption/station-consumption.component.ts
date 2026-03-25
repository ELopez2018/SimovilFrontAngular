import { EntPlacayIdConsumo } from './../../Class/EntPlacayIdConsumo';
import { EntRole } from './../../Class/EntRole';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { EntConsumptionClient } from '../../Class/EntConsumptionClient';
import { NominaService } from '../../services/nomina.service';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { EntStation } from '../../Class/EntStation';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { EntClient } from '../../Class/EntClient';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import {
    rangedate,
    dateToISOString,
    focusById,
    ObjToCSV,
} from '../../util/util-lib';
import { PrintService } from '../../services/print.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-station-consumption',
    templateUrl: './station-consumption.component.html',
    styleUrls: ['./station-consumption.component.css'],
    animations: [fadeTransition()],
    standalone: false
})
export class StationConsumptionComponent implements OnInit {

    @ViewChild('tabla_de_consumos') tabla_de_consumos: ElementRef;
    searchConsumos: EntConsumptionClient[] = [];
    codEstation;
    stationsAll: EntStation[] =[];
    stationSel: EntStation= new EntStation();
    stationCode: number = null;
    rol: EntRole;
    rolSistemas: boolean = false;
    client: EntClient;
    searchConsumoFechaIni;
    searchConsumoFechaFin;
    id;
    nombreCliente: string;
    booleanClient = false;
    estilos: string =
        'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';
    ver: boolean = false;
    indice: number = null;
    booleanIdIdentificador: boolean = false;
    booleanPlacaCarro: boolean = false;
    booleanFechaConsumo: boolean = false;
    booleanValorConsumo: boolean = false;
    booleanCombustible: boolean = false;
    booleanBugConsumos: boolean = false;
    idConsumo: number = 0;
    cantidadConsumo: number = 0;
    articulo: string = null;
    placaCarro: any;
    placayIdConsumo: EntPlacayIdConsumo[] = [];
    fechayIdConsumo: EntPlacayIdConsumo[] = [];
    valoryIdConsumo: EntPlacayIdConsumo[] = [];
    formulario: boolean = false;

    constructor(
        private nominaService: NominaService,
        private carteraService: CarteraService,
        private storageService: StorageService,
        private principal: PrincipalComponent,
        private route: ActivatedRoute,
        private location: Location,
        private utilService: UtilService,
        private printService: PrintService,
        private title: Title
    ) {
        this.stationCode = this.storageService.getCurrentStation();
        this.GetEstaciones();
    }

    ngOnInit() {
        let fechas = rangedate(dateToISOString(new Date()), 0);
        this.searchConsumoFechaIni = dateToISOString(fechas[0]);
        this.searchConsumoFechaFin = dateToISOString(fechas[1]);
        this.client = new EntClient();
        this.GetParam();
        focusById('btnClient');
        this.title.setTitle('Consumos - Simovil');
        this.getRolAdmin();
    }

    verAcciones(indiceLista) {
        this.indice = indiceLista;
        console.log('índice enviado:) '+this.indice);
        this.ver = true;
      }

     ocultarAcciones(){
         this.ver = false;
     }

    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        if (id != null) this.searchByParam(id);
    }

    GetEstaciones() {
        this.nominaService.GetStations().subscribe(data => {
                this.stationsAll = data;
                if (this.stationCode) {
                    this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                    console.log('estación seleccionada: '+JSON.stringify(this.stationSel));
                }
            }, (error) => console.error(error.error.message)
        );
    }

    searchByParam(id) {
        this.carteraService.GetClient(id).subscribe(
            (client) => {
                this.client = client[0];
                focusById('btnSearch');
            },
            (error) => {
                console.log(error);
                this.location.back();
            }
        );
    }

    searchClient() {
        if (this.client.codCliente == null) return;
        this.carteraService.GetClient(this.client.codCliente).subscribe(
            (client) => {
                if (client.length != 0) this.client = client[0];
                else {
                    this.principal.showMsg(
                        'info',
                        'Información',
                        'Cliente no encontrado.'
                    );
                }
            },
            (error) => {
                console.log(error);
                this.principal.showMsg('error', 'Error', error.error.message);
            }
        );
    }

    getConsumptionSearch() {
        if (!this.stationSel) {
            this.stationSel = new EntStation();
            this.stationSel.idEstacion = null;
        }
        this.utilService.loader(true);
        this.carteraService.getConsumption(this.client.codCliente, this.searchConsumoFechaIni, this.searchConsumoFechaFin, null, this.stationSel.idEstacion).subscribe(
                (consumptions) => {
                    if(!consumptions || consumptions.length <= 0) {
                        this.principal.showMsg('warn','SIN RESULTADOS','No se encontraron registros')
                    }
                    this.searchConsumos = consumptions;
                    console.log('consumos: '+JSON.stringify(this.searchConsumos));//b
                    this.utilService.loader(false);
                    if (
                        this.searchConsumos.length > 0 &&
                        this.searchConsumos !== null
                    ) {
                        this.estilos =
                            'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center pb-2';
                    } else {
                        this.estilos =
                            'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';
                    }
                },
                (error) => {
                    console.log(error);
                    this.utilService.loader(false);
                    this.principal.showMsg(
                        'error',
                        'Error',
                        error.error.message
                    );
                },
                () => this.utilService.loader(false)
            );
    }

    sumConsumption() {
        let array: EntConsumptionClient[];
        var suma = 0;
        array = this.searchConsumos;
        array.forEach((element) => {
            suma += element.valor;
        });
        return suma;
    }

    totalDescuento(){
        let arrayDto: EntConsumptionClient[];
        var sumaDto = 0;
        arrayDto = this.searchConsumos;
        arrayDto.forEach(d => {
            sumaDto += d.descuento;
        });
        return sumaDto;
    }

    sumTotalGalones(){
        let array2: EntConsumptionClient[];
        var suma2 = 0;
        array2 = this.searchConsumos;
        array2.forEach((element) => {
            suma2 += element.cantidad;
        });
        return suma2;
    }

    cleanConsumptionSearch() {
        this.searchConsumoFechaIni = null;
        this.searchConsumoFechaFin = null;
        this.searchConsumos = [];
        this.client = new EntClient();
    }

    printConsumptionSearch(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-consumption').innerHTML;
        popupWin = window.open(
            '',
            '_blank',
            'top=0,left=0,height=100%,width=auto'
        );
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Consumos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Consumos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`);
        popupWin.document.close();
    }

    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) return;
        return this.stationsAll.find((e) => e.idEstacion == id).nombreEstacion;
    }

    back() {
        this.location.back();
    }

    resultClient(client: EntClient) {
        this.client = client;
        this.nombreCliente = client.nombre;
        this.booleanClient = false;
        focusById('btnSearch');
    }

    getCambioPlacaCarro(placaActualizada){
        this.placayIdConsumo = placaActualizada;

         console.log('placa y id_consumo:) output!'+this.placayIdConsumo);//b
         this.searchConsumos.forEach((elemento2) => {
             if(elemento2.id == this.placayIdConsumo[0].idConsumo){
                    elemento2.placa = this.placayIdConsumo[0].placa;
                    console.log('in forEach...'+this.placayIdConsumo[0].idConsumo);//b
             }
         });
    }

    getCambioFechaConsumo(fechaActualizada){
        this.fechayIdConsumo = fechaActualizada;

         console.log('fecha y id_consumo:) output!'+this.fechayIdConsumo);
         this.searchConsumos.forEach((elemento1) => {
             if(elemento1.id == this.fechayIdConsumo[0].idConsumo){
                    elemento1.fechaConsumo = this.fechayIdConsumo[0].fechaDeConsumo;
                    console.log('in forEach... fechaDeConsumo:) '+this.fechayIdConsumo[0].fechaDeConsumo);//b
                    console.log('in forEach... fechaConsumo:) '+elemento1.fechaConsumo);//b
             }
         });
    }

    getCambioValorConsumo(valorActualizado){
        this.valoryIdConsumo = valorActualizado;
         console.log('valor y id_consumo:) output!'+JSON.stringify(this.valoryIdConsumo));//b
         this.searchConsumos.forEach((elemento3) => {
             if(elemento3.id == this.valoryIdConsumo[0].idConsumo){
                    elemento3.cantidad = this.valoryIdConsumo[0].cantidad;
                    elemento3.valor = this.valoryIdConsumo[0].valor;
             }
         });
    }

    openModCli() {
        this.booleanClient = true;
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }

    csvConsumptionSearch() {
        let title = [
            'fechaConsumo',
            'horaConsumo',
            'ConsecutivoEstacion',
            'cantidad',
            'DESCRIPCION',
            'placa',
            'valor',
            'idPedido',
            'estacionConsumo',
            'cuentaCobro',
        ];
        let titleB = [
            'Fecha',
            'Hora',
            'Tiquete',
            'Cantidad',
            'Combustible',
            'Placa',
            'Valor',
            'Pedido',
            'Estación',
            'Cuenta de Cobro',
        ];
        let item = JSON.parse(JSON.stringify(this.searchConsumos));
        console.log(item);
        item.map((e) => {
            e.fechaConsumo = formatDate(
                e.fechaConsumo,
                'dd/MM/yyyy',
                'en-US',
                '+0000'
            );
            e.horaConsumo = e.horaConsumo;
        });
        this.printService.downloadCSV(
            ObjToCSV(item, title, titleB),
            'CONSUMOS ' + this.nombreCliente
        );
    }

    borrarConsumo(idConsumo, codCliente, i){
        Swal.fire({
            title: '¿Está seguro?',
            text:
                `Está a punto de eliminar el consumo de id N° ${this.searchConsumos[i].id} código del cliente ${this.searchConsumos[i].codCliente}. ¿Desea Continuar?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Sí',
        }).then((result) => {
            if (result.value) {
                this.carteraService
                    .borrarConsumo(idConsumo, codCliente)
                    .subscribe((resp) => {
                        this.searchConsumos.splice(i, 1);
                    });
            } else {
                return;
            }
        });
    }

    updateIdIdentificador(id_consumo){
        this.booleanIdIdentificador = true;
        this.idConsumo = id_consumo;
    }

    updatePlacaCarro(id_consumo){
        this.booleanPlacaCarro = true;
        this.idConsumo = id_consumo;
    }
    updateFechaConsumo(id_consumo){
        this.booleanFechaConsumo = true;
        this.idConsumo = id_consumo;
    }
    updateValorConsumo(id_consumo, cantidad){
        this.booleanValorConsumo = true;
        this.idConsumo = id_consumo;
        this.cantidadConsumo = cantidad;
    }

    updateCombustible(id_consumo, tipo_articulo){
        console.log('datos: id consumo '+id_consumo);
        this.booleanCombustible = true;
        this.idConsumo = id_consumo;
        this.articulo = tipo_articulo;
    }

    borrarBugListaConsumos(){
        console.log('IdEstacion, codCliente, FechaInicial, FechaFin');
        this.booleanBugConsumos = true;
    }

    getRolAdmin(){
       this.carteraService.getRolAdmin().subscribe(data => {
           this.rol = data[0];
              if((this.rol.ID == this.storageService.getCurrentUserDecode().idRol) && (this.rol.ID_AREA == this.storageService.getCurrentUserDecode().Area))
                   {
                   this.rolSistemas = true;
                   console.log('hola sistemas:)');
                   }
       }, error => console.log(error));
    }

    exportarConsumoToExcel(){
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_consumos.nativeElement, {dateNF: 'yyyy/mm/dd;@', cellDates: true, raw: true});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Consumos_de_Cartera.xlsx');
    }

    visitarElementoPadre(){
        this.formulario = true;
 }

 leaveElementoPadre(){
     this.formulario = false;
 }
}
