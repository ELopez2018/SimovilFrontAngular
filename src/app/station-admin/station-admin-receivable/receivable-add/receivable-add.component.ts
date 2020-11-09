import { EntClient } from './../../../Class/EntClient';
import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { EntConsumptionClient } from '../../../Class/EntConsumptionClient';

@Component({
  selector: 'app-receivable-add',
  templateUrl: './receivable-add.component.html',
  styleUrls: ['./receivable-add.component.css']
})
export class ReceivableAddComponent implements OnInit {
    cliente: EntClient = new EntClient();
    fechaIni: string;
    fechaFin: string;
    cars: any[];
    virtualCars: any[];
    cols: any[];
    estacion: number;
    consumosAll: EntConsumptionClient[]=[]
  constructor(
      public carteraService : CarteraService,
      public storageService : StorageService

  ) {
    this.cols = [
        {field: 'id', header: 'id'},
        // {field: 'fechaConsumo', header: 'Fecha'},
        // {field: 'horaConsumo', header: 'Hora'},
        {field: 'ConsecutivoEstacion', header: 'Ticket'},
        {field: 'placa', header: 'Placa'},
        {field: 'combustible', header: 'Combustible'},
        {field: 'cantidad', header: 'Cantidad'},
        {field: 'valor', header: 'Valor'},
    ];
    this.estacion = this.storageService.getCurrentStation();
    this.ConsultaMock();
  }

  ngOnInit(): void {
     this.consultarConsumos()
  }
 consultarConsumos() {
    this.consumosAll=[];
    this.carteraService.getConsumption(this.cliente.codCliente,this.fechaIni,this.fechaFin,null, this.estacion)
    .subscribe(consumos =>{
        this.consumosAll = consumos;
        console.log(consumos);

    })
 }

 ConsultaMock() {
    this.cliente.codCliente=860002566;
    this.fechaIni='2020-10-01'; //new Date(2020,10,1);
    this.fechaFin='2020-10-02'; //new Date(2020,10,5);
    this.estacion=96
 }
}
