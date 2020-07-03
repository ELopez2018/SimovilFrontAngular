import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../routerAnimation';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css'],
  animations: [fadeTransition()]
})
export class TurnoComponent implements OnInit {

  constructor(
    private title: Title
  ) {
    title.setTitle('Turnos - Simovil')
  }

  ngOnInit() {
  }

}
