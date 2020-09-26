import { Component, OnInit } from '@angular/core';
import { EntPayment } from '../../../Class/EntPayment';
import { EntClient } from '../../../Class/EntClient';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PAYMENTMETHODS } from '../../../Class/PAYMENTMETHODS';
import { focusById } from '../../../util/util-lib';
import { EntReceivable } from '../../../Class/EntReceivable';
import { fadeTransition } from '../../../routerAnimation';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';

@Component({
    selector: 'app-payment-assign',
    templateUrl: './payment-assign.component.html',
    styleUrls: ['./payment-assign.component.css'],
    animations: [fadeTransition()]
})
export class PaymentAssignComponent implements OnInit {
    stationCode: number;
    stationsAll: EntStation[] = [];
    stationSel: EntStation;
    searchPayments: EntPayment[];
    paymentSel: EntPayment;
    client: EntClient;
    receivables: EntReceivable[];
    searchPagoFechaIni;
    searchPagoFechaFin;
    searchPagoEstado;
    formasPago: any[];
    formasPagoAll: any[];
    boolSearchClient;
    boolAC = false;

    constructor(
        private carteraService: CarteraService,
        private principalComponent: PrincipalComponent,
        private title: Title,
        private utilService: UtilService,
        private _storageService: StorageService,
        private _NominaService: NominaService
    ) {
        this.title.setTitle('Asignar pago - Simovil');
    }

    ngOnInit() {
        this.client = new EntClient();
        this.formasPagoAll = Object.create(PAYMENTMETHODS);
        this.formasPago = this.formasPagoAll.filter(e => e.id < 3);
        focusById('btnBoolClient');
        this.GetEstaciones();
    }
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    getFormaPago(value) {
        if (value != null) {
            return this.formasPagoAll.find(e => e.id == value).text;
        }
    }

    getPaymentSearch() {
        this.utilService.loader();
        this.carteraService.getPayment2(this.client.codCliente, this.searchPagoFechaIni, this.searchPagoFechaFin, null, false).subscribe(payments => {
            this.utilService.loader(false);
            this.searchPayments = payments;
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    cleanPaymentSearch() {
        this.searchPagoFechaIni = null;
        this.searchPagoFechaFin = null;
        this.searchPayments = null;
        this.client.codCliente = null;
        this.receivables = null;
    }

    searchClient() {
        if (this.client.codCliente == null) {
            return;
        }
        this.carteraService.GetClient(this.client.codCliente).subscribe(client => {
            if (client.length != 0) {
                this.client = client[0];
            } else {
                this.principalComponent.showMsg('info', 'Información', 'Cliente no encontrado.')
            }
        }, error => {
            console.log(error);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    boolClient() {
        this.boolSearchClient = true
        this.client = new EntClient();
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }

    getCodClient(client: EntClient) {
        this.client = client;
        this.boolSearchClient = false;
        focusById('btnSearchPayment', true);
    }

    SelReceivable(receivable: EntReceivable) {
        this.utilService.loader()
        this.carteraService.AssignPayment(receivable.id, this.paymentSel.idPago).subscribe(res => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('success', 'Éxito', 'Pago asignado correctamente');
            this.boolAC = false;
            this.searchPayments = this.searchPayments.filter(e => e.idPago != this.paymentSel.idPago);
        }, error => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
            console.log(error);
        });
    }

    assignPayment(payment: EntPayment) {
        this.paymentSel = payment;
        this.utilService.loader();
        this.carteraService.getReceivable(payment.cliente, true, null, null, null,  this.stationCode ).subscribe(res => {
            this.utilService.loader(false);
            this.receivables = res;
            if (res.length > 0) {
                this.boolAC = true;
            } else {
                this.principalComponent.showMsg('info', 'Información', 'No se encontro cuentas de cobro pendientes por pagar.');
            }
        }, error => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
            console.log(error);
        });
    }
}
