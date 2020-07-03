import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-disability-payment',
  templateUrl: './disability-payment.component.html',
  styleUrls: ['./disability-payment.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class DisabilityPaymentComponent implements OnInit {
    Area;
  constructor(
      private storageService: StorageService
  ) {
    this.Area = this.storageService.getCurrentUserDecode().Area;
   }

  ngOnInit() {
  }

}
