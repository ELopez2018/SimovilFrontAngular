import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntProfile } from '../../../Class/EntProfile';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.component.html',
  styleUrls: ['./profile-add.component.css']
})
export class ProfileAddComponent implements OnInit {
  profileForm: FormGroup;
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
    this.title.setTitle('Agregar Perfil - Simovil');
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }


  submitAddForm() {
    this.sending = true;
    this.util.loader(true);
    let profile = new EntProfile();
    profile.NOMBRE = String(this.profileForm.get('nombre').value).trim();
    profile.DESCRIPCION = String(this.profileForm.get('descripcion').value).trim();
    profile.USUARIO = this.user;
    this.carteraService.InsertProfile(profile).subscribe(result => {
      this.util.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Perfil ' + profile.NOMBRE + ' creada correctamente.');
      this.profileForm.reset();
    }, error => {
      this.util.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }

  clear() {
    this.profileForm.reset();
  }
}
