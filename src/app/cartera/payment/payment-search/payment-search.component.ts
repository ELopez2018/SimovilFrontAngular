import { NominaService } from './../../../services/nomina.service';
import { EntStation } from './../../../Class/EntStation';
import { StorageService } from './../../../services/storage.service';
import { EntRole } from './../../../Class/EntRole';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EntClient } from '../../../Class/EntClient';
import { PrincipalComponent } from '../../../principal/principal.component';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PAYMENTMETHODS } from '../../../Class/PAYMENTMETHODS';
import { EntPayment } from '../../../Class/EntPayment';
import { fadeTransition } from '../../../routerAnimation';
import { focusById } from '../../../util/util-lib';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-payment-search',
    templateUrl: './payment-search.component.html',
    styleUrls: ['./payment-search.component.css'],
    animations: [fadeTransition()],
    standalone: false
})
export class PaymentSearchComponent implements OnInit {

  @ViewChild('tabla_de_pagos') tabla_de_pagos: ElementRef;
  searchPayments: EntPayment[];
  client: EntClient;
  searchPagoFechaIni;
  searchPagoFechaFin;
  searchPagoEstado;
  formasPago: any[];
  formasPagoAll: any[];
  boolSearchClient;
  rolSistemas: boolean = false;
  rol: EntRole;
  anticipo_boolean: boolean = false;
  stationCod;
  stationSel: EntStation;
  stations: EntStation[];
  typeSel: any;
  types = [{ id: 0, text: 'Estaciones' }];
  consultada;
  opcionEnBlanco;
  formulario: boolean = false;
  booleanFecha: boolean = false;
  id_pago: number = 0;

  constructor(
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    private utilService: UtilService,
    private storageService: StorageService,
    private nominaService: NominaService
  ) {
    this.title.setTitle('Pagos - Simovil');
    this.basicData();
  }

  ngOnInit() {
    this.client = new EntClient();
    this.formasPagoAll = Object.create(PAYMENTMETHODS);
    this.formasPago = this.formasPagoAll.filter(e => e.id < 3 || e.id === 5 || e.id === 6 || e.id === 8);
    focusById('btnBoolClient');
    this.getRolAdmin();
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
        this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
    this.typeSel = this.types[0];
}

  getFormaPago(value) {
    if (value != null) {
      return this.formasPagoAll.find(e => e.id == value).text;
    }
  }

  getPaymentSearch() {
    this.utilService.loader(true);
    if(this.stationSel == undefined){
        this.consultada = null;
    }else{
            this.consultada = this.stationSel.idEstacion
            }

    this.carteraService.getPayment2(this.client.codCliente, this.searchPagoFechaIni, this.searchPagoFechaFin, this.searchPagoEstado, null, null, this.consultada).subscribe(payments => {
      this.searchPayments = payments;
      if(this.searchPayments.length == 0 && this.client.nombre != null)
      {
       this.principalComponent.showMsg('warn', 'Atención', 'No hay registros para esta consulta, favor verifique que los datos correspondan entre estación: '+this.stationSel.nombreEstacion+' y cliente: '+this.client.nombre);
      }
      if(this.searchPayments.length == 0 && this.stationSel != undefined)
      {
       this.principalComponent.showMsg('info', 'Atención', 'No hay registros para esta consulta');
      }
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
        this.principalComponent.showMsg('error', 'Error', error.error.message);
      }, () => this.utilService.loader(false));
  }


  cleanPaymentSearch() {
    this.searchPagoFechaIni = null;
    this.searchPagoFechaFin = null;
    this.searchPayments = null;
    this.client.codCliente = null;
    this.client.nombre = null;
    this.opcionEnBlanco = null;
  }

  printPaymentSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-payments').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
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
          <h4 class="text-center mt-3">Pagos del ${this.searchPagoFechaIni} al ${this.searchPagoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  searchClient() {
    if (this.client.codCliente == null)
      return;
    this.carteraService.GetClient(this.client.codCliente).subscribe(client => {
      if (client.length != 0)
        this.client = client[0];
      else {
        this.principalComponent.showMsg('info', 'Información', 'Cliente no encontrado.')
      }
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  get sumPayments() {
    return this.searchPayments.reduce((a, b) => a + b.valor, 0);
  }

  boolClient() {
    this.boolSearchClient = true
    this.client = new EntClient();
    setTimeout(() => {
      focusById('searchCli');
    }, 10);
  }

  getCodClient(client: EntClient) {
    this.client = client;
    this.boolSearchClient = false;
    focusById('btnSearchPayment', true);
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

 borrarPagoCartera(idPago){
     Swal.fire({
         title: '¿Está seguro?',
         text: `Está a punto de eliminar el pago de id N° ${idPago}. ¿Desea Continuar?`,
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         cancelButtonText: 'No',
         confirmButtonText: 'Sí'
     }).then(result =>{
         if(result.value){
            this.carteraService.eliminarPagoCartera(idPago).subscribe(result => {
                this.principalComponent.showMsg('success', 'Éxito', 'ct: Pago de cartera ha sido borrado con éxito. '+JSON.stringify(result));
                //here borrar de la pila too
                }, error => {
                this.principalComponent.showMsg('error', 'Error', error.error.message);
                });
         }else{
             return;
         }
     });
 }

 exportarToExcel(){
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tabla_de_pagos.nativeElement, {dateNF: 'yyyy/mm/dd;@', cellDates: true, raw: true});
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Pagos_de_Cartera.xlsx');
 }

 visitarElementoPadre(){
        this.formulario = true;
 }

 leaveElementoPadre(){
     this.formulario = false;
 }

 updateFechaPago(id_pago: any){
     console.log('%c actualizar fecha del pago', 'color: yellow; background: purple');//b
     this.booleanFecha = true;
     this.id_pago = id_pago;
 }

}
