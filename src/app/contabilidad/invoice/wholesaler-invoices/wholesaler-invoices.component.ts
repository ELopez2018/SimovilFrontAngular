import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { EntInvoice } from '../../../Class/EntInvoice';
import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-wholesaler-invoices',
  templateUrl: './wholesaler-invoices.component.html',
  styleUrls: ['./wholesaler-invoices.component.css'],
  animations: [fadeTransition()]
})
export class WholesalerInvoicesComponent implements OnInit {
  @Input() search = false;
  @Output() submiter = new EventEmitter<EntInvoice>();
  idStation: number;
  invoices: EntInvoice[];
  invoiceSel: EntInvoice;
  saldoProvee: number;
  constructor(
    private carteraService: CarteraService,
    private storageService: StorageService,
    private principal: PrincipalComponent,
    private utilService: UtilService
  ) {
    this.idStation = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    // this.getBasicData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.search) {
      this.getBasicData();
    }
  }

  getBasicData() {
    this.utilService.loader();
    this.carteraService.getWholeSalerInvoices(this.idStation).subscribe(res => {
        this.saldoProvee = 0;
        res.map(item => {
          this.saldoProvee += item.saldo;
        });
      this.utilService.loader(false);
      this.invoices = res;
      if (this.invoices && this.invoices.length == 1) {
        this.selectInvoice(this.invoices[0]);
      }
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  selectInvoice(val: EntInvoice) {
    this.submiter.emit(val);
  }
}
