import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../routerAnimation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { UtilService } from '../../../services/util.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../services/storage.service';
import { EntAdvance } from '../../../Class/EntAdvance';
import { EntProvider } from '../../../Class/EntProvider';
import { focusById, currencyNotDecimal } from '../../../util/util-lib';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-advance-add',
    templateUrl: './advance-add.component.html',
    styleUrls: ['./advance-add.component.css'],
    animations: [fadeTransition()]
})
export class AdvanceAddComponent implements OnInit {
    advanceForm: FormGroup;
    usuario;
    stationsAll: EntStation[] = [];
    idstationSel: number;
    boolProvider = false;
    notdecimal = currencyNotDecimal();

    constructor(
        private fb: FormBuilder,
        private carteraService: CarteraService,
        private principalComponent: PrincipalComponent,
        private storageService: StorageService,
        private utilService: UtilService,
        private title: Title,
        private nominaService: NominaService
    ) {
        this.buildForm();
        this.title.setTitle('Crear anticípo - Simovil');
        this.getEstaciones();
    }

    ngOnInit() {
        this.usuario = this.storageService.getCurrentUserDecode().Usuario;
    }

    buildForm() {
        this.advanceForm = this.fb.group({
            proveedor: [null, Validators.required],
            nombreProveedor: [null, Validators.required],
            valor: [0, Validators.required],
            detalle: [null, Validators.required],
            idEstacion: [null]
        });
        this.formEdit(0);
    }
    getEstaciones() {
        this.nominaService.GetStations().subscribe(res => {
            this.stationsAll = res;
            this.utilService.loader(false);
        }, error => {
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'ERROR', error.error.message);
        });
    }
    submit() {

        if (!this.idstationSel || this.idstationSel == undefined) {
            Swal.fire({
                title: 'FALTAN DATOS',
                icon: 'info',
                text: 'Debe elegir la estacion a la que asignará el Anticipo'
            });
            return;
        }
        let advanceLocal = new EntAdvance();
        advanceLocal.proveedor = Number(this.advanceForm.get('proveedor').value);
        advanceLocal.valor = Number(this.advanceForm.get('valor').value);
        advanceLocal.detalle = this.advanceForm.get('detalle').value;
        advanceLocal.estado = 0;
        advanceLocal['usuario'] = this.usuario;
        advanceLocal.idEstacion = this.idstationSel;
        console.log(advanceLocal);
        this.InsertAdvance(advanceLocal);
    }

    InsertAdvance(advance: EntAdvance): void {
        this.utilService.loader(true);
        this.carteraService.InsertAdvance(advance).subscribe(data => {
            this.utilService.loader(false);
            this.reset();
            this.principalComponent.showMsg('success', 'Éxito', 'Anticípo registrado correctamente.');
        }, error => {
            console.log(error);
            this.utilService.loader(false);
            this.principalComponent.showMsg('error', 'Error', error.error.message);
        });
    }

    reset() {
        this.advanceForm.reset();
        this.formEdit(0);
    }

    getprovider() {
        let varpro = this.advanceForm.get('proveedor').value;
        if (varpro == null || varpro.length == 0) {
            return;
        }
        this.utilService.loader(true);
        this.carteraService.getProvider(varpro).subscribe(data => {
            this.utilService.loader(false);
            if (data.length == 1) {
                this.assignPro(data[0]);
            } else {
                this.principalComponent.showMsg('info', 'Información', 'El proveedor no existe.');
                this.advanceForm.get('nombreProveedor').setValue('');
                this.formEdit(0);
            }
        }, error => {
            this.principalComponent.showMsg('error', 'Error', error.error.message);
            this.utilService.loader(false);
        });
    }

    formEdit(number: number) {
        switch (number) {
            case 0: // inicial
                this.advanceForm.disable();
                this.advanceForm.get('proveedor').enable();
                this.advanceForm.get('nombreProveedor').enable();
                break;
            case 1: // validado proveedor
                this.advanceForm.enable();
                this.advanceForm.get('proveedor').disable();
                break;
        }
    }

    assignProvider(provider: EntProvider) {
        this.advanceForm.get('proveedor').setValue(provider.nit);
        this.boolProvider = false;
        this.assignPro(provider);
    }

    assignPro(provider: EntProvider) {
        this.advanceForm.get('nombreProveedor').setValue(provider.nombre);
        this.formEdit(1);
        focusById('idEstacion');
    }
}
