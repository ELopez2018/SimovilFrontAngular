import { DataCupoService } from './../../../services/data-cupo.service';
import { PrincipalComponent } from './../../../principal/principal.component';
import { CarteraService } from './../../../services/cartera.service';
import { EntCupo } from './../../../Class/EntCupo';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-cupos-consumidos',
    templateUrl: './cupos-consumidos.component.html',
    styleUrls: ['./cupos-consumidos.component.css'],
    standalone: false
})
export class CuposConsumidosComponent implements OnInit {

    cupoConsumido: EntCupo[] = [];
    idEstacion: number;

  constructor(private carteraService: CarteraService,
              private principal: PrincipalComponent,
              public dataCupoService: DataCupoService) { }

  ngOnInit(): void {
      this.getCupoConsumido();
  }

  getCupoConsumido(){
      this.carteraService.getDatosCupoConsumido(this.dataCupoService.idEstacion).subscribe(data => {
      console.log('CuposConsumidosComponent:) estación' + this.dataCupoService.idEstacion);
      this.cupoConsumido = data;
      if (this.cupoConsumido && this.cupoConsumido.length == 0) {
         this.dataCupoService.alertaCupoConsumido = false;//alerta verde
         console.log('%c'+ 'luz verde', 'color: green; font-weight: bold;');
         this.clear();
      }
      if (this.cupoConsumido.length > 0) {
         this.dataCupoService.alertaCupoConsumido = true;//alerta roja
         console.log('%c'+ 'luz roja', 'color: red; font-weight: bold;');
      }
      }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
      });
  }

  clear() {
    this.cupoConsumido = [];
}

}
