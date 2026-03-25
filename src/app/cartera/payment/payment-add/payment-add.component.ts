import { browser } from 'protractor';
import { DtoPago } from './../../../Class/dto-pago';
import { Anticipo } from './../../../Class/anticipo';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { IgxTreeGridHierarchizingPipe } from 'igniteui-angular/lib/grids/tree-grid/tree-grid.pipes';

@Component({
    selector: 'app-payment-add',
    templateUrl: './payment-add.component.html',
    styleUrls: ['./payment-add.component.css'],
    animations: [fadeTransition()]
})
export class PaymentAddComponent implements OnInit {
    @ViewChild('porcentaje_retencion') porcentaje_retencion: ElementRef;
    addPaymentForm: FormGroup;
    displayDialogReceivable = false;
    receivables: EntReceivable[];
    receivableSelected: EntReceivable;
    client: EntBasicClient;
    dto_pago: DtoPago;
    numClienteDtoPago;
    formasPago: any[];
    formasPagoAll: any[];
    boolSearchClient;
    notdecimal = currencyNotDecimal();
    assignPago: boolean;
    asign;
    stationCode;
    stationsAll: EntStation[];
    stationSel;
    stationSel2:any;
    tiposImpuestos: any[] = [];
    anticipo_boolean: boolean = false;
    seleccionado: Anticipo;
    detalleFPAnticipo: string;
    clienteTerpel;
    clienteSodexo;
    clienteBigPass;
    clienteMatDiscol;
    moralvaInversionesColombia;
    dtoToEds: boolean = false;
    dtoToCliente: boolean = false;
    tipoDeImpuesto;
    openTipoDeImpuesto: boolean = false;
    arrayDeRetencion: any[] = [];
    EstacionesMovilgas:any [] = [];
    rol:any;
    area:any;
   
    constructor(
        private carteraService: CarteraService,
        private principalComponent: PrincipalComponent,
        private title: Title,
        private fb: FormBuilder,
        private utilService: UtilService,
        private storageService: StorageService,
        private NominaService: NominaService,        
    ) {
        this.title.setTitle('Pagos - Simovil');
        this.buildForm();
        this.GetEstaciones();
        this.getDtoPago();
        this.EstacionesMovilgas = [{ label: 'SELECCIONE LA ESTACION DE SERVICIO', value: 1000 }];        
    }

    ngOnInit() {
        this.receivableSelected = new EntReceivable();
        this.client = new EntBasicClient();
        this.formasPagoAll = Object.create(PAYMENTMETHODS);
        this.formasPago = this.formasPagoAll.filter(e => e.id < 3 || e.id === 6 || e.id === 8);
        focusById('btnBoolClient', true);
        this.GetTipoImpuestos();    
        this.getRole();
    }

