import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-valor-consumo',
    templateUrl: './valor-consumo.component.html',
    styleUrls: ['./valor-consumo.component.css'],
    standalone: false
})
export class ValorConsumoComponent implements OnInit {

    @Input() idConsumo: number = 0;
    @Input() cantidadConsumo: number = 0;
    @Output() cambioValorConsumo = new EventEmitter<any>();
    nuevoValorConsumo: number = 0;

  constructor(private carteraService: CarteraService, private principal: PrincipalComponent) { }

  ngOnInit(): void {
  }


updateValorConsumo(idConsumo, cantidad, valor){
    console.log('id_consumo:) '+idConsumo+', valor de consumo:) '+valor+', cantidad:) '+cantidad);
    //return;
    this.carteraService.actualizarDatosValorConsumo(idConsumo, cantidad, valor).subscribe(result => {
        this.principal.showMsg('success', 'Éxito', 'El valor del consumo ha sido actualizado con éxito. '+JSON.stringify(result));
        const idConsumoYValor = [{'idConsumo': idConsumo, 'cantidad': cantidad, 'valor': valor}];
        this.cambioValorConsumo.emit(idConsumoYValor);
        }, error => {
        console.log('error, ubicación: clase Component');
        this.principal.showMsg('error', 'Error', error.error.message);
        });
}
}
