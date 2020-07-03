import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    FormArray,
} from '@angular/forms';
import { EntClient } from '../../../Class/EntClient';
import { CarteraService } from '../../../services/cartera.service';
import { EntDocumentType } from '../../../Class/EntDocumentType';
import { EntDepartament } from '../../../Class/EntDepartament';
import { EntCity } from '../../../Class/EntCity';
import { EntQuota } from '../../../Class/EntQuota';
import { EntQuotaType } from '../../../Class/EntQuotaType';
import { PrincipalComponent } from '../../../principal/principal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EntVehicle } from '../../../Class/EntVehicle';
import { Title } from '@angular/platform-browser';
import { EntTask } from '../../../Class/EntTask';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { fadeTransition } from '../../../routerAnimation';
import { forkJoin } from 'rxjs';
import {
    focusById,
    currencyNotDecimal,
    cleanString,
} from '../../../util/util-lib';
import { EntArticleType } from '../../../Class/EntArticleType';
import { EntDiscount } from '../../../Class/EntDiscount';

@Component({
    selector: 'app-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['./client-edit.component.css'],
    animations: [fadeTransition()],
})
export class ClientEditComponent implements OnInit {
    id: any;
    collapsed = [true, true, true];
    clientSearchForm: FormGroup;
    quotaSearchForm: FormGroup;
    editClientSearch = false;
    editClientSearchString = 'Editar';
    editQuotaSearch = false;
    editQuotaSearchString = 'Editar';
    display = 'show';
    displayDialog = false;
    displayDialogAudit = false;
    client: EntClient;
    clientSearch: EntClient;
    quotaSearch: EntQuota;
    documentTypes: EntDocumentType[];
    departaments: EntDepartament[];
    cities: EntCity[];
    quotaTypes: EntQuotaType[];
    filteredCitiesSearch: EntCity[];
    codClientTemp = [];
    vehicles: EntVehicle[];
    reasonForChange = '';
    asig = 0;
    dif = 0;
    disp = 0;
    modoCuentaCobro: any[];
    controlShow = false;
    stations: EntStation[];
    stationsAll: EntStation[];
    boolSearchClient = false;
    articleTypes: EntArticleType[];
    discounts: EntDiscount[];
    listDiscount: FormArray;
    boolDiscountForm = false;
    boolDiscountShow = false;
    indexselDiscount;
    notdecimal = currencyNotDecimal();

    constructor(
        private fb: FormBuilder,
        private carteraService: CarteraService,
        private nominaService: NominaService,
        private principalComponent: PrincipalComponent,
        private router: Router,
        private title: Title,
        private route: ActivatedRoute
    ) {
        this.buildForm();
        this.title.setTitle('Editar- Clientes - Simovil');

    }

    ngOnInit() {
        this.clientSearch = new EntClient();
        this.modoCuentaCobro = [
            { id: 0, text: 'Quincenal (1-15),(16-31)' },
            { id: 1, text: 'Por periodo de días' },
        ];
        this.controlShow = false;
        this.getBasicData();
    }

