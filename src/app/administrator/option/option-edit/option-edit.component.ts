import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntOption } from '../../../Class/EntOption';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { UtilService } from '../../../services/util.service';
import { PrincipalComponent } from '../../../principal/principal.component';

@Component({
  selector: 'app-option-edit',
  templateUrl: './option-edit.component.html',
  styleUrls: ['./option-edit.component.css']
})
export class OptionEditComponent implements OnInit {
  @Input() options: EntOption[];
  @Input() option: EntOption;
  @Output() submiter = new EventEmitter<{ option: EntOption, result: boolean }>();
  optionForm: FormGroup;
  optionsEdit: EntOption[];
  optionNull = new EntOption();
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private util: UtilService,
    private principalComponent: PrincipalComponent,
  ) {
    this.title.setTitle('Editar opción - Simovil')
    this.optionNull.ID = -1;
    this.optionNull.DESCRIPCION = '';
  }

  ngOnChanges(changes: OnChanges) {
    if (this.option) {
      this.assignOption(this.option);
      this.optionsEdit = Object.create(this.options);
      if (this.optionsEdit[0].ID != -1)
        this.optionsEdit.unshift(this.optionNull)
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  assignOption(option: EntOption) {
    this.optionForm.setValue({
      id: option.ID,
      descripcion: option.DESCRIPCION,
      padre: this.options.find(e => e.ID == option.OPCION_PADRE),
      url: option.URL,
      icono: option.ICONO,
      estado: option.ESTADO,
      visible: option.VISIBLE,
      orden: option.ORDEN_MENU
    });
  }

  buildForm() {
    this.optionForm = this.fb.group({
      id: ['', Validators.required],
      descripcion: ['', Validators.required],
      padre: [''],
      url: [''],
      icono: [''],
      estado: ['', Validators.required],
      visible: ['', Validators.required],
      orden: ['', [Validators.required, Validators.min(0), Validators.max(1000)]]
    });
    this.optionForm.get('id').disable();
  }

  submitOptionAddForm() {
    this.sending = true;
    let option = new EntOption();
    option.ID = Number(this.optionForm.get('id').value);
    option.DESCRIPCION = String(this.optionForm.get('descripcion').value).trim();
    option.OPCION_PADRE = this.optionForm.get('padre').value ? this.optionForm.get('padre').value.ID : null;
    option.OPCION_PADRE = option.OPCION_PADRE == -1 ? null : option.OPCION_PADRE;
    option.URL = this.optionForm.get('url').value != null ? String(this.optionForm.get('url').value).trim() : '';
    option.ICONO = this.optionForm.get('icono').value != null ? String(this.optionForm.get('icono').value).trim() : '';
    option.ESTADO = Boolean(this.optionForm.get('estado').value);
    option.VISIBLE = Boolean(this.optionForm.get('visible').value);
    option.ORDEN_MENU = +this.optionForm.get('orden').value;
    this.util.loader(true);
    this.carteraService.UpdateOption(option).subscribe(result => {
      this.util.loader(false);
      this.principalComponent.showMsg('success', 'Éxito', 'Opcion actualizada correctamente.');
      this.submiter.emit({ option: option, result: true });
    }, error => {
      this.util.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }

  cancel() {
    this.submiter.emit({ option: null, result: false });
  }
}
