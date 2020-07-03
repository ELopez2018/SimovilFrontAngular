import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EntAdvance } from '../../../Class/EntAdvance';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-anticipo-a-proveedores',
    templateUrl: './anticipo-a-proveedores.component.html',
    styleUrls: ['./anticipo-a-proveedores.component.css']
})
export class AnticipoAProveedoresComponent implements OnInit {
    boolProvider: boolean = false;
    anticipos: EntAdvance;
    formulario: FormGroup;
    fecha = new Date();

    @Output() submiter = new EventEmitter<EntAdvance>();
    constructor(
        private formBuilder: FormBuilder
    ) {

    }
    ngOnInit() {
        this.formulario = this.formBuilder.group({
            nitProvedor: [null],
            nombreProvee: [null],
            fecha: [this.fecha],
            detallesAntpo: [null, [Validators.required]],
            valorAntpo: [null, [Validators.required]]
        });
    }

    assignProvider(datos: any) {
        this.anticipos = {
            idAnticipo: 0,
            proveedor: datos.nit,
            valor: 0,
            detalle: '',
            estado: 0,
            factura: 0,
            fecha: '' + new Date(),
            rutaPago: '',
            novedadAnticipo: [],
            nombreProvee: datos.nombre
        };
        this.formulario.controls['nitProvedor'].setValue(datos.nit);
        this.formulario.controls['nombreProvee'].setValue(datos.nombre);
        this.boolProvider = false;
    }
    refrescarForm () {
        this.formulario.reset();
    }
    submit() {
        const datos = this.formulario.value;
        this.anticipos.valor = datos.valorAntpo;
        this.anticipos.detalle = datos.detallesAntpo;
        this.anticipos.nombreProvee = datos.nombreProvee;
        this.submiter.emit(this.anticipos);
        this.formulario.reset();
    }
}
