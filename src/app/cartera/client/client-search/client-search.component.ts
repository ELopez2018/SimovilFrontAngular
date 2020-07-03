import { Component, OnInit } from '@angular/core';
import { EntClient } from '../../../Class/EntClient';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css'],
  animations: [fadeTransition()]
})
export class ClientSearchComponent implements OnInit {

  clients: EntBasicClient[];
  searchId: string = '';
  searchStatus: boolean;

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private utilService: UtilService
  ) {
    this.title.setTitle('Buscar cliente - Simovil');
  }

  ngOnInit() {
  }

  getClients() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchId.trim() == '')
      buscar = null;
    else
      buscar = this.searchId.trim().replace(' ', "%");
    this.carteraService.getClients(buscar, null, this.searchStatus, null, false).subscribe(result => {
      this.clients = result;
      console.log(this.clients);
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clearClients() {
    this.clients = [];
    this.searchId = '';
    this.searchStatus = null;
  }

  deleteClient(client: EntBasicClient) {
    this.utilService.confirm('¿Desea eliminar el cliente ' + client.nombre + '?', data => {
      if (data) {
        this.carteraService.DeleteClient(client.codCliente).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Cliente ' + client.codCliente + ' eliminado correctamente.');
          this.clients = this.clients.filter(e => e.codCliente != client.codCliente);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  editClient(client: EntBasicClient) {
    this.router.navigate(['/client/edit/' + client.codCliente]);
  }
}
