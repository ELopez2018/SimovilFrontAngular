import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EntInvoice } from '../../../Class/EntInvoice';
import { EntAdvance } from '../../../Class/EntAdvance';
import { EntStation } from '../../../Class/EntStation';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';
import { UtilService } from '../../../services/util.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../../../routerAnimation';
import { forkJoin } from 'rxjs';
import { EntProvider } from '../../../Class/EntProvider';
import { focusById, currencyNotDecimal } from '../../../util/util-lib';
import { EntPlant } from '../../../Class/EntPlant';
import { EntArticleType } from '../../../Class/EntArticleType';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
  animations: [fadeTransition()]
})
export class InvoiceEditComponent implements OnInit {
  notdecimal = currencyNotDecimal();
  invoiceForm: FormGroup;
  invoice: EntInvoice;
  advances: EntAdvance[];
  invoiceReturned: EntInvoice;
  idReturnedInvoice;
  controlShow = false;
  stations: EntStation[];
  stationsAll: EntStation[];
  stationCode: number;
  rol;
  boolAdvanceBtn = false;
  boolAdvanceForm = false;
  valorAnticipo = 0;
  advanceSel: EntAdvance[] = [];
  providerSel: EntProvider;
  boolProvider = false;
  plants: EntPlant[];
  emitFalse = { emitEvent: false };

  constructor(
    private fb: FormBuilder,
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private location: Location,
    private title: Title
  ) {
    this.buildForm();
    this.title.setTitle('Editar factura - Simovil');
  }

  ngOnInit() {
    this.getData();
    this.stationCode = this.storageService.getCurrentStation();
    this.rol = this.storageService.getCurrentUserDecode().idRol;
    focusById('codPro');
  }

  buildForm() {
    this.invoiceForm = this.fb.group({
      numero: ['', Validators.required],
      proveedor: ['', Validators.required],
      nombreProveedor: ['', Validators.required],
      fecha: ['', Validators.required],
      fechaRec: ['', Validators.required],
      fechaVen: ['', Validators.required],
      subtotal: [0, Validators.required],
      iva: [0, Validators.required],
      retencion: [0, Validators.required],
      descuento: [0, Validators.required],
      anticipo: [0, Validators.required],
      pagoPlanilla: [0, Validators.required],
      valor: ['', Validators.required],
      devueltaFac: ['', Validators.required],
      devueltaPro: ['', Validators.required],
      detalle: [''],
      estacion: [null, Validators.required],
      cargado: ['', Validators.required],
      planta: ['', Validators.required],
      pagaEstacion: [false, Validators.required],
      guia: ['', [Validators.required, Validators.pattern(/^[0-9]+([-][0-9]+)?$/)]],
      listCantArt: this.fb.array([])
    });
    this.formEdit(0);
    this.invoiceForm.get('estacion').valueChanges.subscribe(e => {
      if (this.stationCode == null && e && this.providerSel && this.providerSel.tipo == 1)
        this.findArtTypeList((e as EntStation).idEstacion);
    });
  }

  get list() {
    return this.invoiceForm.get('listCantArt') as FormArray;
  }

