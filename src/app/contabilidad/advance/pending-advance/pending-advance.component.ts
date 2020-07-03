import { Component, OnInit } from '@angular/core';
import { EntAdvance } from '../../../Class/EntAdvance';
import { ADVANCENOVELTYTYPES } from '../../../Class/ADVANCENOVELTYTYPES';
import { EntProvider } from '../../../Class/EntProvider';
import { CarteraService } from '../../../services/cartera.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';
import { fadeTransition } from '../../../routerAnimation';
import { TABLEADVANCEPENDING, iTableConfig } from '../../../Class/TABLES_CONFIG';

@Component({
  selector: 'app-pending-advance',
  templateUrl: './pending-advance.component.html',
  styleUrls: ['./pending-advance.component.css'],
  animations: [fadeTransition()]
})
export class PendingAdvanceComponent implements OnInit {

  advances: EntAdvance[];
  noveltyTypes = ADVANCENOVELTYTYPES;
  providers: EntProvider[];
  advanceSel: EntAdvance;
  boolHistory = false;
  boolNovelty = false;
  configTable: iTableConfig[];
  booleanTableConfig = false;
  nameTAbleConfig: string;

  constructor(
    private carteraService: CarteraService,
    private router: Router,
    private title: Title,
    private utilService: UtilService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Anticipos pendientes - Simovil')

  }

  ngOnInit() {
    if (this.storageService.getTableConfg('advancePending') != null)
      this.configTable = this.storageService.getTableConfg('advancePending');
    else {
      this.configTable = TABLEADVANCEPENDING;
      this.storageService.setTableConfg('advancePending', TABLEADVANCEPENDING);
    }
    this.getAdvances();
    this.getProviders();
  }

  getNameProvider(id: number) {
    if (this.providers == null || id == null)
      return;
    return this.providers.find(
      e => e.nit == id
    ).nombre;
  }

  getStatusName(id: number) {
    try {
      if (id != null)
        return this.noveltyTypes.find(
          e => e.id == id
        ).name;
    } catch (error) {
      return '';
    }
  }

  getAdvances() {
    this.utilService.loader(true);
    let rol = this.storageService.getCurrentUserDecode().idRol;
    this.carteraService.getAdvancesPending('' + rol).subscribe(data => {
      this.assignAdvances(data);
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getProviders() {
    this.utilService.loader(true);
    this.carteraService.getProvider().subscribe(data => {
      this.providers = data;
      this.utilService.loader(false);
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }

  searchHistory(advance: EntAdvance) {
    this.advanceSel = advance;
    this.boolHistory = true;
  }

  assignAdvances(data: EntAdvance[]) {
    data.forEach(e => {
      if (e.novedadAnticipo)
        e.novedadAnticipo = JSON.parse(e.novedadAnticipo.toString());
    });
    this.advances = data;
  }

  addNovelty(advance: EntAdvance) {
    // this.router.navigate(['/advance/novelty/' + btoa(advance.idAnticipo.toString())]);
    this.advanceSel = advance;
    this.boolNovelty = true;
  }

  porCobrar(estado: number) {
    switch (estado) {
      case 0:
        return 'tb color_red';
      case 1:
        return 'tb color_green';
      case 2:
        return 'tb color_blue';
    }
  }

  resultNovelty(result: { advance: EntAdvance, result: boolean, delete: boolean }) {
    let index = this.advances.findIndex(e => e.idAnticipo == result.advance.idAnticipo);
    if (result.delete) {
      this.advances.splice(index, 1);
    } else if (result.result)
      this.advances[index] = result.advance;
    this.boolNovelty = false;
  }

  resultTableConfig() {
    this.configTable = this.storageService.getTableConfg('advancePending');
    this.booleanTableConfig = false;
  }

  configTb() {
    this.booleanTableConfig = true;
    this.nameTAbleConfig = 'advancePending';
  }

  exits(val: string) {
    try {
      return this.configTable.find(e => e.name == val).visible;
    } catch (error) {
      return false;
    }
  }
}
