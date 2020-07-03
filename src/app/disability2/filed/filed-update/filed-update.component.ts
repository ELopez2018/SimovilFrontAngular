import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EntFiled } from '../../../Class/EntFiled';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-filed-update',
  templateUrl: './filed-update.component.html',
  styleUrls: ['./filed-update.component.css']
})
export class FiledUpdateComponent implements OnInit {

  @Input() administrator: EntAdministrator[];
  @Input() filed: EntFiled;
  @Output() submiter = new EventEmitter<{ filed: EntFiled, result: boolean }>();
  updateFiledForm: FormGroup;
  metodos;
  user;

  ngOnChanges(change: SimpleChanges) {
    this.AssignFiled();
  }

  constructor(
    // private carteraService: CarteraService,
    private nominaService: NominaService,
    private principal: PrincipalComponent,
    private utilService: UtilService,
    private fb: FormBuilder,
    private storageService: StorageService
    // private printService: PrintService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.metodos = [
      { id: 0, name: 'Mensajero' }, 
      { id: 1, name: 'Empresa mensajería' }, 
      { id: 2, name: 'E-mail' }, 
      { id: 3, name: 'Página web' },
      { id: 4, name: 'Asesor' }
    ];
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  buildForm() {
    this.updateFiledForm = this.fb.group({
      numero: ['', Validators.required],
      administradora: ['', Validators.required],
      fecha: ['', Validators.required],
      metodo: ['', Validators.required],
      detalle: ['', Validators.required]
    });
    this.updateFiledForm.get('numero').disable();
    this.updateFiledForm.get('administradora').disable();
  }

  getNameAdminsitrator(id: number) {
    if (this.administrator == null || id == null)
      return;
    return this.administrator.find(
      e => e.idAdministradora == id
    ).nombreAdministradora;
  }

  radicar() {
    this.filed.detalle = String(this.updateFiledForm.get('detalle').value).trim();
    this.filed.fecha = this.updateFiledForm.get('fecha').value;
    this.filed.tipoEnvio = this.updateFiledForm.get('metodo').value.id;
    this.filed.estado = 1;  // cambia a radicado.
    this.filed['incapacidad'] = true;
    this.filed['usuario'] = this.user;
    this.utilService.loader(true);
    this.nominaService.UpdateFiled(this.filed).subscribe(result => {
      this.utilService.loader(false);
      this.principal.showMsg('success', 'Éxito', 'El radicado #' + this.filed.idRadicado + ' actualizado correctamente')
      this.submiter.emit({ filed: this.filed, result: true });
    }, error => {
      this.utilService.loader(false);
      this.principal.showMsg('error', 'Error', error.error.message);
      console.log(error);
    });
  }

  AssignFiled() {
    this.updateFiledForm.reset();
    if (this.administrator && this.filed) {
      let adm = this.administrator.find(e => e.idAdministradora == this.filed.administradora).nombreAdministradora;
      this.updateFiledForm.get('numero').setValue(this.filed.idRadicado);
      this.updateFiledForm.get('administradora').setValue(adm);
    }
  }

  cancel() {
    this.submiter.emit(({ result: false, filed: null }));
  }

}
