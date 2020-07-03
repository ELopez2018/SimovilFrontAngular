import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { EntClient } from '../../../Class/EntClient';
import { CarteraService } from '../../../services/cartera.service';
import { EntDocumentType } from '../../../Class/EntDocumentType';
import { EntDepartament } from '../../../Class/EntDepartament';
import { EntCity } from '../../../Class/EntCity';
import { EntQuotaType } from '../../../Class/EntQuotaType';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Router } from '@angular/router';
import { EntVehicle } from '../../../Class/EntVehicle';
import { Title } from '@angular/platform-browser';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { fadeTransition } from '../../../routerAnimation';
import { Md5 } from 'ts-md5';
import { cleanString, focusById } from '../../../util/util-lib';
import { SelectItem } from 'primeng/api';
import { TaxesModel } from '../../../Class/Taxes.model';

@Component({
    selector: 'app-client-add',
    templateUrl: './client-add.component.html',
    styleUrls: ['./client-add.component.css'],
    animations: [fadeTransition()]
})



export class ClientAddComponent implements OnInit {

    clientForm: FormGroup;
    display = 'show';
    displayDialog = false;
    displayDialogAudit = false;
    client: EntClient;
    documentTypes: EntDocumentType[];
    departaments: EntDepartament[];
    cities: EntCity[];
    quotaTypes: EntQuotaType[];
    filteredCities: EntCity[];
    codClientTemp = [];
    vehicles: EntVehicle[];
    modoCuentaCobro: any[];
    controlShow = false;
    stations: EntStation[];
    stationsAll: EntStation[];
    selectedValues: string[] = ['val1', 'val2'];
    cities1: SelectItem[];
    retenciones: any[] = [];
    retencionesSel: any[] = [];
    constructor(
        private fb: FormBuilder,
        private carteraService: CarteraService,
        private nominaService: NominaService,
        private principalComponent: PrincipalComponent,
        private router: Router,
        private title: Title
    ) {
        this.buildForm();
        this.title.setTitle('Agregar Cliente - Simovil');
    }

    ngOnInit() {
        this.getTaxes();
        this.getDocumentType();
        this.getDepartament();
        this.getCity();
        this.getQuotaType();
        this.getStation();
        this.modoCuentaCobro = [{ id: 0, text: 'Quincenal (1-15),(16-31)' }, { id: 1, text: 'Por periodo de días' }];
    }
    ver(valores) {
        console.log('ciudades', valores);
    }
    getTaxes() {
        this.carteraService.getTaxes().subscribe(resp => {
            resp.forEach(item => {
                this.retenciones.push({
                    label: item.nombre,
                    value: { id: item.id, name: item.nombre,  descripcion: item.descripcion,  valor: (item.valor * 100) + '%' }
                })
            });
        });
    }
    buildForm() {
        this.clientForm = this.fb.group({
            identificacion: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            nombreAlt: null,
            nitAlt: null,
            tipoDocumento: ['', Validators.required],
            departamento: ['', Validators.required],
            ciudad: ['', Validators.required],
            direccion: ['', Validators.compose([Validators.required])],
            telefono: ['', Validators.compose([Validators.required])],
            correo: ['', [Validators.required, Validators.email]],
            estacion: ['', Validators.required],
            modoCuentaCobro: ['', Validators.required],
            PeriodoEnDias: ['', Validators.required],
            retenedor: [''],
            notificar: [false],
            sistema: [false],
            todasEstaciones: [false],
            retenciones: []
        });
        this.clientForm.get('PeriodoEnDias').disable();
    }

    submit() {
        this.client = new EntClient();
        this.client.codCliente = Number(this.clientForm.get('identificacion').value);
        this.client.nombre = cleanString(this.clientForm.get('nombre').value).toUpperCase();
        this.client.nombreAlt = cleanString(this.clientForm.get('nombreAlt').value).toUpperCase();
        this.client.nitAlt = cleanString(this.clientForm.get('nitAlt').value);
        this.client.tipoDoc = this.clientForm.get('tipoDocumento').value == null ? null : this.clientForm.get('tipoDocumento').value.codTipoDocumento;
        this.client.ciudad = this.clientForm.get('ciudad').value == null ? null : this.clientForm.get('ciudad').value.idCiudad;
        this.client.direccion = cleanString(this.clientForm.get('direccion').value).toUpperCase();
        this.client.telefono = cleanString(this.clientForm.get('telefono').value).toUpperCase();
        this.client.email = cleanString(this.clientForm.get('correo').value);
        this.client.estado = true;
        this.client.estacion = this.clientForm.get('estacion').value.idEstacion;
        this.client.tipoPeriodoCobro = Boolean(this.clientForm.get('modoCuentaCobro').value.id);
        this.client.retenedor = Boolean(this.clientForm.get('retenedor').value);
        this.client.periodoDiaCobro = Number(this.clientForm.get('PeriodoEnDias').value);
        this.client['notificar'] = Boolean(this.clientForm.get('notificar').value);
        this.client.sistema = Boolean(this.clientForm.get('sistema').value);
        this.client.todasEstaciones = Boolean(this.clientForm.get('todasEstaciones').value);
        this.client.retenciones = this.retencionesSel;
        this.InsertClient(this.client);
    }

    getDocumentType() {
        this.carteraService.getDocumentType().subscribe(documentTypes => {
            this.documentTypes = documentTypes;
        }, error => {
            console.log(error);
        });
    }

    getStation() {
        this.nominaService.GetStations().subscribe(stations => {
            this.stationsAll = stations;
            this.stations = stations.filter(e => e.listoSimovil == true);
        }, error => {
            console.log(error);
        });
    }

    getQuotaType() {
        this.carteraService.getQuotaType().subscribe(quotaTypes => {
            this.quotaTypes = quotaTypes;
        }, error => {
            console.log(error);
        });
    }

    getDepartament() {
        this.carteraService.getDepartament(1).subscribe(departaments => {
            this.departaments = departaments;
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

    InsertClient(cliente: EntClient): void {
        cliente['pass'] = btoa(Md5.hashAsciiStr(String(cliente.codCliente)).toString());
        this.carteraService.InsertClient(cliente).subscribe(data => {
            this.clientForm.reset();
            this.principalComponent.showMsg('success', 'Éxito', 'Cliente ' + cliente.codCliente + ' registrado correctamente');
            focusById('identify');
        }, error => {
            console.log(error);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    validarCedula(value: string) {
        if (value.length == 0) {
            return;
        }
        if (value == this.codClientTemp[0]) {
            return;
        }
        this.codClientTemp[0] = value;
        this.carteraService.GetClient(value)
            .subscribe(data => {
                if (typeof (data[0]) === 'undefined') {
                    return;
                }
                this.client = data[0];
                this.principalComponent.showMsg('info', 'Información', 'Cliente ya registrado');
            }, error => console.log('Sin registro'));
    }

    reset() {
        this.clientForm.reset();
    }

    onChange(value) {
        if (value == null) {
            return;
        }
        if (value.id == 1) {
            this.controlShow = true;
            this.clientForm.get('PeriodoEnDias').enable();
        } else {
            this.controlShow = false;
            this.clientForm.get('PeriodoEnDias').disable();
        }
    }

    assignCity() {
        this.clientForm.get('ciudad').setValue(this.filteredCities[0]);
    }
}
