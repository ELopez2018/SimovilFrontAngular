import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { EntCityStation } from '../../../Class/EntCityStation';
import { EntCompany } from '../../../Class/EntCompany';
import { EntStationType } from '../../../Class/EntStationType';
import { EntBank } from '../../../Class/EntBank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { forkJoin } from 'rxjs';
import { EntStation } from '../../../Class/EntStation';
import { cleanString } from '../../../util/util-lib';
import { NominaService } from '../../../services/nomina.service';
import { EntPlant } from '../../../Class/EntPlant';

@Component({
  selector: 'app-bs-edit',
  templateUrl: './bs-edit.component.html',
  styleUrls: ['./bs-edit.component.css']
})
export class BsEditComponent implements OnInit {
  @Input() station: EntStation;
  @Output() submiter = new EventEmitter<{ obj: EntStation, result: boolean }>();
  cities: EntCityStation[];
  companies: EntCompany[];
  stationType: EntStationType[];
  banks: EntBank[];
  plants: EntPlant[];
  EditForm: FormGroup;
  sending = false;

  constructor(
    private carteraService: CarteraService,
    private nominaService: NominaService,
    private fb: FormBuilder,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.basicdata();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.station)
      this.assignStation();
  }

  assignStation() {
    this.EditForm.setValue({
      nombreEstacion: this.station.nombreEstacion,
      ciudadEstacion: this.cities.find(e => e.idCiudadEstacion == this.station.ciudadEstacion),
      direccion: this.station.direccion,
      telefono: this.station.telefono,
      listoSimovil: this.station.listoSimovil,
      administrador: this.station.administrador,
      usuario: this.station.usuario,
      cuentaBancaria: this.station.cuentaBancaria,
      banco: this.banks.find(e => e.idBanco == this.station.banco),
      empresa: this.companies.find(e => e.nit == this.station.empresa),
      tipoEstacion: this.stationType.find(e => e.idTipoEstacion == this.station.tipoEstacion),
      sisLiq: this.station.sisLiq,
      sisGas: this.station.sisGas,
      turno: this.station.turno,
      manual: this.station.manual,
      nom_cont: this.station.nom_cont,
      numCaja: this.station.num_caja,
      planta: this.plants.find(e => e.ID == this.station.planta)
    });
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
    this.EditForm = this.fb.group({
      nombreEstacion: ['', [Validators.required, Validators.maxLength(20)]],
      ciudadEstacion: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(60)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      listoSimovil: ['', [Validators.required]],
      administrador: ['', [Validators.required, Validators.maxLength(100)]],
      usuario: ['', [Validators.required, Validators.maxLength(15)]],
      cuentaBancaria: ['', [Validators.required, Validators.maxLength(20)]],
      banco: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      tipoEstacion: ['', [Validators.required]],
      sisLiq: ['', [Validators.required]],
      sisGas: ['', [Validators.required]],
      turno: ['', [Validators.required, Validators.min(3), Validators.max(5)]],
      manual: ['', [Validators.required]],
      numCaja: ['', Validators.required],
      planta: ['', Validators.required],
      nom_cont: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  cancel() {
    this.submiter.emit({ obj: null, result: false });
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

  submitEditForm() {
    this.utilService.loader(true);
    let val = new EntStation();
    let form = this.EditForm.getRawValue();
    // verificar valores.
    val.idEstacion = this.station.idEstacion;
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
    val.num_caja = form.numCaja;
    val.planta = (form.planta as EntPlant).ID;
    val.nom_cont = cleanString(form.nom_cont);
    this.sending = true;
    this.nominaService.UpdateStation(val).subscribe(result => {
      this.principalComponent.showMsg('success', 'Éxito', 'Estación actualizada correctamente.');
      this.nominaService.GetStations(this.station.idEstacion).subscribe(res => {
        if (res && res.length == 1)
          this.submiter.emit({ obj: res[0], result: true });
        else
          this.cancel();
        this.utilService.loader(false);
      }, error => {
        this.utilService.loader(false);
        console.log(error);
        this.principalComponent.showMsg('error', 'Error', error.error.message);
      });
      this.EditForm.reset();
    }, error => {
      this.utilService.loader(false);
      this.principalComponent.showMsg('error', 'Error', error.error.message)
      console.log(error);
    }, () => this.sending = false);
  }
}
