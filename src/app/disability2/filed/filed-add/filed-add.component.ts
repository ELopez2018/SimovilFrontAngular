import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { EntDisability } from '../../../Class/EntDisability';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { INoveltyTypes } from '../../../Class/inovelty-types';
import { DISABILITNOVELTYTYPES } from '../../../Class/DISABILITYNOVELTYTYPES';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-filed-add',
  templateUrl: './filed-add.component.html',
  styleUrls: ['./filed-add.component.css'],
  animations: [fadeTransition()]
})
export class FiledAddComponent implements OnInit {

  disabilities: EntDisability[];
  disabilitiesSM: EntDisability[];
  administrators: EntAdministrator[];
  motivos: IMotivos[];
  noveltyTypes: INoveltyTypes[];

  constructor(
    private utilService: UtilService,
    private principalComponent: PrincipalComponent,
    private nominaService: NominaService,
    private title: Title
  ) {
    this.title.setTitle('Crear radicados - Simovil');
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

  getbasicData() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.utilService.loader(false);
      this.administrators = data.filter(e => e.tipoAdministradora == 1 || e.tipoAdministradora == 4);
      this.getDisabilities();
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getDisabilities() {
    this.utilService.loader(true);
    this.nominaService.GetDisability(null, null, null, null, null, null, null, true).subscribe(result => {
      this.utilService.loader(false);
      this.disabilities = result;
      this.disabilitiesSM = Object.assign(result);
      if (result && result.length == 0)
        this.principalComponent.showMsg('info', 'Información', 'Sin resultados');
    }, error => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  autoCreate() {
    this.utilService.confirm('El proceso generará automaticamente los radicados por la entidad responsable ¿Desea continuar?', res => {
      if (res) {
        this.utilService.loader(true);
        this.nominaService.createFileDisability().subscribe(result => {
          this.utilService.loader(false);
          this.principalComponent.showMsg('success', 'Éxito', 'El proceso fue ejecutado correctamente');
        }, error => {
          this.utilService.loader(false);
          this.principalComponent.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    })
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

  updateDisability(disability: EntDisability) {
    this.utilService.loader(true);
    let dis = new EntDisability();
    dis.id = disability.id;
    dis.radicar = !disability.radicar;
    this.nominaService.UpdateDisability(dis).subscribe(res => {
      this.utilService.loader(false);
      disability.radicar = !disability.radicar;
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message);
      console.log(error);
      this.utilService.loader(false);
    });
  }

  updateAll(val: boolean) {
    this.utilService.loader(true);
    this.nominaService.UpdateAllDisability(val).subscribe(result => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('success', 'Correcto', 'Actualizado correctamente');
      this.getDisabilities();
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    })
  }
}


interface IMotivos {
  id: number;
  detalle: string;
}