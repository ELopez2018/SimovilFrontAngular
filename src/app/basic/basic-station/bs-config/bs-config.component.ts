import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EntStation, articulo_estacion } from '../../../Class/EntStation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { StorageService } from '../../../services/storage.service';
import { EntArticle } from '../../../Class/EntArticle';
import { EntIsland } from '../../../Class/EntIsland';
import { EntPump } from '../../../Class/EntPump';
import { EntHose } from '../../../Class/EntHose';
import { cleanString, focusById } from '../../../util/util-lib';

@Component({
  selector: 'app-bs-config',
  templateUrl: './bs-config.component.html',
  styleUrls: ['./bs-config.component.css']
})
export class BsConfigComponent implements OnInit {
  @Input() station: EntStation;
  @Output() submiter = new EventEmitter<{ obj: EntStation, result: boolean }>();
  islandForm: FormGroup;
  hoseForm: FormGroup;
  pumpForm: FormGroup;
  articles: EntArticle[];
  articlesBef: EntArticle[];
  index: number;
  articlesStation: articulo_estacion[];
  islas: EntIsland[];
  edit: boolean[] = [false, false, false];
  user;
  islandSel: EntIsland;
  hoseSel: EntHose;
  pumpSel: EntPump;
  booleanForm = [false, false, false];
  listHoses: EntHose[] = [];
  typeIsland = [{ id: 'L', text: 'Liquidos' }, { id: 'G', text: 'Gas' }];

