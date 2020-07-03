import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  animations: [fadeAnimation]
})
export class RoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
