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
    totalCantidad: number;
    totalValor: number;
    totalTickets: number;
    retenciones:boolean=null;
    classRet: string ="p-button-rounded p-button-secondary";
    iconRetn: string="pi pi-question";
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
        this.totales();
        console.log(consumos);
    })
 }
 totales() {
    this.totalTickets=0;
    this.totalCantidad= 0;
    this.totalValor= 0;
     this.consumosAll.forEach(items=>{
        this.totalCantidad+= items.cantidad
        this.totalValor+= items.valor
        this.totalTickets++
     })
 }
 ConsultaMock() {
    this.cliente.codCliente=860002566;
    this.fechaIni='2020-10-01'; //new Date(2020,10,1);
    this.fechaFin='2020-10-02'; //new Date(2020,10,5);
    this.estacion=96
 }
 Retenciones(){
    this.retenciones = !this.retenciones;

    if (this.retenciones ) {
        this.classRet ="p-button-rounded";
    //    this.iconRetn="pi pi-check";
    } else {
         this.classRet ='p-button-rounded p-button-danger';
        // this.iconRetn='pi pi-times';
    }
 }
}
