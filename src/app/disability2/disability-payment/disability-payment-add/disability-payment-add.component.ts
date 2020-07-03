import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { UtilService } from '../../../services/util.service';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';
import { EntDisability } from '../../../Class/EntDisability';
import { fadeAnimation } from '../../../animations';
import { fadeTransition } from '../../../routerAnimation';
import { EntDisabilityPayment } from '../../../Class/EntDisabilityPayment';
import { ActivatedRoute } from '@angular/router';
import { currencyNotDecimal } from '../../../util/util-lib';

@Component({
  selector: 'app-disability-payment-add',
  templateUrl: './disability-payment-add.component.html',
  styleUrls: ['./disability-payment-add.component.css'],
  animations: [fadeAnimation, fadeTransition()]
})
export class DisabilityPaymentAddComponent implements OnInit {

  paymentForm: FormGroup;
  administrators: EntAdministrator[];
  rol;
  boolDisabilities = false;
  boolDisabilities2 = false;
  disabilities: EntDisability[];
  disabilitiesSel: EntDisability[] = [];
  historyVisible = false;
  disability: EntDisability;
  motivos;
  notdecimal = currencyNotDecimal();

  constructor(
    private utilService: UtilService,
    private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getbasicData();
    this.motivos = [
      { id: 1, detalle: 'EG' },
      { id: 2, detalle: 'AT' },
      { id: 3, detalle: 'LM' }
    ]
  }

  getbasicData() {
    this.utilService.loader(true);
    this.nominaService.GetAdminsitrator().subscribe(data => {
      this.utilService.loader(false);
      this.administrators = data.filter(e => e.tipoAdministradora == 1 || e.tipoAdministradora == 4);
      this.getParam();
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  getParam() {
    this.route.queryParams.subscribe(result => {
      if (result) {
        if (result.admin) {
          let admin = +atob(result.admin);
          this.paymentForm.get('administradora').setValue(this.administrators.find(e => e.idAdministradora == admin))
        }
        if (result.val) {
          let val = +atob(result.val);
          this.paymentForm.get('valor').setValue(val);
        }
      }
    });
  }

  buildForm() {
    this.paymentForm = this.fb.group({
      administradora: ['', Validators.required],
      fecha: ['', Validators.required],
      valor: [null, Validators.required],
      detalle: ['', Validators.required]
    });
  }

  clearForm() {
    this.paymentForm.reset();
    this.boolDisabilities = false;
    this.boolDisabilities2 = false;
    this.paymentForm.enable();
    this.disabilities = [];
    this.disabilitiesSel = [];
  }

  ValidForm() {
    this.paymentForm.disable();
    this.boolDisabilities = true;
    this.boolDisabilities2 = true;
    this.getDisabilities();
  }

  getDisabilities() {
    let admin = this.paymentForm.get('administradora').value == null ? null : this.paymentForm.get('administradora').value.idAdministradora;
    this.boolDisabilities = true;
    this.utilService.loader(true);
    this.nominaService.GetDisabilitiesPending(+admin).subscribe(data => {
      this.assign(data);
      this.utilService.loader(false);
    },
      error => {
        console.log(error);
        this.utilService.loader(false);
      });
  }


  getMotiveName(id: number) {
    if (id != null) {
      return this.motivos.find(
        e => e.id == id
      ).detalle;
    }
  }

  assign(data: EntDisability[]) {
    if (data.length == 0) {
      this.principalComponent.showMsg('info', 'Información', 'Consulta sin registros');
    } else {
      data = data.filter(e => e.estado == 2);
      data.map(e => {
        e.novedadIncapacidad = JSON.parse(String(e.novedadIncapacidad));
        e['metPago'] = 1;
        if (this.disabilitiesSel.find(el => el.id == e.id) == null) {
          e['sel'] = false;
        } else {
          e['sel'] = true;
        }
      });
    }
    this.disabilities = data;
  }

  searchHistory(disability: EntDisability) {
    // this.router.navigate(['/disability/history/' + btoa(disability.id.toString())]);
    this.historyVisible = true;
    this.disability = disability;
  }

  addRemove(disability: EntDisability) {
    if (!disability) {
      return;
    }
    let boolresult = this.disabilitiesSel.find(e => e.id == disability.id) == null ? true : false;
    if (boolresult) {
      disability['sel'] = true;
      this.disabilitiesSel.push(disability);
      this.disabilities.find(e => e.id == disability.id)['sel'] = true;
    } else {
      disability['sel'] = false;
      let index = this.disabilitiesSel.findIndex(e => e.id == disability.id);
      this.disabilitiesSel.splice(index, 1);
      this.disabilities.find(e => e.id == disability.id)['sel'] = false;
    }
  }

  submiter() {
    if (this.formValid()) {
      this.utilService.loader(true);
      let obj = new EntDisabilityPayment();
      obj.administradora = this.paymentForm.get('administradora').value == null ? null : +this.paymentForm.get('administradora').value.idAdministradora;
      obj.fecha = this.paymentForm.get('fecha').value;
      obj.valor = +this.paymentForm.get('valor').value;
      obj['detalle'] = String(this.paymentForm.get('detalle').value).trim();
      obj['usuario'] = this.storageService.getCurrentUserDecode().Usuario;
      obj['incapacidades'] = this.orderPayments();

      this.nominaService.InsertDisabilityPayment(obj).subscribe(result => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('success', 'Éxito', 'Pago registrado con éxito');
        this.clearForm();
      }, error => {
        this.utilService.loader(false);
        console.log(error);
        this.principalComponent.showMsg('error', 'Error', error.error.message);
      });
    } else {
      this.principalComponent.showMsg('error', 'Error', 'Hay valores incompletos o no válidos');
    }
  }

  orderPayments(): any[] {
    let obj = [];
    this.disabilitiesSel.map(e => {
      let item = { id: e.id, opcion: e['metPago'], valor: e['pago'] }
      obj.push(item);
    });
    return obj;
  }

  addRemoveSelected(disability: EntDisability) {
    if (!disability) {
      return;
    }
    let disLocal = this.disabilitiesSel.find(e => e.id == disability.id);
    if (disability['metPago'] == 0) {
      disLocal['metPago'] = 1
    } else {
      disLocal['metPago'] = 0
    }
    // this.disabilities.find(e => e.id == disability.id)['metPago'] = false;
  }

  formValid(): boolean {
    let result = true;
    // result = this.disabilitiesSel.findIndex(e => e['pago'] == null) >= 0 ? false : true;
    this.disabilitiesSel.map(e => {
      if (e['pago'] == null || e['pago'] < 0) {
        result = false;
      }
    });
    console.log(this.disabilitiesSel);
    return result;
  }
}
