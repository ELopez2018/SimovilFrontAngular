import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeTransition } from '../../../routerAnimation';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntStation } from '../../../Class/EntStation';
import { EntCityStation } from '../../../Class/EntCityStation';
import { forkJoin } from 'rxjs';
import { EntCompany } from '../../../Class/EntCompany';
import { EntStationType } from '../../../Class/EntStationType';
import { EntBank } from '../../../Class/EntBank';
import { UtilService } from '../../../services/util.service';
import { cleanString } from '../../../util/util-lib';
import { NominaService } from '../../../services/nomina.service';
import { EntPlant } from '../../../Class/EntPlant';

@Component({
  selector: 'app-bs-add',
  templateUrl: './bs-add.component.html',
  styleUrls: ['./bs-add.component.css'],
  animations: [fadeTransition()]
})
export class BsAddComponent implements OnInit {
  cities: EntCityStation[];
  companies: EntCompany[];
  stationType: EntStationType[];
  banks: EntBank[];
  plants: EntPlant[];
  AddForm: FormGroup;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private title: Title,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService
  ) {
    this.title.setTitle('Agregar estación - Simovil')
  }

  ngOnInit() {
    this.basicdata();
    this.buildForm();
  }

  basicdata() {
    this.utilService.loader(true);
    forkJoin(
      this.carteraService.getCityStation(),
      this.carteraService.getCompany(),
      this.carteraService.getStationType(),
      this.carteraService.getBank(),
      this.carteraService.getPlant()
    ).subscribe(([res1, res2, res3, res4, res5]) => {
      this.utilService.loader(false);
      this.cities = res1;
      this.companies = res2;
      this.stationType = res3;
      this.banks = res4;
      this.plants = res5;
    }, error => {
      this.utilService.loader(false);
      console.log(error);
      this.principalComponent.showMsg('error', 'Error', error.error.message);
    });
  }

  buildForm() {
    this.AddForm = this.fb.group({
      nombreEstacion: ['', [Validators.required, Validators.maxLength(20)]],
      ciudadEstacion: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(60)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      listoSimovil: [false, [Validators.required]],
      administrador: ['', [Validators.required, Validators.maxLength(100)]],
      usuario: ['', [Validators.required, Validators.maxLength(15)]],
      cuentaBancaria: ['', [Validators.required, Validators.maxLength(20)]],
      banco: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      tipoEstacion: ['', [Validators.required]],
      sisLiq: [false, [Validators.required]],
      sisGas: [false, [Validators.required]],
      turno: ['', [Validators.required, Validators.min(3), Validators.max(5)]],
      manual: [false, [Validators.required]],
      num_caja: ['', [Validators.required]],
      planta: ['', [Validators.required]],
      nom_cont: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  reset() {
    this.AddForm.reset();
  }

  validarUser(value: string) {
    if (value.length == 0)
      return;
    this.carteraService.GetUser(value, null, null, true)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          return;
        }
        this.principalComponent.showMsg('warn', 'Advertencia', 'Usuario ya registrado');
      }, error => console.log("Sin registro"));
  }

  submitAddForm() {
    this.sending = true;
    let val = new EntStation();
    let form = this.AddForm.getRawValue();
    // verificar valores.
    val.nombreEstacion = cleanString(form.nombreEstacion);
    val.ciudadEstacion = (form.ciudadEstacion as EntCityStation).idCiudadEstacion;
    val.direccion = cleanString(form.direccion);
    val.telefono = cleanString(form.telefono);
    val.listoSimovil = form.listoSimovil;
    val.administrador = cleanString(form.administrador);
    val.usuario = cleanString(form.usuario);
    val.cuentaBancaria = cleanString(form.cuentaBancaria);
    val.banco = (form.banco as EntBank).idBanco;
    val.empresa = (form.empresa as EntCompany).nit;
    val.tipoEstacion = (form.tipoEstacion as EntStationType).idTipoEstacion;
    val.sisLiq = form.sisLiq;
    val.sisGas = form.sisGas;
    val.turno = form.turno;
    val.manual = form.manual;
    val.num_caja = form.num_caja;
    val.planta = (form.planta as EntPlant).ID;
    val.nom_cont = cleanString(form.nom_cont);
    console.log(val);
    this.nominaService.InsertStation(val).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Estación creada correctamente.');
      this.AddForm.reset();
    }, error => {
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }
}
