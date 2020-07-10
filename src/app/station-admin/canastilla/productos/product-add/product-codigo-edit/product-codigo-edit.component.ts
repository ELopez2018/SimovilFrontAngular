import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../../../../services/cartera.service';

@Component({
  selector: 'app-product-codigo-edit',
  templateUrl: './product-codigo-edit.component.html',
  styleUrls: ['./product-codigo-edit.component.css']
})
export class ProductCodigoEditComponent implements OnInit {

  constructor(
      private carteraService: CarteraService
  ) { }

  ngOnInit(): void {
      this.carteraService.getCodContables().subscribe( resp => {
          console.log(resp);
      })
  }

}
