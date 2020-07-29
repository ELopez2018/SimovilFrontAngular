import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { EntRole } from '../../../Class/EntRole';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {
  @Input() role: EntRole;
  @Output() submiter = new EventEmitter<{ obj: EntRole, result: boolean }>();
  roleForm: FormGroup;
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
    if (this.role)
      this.assign(this.role);
  }

  ngOnInit() {
    this.buildForm();

  }

  assign(option: EntRole) {
    this.roleForm.setValue({
      id: option.ID,
      descripcion: option.DESCRIPCION,
      estado: option.ESTADO
    });
  }

  buildForm() {
    this.roleForm = this.fb.group({
      id: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  submitAddForm() {
    this.sending = true;
    let val = new EntRole();
    val.ID = Number(this.roleForm.get('id').value);
    val.DESCRIPCION = String(this.roleForm.get('descripcion').value).trim();
    val.ESTADO = Boolean(this.roleForm.get('estado').value);
    val.USUARIO = this.user;
    this.util.loader(true);
    this.carteraService.UpdateRole(val).subscribe(result => {
      this.util.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Rol actualizado correctamente.');
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
