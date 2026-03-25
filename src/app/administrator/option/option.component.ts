import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';
import { SwPush } from '@angular/service-worker';
import { NominaService } from '../../services/nomina.service';

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.css'],
    animations: [fadeAnimation, fadeTransition()],
    standalone: false
})
export class OptionComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
