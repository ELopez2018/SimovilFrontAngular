import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntEmployeeNovelty } from '../../../Class/EntEmployeeNovelty';
import { fadeTransition } from '../../../routerAnimation';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css'],
  animations: [fadeTransition()]
})
export class VacationComponent implements OnInit {

  noveltyForm: FormGroup;
  @Output() submitVacation = new EventEmitter<any>();

  constructor(
    private principalComponent: PrincipalComponent,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm() {
    this.noveltyForm = this.fb.group({
      fechaIni: ['', Validators.required],
      fechaFin: ['', Validators.required],
      dias: ['', Validators.required],
      detalle: ['', Validators.required]
    });
    this.noveltyForm.get('dias').disable();
  }

  validDate() {
    let fechaIni = new Date(this.noveltyForm.get('fechaIni').value).getTime();
    let fechaFin = new Date(this.noveltyForm.get('fechaFin').value).getTime();
    var diff = ((fechaFin - fechaIni) / (1000 * 60 * 60 * 24)) + 1;
    diff = diff < 0 ? 0 : diff;
    this.noveltyForm.get('dias').setValue(diff || 0);
  }

  submit() {
    if (this.noveltyForm.get('dias').value <= 0) {
      this.principalComponent.showMsg('warn', 'Advertencia', 'Los días deben ser mayores a 0');
      return;
    }
    let novelty = new EntEmployeeNovelty();
    novelty.fechaIni = this.noveltyForm.get('fechaIni').value;
    novelty.fechaFin = this.noveltyForm.get('fechaFin').value;
    novelty.detalle = this.noveltyForm.get('detalle').value;
    novelty.dias = this.noveltyForm.get('dias').value;
    this.submitVacation.emit(novelty);
  }

  reset() {
    this.noveltyForm.reset();
  }
}
