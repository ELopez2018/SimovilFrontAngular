import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { EntEmployeeNovelty } from '../../../Class/EntEmployeeNovelty';
import { PrincipalComponent } from '../../../principal/principal.component';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-employee-permission',
  templateUrl: './employee-permission.component.html',
  styleUrls: ['./employee-permission.component.css'],
  animations: [fadeTransition()]
})
export class EmployeePermissionComponent implements OnInit {

  re = /([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
  tipoPermiso: ITipoPermiso[];
  noveltyForm: FormGroup;
  boolMayor;
  @Output() submitPermission = new EventEmitter<EntEmployeeNovelty>();

  constructor(
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder
  ) {
    this.buildForm();
    this.tipoPermiso = [
      { id: 1, detalle: 'Menor a un día' },
      { id: 2, detalle: 'Mayor a un día' }
    ]
  }

  ngOnInit() {
  }

  buildForm() {
    this.noveltyForm = this.fb.group({
      tipo: ['', Validators.required],
      fechaIni: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaIni: ['', Validators.required],
      horaFin: ['', Validators.required],
      dias: ['', Validators.required],
      horas: ['', Validators.required],
      detalle: ['', Validators.required]
    });
    this.noveltyForm.get('dias').disable();
    this.noveltyForm.get('horas').disable();
  }

  changeType(value: ITipoPermiso) {
    if (!value) {
      return;
    }
    this.validForm(value.id);
  }

  validForm(id: number) {
    if (id == 1) {
      this.boolMayor = false;
      this.noveltyForm.get('horaIni').enable();
      this.noveltyForm.get('horaFin').enable();
    } else {
      this.boolMayor = true;
      this.noveltyForm.get('horaIni').disable();
      this.noveltyForm.get('horaFin').disable();
    }
  }
  validDate() {
    let fechaIni = new Date(this.noveltyForm.get('fechaIni').value);
    let fechaFin = new Date(this.noveltyForm.get('fechaFin').value);
    let horaIni = String(this.noveltyForm.get('horaIni').value);
    let horaFin = String(this.noveltyForm.get('horaFin').value);
    if (this.re.test(horaIni) && this.re.test(horaFin)) {
      let horaIniSplit = horaIni.split(':');
      let horaFinSplit = horaFin.split(':');
      fechaIni.setHours(+horaIniSplit[0], +horaIniSplit[1]);
      fechaFin.setHours(+horaFinSplit[0], +horaFinSplit[1]);
    }
    let fechaInih = fechaIni.getTime();
    let fechaFinh = fechaFin.getTime();
    var diff = ((fechaFinh - fechaInih) / (1000 * 60 * 60));
    diff = diff < 0 ? 0 : diff;
    this.noveltyForm.get('dias').setValue(Math.floor(diff / 24) || 0);
    this.noveltyForm.get('horas').setValue(diff || 0);
  }

  submit() {
    if (this.noveltyForm.get('dias').value > 0 && !this.boolMayor) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'Los días no deben ser mayores a 0');
      return;
    }
    if (this.noveltyForm.get('dias').value <= 0 && this.boolMayor) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'Los días deben ser mayores a 0');
      return;
    }
    if (this.noveltyForm.get('horas').value <= 0) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'Fechas erradas');
      return;
    }
    let permission = new EntEmployeeNovelty();
    permission.fechaIni = this.noveltyForm.get('fechaIni').value;
    permission.fechaFin = this.noveltyForm.get('fechaFin').value;
    permission.detalle = this.noveltyForm.get('detalle').value;
    if (this.boolMayor == false) {
      permission.horaIni = this.noveltyForm.get('horaIni').value;
      permission.horaFin = this.noveltyForm.get('horaFin').value;
      permission.horas = this.noveltyForm.get('horas').value;
    }
    permission.dias = this.noveltyForm.get('dias').value;
    this.submitPermission.emit(permission);
  }

  reset() {
    this.noveltyForm.reset();
  }
}

interface ITipoPermiso {
  id: number;
  detalle: string;
}
