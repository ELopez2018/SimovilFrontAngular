import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  animations: [fadeAnimation,fadeTransition()]
})
export class PaymentComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
