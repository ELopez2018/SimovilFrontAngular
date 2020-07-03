import { Component, OnInit } from '@angular/core';
import { EntUserDB } from '../../../Class/EntUserDB';
import { Title } from '@angular/platform-browser';
import { CarteraService } from '../../../services/cartera.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Md5 } from 'ts-md5';
import { fadeTransition } from '../../../routerAnimation';
import { EntRole } from '../../../Class/EntRole';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  animations: [fadeTransition()]
})
export class UserAddComponent implements OnInit {
  roles: EntRole[];
  userAddForm: FormGroup;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent
  ) {
    this.title.setTitle('Agregar usuario - Simovil')
  }

  ngOnInit() {
    this.getRoles();
    this.buildForm();
  }

  buildForm() {
    this.userAddForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.maxLength(15)]],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/)]],
      password2: ['', [Validators.required, Validators.pattern('estoesparaquenovalide')]],
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get password() { return this.userAddForm.get('password'); }
  get password2() { return this.userAddForm.get('password2'); }


  getRoles() {
    this.carteraService.GetRoles().subscribe(data => {
      this.roles = data;
    }, error => console.log(error));
  }

  validarUser(value: string) {
    if (value.length == 0) {
      return;
    }
    this.carteraService.GetUser(value, null, null, true)
      .subscribe(data => {
        if (typeof (data[0]) === 'undefined') {
          return;
        }
        this.principalComponent.showMsg('warn', 'Advertencia', 'Usuario ya registrado');
      }, error => console.log('Sin registro'));
  }

  validatePass(value) {
    switch (value) {
      case 0:
        if (this.userAddForm.get('password2').value == '') {
          return;
        }
        else {
          this.asignarValidator(0);
        }
        break;
      case 1:
        this.asignarValidator(0);
        break;
      case 2:
        if (this.userAddForm.get('password').value == '') {
          this.asignarValidator(1);
        } else {
          this.asignarValidator(0);
        }
        break;
    }
  }

  asignarValidator(value) {
    this.userAddForm.get('password2').clearValidators;
    if (value == 0) {
      this.userAddForm.get('password2').setValidators([Validators.required, Validators.pattern(this.password.value)]);
    }
    else {
      this.userAddForm.get('password2').setValidators([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/)]);
    }
    this.userAddForm.get('password2').setValue(this.userAddForm.get('password2').value);
  }

  submitUserAddForm() {
    if (this.password.value != this.password2.value) {
      this.principalComponent.showMsg('error', 'Error', 'La nueva contraseña y la confirmación no es la misma.');
      return;
    }
    this.sending = true;
    let user = new EntUserDB();
    user.idUsuario = btoa(String(this.userAddForm.get('idUsuario').value).toLocaleUpperCase().trim());
    user.primerNombre = String(this.userAddForm.get('primerNombre').value).toLocaleUpperCase().trim();
    user.primerApellido = String(this.userAddForm.get('primerApellido').value || '').toLocaleUpperCase().trim();
    user.segundoNombre = String(this.userAddForm.get('segundoNombre').value || '').toLocaleUpperCase().trim();
    user.segundoApellido = String(this.userAddForm.get('segundoApellido').value || '').toLocaleUpperCase().trim();
    user.rol = this.userAddForm.get('rol').value.ID;
    user.password = btoa(Md5.hashAsciiStr(this.password.value).toString());
    user.estado = true;
    user.cambiarPass = true;
    user['passwordmail'] = btoa(this.password.value.toString());
    user.email = String(this.userAddForm.get('email').value).toLocaleLowerCase().trim();
    this.carteraService.InsertUser(user).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Usuario ' + this.userAddForm.get('idUsuario').value + ' creado correctamente.');
      this.userAddForm.reset();
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }
}
