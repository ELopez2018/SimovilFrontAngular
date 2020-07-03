import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { fadeAnimation } from '../../animations';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class ClientComponent implements OnInit {


  constructor(
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Clientes - Simovil');
   }

}
