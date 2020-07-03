import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EntCity } from '../../../Class/EntCity';
import { EntDepartament } from '../../../Class/EntDepartament';
import { EntDocumentType } from '../../../Class/EntDocumentType';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { EntProvider } from '../../../Class/EntProvider';
import { fadeTransition } from '../../../routerAnimation';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { PROVIDERTYPE, PROVIDERTYPE2 } from '../../../Class/PROVIDERTYPE';
import { focusById } from '../../../util/util-lib';

@Component({
  selector: 'app-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.css'],
  animations: [fadeTransition()]
})
export class ProviderEditComponent implements OnInit {

  providerForm: FormGroup;
  cities: EntCity[];
  filteredCities: EntCity[];
  departments: EntDepartament[];
  documentTypes: EntDocumentType[];
  searchId;
  providerlo: EntProvider = null;
  user;
  providerTypes = PROVIDERTYPE;
  providerTypes2 = PROVIDERTYPE2;
  boolProvider = false;

  constructor(
    private carteraService: CarteraService,
    private fb: FormBuilder,
    private title: Title,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private location: Location,
    private storageService: StorageService
  ) {
    this.title.setTitle('Editar Proveedor - Simovil');
    this.buildForm();
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.getDataBasic();
  }

  getDataBasic() {
    this.filteredCities = null;
    forkJoin(
      this.carteraService.getDepartament(1),
      this.carteraService.getCity(),
      this.carteraService.getDocumentType()).subscribe(([res1, res2, res3]) => {
        this.departments = res1;
        this.cities = res2;
        this.documentTypes = res3;
        this.GetParam();
      }, error => {
        console.log(error);
      });
  }

  GetParam() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.searchId = id;
      this.providerForm.get('nit').setValue(id);
      this.GetProvider(id);
    }
  }

  updateArrayCity(departament: EntDepartament) {
    if (departament != null) {
      this.filteredCities = null;
      this.filteredCities = this.cities.filter(function (city) {
        return city.idDepartamento === departament.idDepartamento;
      });
    }
  }

  buildForm() {
    this.providerForm = this.fb.group({
      nit: ['', Validators.required],
      dv: ['', [Validators.required, Validators.maxLength(1)]],
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      estado: ['', Validators.required],
      tipo: ['', Validators.required],
      tipoMayorista: ['', Validators.required]
    });
    this.validForm(false);
    this.providerForm.get('tipo').valueChanges.subscribe(e => {
      e && e.id == 1 ? this.providerForm.get('tipoMayorista').enable() : this.providerForm.get('tipoMayorista').disable();
    });
  }

  submit() {
    if (!this.validarEmail()) {
      this.principalComponent.showMsg('error', 'Error', 'El campo email no es valido.')
    }
    let provider = new EntProvider();
    provider.nit = Number(this.providerForm.get('nit').value);
    provider.dv = Number(this.providerForm.get('dv').value);
    provider.nombre = String(this.providerForm.get('nombre').value).trim().toUpperCase();
    provider.tipoDoc = this.providerForm.get('tipoDoc').value == null ? null : this.providerForm.get('tipoDoc').value.codTipoDocumento;
    provider.ciudad = this.providerForm.get('ciudad').value == null ? null : this.providerForm.get('ciudad').value.idCiudad;
    provider.direccion = String(this.providerForm.get('direccion').value).trim().toUpperCase();
    provider.telefono = String(this.providerForm.get('telefono').value).trim().toUpperCase();
    provider.email = String(this.providerForm.get('email').value).trim();
    provider.estado = Boolean(this.providerForm.get('estado').value);
    provider.tipo = this.providerForm.get('tipo').value == null ? null : this.providerForm.get('tipo').value.id;
    provider.tipoMayorista = this.providerForm.get('tipoMayorista').value == null ? null : this.providerForm.get('tipoMayorista').value.id;
    provider.usuario = this.user;
    this.UpdateProvider(provider);
  }

  UpdateProvider(provider: EntProvider): void {
    this.utilService.loader(true);
    this.carteraService.UpdateProvider(provider)
      .subscribe(data => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('success', 'Éxito', 'Proveedor editado correctamente.')
        if (this.searchId)
          this.back();
        else
          this.reset();
      }, error => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('warn', 'Error', error.error.message);
        console.log(error);
      });
  }


  GetProvider(value: string) {
    this.utilService.loader(true);
    this.carteraService.getProvider(value, null, true)
      .subscribe(data => {
        this.utilService.loader(false);
        if (data.length == 1)
          this.assignProvider(data[0]);
        else
          this.principalComponent.showMsg('info', 'Información', 'Proveedor no encontrado.');
      }, error => {
        console.log(error);
        this.principalComponent.showMsg('error', 'Error', error.error.message);
        this.utilService.loader(false);
      });
  }

  assignProvider(provider: EntProvider) {
    this.providerlo = provider;
    let city = this.cities.find(e => e.idCiudad == provider.ciudad);
    let department = this.departments.find(e => e.idDepartamento == city.idDepartamento);
    this.providerForm.get('nit').setValue(provider.nit);
    this.providerForm.get('dv').setValue(provider.dv);
    this.providerForm.get('nombre').setValue(provider.nombre);
    this.providerForm.get('tipoDoc').setValue(this.documentTypes.find(e => e.codTipoDocumento == provider.tipoDoc));
    this.providerForm.get('tipo').setValue(this.providerTypes.find(e => e.id == provider.tipo));
    this.providerForm.get('tipoMayorista').setValue(this.providerTypes2.find(e => e.id == provider.tipoMayorista));
    this.providerForm.get('departamento').setValue(department);
    this.providerForm.get('ciudad').setValue(city);
    this.providerForm.get('direccion').setValue(provider.direccion);
    this.providerForm.get('telefono').setValue(provider.telefono);
    this.providerForm.get('email').setValue(provider.email);
    this.providerForm.get('estado').setValue(provider.estado);
    this.validForm(true);
    if (this.boolProvider)
      this.showBoolProvider(false);
    focusById('proNom');
    if (provider.tipo == 0)
      this.providerForm.get('tipoMayorista').disable();
  }

  assignCity() {
    this.providerForm.get('ciudad').setValue(this.filteredCities[0]);
  }

  reset() {
    this.providerForm.reset();
    this.validForm(false);
    this.providerlo = null;
    focusById('proId');
  }

  back() {
    this.location.back();
  }

  validForm(value: boolean) {
    if (!value) {
      this.providerForm.disable();
      this.providerForm.get('nit').enable();
    } else {
      this.providerForm.enable();
      this.providerForm.get('nit').disable();
    }
  }

  validarEmail() {
    var patt = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    let email = String(this.providerForm.get('email').value);
    var valid = true;
    if (email.indexOf(',') >= 0) {
      let arrayEmail = email.split(",");
      arrayEmail.forEach(e => {
        e = e.trim().toLowerCase();
        if (!patt.test(e))
          valid = false;
      });
    } else
      valid = patt.test(email.trim().toLowerCase());
    return valid;
  }

  showBoolProvider(val: boolean) {
    if (val) {
      setTimeout(() => {
        focusById('searchPro');
      }, 10);
    }
    this.boolProvider = !this.boolProvider;
  }
}