    getRole() {
        this.rol=this.storageService.getCurrentUserDecode().idRol
        this.area=this.storageService.getCurrentUserDecode().Area
      }


    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        //console.log('estación: '+this.stationCode);//b
        this.apliqueDtoToEds(parseInt(this.stationCode));
        this.NominaService.GetStations().subscribe(data => {
            ///console.log(JSON.stringify(data));

            data.map((i) => {
                this.EstacionesMovilgas.push({
                    label: i.nombreEstacion.toString(),
                    value: i,
                });
            });
    
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
            formaPago: [0, Validators.required],
            fechaPago: [null, Validators.required],
            estacionseleccionada: [0, Validators.required],
            Valorpago: [0],
            Descuento: [0],
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
        this.carteraService.getClients(value, null, null, null, null).subscribe(data => {

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
        this.addPaymentForm.get('cuentaCobroNum').setValue(value.num);
        this.addPaymentForm.get('cuentaCobro').setValue(value.id);
        this.addPaymentForm.get('saldoCuentaCobro').setValue(value.saldo);
        this.addPaymentForm.updateValueAndValidity();
        this.displayDialogReceivable = false;
        setTimeout(() => {
            focusById(this.addPaymentForm.valid ? 'btnSave' : 'valorPag', true);
        }, 10);
    }

    submitAddPayment() {
        if(this.validaTipoDeRetencion){
            this.principalComponent.showMsg('warn', 'Atención', 'Favor seleccione el tipo de retención');
            return;
        }
        let payment = new EntPayment();
        let payfor = this.addPaymentForm.getRawValue();
        payment.cliente = payfor.paymentId;
        payment.cuentaCobro = payfor.cuentaCobro;
        payment.valor = payfor.valuePayment;
        payment.fechaPago = payfor.fechaPago;
        //payment.formaPago = payfor.formaPago ? payfor.formaPago.id : null;
        payment.formaPago = payfor.formaPago ? payfor.formaPago.id : 0;
        payment.anticipo = this.client.tipoCupo == 2;
        payment.ASIGNADO = (this.client.tipoCupo == 2) ? false : this.assignPago;
        //payment.idEstacion = this.stationSel.idEstacion;
        if(this.area==7 && this.rol==4 || this.area==11 && this.rol==1){
            payment.idEstacion = this.stationSel2.idEstacion;            
            //payment.idEstacion = payfor.estacionseleccionada.idEstacion; 
        } else {
            payment.idEstacion = this.stationSel.idEstacion;
        }

        if(JSON.stringify(this.addPaymentForm.get('tipoRetencion').value) == '"NO APLICA"'){
            payment.retenciones = this.arrayDeRetencion;
        }
            payment.tipoRetencion = payfor.tipoRetencion;
        payment.montoRentencion = payfor.montoRentencion;
        if(this.detalleFPAnticipo == null){
            this.principalComponent.showMsg('warn', 'Atención', 'Favor seleccione consignación o efectivo en la forma de pago anticipo');
            return;
        }
        if(this.seleccionado.id == 8){
            payment.detalles = this.detalleFPAnticipo;
        }
        if(this.seleccionado.id != 8){
        payment.detalles = payfor.detalles;
        }
        payment.descuento = payfor.Descuento;

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
        //console.log('before send: '+JSON.stringify(payment));//b
        this.utilService.confirm('Va a realizar un pago a ' + this.client.nombre + ' ¿Desea continuar?', (res: any) => {
            if (res) {
                this.utilService.loader();
                this.carteraService.InsertPayment_de_pruebas(payment).subscribe(fila => {
                    this.utilService.loader(false);
                    this.principalComponent.showMsg('success', 'Éxito', 'Pago creado correctamente');
                    location.reload();
                }, error => {
                    this.utilService.loader(false);
                    console.log(error);
                    this.principalComponent.showMsg('error', 'Error', error.error.message);
                });
            }
        });
    }

    resetPaymentForm() {
        location.reload();
    }

    getReceivable() {
        this.receivables = null;
        this.utilService.loader();

        if(this.area==7 && this.rol==4 || this.area==11 && this.rol==1){
            this.carteraService.getReceivable(this.client.codCliente, true, null, null, null, this.stationSel2.idEstacion).subscribe(receivables => {
                this.utilService.loader(false);
                if (receivables.length > 0) {
                    this.receivables = receivables;
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
        } else {
            this.carteraService.getReceivable(this.client.codCliente, true, null, null, null, null).subscribe(receivables => {
                this.utilService.loader(false);
                if (receivables.length > 0) {
                    this.receivables = receivables;
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

    }

    getFormaPago(value) {
        if (value != null) {
            return this.formasPagoAll.find(e => e.id == value).text;
        }
    }

    valideAnticipo(){
        if(this.seleccionado != undefined){
        if(this.seleccionado.id == 8){
            this.anticipo_boolean = true;

        }
        if(this.seleccionado.id != 8){
            this.anticipo_boolean = false;
            this.detalleFPAnticipo = '';
        }
        }
    }

    detalleAnticipo(anticipo){
        this.detalleFPAnticipo = anticipo;
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
        this.apliqueDtoToCliente(JSON.stringify(this.client.codCliente));
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
            this.receivableSelected = null;
            this.addPaymentForm.get('cuentaCobro').setValue(null);
            this.addPaymentForm.get('cuentaCobroNum').setValue(null);
            this.addPaymentForm.get('saldoCuentaCobro').setValue(null);
            this.addPaymentForm.get('cuentaCobro').disable();
            this.addPaymentForm.get('cuentaCobroNum').disable();
            this.addPaymentForm.get('saldoCuentaCobro').disable();
            this.addPaymentForm.updateValueAndValidity();
        }
    }

    CalculoImpuesto() {
        let impuesto = (this.addPaymentForm.get('tipoRetencion').value).valor;
        this.tipoDeImpuesto = JSON.stringify((this.addPaymentForm.get('tipoRetencion').value).text);

        if(JSON.stringify(this.addPaymentForm.get('tipoRetencion').value) != '"NO APLICA"'){
            this.arrayDeRetencion = [];
        }

        if((this.addPaymentForm.get('tipoRetencion').value).valor == undefined){
            impuesto = 0;
        }
        let base = (this.addPaymentForm.get('Valorpago').value);
        let descuento = (this.addPaymentForm.get('Descuento').value);
        let retencion;
        if(descuento > 0){
            retencion = (impuesto * (base - descuento));
        }
        if(descuento == 0){
            retencion = (impuesto * base);
        }
        let TOTAL = (base - retencion);

        if( retencion !== null && TOTAL !== null ){
            this.addPaymentForm.get('montoRentencion').setValue(retencion);
            this.addPaymentForm.get('valuePayment').setValue(TOTAL);
        }

        if(descuento != null){
            this.addPaymentForm.get('valuePayment').setValue(TOTAL - descuento);
        }
    }

    RestaTotal() {

        let base = (this.addPaymentForm.get('Valorpago').value);
        let retencion = this.addPaymentForm.get('montoRentencion').value ;
        let descuento = (this.addPaymentForm.get('Descuento').value);
        if(retencion != null && base != null){
            this.addPaymentForm.get('valuePayment').setValue(base - retencion);
        }

        if(descuento != null){
            this.addPaymentForm.get('valuePayment').setValue(base - descuento - retencion);
        }
    }

    resultadoTotal(){
        var valorPago = this.addPaymentForm.get('Valorpago').value;
        var descuento = this.addPaymentForm.get('Descuento').value;

        if(valorPago != null && this.sumatoriaDeRetencion() != null){
        this.addPaymentForm.get('valuePayment').setValue(valorPago - this.sumatoriaDeRetencion());//here
        }

        if(valorPago != null && descuento != null && this.sumatoriaDeRetencion() != null){
            this.addPaymentForm.get('valuePayment').setValue(valorPago - descuento - this.sumatoriaDeRetencion());//here
            }
    }

     saldoaGuardar(){
        let pago= (this.addPaymentForm.get('Valorpago').value);
        let retencion = this.addPaymentForm.get('montoRentencion').value;
        let total = this.addPaymentForm.get('valuePayment').value;
        let _saldo;
        return _saldo=(pago-retencion-total);
    }

    get valorPago() { return this.addPaymentForm.get('valuePayment').value; }
    get valorCuentaCobro() { return this.addPaymentForm.get('saldoCuentaCobro').value; }
    get PagoMayorACuentaCobro() { return this.valorPago > this.valorCuentaCobro; }

    get validaTipoDeRetencion(){
        let tipoDeRetencion = this.addPaymentForm.get('tipoRetencion').value;
        if(tipoDeRetencion == null){
            return true;
        }
        if(tipoDeRetencion != null){
            return false;
        }
    }

    getDtoPago(){
        this.carteraService.getDtoPago().subscribe(data => {

            data.forEach(e => {
                if(e.numdocumento == 830095213){this.clienteTerpel = e.numdocumento;}
                if(e.numdocumento == 900045328951){this.clienteSodexo = e.numdocumento;}
                if(e.numdocumento == 900045328952){this.clienteBigPass = e.numdocumento;}
                if(e.numdocumento == 900489040){this.clienteMatDiscol = e.numdocumento;}
                if(e.numdocumento == 9013071243){this.moralvaInversionesColombia = e.numdocumento;}
            })

        this.dto_pago = data[0];

        this.numClienteDtoPago = this.dto_pago.numdocumento;
        if (data && data.length == 0) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'Cliente con descuento en pago, ejm: '+this.client.nombre+', no encontrado');
            //clean data
        }
        }, error => {
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        console.log(error);
        });
    }

    apliqueDtoToEds(esta: number){
        let rol: number = this.storageService.getCurrentUserDecode().idRol        
        if(esta == 95){return this.dtoToEds = true;}
        if(esta == 11){return this.dtoToEds = true;}
        if(esta == 12){return this.dtoToEds = true;}
        if(esta == 255){return this.dtoToEds = true;}
        if(esta == 73){return this.dtoToEds = true;}
        if(esta == 21){return this.dtoToEds = true;}
        if(rol == 4 || rol == 1){return this.dtoToEds = true;}
        else{return this.dtoToEds = false;}
    }

    apliqueDtoToCliente(codigo_cliente){
        if(codigo_cliente == this.clienteSodexo && this.dtoToEds == true){
            this.dtoToCliente = true;
        } if(codigo_cliente == this.clienteBigPass && this.dtoToEds == true){
            this.dtoToCliente = true;
        }
         if(codigo_cliente == this.clienteMatDiscol && this.dtoToEds == true){
            this.dtoToCliente = true;
        }
         if(codigo_cliente == this.moralvaInversionesColombia && this.dtoToEds == true){
            this.dtoToCliente = true;
        }
        else{
            this.dtoToCliente = false;
        }
    }

    openAddRetencion(){
        this.openTipoDeImpuesto = true;
    }

    closeAddRetencion(){
        this.openTipoDeImpuesto = false;
    }

    addRetencion(tipoRete){
        this.arrayDeRetencion.push({id: this.arrayDeRetencion.length + 1, text: tipoRete, porcentaje: 0, formaPago: 4, valor: 0});
    }

    borrarRetencion(indice){
        this.arrayDeRetencion.splice(this.arrayDeRetencion.findIndex(e => e.id == indice), 1);
        this.addPaymentForm.get('montoRentencion').setValue(this.sumatoriaDeRetencion());
        this.resultadoTotal();
    }

    sumatoriaDeRetencion(){
        var sumatoria = 0;
        this.arrayDeRetencion.forEach(e => {
            //si porcentaje y valor diferente de cero
                sumatoria += parseFloat(e.valor);
        });
        return sumatoria;
    }

    observandoPago(){
        if(this.arrayDeRetencion.length > 0){
        this.arrayDeRetencion.forEach(ele => {
            ele.valor = ele.porcentaje * this.addPaymentForm.get('Valorpago').value;
        });
        }
    }

    setImpuestoDeRetencion(e: any){
        var base_esElPago = (this.addPaymentForm.get('Valorpago').value);
        var porcentaje_impuesto = (e.target.value / 100);
        var retencionCalculada = (base_esElPago * porcentaje_impuesto);

        if(base_esElPago == 0){
            this.principalComponent.showMsg('info', 'Información', '¡Por favor digite el valor del pago(que es la base), porque está en cero y se requiere para calcular la retención!');
            this.porcentaje_retencion.nativeElement.value = 0;
        }

        this.arrayDeRetencion[this.arrayDeRetencion.findIndex(fi => (fi.id == e.target.id))].porcentaje = porcentaje_impuesto.toFixed(3);
        this.arrayDeRetencion[this.arrayDeRetencion.findIndex(fi => (fi.id == e.target.id))].valor = retencionCalculada.toFixed(2);
        this.addPaymentForm.get('montoRentencion').setValue(this.sumatoriaDeRetencion());
        this.resultadoTotal();
    }

    actualizaMontoDeRetencion(){
        this.addPaymentForm.get('montoRentencion').setValue(this.sumatoriaDeRetencion());
    }
}

