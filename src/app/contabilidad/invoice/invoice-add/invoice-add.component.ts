import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../routerAnimation';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EntStation } from '../../../Class/EntStation';
import { EntInvoice } from '../../../Class/EntInvoice';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { NominaService } from '../../../services/nomina.service';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EntAdvance } from '../../../Class/EntAdvance';
import { EntProvider } from '../../../Class/EntProvider';
import { focusById, currencyNotDecimal, dateToISOString } from '../../../util/util-lib';
import { forkJoin } from 'rxjs';
import { EntPlant } from '../../../Class/EntPlant';

@Component({
    selector: 'app-invoice-add',
    templateUrl: './invoice-add.component.html',
    styleUrls: ['./invoice-add.component.css'],
    animations: [fadeTransition()]
})
export class InvoiceAddComponent implements OnInit {
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
    boolProvider = false;
    valorAnticipo = 0;
    advanceSel: EntAdvance[] = [];
    providerSel: EntProvider;
    notdecimal = currencyNotDecimal();
    plants: EntPlant[];
    emitFalse = { emitEvent: false };
    mostrarItems = false ;
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
        this.title.setTitle('Agregar factura - Simovil');
    }

    ngOnInit() {
        this.buildForm();
        this.stationCode = this.storageService.getCurrentStation();
        this.rol = this.storageService.getCurrentUserDecode().idRol;
        this.getData();
        this.GetParam();
        focusById('codPro');
    }

    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id != null) {
            this.idReturnedInvoice = atob(id);
            this.utilService.loader(true);
            this.carteraService.getInvoice(this.idReturnedInvoice).subscribe(data => {
                this.utilService.loader(false);
                if (data.length == 1) {
                    this.invoiceReturned = data[0];
                    this.assignReturned();
                } else {
                    this.principalComponent.showMsg('error', 'Error', 'Error al cargar la factura devuelta');
                }
            }, error => {
                this.utilService.loader(false);
                console.log(error);
                this.principalComponent.showMsg('error', 'Error', error.error.message);
            });
        }
    }
    FormatoFecha(fecha: Date): string {
        var dia = fecha.getDate() + '';
        var mes = (fecha.getMonth() + 1) + '';
        if (fecha.getDate() < 10) {
            dia = '0' + fecha.getDate();
        }
        if ((fecha.getMonth() + 1) < 10) {
            mes = '0' + (fecha.getMonth() + 1);
        }
        return fecha.getFullYear() + '-' + mes + '-' + dia;
    }
    assignReturned() {
        this.invoiceForm.get('devueltaFac').setValue(this.invoiceReturned.numero);
        this.invoiceForm.get('devueltaPro').setValue(this.invoiceReturned.proveedor);
    }

    buildForm() {
        this.invoiceForm = this.fb.group({
            numero: ['', Validators.required],
            proveedor: ['', Validators.required],
            nombreProveedor: ['', Validators.required],
            fecha: ['', Validators.required],
            fechaRec: [this.FormatoFecha(new Date()), Validators.required],
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
            if (this.stationCode == null && e && this.providerSel && this.providerSel.tipo == 1) {
                this.uploadArtTypeList((e as EntStation).idEstacion);
            }
        });
    }

    get list() {
        return this.invoiceForm.get('listCantArt') as FormArray;
    }

    submit() {
        // if (!this.validDate(this.invoiceForm.get('fecha').value))
        //   return;
        let invoiceLocal = new EntInvoice();
        let rawValue = this.invoiceForm.getRawValue();
        invoiceLocal.numero = Number(rawValue.numero);
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
        invoiceLocal.estacion = this.stationCode || rawValue.estacion.idEstacion;
        if (this.providerSel && this.providerSel.tipo == 1) {
            invoiceLocal.cargado = rawValue.cargado != null ? rawValue.cargado.idEstacion : null;
            invoiceLocal.guia = rawValue.guia;
            invoiceLocal.planta = rawValue.planta != null ? rawValue.planta.ID : null;
            invoiceLocal['listCantArt'] = rawValue.listCantArt && rawValue.listCantArt.length > 0 ? rawValue.listCantArt : null;
            invoiceLocal.pagaEstacion = rawValue.pagaEstacion;
        }
        invoiceLocal.detalle = rawValue.detalle;
        if (this.idReturnedInvoice) {
            invoiceLocal['returned'] = this.idReturnedInvoice;
        }
        if (this.advanceSel && this.advanceSel.length > 0) {
            let arraytemp = [];
            this.advanceSel.forEach(e =>
                arraytemp.push(e.idAnticipo)
            );
            invoiceLocal["listAnt"] = arraytemp.join();
        }
        this.verifyInsertInvoice(invoiceLocal);
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

    InsertInvoice(invoice: EntInvoice): void {
        setTimeout(() => {
            this.utilService.confirm('Creará la factura #' + invoice.numero + ' con valor: $' + invoice.saldo.toLocaleString() + ' ¿Desea continuar?', result => {
                if (result) {
                    this.utilService.loader(true);
                    this.carteraService.InsertInvoice(invoice).subscribe(data => {
                        this.utilService.loader(false);
                        this.reset();
                        if (this.idReturnedInvoice) {
                            this.location.back();
                        }
                        this.principalComponent.showMsg('success', 'Éxito', 'Factura #' + invoice.numero + ' registrada correctamente.');
                        this.advanceSel = [];
                        this.valorAnticipo = 0;
                    }, error => {
                        console.log(error);
                        this.utilService.loader(false);
                        this.principalComponent.showMsg('error', 'Error', error.error.message);
                    });
                }
            });
        }, 1);
    }

    verifyInsertInvoice(invoice: EntInvoice) {
        this.carteraService.getInvoice(null, null, invoice.proveedor, null, null, null, null, null, invoice.valor).subscribe(res => {
            if (res.length > 0) {
                this.utilService.confirm('Existe la factura #' + res[res.length - 1].numero + ' del ' + new Date(res[res.length - 1].fecha).toLocaleDateString() + ' con ese mismo valor, ¿Desea continuar?', result => {
                    if (result) {
                        this.InsertInvoice(invoice);
                    }
                });
            } else {
                this.InsertInvoice(invoice);
            }
        }, error => {
            console.log(error);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    validarFactura() {
        this.utilService.loader(true);
        let num = Number(this.invoiceForm.get('numero').value);
        let pro = Number(this.invoiceForm.get('proveedor').value);
        this.utilService.loader(false);
        this.carteraService.getInvoice(null, num, pro).subscribe(data => {
            if (data.length > 0) {
                this.principalComponent.showMsg('info', 'Información', 'Factura ya registrada');
                this.formEdit(0);
            } else {
                this.principalComponent.showMsg('success', 'FACTURA NUEVA', 'Factura validada');
                this.formEdit(1);
                focusById('fechaFactura');
            }
        }, error => {
            this.principalComponent.showMsg('error', 'Error', error.error.message);
            console.log(error);
        });
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
        this.invoiceForm.get('fechaRec').setValue(this.FormatoFecha(new Date()));
        this.formEdit(0);
        if (this.idReturnedInvoice) {
            this.assignReturned();
        }
    }

    getprovider() {
        if (this.providerSel == null) {
            let varpro = this.invoiceForm.get('proveedor').value;
            if (varpro == null || varpro.length == 0) {
                return;
            }
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
        } else {
            this.validarFactura();
        }
    }

    getAdvances() {
        this.utilService.loader(true);
        let provider = this.invoiceForm.get('proveedor').value;
        this.carteraService.getAdvance(null, provider, null, null, 3, this.stationCode).subscribe(result => {
            this.utilService.loader(false);
            if (result.length > 0) {
                console.log(result);
                this.boolAdvanceForm = true;
                this.advances = result;
                this.validSelected();
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
                let index = this.advances.findIndex(e => e.idAnticipo == element.idAnticipo);
                this.advances[index]["Sel"] = true;
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
                    this.invoiceForm.get('pagoPlanilla').disable();
                    if (this.invoiceForm.get('estacion').value == null) {
                        this.uploadArtTypeList();
                    }
                    if (this.providerSel.tipoMayorista == 'G') {
                        this.invoiceForm.get('cargado').disable();
                        this.invoiceForm.get('planta').disable();
                        this.invoiceForm.get('guia').disable();
                    }
                    if (this.stationNow) {
                        this.invoiceForm.get('planta').setValue(this.plants.find(e => this.stationNow.planta == e.ID));
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
        if (this.stationCode != null) {
            this.invoiceForm.get('estacion').disable();
        }
    }

    calcularValor() {
        let subt = Number(this.invoiceForm.get('subtotal').value);
        // this.invoiceForm.get('iva').setValue(subt * 0.19);
        let iva = Number(this.invoiceForm.get('iva').value);
        let rete = Number(this.invoiceForm.get('retencion').value);
        let desc = Number(this.invoiceForm.get('descuento').value);
        let plan = Number(this.invoiceForm.get('pagoPlanilla').value);
        let Ant = Number(this.invoiceForm.get('anticipo').value);

        this.invoiceForm.get('valor').setValue(subt + iva - rete - desc - plan - Ant);
    }
    selectedAdvances() {
        this.boolAdvanceForm = false;
        this.invoiceForm.get('anticipo').setValue(this.valorAnticipo);
        this.calcularValor();
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

    uploadArtTypeList(stationCode?: number) {
        this.utilService.loader();
        this.carteraService.getArticleTypes2(this.stationCode || stationCode, this.providerSel.tipoMayorista).subscribe(res => {
            this.list.controls = [];
            res.map(e => {
                this.list.push(
                    this.fb.group({
                        id: e.ID,
                        descripcion: e.DESCRIPCION,
                        cantidad: [null, [Validators.required, Validators.min(0)]]
                    }));
            });
            this.utilService.loader(false);
            if (this.stationFilter.length == 1) {
                this.invoiceForm.get('cargado').setValue(this.stationFilter[0]);
            }
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }
}
