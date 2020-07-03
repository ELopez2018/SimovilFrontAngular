import { Component, OnInit } from '@angular/core';
import { PrincipalComponent } from '../../../principal/principal.component';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { EntFiled } from '../../../Class/EntFiled';
import { INoveltyTypes } from '../../../Class/inovelty-types';
import { fadeTransition } from '../../../routerAnimation';
import { EntDisability } from '../../../Class/EntDisability';

@Component({
  selector: 'app-filed-search',
  templateUrl: './filed-search.component.html',
  styleUrls: ['./filed-search.component.css'],
  animations: [fadeTransition()]
})
export class FiledSearchComponent implements OnInit {

  filed: EntFiled[];
  filedSel: EntFiled;
  searchNum = null;
  searchAdministrator: EntAdministrator;
  fechaIni = null;
  fechaFin = null;
  searchStation: number = null;
  noveltyTypes;
  noveltyTypeSelected: INoveltyTypes;
  administrator: EntAdministrator[];
  boolRadicar: boolean = false;
  boolDisabilities: boolean = false;
  metodos;
  disabilities: EntDisability[];

  constructor(
    // private carteraService: CarteraService,
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService,
    private route: ActivatedRoute
    // private printService: PrintService
  ) {
    this.title.setTitle('Buscar radicado - Simovil');
  }

  ngOnInit() {
    this.getAdminsitrator();
    this.noveltyTypes = [
      { id: 0, name: 'Creado' },
      { id: 1, name: 'Radicado' }
    ];
    this.metodos = [
      { id: 0, name: 'Mensajero' },
      { id: 1, name: 'Empresa mensajería' },
      { id: 2, name: 'E-mail' },
      { id: 3, name: 'Página web' },
      { id: 4, name: 'Asesor' }
    ];
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.searchNum = +atob(id);
      this.getFiled()
    }
  }

  getAdminsitrator() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.administrator = data.filter(e => e.tipoAdministradora == 1 || e.tipoAdministradora == 4);
      this.utilService.loader(false);
      this.GetParam();
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }

  getFiled() {
    this.utilService.loader(true);
    let status = this.noveltyTypeSelected == null ? null : this.noveltyTypeSelected.id;
    let admin = this.searchAdministrator == null ? null : this.searchAdministrator.idAdministradora;
    let searchNum = this.searchNum == null ? null : this.searchNum.length == 0 ? null : this.searchNum;
    this.nominaService.GetFiled(searchNum, status, admin, this.fechaIni, this.fechaFin).subscribe(result => {
      this.filed = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  nameNoveltyType(code: number) {
    if (this.noveltyTypes == null)
      return;
    return this.noveltyTypes.find(e => e.id == code).name;
  }

  nameSendType(code: number) {
    if (this.metodos == null || code == null)
      return
    return this.metodos.find(e => e.id == code).name;
  }

  getNameAdminsitrator(id: number) {
    if (this.administrator == null || id == null)
      return;
    return this.administrator.find(
      e => e.idAdministradora == id
    ).nombreAdministradora;
  }

  clearFiled() {
    this.filed = [];
    this.searchNum = null;
    this.searchAdministrator = null;
    this.noveltyTypeSelected = null;
    this.fechaIni = null;
    this.fechaFin = null;
  }

  updateFiled(result: { filed: EntFiled, result: boolean }) {
    if (result.result) {
      let index = this.filed.findIndex(e => e.idRadicado == result.filed.idRadicado);
      this.filed[index] = result.filed;
    }
    this.filedSel = null;
    this.boolRadicar = false;
  }

  visibleRad(filed: EntFiled) {
    this.filedSel = filed;
    let adm = this.administrator.find(e => e.idAdministradora == filed.administradora).nombreAdministradora;
    this.boolRadicar = true;
  }

  searchDisability(id: number) {
    this.utilService.loader(true);
    this.nominaService.GetDisability(null, null, null, null, null, null, id).subscribe(result => {
      this.utilService.loader(false);
      if (result && result.length > 0) {
        this.disabilities = result;
        this.boolDisabilities = true;
      }
      else
        this.principal.showMsg('info', 'Información', 'Consulta sin datos');
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }
}
