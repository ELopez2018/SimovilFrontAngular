import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../routerAnimation';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class EmployeeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}