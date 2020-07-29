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
        // this.brands = [
        //     { label: 'All Brands', value: null },
        //     { label: 'Audi', value: 'Audi' },
        //     { label: 'BMW', value: 'BMW' },
        //     { label: 'Fiat', value: 'Fiat' },
        //     { label: 'Honda', value: 'Honda' },
        //     { label: 'Jaguar', value: 'Jaguar' },
        //     { label: 'Mercedes', value: 'Mercedes' },
        //     { label: 'Renault', value: 'Renault' },
        //     { label: 'VW', value: 'VW' },
        //     { label: 'Volvo', value: 'Volvo' }
        // ];

        // this.colors = [
        //     { label: 'White', value: 'White' },
        //     { label: 'Green', value: 'Green' },
        //     { label: 'Silver', value: 'Silver' },
        //     { label: 'Black', value: 'Black' },
        //     { label: 'Red', value: 'Red' },
        //     { label: 'Maroon', value: 'Maroon' },
        //     { label: 'Brown', value: 'Brown' },
        //     { label: 'Orange', value: 'Orange' },
        //     { label: 'Blue', value: 'Blue' }
        // ];

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'descripcion', header: 'Descripcion' },
            { field: 'tamano', header: 'Tamaño' },
            { field: 'UnMedida', header: 'Presentacion' },
            { field: 'empresa', header: 'Empresa' }
        ];

        // FilterUtils['custom'] = (value, filter): boolean => {
        //     if (filter === undefined || filter === null || filter.trim() === '') {
        //         return true;
        //     }

        //     if (value === undefined || value === null) {
        //         return false;
        //     }

        //     return parseInt(filter) > value;
        // }
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


