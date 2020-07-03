import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