  submit() {
    if (!this.validDate(this.invoiceForm.get('fecha').value))
      return;
    let invoiceLocal = new EntInvoice();
    let rawValue = this.invoiceForm.getRawValue();
    invoiceLocal.id = this.invoice.id;
    invoiceLocal.numero = String(rawValue.numero);
    invoiceLocal.proveedor = Number(rawValue.proveedor);
    invoiceLocal.fecha = rawValue.fecha;
    invoiceLocal.fechaRec = rawValue.fechaRec;
    invoiceLocal.fechaVen = rawValue.fechaVen;
    invoiceLocal.subtotal = Number(rawValue.subtotal);
    invoiceLocal.iva = Number(rawValue.iva);
    invoiceLocal.retencion = Number(rawValue.retencion);
    invoiceLocal.descuento = Number(rawValue.descuento);
    invoiceLocal.anticipo = Number(rawValue.anticipo);
    invoiceLocal.pagoPlanilla = Number(rawValue.pagoPlanilla);
    invoiceLocal.valor = Number(rawValue.valor);
    invoiceLocal.saldo = invoiceLocal.valor - invoiceLocal.anticipo;
    invoiceLocal.estado = 0;
    invoiceLocal.rol = this.rol;
    invoiceLocal.estacion = this.stationCode | rawValue.estacion.idEstacion;
    if (this.providerSel && this.providerSel.tipo == 1) {
      invoiceLocal.cargado = rawValue.cargado != null ? rawValue.cargado.idEstacion : null;
      invoiceLocal.guia = rawValue.guia;
      invoiceLocal.planta = rawValue.planta != null ? rawValue.planta.ID : null;
      invoiceLocal['listCantArt'] = rawValue.listCantArt && rawValue.listCantArt.length > 0 ? rawValue.listCantArt : null;
      invoiceLocal.pagaEstacion = rawValue.pagaEstacion;
    }
    invoiceLocal.detalle = rawValue.detalle;
    if (this.idReturnedInvoice)
      invoiceLocal['returned'] = this.idReturnedInvoice;
    if (this.advanceSel && this.advanceSel.length > 0) {
      let arraytemp = [];
      this.advanceSel.forEach(e =>
        arraytemp.push(e.idAnticipo)
      );
      invoiceLocal["listAnt"] = arraytemp.join();
    }
    this.UpdateInvoice(invoiceLocal);
  }

  validDate(date: string) {
    if (date) {
      let dateNew = new Date(date);
      if (dateNew > new Date()) {
        this.principalComponent.showMsg('error', 'Error', 'La fecha es mayor a la fecha actual.');
        return false;
      }
      return true;
    }
    return false;
  }

  getData() {
    this.utilService.loader();
    forkJoin(this.nominaService.GetStations(),
      this.carteraService.getPlant())
      .subscribe(([stations, plants]) => {
        this.utilService.loader(false);
        this.stationsAll = stations;
        this.stations = stations.filter(e => e.listoSimovil == true);
        this.plants = plants;
      }, error => {
        this.utilService.loader(false);
        console.log(error);
      });
  }

