import { Component, OnInit } from '@angular/core';
import { PAYMENTMETHODS } from '../../../Class/PAYMENTMETHODS';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { EntReceivable } from '../../../Class/EntReceivable';
import { EntPayment } from '../../../Class/EntPayment';
import { focusById, currencyNotDecimal } from '../../../util/util-lib';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { fadeTransition } from '../../../routerAnimation';
import { EntStation } from '../../../Class/EntStation';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';

@Component({
    selector: 'app-payment-add',
    templateUrl: './payment-add.component.html',
    styleUrls: ['./payment-add.component.css'],
    animations: [fadeTransition()]
})
export class PaymentAddComponent implements OnInit {
    addPaymentForm: FormGroup;
    displayDialogReceivable = false;
    receivables: EntReceivable[];
    receivableSelected: EntReceivable;
    client: EntBasicClient;
    formasPago: any[];
    formasPagoAll: any[];
    boolSearchClient;
    notdecimal = currencyNotDecimal();
    assignPago: boolean;
    asign;
    stationCode;
    stationsAll: EntStation[];
    stationSel;

    tiposImpuestos: any[] = [];
    constructor(
        private carteraService: CarteraService,
        private principalComponent: PrincipalComponent,
        private title: Title,
        private fb: FormBuilder,
        private utilService: UtilService,
        private storageService: StorageService,
        private NominaService: NominaService
    ) {
        this.title.setTitle('Pagos - Simovil');
        this.buildForm();
        this.GetEstaciones();
    }

    ngOnInit() {
        this.receivableSelected = new EntReceivable();
        this.client = new EntBasicClient();
        this.formasPagoAll = Object.create(PAYMENTMETHODS);
        this.formasPago = this.formasPagoAll.filter(e => e.id < 3 || e.id === 5);
        focusById('btnBoolClient', true);
        this.GetTipoImpuestos();
    }
    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        this.NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    buildForm() {
        this.addPaymentForm = this.fb.group({
            paymentId: [null, Validators.required],
            paymentName: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
            valuePayment: [0, Validators.required],
            saldoCuentaCobro: [null, Validators.required],
            cuentaCobro: [null, Validators.required],
            cuentaCobroNum: [null, Validators.required],
            formaPago: [null, Validators.required],
            fechaPago: [null, Validators.required],
            Valorpago: [0],
            tipoRetencion: [null],
            montoRentencion: [0],
            detalles: [null]
        });
    }
    GetTipoImpuestos() {
        this.NominaService.GetTiposImpuestos().subscribe(resp => {
            this.tiposImpuestos = resp;

        });
    }
    DateToLocalString(date: any) {
        if (date == null) {
            return null;
        }
        return new Date(date).toLocaleDateString();
    }

    DateToIsoString(date: any, addDay: number) {
        if (date == null) {
            return null;
        }
        var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + addDay).toISOString().split('T');
        return newDate[0];
    }

    SearchClientPayment(value: string) {
        if (value.length == 0) {
            return;
        }
        this.carteraService.getClients(value, null, null, null, null)
            .subscribe(data => {
                if (typeof (data[0]) === 'undefined') {
                    this.principalComponent.showMsg('warn', 'Advertencia', 'Cliente no existe');
                    return;
                }
                this.client = data[0];
                this.addPaymentForm.controls['paymentName'].setValue(this.client.nombre);
            }, error => {
                console.log('Sin registro');
            });
    }

    ReceivableSelected(value: EntReceivable) {
        this.receivableSelected = value;
        // this.addPaymentForm.controls['valuePayment'].setValidators(
        //   [
        //     Validators.required,
        //     Validators.max(value.saldo)
        //   ]);
        this.addPaymentForm.get('cuentaCobroNum').setValue(value.num);
        this.addPaymentForm.get('cuentaCobro').setValue(value.id);
        this.addPaymentForm.get('saldoCuentaCobro').setValue(value.saldo);
        // this.addPaymentForm.get('valuePayment').updateValueAndValidity();
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
        payment.ASIGNADO = (this.client.tipoCupo == 2) ? true : this.assignPago;
        payment.idEstacion = this.stationSel.idEstacion;
        payment.tipoRetencion = payfor.tipoRetencion;
        payment.montoRentencion = payfor.montoRentencion;
        payment.detalles = payfor.detalles;
        if (payment && payment.anticipo == false && payment.ASIGNADO == false) {
            this.utilService.confirm('Es cliente crédito, ¿está seguro de no asignar la cuenta de cobro a afectar? ', res => {
                if (res) {
                    setTimeout(() => {
                        this.submiter(payment);
                    }, 10);
                }
            });
        } else {
            this.submiter(payment);
        }
    }

    submiter(payment: EntPayment) {
        this.utilService.confirm('Va a realizar un pago a ' + this.client.nombre + ' ¿Desea continuar?', (res: any) => {
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
                console.log(this.receivables);
                this.displayDialogReceivable = true;
                setTimeout(() => {
                    focusById('btnReceivable0', true);
                }, 10);
            } else {
                this.principalComponent.showMsg('info', 'Información', 'El cliente no cuenta con cuentas de cobro');
            }
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
        if (this.client.codCliente == null) {
            return;
        }
        this.carteraService.getClients(this.client.codCliente, null, null, null, null).subscribe(client => {
            if (client.length != 0) {
                this.client = client[0];
            } else {
                this.principalComponent.showMsg('info', 'Información', 'Cliente no encontrado.');
            }
        }, error => {
            console.log(error);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    getCodClient(client: EntBasicClient) {
        this.assigP(false);
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
        focusById('valorPag');
    }

    boolClient(val) {
        this.boolSearchClient = true;
        this.client = new EntBasicClient();
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }

    assigP(val: boolean) {
        if (val) {
            this.assignPago = true;
            setTimeout(() => {
                focusById('btnCuCobro', true);
            }, 10);
            this.addPaymentForm.get('cuentaCobro').enable();
            this.addPaymentForm.get('cuentaCobroNum').enable();
            this.addPaymentForm.get('saldoCuentaCobro').enable();
        } else {
            this.assignPago = false;
            // this.addPaymentForm.get('valuePayment').setValidators(
            //   [
            //     Validators.required
            //   ]);
            this.receivableSelected = null;
            this.addPaymentForm.get('cuentaCobro').setValue(null);
            this.addPaymentForm.get('cuentaCobroNum').setValue(null);
            this.addPaymentForm.get('saldoCuentaCobro').setValue(null);
            this.addPaymentForm.get('cuentaCobro').disable();
            this.addPaymentForm.get('cuentaCobroNum').disable();
            this.addPaymentForm.get('saldoCuentaCobro').disable();
            // this.addPaymentForm.get('valuePayment').updateValueAndValidity();
            this.addPaymentForm.updateValueAndValidity();
        }
    }
    CalculoImpuesto() {
        let impuesto = (this.addPaymentForm.get('tipoRetencion').value).valor;
        let base = (this.addPaymentForm.get('Valorpago').value);
        let retencion = (impuesto * base);
        let TOTAL = (base - retencion);
        if( retencion !== null && TOTAL !== null ){
            this.addPaymentForm.get('montoRentencion').setValue(retencion);
            this.addPaymentForm.get('valuePayment').setValue(TOTAL);
        }
    }
    get valorPago() { return this.addPaymentForm.get('valuePayment').value; }
    get valorCuentaCobro() { return this.addPaymentForm.get('saldoCuentaCobro').value; }
    get PagoMayorACuentaCobro() { return this.valorPago > this.valorCuentaCobro; }
}