  ngOnChanges(changes: SimpleChanges) {
    if (this.station) {
      this.articlesStation = JSON.parse(JSON.stringify(this.station.articulos)) || [];
      this.articles = this.articlesBef.filter(e => this.articlesStation.findIndex(f => f.ID_ARTICULO == e.ID) >= 0);
      this.assingIsland(this.station.islas);
      // this.cancel();
    }
    else {
      this.articlesStation = [];
      this.islas = [];
    }
  }

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private storageService: StorageService
  ) {
    this.user = storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.buildForm();
    this.carteraService.getArticles().subscribe(res => {
      this.articles = res;
      this.articlesBef = JSON.parse(JSON.stringify(res));
    }, error => {
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  buildForm(): any {
    this.islandForm = this.fb.group({
      ID: [''],
      NUM_ISL: ['', [Validators.required]],
      DETALLE: [{ value: '', disabled: true }, [Validators.required]],
      TIPO: [null, [Validators.required]],
      ID_ESTACION: ['', [Validators.required]]
    });
    this.pumpForm = this.fb.group({
      ID: [''],
      // NUM_SUR: [''],
      NUM_SUR: ['', [Validators.required]],
      DESCRIPCION: [{ value: '', disabled: true }, [Validators.required]],
      // ID_ISLA: ['']
      ID_ISLA: ['', [Validators.required]]
    });
    this.hoseForm = this.fb.group({
      ID: [''],
      ID_SURTIDOR: ['', [Validators.required]],
      // ID_SURTIDOR: [''],
      NUM_MAN: ['', [Validators.required]],
      // NUM_MAN: [''],
      DETALLE: [{ value: '', disabled: true }, [Validators.required]],
      ID_ARTICULO: ['', [Validators.required]]
    });
  }

  filterTypeStation() {
    let type;
    switch (this.station.tipoEstacion) {
      case 1:
        type = this.typeIsland.find(e => e.id == 'G');
        break;
      case 2:
        type = this.typeIsland.find(e => e.id == 'L');
        break;
    }
    if (type) {
      this.islandForm.get('TIPO').setValue(type);
      this.islandForm.get('TIPO').disable();
    }
  }

  updateHoseDet() {
    this.hoseForm.get('DETALLE').setValue('MANGUERA ' + cleanString(this.hoseForm.get('NUM_MAN').value));
  }
  updatePumpDet() {
    this.pumpForm.get('DESCRIPCION').setValue('SURTIDOR ' + cleanString(this.pumpForm.get('NUM_SUR').value));
  }
  updateIslandDet() {
    this.islandForm.get('DETALLE').setValue('ISLA ' + cleanString(this.islandForm.get('NUM_ISL').value));
  }

  getnameArt(val: number) {
    return this.articlesBef.find(e => e.ID === val).DESCRIPCION || '';
  }

  cancel(val) {
    this.booleanForm[val] = false;
    switch (val) {
      case 0:
        this.islandForm.reset();
        break;
      case 1:
        this.pumpForm.reset();
        break;
      case 2:
        this.hoseForm.reset();
        break;
      default:
        break;
    }
    // this.form.reset();
    // this.form.disable();
    // this.status = true;
    // this.resetStationsList();
  }

  end1() {
    this.nominaService.GetStations(this.station.idEstacion).subscribe(re => {
      this.submiter.emit({ obj: re[0], result: true });
    }, error => {
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  resetStationsList() {
    this.articles = JSON.parse(JSON.stringify(this.articlesBef));
  }

  del(item: articulo_estacion) {
    this.articlesStation = this.articlesStation.filter(e => e.ID_ARTICULO != item.ID_ARTICULO);
  }

  show(option) {
    switch (option['class']) {
      case 'dropdown-menu':
        option['class'] = 'dropdown-menu-show';
        break;
      case 'dropdown-menu-show':
        option['class'] = 'dropdown-menu';
        break;
      default:
        option['class'] = 'dropdown-menu-show';
    }
  }

  classSel(opc, num) {
    switch (num) {
      case 0:
        return this.islandSel && this.islandSel.ID == opc.ID ? 'seleccionada' : '';
      case 1:
        return this.pumpSel && this.pumpSel.ID == opc.ID ? 'seleccionada' : '';
      case 2:
        return this.hoseSel && this.hoseSel.ID == opc.ID ? 'seleccionada' : '';
    }
  }

  optionSelF(item, num) {
    this.hoseSel = null;
    this.pumpSel = null;
    this.islandSel = null;
    switch (num) {
      case 0:
        this.islandSel = item;
        break;
      case 1:
        this.pumpSel = item;
        this.islandSel = this.getisla(this.pumpSel.ID_ISLA);
        break;
      case 2:
        this.hoseSel = item;
        this.pumpSel = this.getSurtidor(this.hoseSel.ID_SURTIDOR);
        this.islandSel = this.getisla(this.pumpSel.ID_ISLA);
        break;
    }
    this.setListHose(num);
  }

  setListHose(val: number) {
    this.utilService.loader(true);
    this.listHoses = [];
    switch (val) {
      case 0:
        if (this.islandSel.SURTIDOR && this.islandSel.SURTIDOR.length > 0)
          this.islandSel.SURTIDOR.map(s => {
            if (s.MANGUERA && s.MANGUERA.length > 0)
              s.MANGUERA.map(m => {
                this.listHoses.push(m);
              });
          });
        break;
      case 1:
        if (this.pumpSel.MANGUERA && this.pumpSel.MANGUERA.length > 0)
          this.pumpSel.MANGUERA.map(e => this.listHoses.push(e));
        break;
      case 2:
        this.listHoses.push(this.hoseSel);
        break;
      case 3:
        if (this.islas.length && this.islas.length > 0)
          this.islas.map(i => {
            if (i.SURTIDOR && i.SURTIDOR.length > 0)
              i.SURTIDOR.map(s => {
                if (s.MANGUERA && s.MANGUERA.length > 0)
                  s.MANGUERA.map(m => {
                    this.listHoses.push(m);
                  });
              });
          });
        break;
    }
    this.utilService.loader(false);
  }


  getisla(val) {
    return this.islas.find(e => e.ID == val);
  }

  getSurtidor(val) {
    let surt: EntPump;
    this.islas.forEach(E => E.SURTIDOR.forEach(F => {
      if (F.ID == val)
        surt = F;
    }));
    return surt;
  }

  classItem(option, num) {
    let res;
    switch (num) {
      case 0:
        if (option.SURTIDOR && option.SURTIDOR.length > 0)
          return this.returnClass(option);
        else
          return 'fa fa-check fa-fw';
      case 1:
        if (option.MANGUERA && option.MANGUERA.length > 0)
          return this.returnClass(option);
        else
          return 'fa fa-check fa-fw';
      default:
        return 'fa fa-check fa-fw';
    }
  }

  returnClass(val) {
    return val['class'] == 'dropdown-menu' ? 'far fa-folder fa-fw' : 'far fa-folder-open fa-fw';
  }

  addHose(newI: boolean) {
    let formRes = this.hoseForm.getRawValue() as EntHose;
    formRes.ID_ARTICULO = (<any>formRes.ID_ARTICULO as EntArticle).ID;
    let tipo = this.getisla(this.getSurtidor(formRes.ID_SURTIDOR).ID_ISLA).TIPO;
    if (newI) {
      if (!this.existHose(formRes, tipo)) {
        this.utilService.loader(true);
        this.nominaService.InsertHose(formRes).subscribe(res => {
          formRes.ID = res.ID;
          this.pumpSel.MANGUERA.push(formRes);
          this.utilService.loader(false);
          this.booleanForm[2] = false;
        }, error => {
          console.log(error);
          this.utilService.loader(false);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
      } else
        this.principal.showMsg('error', 'Error', 'Número de manguera ya existe');
    } else {
      this.utilService.loader(true);
      this.nominaService.UpdateHose(formRes).subscribe(res => {
        this.utilService.loader(false);
        let index = this.pumpSel.MANGUERA.findIndex(i => i.ID == formRes.ID)
        this.pumpSel.MANGUERA[index].ID_ARTICULO = formRes.ID_ARTICULO;
        this.pumpSel.MANGUERA[index].DETALLE = formRes.DETALLE;
        this.pumpSel.MANGUERA[index].NUM_MAN = formRes.NUM_MAN;
        this.booleanForm[2] = false;
      }, error => {
        console.log(error);
        this.utilService.loader(false);
        this.principal.showMsg('error', 'Error', error.error.message);
      });
    }
  }

  addPump(newI: boolean) {
    let formRes = this.pumpForm.getRawValue() as EntPump;
    let tipo = this.getisla(formRes.ID_ISLA).TIPO;
    if (newI) {
      if (!this.existPump(formRes, tipo)) {
        this.utilService.loader(true);
        this.nominaService.InsertPump(formRes).subscribe(res => {
          this.utilService.loader(false);
          formRes.ID = res.ID;
          formRes.MANGUERA = formRes.MANGUERA && formRes.MANGUERA.length > 0 ? formRes.MANGUERA : [];
          formRes['class'] = 'dropdown-menu-show';
          this.islandSel.SURTIDOR.push(formRes);
          this.booleanForm[1] = false;
        }, error => {
          console.log(error);
          this.utilService.loader(false);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
      }
      else
        this.principal.showMsg('error', 'Error', 'Número de surtidor ya existe');
    }
    else {
      this.utilService.loader(true);
      this.nominaService.UpdatePump(formRes).subscribe(res => {
        let index = this.islandSel.SURTIDOR.findIndex(i => i.ID == formRes.ID)
        this.islandSel.SURTIDOR[index].DESCRIPCION = formRes.DESCRIPCION;
        this.islandSel.SURTIDOR[index].NUM_SUR = formRes.NUM_SUR;
        this.utilService.loader(false);
        this.booleanForm[1] = false;
      }, error => {
        this.utilService.loader(false);
        console.log(error);
        this.principal.showMsg('error', 'Error', error.error.message);
      });
    }
  }

  addIsland(newI: boolean) {
    let formRes = this.islandForm.getRawValue() as EntIsland;
    formRes.TIPO = formRes.TIPO['id'];
    if (newI) {
      if (!this.existIsland(formRes)) {
        this.utilService.loader(true);
        this.nominaService.InsertIsland(formRes).subscribe(res => {
          formRes.ID = res.ID;
          formRes.SURTIDOR = formRes.SURTIDOR && formRes.SURTIDOR.length > 0 ? formRes.SURTIDOR : [];
          formRes['class'] = 'dropdown-menu-show';
          this.islas.push(formRes);
          this.utilService.loader(false);
          this.booleanForm[0] = false;
        }, error => {
          this.utilService.loader(false);
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
      }
      else
        this.principal.showMsg('error', 'Error', 'Número de isla ya existe');
    }
    else {
      this.utilService.loader(true);
      this.nominaService.UpdateIsland(formRes).subscribe(res => {
        let index = this.islas.findIndex(i => i.ID == formRes.ID)
        this.islas[index].NUM_ISL = formRes.NUM_ISL;
        this.islas[index].DETALLE = formRes.DETALLE;
        this.utilService.loader(false);
        this.booleanForm[0] = false;
      }, error => {
        console.log(error);
        this.utilService.loader(false);
        this.principal.showMsg('error', 'Error', error.error.message);
      });
    }
  }

  existPump(pump: EntPump, islandType: string) {
    let res = false;
    this.islas.forEach(i => {
      i.SURTIDOR.forEach(s => {
        if (pump.NUM_SUR == s.NUM_SUR && i.TIPO == islandType)
          res = true;
      });
    });
    return res;
  }

  existHose(hose: EntHose, islandType: string) {
    let res = false;
    this.islas.forEach(i => {
      i.SURTIDOR.forEach(s => {
        s.MANGUERA.forEach(m => {
          if (hose.NUM_MAN == m.NUM_MAN && i.TIPO == islandType)
            res = true;
        });
      });
    });
    return res;
  }

  existIsland(island: EntIsland) {
    let res = false;
    this.islas.forEach(i => {
      if (island.NUM_ISL == i.NUM_ISL && island.TIPO == i.TIPO)
        res = true;
    });
    return res;
  }

  newitem() {
    switch (this.lastitemSel) {
      case 2:
        this.newHose(this.pumpSel);
        break;
      case 1:
        this.newPump(this.islandSel)
        break;
      case 0:
        this.newIsland();
        break;
    }
  }

  edititem() {
    switch (this.lastitemSel) {
      case 3:
        this.editHose();
        break;
      case 2:
        this.editPump();
        break;
      case 1:
        this.editIsland()
        break;
    }
  }

  get textnewitem() {
    switch (this.lastitemSel) {
      case 2:
        return 'Manguera';
      case 1:
        return 'Surtidor';
      case 0:
        return 'Isla';
    }
  };

  get lastitemSel() {
    if (this.hoseSel != null)
      return 3;
    else if (this.pumpSel != null)
      return 2;
    else if (this.islandSel != null)
      return 1;
    else
      return 0;
  }

  newIsland() {
    this.edit[0] = false;
    this.booleanForm[0] = true;
    this.islandForm.reset();
    this.islandForm.get('ID_ESTACION').setValue(this.station.idEstacion);
    setTimeout(() => {
      this.filterTypeStation();
      focusById('firstIsland');
    }, 10);
  }

  newPump(val: EntIsland) {
    this.islandSel = val;
    this.edit[1] = false;
    this.booleanForm[1] = true;
    this.pumpForm.reset();
    this.pumpForm.get('ID_ISLA').setValue(val.ID);
    setTimeout(() => {
      focusById('firstPump');
    }, 10);
  }

  newHose(val: EntPump) {
    this.pumpSel = val;
    this.edit[2] = false;
    this.booleanForm[2] = true;
    this.hoseForm.reset();
    this.hoseForm.get('ID_SURTIDOR').setValue(val.ID);
    setTimeout(() => {
      focusById('firstHose');
    }, 10);
  }

  editIsland() {
    this.booleanForm[0] = true;
    this.edit[0] = true;
    this.islandForm.setValue({
      ID: this.islandSel.ID,
      NUM_ISL: this.islandSel.NUM_ISL,
      DETALLE: this.islandSel.DETALLE,
      ID_ESTACION: this.islandSel.ID_ESTACION,
      TIPO: this.typeIsland.find(e => e.id == this.islandSel.TIPO)
    })
  }

  editPump() {
    // this.islandSel = val;
    this.booleanForm[1] = true;
    this.edit[1] = true;
    // this.pumpForm.reset();
    this.pumpForm.setValue({
      ID: this.pumpSel.ID,
      NUM_SUR: this.pumpSel.NUM_SUR,
      DESCRIPCION: this.pumpSel.DESCRIPCION,
      ID_ISLA: this.pumpSel.ID_ISLA
    });
  }

  editHose() {
    // this.pumpSel = val;
    this.booleanForm[2] = true;
    this.edit[2] = true;
    // this.hoseForm.reset();
    this.hoseForm.setValue({
      ID: this.hoseSel.ID,
      ID_SURTIDOR: this.hoseSel.ID_SURTIDOR,
      NUM_MAN: this.hoseSel.NUM_MAN,
      DETALLE: this.hoseSel.DETALLE,
      ID_ARTICULO: this.articles.find(e => e.ID == this.hoseSel.ID_ARTICULO)
    });
  }

  deleteIsland() {
    this.utilService.confirm('Va a eliminar la isla #' + this.islandSel.NUM_ISL + ', ¿Desea continuar?', res => {
      if (res)
        this.nominaService.DeleteIsland(this.islandSel).subscribe(re => {
          let ind = this.islas.findIndex(e => e.ID == this.islandSel.ID);
          this.islas.splice(ind, 1);
          this.principal.showMsg('success', 'Éxito', 'Isla eliminada correctamente');
          this.booleanForm[0] = false;
        }, error => {
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
    });
  }

  deletePump() {
    this.utilService.confirm('Va a eliminar el surtidor #' + this.pumpSel.NUM_SUR + ', ¿Desea continuar?', res => {
      if (res)
        this.nominaService.DeletePump(this.pumpSel).subscribe(re => {
          let ind = this.islandSel.SURTIDOR.findIndex(e => e.ID == this.pumpSel.ID);
          this.islandSel.SURTIDOR.splice(ind, 1);
          this.principal.showMsg('success', 'Éxito', 'Surtidor eliminado correctamente');
          this.booleanForm[1] = false;
        }, error => {
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
    });
  }

  deleteHose() {
    this.utilService.confirm('Va a eliminar la manguera #' + this.hoseSel.NUM_MAN + ', ¿Desea continuar?', res => {
      if (res)
        this.nominaService.DeleteHose(this.hoseSel).subscribe(re => {
          let ind = this.pumpSel.MANGUERA.findIndex(e => e.ID == this.hoseSel.ID);
          this.pumpSel.MANGUERA.splice(ind, 1);
          this.principal.showMsg('success', 'Éxito', 'Manguera eliminada correctamente');
          this.booleanForm[2] = false;
        }, error => {
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
    });
  }

  assingIsland(island: EntIsland[]) {
    this.listHoses = [];
    this.islas = JSON.parse(JSON.stringify(this.station.islas)) || [];
    this.islas.forEach(e => {
      e['class'] = 'dropdown-menu';
      e.SURTIDOR.forEach(el => {
        el['class'] = 'dropdown-menu';
        el.MANGUERA.forEach(ele => {
          ele['class'] = 'dropdown-menu';
        });
      });
    });
  }
}
