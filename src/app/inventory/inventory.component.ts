import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [fadeAnimation]
})
export class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
