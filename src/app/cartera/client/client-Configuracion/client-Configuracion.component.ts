import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { UtilService } from '../../../services/util.service';
import { EntStation } from '../../../Class/EntStation';
import { StorageService } from '../../../services/storage.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntClient } from '../../../Class/EntClient';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-client-Configuracion',
  templateUrl: './client-Configuracion.component.html',
  styleUrls: ['./client-Configuracion.component.css']
})
export class ClientConfiguracionComponent implements OnInit {
    idUsuario;
    stationCode: number;
    stationsAll: EntStation[] ;
    cliente: EntClient;
    estacionElegida: EntClient;
  constructor(
      private _nService: NominaService,
      private _utilService: UtilService,
      private _storaService: StorageService,
      private _toast: PrincipalComponent
  ) { }

  ngOnInit() {
  }
  GetArea() {
    this.idUsuario = this._storaService.getCurrentUserDecode().Usuario;
}
CLienteSel($event) {
    this.cliente = $event;
}
Estacion ($estacion ) {
    this.estacionElegida = $estacion;
}
}
