import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class ProviderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
