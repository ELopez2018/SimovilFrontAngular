import { Component, OnInit } from '@angular/core';
import { EntClient } from '../../../Class/EntClient';
import { PrincipalComponent } from '../../../principal/principal.component';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PAYMENTMETHODS } from '../../../Class/PAYMENTMETHODS';
import { EntPayment } from '../../../Class/EntPayment';
import { fadeTransition } from '../../../routerAnimation';
import { focusById } from '../../../util/util-lib';

@Component({
  selector: 'app-payment-search',
  templateUrl: './payment-search.component.html',
  styleUrls: ['./payment-search.component.css'],
  animations: [fadeTransition()]
})
export class PaymentSearchComponent implements OnInit {

  searchPayments: EntPayment[];
  client: EntClient;
  searchPagoFechaIni;
  searchPagoFechaFin;
  searchPagoEstado;
  formasPago: any[];
  formasPagoAll: any[];
  boolSearchClient;

  constructor(
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Pagos - Simovil');
  }

  ngOnInit() {
    this.client = new EntClient();
    this.formasPagoAll = Object.create(PAYMENTMETHODS);
    this.formasPago = this.formasPagoAll.filter(e => e.id < 3);
    focusById('btnBoolClient');
  }

  getFormaPago(value) {
    if (value != null) {
      return this.formasPagoAll.find(e => e.id == value).text;
    }
  }

  getPaymentSearch() {
    this.utilService.loader(true);
    this.carteraService.getPayment2(this.client.codCliente, this.searchPagoFechaIni, this.searchPagoFechaFin, this.searchPagoEstado).subscribe(payments => {
      this.searchPayments = payments;
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
}
