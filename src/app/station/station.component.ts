import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../routerAnimation';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class StationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
