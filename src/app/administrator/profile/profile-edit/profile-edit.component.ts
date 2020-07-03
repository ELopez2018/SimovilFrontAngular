import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { EntProfile } from '../../../Class/EntProfile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @Input() profile: EntProfile;
  @Output() submiter = new EventEmitter<{ obj: EntProfile, result: boolean }>();
  profileForm: FormGroup;
  user;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private fb: FormBuilder,
    private util: UtilService,
    private principalComponent: PrincipalComponent,
    private storageService: StorageService
  ) {
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnChanges(changes: OnChanges) {
    if (this.profile)
      this.assign(this.profile);
  }

  ngOnInit() {
    this.buildForm();
  }

  assign(option: EntProfile) {
    this.profileForm.setValue({
      id: option.ID,
      nombre: option.NOMBRE,
      descripcion: option.DESCRIPCION
    });
  }

  buildForm() {
    this.profileForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  submitAddForm() {
    this.sending = true;
    let val = new EntProfile();
    val.ID = Number(this.profileForm.get('id').value);
    val.NOMBRE = String(this.profileForm.get('nombre').value).trim();
    val.DESCRIPCION = String(this.profileForm.get('descripcion').value).trim();
    val.USUARIO = this.user;
    this.util.loader(true);
    this.carteraService.UpdateProfile(val).subscribe(result => {
      this.util.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Perfil actualizado correctamente.');
      this.submiter.emit({ obj: val, result: true });
    }, error => {
      this.util.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }

  cancel() {
    this.submiter.emit({ obj: null, result: false });
  }
}
