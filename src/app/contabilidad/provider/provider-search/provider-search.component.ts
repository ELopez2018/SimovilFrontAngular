import { Component, OnInit } from '@angular/core';
import { EntProvider } from '../../../Class/EntProvider';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-provider-search',
  templateUrl: './provider-search.component.html',
  styleUrls: ['./provider-search.component.css'],
  animations: [fadeTransition()]
})
export class ProviderSearchComponent implements OnInit {
  providers: EntProvider[];
  searchId: string = '';
  searchStatus: boolean;
  // profiles: EntProfile[];

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {
    this.title.setTitle('Buscar Proveedor - Simovil')
  }

  ngOnInit() {
    this.GetParam();
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.searchId = id;
      this.getProviders();
    }
  }

  getProviders() {
    if (this.searchId != null)
      this.router.navigate(['/provider/search/' + this.searchId]);
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchId.trim() == '')
      buscar = null;
    else
      buscar = this.searchId.trim().replace(' ', "%");
    this.carteraService.getProvider(buscar, this.searchStatus, false).subscribe(result => {
      this.providers = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clearUsers() {
    this.providers = [];
    this.searchId = '';
    this.searchStatus = null;
  }

  deleteProvider(provider: EntProvider) {
    this.utilService.confirm('¿Desea eliminar el proveedor con nit ' + provider.nit + '?', data => {
      if (data) {
        this.carteraService.DeleteProvider(provider).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Proveedor ' + provider.nit + ' eliminado correctamente.');
          this.providers = this.providers.filter(e => e.nit != provider.nit);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  editProvider(provider: EntProvider) {
    this.router.navigate(['/provider/edit/' + provider.nit]);
  }

}
