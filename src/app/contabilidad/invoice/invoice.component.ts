import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class InvoiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
