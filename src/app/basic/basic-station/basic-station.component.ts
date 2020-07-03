import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-basic-station',
  templateUrl: './basic-station.component.html',
  styleUrls: ['./basic-station.component.css'],
  animations: [fadeAnimation]
})
export class BasicStationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
