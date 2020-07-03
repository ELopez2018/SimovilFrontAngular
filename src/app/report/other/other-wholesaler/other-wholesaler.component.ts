import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { fadeTransition } from '../../../routerAnimation';
import { EntInvoice } from '../../../Class/EntInvoice';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UtilService } from '../../../services/util.service';
import { EntStation } from '../../../Class/EntStation';
import { PrintService } from '../../../services/print.service';
import { rangedate, dateToISOString } from '../../../util/util-lib';

@Component({
  selector: 'app-other-wholesaler',
  templateUrl: './other-wholesaler.component.html',
  styleUrls: ['./other-wholesaler.component.css'],
  animations: [fadeTransition()]
})
export class OtherWholesalerComponent implements OnInit {

  @Input() station: EntStation;
  @Input() fechaIni: string;
  @Input() pending: boolean;
  @Input() search: boolean;
  fechaFin;
  invoices: EntInvoice[];
  invoiceSel: EntInvoice;
  searchProviderDet: string = null;
  boolPayment = false;
  rol;
  saldoSel = 0;
  saldoAll = 0;
  valorAll = 0;

  constructor(
    private carteraService: CarteraService,
    // private nominaService: NominaService,
    private principal: PrincipalComponent,
    private router: Router,
    private utilService: UtilService,
    private printService: PrintService,
    private storageService: StorageService
  ) {
    this.rol = this.storageService.getCurrentUserDecode().idRol;
  }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
    // console.log(change);
    if (change.search)
      this.getInvoices();
    if (this.fechaIni)
      this.fechaFin = dateToISOString(rangedate(this.fechaIni, 1)[1]);
  }

  getInvoices() {
    this.utilService.loader(true);
    let fechaIni = (this.fechaIni != null || this.fechaIni != '') ? this.fechaIni : null;
    let fechaFin = (this.fechaFin != null || this.fechaFin != '') ? this.fechaFin : null;
    this.carteraService.getWholeSalerInvoices(this.station.idEstacion, this.pending, false, fechaIni, fechaFin).subscribe(result => {
      this.invoices = result;
      this.saldoAll = this.invoices.filter(e => e.rutaPago == null).reduce((a, b) => a + b.saldo, 0);
      this.valorAll = this.invoices.filter(e => e.rutaPago == null).reduce((a, b) => a + b.valor, 0);
      this.utilService.loader(false);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clearInvoices() {
    this.invoices = [];
    this.searchProviderDet = null;
    this.fechaFin = null;
    this.fechaIni = null;
    this.saldoSel = 0;
    this.saldoAll = 0;
    this.valorAll = 0;
  }

  searchPayment(invoice: EntInvoice) {
    this.invoiceSel = invoice;
    this.saldoSel = invoice.pagos.reduce((a, b) => a + b.VALOR, 0);
    this.boolPayment = true;
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

  isPaid(invoice: EntInvoice) {
    let res = null;
    (invoice.saldo == 0 || (invoice.rutaPago && invoice.rutaPago)) ? res = true : res = false;
    return res ? 'Sí' : 'No';
  }

}
