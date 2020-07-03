import { Component, OnInit } from '@angular/core';
import { EntRole } from '../../../Class/EntRole';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-role-search',
  templateUrl: './role-search.component.html',
  styleUrls: ['./role-search.component.css']
})
export class RoleSearchComponent implements OnInit {
  searchString: string = '';
  searchStatus: boolean;
  roles: EntRole[];
  roleSel: EntRole;
  boolEdit = false;
  boolPerfil = false;

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Buscar Roles')
  }

  ngOnInit() {
  }

  getRoles() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchString.trim() == '')
      buscar = null;
    else
      buscar = this.searchString.trim().replace(' ', "%");
    this.carteraService.GetRoles(null, buscar, this.searchStatus).subscribe(result => {
      this.roles = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clear() {
    this.roles = [];
    this.searchString = '';
    this.searchStatus = null;
  }

  delete(val: EntRole) {
    this.utilService.confirm('¿Desea eliminar el rol "' + val.DESCRIPCION + '"?', data => {
      if (data) {
        this.carteraService.DeleteRole(val).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Rol "' + val.DESCRIPCION + '" eliminado correctamente.');
          this.roles = this.roles.filter(e => e.ID != val.ID);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  edit(val: EntRole) {
    this.boolEdit = true;
    this.roleSel = val;
  }

  perfiles(val: EntRole) {
    this.boolPerfil = true;
    this.roleSel = val;
  }

  resultEdit(res: { obj: EntRole, result: boolean }) {
    if (res.result) {
      let index = this.roles.findIndex(e => e.ID == res.obj.ID);
      this.roles[index] = res.obj;
    }
    this.boolEdit = false;
  }
}
