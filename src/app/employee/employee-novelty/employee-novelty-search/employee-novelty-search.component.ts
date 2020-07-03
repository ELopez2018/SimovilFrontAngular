import { Component, OnInit } from '@angular/core';
import { EntEmployeeNovelty } from '../../../Class/EntEmployeeNovelty';
import { EntEmployeeNoveltyType } from '../../../Class/EntEmployeeNoveltyType';
import { EntEmployee } from '../../../Class/EntEmployee';
import { NominaService } from '../../../services/nomina.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { fadeAnimation } from '../../../animations';
import { fadeTransition } from '../../../routerAnimation';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';

@Component({
  selector: 'app-employee-novelty-search',
  templateUrl: './employee-novelty-search.component.html',
  styleUrls: ['./employee-novelty-search.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class EmployeeNoveltySearchComponent implements OnInit {

  novelties: EntEmployeeNovelty[];
  noveltyTypes: EntEmployeeNoveltyType[];
  employees: EntEmployee;
  idSel;
  noveltyTypeSel;
  employeeSel;
  fechaIni;
  fechaFin;

  constructor(
    private nominaService: NominaService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private utilService: UtilService,
    private principalComponent: PrincipalComponent
    // private storageService: StorageService
  ) {
    this.title.setTitle('Buscar novedades - Simovil')
  }

  ngOnInit() {
    this.getbasicData();
  }

  getbasicData() {
    this.utilService.loader(true);
    this.nominaService.GetEmployeeNoveltyType().subscribe(data => {
      this.utilService.loader(false);
      this.noveltyTypes = data;
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getNoveltyTypeName(id: number) {
    if (id != null)
      return this.noveltyTypes.find(
        e => e.idTipoNovedad == id
      ).detalleTipoNovedad;
  }

  getEmployeeNovelty() {
    this.utilService.loader(true);
    let id = (this.idSel == '' || this.idSel == null) ? null : this.idSel;
    let employee = (this.employeeSel == '' || this.employeeSel == null) ? null : this.employeeSel;
    let noveltyType = this.noveltyTypeSel ? this.noveltyTypes.find(e => e == this.noveltyTypeSel).idTipoNovedad : null;
    this.nominaService.GetEmployeeNovelty(id, noveltyType, employee, this.fechaIni, this.fechaFin)
      .subscribe(data => {
        this.assign(data);
        this.utilService.loader(false);
      },
        error => {
          this.principalComponent.showMsg('error', 'Error', error.error.message);
          console.log(error);
          this.utilService.loader(false);
        });
  }

  assign(data: EntEmployeeNovelty[]) {
    if (data.length == 0){
      this.principalComponent.showMsg('info', 'Información', 'Consulta sin registros');
      this.novelties = [];
    }
    else
      this.novelties = data;
  }

  // searchHistory(disability: EntDisability) {
  //   // this.router.navigate(['/disability/history/' + btoa(disability.id.toString())]);
  //   this.historyVisible = true;
  //   this.disability = disability;
  // }

  // Color(estado: number) {
  //   switch (estado) {
  //     case 0:
  //       return 'tb color_red';
  //     case 1:
  //       return 'tb color_yellow';
  //     case 2:
  //       return 'tb color_blue';
  //   }
  // }

  // submitAddNovelty(value: { result: boolean, disability: EntDisability }) {
  //   let index;
  //   if (value && value.result) {
  //     index = this.disabilities.findIndex(e => e.id == value.disability.id);
  //     if (value.disability.estado >= 3)
  //       this.disabilities.splice(index, 1);
  //     else
  //       this.disabilities[index].estado = value.disability.estado;
  //   }
  //   this.noveltyVisible = false;
  //   this.disability = null;
  // }

  // toFiled(disability: EntDisability) {
  //   if (disability.radicado)
  //     this.router.navigate(['/disability/filed/search/' + btoa(disability.radicado.toString())]);
  //   else
  //     this.router.navigate(['/disability/filed/add']);
  // }

  clear() {
    this.novelties = [];
    this.idSel = null;
    this.employeeSel = null;
    this.noveltyTypeSel = null;
    this.fechaIni = null;
    this.fechaFin = null;
  }
}