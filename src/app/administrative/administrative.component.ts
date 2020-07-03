import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../routerAnimation';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class AdministrativeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
