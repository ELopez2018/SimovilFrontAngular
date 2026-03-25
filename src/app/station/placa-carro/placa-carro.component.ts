import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { EntVehicle } from './../../Class/EntVehicle';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-placa-carro',
  templateUrl: './placa-carro.component.html',
  styleUrls: ['./placa-carro.component.css']
})
export class PlacaCarroComponent implements OnInit {

    @Input() idConsumo: number = 0;
    @Output() cambioPlacaCarro = new EventEmitter<any>();
    carros: EntVehicle[] = [];
    placaABuscar;
    placaAutomotor: string;

  constructor(private carteraService: CarteraService, private principal: PrincipalComponent) { }

  ngOnInit(): void {
  }

getPlacaCarro(){
    console.log('placa:) '+this.placaABuscar);
    this.carteraService.getDatosPlacaCarro(this.placaABuscar).subscribe(data => {
    console.log('verificar parámetro:) placa carro:) ' + this.placaABuscar);
    this.carros = data;
    if (data && data.length == 0) {
        Swal.fire({
        title: 'Registro de placa no encontrado!',
        icon: 'info',
        text: 'La placa no está registrado en la BD:) ',
    });
    this.clear();
    }
    }, error => {
        this.principal.showMsg('error', 'Error', error.error.message);
        console.log(error);
    });
}

clear() {
    this.placaABuscar = null;
    this.carros = [];
    this.placaAutomotor = null;
}

setPlacaCarro(placa){
    console.log('placa automotor:) '+placa);
    this.placaAutomotor = placa;
}

updatePlacaCarro(idConsumo, placa){
    /* console.log('id_consumo:) '+idConsumo+', placa carro:) '+placa); */
    this.carteraService.actualizarDatosPlacaCarro(idConsumo, placa).subscribe(result => {
        this.principal.showMsg('success', 'Éxito', 'La placa del carro ha sido actualizada con éxito. '+JSON.stringify(result));
        const idConsumoYPlaca = [{'idConsumo': idConsumo, 'placa': placa}];
        this.cambioPlacaCarro.emit(idConsumoYPlaca);
        }, error => {
        console.log('error, ubicación: clase Component');
        this.principal.showMsg('error', 'Error', error.error.message);
        });
}

}
