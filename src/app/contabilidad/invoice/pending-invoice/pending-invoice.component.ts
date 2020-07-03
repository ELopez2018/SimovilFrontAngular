import { Component, OnInit, HostListener } from '@angular/core';
import { EntInvoice } from '../../../Class/EntInvoice';
import { EntStation } from '../../../Class/EntStation';
import { INVOICENOVELTYTYPES } from '../../../Class/INVOICENOVELTYTYPES';
import { EntProvider } from '../../../Class/EntProvider';
import { CarteraService } from '../../../services/cartera.service';
import { NominaService } from '../../../services/nomina.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { fadeTransition } from '../../../routerAnimation';
import { StorageService } from '../../../services/storage.service';
import { forkJoin } from 'rxjs';
import { TABLEINVOICEPENDING, iTableConfig } from '../../../Class/TABLES_CONFIG';
import { focusById, cleanString } from '../../../util/util-lib';

@Component({
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.css'],
  animations: [fadeTransition()]
})

export class PendingInvoiceComponent implements OnInit {
  invoicesFiltered: EntInvoice[];
  invoicesAll: EntInvoice[];
  stationsAll: EntStation[];
  noveltyTypes = INVOICENOVELTYTYPES;
  providers: EntProvider[];
  boolHistory = false;
  boolNovelty = false;
  invoiceSel: EntInvoice;
  rol;
  stationcode;
  boolSearch = true;
  configTable: iTableConfig[];
  booleanTableConfig = false;
  nameTAbleConfig: string;
  el;
  boolFilter = false;
  stringFilter: string;
  typefilter
  filtered = false

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private router: Router,
    private title: Title,
    private utilService: UtilService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Facturas pendientes - Simovil')
    this.rol = this.storageService.getCurrentUserDecode().idRol;
    this.stationcode = this.storageService.getCurrentStation();
  }

  ngOnInit() {
    if (this.storageService.getTableConfg('invoicePending') != null) {
      this.configTable = this.storageService.getTableConfg('invoicePending');
    } else {
      this.configTable = TABLEINVOICEPENDING;
      this.storageService.setTableConfg('invoicePending', TABLEINVOICEPENDING);
    }
    this.utilService.loader(true);
    forkJoin(this.nominaService.GetStations(),
      this.carteraService.getProvider()).subscribe(([res1, res2]) => {
        this.stationsAll = res1;
        this.providers = res2;
        this.getInvoices();
      }, error => console.log(error));
  }

  get invoices() {
    if (this.filtered) {
      return this.invoicesFiltered;
    } else {
      return this.invoicesAll;
    }
  }

  getNameStation(id: number) {
    if (this.stationsAll == null || id == null) {
      return;
    }
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }

  getNameProvider(id: number) {
    if (this.providers == null || id == null) {
      return;
    }
    return this.providers.find(
      e => e.nit == id
    ).nombre;
  }

  getStatusName(id: number) {
    try {
      if (id != null) {
        return this.noveltyTypes.find(
          e => e.id == id
        ).name;
      }
    } catch (error) {
      return '';
    }
  }

  getInvoices() {
    this.boolSearch = false;
    this.utilService.loader(true);
    // this.carteraService.getInvoicesPending('' + this.rol, this.stationcode, null, false, false, true).subscribe(data => {
    this.carteraService.getInvoicesPending('' + this.rol, this.stationcode, null, false, false, this.exits('Historial')).subscribe(data => {
      this.invoicesAll = data;
      if (this.filtered) {
        this.filter();
      }
      this.utilService.loader(false);
      this.boolSearch = true;
    }, error => {
      this.boolSearch = true;
      console.log(error);
      this.utilService.loader(false);
    });
  }

  searchHistory(invoice: EntInvoice) {
    this.invoiceSel = invoice;
    this.boolHistory = true;
  }

  addNovelty(invoice: EntInvoice) {
    if (invoice.estado == 5) {
      this.utilService.confirm('¿Desea reemplazar la factura o pasar a recibido nuevamente?', result => {
        if (result) {
          this.router.navigate(['/invoice/add/' + btoa(invoice.id.toString())]);
        } else if (result != null) {
          this.invoiceSel = invoice;
          this.boolNovelty = true;
        }
      }, ["Nuevo factura", "Recibido"])
    } else {
      this.invoiceSel = invoice;
      this.boolNovelty = true;
    }
  }

  porCobrar(estado: number) {
    switch (estado) {
      case 0:
        return 'tb color_gray';
      case 1:
        return 'tb color_white';
      case 2:
        return 'tb color_red';
      case 3:
        return 'tb color_orange';
      case 4:
        return 'tb color_yellow';
      case 5:
        return 'tb color_violet';
      case 6:
      case 13:
        return 'tb color_green';
      case 7:
        return 'tb color_blue';
    }
  }

  resultNovelty(result: { invoice: EntInvoice, result: boolean, delete: boolean }) {
    // invoicesall
    let index = this.invoicesAll.findIndex(e => e.id == result.invoice.id);
    if (result.delete) {
      this.invoicesAll.splice(index, 1);
    } else if (result.result) {
      this.invoicesAll[index] = result.invoice;
 }
    // filtered
    if (this.invoicesFiltered && this.invoicesFiltered.length > 0) {
      index = this.invoicesFiltered.findIndex(e => e.id == result.invoice.id);
      if (result.delete) {
        this.invoicesFiltered.splice(index, 1);
      } else if (result.result) {
        this.invoicesFiltered[index] = result.invoice;
 }
    }
    this.boolNovelty = false;
  }

  resultTableConfig() {
    this.configTable = this.storageService.getTableConfg('invoicePending');
    this.booleanTableConfig = false;
  }

  configTb() {
    this.booleanTableConfig = true;
    this.nameTAbleConfig = 'invoicePending';
  }

  exits(val: string) {
    try {
      return this.configTable.find(e => e.name == val).visible;
    } catch (error) {
      return false;
    }
  }

  showFilter() {
    this.boolFilter = true;
    setTimeout(() => {
      focusById('stringFilter');
    }, 10);
  }

  filter() {
    this.stringFilter = cleanString(this.stringFilter).toUpperCase();
    this.boolFilter = false;
    this.filtered = true;
    this.invoicesFiltered = this.invoicesAll.filter(e => {
      return e.nombre.indexOf(this.stringFilter) >= 0 || e.proveedor.toString().indexOf(this.stringFilter) >= 0
    });
    this.stringFilter = "";
  }

  hideFilter() {
    // this.getInvoices();
    this.filtered = false;
  }

}
