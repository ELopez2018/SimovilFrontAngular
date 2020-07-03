import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-station-admin-consumption',
  templateUrl: './station-admin-consumption.component.html',
  styleUrls: ['./station-admin-consumption.component.css'],
  animations: [fadeAnimation]
})
export class StationAdminConsumptionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
