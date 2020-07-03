import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { CarteraService } from '../../../services/cartera.service';
import { EntProvider } from '../../../Class/EntProvider';
import { EntCity } from '../../../Class/EntCity';
import { EntDepartament } from '../../../Class/EntDepartament';
import { EntDocumentType } from '../../../Class/EntDocumentType';
import { fadeTransition } from '../../../routerAnimation';
import { StorageService } from '../../../services/storage.service';
import { PROVIDERTYPE, PROVIDERTYPE2 } from '../../../Class/PROVIDERTYPE';
import { cleanString } from '../../../util/util-lib';

@Component({
  selector: 'app-provider-add',
  templateUrl: './provider-add.component.html',
  styleUrls: ['./provider-add.component.css'],
  animations: [fadeTransition()]
})
export class ProviderAddComponent implements OnInit {

  providerForm: FormGroup;
  cities: EntCity[];
  filteredCities: EntCity[];
  departments: EntDepartament[];
  documentTypes: EntDocumentType[];
  user;
  providerTypes = PROVIDERTYPE;
  providerTypes2 = PROVIDERTYPE2;

  constructor(
    private carteraService: CarteraService,
    private fb: FormBuilder,
    private title: Title,
    private principalComponent: PrincipalComponent,
    private utilService: UtilService,
    private storageService: StorageService
  ) {
    this.title.setTitle('Proveedor - Simovil');
    this.buildForm();
    this.user = this.storageService.getCurrentUserDecode().Usuario;
  }

  ngOnInit() {
    this.getDepartament();
    this.getCity();
    this.getDocumentType();
  }

  getDepartament() {
    this.carteraService.getDepartament(1).subscribe(result => {
      this.departments = result;
    }, error => {
      console.log(error);
    });
  }

  updateArrayCity(departament: EntDepartament) {
    if (departament != null) {
      this.filteredCities = null;
      this.filteredCities = this.cities.filter(function (city) {
        return city.idDepartamento === departament.idDepartamento;
      });
    }
  }

  getCity() {
    this.filteredCities = null;
    this.carteraService.getCity().subscribe(cities => {
      this.cities = cities;
    }, error => {
      console.log(error);
    });
  }

  getDocumentType() {
    this.carteraService.getDocumentType().subscribe(documentTypes => {
      this.documentTypes = documentTypes;
    }, error => {
      console.log(error);
    });
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
      email: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      tipoMayorista: ['', [Validators.required]]
    });
    this.providerForm.get('tipo').valueChanges.subscribe(e => {
      e && e.id == 1 ? this.providerForm.get('tipoMayorista').enable() : this.providerForm.get('tipoMayorista').disable();
    });
  }

  submit() {
    let provider = new EntProvider();
    if (!this.validarEmail()) {
      this.principalComponent.showMsg('error', 'Error', 'El campo email no es valido.')
    }
    let rawV = this.providerForm.getRawValue() as EntProvider;
    provider.nit = Number(rawV.nit);
    provider.dv = Number(rawV.dv);
    provider.nombre = cleanString(rawV.nombre).toUpperCase();
    provider.tipoDoc = rawV.tipoDoc == null ? null : rawV.tipoDoc['codTipoDocumento'];
    provider.ciudad = rawV.ciudad == null ? null : rawV.ciudad['idCiudad'];
    provider.direccion = cleanString(rawV.direccion).toUpperCase();
    provider.telefono = cleanString(rawV.telefono).toUpperCase();
    provider.email = rawV.email;
    provider.tipo = rawV.tipo == null ? null : rawV.tipo['id'];
    provider.tipoMayorista = rawV.tipoMayorista == null ? null : rawV.tipoMayorista['id'];
    provider.estado = true;
    provider.usuario = this.user;
    this.InsertProvider(provider);
  }

  InsertProvider(provider: EntProvider): void {
    this.utilService.loader(true);
    this.carteraService.InsertProvider(provider)
      .subscribe(data => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('success', 'Éxito', 'Proveedor ingresado correctamente.')
        this.reset();
      }, error => {
        this.utilService.loader(false);
        this.principalComponent.showMsg('warn', 'Error', error.error.message);
        console.log(error);
      });
  }


  validarNit(value: string) {
    if (value == null || value == '')
      return;
    this.carteraService.getProvider(value, null, true)
      .subscribe(data => {
        if (typeof (data[0]) === "undefined") {
          return;
        }
        this.principalComponent.showMsg('info', 'Información', 'Proveedor ya registrado');
      }, error => console.log(error));
  }

  assignCity() {
    this.providerForm.get('ciudad').setValue(this.filteredCities[0]);
  }

  reset() {
    this.providerForm.reset();
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
    } else {
      valid = patt.test(email.trim().toLowerCase());
    }
    return valid;
  }
}
