import { Component, OnInit } from '@angular/core';
import { EntDisabilityPayment } from '../../../Class/EntDisabilityPayment';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { fadeTransition } from '../../../routerAnimation';
import { fadeAnimation } from '../../../animations';

@Component({
  selector: 'app-disability-payment-search',
  templateUrl: './disability-payment-search.component.html',
  styleUrls: ['./disability-payment-search.component.css'],
  animations: [fadeTransition(), fadeAnimation]
})
export class DisabilityPaymentSearchComponent implements OnInit {


  payments: EntDisabilityPayment[];
  payment: EntDisabilityPayment;
  searchNum = null;
  employee = null;
  disability = null;
  searchAdministrator: EntAdministrator;
  fechaIni = null;
  fechaFin = null;
  searchStation: number = null;
  administrator: EntAdministrator[];
  boolRadicar: boolean = false;
  metodos;

  constructor(
    // private carteraService: CarteraService,
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private utilService: UtilService,
    private route: ActivatedRoute
    // private printService: PrintService
  ) {
    this.title.setTitle('Buscar pago de incapacidad - Simovil');
  }

  ngOnInit() {
    this.getAdminsitrator();
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.searchNum = +atob(id);
      this.getDisabilityPayments()
    }
  }

  getAdminsitrator() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.administrator = data;
      this.utilService.loader(false);
      this.GetParam();
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }

  getDisabilityPayments() {
    this.utilService.loader(true);
    let admin = this.searchAdministrator == null ? null : this.searchAdministrator.idAdministradora;
    let searchNum = this.searchNum == null ? null : this.searchNum.length == 0 ? null : this.searchNum;
    let empleado = this.employee == null ? null : this.employee.length == 0 ? null : this.employee;
    let incapacidad = this.disability == null ? null : this.disability.length == 0 ? null : this.disability;
    this.nominaService.GetDisabilityPayment(searchNum, admin, empleado, this.fechaIni, this.fechaFin, incapacidad).subscribe(result => {
      if (result.length > 0)
        this.payments = result;
      else
        this.principal.showMsg('info', 'Información', 'Consulta sin resultados');
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
      this.utilService.loader(false);
    });
  }

  getNameAdministrator(id: number) {
    if (this.administrator == null || id == null)
      return;
    return this.administrator.find(
      e => e.idAdministradora == id
    ).nombreAdministradora;
  }

  clear() {
    this.payments = [];
    this.searchNum = null;
    this.searchAdministrator = null;
    this.fechaIni = null;
    this.fechaFin = null;
  }

}
