import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CarteraService } from '../../services/cartera.service';
import { EntQuotaType } from '../../Class/EntQuotaType';
import { EntQuota } from '../../Class/EntQuota';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../../routerAnimation';
import { EntDiscount } from '../../Class/EntDiscount';
import { EntArticleType } from '../../Class/EntArticleType';
import { forkJoin } from 'rxjs';
import { focusById, currencyNotDecimal } from '../../util/util-lib';

@Component({
  selector: 'app-cupo',
  templateUrl: './cupo.component.html',
  styleUrls: ['./cupo.component.css'],
  animations: [fadeTransition()]
})
export class CupoComponent implements OnInit {
  quotaForm: FormGroup;
  quotaTypes: EntQuotaType[];
  quotas: EntQuota[];
  selectedQuota: EntQuota;
  quota: EntQuota;
  discount: EntDiscount[];
  articleTypes: EntArticleType[];
  discounts: EntDiscount[];
  listDiscount: FormArray;
  boolDiscountForm = false;
  boolDiscountShow = false;
  indexselDiscount;
  notdecimal = currencyNotDecimal();

  constructor(
    private fb: FormBuilder,
    private carteraService: CarteraService,
    private principalComponent: PrincipalComponent,
    private route: ActivatedRoute,
    private location: Location,
    private title: Title
  ) {
    this.buildForm();
    this.title.setTitle('Cupos - Simovil');
  }

  ngOnInit() {
    this.getBasicData();
  }

  getParameter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id == 'new') {
      this.quotaForm.controls['codCliente'].enable();
    } else {
      this.validarCliente(id);
      this.quotaForm.controls['codCliente'].setValue(id);
    }
  }

  buildForm() {
    this.quotaForm = this.fb.group({
      codCliente: ['', Validators.compose([Validators.required])],
      nombreCliente: [''],
      cupoAsignado: ['', Validators.required],
      tipoCupo: ['', Validators.required],
      listDescuento: this.fb.array([])
    });
    this.quotaForm.controls['nombreCliente'].disable();
    this.quotaForm.controls['codCliente'].disable();
    this.listDiscount = this.quotaForm.get('listDescuento') as FormArray;
  }

  submiter() {
    this.quota = new EntQuota();
    this.quota.codCliente = Number(this.quotaForm.get('codCliente').value);
    this.quota.cupoAsignado = Number(this.quotaForm.get('cupoAsignado').value);
    this.quota.tipoCupo = this.quotaForm.get('tipoCupo').value.idTipoCupo;
    this.quota.estadoCupo = true;
    this.quota.editable = true;
    let desc: EntDiscount[] = [];
    let rv = this.listDiscount.getRawValue();
    for (let num = 0; num < rv.length; num++) {
      desc.push({ COD_CLIENTE: this.quota.codCliente, TIPO_ARTICULO: rv[num].articletype, VALOR: rv[num].valor });
    }
    this.quota.descuento = desc;
    this.InsertQuota(this.quota);
  }

  reset() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id == 'new')
      return;
    this.location.back();
  }

  InsertQuota(cupo) {
    this.carteraService.InsertQuota(cupo).subscribe(data => {
      this.reset();
      this.principalComponent.showMsg('success', 'Cupo', 'Cupo de $' + this.quota.cupoAsignado.toLocaleString() + ' asignado a ' + this.quota.codCliente + ' exitosamente');
    }, error => {
      console.log(error);
      this.principalComponent.showMsg('error', 'Cupo', error.error.message);
    });
  }

  getBasicData() {
    forkJoin(this.carteraService.getQuotaType(),
      this.carteraService.getArticleTypes(),
    ).subscribe(([res1, res2]) => {
      this.quotaTypes = res1;
      this.articleTypes = res2;
      this.getParameter();
    }, error => console.log(error));
  }

  validarCliente(value) {
    if (value.length == 0)
      return;
    this.carteraService.GetClient(value)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          this.quotaForm.controls['nombreCliente'].setValue('');
          this.principalComponent.showMsg('error', 'Buscar cliente', 'Cliente no encontrado');
        } else {
          this.carteraService.getQuota(value).subscribe(cupo => {
            if (cupo && cupo.length > 0)
              this.principalComponent.showMsg('error', 'Buscar Cupo', 'Cliente ' + data[0].nombre + ' ya tiene cupo signado de $' + cupo[0].cupoAsignado.toLocaleString());
          }, error => console.log(error));
          this.carteraService.getDiscount(value).subscribe(res => {
            this.discount = res;
          }, error => console.log(error));
          this.quotaForm.controls['nombreCliente'].setValue(data[0].nombre);
        }
      }, error => console.log("Sin registro"));
  }

  onChangeQuotaType(value: EntQuotaType) {
    let valorCu = this.quotaForm.get('cupoAsignado');
    valorCu.setValue(0);
    this.emptyDiscount();
    if (value.idTipoCupo == 1) {
      this.enableListDiscount = false;
      valorCu.enable();
    }
    if (value.idTipoCupo == 2) {
      this.enableListDiscount = true;
      valorCu.disable();
    }
  }

  addDiscount() {
    this.listDiscount = this.quotaForm.get('listDescuento') as FormArray;
    let a = this.fb.group({
      articletype: [null, Validators.required],
      detalle: { value: null, disabled: true },
      valor: [null, [Validators.required, Validators.min(0)]]
    });
    this.listDiscount.push(a);
    this.boolDiscount(this.listDiscount.length - 1);
  }

  removeDiscount() {
    this.listDiscount = this.quotaForm.get('listDescuento') as FormArray;
    this.listDiscount.removeAt(this.listDiscount.length - 1);
  }

  emptyDiscount() {
    this.listDiscount = this.quotaForm.get('listDescuento') as FormArray;
    while (this.listDiscount.length > 0) {
      this.removeDiscount();
    }
  }

  boolDiscount(val) {
    this.indexselDiscount = val;
    this.boolDiscountForm = true;
  }

  getNameArticleType(val) {
    try {
      return this.articleTypes.find(e => e.ID == val).DESCRIPCION;
    } catch (error) {
      null;
    }
  }

  set enableListDiscount(val: boolean) {
    this.listDiscount = this.quotaForm.get('listDescuento') as FormArray;
    for (let num = 0; num < this.listDiscount.length; num++) {
      if (val)
        this.listDiscount.controls[num].enable();
      else
        this.listDiscount.controls[num].disable();
    }
  }

  get enableListDiscount() {
    let val = true;
    for (let num = 0; num < this.listDiscount.length; num++) {
      if (this.listDiscount.controls[num].disabled)
        val = false;
    }
    return val && this.quotaForm.enabled;
  }

  selArticle(val: EntArticleType) {
    if (this.listDiscount.controls.find(e => e.get('articletype').value == val.ID))
      this.principalComponent.showMsg('error', 'Error', 'El combustible ya fue seleccionado');
    else {
      this.listDiscount.controls[this.indexselDiscount].setValue({
        articletype: val.ID,
        detalle: this.getNameArticleType(val.ID),
        valor: null
      });
      this.boolDiscountForm = false;
      focusById('val-' + this.indexselDiscount);
    }
  }

}