  UpdateInvoice(invoice: EntInvoice): void {
    this.utilService.loader(true);
    this.carteraService.UpdateInvoice(invoice).subscribe(data => {
      this.utilService.loader(false);
      this.reset();
      this.principalComponent.showMsg('success', 'Éxito', 'Factura #' + invoice.numero + ' editada correctamente.');
      this.advanceSel = [];
      this.valorAnticipo = 0;
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  validarFactura() {
    this.utilService.loader(true);
    let num = String(this.invoiceForm.get('numero').value);
    let pro = Number(this.invoiceForm.get('proveedor').value);
    this.utilService.loader(false);
    this.carteraService.getInvoice(null, num, pro, null, null, null, null, null, null, null, null, true).subscribe(data => {
      if (data.length == 1) {
        this.formEdit(1);
        this.assgignInvoice(data[0]);
      } else {
        this.formEdit(0);
        this.principalComponent.showMsg('info', 'Información', 'Factura no registrada');
      }
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message);
      console.log(error);
    });
  }

  assgignInvoice(invoice: EntInvoice) {
    this.invoice = invoice;
    this.invoiceForm.get('fecha').setValue(this.convertDate(invoice.fecha));
    this.invoiceForm.get('fechaRec').setValue(this.convertDate(invoice.fechaRec));
    this.invoiceForm.get('fechaVen').setValue(this.convertDate(invoice.fechaVen));
    this.invoiceForm.get('subtotal').setValue(invoice.subtotal);
    this.invoiceForm.get('iva').setValue(invoice.iva);
    this.invoiceForm.get('retencion').setValue(invoice.retencion);
    this.invoiceForm.get('descuento').setValue(invoice.descuento);
    this.invoiceForm.get('anticipo').setValue(invoice.anticipo);
    this.invoiceForm.get('pagoPlanilla').setValue(invoice.pagoPlanilla);
    this.invoiceForm.get('valor').setValue(invoice.valor);
    this.invoiceForm.get('estacion').setValue(this.stationsAll.find(e => e.idEstacion == invoice.estacion), this.emitFalse);
    this.invoiceForm.get('detalle').setValue(invoice.detalle);
    this.invoiceForm.get('guia').setValue(invoice.guia);
    this.invoiceForm.get('cargado').setValue(this.stationFilter.find(e => e.idEstacion == invoice.cargado));
    this.invoiceForm.get('planta').setValue(this.plants.find(e => e.ID == invoice.planta));
    this.invoiceForm.get('pagaEstacion').setValue(invoice.pagaEstacion);
    this.uploadArtType(invoice.articulos);
  }

  reset() {
    this.invoiceForm.reset(this.emitFalse);
    this.providerSel = null;
    this.invoiceForm.get('subtotal').setValue(0, this.emitFalse);
    this.invoiceForm.get('iva').setValue(0, this.emitFalse);
    this.invoiceForm.get('retencion').setValue(0, this.emitFalse);
    this.invoiceForm.get('descuento').setValue(0, this.emitFalse);
    this.invoiceForm.get('anticipo').setValue(0, this.emitFalse);
    this.invoiceForm.get('pagoPlanilla').setValue(0, this.emitFalse);
    this.invoiceForm.get('pagaEstacion').setValue(false, this.emitFalse);
    this.formEdit(0);
  }

  getprovider() {
    if (this.providerSel == null) {
      let varpro = this.invoiceForm.get('proveedor').value;
      if (varpro == null || varpro.length == 0)
        return;
      this.utilService.loader(true);
      this.carteraService.getProvider(this.invoiceForm.get('proveedor').value).subscribe(data => {
        this.utilService.loader(false);
        if (data.length == 1) {
          this.invoiceForm.get('nombreProveedor').setValue(data[0].nombre);
          this.providerSel = data[0];
          this.validarFactura();
        }
        else {
          this.principalComponent.showMsg('info', 'Información', 'El proveedor no existe.');
          this.invoiceForm.get('nombreProveedor').setValue('');
          this.formEdit(0);
        }
      }, error => {
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        this.utilService.loader(false);
      });
    } else
      this.validarFactura();
  }

  convertDate(date: string) {
    return date.split('T')[0];
  }

  getAdvances() {
    this.utilService.loader(true);
    let provider = this.invoiceForm.get('proveedor').value;
    this.utilService.loader(true);
    this.valorAnticipo = 0;
    this.advances = [];
    forkJoin([
      this.carteraService.getAdvance(null, provider, null, null, 4, this.invoice.id),
      this.carteraService.getAdvance(null, provider, null, null, 3)
    ]).subscribe(([res1, res2]) => {
      this.utilService.loader(false);
      if (res1.length > 0 || res2.length) {
        this.advanceSel = res1;
        this.advances = res2;
        this.validSelected();
        this.updateValueAnticipo();
        this.boolAdvanceForm = true;
      } else {
        this.principalComponent.showMsg('info', 'Información', 'El proveedor ' + provider + ' no tiene anticipos');
      }
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    });
  }

  addAdvance(advance: EntAdvance) {
    this.advanceSel.push(advance);
    advance["Sel"] = true;
    this.updateValueAnticipo();
  }

  removeAdvance(advance: EntAdvance) {
    let index = this.advanceSel.findIndex(E => E == advance);
    this.advanceSel.splice(index, 1);
    advance["Sel"] = false;
    this.updateValueAnticipo();
  }

  validSelected() {
    if (this.advanceSel && this.advances.length > 0) {
      this.advanceSel.forEach(element => {
        element["Sel"] = true;
        this.advances.push(element);
      });
    }
  }

  updateValueAnticipo() {
    this.valorAnticipo = 0;
    if (this.advanceSel && this.advanceSel.length > 0) {
      this.advanceSel.forEach(e =>
        this.valorAnticipo += e.valor
      );
    }
  }

  selectedAdvances() {
    this.boolAdvanceForm = false;
    this.invoiceForm.get('anticipo').setValue(this.valorAnticipo);
  }

  formEdit(number: number) {
    switch (number) {
      case 0: //inicial
        this.invoiceForm.disable(this.emitFalse);
        this.invoiceForm.get('proveedor').enable();
        this.invoiceForm.get('numero').enable();
        this.invoiceForm.get('valor').enable();
        this.boolAdvanceBtn = false;
        break;
      case 1: //validado proveedor
        this.invoiceForm.enable(this.emitFalse);
        this.boolAdvanceBtn = true;
        this.invoiceForm.get('proveedor').disable();
        this.invoiceForm.get('numero').disable();
        this.invoiceForm.get('nombreProveedor').disable();
        this.invoiceForm.get('anticipo').disable();
        this.invoiceForm.get('devueltaFac').disable();
        this.invoiceForm.get('devueltaPro').disable();
        if (this.providerSel && this.providerSel.tipo == 1) {
          // if (this.invoiceForm.get('estacion').value == null)
          //   this.uploadArtType();
          this.invoiceForm.get('pagoPlanilla').disable();
          if (this.providerSel.tipoMayorista == 'G') {
            this.invoiceForm.get('cargado').disable();
            this.invoiceForm.get('planta').disable();
            this.invoiceForm.get('guia').disable();
          }
        } else {
          this.invoiceForm.get('cargado').disable();
          this.invoiceForm.get('planta').disable();
          this.invoiceForm.get('guia').disable();
          this.invoiceForm.get('listCantArt').disable();
          this.invoiceForm.get('pagaEstacion').disable();
          this.list.controls = [];
        }
        break;
    }
    if (this.stationCode != null)
      this.invoiceForm.get('estacion').disable();
  }

  calcularValor() {
    let subt = Number(this.invoiceForm.get('subtotal').value);
    let iva = Number(this.invoiceForm.get('iva').value);
    let rete = Number(this.invoiceForm.get('retencion').value);
    let desc = Number(this.invoiceForm.get('descuento').value);
    let plan = Number(this.invoiceForm.get('pagoPlanilla').value);
    this.invoiceForm.get('valor').setValue(subt + iva - rete - desc - plan);
  }

  validFirt() {
    return !((this.invoiceForm.get('proveedor').valid || this.providerSel) && this.invoiceForm.get('numero').valid);
  }

  return() {
    this.location.back();
  }

  assignProvider(provider: EntProvider) {
    this.providerSel = provider;
    this.invoiceForm.get('proveedor').setValue(provider.nit);
    this.invoiceForm.get('proveedor').disable();
    this.invoiceForm.get('nombreProveedor').setValue(provider.nombre);
    this.boolProvider = false;
    focusById('numInvoice');
  }

  showBoolProvider() {
    this.boolProvider = true;
    setTimeout(() => {
      focusById('searchPro');
    }, 10);
  }

  get stationFilter(): EntStation[] {
    return this.stationNow ? this.stationsAll.
      filter(e => e.ciudadEstacion == this.stationNow.ciudadEstacion && e.idEstacion != 90 && e.idEstacion != 13 && e.idEstacion != 14) :
      this.stationsAll;
  }

  get stationNow(): EntStation {
    try {
      return this.stationsAll.find(e =>
        e.idEstacion == (this.stationCode || this.invoiceForm.get('estacion').value.idEstacion))
    } catch (error) {
      return null;
    }
  }

  findArtTypeList(stationCode?: number) {
    this.utilService.loader();
    this.carteraService.getArticleTypes2(this.stationCode || stationCode, this.providerSel.tipoMayorista).subscribe(res => {
      this.uploadArtType(res);
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  uploadArtType(val: EntArticleType[]) {
    this.list.controls = [];
    val.map(e => {
      this.list.push(
        this.fb.group({
          id: e.ID,
          descripcion: e.DESCRIPCION,
          cantidad: [e.CANTIDAD, [Validators.required, Validators.min(0)]]
        }));
    });
    if (this.stationFilter.length == 1)
      this.invoiceForm.get('cargado').setValue(this.stationFilter[0]);
  }
}
