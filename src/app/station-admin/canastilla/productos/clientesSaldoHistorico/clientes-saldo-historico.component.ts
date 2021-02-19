import { StorageService } from './../../../../services/storage.service';
import { DataService } from './../../../../services/data.service';
import { CarteraService } from './../../../../services/cartera.service';
import { UtilService } from './../../../../services/util.service';
import { EntClient } from './../../../../Class/EntClient';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-clientes-saldo-historico',
  templateUrl: './clientes-saldo-historico.component.html',
  styleUrls: ['./clientes-saldo-historico.component.css']
})
export class ClientesSaldoHistoricoComponent implements OnInit {
    @Input() codigoDeEstacion: any;
    @Input() nombreDeEstacion: any;
    //@Input() value: number;
    @Output() submiter = new EventEmitter<EntClient>();
    clientes: EntClient[];
    //codigo: number;
    //codigoDeEstacion: number;//
    stationCode: any;
    stationName: any;

  constructor(
      private carteraService: CarteraService,
      private utilService: UtilService,
      private dataService: DataService,
      private storageService: StorageService
  ) {
    this.stationCode = this.storageService.getCurrentStation();
  }

  ngOnInit(): void {
    this.getClientesFacturado();
  }

  getClientesFacturado(){
    alert('Recibido código con valor: '+this.codigoDeEstacion);
    console.log('%c Recibido código con valor: '+this.codigoDeEstacion+', nombre de estación+: '+this.nombreDeEstacion, 'color: green; font-weight: bold;');
    this.utilService.loader(true);
    this.carteraService.getClientesConSaldosIniciales(this.codigoDeEstacion).subscribe(data => {
        this.clientes = data;
        this.utilService.loader(false);
    }, error => {
        console.log('Errores : ', error);
        this.utilService.loader(false);
    });
  }

  SeleccionarClient(cliente: EntClient){
      this.submiter.emit(cliente);
  }

}
