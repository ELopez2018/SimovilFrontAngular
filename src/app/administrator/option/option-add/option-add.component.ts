import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntOption } from '../../../Class/EntOption';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-option-add',
  templateUrl: './option-add.component.html',
  styleUrls: ['./option-add.component.css']
})
export class OptionAddComponent implements OnInit {
  optionForm: FormGroup;
  options: EntOption[] = [];
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private title: Title,
    private fb: FormBuilder,
    private util: UtilService,
    private principalComponent: PrincipalComponent
  ) {
    this.title.setTitle('Agregar opción - Simovil')
  }

  ngOnInit() {
    this.buildForm();
    this.getOptions();
  }

  getOptions() {
    this.util.loader(true);
    this.carteraService.GetOptions().subscribe(result => {
      this.util.loader(false);
      this.options = result;
    }, error => {
      this.util.loader(false);
      console.log(error);
    });
  }

  buildForm() {
    this.optionForm = this.fb.group({
      descripcion: ['', Validators.required],
      padre: [''],
      url: [''],
      icono: [''],
      estado: [true, Validators.required],
      visible: [true, Validators.required],
      orden: ['', [Validators.required, Validators.min(0), Validators.max(1000)]]
    });
  }

  submitOptionAddForm() {
    this.sending = true;
    let option = new EntOption();
    option.DESCRIPCION = String(this.optionForm.get('descripcion').value).trim();
    option.OPCION_PADRE = this.optionForm.get('padre').value ? this.optionForm.get('padre').value.ID : null;
    option.URL = this.optionForm.get('url').value != null ? String(this.optionForm.get('url').value).trim() : '';
    option.ICONO = this.optionForm.get('icono').value != null ? String(this.optionForm.get('icono').value).trim() : '';
    option.ESTADO = Boolean(this.optionForm.get('estado').value);
    option.VISIBLE = Boolean(this.optionForm.get('visible').value);
    option.ORDEN_MENU = +this.optionForm.get('orden').value;
    this.carteraService.InsertOption(option).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Opcion creada correctamente.');
      this.optionForm.reset();
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }

  clear() {
    this.optionForm.reset();
  }
}