    public getBasicData() {
        forkJoin(
            this.carteraService.getDocumentType(),
            this.carteraService.getDepartament(1),
            this.carteraService.getCity(),
            this.carteraService.getQuotaType(),
            this.nominaService.GetStations(),
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
        if (id != null) { this.SearchClient(id); }
    }

    buildForm() {
        this.clientSearchForm = this.fb.group({
            searchIdentificacion: [
                '',
                Validators.compose([Validators.required]),
            ],
            searchNombre: ['', Validators.compose([Validators.required])],
            searchNitAlt: null,
            searchNombreAlt: null,
            searchTipoDocumento: [''],
            searchDepartamento: [''],
            searchCiudad: [''],
            searchDireccion: ['', Validators.compose([Validators.required])],
            searchTelefono: ['', Validators.compose([Validators.required])],
            searchCorreo: ['', Validators.compose([Validators.required])],
            searchEstado: [''],
            searchRetenedor: [''],
            searchEstacion: [''],
            searchModCobro: [''],
            searchNumDiaCobro: [''],
            searchSistema: [false],
            searchTodasEstaciones: [false],
        });
        this.quotaSearchForm = this.fb.group({
            searchQuotaAssigned: ['', Validators.required],
            searchQuotaAvaliable: ['', Validators.required],
            searchQuotaType: ['', Validators.required],
            listDescuento: this.fb.array([]),
        });
        this.clientSearchForm.disable();
        this.quotaSearchForm.disable();
        this.listDiscount = this.quotaSearchForm.get(
            'listDescuento'
        ) as FormArray;
    }

    updateArrayCitySearch(departament: EntDepartament, edit?: boolean) {
        if (departament != null) {
            this.filteredCitiesSearch = this.cities.filter((city) => {
                return city.idDepartamento === departament.idDepartamento;
            });
            if (edit) {
                this.clientSearchForm.controls['searchCiudad'].setValue(
                    this.filteredCitiesSearch[0]
                );
            }
        }
    }

    validarCedula(value: string) {
        if (value && value.length == 0) { return; }
        if (value == this.codClientTemp[0]) { return; }
        this.codClientTemp[0] = value;
        this.carteraService.GetClient(value).subscribe(
            (data) => {
                if (typeof data[0] === 'undefined') {
                    return;
                }
                this.client = data[0];
                this.principalComponent.showMsg(
                    'info',
                    'Información',
                    'Cliente ya registrado'
                );
            },
            (error) => console.log('Sin registro')
        );
    }

    onChangeSearch(value) {
        if (value == null) { return; }
        if (value.id == 1) { this.controlShow = true; }
        else { this.controlShow = false; }
    }

    submitClientSearch() {
        if (this.editClientSearchString == 'Guardar') {
            let cliente = new EntClient();
            cliente.codCliente = Number(
                this.clientSearchForm.get('searchIdentificacion').value
            );
            cliente.nombre = cleanString(
                this.clientSearchForm.get('searchNombre').value
            ).toUpperCase();
            cliente.nombreAlt = cleanString(
                this.clientSearchForm.get('searchNombreAlt').value
            ).toUpperCase();
            cliente.nitAlt = cleanString(
                this.clientSearchForm.get('searchNitAlt').value
            );
            cliente.tipoDoc =
                this.clientSearchForm.get('searchTipoDocumento').value == null
                    ? null
                    : this.clientSearchForm.get('searchTipoDocumento').value
                          .codTipoDocumento;
            cliente.ciudad =
                this.clientSearchForm.get('searchCiudad').value == null
                    ? null
                    : this.clientSearchForm.get('searchCiudad').value.idCiudad;
            cliente.direccion = cleanString(
                this.clientSearchForm.get('searchDireccion').value
            ).toUpperCase();
            cliente.telefono = cleanString(
                this.clientSearchForm.get('searchTelefono').value
            ).toUpperCase();
            cliente.email = cleanString(
                this.clientSearchForm.get('searchCorreo').value
            );
            cliente.estacion = Number(
                this.clientSearchForm.get('searchEstacion').value.idEstacion
            );
            cliente.estado = Boolean(
                this.clientSearchForm.get('searchEstado').value
            );
            cliente.retenedor = Boolean(
                this.clientSearchForm.get('searchRetenedor').value
            );
            cliente.tipoPeriodoCobro = Boolean(
                this.clientSearchForm.get('searchModCobro').value.id
            );
            cliente.periodoDiaCobro = cliente.tipoPeriodoCobro
                ? Number(this.clientSearchForm.get('searchNumDiaCobro').value)
                : null;
            cliente.sistema = Boolean(
                this.clientSearchForm.get('searchSistema').value
            );
            cliente.todasEstaciones = Boolean(
                this.clientSearchForm.get('searchTodasEstaciones').value
            );
            this.carteraService.UpdateClient(cliente).subscribe(
                (fila) => {
                    this.principalComponent.showMsg(
                        'success',
                        'Éxito',
                        'Cliente ' +
                            cliente.codCliente +
                            ' actualizado correctamente'
                    );
                    this.clientSearchForm.reset();
                    this.clientSearchForm.disable();
                    this.editClientSearch = false;
                },
                (error) => {
                    console.log(error);
                    this.principalComponent.showMsg(
                        'error',
                        'Error',
                        error.error.message
                    );
                }
            );
        } else {
            this.clientSearchForm.enable();
            this.clientSearchForm.controls['searchIdentificacion'].disable();
            this.editClientSearchString = 'Guardar';
            this.codClientTemp[1] = null;
        }
    }

    SearchClient(value: string) {
        if (value && value.length == 0) { return; }
        if (value == this.codClientTemp[1]) { return; }
        this.codClientTemp[1] = value;
        this.clientSearchForm.reset();
        this.quotaSearchForm.reset();
        this.emptyDiscount();
        this.editClientSearchString = 'Editar';
        this.editQuotaSearchString = 'Editar';
        this.getClientSearch(value);
        this.getQuotaSearch(value);
        this.getVehicles(value);
    }

    getClientSearch(value) {
        this.carteraService.GetClient(value).subscribe(
            (data) => {
                if (typeof data[0] === 'undefined') {
                    this.principalComponent.showMsg(
                        'info',
                        'Buscar cliente',
                        'Cliente ' + value + ' no encontrado'
                    );
                    this.editClientSearch = false;
                    this.editQuotaSearch = false;
                    this.collapsed = [true, true, true];
                    return;
                }
                this.clientSearch = data[0];
                let localcity: EntCity = this.cities.find(
                    (e) => e.idCiudad === this.clientSearch.ciudad
                );
                let localDepartment: EntDepartament = this.departaments.find(
                    (dep) => dep.idDepartamento === localcity.idDepartamento
                );
                this.updateArrayCitySearch(localDepartment);
                this.clientSearchForm.setValue({
                    searchIdentificacion: this.clientSearch.codCliente,
                    searchNombre: this.clientSearch.nombre,
                    searchNombreAlt: this.clientSearch.nombreAlt,
                    searchNitAlt: this.clientSearch.nitAlt,
                    searchTipoDocumento: this.documentTypes.find(
                        (docType) =>
                            docType.codTipoDocumento ===
                            this.clientSearch.tipoDoc
                    ),
                    searchDepartamento: localDepartment,
                    searchCiudad: localcity,
                    searchDireccion: this.clientSearch.direccion,
                    searchTelefono: this.clientSearch.telefono,
                    searchCorreo: this.clientSearch.email,
                    searchEstado: this.clientSearch.estado,
                    searchEstacion: this.stationsAll.find(
                        (e) => e.idEstacion === this.clientSearch.estacion
                    ),
                    searchModCobro: this.modoCuentaCobro.find(
                        (modo) =>
                            modo.id ===
                            Number(this.clientSearch.tipoPeriodoCobro)
                    ),
                    searchNumDiaCobro: this.clientSearch.periodoDiaCobro,
                    searchRetenedor: this.clientSearch.retenedor,
                    searchSistema: this.clientSearch.sistema,
                    searchTodasEstaciones: this.clientSearch.todasEstaciones,
                });
                this.collapsed[0] = false;
                this.collapsed[1] = false;
            },
            (error) => console.log('Sin registro')
        );
        this.clientSearchForm.disable();
        this.editClientSearch = true;
    }

    getQuotaSearch(value) {
        forkJoin(
            this.carteraService.getQuota(value),
            this.carteraService.getDiscount(value)
        ).subscribe(
            ([data1, data2]) => {
                if (data1 && data1.length == 1) {
                    this.quotaSearch = data1[0];
                    this.disp = this.quotaSearch.cupoDisponible;
                    this.asig = this.quotaSearch.cupoAsignado;
                    this.quotaSearchForm.patchValue({
                        searchQuotaAssigned: this.quotaSearch.cupoAsignado,
                        searchQuotaAvaliable: this.quotaSearch.cupoDisponible,
                        searchQuotaType: this.quotaTypes.find(
                            (quoType) =>
                                quoType.idTipoCupo === this.quotaSearch.tipoCupo
                        ),
                    });
                    this.editQuotaSearch = true;
                    if (data2 && data2.length > 0) {
                        data2.map((e) => this.addDiscount(e));
                        this.boolDiscountShow = true;
                    }
                } else { this.editQuotaSearchString = 'Agregar cupo'; }
            },
            (error) => console.log('Sin registro')
        );
        this.quotaSearchForm.disable();
        this.listDiscount.disable();
        this.editQuotaSearch = true;
    }

    ActCupoAsig() {
        let asigDep = +this.quotaSearchForm.controls['searchQuotaAssigned']
            .value;
        this.quotaSearchForm.controls['searchQuotaAvaliable'].setValue(
            asigDep - this.asig + this.disp
        );
    }

    getVehicles(value) {
        this.vehicles = null;
        this.carteraService.GetVehicle(value, null).subscribe(
            (vehicle) => {
                this.vehicles = vehicle;
                if (this.vehicles.length > 0) { this.collapsed[2] = false; }
                else { this.collapsed[2] = true; }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    addDiscount(val?: EntDiscount) {
        let val1 = val == null ? new EntDiscount() : val;
        this.listDiscount = this.quotaSearchForm.get(
            'listDescuento'
        ) as FormArray;
        let a = this.fb.group({
            articletype: [val1.TIPO_ARTICULO, Validators.required],
            detalle: this.getNameArticleType(val1.TIPO_ARTICULO),
            valor: [val1.VALOR, [Validators.required, Validators.min(0)]],
        });
        if (val != null) { a.disable(); }
        this.listDiscount.push(a);
        if (val == null) { this.boolDiscount(this.listDiscount.length - 1); }
    }

    removeDiscount() {
        this.listDiscount = this.quotaSearchForm.get(
            'listDescuento'
        ) as FormArray;
        this.listDiscount.removeAt(this.listDiscount.length - 1);
    }

    emptyDiscount() {
        this.listDiscount = this.quotaSearchForm.get(
            'listDescuento'
        ) as FormArray;
        while (this.listDiscount.length > 0) {
            this.removeDiscount();
        }
    }

    boolDiscount(val) {
        this.indexselDiscount = val;
        this.boolDiscountForm = true;
    }

    getNameArticleType(val) {
        try {
            return this.articleTypes.find((e) => e.ID == val).DESCRIPCION;
        } catch (error) {
            null;
        }
    }

    set enableListDisconunt(val: boolean) {
        this.listDiscount = this.quotaSearchForm.get(
            'listDescuento'
        ) as FormArray;
        for (let num = 0; num < this.listDiscount.length; num++) {
            if (val) { this.listDiscount.controls[num].enable(); }
            else { this.listDiscount.controls[num].disable(); }
        }
    }

    get enableListDiscount() {
        let val = true;
        for (let num = 0; num < this.listDiscount.length; num++) {
            if (this.listDiscount.controls[num].disabled) { val = false; }
        }
        return val && this.quotaSearchForm.enabled;
    }

    selArticle(val: EntArticleType) {
        if (
            this.listDiscount.controls.find(
                (e) => e.get('articletype').value == val.ID
            )
        ) {
            this.principalComponent.showMsg(
                'error',
                'Error',
                'El combustible ya fue seleccionado'
            );
        }
        else {
            this.listDiscount.controls[this.indexselDiscount].setValue({
                articletype: val.ID,
                detalle: this.getNameArticleType(val.ID),
                valor: 0,
            });
            this.boolDiscountForm = false;
            focusById('val-' + this.indexselDiscount);
        }
    }

    setQuotaSearch() {
        let cupo = new EntQuota();
        cupo.codCliente = Number(
            this.clientSearchForm.controls['searchIdentificacion'].value
        );
        cupo.cupoAsignado = Number(
            this.quotaSearchForm.controls['searchQuotaAssigned'].value
        );
        cupo.cupoDisponible = Number(
            this.quotaSearchForm.controls['searchQuotaAvaliable'].value
        );
        cupo.tipoCupo = Number(
            this.quotaSearchForm.controls['searchQuotaType'].value.idTipoCupo
        );
        let desc: EntDiscount[] = [];
        let rv = this.listDiscount.getRawValue();
        for (let num = 0; num < rv.length; num++) {
            desc.push({
                COD_CLIENTE: cupo.codCliente,
                TIPO_ARTICULO: rv[num].articletype,
                VALOR: rv[num].valor,
            });
        }
        cupo.descuento = desc;
        cupo.estadoCupo = true;
        cupo.editable = false;
        this.carteraService.UpdateQuota(cupo, this.reasonForChange).subscribe(
            (fila) => {
                this.principalComponent.showMsg(
                    'success',
                    'Éxito',
                    'Cupo del cliente ' +
                        cupo.codCliente +
                        ' actualizado correctamente'
                );
                this.quotaSearchForm.reset();
                this.emptyDiscount();
                this.quotaSearchForm.disable();
                this.listDiscount.disable();
                this.editQuotaSearch = false;
                this.reasonForChange = '';
            },
            (error) => {
                console.log(error);
                this.principalComponent.showMsg(
                    'error',
                    'Error',
                    error.error.message
                );
            }
        );
        this.displayDialog = false;
    }

    submitQuotaSearch() {
        this.codClientTemp[1] = null;
        if (this.editQuotaSearchString == 'Guardar') { this.displayDialog = true; }

        if (this.editQuotaSearchString == 'Editar') {
            if (this.quotaSearch.tipoCupo == 2) {
                this.principalComponent.showMsg(
                    'error',
                    'Bloqueado',
                    'Por seguridad no se permite editar un cupo anticipo.'
                );
                return;
            }
            if (this.quotaSearch.editable) {
                this.quotaSearchForm.enable();
                this.enableListDisconunt = true;
                this.quotaSearchForm.controls['searchQuotaAvaliable'].disable();
                this.editQuotaSearchString = 'Guardar';
            } else { this.displayDialogAudit = true; }
        }

        if (this.editQuotaSearchString == 'Agregar cupo') {
            this.router.navigate(['cupo/' + this.clientSearch.codCliente]);
        }
    }

    CancelClientSearchForm() {
        this.getClientSearch(
            this.clientSearchForm.controls['searchIdentificacion'].value
        );
        this.editClientSearchString = 'Editar';
    }

    CancelQoutaForm() {
        this.emptyDiscount();
        this.getQuotaSearch(
            this.clientSearchForm.controls['searchIdentificacion'].value
        );
        this.editQuotaSearchString = 'Editar';
    }

    setChangeAudit() {
        let task = new EntTask();
        task.perfilEncargado = 'AUDITORIA';
        task.detalle =
            'Habilitar edición del cupo del cliente ' +
            this.clientSearchForm.controls['searchIdentificacion'].value;
        task.estado = true;
        this.displayDialogAudit = false;
        this.carteraService.InsertTask(task).subscribe(
            (fila) => {
                this.principalComponent.showMsg(
                    'success',
                    'Éxito',
                    'Tarea asignada correctamente a Auditoria'
                );
                this.quotaSearchForm.reset();
                this.emptyDiscount();
                this.quotaSearchForm.disable();
                this.listDiscount.disable();
                this.editQuotaSearch = false;
                this.reasonForChange = '';
            },
            (error) => {
                console.log(error);
                this.principalComponent.showMsg(
                    'error',
                    'Error',
                    'Error al asignar tarea.'
                );
            }
        );
        this.displayDialogAudit = false;
    }

    getCodClient(client: EntClient) {
        this.id = client.codCliente;
        this.boolSearchClient = false;
        // this.getClientSearch(this.id);
        this.SearchClient(this.id);
        focusById('btnSearchCli', true);
    }

    searchClient() {
        this.boolSearchClient = true;
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }
}
