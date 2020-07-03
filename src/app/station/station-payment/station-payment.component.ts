import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { EntClient } from '../../Class/EntClient';
import { EntPayment } from '../../Class/EntPayment';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import { rangedate, dateToISOString, focusById, ObjToCSV } from '../../util/util-lib';
import { PrintService } from '../../services/print.service';
import { PAYMENTMETHODS } from '../../Class/PAYMENTMETHODS';

@Component({
  selector: 'app-station-payment',
  templateUrl: './station-payment.component.html',
  styleUrls: ['./station-payment.component.css'],
  animations: [fadeTransition()]
})
export class StationPaymentComponent implements OnInit {

  searchPayments: EntPayment[];
  codEstation;
  client: EntClient;
  searchPagoFechaIni;
  searchPagoFechaFin;
  booleanClient = false;
  id;

  constructor(
    private carteraService: CarteraService,
    private storageService: StorageService,
    private principal: PrincipalComponent,
    private route: ActivatedRoute,
    private location: Location,
    private utilService: UtilService,
    private printService: PrintService
  ) {
    this.codEstation = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    let fechas = rangedate(dateToISOString(new Date()), 1);
    this.searchPagoFechaIni = dateToISOString(fechas[0]);
    this.searchPagoFechaFin = dateToISOString(fechas[1]);
    this.client = new EntClient();
    this.GetParam();
    focusById('btnClient');
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    if (id != null)
      this.searchByParam(id);
  }

  searchByParam(id) {
    this.carteraService.GetClient(id).subscribe(client => {
      this.client = client[0];
      focusById('btnSearch');
    }, error => {
      console.log(error);
      this.location.back();
    });
  }

  searchClient() {
    if (this.client.codCliente == null)
      return;
    this.carteraService.GetClient(this.client.codCliente).subscribe(client => {
      if (client.length != 0)
        this.client = client[0];
      else {
        this.principal.showMsg('info', 'Información', 'Cliente no encontrado.')
      }
    }, error => {
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  getPaymentsSearch() {
    this.utilService.loader(true);
    this.carteraService.getPayment2(this.client.codCliente, this.searchPagoFechaIni, this.searchPagoFechaFin, true).subscribe(payments =>
      this.searchPayments = payments,
      error => {
        console.log(error);
        this.utilService.loader(false);
        this.principal.showMsg('error', 'Error', error.error.message);
      }, () => this.utilService.loader(false));
  }

  sumPayments() {
    let array: EntPayment[];
    var suma = 0;
    array = this.searchPayments;
    array.forEach(element => {
      suma += element.valor;
    });
    return suma;
  }

  cleanConsumptionSearch() {
    this.searchPagoFechaIni = null;
    this.searchPagoFechaFin = null;
    this.searchPayments = null;
  }

  printConsumptionSearch(): void {
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

  back() {
    this.location.back();
  }

  getFormaPago(value) {
    if (value != null) {
      try {
        return PAYMENTMETHODS.find(e => e.id == value).text;
      } catch (error) {
        return null;
      }
    }
  }

  resultClient(client: EntClient) {
    this.client = client;
    this.booleanClient = false;
    focusById('btnSearch');
  }

  openModCli() {
    this.booleanClient = true;
    setTimeout(() => {
      focusById('searchCli');
    }, 10);
  }

  csvPaymentSearch() {
    let title = ['idPago', 'fecha', 'fechaPago', 'cliente', 'nombre', 'formaPago', 'valor', 'numCuentaCobro', 'estado'];
    let titleB = ['Id', 'Fecha ', 'Fecha de Pago', 'Nit', 'Nombre', 'Forma de Pago', 'Valor', 'Cuenta de cobro', 'Estado'];
    let item = JSON.parse(JSON.stringify(this.searchPayments));
    item.map(e => {
      e.fecha = formatDate(e.fecha, 'dd/MM/yyyy', 'en-US', '+0000');
      e.fechaPago = formatDate(e.fechaPago, 'dd/MM/yyyy', 'en-US', '+0000');
      e.formaPago = this.getFormaPago(e.formaPago);
    });
    this.printService.downloadCSV(ObjToCSV(item, title, titleB), 'Pagos');
  }

}
