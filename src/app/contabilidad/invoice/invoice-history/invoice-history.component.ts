import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EntInvoice } from '../../../Class/EntInvoice';
import { INVOICENOVELTYTYPES } from '../../../Class/INVOICENOVELTYTYPES';
import { INoveltyTypes } from '../../../Class/inovelty-types';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  @Input() invoice: EntInvoice;
  noveltyTypes: INoveltyTypes[];
  boolDev = false;
  show = false;

  ngOnChanges(changes: SimpleChanges) {
    this.assigninvoice();
  }

  constructor(
    private cartera: CarteraService,
    private util: UtilService
  ) {
  }

  ngOnInit() {
    this.noveltyTypes = INVOICENOVELTYTYPES;
  }

  assigninvoice() {
    if (this.invoice) {
    console.log(this.invoice);
      this.util.loader()
      this.cartera.getInvoice(this.invoice.id).subscribe(res => {
        this.invoice = res[0];
        this.invoice.novedadFactura.filter(e => e.facturaDev != null).length > 0 ? this.boolDev = true : this.boolDev = false;
        this.show = true;
        this.util.loader(false);
      }, error => {
        this.show = false;
        this.invoice = null;
        this.util.loader(false);
        console.log('error', 'Error', 'No se pudo obtener los datos');
      });
    }
  }

  getNameNovelty(value: number) {
    let novelty = this.noveltyTypes.find(e => e.id == value);
    return novelty == null ? '' : novelty.name;
  }

}
