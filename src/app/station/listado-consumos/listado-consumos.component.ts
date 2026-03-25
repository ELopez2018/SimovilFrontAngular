import { CarteraService } from './../../services/cartera.service';
import { PrincipalComponent } from './../../principal/principal.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-listado-consumos',
    templateUrl: './listado-consumos.component.html',
    styleUrls: ['./listado-consumos.component.css'],
    standalone: false
})
export class ListadoConsumosComponent implements OnInit {

    @Input() idEstacion: number = 0;
    @Input() codCliente: number = 0;
    @Input() nombreCliente: string;
    @Input() fechaInicial: string;
    @Input() fechaFin: string;


  constructor(private carteraService: CarteraService, private principal: PrincipalComponent) { }

  ngOnInit(): void {
  }

  borrarBugConsumos(id_estacion, cod_cliente, fechaIni, fechaFinal){
      this.carteraService.borrarDatosBugConsumos(id_estacion, cod_cliente, fechaIni, fechaFinal).subscribe(result => {
      this.principal.showMsg('success', 'Éxito', 'Los consumos han sido borrados(bug) con éxito. '+JSON.stringify(result));
      }, error => {
      console.log('error, ubicación: clase Component');
      this.principal.showMsg('error', 'Error', error.error.message);
      });
  }

}
