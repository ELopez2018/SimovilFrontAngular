import { NominaService } from './../../../services/nomina.service';
import { EntClient } from './../../../Class/EntClient';
import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-receivable-add',
  templateUrl: './receivable-add.component.html',
  styleUrls: ['./receivable-add.component.css']
})
export class ReceivableAddComponent implements OnInit {
    cliente: EntClient;
    fechaIni: Date;
    fechaFin: Date;
    cars: any[];
    virtualCars: any[];
    cols: any[];
    estacion: number;
  constructor(
      public carteraService = CarteraService,
      public storageService = StorageService

  ) {
    this.cols = [
        {field: 'id', header: 'id'},
        {field: 'Ticket', header: 'Ticket'},
        {field: 'fecha', header: 'Fecha'},
        {field: 'Hora', header: 'Hora'}
    ];
    this.estacion = this.storageService.getCurrentStation();
  }

  ngOnInit(): void {
  }
 consultarConsumos() {

    this.carteraService.getConsumption(this.cliente.codCliente,this.fechaIni,this.fechaFin,null, this.estacion).suscribe
 }
}
