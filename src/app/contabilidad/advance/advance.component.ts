import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class AdvanceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
