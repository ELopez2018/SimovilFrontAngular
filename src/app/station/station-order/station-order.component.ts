import { Component, OnInit } from '@angular/core';
import { EntOrder } from '../../Class/EntOrder';
import { EntClient } from '../../Class/EntClient';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { Location, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EntStation } from '../../Class/EntStation';
import { NominaService } from '../../services/nomina.service';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import { rangedate, dateToISOString, focusById, ObjToCSV } from '../../util/util-lib';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-station-order',
  templateUrl: './station-order.component.html',
  styleUrls: ['./station-order.component.css'],
  animations: [fadeTransition()]
})
export class StationOrderComponent implements OnInit {

  searchOrders: EntOrder[];
  codEstation;
  stationsAll: EntStation[];
  client: EntClient;
  searchPedidoFechaIni;
  searchPedidoFechaFin;
  searchStatus: boolean = true;
  id;
  controlSearchOrder = [];
  arrayOrderAutoStation = null;
  booleanClient = false;

  constructor(
    private nominaService: NominaService,
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
    let fecha = rangedate(dateToISOString(new Date()), 0);
    this.searchPedidoFechaIni = dateToISOString(fecha[0]);
    this.searchPedidoFechaFin = dateToISOString(fecha[1]);
    this.client = new EntClient();
    this.nominaService.GetStations().subscribe(data => {
      this.stationsAll = data;
    }, error => console.log(error));
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

  getOrderSearch() {
    this.utilService.loader(true);
    this.carteraService.getOrder(this.client.codCliente, this.searchPedidoFechaIni, this.searchPedidoFechaFin, this.searchStatus).subscribe(orders => {
      this.searchOrders = orders;
      this.orderAutoStationOrder(orders);
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
        this.principal.showMsg('error', 'Error', error.error.message);
      }, () => this.utilService.loader(false));
  }

  // sumOrders() {
  //   let array: EntOrder[];
  //   var suma = 0;
  //   array = this.searchPayments;
  //   array.forEach(element => {
  //     suma += element.valor;
  //   });
  //   return suma;
  // }

  cleanConsumptionSearch() {
    this.searchPedidoFechaIni = null;
    this.searchPedidoFechaFin = null;
    this.searchOrders = null;
    this.searchStatus = null;
  }

  printConsumptionSearch(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-orders').innerHTML;
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
          <h4 class="text-center mt-3">Pedidos del ${this.searchPedidoFechaIni} al ${this.searchPedidoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  getNameStation(id: number) {
    if (this.stationsAll == null || id == null)
      return;
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }

  back() {
    this.location.back();
  }

  orderAutoStationOrder(dataOrigen) {
    this.arrayOrderAutoStation = [];
    dataOrigen.forEach(data => {
      var array = [[], [], [], []];
      let lengthPDE;
      let lengthPDA;
      if (data.PedidoDetalleEstacion == null) {
        lengthPDE = 0;
        data.PedidoDetalleEstacion = [];
      } else
        lengthPDE = data.PedidoDetalleEstacion.length;
      if (data.PedidoDetalleAuto == null) {
        lengthPDA = 0;
        data.PedidoDetalleAuto = [];
      } else
        lengthPDA = data.PedidoDetalleAuto.length;
      let maxlength = lengthPDA > lengthPDE ? lengthPDA : lengthPDE;
      for (let i = 0; i < maxlength; i++) {
        if (data.PedidoDetalleEstacion[i] != null) {
          array[0][i] = data.PedidoDetalleEstacion[i].estacion;
        }
        else
          array[0][i] = null;
        if (data.PedidoDetalleAuto[i] != null) {
          array[1][i] = data.PedidoDetalleAuto[i].automotor;
          array[2][i] = data.PedidoDetalleAuto[i].vigencia;
          array[3][i] = data.PedidoDetalleAuto[i].valor;
        }
        else {
          array[1][i] = null;
          array[2][i] = null;
          array[3][i] = null;
        }
      }
      this.arrayOrderAutoStation.push(array);
    });
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

  csvOrderSearch() {
    let title = ['idPedido', 'controlado', 'todaEstacion', 'todoVehiculo', 'vigencia', 'valor', 'saldo', 'consumido', 'estado', 'fechaCreacion'];
    let item = JSON.parse(JSON.stringify(this.searchOrders));
    item.map(e => {
      e.fechaCreacion = formatDate(e.fechaCreacion, 'dd/MM/yyyy', 'en-US', '+0000');
    });
    this.printService.downloadCSV(ObjToCSV(item, title), 'pedidos');
  }
}
