import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';

@Component({
  selector: 'app-filed',
  templateUrl: './filed.component.html',
  styleUrls: ['./filed.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class FiledComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
