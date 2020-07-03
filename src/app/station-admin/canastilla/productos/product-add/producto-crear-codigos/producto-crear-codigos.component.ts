import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-producto-crear-codigos',
  templateUrl: './producto-crear-codigos.component.html',
  styleUrls: ['./producto-crear-codigos.component.css']
})
export class ProductoCrearCodigosComponent implements OnInit {
    forma: FormGroup;
    Codigos: FormArray;

  constructor(
                private fb: FormBuilder
             ) { }

  ngOnInit() {
  }
  Guardar() {

  }
  createItem(producto) {
    return this.fb.group({
        codigo: [],
        Empresa: [],
        idProducto: [producto.id]
    });
}
ArticuloElegido() {

}
}
