import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  animations: [fadeAnimation]
})
export class PaymentComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
