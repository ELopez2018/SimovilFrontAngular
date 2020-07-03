import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { EntInvoice } from '../../../Class/EntInvoice';
import { fadeTransition } from '../../../routerAnimation';
import { INVOICENOVELTYTYPES } from '../../../Class/INVOICENOVELTYTYPES';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { EntProvider } from '../../../Class/EntProvider';
import { PrintService } from '../../../services/print.service';
import { INoveltyTypes } from '../../../Class/inovelty-types';
import { StorageService } from '../../../services/storage.service';
import { focusById } from '../../../util/util-lib';

@Component({
    selector: 'app-invoice-search',
    templateUrl: './invoice-search.component.html',
    styleUrls: ['./invoice-search.component.css'],
    animations: [fadeTransition()]
})
export class InvoiceSearchComponent implements OnInit {

    invoices: EntInvoice[];
    searchNum = null;
    searchProvider: number = null;
    searchProviderDet: string = null;
    fechaIni;
    fechaFin;
    noveltyTypes: INoveltyTypes[];
    noveltyTypeSelected: INoveltyTypes;
    stationSelected: EntStation;
    stationsAll: EntStation[];
    providers: EntProvider[];
    invoiceSel: EntInvoice;
    boolHistory = false;
    boolNovelty = false;
    boolProvider = false;
    boolAprox = false;
    rol;
    stationCode;
    searchAdvance = false;
    historial = true;

    constructor(
        private carteraService: CarteraService,
        private nominaService: NominaService,
        private principal: PrincipalComponent,
        private title: Title,
        private router: Router,
        private utilService: UtilService,
        private printService: PrintService,
        private storageService: StorageService
    ) {
        this.title.setTitle('Buscar factura - Simovil');
        this.noveltyTypes = INVOICENOVELTYTYPES;
        this.rol = this.storageService.getCurrentUserDecode().idRol;
        this.stationCode = this.storageService.getCurrentStation();
    }

    ngOnInit() {
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error));
        this.getProviders();
        focusById('searchid');
    }

    getProviders() {
        this.utilService.loader(true);
        this.carteraService.getProvider().subscribe(data => {
            this.providers = data;
            this.utilService.loader(false);
        },
            error => {
                console.log(error);
                this.utilService.loader(false);
            });
    }

    getInvoices() {
        this.utilService.loader(true);
        const status = this.noveltyTypeSelected == null ? null : this.noveltyTypeSelected.id;
        const searchNumInvoice = this.searchNum == null ? null : this.searchNum.length == 0 ? null : this.searchNum;
        const station = this.stationCode ? this.stationCode : this.stationSelected ? this.stationSelected.idEstacion : null;
        this.carteraService.getInvoice(null, searchNumInvoice, this.searchProvider, this.fechaIni, this.fechaFin, status, station, this.boolAprox, null, false, this.historial).subscribe(result => {
            this.invoices = result;
            this.utilService.loader(false);
        }, error => {
            this.principal.showMsg('error', 'Error', error.error.message);
            console.log(error);
            this.utilService.loader(false);
        });
    }

    assignProvider(provider: EntProvider) {
        this.searchProvider = provider.nit;
        this.searchProviderDet = provider.nombre;
        this.boolProvider = false;
        focusById('btnSearch');
    }

    srchPro() {
        this.boolProvider = true;
        setTimeout(() => {
            focusById('searchPro');
        }, 10);
    }

    nameNoveltyType(code: number) {
        if (this.noveltyTypes == null) {
            return;
        }
        return this.noveltyTypes.find(e => e.id == code).name;
    }

    getNameProvider(id: number) {
        if (this.providers == null || id == null) {
            return;
        }
        return this.providers.find(
            e => e.nit == id
        ).nombre;
    }

    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion == id
        ).nombreEstacion;
    }

    clearInvoices() {
        this.invoices = [];
        this.searchNum = null;
        this.searchProvider = null;
        this.searchProviderDet = null;
        this.noveltyTypeSelected = null;
        this.stationSelected = null;
        this.fechaFin = null;
        this.fechaIni = null;
        this.boolAprox = false;
    }

    addInvoiceNovelty(invoice: EntInvoice) {
        if (invoice.estado == 5) {
            this.router.navigate(['/invoice/add/' + btoa(invoice.id.toString())]);
        }
        else {
            this.router.navigate(['/invoice/novelty/' + btoa(invoice.id.toString())]);
        }
    }

    searchHistory(invoice: EntInvoice) {
        this.invoiceSel = invoice;
        this.boolHistory = true;
    }

    getPaymentCertificate(invoice: EntInvoice) {
        this.utilService.loader(true);
        this.carteraService.GetPaymentCertificate(invoice.rutaPago).subscribe(result => {
            this.printService.downloadFile(result.encode, result.name);
            this.utilService.loader(false);
        }, error => {
            this.principal.showMsg('error', 'Error', error.error.message);
            console.log(error);
            this.utilService.loader(false);
        });
    }

    resultNovelty(result: { invoice: EntInvoice, result: boolean, delete: boolean }) {
        const index = this.invoices.findIndex(e => e.id == result.invoice.id);
        if (result.result) {
            this.invoices[index] = result.invoice;
        }
        this.boolNovelty = false;
    }

    addNovelty(invoice: EntInvoice) {
        this.utilService.loader(true);
        console.log(this.rol);
        this.carteraService.getInvoicesPending(this.rol, this.stationCode, invoice.id, null, false, false).subscribe(result => {
            this.utilService.loader(false);
            console.log(result);
            if (result && result.length === 1) {
                this.invoiceSel = invoice;
                this.boolNovelty = true;
            } else {
                this.principal.showMsg('warn', 'Advertencia', 'No tiene los permisos requeridos');
            }
        }, error => {
            this.principal.showMsg('error', 'Error', error.error.message);
            this.utilService.loader(false);
            console.log(error);
        });
    }
}
