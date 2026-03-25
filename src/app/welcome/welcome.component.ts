import { CarteraService } from './../services/cartera.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../routerAnimation';
import { BasicDataService } from '../services/basic-data.service';
import { SwPush } from '@angular/service-worker';
import { NominaService } from '../services/nomina.service'; 

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    animations: [fadeTransition()],
    standalone: false
})
export class WelcomeComponent implements OnInit {

  user: any;
  version;
  public readonly notifyPublicKey = 'BAUNfuAxaC0bDKYzHauI_pKSWRsmQuZEUnGDvGp78_Mda_mpBjJWeY5__7-VIqV12mJIQQM4UfLRjMLe9uQp_pE'
  respuesta:any;

  constructor(
    private storageService: StorageService,
    private title: Title,
    private basicDataService: BasicDataService,
    private carteraService: CarteraService,
    private swPush: SwPush, 
    private NominaService: NominaService
  ) {
    this.title.setTitle('Simovil');
    this.version = this.basicDataService.version;
  }

  ngOnInit() {
    this.decodeToken();
    this.usuarioInactivo();
    this.subribeToNotifications();
  }

  public decodeToken() {
    this.user = this.storageService.getCurrentUserDecode();
    console.log("user: ",this.user.Usuario)
  }

  usuarioInactivo(){
      this.carteraService.GetUser(this.storageService.getCurrentUserDecode().Usuario, null, false, null).subscribe(result =>{
          if(result.length > 0){
              this.storageService.logout();
          }
      });
  }

  subribeToNotifications(){
    this.swPush.requestSubscription({serverPublicKey: this.notifyPublicKey})
    .then(rest => {
      console.log(JSON.stringify(rest))
      const token = JSON.parse(JSON.stringify(rest))
      this.NominaService.guartarTokenNotifi(token,this.user.Usuario).subscribe(res => {
        console.log(res)
      })
    })
    .catch(err => {
      this.respuesta = err
    })
    console.log(this.respuesta)
  }

}
