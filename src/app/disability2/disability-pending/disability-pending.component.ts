import { Component, OnInit } from '@angular/core';
import { EntDisability } from '../../Class/EntDisability';
import { EntAdministrator } from '../../Class/EntAdministrator';
import { NominaService } from '../../services/nomina.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../services/util.service';
import { INoveltyTypes } from '../../Class/inovelty-types';
import { DISABILITNOVELTYTYPES } from '../../Class/DISABILITYNOVELTYTYPES';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';
import { PrincipalComponent } from '../../principal/principal.component';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-disability-pending',
  templateUrl: './disability-pending.component.html',
  styleUrls: ['./disability-pending.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class DisabilityPendingComponent implements OnInit {
  disabilities: EntDisability[];
  administrators: EntAdministrator[];
  motivos: IMotivos[];
  noveltyTypes: INoveltyTypes[];
  noveltyVisible: boolean = false;
  historyVisible: boolean = false;
  disability: EntDisability;

  constructor(
    private nominaService: NominaService,
    private router: Router,
    private title: Title,
    private utilService: UtilService,
    private principalComponent: PrincipalComponent,
    private basicDataService: BasicDataService
  ) {
    this.title.setTitle('Incapacidades pendientes - Simovil')
    this.motivos = [
      { id: 1, detalle: 'EG' },
      { id: 2, detalle: 'AT' },
      { id: 3, detalle: 'LM' }
    ]
    this.noveltyTypes = Object.create(DISABILITNOVELTYTYPES);
  }

  ngOnInit() {
    this.getbasicData();
  }

  getbasicData() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.utilService.loader(false);
      this.administrators = data;
      this.getDisabilities();
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
    this.nominaService.GetDisabilitiesPending().subscribe(data => {
      this.assign(data);
      this.utilService.loader(false);
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }

  assign(data: EntDisability[]) {
    if (data.length == 0)
      this.principalComponent.showMsg('info', 'Información', 'Consulta sin registros');
    else
      data.map(e => e.novedadIncapacidad = JSON.parse(String(e.novedadIncapacidad)));
    this.disabilities = data;
  }
  searchHistory(disability: EntDisability) {
    // this.router.navigate(['/disability/history/' + btoa(disability.id.toString())]);
    this.historyVisible = true;
    this.disability = disability;
  }

  addNovelty(disability: EntDisability) {
    // this.router.navigate(['/disability/novelty/' + btoa(disability.id.toString())]);
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
        return 'tb color_green';
      case 3:
        return 'tb color_blue';
    }
  }

  submitAddNovelty(value: { result: boolean, disability: EntDisability }) {
    let index;
    if (value && value.result) {
      index = this.disabilities.findIndex(e => e.id == value.disability.id);
      if (value.disability.estado >= 4)
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
}

interface IMotivos {
  id: number;
  detalle: string;
}