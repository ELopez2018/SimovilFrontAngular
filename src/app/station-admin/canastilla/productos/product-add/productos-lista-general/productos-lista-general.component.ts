import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { NominaService } from '../../../../../services/nomina.service';
import { EntProductos } from '../../../../../Class/EntProductos';



@Component({
    selector: 'app-productos-lista-general',
    templateUrl: './productos-lista-general.component.html',
    styleUrls: ['./productos-lista-general.component.css']
})
export class ProductosListaGeneralComponent implements OnInit {
    cars: any[];

    cols: any[];

    brands: SelectItem[];

    colors: SelectItem[];

    yearFilter: number;

    yearTimeout: any;
    displayDialog: boolean = false;
    productosAll: EntProductos[] = [];
    producto: EntProductos;
    constructor(
        private nominaService: NominaService
    ) { }

    ngOnInit(): void {

    this.nominaService.GetProductos(null, null, null, null).subscribe( resp =>{
    this.productosAll = resp;
    // console.log(this.productosAll);
    });
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'descripcion', header: 'Descripcion' },
            { field: 'tamano', header: 'Tamaño' },
            { field: 'UnMedida', header: 'Presentacion' },
            { field: 'empresa', header: 'Empresa' }
        ];

    }

    onYearChange(event, dt) {
        if (this.yearTimeout) {
            clearTimeout(this.yearTimeout);
        }

        this.yearTimeout = setTimeout(() => {
            dt.filter(event.value, 'year', 'gt');
        }, 250);

    }
    AgregarCodigoContable(articulo) {
        this.producto = null;
        this.producto = articulo;
        this.displayDialog = true;
    }
}

