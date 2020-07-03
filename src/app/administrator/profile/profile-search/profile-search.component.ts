import { Component, OnInit } from '@angular/core';
import { EntProfile } from '../../../Class/EntProfile';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {
  searchString: string = '';
  profiles: EntProfile[];
  profileSel: EntProfile;
  boolEdit = false;
  boolPermission = false;

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Buscar Perfiles')
  }

  ngOnInit() {
  }

  getProfiles() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchString.trim() == '')
      buscar = null;
    else
      buscar = this.searchString.trim().replace(' ', "%");
    this.carteraService.GetProfiles(null, buscar).subscribe(result => {
      this.profiles = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clear() {
    this.profiles = [];
    this.searchString = '';
  }

  delete(val: EntProfile) {
    this.utilService.confirm('¿Desea eliminar el perfil "' + val.DESCRIPCION + '"?', data => {
      if (data) {
        this.carteraService.DeleteProfile(val).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Perfil "' + val.DESCRIPCION + '" eliminado correctamente.');
          this.profiles = this.profiles.filter(e => e.ID != val.ID);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  edit(val: EntProfile) {
    this.boolEdit = true;
    this.profileSel = val;
  }

  permission(val: EntProfile) {
    this.boolPermission = true;
    this.profileSel = val;
  }

  resultEdit(res: { obj: EntProfile, result: boolean }) {
    if (res.result) {
      let index = this.profiles.findIndex(e => e.ID == res.obj.ID);
      this.profiles[index] = res.obj;
    }
    this.boolEdit = false;
  }
}
