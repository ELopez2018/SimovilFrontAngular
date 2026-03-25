import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa-tanque',
  templateUrl: './mapa-tanque.component.html',
  styleUrls: ['./mapa-tanque.component.css']
})
export class MapaTanqueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.cambiarBorde();
  }

  public num:number = 45;
  porcentaje:any = document.documentElement.style.setProperty
  ('--porcentaje', this.num +'%');
  bordeVerde= '0px 0 20px 4px rgb(4 255 0 / 80%)';
  bordeNaranja ='0px 0 20px 4px rgb(255 94 0 / 80%)';
  bordeRojo= '0px 0 20px 4px rgb(255 0 0 / 80%)';
  borde:any = document.documentElement.style.setProperty
  ('--borde',this.bordeVerde);

  cambiarBorde(){
    if (this.num <= 50)
    this.borde = document.documentElement.style.setProperty
    ('--borde',this.bordeRojo);
    if (this.num > 50 && this.num <= 65)
    this.borde= document.documentElement.style.setProperty
    ('--borde',this.bordeNaranja);
  }

  showMainContent: Boolean = true;

  mostrarUocultar:boolean = true;
  ShowHideButton() {
    this.showMainContent = this.showMainContent ? false : true;
 }
 VerUocultar(){
   this.mostrarUocultar = this.mostrarUocultar ? false : true;
 }

}
