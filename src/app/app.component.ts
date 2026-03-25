import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'App Movilgas Ltda';

  constructor(private primengConfig: PrimeNGConfig) { }
  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }  
}
