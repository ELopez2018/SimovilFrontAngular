import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';
import { EntRole } from '../../../Class/EntRole';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
})
export class RoleAddComponent implements OnInit {
  roleForm: FormGroup;
  user;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private util: UtilService,
    private principalComponent: PrincipalComponent,
    private storageService: StorageService
  ) {
    this.title.setTitle('Agregar Rol - Simovil');
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.roleForm = this.fb.group({
      descripcion: ['', Validators.required],
      estado: [true, Validators.required]
    });
  }

  submitAddForm() {
    this.sending = true;
    this.util.loader(true);
    let role = new EntRole();
    role.DESCRIPCION = String(this.roleForm.get('descripcion').value).trim();
    role.ESTADO = Boolean(this.roleForm.get('estado').value)
    role.USUARIO = this.user;
    this.carteraService.InsertRole(role).subscribe(result => {
      this.util.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Rol ' + role.DESCRIPCION + ' creado correctamente.');
      this.roleForm.reset();
    }, error => {
      this.util.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }

  clear() {
    this.roleForm.reset();
  }
}
