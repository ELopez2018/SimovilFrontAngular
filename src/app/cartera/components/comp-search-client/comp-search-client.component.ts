import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { EntBasicClient } from '../../../Class/EntBasicClient';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-comp-search-client',
  templateUrl: './comp-search-client.component.html',
  styleUrls: ['./comp-search-client.component.css']
})
export class CompSearchClientComponent implements OnInit {
  @Output() submiter = new EventEmitter<EntBasicClient>();
  clients: EntBasicClient[] = [];
  search;
  stationcode;

  constructor(
    private carteraService: CarteraService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.stationcode = this.storageService.getCurrentStation();
  }

  getClient() {
    this.utilService.loader(true);
    this.carteraService.getClients(this.search, null, null, this.stationcode, false).subscribe(result => {
      this.utilService.loader(false);
      this.clients = result;
      if (result && result.length == 0)
        this.principal.showMsg('info', 'Información', 'Consulta sin resultados');
      if (result && result.length == 1)
        this.select(result[0]);
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
      this.utilService.loader(false);
      console.log(error);
    });
  }

  clear() {
    this.search = null;
    this.clients = [];
  }

  select(client: EntBasicClient) {
    this.submiter.emit(client);
    this.clear();
  }

}
