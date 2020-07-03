import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../routerAnimation';
import { dateToISOString, addDays } from '../../util/util-lib';
import { CarteraService } from '../../services/cartera.service';
import { PrincipalComponent } from '../../principal/principal.component';
import { StorageService } from '../../services/storage.service';
import { UtilService } from '../../services/util.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EntTank } from '../../Class/EntTank';
import { EntTankReading } from '../../Class/EntTankReading';
import { EntStation } from '../../Class/EntStation';
import { EntArticleType } from '../../Class/EntArticleType';
import { EntGasReading } from '../../Class/EntGasReading';

@Component({
  selector: 'app-tank-rading',
  templateUrl: './tank-rading.component.html',
  styleUrls: ['./tank-rading.component.css'],
  animations: [fadeTransition()]
})
export class TankRadingComponent implements OnInit {

  constructor(
    private carteraService: CarteraService,
    // private nominaService: NominaService,
    private principal: PrincipalComponent,
    private storageService: StorageService,
    private utilService: UtilService,
    private fb: FormBuilder
  ) {
    this.codStation = this.storageService.getCurrentStation();
  }

  fecha = [];
  codStation: number;
  tabs;
  boolCreateRec = false;
  formInventory: FormGroup;
  formGas: FormGroup;
  gasReadings: EntGasReading[];
  inventoryReadings: EntTankReading[];
  stationSelected: EntStation[] = [];
  stationsAll: EntStation[];
  typeArticles: EntArticleType[];
  typeArticleSel: EntArticleType;

  get list() {
    return this.formInventory.get('list') as FormArray;
  }

  ngOnInit() {
    this.tabs = [
      { estado: true, classTab: '' },
      { estado: false, classTab: '' },
      { estado: false, classTab: '' }
    ];
    this.setTab(this.tabs);
    this.buildForms();
  }

  buildForms(): any {
    this.formInventory = this.fb.group({
      fecha: [dateToISOString(addDays(null, -1)), [Validators.required]],
      list: this.fb.array([])
    });
    console.log('formInventory', this.formInventory);

    this.formGas = this.fb.group({
      FECHA: [dateToISOString(addDays(null, -1)), [Validators.required]],
      CANTIDAD: [null, [Validators.required, Validators.min(0)]]
    });
    this.getTank();
    this.getTypeArt();
  }

  tabClass(value: number) {
    if (this.tabs[value].estado == true) {
      return;
    }
    else {
      this.tabs.forEach(e => {
        e.estado = false;
        e.classTab = '';
      });
      if (this.tabs[value].estado == false) {
        this.tabs[value].estado = true;
        this.tabs[value].classTab = 'active';
      }
    }
  }

  setTab(tabl) {
    tabl.forEach(element => {
      if (element.estado == true) {
        element.classTab = 'active';
        element.classPane = 'show active';
      } else {
        element.classTab = '';
        element.classPane = '';
      }
    });
  }

  getTank() {
    this.utilService.loader();
    this.carteraService.GetTank(this.codStation).subscribe(res => {
      this.assignTanks(res);
      this.utilService.loader(false);
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  getTypeArt() {
    this.carteraService.getArticleTypes2(this.codStation, 'L').subscribe(res => {
      this.typeArticles = res;
    }, error => {
      console.log(error);
    });
  }

  clearInsert() {
    this.formInventory.reset();
    this.getTank();
  }

  assignTanks(values: EntTank[]) {
    this.list.controls = [];
    values.map(e => {
      this.list.push(this.fb.group({
        ID_TANQUE: [e.ID, Validators.required],
        DESCRIPCION: e.DESCRIPCION,
        NUMERO: e.NUMERO,
        CANTIDAD: [null, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  submiter() {
    const res = this.formInventory.getRawValue();
    const a: EntTankReading[] = [];
    res.list.forEach(e => {
      a.push({ FECHA: res.fecha, ID_TANQUE: e.ID_TANQUE, CANTIDAD: e.CANTIDAD });
    });
    this.utilService.loader();
    this.carteraService.InsertTankReading(a).subscribe(res => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'Insertado correctamente');
      this.clearInsert();
    }, error => {
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  submiterGas() {
    const res: EntGasReading = this.formGas.getRawValue();
    res.ID_ESTACION = this.codStation;
    this.utilService.loader();
    this.carteraService.InsertGasReading(res).subscribe(res => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'Insertado correctamente');
      this.formGas.reset();
    }, error => {
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  getTankReading() {
    this.utilService.loader();
    const codeStation = this.codStation || this.stationSelected[0].idEstacion;
    const type = this.typeArticleSel ? this.typeArticleSel.ID : null;
    const dat = this.fecha[0] ? this.fecha[0] + '-01' : null;
    this.carteraService.GetTankReading(codeStation, dat, type).subscribe(res => {
      this.utilService.loader(false);
      this.inventoryReadings = res;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  clearTankReading() {
    this.fecha[0] = null;
    this.typeArticleSel = null;
  }

  getGasReading() {
    this.utilService.loader();
    const codeStation = this.codStation || this.stationSelected[1].idEstacion;
    const dat = this.fecha[1] ? this.fecha[1] + '-01' : null;
    this.carteraService.GetGasReading(codeStation, dat).subscribe(res => {
      this.utilService.loader(false);
      this.gasReadings = res;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  clearGasReading() {
    this.fecha[1] = null;
  }
}
