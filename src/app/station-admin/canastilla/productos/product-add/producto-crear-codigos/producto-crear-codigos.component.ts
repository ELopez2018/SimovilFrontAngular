import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { EntProductos } from '../../../../../Class/EntProductos';
import { NominaService } from '../../../../../services/nomina.service';
import { EntProductoCodigoContable } from '../../../../../Class/EntProductoCodigoContable';
import { EntCodigoContable } from '../../../../../Class/EntCodigosContables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-producto-crear-codigos',
    templateUrl: './producto-crear-codigos.component.html',
    styleUrls: ['./producto-crear-codigos.component.css']
})
export class ProductoCrearCodigosComponent implements OnInit, OnChanges {
    forma: FormGroup;
    Codigos: FormArray;
    displayDialog: boolean = false;
    codigoContables: any[] = [];
    @Input() Articulo: EntProductos = new EntProductos();
    IdProducto: number;
    Descripcion: string;
    codigosContablesAll: EntCodigoContable[] = [];
    ArticuloRegistrado: any;
    centroCostos: any;
    nuevosCodigosConta: any[] = [];
    TodosCodigosContables: any[];
    constructor(
        private fb: FormBuilder,
        private nominaService: NominaService

    ) {
        this.ObtenerDatosIniciales();
    }

    ngOnInit() {
        this.IdProducto = this.Articulo.id;
        this.Descripcion = this.Articulo.descripcion;
        this.forma = this.createItem();
        this.ObtenerDatosIniciales();
        this.GetEmpresas();

    }
    ngOnChanges() {
        this.ArticuloElegido();
        if (this.Articulo && this.forma) {
            this.IdProducto = this.Articulo.id;
            this.Descripcion = this.Articulo.descripcion;
            this.forma.setValue({
                id: [this.IdProducto],
                descripcion: [this.Descripcion],
                empresa: [''],
                codigoContable: ['']
            })
        }
    }

    // nuevosCodigosConta
    AgregarCodigoContable(forma: any, pdEmpresa) {
        const found = this.nuevosCodigosConta.find(cc => cc.CodigoContable == forma.codigoContable);
        if (found) {
            Swal.fire({
                title: 'CODIGO CONTABLE REPETIDO',
                icon: 'warning',
                text: 'El Código lo acaba de Ingresar'
            });
            return;
        }
        const found3 = this.BuscarsiExiste(forma.codigoContable + '');
        if (found3) {
            Swal.fire({
                title: 'CODIGO CONTABLE REPETIDO',
                icon: 'warning',
                text: 'Ya Pertenece a Otro Articulo'
            });
            return;
        }

        this.nuevosCodigosConta.push({
            idEmpresa: forma.empresa,
            idProducto: forma.id,
            CodigoContable: forma.codigoContable
        });
        this.codigoContables.unshift({
            idProducto: forma.id,
            empresa: pdEmpresa.selectedOption.label,
            articulo: forma.descripcion,
            codigoContable: forma.codigoContable
        })
    }
    GetEmpresas() {
        this.nominaService.GetEmpresas().subscribe(data => {
            this.centroCostos = [];
            data.forEach((elemento: any) => {
                this.centroCostos.push({
                    label: elemento.marca,
                    value: elemento.nit
                });
            });
            this.centroCostos.unshift({ label: 'SELECCIONE LA EMPRESA ', value: null });
        }, error => {
            console.log(error);
        });
    }

    ObtenerDatosIniciales() {
        this.nominaService.GetCodigosContables().subscribe(resp => {
            this.codigosContablesAll = resp;
            this.TodosCodigosContables = resp[0].TodosCodigos;
            console.log(this.TodosCodigosContables);
            this.ArticuloElegido();
        });

    }
    Guardar() {


        this.nominaService.InsertCodigoConta(this.nuevosCodigosConta).subscribe(resp => {
            console.log(resp);
        })

    }

    BuscarsiExiste(codigo: string): boolean {
        const found = this.TodosCodigosContables.find(e => e.codContable == codigo)
        return found !== undefined;
    }
    createItem() {
        return this.fb.group({
            id: [this.IdProducto],
            descripcion: [this.Descripcion],
            empresa: [''],
            codigoContable: ['']
        });
    }
    ArticuloElegido() {
        this.codigoContables = [];
        this.ArticuloRegistrado = this.codigosContablesAll.filter((e => e.idProducto == this.Articulo.id));
        if (this.ArticuloRegistrado != null && this.ArticuloRegistrado != undefined && this.ArticuloRegistrado.length > 0) {
            const codigos = this.ArticuloRegistrado[0].Codigos;
            if (codigos !== null) {
                codigos.forEach(element => {
                    this.codigoContables.push({
                        idProducto: this.ArticuloRegistrado[0].idProducto,
                        empresa: element.marca,
                        articulo: this.ArticuloRegistrado[0].descripcion,
                        codigoContable: element.codContable
                    })
                });
            }

        }
    }
}
