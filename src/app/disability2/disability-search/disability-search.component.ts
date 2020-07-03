import { Component, OnInit } from '@angular/core';
import { EntDisability } from '../../Class/EntDisability';
import { EntAdministrator } from '../../Class/EntAdministrator';
import { NominaService } from '../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../services/util.service';
import { DISABILITNOVELTYTYPES } from '../../Class/DISABILITYNOVELTYTYPES';
import { Router, ActivatedRoute } from '@angular/router';
import { INoveltyTypes } from '../../Class/inovelty-types';
import { fadeTransition } from '../../routerAnimation';
import { PrincipalComponent } from '../../principal/principal.component';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-disability-search',
  templateUrl: './disability-search.component.html',
  styleUrls: ['./disability-search.component.css'],
  animations: [fadeTransition()]
})
export class DisabilitySearchComponent implements OnInit {
  disabilities: EntDisability[];
  administrators: EntAdministrator[];
  motivos: IMotivos[];
  noveltyTypes: INoveltyTypes[];
  noveltyVisible: boolean = false;
  historyVisible: boolean = false;
  disability: EntDisability;
  idSel;
  motiveSel: IMotivos;
  stationSel;
  statusSel: INoveltyTypes;
  administratorSel = new EntAdministrator();
  employeeSel;

  constructor(
    private nominaService: NominaService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private utilService: UtilService,
    private principalComponent: PrincipalComponent,
    private basicDataService: BasicDataService
  ) {
    this.title.setTitle('Buscar incapadidades - Simovil')
    this.motivos = [
      { id: 1, detalle: 'EG' },
      { id: 2, detalle: 'AT' },
      { id: 3, detalle: 'LM' }
    ];
    this.noveltyTypes = Object.create(DISABILITNOVELTYTYPES);
  }

  ngOnInit() {
    this.getbasicData();
  }

  assignqueryValues() {
    this.route.queryParams.subscribe(params => {
      this.idSel = params['id'];
      // this.motiveSel = params['motive'];
      // this.stationSel = params['station'];
      // this.statusSel = params['status'];
      this.administratorSel = this.administrators.find(e => e.idAdministradora == params['administrator']);
      this.employeeSel = params['employee'];
      if (Object.keys(params).length > 0) {
        this.getDisabilities();
      }
    });
  }

  getbasicData() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.utilService.loader(false);
      this.administrators = data.filter(e => e.tipoAdministradora == 1 || e.tipoAdministradora == 4);
      this.assignqueryValues();
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
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

  getMotiveName(id: number) {
    if (id != null)
      return this.motivos.find(
        e => e.id == id
      ).detalle;
  }

  getAdminstratorName(id: number) {
    if (id && this.administrators)
      return this.administrators.find(
        e => e.idAdministradora == id
      ).nombreAdministradora;
  }

  getDisabilities() {
    this.utilService.loader(true);
    let id = (this.idSel == '' || this.idSel == null) ? null : this.idSel;
    let motive = this.motiveSel == null ? null : this.motiveSel.id;
    let station = (this.stationSel == '' || this.stationSel == null) ? null : this.stationSel;
    let status = this.statusSel == null ? null : this.statusSel.id;
    let admin = this.administratorSel == null ? null : this.administratorSel.idAdministradora;
    let employee = (this.employeeSel == '' || this.employeeSel == null) ? null : this.employeeSel;
    this.nominaService.GetDisability(id, status, admin, employee, motive, station).subscribe(data => {
      this.assign(data);
      this.utilService.loader(false);
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }

  assign(data: EntDisability[]) {
    if (data.length == 0) {
      this.principalComponent.showMsg('info', 'Información', 'Consulta sin registros');
    } else {
      data.map(e => e.novedadIncapacidad = JSON.parse(String(e.novedadIncapacidad)));
    this.disabilities = data;
    }
  }

  searchHistory(disability: EntDisability) {
    // this.router.navigate(['/disability/history/' + btoa(disability.id.toString())]);
    this.historyVisible = true;
    this.disability = disability;
  }

  addNovelty(disability: EntDisability) {
    if (this.basicDataService.checkPermisionUrl('/disability/novelty')) {
      if (disability.estado == 2)
        this.router.navigate(['/disability/payment/add'], { queryParams: { admin: btoa(disability.administradora.toString()), val: btoa(disability.saldo.toString()) } });
      if (disability.estado == 0)
        this.toFiled(disability);
      this.noveltyVisible = true;
      this.disability = disability;
    } else
      this.principalComponent.showMsg('info', 'Información', 'No tiene los permisos requeridos');
  }

  Color(estado: number) {
    switch (estado) {
      case 0:
        return 'tb color_red';
      case 1:
        return 'tb color_yellow';
      case 2:
        return 'tb color_blue';
    }
  }

  submitAddNovelty(value: { result: boolean, disability: EntDisability }) {
    let index;
    if (value && value.result) {
      index = this.disabilities.findIndex(e => e.id == value.disability.id);
      if (value.disability.estado >= 3)
        this.disabilities.splice(index, 1);
      else
        this.disabilities[index].estado = value.disability.estado;
    }
    this.noveltyVisible = false;
    this.disability = null;
  }

  toFiled(disability: EntDisability) {
    if (disability.radicado)
      this.router.navigate(['/disability/filed/search/' + btoa(disability.radicado.toString())]);
    else
      this.router.navigate(['/disability/filed/add']);
  }

  clearDisabilities() {
    this.disabilities = [];
    this.idSel = null;
    this.stationSel = null;
    this.statusSel = null;
    this.administratorSel = null;
    this.employeeSel = null;
    this.motiveSel = null;
  }
}

interface IMotivos {
  id: number;
  detalle: string;
}
