import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-station-admin',
  templateUrl: './station-admin.component.html',
  styleUrls: ['./station-admin.component.css'],
  animations: [fadeAnimation]
})
export class StationAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
