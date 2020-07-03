import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class OptionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
