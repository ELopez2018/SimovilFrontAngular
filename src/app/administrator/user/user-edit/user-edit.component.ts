import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntUserDB } from '../../../Class/EntUserDB';
import { ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../../../routerAnimation';
import { Location } from '@angular/common';
import { UtilService } from '../../../services/util.service';
import { EntRole } from '../../../Class/EntRole';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  animations: [fadeTransition()]
})
export class UserEditComponent implements OnInit {
  roles: EntRole[];
  userForm: FormGroup;
  searchclientid;
  id;
  user: EntUserDB;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent,
    private route: ActivatedRoute,
    private location: Location,
    private utilService: UtilService
  ) {
    this.title.setTitle('Agregar usuario - Simovil')
  }

  ngOnInit() {
    this.getRoles();
    this.buildForm();
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    if (id != null)
      this.searchByParam(id);
  }

  searchByParam(id) {
    this.searchclientid = id;
    this.getUser();
  }

  getUser() {
    this.carteraService.GetUser(this.searchclientid, null, null, true).subscribe(data => {
      this.assignUser(data[0]);
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  buildForm() {
    this.userForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.maxLength(15)]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      rol: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      estado: ['', Validators.required],
      cambiarPass: ['']
    });
    this.userForm.get('idUsuario').disable();
  }

  assignUser(user: EntUserDB) {
    this.userForm.get('idUsuario').setValue(user.idUsuario);
    this.userForm.get('primerNombre').setValue(user.primerNombre);
    this.userForm.get('segundoNombre').setValue(user.segundoNombre);
    this.userForm.get('primerApellido').setValue(user.primerApellido);
    this.userForm.get('segundoApellido').setValue(user.segundoApellido);
    this.userForm.get('email').setValue(user.email);
    this.userForm.get('rol').setValue(this.roles.find(e => e.ID == user.rol));
    this.userForm.get('estado').setValue(user.estado);
    this.userForm.get('cambiarPass').setValue(user.cambiarPass);
  }

  getRoles() {
    this.carteraService.GetRoles().subscribe(data => {
      this.roles = data;
      this.GetParam();
    }, error => console.log(error));
  }

  submitUserForm() {
    this.sending = true;
    let user = new EntUserDB();
    user.idUsuario = String(this.userForm.get('idUsuario').value).toLocaleUpperCase().trim();
    user.primerNombre = String(this.userForm.get('primerNombre').value).toLocaleUpperCase().trim();
    user.primerApellido = String(this.userForm.get('primerApellido').value).toLocaleUpperCase().trim();
    user.segundoNombre = this.userForm.get('segundoNombre').value == null ? null : String(this.userForm.get('segundoNombre').value).toLocaleUpperCase().trim();
    user.segundoApellido = this.userForm.get('segundoApellido').value == null ? null : String(this.userForm.get('segundoApellido').value).toLocaleUpperCase().trim();
    user.rol = this.userForm.get('rol').value.ID;
    user.estado = Boolean(this.userForm.get('estado').value);
    user.cambiarPass = Boolean(this.userForm.get('cambiarPass').value);
    user.email = String(this.userForm.get('email').value).toLocaleLowerCase().trim();
    this.utilService.loader(true);
    this.carteraService.UpdateUser(user).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Usuario ' + this.userForm.get('idUsuario').value + ' actualizado correctamente.');
      this.userForm.reset();
      this.back();
      this.utilService.loader(false);
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
      this.utilService.loader(false);
    }, () => this.sending = false);
  }

  back() {
    this.location.back();
  }
}

