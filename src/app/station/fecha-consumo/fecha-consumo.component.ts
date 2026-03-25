import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fecha-consumo',
  templateUrl: './fecha-consumo.component.html',
  styleUrls: ['./fecha-consumo.component.css']
})
export class FechaConsumoComponent implements OnInit {

    @Input() idConsumo: number = 0;
    @Output() cambioFechaConsumo = new EventEmitter<any>();
    nuevaFechaConsumo: string;

  constructor(private carteraService: CarteraService, private principal: PrincipalComponent) { }

  ngOnInit(): void {
  }


updateFechaConsumo(idConsumo, fecha){
    console.log('id_consumo:) '+idConsumo+', fecha de consumo:) '+fecha);
    this.carteraService.actualizarDatosFechaConsumo(idConsumo, fecha).subscribe(result => {
        this.principal.showMsg('success', 'Éxito', 'La fecha del consumo ha sido actualizada con éxito. '+JSON.stringify(result));
        const idConsumoYFecha = [{'idConsumo': idConsumo, 'fechaDeConsumo': fecha}];
        this.cambioFechaConsumo.emit(idConsumoYFecha);
        }, error => {
        console.log('error, ubicación: clase Component');
        this.principal.showMsg('error', 'Error', error.error.message);
        });
}

}
