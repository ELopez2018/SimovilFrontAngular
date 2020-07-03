import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fadeTransition } from '../../../routerAnimation';
import { FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntAdministrator } from '../../../Class/EntAdministrator';
import { EntDisability } from '../../../Class/EntDisability';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-employee-disability',
  templateUrl: './employee-disability.component.html',
  styleUrls: ['./employee-disability.component.css'],
  animations: [fadeTransition()]
})
export class EmployeeDisabilityComponent implements OnInit {

  noveltyForm: FormGroup;
  motivos: IMotivos[];
  @Input() administradoras: EntAdministrator[];
  @Output() submitDisability = new EventEmitter<EntDisability>();

  constructor(
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder,
    private utilService: UtilService
  ) {
    this.buildForm();
    this.motivos = [
      { id: 1, detalle: 'Enfermedad general' },
      { id: 2, detalle: 'Accidente de trabajo' },
      { id: 3, detalle: 'Licencia de maternidad' }
    ];
  }

  ngOnInit() {
  }

  buildForm() {
    this.noveltyForm = this.fb.group({
      motivo: ['', Validators.required],
      administradora: ['', Validators.required],
      fechaIni: ['', Validators.required],
      fechaFin: ['', Validators.required],
      dias: ['', Validators.required],
      diasCobrar: ['', Validators.required],
      valor: ['', Validators.required],
      detalle: ['', Validators.required]
    });
    this.noveltyForm.get('dias').disable();
    this.noveltyForm.get('diasCobrar').disable();
    this.noveltyForm.get('valor').disable();
  }

  validDate() {
    let fechaIni = new Date(this.noveltyForm.get('fechaIni').value).getTime();
    let fechaFin = new Date(this.noveltyForm.get('fechaFin').value).getTime();
    var diff = ((fechaFin - fechaIni) / (1000 * 60 * 60 * 24)) + 1;
    diff = diff < 0 ? 0 : diff;
    let valorDia;
    this.noveltyForm.get('dias').setValue(diff || 0);
    let administradora: EntAdministrator = this.noveltyForm.get('administradora').value;
    if (administradora && administradora.tipoAdministradora == 4) {
      this.noveltyForm.get('diasCobrar').setValue(diff || 0);
      valorDia = (877803 / 30) * (diff || 0);
    }
    if (administradora && administradora.tipoAdministradora == 1) {
      let diaAdmin = (diff || 0) - 2 < 0 ? 0 : diff - 2;
      this.noveltyForm.get('diasCobrar').setValue(diaAdmin);
      valorDia = (877803 / 30) * diaAdmin;
    }
    this.noveltyForm.get('valor').setValue(valorDia);
  }

  submit() {
    if (this.noveltyForm.get('dias').value <= 0) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'Los días deben ser mayores a 0');
      return;
    }
    if (this.noveltyForm.get('diasCobrar').value == 0) {
      this.utilService.confirm('Va a guardar una incapacidad sumida por la empresa, ¿Desea continuar?', result => {
        if (result)
          this.saveDisability();
      });
    } else
      this.saveDisability()
  }

  saveDisability() {
    let disability = new EntDisability();
    disability.motivo = this.motivos.find(e => e.id === this.noveltyForm.get('motivo').value.id).id;
    disability.fechaIni = this.noveltyForm.get('fechaIni').value;
    disability.fechaFin = this.noveltyForm.get('fechaFin').value;
    disability.dias = this.noveltyForm.get('dias').value;
    disability.diasReal = this.noveltyForm.get('diasCobrar').value;
    disability.administradora = this.administradoras.find(e => e.idAdministradora == this.noveltyForm.get('administradora').value.idAdministradora).idAdministradora;
    disability.valor = this.noveltyForm.get('valor').value;
    disability.detalle = this.noveltyForm.get('detalle').value;
    this.submitDisability.emit(disability);
  }

  reset() {
    this.noveltyForm.reset();
  }
}

interface IMotivos {
  id: number;
  detalle: string;
}
