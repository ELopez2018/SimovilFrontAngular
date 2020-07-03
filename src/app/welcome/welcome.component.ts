import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { EntUser } from '../Class/EntUser';
import { StorageService } from '../services/storage.service';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../routerAnimation';
import { BasicDataService } from '../services/basic-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [fadeTransition()]
})
export class WelcomeComponent implements OnInit {

  user: any;
  version;

  constructor(
    private storageService: StorageService,
    private title: Title,
    private basicDataService: BasicDataService
  ) {
    this.title.setTitle('Simovil');
    this.version = this.basicDataService.version;
  }

  ngOnInit() {
    this.decodeToken();
  }


  public decodeToken() {
    this.user = this.storageService.getCurrentUserDecode();
  }
}
