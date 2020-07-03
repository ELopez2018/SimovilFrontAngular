import { Component, OnInit } from '@angular/core';
import { EntAdvance } from '../../../Class/EntAdvance';
import { EntProvider } from '../../../Class/EntProvider';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { PrintService } from '../../../services/print.service';
import { ADVANCENOVELTYTYPES } from '../../../Class/ADVANCENOVELTYTYPES';
import { fadeTransition } from '../../../routerAnimation';
import { INoveltyTypes } from '../../../Class/inovelty-types';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css'],
  animations: [fadeTransition()]
})
export class AdvanceSearchComponent implements OnInit {

  advances: EntAdvance[];
  searchNum = null;
  searchNumPro = null;
  fechaIni;
  fechaFin;
  noveltyTypes: INoveltyTypes[];
  noveltyTypeSelected: INoveltyTypes;
  providers: EntProvider[];
  advanceSel: EntAdvance;
  boolHistory = false;
  boolProvider = false;

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private utilService: UtilService,
    private printService: PrintService
  ) {
    this.title.setTitle('Buscar factura - Simovil');
    this.noveltyTypes = ADVANCENOVELTYTYPES;
  }

  ngOnInit() {
    this.getProviders();
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

  getAdvances() {
    this.utilService.loader(true);
    let status = this.noveltyTypeSelected == null ? null : this.noveltyTypeSelected.id;
    let searchNumAdvance = this.searchNum == null ? null : this.searchNum.length == 0 ? null : this.searchNum;
    let searchNumAdvancePRo = this.searchNumPro == null ? null : this.searchNumPro.length == 0 ? null : this.searchNumPro;
    this.carteraService.getAdvance(searchNumAdvance, searchNumAdvancePRo, this.fechaIni, this.fechaFin, status).subscribe(result => {
      result.forEach(e => e.novedadAnticipo = JSON.parse(String(e.novedadAnticipo)));
      this.advances = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  nameNoveltyType(code: number) {
    try {
      if (this.noveltyTypes == null)
        return;
      return this.noveltyTypes.find(e => e.id == code).name;
    } catch (error) {
      return '';
    }
  }

  getNameProvider(id: number) {
    if (this.providers == null || id == null)
      return;
    return this.providers.find(
      e => e.nit == id
    ).nombre;
  }

  clearAdvances() {
    this.advances = [];
    this.searchNum = null;
    this.searchNumPro = null;
    this.noveltyTypeSelected = null;
  }

  addAdvanceNovelty(advance: EntAdvance) {
    this.router.navigate(['/advance/novelty/' + btoa(advance.idAnticipo.toString())]);
  }

  searchHistory(advance: EntAdvance) {
    this.advanceSel = advance;
    this.boolHistory = true;
  }

  getPaymentCertificate(advance: EntAdvance) {
    this.utilService.loader(true);
    this.carteraService.GetPaymentCertificate(advance.rutaPago).subscribe(result => {
      this.printService.downloadFile(result.encode, result.name);
      this.utilService.loader(false);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
      this.utilService.loader(false);
    });
  }

  assignProvider(provider: EntProvider) {
    this.searchNumPro = provider.nit;
    this.getAdvances();
    this.boolProvider = false;
  }
}
