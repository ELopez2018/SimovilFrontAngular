import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../routerAnimation';
import { EntStation } from '../../../Class/EntStation';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { NominaService } from '../../../services/nomina.service';
import { EntStationType } from '../../../Class/EntStationType';
import { CarteraService } from '../../../services/cartera.service';

@Component({
  selector: 'app-bs-search',
  templateUrl: './bs-search.component.html',
  styleUrls: ['./bs-search.component.css'],
  animations: [fadeTransition()]
})
export class BsSearchComponent implements OnInit {
  stations: EntStation[];
  stationType: EntStationType[];
  searchid: string = '';
  boolEdit = false;
  boolEditArt = false;
  boolEditConf = false;
  boolEditDailySheet = false;
  stationSel: EntStation;
  types = [{ id: 'L', text: 'LIQUIDOS' }, { id: 'G', text: 'GAS' }];
  typeSel: { id, text };
  fecha;
  editdaily = false;

  constructor(
    private nominaService: NominaService,
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Buscar estación')
  }

  ngOnInit() {
    this.utilService.loader(true);
    this.carteraService.getStationType().subscribe(res => {
      this.stationType = res;
      this.utilService.loader(false);
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  getStation() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchid.trim() == '')
      buscar = null;
    else
      buscar = this.searchid.trim().replace(' ', "%");
    this.nominaService.GetStations(null, buscar).subscribe(result => {
      this.stations = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getType(station: EntStation) {
    try {
      return this.stationType.find(e => e.idTipoEstacion == station.tipoEstacion).detalleTipoEstacion;
    } catch (error) {
      return;
    }
  }

  clear() {
    this.stations = [];
    this.searchid = '';
  }

  deleteStation(station: EntStation) {
    this.utilService.confirm('¿Desea eliminar la estación ' + station.nombreEstacion + '?', data => {
      if (data) {
        this.nominaService.DeleteStation(station).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Estación ' + station.nombreEstacion + ' eliminada correctamente.');
          this.stations = this.stations.filter(e => e.idEstacion != station.idEstacion);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  editStation(station: EntStation) {
    this.boolEdit = true;
    this.stationSel = station;
  }

  artStation(station: EntStation) {
    this.boolEditArt = true;
    this.stationSel = station;
  }

  confStation(station: EntStation) {
    this.boolEditConf = true;
    this.stationSel = station;
  }

  dailyStation(station: EntStation) {
    this.fecha = null;
    this.typeSel = null;
    this.boolEditDailySheet = true;
    this.stationSel = station;
  }

  resEdit(res: { obj: EntStation, result: boolean }) {
    if (res.result) {
      let index = this.stations.findIndex(e => e.idEstacion == res.obj.idEstacion);
      this.stations[index] = res.obj;
    }
    this.cancelEdit();
  }

  resEditArt(res: { obj: EntStation, result: boolean }) {
    if (res.result) {
      let index = this.stations.findIndex(e => e.idEstacion == res.obj.idEstacion);
      this.stations[index] = res.obj;
    }
    this.cancelEditArt();
  }

  resEditConf(res: { obj: EntStation, result: boolean }) {
    if (res.result) {
      let index = this.stations.findIndex(e => e.idEstacion == res.obj.idEstacion);
      this.stations[index] = res.obj;
    }
    this.cancelEditConf();
  }

  classStatus(val: boolean) {
    return val ? 'fa fa-check-circle fa-fw text-success' : 'fa fa-times-circle fa-fw text-danger';
  }

  cancelEdit() {
    this.boolEdit = false;
    // this.stationSel = null;
  }

  cancelEditDailySheet() {
    this.boolEditDailySheet = false;
    // this.stationSel = null;
  }

  cancelEditConf() {
    this.boolEditConf = false;
    // this.stationSel = null;
  }

  cancelEditArt() {
    this.boolEditArt = false;
    // this.stationSel = null;
  }

  get validedit() {
    return this.stationSel && this.fecha && this.typeSel ? true : false;
  }

  gettoEdit() {
    this.carteraService.getDailySheet(this.stationSel.idEstacion, this.typeSel.id, this.fecha, this.fecha).subscribe(res => {
      if (res && res.length == 1)
        this.principal.showMsg('info', 'Información', 'Edición ' + (res[0].EDITABLE ? 'habilitada' : 'deshabilitada'));
      else
        this.principal.showMsg('error', 'Error', 'Sin resultados');
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  toedit(val: boolean) {
    this.carteraService.toEditDailySheet(this.stationSel.idEstacion, this.typeSel.id, this.fecha, val).subscribe(res => {
      this.principal.showMsg('success', 'Éxito', 'Edición ' + (val ? 'habilitada' : 'deshabilitada'));
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }
}
