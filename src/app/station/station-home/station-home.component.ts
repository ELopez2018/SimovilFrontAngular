import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { EntConsumptionClient } from '../../Class/EntConsumptionClient';
import { NominaService } from '../../services/nomina.service';
import { StorageService } from '../../services/storage.service';
import { EntStation } from '../../Class/EntStation';
import { EntHomeStation } from '../../Class/EntHomeStation';
import { EntReceivable } from '../../Class/EntReceivable';
import { PrintService } from '../../services/print.service';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-station-home',
  templateUrl: './station-home.component.html',
  styleUrls: ['./station-home.component.css'],
  animations: [fadeTransition()]
})
export class StationHomeComponent implements OnInit {
  user: string;
  codEstation: number;
  stationsAll: EntStation[];
  homeStation: EntHomeStation;
  receivables: EntReceivable[];
  DiaSemaforo = [7, 16];

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private storageService: StorageService,
    private printService: PrintService,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Estación Home')
    this.user = this.storageService.getCurrentUserDecode().Usuario;
    this.codEstation = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    this.getReceivables();
    this.homeStation = new EntHomeStation();
    this.nominaService.GetStations().subscribe(data => {
      this.stationsAll = data;
    }, error => console.log(error));
    this.getHomeStation();
  }

  getNameStation(id: number) {
    if (this.stationsAll == null || id == null)
      return;
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }


  getReceivables() {
    this.carteraService.getReceivable(null, true, null, null, null, this.codEstation).subscribe(data =>
      this.receivables = data,
      error => console.log(error),
      () => console.log('completado')
    );
  }

  getHomeStation() {
    let stationcode = this.storageService.getCurrentStation();
    // this.codEstation = stationcode;
    this.carteraService.getHomeStation(stationcode).subscribe(data => {
      this.homeStation = data[0];
    }, error => console.log(error.error.message))
  }

  porCobrar(fecha: string) {
    let fechamod = new Date(fecha);
    var actual = new Date();
    var diff = actual.getTime() - fechamod.getTime();
    if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[0])
      return 'tb sem1';
    else if (diff / (1000 * 60 * 60 * 24) < this.DiaSemaforo[1])
      return 'tb sem2';
    else
      return 'tb sem3';
  }

  addDate(value) {
    var da = new Date(value);
    return da.setDate(da.getDate() + 15);
  }

  printReceivable(receivable: EntReceivable) {
    this.utilService.loader(true);
    var consumosC: EntConsumptionClient[];
    this.carteraService.getConsumption(receivable.codCliente, null, null, receivable.id, null).subscribe(consumos => {
      consumosC = consumos
      this.printService.printReceivable(receivable, consumosC,
        this.stationsAll.find(e => e.idEstacion == receivable.estacion), result => {
          this.utilService.loader(false);
        });
    }, error =>
        console.log(error));
  }
}
