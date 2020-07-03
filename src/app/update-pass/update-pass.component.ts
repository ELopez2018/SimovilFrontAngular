import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication.service';
import { EntUser } from '../Class/EntUser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrincipalComponent } from '../principal/principal.component';
import { Md5 } from 'ts-md5';
import { fadeTransition } from '../routerAnimation';
import { focusById } from '../util/util-lib';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrls: ['./update-pass.component.css'],
  animations: [fadeTransition()]
})
export class UpdatePassComponent implements OnInit {
  updatePassForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private title: Title,
    private authenticationService: AuthenticationService,
    private principal: PrincipalComponent
  ) {
    this.title.setTitle('Simovil - Cambiar Contraseña');
  }

  ngOnInit() {
    this.buildForm();
    focusById('currentPassword');
  }

  buildForm() {
    this.updatePassForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/)]],
      repeatNewPassword: ['', [Validators.required, Validators.pattern('estoesparanovalidar')]]
    });
  }

  get currentPassword() { return this.updatePassForm.get('currentPassword'); }
  get newPassword() { return this.updatePassForm.get('newPassword'); }
  get repeatNewPassword() { return this.updatePassForm.get('repeatNewPassword'); }

  validatePass(value) {
    switch (value) {
      case 0:
        if (this.updatePassForm.get('repeatNewPassword').value == '')
          return;
        else
          this.asignarValidator(0);
        break;
      case 1:
        this.asignarValidator(0);
        break;
      case 2:
        if (this.updatePassForm.get('newPassword').value == '') {
          this.asignarValidator(1);
        } else
          this.asignarValidator(0);
        break;
    }
  }

  asignarValidator(value) {
    this.updatePassForm.get('repeatNewPassword').clearValidators;
    if (value == 0)
      this.updatePassForm.get('repeatNewPassword').setValidators([Validators.required, Validators.pattern(this.newPassword.value)]);
    else
      this.updatePassForm.get('repeatNewPassword').setValidators([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/)]);
    this.updatePassForm.get('repeatNewPassword').setValue(this.updatePassForm.get('repeatNewPassword').value);
  }

  submitUpdatePassForm() {
    let currentpass = this.updatePassForm.get('currentPassword').value;
    let newpass = this.updatePassForm.get('newPassword').value;
    let repeatNewPassword = this.updatePassForm.get('repeatNewPassword').value;
    if (repeatNewPassword != newpass) {
      this.principal.showMsg('error', 'Error', 'La nueva contraseña y la confirmación no es la misma.');
      return;
    }
    if (currentpass == newpass) {
      this.principal.showMsg('warn', 'Advertencia', 'La actual y nueva constraseña son iguales.');
      return;
    }
    let updatePass = {
      currentpass: btoa(Md5.hashAsciiStr(currentpass).toString()),
      newpass: btoa(Md5.hashAsciiStr(newpass).toString())
    };
    this.authenticationService.updatePass(updatePass, null).subscribe(result => {
      this.principal.showMsg('success', 'Éxito', 'Contraseña actualizada correctamente.');
      this.updatePassForm.reset();
    }, error => {
      this.principal.showMsg('error', 'Error', error.error.message);
    });
  }

}
