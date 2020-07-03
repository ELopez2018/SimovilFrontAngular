import { Component, OnInit } from '@angular/core';
import { EntReceivable } from '../../../Class/EntReceivable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { currencyNotDecimal, focusById, cleanString } from '../../../util/util-lib';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { fadeTransition } from '../../../routerAnimation';
import { PAYMENTMETHODS } from '../../../Class/PAYMENTMETHODS';
import { EntPayment } from '../../../Class/EntPayment';

@Component({
  selector: 'app-payment-other',
  templateUrl: './payment-other.component.html',
  styleUrls: ['./payment-other.component.css'],
  animations: [fadeTransition()]
})
export class PaymentOtherComponent implements OnInit {
  addPaymentForm: FormGroup;
  displayDialogReceivable = false;
  receivables: EntReceivable[];
  receivableSelected: EntReceivable;
  client: EntBasicClient;
  formasPago: any[];
  formasPagoAll: any[];
  boolSearchClient;
  notdecimal = currencyNotDecimal();

  constructor(
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private title: Title,
    private fb: FormBuilder,
    private utilService: UtilService
  ) {
    this.title.setTitle('Otros pagos - Simovil');
    this.buildForm();
  }

  ngOnInit() {
    this.receivableSelected = new EntReceivable();
    this.client = new EntBasicClient();
    this.formasPagoAll = Object.create(PAYMENTMETHODS);
    this.formasPago = this.formasPagoAll.filter(e => e.id == 5);
    focusById('btnBoolClient', true);
  }

  buildForm() {
    this.addPaymentForm = this.fb.group({
      paymentId: [null, Validators.required],
      paymentName: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      valuePayment: [null, Validators.required],
      saldoCuentaCobro: [null, Validators.required],
      cuentaCobro: [null, Validators.required],
      cuentaCobroNum: [null, Validators.required],
      formaPago: [null, Validators.required],
      fechaPago: [null, Validators.required],
      detalle: ['', Validators.required]
    });
  }

  DateToLocalString(date: any) {
    if (date == null)
      return null;
    return new Date(date).toLocaleDateString();
  }

  DateToIsoString(date: any, addDay: number) {
    if (date == null)
      return null;
    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + addDay).toISOString().split('T');
    return newDate[0];
  }

  SearchClientPayment(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.getClients(value, null, null, null, null)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.principalComponent.showMsg('warn', 'Advertencia', 'Cliente no existe');
          return;
        }
        this.client = data[0];
        this.addPaymentForm.controls["paymentName"].setValue(this.client.nombre);
      }, error => {
        console.log("Sin registro");
      });
  }

  ReceivableSelected(value: EntReceivable) {
    this.receivableSelected = value;
    this.addPaymentForm.controls['valuePayment'].setValidators(
      [
        Validators.required,
        Validators.max(value.saldo)
      ]);
    this.addPaymentForm.get('cuentaCobroNum').setValue(value.num);
    this.addPaymentForm.get('cuentaCobro').setValue(value.id);
    this.addPaymentForm.get('saldoCuentaCobro').setValue(value.saldo);
    this.addPaymentForm.get('valuePayment').updateValueAndValidity();
    this.addPaymentForm.updateValueAndValidity();
    this.displayDialogReceivable = false;
    setTimeout(() => {
      focusById(this.addPaymentForm.valid ? 'btnSave' : 'valorPag', true);
    }, 10);
  }

  submitAddPayment() {
    let payment = new EntPayment();
    let payfor = this.addPaymentForm.getRawValue();
    payment.cliente = payfor.paymentId;
    payment.cuentaCobro = payfor.cuentaCobro;
    payment.valor = payfor.valuePayment;
    payment.fechaPago = payfor.fechaPago;
    payment.formaPago = payfor.formaPago ? payfor.formaPago.id : null;
    payment.anticipo = this.client.tipoCupo == 2;
    payment.ASIGNADO = true;
    payment.DETALLE = cleanString(payfor.detalle);
    this.submiter(payment);
  }

  submiter(payment: EntPayment) {
    this.utilService.confirm('Va a realizar un pago a ' + this.client.nombre + ' ¿Desea continuar?', res => {
      if (res) {
        this.utilService.loader();
        this.carteraService.InsertPayment(payment).subscribe(fila => {
          this.utilService.loader(false);
          this.principalComponent.showMsg('success', 'Éxito', 'Pago creado correctamente');
          this.receivables = null;
          this.addPaymentForm.reset();
        }, error => {
          this.utilService.loader(false);
          console.log(error);
          this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  resetPaymentForm() {
    this.receivables = null;
    this.addPaymentForm.reset();
  }

  getReceivable() {
    this.receivables = null;
    this.utilService.loader();
    this.carteraService.getReceivable(this.client.codCliente, true, null, null, null, null).subscribe(receivables => {
      this.utilService.loader(false);
      if (receivables.length > 0) {
        this.receivables = receivables;
        this.displayDialogReceivable = true;
        setTimeout(() => {
          focusById('btnReceivable0', true);
        }, 10);
      } else
        this.principalComponent.showMsg('info', 'Información', 'El cliente no cuenta con cuentas de cobro');
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  getFormaPago(value) {
    if (value != null) {
      return this.formasPagoAll.find(e => e.id == value).text;
    }
  }

  searchClient() {
    if (this.client.codCliente == null)
      return;
    this.carteraService.getClients(this.client.codCliente, null, null, null, null).subscribe(client => {
      if (client.length != 0)
        this.client = client[0];
      else {
        this.principalComponent.showMsg('info', 'Información', 'Cliente no encontrado.')
      }
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  getCodClient(client: EntBasicClient) {
    if (client.tipoCupo == 2) {
      this.addPaymentForm.get('saldoCuentaCobro').disable();
      this.addPaymentForm.get('cuentaCobro').disable();
      this.addPaymentForm.get('cuentaCobroNum').disable();
    } else if (client.tipoCupo == 1) {
      this.addPaymentForm.get('saldoCuentaCobro').enable();
      this.addPaymentForm.get('cuentaCobro').enable();
      this.addPaymentForm.get('cuentaCobroNum').enable();
    }
    this.addPaymentForm.get('paymentId').setValue(client.codCliente);
    this.addPaymentForm.get('paymentId').disable();
    this.addPaymentForm.get('paymentName').setValue(client.nombre);
    this.client = client;
    this.boolSearchClient = false;
    focusById('btnCuCobro');
  }

  boolClient(val) {
    this.boolSearchClient = true
    this.client = new EntBasicClient();
    setTimeout(() => {
      focusById('searchCli');
    }, 10);
  }

  get valorPago() { return this.addPaymentForm.get('valuePayment').value }
  get valorCuentaCobro() { return this.addPaymentForm.get('saldoCuentaCobro').value }
  get PagoMayorACuentaCobro() { return this.valorPago > this.valorCuentaCobro }
}
