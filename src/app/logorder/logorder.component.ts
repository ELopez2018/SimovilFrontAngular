import { Component, OnInit } from '@angular/core';
import { NominaService } from '../services/nomina.service';
import { CalendarModule } from 'primeng/calendar';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../routerAnimation';

@Component({
  selector: 'app-logorder',
  templateUrl: './logorder.component.html',
  styleUrls: ['./logorder.component.css'],
  animations: [fadeTransition()]
})
export class LogorderComponent implements OnInit {

  logs: any;
  fechaIni: Date;
  fechaFinal: Date;
  iniStringDate;
  endStringDate;

  constructor(
    private nominaService: NominaService,
    private title: Title
  ) {
    title.setTitle('Registro de empleados - Simovil');
  }

  ngOnInit() {
// tslint:disable-next-line: prefer-const
    let fecha = new Date(Date.now());
// tslint:disable-next-line: prefer-const
    let year = fecha.getFullYear();
// tslint:disable-next-line: prefer-const
    let  month = fecha.getMonth();
    this.fechaIni = new Date(year, month, 1);
    this.fechaFinal = new Date(year, (month + 1), 0);
    this.iniStringDate = this.fechaIni.toISOString().split('T')[0];
    this.endStringDate = this.fechaFinal.toISOString().split('T')[0];
    console.log(this.fechaIni, this.fechaFinal);
  }

  getLogOrder() {
    this.nominaService.GetLogOrder(this.iniStringDate, this.endStringDate).subscribe
      (data => this.logs = data
      , error => console.log('Error')
      );
  }

  prueba(value, fecha) {
    if (fecha === '0') {
// tslint:disable-next-line: prefer-const
      let date: Date = new Date(value);
      // var otra = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDay().toString();
      this.iniStringDate = date.toISOString().split('T')[0];
    } else {
// tslint:disable-next-line: prefer-const
      let date: Date = new Date(value);
      // var otra = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDay().toString();
      this.endStringDate = date.toISOString().split('T')[0];
    }
  }
}
