import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [fadeAnimation]
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
