import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { EntProvider } from '../../../Class/EntProvider';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-comp-search-provider',
  templateUrl: './comp-search-provider.component.html',
  styleUrls: ['./comp-search-provider.component.css']
})
export class CompSearchProviderComponent implements OnInit {
  @Output() submiter = new EventEmitter<EntProvider>();
  @Input() tipo: number;
  providers: EntProvider[] = [];
  search;
  stationcode;
  boolProvider: boolean;
  constructor(
    private carteraService: CarteraService,
    private utilService: UtilService,
    private principal: PrincipalComponent,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.stationcode = this.storageService.getCurrentStation();
  }

  getProvider() {
    this.utilService.loader(true);
    this.carteraService.getProvider(this.search, null, false, this.tipo).subscribe(result => {
      this.utilService.loader(false);
      this.providers = result;
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
    this.providers = [];
  }

  select(client: EntProvider) {
    this.submiter.emit(client);
    this.clear();
  }
 salir(){
     let salida: EntProvider = {
        autonum: null,
        nit: null,
        dv: null,
        nombre: null,
        tipoDoc: null,
        ciudad: null,
        direccion: null,
        telefono: null,
        email: null,
        estado: null,
        tipo: null,
        usuario: null,
        tipoMayorista : null
     };
    this.submiter.emit(salida);
 }
}
