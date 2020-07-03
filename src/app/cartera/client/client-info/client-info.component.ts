import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';


import { CarteraService } from '../../../services/cartera.service';
import { StorageService } from '../../../services/storage.service';
import { UtilService } from '../../../services/util.service';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { EntStation } from '../../../Class/EntStation';
import { EntDepartament } from '../../../Class/EntDepartament';
import { EntClient } from '../../../Class/EntClient';
import { EntCity } from '../../../Class/EntCity';
import { EntArticleType } from '../../../Class/EntArticleType';
import { EntQuotaType } from '../../../Class/EntQuotaType';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-client-info',
    templateUrl: './client-info.component.html',
    styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {
    @Input() codCliente: number;
    @Output() cliente = new EventEmitter<EntClient>();
    @Output() estacionElegida = new EventEmitter<EntStation>();
    clientForm: FormGroup;
    formCupo: FormGroup;
    documentTypes;
    stationCode: Number;
    stationsAll: EntStation[];
    clientSearch: EntClient;
    cities: EntCity[];
    departaments: EntDepartament[];
    articleTypes: EntArticleType[];
    quotaTypes: EntQuotaType[];
    stations: EntStation[];
    id: string;
    boolClient: Boolean;
    // estacionElegida: EntStation;
    constructor(
        private fb: FormBuilder,
        private carteraService: CarteraService,
        private _storaService: StorageService,
        private _utilService: UtilService,
        private _nService: NominaService,
        private _toast: PrincipalComponent,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.buildForm();
        this.basicData();
        this.getBasicData();
        this.getDocumentType();
    }
    public getBasicData() {
        forkJoin(
            this.carteraService.getDocumentType(),
            this.carteraService.getDepartament(1),
            this.carteraService.getCity(),
            this.carteraService.getQuotaType(),
            this._nService.GetStations(),
            this.carteraService.getArticleTypes()
        ).subscribe(
            ([res1, res2, res3, res4, res5, res6]) => {
                this.documentTypes = res1;
                this.departaments = res2;
                this.cities = res3;
                this.quotaTypes = res4;
                this.stationsAll = res5;
                this.articleTypes = res6;
                this.stations = res5.filter((e) => e.listoSimovil == true);
                this.GetParam();
            },
            (error) => console.log(error)
        );
    }
    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        this.getClientSearch(id);
        if (id != null) { this.getClientSearch(id); }
    }
    buildForm() {
        this.clientForm = new FormGroup({
            searchIdentificacion: new FormControl(['']),
            searchNombre: new FormControl(['']),
            searchTipoDocumento: new FormControl(['']),
            searchDepartamento: new FormControl(['']),
            searchCiudad: new FormControl(['']),
            searchDireccion: new FormControl(['']),
            searchTelefono: new FormControl(['']),
            searchCorreo: new FormControl(['']),
            searchEstado: new FormControl(['']),
            searchEstacion: new FormControl(['']),
        });
        this.formCupo = new FormGroup({
            cupoAsignado: new FormControl(null),
            cupoDisponible: new FormControl(null),
            detalleTipoCupo: new FormControl(null),
            estadoCupo: new FormControl(null),
        });
    }

    getDocumentType() {
        this.carteraService.getDocumentType().subscribe(documentTypes => {
            this.documentTypes = documentTypes;
        }, error => {
            console.log(error);
        });
    }
    basicData() {
        this.stationCode = this._storaService.getCurrentStation();
        this._utilService.loader();
        this._nService.GetStations().subscribe(res => {
            this.stationsAll = res;
            this._utilService.loader(false);
        }, error => {
            this._utilService.loader(false);
            this._toast.showMsg('error', 'ERROR', error.error.message);
        });
    }
    updateArrayCitySearch(departament: EntDepartament, edit?: boolean) {

    }
    getClientSearch(value) {
        if (value == null ) { return; }
        this.boolClient = false;
        this.carteraService.GetClient(value).subscribe(
            (data) => {
                this.cliente.emit(data[0]);
                this.clientSearch = data[0];
                const localcity: EntCity = this.cities.find(
                    (e) => e.idCiudad === this.clientSearch.ciudad
                );
                const localDepartment: string = this.departaments.find(
                    (dep) => dep.idDepartamento === localcity.idDepartamento
                ).nombreDepartamento;
                this.clientForm.setValue({
                    searchIdentificacion: this.clientSearch.codCliente,
                    searchNombre: this.clientSearch.nombre,
                    searchTipoDocumento: this.documentTypes.find(
                        (docType) => {
                            return docType.codTipoDocumento ===
                                this.clientSearch.tipoDoc;
                        }
                    ).detalle,
                    searchDepartamento: localDepartment,
                    searchCiudad: localcity.nombreCiudad,
                    searchDireccion: this.clientSearch.direccion,
                    searchTelefono: this.clientSearch.telefono,
                    searchCorreo: this.clientSearch.email,
                    searchEstado: this.clientSearch.estado,
                    searchEstacion: this.stationsAll.find((e) => e.idEstacion === this.clientSearch.estacion).nombreEstacion
                });
                if (data[0].infoCupo !== null) {
                    const infoCupo = data[0].infoCupo[0];
                    const EstadodelCupo = infoCupo.estadoCupo ? 'ACTIVO' : 'SUSPENDIDO';
                    this.formCupo.setValue({
                        cupoAsignado: infoCupo.cupoAsignado,
                        cupoDisponible: infoCupo.cupoDisponible,
                        detalleTipoCupo: infoCupo.detalleTipoCupo,
                        estadoCupo: EstadodelCupo
                    });
                }

                if (this.stationCode == null) {
                    this.estacionElegida.emit(this.stationsAll.find((e) => e.idEstacion === this.clientSearch.estacion));
                }
            },
            (error) => console.log('Sin registro')
        );

    }
}
