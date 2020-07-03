import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../routerAnimation';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-disability2',
  templateUrl: './disability2.component.html',
  styleUrls: ['./disability2.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class Disability2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
