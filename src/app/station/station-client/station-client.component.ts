import { Component, OnInit } from '@angular/core';
import { CarteraService } from '../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { EntClient } from '../../Class/EntClient';
import { StorageService } from '../../services/storage.service';
import { EntBasicClient } from '../../Class/EntBasicClient';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import { focusById } from '../../util/util-lib';

@Component({
  selector: 'app-station-client',
  templateUrl: './station-client.component.html',
  styleUrls: ['./station-client.component.css'],
  animations: [fadeTransition()]
})
export class StationClientComponent implements OnInit {
  clients: EntBasicClient[];
  searchClientStatus: boolean;
  station;
  searchclientid;
  searchclientNom;
  id;
  booleanClient = false;

  constructor(
    private carteraService: CarteraService,
    private storageService: StorageService,
    private principal: PrincipalComponent,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Clientes');
  }

  ngOnInit() {
    this.station = this.storageService.getCurrentStation();
    this.GetParam();
    focusById('btnClient', true);
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    if (id != null)
      this.searchByParam(id);
  }

  searchByParam(id) {
    this.searchclientid = id;
    this.getClient();
  }

  getClient() {
    if (this.searchclientid != null)
      this.router.navigate(['/station/client/' + this.searchclientid]);
    this.utilService.loader(true);
    this.carteraService.getClients(this.searchclientid, null, this.searchClientStatus, this.station, false).subscribe(data => {
      this.utilService.loader(false);
      this.assignClients(data);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      this.utilService.loader(false);
    });
  }

  assignClients(clients: EntBasicClient[]) {
    clients.forEach(element => {
      if (element.cupoAsignado == null)
        element.cupoAsignado = 0;
      if (element.cupoDisponible == null)
        element.cupoDisponible = 0;
    });
    this.clients = clients;
  }

  clearClient() {
    this.clients = null;
    this.searchClientStatus = null;
    this.searchclientid = null;
  }

  resultClient(client: EntClient) {
    this.searchclientid = client.codCliente;
    this.searchclientNom = client.nombre;
    this.getClient();
    this.booleanClient = false;
  }

  openModCli() {
    this.booleanClient = true;
    setTimeout(() => {
      focusById('searchCli');
    }, 10);
  }
}
