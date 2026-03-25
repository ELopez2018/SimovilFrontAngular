import { PrincipalComponent } from './../../principal/principal.component';
import { CarteraService } from './../../services/cartera.service';
import { EntArticle } from './../../Class/EntArticle';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-combustible',
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class CombustibleComponent implements OnInit {

    @Input() idConsumo: number = 0;
    @Input() articulo;
    articles: EntArticle[];
    idArticulo: number = 0;

  constructor(private carteraService: CarteraService,
    private principal: PrincipalComponent) { }

  ngOnInit(): void {
      this.getProductos();
  }

  getProductos(){
      console.log('obtener productos...');
      this.carteraService.getArticles().subscribe(res => {
          this.articles = res;
      }, error => {
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
      });
  }

  updateCombustible(id_Consumo, id_articulo){
      console.log('id consumo: '+id_Consumo+', id articulo: '+id_articulo);
      this.carteraService.actualizarCombustible(id_Consumo, id_articulo).subscribe(result => {
        this.principal.showMsg('success', 'Éxito', 'Comte combustible ha sido actualizado con éxito. '+JSON.stringify(result));
        }, error => {
        console.log('error, updateCombustible: Component');
        this.principal.showMsg('error', 'Error', error.error.message);
        });
  }

}
