import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { EntInvoice } from '../../../Class/EntInvoice';
import { currencyNotDecimal, focusById } from '../../../util/util-lib';
import { PrincipalComponent } from '../../../principal/principal.component';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.css'],
  animations: [fadeTransition()]
})
export class InvoicePaymentComponent implements OnInit {
  invoiceForm: FormGroup;
  boolShow = false;
  notdecimal = currencyNotDecimal();

  constructor(
    private fb: FormBuilder,
    private carteraService: CarteraService,
    private utilService: UtilService,
    private principal: PrincipalComponent
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  get Lista() {
    return this.invoiceForm.get('list') as FormArray;
  }

  get sumList() {
    return this.Lista.controls.reduce((a, b) => a + b.get('valor').value, 0)
  }

  buildForm() {
    this.invoiceForm = this.fb.group({
      list: this.fb.array([]),
      fecha: [null, Validators.required]
    });
  }

  addItem(val: EntInvoice) {
    if (this.existItem(val) == -1) {
      this.Lista.push(this.fb.group({
        id: [val.id, Validators.required],
        nombre: [{ value: val.nombre, disabled: true }, Validators.required],
        numero: [{ value: val.numero, disabled: true }, Validators.required],
        saldo: [{ value: val.saldo, disabled: true }, Validators.required],
        valor: [val.saldo, [Validators.required, Validators.min(1)]],
        detalles: ['']
      }));
      this.boolShow = false;
      setTimeout(() => {
        focusById('val-' + (this.Lista.length - 1));
      }, 10);
    } else {
      this.principal.showMsg('info', 'Información', 'Esta factura ya fue agregada');
    }
  }

  removeItem(val) {
    if (this.existItem(val) != -1) {
      this.Lista.removeAt(this.existItem(val));
    }
  }

  submiter() {
    let raw = this.invoiceForm.getRawValue();
    let item = [];
    raw.list.map(e => {
      item.push({ ID_FACTURA: e.id, VALOR: e.valor, DETALLE: e.detalles});
    });
    this.utilService.loader();
    this.carteraService.InsertWholesalerPayment(item, raw.fecha).subscribe(res => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'Proceso realizado correctamente');
      this.reset();
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  reset() {
    this.Lista.controls = [];
    this.invoiceForm.reset();
  }

  existItem(val: EntInvoice) {
    return this.Lista.controls.findIndex(e => e.get('id').value == val.id);
  }

}
