import { Component, OnInit } from '@angular/core';
import { EntDailySheet } from '../../../Class/EntDailySheet';
import { EntStation } from '../../../Class/EntStation';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PrintService } from '../../../services/print.service';
import { StorageService } from '../../../services/storage.service';
import { fadeTransition } from '../../../routerAnimation';
import {  Observable } from 'rxjs';
import { iParamRPTCartera } from '../../../Class/iRPT';
import { EntDailySheetSupport } from '../../../Class/EntDailySheetSupport';

@Component({
  selector: 'app-sheet-daily-search',
  templateUrl: './sheet-daily-search.component.html',
  styleUrls: ['./sheet-daily-search.component.css'],
  animations: [fadeTransition()]
})
export class SheetDailySearchComponent implements OnInit {

  dailySheets: EntDailySheet[];
  types = [{ id: null, text: 'TODOS' }, { id: 'L', text: 'LIQUIDOS' }, { id: 'G', text: 'GAS' }];
  typeSel: { id: string, text: string }= { id: null, text: 'TODOS' };
  fechaIni;
  fechaFin;
  searchStation: number = null;
  stationsAll: EntStation[];
  stationCode;
  stationSel = new EntStation();
  searchAdvance = false;
  dailySel: EntDailySheet;
  boolCartera = false;
  paramCartera: iParamRPTCartera
  boolAttached = false;
  dailyAttachedSelected: EntDailySheetSupport[];
  typeDisabled: boolean = true;
  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService,
    private printService: PrintService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Buscar factura - Simovil');
    this.stationCode = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    this.GetEstaciones();
  }
  GetEstaciones() {
    this.nominaService.GetStations().subscribe(data => {
        this.stationsAll = data;
        // console.log(this.stationsAll);
        if (this.stationCode) {
            this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            switch (this.stationSel.tipoEstacion) {
                case 1:
                    this.typeSel = this.types.find(e => e.id === 'G')
                break;
                case 2:
                    this.typeSel =this.types.find(e => e.id === 'L')
                break;
                default :
                this.typeSel = this.types.find(e => e.id === null)
            }
        }
        // console.log(this.stationSel, this.typeSel, this.types);
    }, error => console.error(error.error.message));
}
cambiaEstacion() {
    switch (this.stationSel.tipoEstacion) {
        case 1:
            this.typeSel = this.types.find(e => e.id === 'G')
        break;
        case 2:
            this.typeSel =this.types.find(e => e.id === 'L')
        break;
        default :
        this.typeSel = this.types.find(e => e.id === null)
    }
}
  getDailySheets() {
      // OBTIENE UNA LISTA CON LAS PLANILLAS
    //   console.log(this.typeSel);
    this.utilService.loader(true);
    let staionCod = this.stationCode ? this.stationCode : this.stationSel ? this.stationSel.idEstacion : null;
    this.carteraService.getDailySheet(staionCod, this.typeSel ? this.typeSel.id : null, this.fechaIni, this.fechaFin, null, false).subscribe(result => {
        this.utilService.loader(false);
        this.dailySheets = result;
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getDailySheetComplete(dailySheet: EntDailySheet): Observable<EntDailySheet> {
    this.utilService.loader(true);
    return new Observable<EntDailySheet>((observer) => {
      this.carteraService.getDailySheet(null, null, null, null, dailySheet.ID, true).subscribe(data => {
        this.utilService.loader(false);
        //console.log('getDailySheetComplete ', data);
        if (data && data.length == 1) {
          observer.next(data[0]);
        } else {
          observer.error('Error al obtener la planilla, multiples o ningun resultado.')
        }
        observer.complete();
      });
    });
  }


  getNameStation(id: number) {
    if (this.stationsAll == null || id == null) {
      return;
    }
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }

  clearDailySheet() {
    this.dailySheets = [];
    this.fechaIni = null;
    this.fechaFin = null;
    this.typeSel = null;
    this.stationSel = new EntStation();
  }

  download(dailySheet: EntDailySheet, view) {
    this.getDailySheetComplete(dailySheet).subscribe(planilla => {
       // console.log('download=>planilla', planilla);
      this.printService.printSheetDailyEasy(planilla, view, res =>
        this.principal.showMsg('error', 'error', res)
      );
    }, error => {
      this.principal.showMsg('error', 'error', error);
    });
  }

  cartera(planilla: EntDailySheet) {
    this.dailySel = planilla;
    this.paramCartera =
      {
        station: planilla.ID_ESTACION,
        dateIni: planilla.FECHA,
        dateEnd: planilla.FECHA,
        type: planilla.TIPO,
        month: false,
        option: null
      };
    this.boolCartera = true;
  }

  attached(item: EntDailySheet) {
    this.boolAttached = true;
    this.dailyAttachedSelected = item.PD_SOPORTE;
  }

  getAttached(item: EntDailySheetSupport) {
    this.utilService.loader(true);
    this.carteraService.GetPaymentCertificate(item.RUTA).subscribe(result => {
      this.printService.downloadFile(result.encode, result.name);
      this.utilService.loader(false);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
      this.utilService.loader(false);
    });
  }

}
