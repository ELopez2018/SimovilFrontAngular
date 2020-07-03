import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-station-admin-sheet-daily',
  templateUrl: './station-admin-sheet-daily.component.html',
  styleUrls: ['./station-admin-sheet-daily.component.css'],
  animations: [fadeAnimation]
})
export class StationAdminSheetDailyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
