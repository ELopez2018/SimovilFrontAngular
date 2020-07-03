import { Component, OnInit } from '@angular/core';
import { PrincipalComponent } from '../../principal/principal.component';
import { UtilService } from '../../services/util.service';
import { CarteraService } from '../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { fadeTransition } from '../../routerAnimation';
import { EntInvoice } from '../../Class/EntInvoice';
import { Router } from '@angular/router';
import { EntStation } from '../../Class/EntStation';
import { EntProvider } from '../../Class/EntProvider';
import { INVOICENOVELTYTYPES } from '../../Class/INVOICENOVELTYTYPES';
import { NominaService } from '../../services/nomina.service';

@Component({
  selector: 'app-administrative-home',
  templateUrl: './administrative-home.component.html',
  styleUrls: ['./administrative-home.component.css'],
  animations: [fadeTransition()]
})
export class AdministrativeHomeComponent implements OnInit {

  unpaidInvoices: EntInvoice[];
  unpaidInvoicesConst: EntInvoice[];
  invoicesLabels: string[] = ['Por pagar'];
  invoicesData: number[] = [0];
  invoicesByExpiredLabels: string[] = ['Vencidas', 'No vencidas'];
  invoicesByExpiredData: number[] = [0, 0];
  invoicesByProfileLabels: string[];
  invoicesByProfileData: number[] = [];
  doughnutChartType: string = 'doughnut';
  today = new Date();
  stationsAll: EntStation[];
  noveltyTypes = INVOICENOVELTYTYPES;
  providers: EntProvider[];
  view = false;
  labelTitleInvoice = "";
  invoiceSel: EntInvoice;
  boolHistory = false;

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private principalComponent: PrincipalComponent,
    private router: Router,
    private utilService: UtilService,
    private title: Title
  ) {
    this.title.setTitle('Agregar Anticipo - Simovil');
  }

  ngOnInit() {
    this.getUnpaidInvoices();
    this.getProviders();
    this.nominaService.GetStations().subscribe(data => {
      this.stationsAll = data;
    }, error => console.log(error));
  }

  getUnpaidInvoices() {
    this.utilService.loader(true);
    this.carteraService.getUnpaidInvoices().subscribe(result => {
      this.utilService.loader(false);
      this.assignDataInvoices(result);
    }, error => {
      this.utilService.loader(false);
      console.log(error);
    })
  }

  assignDataInvoices(invoices: EntInvoice[]) {
    invoices.map(e => e.novedadFactura = JSON.parse('' + e.novedadFactura));
    this.unpaidInvoicesConst = invoices;
    var expired = 0;
    var unexpired = 0;
    let arrayPerfil = [];
    if (invoices && invoices.length > 0) {
      this.invoicesData = [invoices.length];
      this.invoicesLabels[0] = 'Por pagar ' + invoices.length  ;
      invoices.forEach(e => {
        if (this.dateExpired(e.fechaVen)) {
          expired++;
        } else {
          unexpired++;
        }
        arrayPerfil.push(e.perfil);
      });
    }
    this.invoicesByExpiredData = [expired, unexpired];
    let cantidadperfil = arrayPerfil.reduce((contador, perfil, arryperfil) => {
      contador[perfil] = (contador[perfil] || 0) + 1;
      return contador;
    }, {});
    while (this.invoicesByProfileData.length > 0)
      this.invoicesByProfileData.pop();
    this.invoicesByProfileLabels = Object.keys(cantidadperfil);
    Object.values(cantidadperfil).map(e => this.invoicesByProfileData.push(+e));
    this.view = true;
  }

  dateExpired(date: string): boolean {
    let dateNew = new Date(date);
    if (dateNew < this.today)
      return true;
    return false;
  }
  // events
  public chartClicked(e: any, chartNum: number): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        this.filterNewArrayInvoices(chartNum, clickedElementIndex);
      }
    }
  }

  filterNewArrayInvoices(chartNum: number, opc: number) {
    switch (chartNum) {
      case 0:
        this.unpaidInvoices = Object.create(this.unpaidInvoicesConst);
        break;
      case 1:
        switch (opc) {
          case 0:
            this.unpaidInvoices = this.unpaidInvoicesConst.filter(e => this.dateExpired(e.fechaVen) == true);
            break;
          case 1:
            this.unpaidInvoices = this.unpaidInvoicesConst.filter(e => this.dateExpired(e.fechaVen) == false);
            break;
        }
        break;
      case 2:
        this.unpaidInvoices = this.unpaidInvoicesConst.filter(e => this.invoicesByProfileLabels[opc] == e.perfil)
        break;
    }
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getHistoryInvoice(invoice: EntInvoice) {
    var lettters = "";
    invoice.novedadFactura.forEach(e => {
      if (e.tipoNovedad == 3)
        lettters += 'R'
      if (e.tipoNovedad == 4)
        lettters += 'A'
      if (e.tipoNovedad == 6)
        lettters += 'C'
      if (e.tipoNovedad == 7)
        lettters += 'P'
    });
    return lettters;
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

  getNameStation(id: number) {
    if (this.stationsAll == null || id == null)
      return;
    return this.stationsAll.find(
      e => e.idEstacion == id
    ).nombreEstacion;
  }

  getNameProvider(id: number) {
    if (this.providers == null || id == null)
      return;
    return this.providers.find(
      e => e.nit == id
    ).nombre;
  }

  getStatusName(id: number) {
    try {
      if (id != null)
        return this.noveltyTypes.find(
          e => e.id == id
        ).name;
    } catch (error) {
      return '';
    }
  }

  searchHistory(invoice: EntInvoice) {
    this.invoiceSel = invoice;
    this.boolHistory = true;
  }

  porCobrar(estado: number) {
    return null;
    //   switch (estado) {
    //     case 0:
    //       return 'tb color_gray';
    //     case 1:
    //       return 'tb color_white';
    //     case 2:
    //       return 'tb color_red';
    //     case 3:
    //       return 'tb color_orange';
    //     case 4:
    //       return 'tb color_yellow';
    //     case 5:
    //       return 'tb color_violet';
    //     case 6:
    //       return 'tb color_green';
    //     case 7:
    //       return 'tb color_blue';
    //   }
  }
}
