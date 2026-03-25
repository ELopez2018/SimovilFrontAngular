import { CarteraService } from './../../../services/cartera.service';
import { PrincipalComponent } from './../../../principal/principal.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fecha-pago',
  templateUrl: './fecha-pago.component.html',
  styleUrls: ['./fecha-pago.component.css']
})
export class FechaPagoComponent implements OnInit {

    @Input() id_pago: number = 0;
    nuevaFechaPago: string;

  constructor(private principalComponent: PrincipalComponent,
    private carteraService: CarteraService) { }

  ngOnInit(): void {
  }

  updateFechaPago(idPago, updatedFecha){

    if(updatedFecha == undefined){
        this.principalComponent.showMsg('info', 'Atención', 'Por favor seleccione la nueva fecha correspondiente al pago con id: '+idPago);
        return;
    }

    console.log('%c ¡Actualizando, actualizando!', 'color: yellow; background: purple;');//b
    console.log('%c idPago: '+idPago+', fecha: '+updatedFecha, 'color: yellow; background: purple;');//b

    this.carteraService.actualizarFechaPago(idPago, updatedFecha).subscribe(result => {
        this.principalComponent.showMsg('success', 'Éxito', 'La fecha del pago ha sido actualizada con éxito. '+JSON.stringify(result));
        const idPagoYFecha = [{'idConsumo': idPago, 'fechaDePago': updatedFecha}];
        //this.cambioFechaConsumo.emit(idPagoYFecha);
        }, error => {
        console.log('error, ubicación: clase Component');
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
  }

}
