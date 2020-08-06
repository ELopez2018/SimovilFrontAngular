import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../../../../services/cartera.service';
import { NominaService } from '../../../../../services/nomina.service';

@Component({
    selector: 'app-product-codigo-edit',
    templateUrl: './product-codigo-edit.component.html',
    styleUrls: ['./product-codigo-edit.component.css']
})
export class ProductCodigoEditComponent implements OnInit {
    cols: any;
    productosAll: any[] = [];
    displayDialog: boolean = false;
    constructor(
        private carteraService: CarteraService,
        private nominaService:NominaService
    ) { }

    ngOnInit(): void {
        this.carteraService.getCodContables().subscribe(resp => {
            console.log(resp);
        });

        this.nominaService.GetProductos(null, null, null, null).subscribe( resp =>{
            this.productosAll = resp;
            console.log(this.productosAll);
            });
    }

    ActualizarArticulo(articulo) {
        console.log(articulo);
    }



}
