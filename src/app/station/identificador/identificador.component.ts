import { EntIdentificators } from './../../Class/EntIdentificators';
import { EntCreditDescuento } from './../../Class/EntCreditDescuento';
import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-identificador',
  templateUrl: './identificador.component.html',
  styleUrls: ['./identificador.component.css']
})
export class IdentificadorComponent implements OnInit {

    @Input() idConsumo: number = 0;
    @Input() idEstacion: number = 0;
    search;
    clients: EntCreditDescuento[] = [];
    identificadores: EntIdentificators[] = [];
    idIdentificador: number = 0;

  constructor(private carteraService: CarteraService, private principal: PrincipalComponent)
  {

  }

  ngOnInit(): void {

  }

  getClient() {
    this.carteraService.getBusquedaCliente(this.search, this.idEstacion).subscribe(result => {
        console.log('verificar parámetros:) nombreCliente:) '+this.search+', idEstación:) '+this.idEstacion);
        this.clients = result;
        if (result && result.length == 0) {
            Swal.fire({
                title: 'Registro no encontrado! verique la estación: '+this.idEstacion,
                icon: 'info',
                text: 'El Cliente no está registrado en la estación:) '+this.idEstacion
            });
            this.clear();
        }
    }, error => {
        this.principal.showMsg('error', 'Error', error.error.message);
        console.log(error);
    });
}

getIdentificators(codCliente){
    this.carteraService.getIdentificadores(codCliente).subscribe(data => {
        console.log('verificar parámetros:) idIdentificador:) ' + codCliente);
        this.identificadores = data;
        console.log('listado:) '+JSON.stringify(this.identificadores));
        if (data && data.length == 0) {
            Swal.fire({
                title: 'Registro de id_identificador no encontrado!',
                icon: 'info',
                text: 'El identificador no está registrado en la estación:) '+this.idEstacion
            });
            this.clear();
        }
    }, error => {
        this.principal.showMsg('error', 'Error', error.error.message);
        console.log(error);
    });
}

setIdIdentificador(identificador){
    this.idIdentificador = identificador;
}

clear() {
    this.search = null;
    this.clients = [];
    this.identificadores = [];
}

updateIdIdentificador(id_consumo, id_identificator){

    this.carteraService.actualizarIdentificator(id_consumo, id_identificator).subscribe(result => {
    this.principal.showMsg('success', 'Éxito', 'id_identificador del cliente B actualizado con éxito. '+JSON.stringify(result));
  }, error => {
      console.log('error, ubicación: component');
    this.principal.showMsg('error', 'Error', error.error.message);
  });
}

}

