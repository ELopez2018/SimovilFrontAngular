import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../services/cartera.service';
import { dateToISOString, isoDateToLocalString, focusById, addDays } from '../../util/util-lib';
import { PrincipalComponent } from '../../principal/principal.component';
import { StorageService } from '../../services/storage.service';
import { UtilService } from '../../services/util.service';
import { EntBasicClient } from '../../Class/EntBasicClient';
import { fadeTransition } from '../../routerAnimation';
import { PrintService } from '../../services/print.service';
import { forkJoin } from 'rxjs';
import { NominaService } from '../../services/nomina.service';

@Component({
  selector: 'app-station-admin-receivable',
  templateUrl: './station-admin-receivable.component.html',
  styleUrls: ['./station-admin-receivable.component.css'],
  animations: [fadeTransition()]
})
export class StationAdminReceivableComponent implements OnInit {

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private storageService: StorageService,
    private utilService: UtilService,
    private printService: PrintService
  ) {
    this.codStation = this.storageService.getCurrentStation();
  }

  fecha;
  fechaCliIni;
  fechaCliFin;
  codStation: number;
  clients: EntBasicClient[];
  tabs;
  boolCreateRec = false;
  clientSel: EntBasicClient;

  ngOnInit() {
    this.fecha = dateToISOString(new Date());
    this.getclientsPending();
    this.tabs = [
      { estado: true, classTab: '' },
      { estado: false, classTab: '' },
      { estado: false, classTab: '' }
    ];
    this.setTab(this.tabs);
  }

  autoCreate() {
    if (this.fecha == null || this.fecha == '') {
      this.principal.showMsg('info', 'Información', 'El campo fecha está vacío.');
      return;
    }
    this.utilService.confirm('Generará las cuentas de cobro de los clientes asignados a su estación. ¿Desea continuar?', res => {
      if (res) {
        const fech = dateToISOString(addDays(this.fecha, 1));
        this.utilService.loader();
        this.carteraService.createReceivable(fech, this.codStation).subscribe(res => {
          this.utilService.loader(false);
          this.principal.showMsg('success', 'Éxito', 'Proceso realizado correctamente');
        }, error => {
          this.utilService.loader(false);
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  getclientsPending() {
    this.utilService.loader();
    this.carteraService.getReceivablePending(this.codStation).subscribe(r => {
      this.utilService.loader(false);
      this.clients = r;
    }, error => {
      console.log(error);
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

  SelectClient(val: EntBasicClient) {
    this.boolCreateRec = true;
    this.clientSel = val;
    console.log(val);
    this.fechaCliIni = dateToISOString(val['FECHA_MIN']);
    this.fechaCliFin = dateToISOString(val['FECHA_MAX']);
    setTimeout(() => {
      focusById('fechaCorte');
    }, 10);
  }

  createReceivable() {
    this.utilService.confirm('¿Desea crear la cuenta de cobro del cliente ' + this.clientSel.nombre + ' a corte del ' + isoDateToLocalString(this.fechaCliFin) + '?', res => {
      if (res) {
        this.utilService.loader();
        this.carteraService.createReceivableByClient(this.fechaCliIni, this.fechaCliFin, this.clientSel.codCliente, this.codStation).subscribe(r => {
          this.utilService.loader(false);
          this.principal.showMsg('success', 'Éxito', 'Proceso realizado correctamente');
          this.getclientsPending();
          this.printRec(r[0].ID);
        }, error => {
        this.utilService.loader(false);
          console.log(error);
          this.principal.showMsg('error', 'Error', error.error.message);
        });
      }
    });
  }

  printRec(id) {
    this.utilService.confirm('¿Desea imprimir la cuenta de cobro?', res => {
      if (res) {
        this.utilService.loader();
        forkJoin(
          this.carteraService.getReceivable(null, null, null, null, id, null),
          this.carteraService.getConsumption(null, null, null, id, null)
        ).subscribe(([res1, res2]) => {
            console.log(res1, res2 );
          this.nominaService.GetStations(res1[0].estacion).subscribe(res => {
            this.printService.printReceivable(res1[0], res2, res[0], result => {
              this.utilService.loader(false);
            });
          }, error => {
            this.utilService.loader(false);
            console.log(error);
          });
        }, error => {
          this.utilService.loader(false);
          console.log(error);
        });
      }
    });
  }

  tabClass(value: number) {
    if (this.tabs[value].estado == true) {
      return;
    } else {
      this.tabs.forEach(e => {
        e.estado = false;
        e.classTab = '';
      });
      if (this.tabs[value].estado == false) {
        this.tabs[value].estado = true;
        this.tabs[value].classTab = 'active';
      }
    }
    if (value == 1) {
      this.getclientsPending();
    }
  }

  setTab(tabl) {
    tabl.forEach(element => {
      if (element.estado == true) {
        element.classTab = 'active';
        element.classPane = 'show active';
      } else {
        element.classTab = '';
        element.classPane = '';
      }
    });
  }

  get valid() {
    return (this.clientSel && this.clientSel.codCliente && this.fechaCliIni && this.fechaCliFin) ? true : false;
  }
}
