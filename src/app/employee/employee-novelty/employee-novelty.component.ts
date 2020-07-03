import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-employee-novelty',
  templateUrl: './employee-novelty.component.html',
  styleUrls: ['./employee-novelty.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class EmployeeNoveltyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
