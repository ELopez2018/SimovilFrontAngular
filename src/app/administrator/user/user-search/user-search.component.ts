import { Component, OnInit } from '@angular/core';
import { EntUserDB } from '../../../Class/EntUserDB';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { fadeTransition } from '../../../routerAnimation';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Md5 } from 'ts-md5';
import { UtilService } from '../../../services/util.service';
import { EntRole } from '../../../Class/EntRole';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
  animations: [fadeTransition()]
})
export class UserSearchComponent implements OnInit {
  users: EntUserDB[];
  searchUserid: string = '';
  searchUserStatus: boolean;
  roles: EntRole[];

  constructor(
    private carteraService: CarteraService,
    private principal: PrincipalComponent,
    private title: Title,
    private router: Router,
    private authenticationService: AuthenticationService,
    private utilService: UtilService
  ) {
    this.title.setTitle('Simovil - Buscar usuario')
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.carteraService.GetRoles().subscribe(data => {
      this.roles = data;
    }, error => console.log(error));
  }

  getUsers() {
    this.utilService.loader(true);
    let buscar = '';
    if (this.searchUserid.trim() == '')
      buscar = null;
    else
      buscar = this.searchUserid.trim().replace(' ', "%");
    this.carteraService.GetUser(buscar, null, this.searchUserStatus, null).subscribe(result => {
      this.users = result;
      this.utilService.loader(false);
    }, error => {
      console.log(error);
      this.utilService.loader(false);
    });
  }

  clearUsers() {
    this.users = [];
    this.searchUserid = '';
    this.searchUserStatus = null;
  }

  getNameRole(value) {
    if (value != null) {
      return this.roles.find(e => e.ID == value).DESCRIPCION;
    }
  }

  deleteUser(user: EntUserDB) {
    this.utilService.confirm('¿Desea eliminar el usuario ' + user.idUsuario + '?', data => {
      if (data) {
        this.carteraService.DeleteUser(user).subscribe(result => {
          this.principal.showMsg('success', 'Éxito', 'Usuario ' + user.idUsuario + ' eliminado correctamente.');
          this.users = this.users.filter(e => e.idUsuario != user.idUsuario);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
        });
      }
    });
  }

  editUSer(user: EntUserDB) {
    this.router.navigate(['/user/edit/' + user.idUsuario]);
  }

  randomPass() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < 10; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    return pass;
  }

  resetPass(user: EntUserDB) {
    this.utilService.confirm('Asigna y envía una nueva contraseña al usuario, ¿Desea continuar?', result => {
      if (result) {
        this.utilService.loader(true);
        var pass = this.randomPass();
        let updatePass = {
          newpass: btoa(Md5.hashAsciiStr(pass).toString()),
          mailpass: btoa(pass),
          email: user.email,
          reset: true,
          root: true
        };
        this.authenticationService.updatePass(updatePass, user.idUsuario).subscribe(data => {
          this.principal.showMsg('success', 'Éxito', 'Contraseña reseteada correctamente.');
          this.utilService.loader(false);
        }, error => {
          this.principal.showMsg('error', 'Error', error.error.message);
          console.log(error);
          this.utilService.loader(false);
        });
      }
    });
  }

}
