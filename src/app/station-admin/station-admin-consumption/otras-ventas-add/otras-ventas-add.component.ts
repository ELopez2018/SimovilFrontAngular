import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otras-ventas-add',
  templateUrl: './otras-ventas-add.component.html',
  styleUrls: ['./otras-ventas-add.component.css']
})
export class OtrasVentasAddComponent implements OnInit {
    boolSearchClient: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  getCodClient($event): void {
    console.log($event);
    this.boolSearchClient = false;
  }
  searchClient(): void  {
    this.boolSearchClient = true;
  }
}
