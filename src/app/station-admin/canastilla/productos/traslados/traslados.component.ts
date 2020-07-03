import { Component, OnInit } from '@angular/core';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductos } from '../../../../Class/EntProductos';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { EntVentasProductos } from '../../../../Class/EntVentaProducto';
import { EntClient } from '../../../../Class/EntClient';
import { currencyNotDecimal, focusById, dateToISOString, addDays } from '../../../../util/util-lib';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { fadeTransition } from '../../../../routerAnimation';
import { EntProductosTraslados } from '../../../../Class/EnProductosTraslados';


@Component({
    selector: 'app-traslados',
    templateUrl: './traslados.component.html',
    styleUrls: ['./traslados.component.css'],
    animations: [fadeTransition()]
})
export class TrasladosComponent implements OnInit {
    tabs;
    stationCode;
    productos: EntProductosTraslados[] =[];
    constructor(
        private _NominaService: NominaService,
        private _storageService: StorageService
    ) {

        this.stationCode = this._storageService.getCurrentStation();
        if (this.stationCode) {
            this.getProductos(this.stationCode);
        }
    }

    ngOnInit() {
        this.tabs = [
            { estado: true, classTab: '' },
            { estado: false, classTab: '' },
            { estado: false, classTab: '' }
        ];
        this.setTab(this.tabs);
    }

    setTab(tabl) {
        tabl.forEach(element => {
            if (element.estado === true) {
                element.classTab = 'active';
                element.classPane = 'show active';
            } else {
                element.classTab = '';
                element.classPane = '';
            }
        });
    }

    tabClass(value: number) {
        if (this.tabs[value].estado === true) {
            return;
        } else {
            this.tabs.forEach(e => {
                e.estado = false;
                e.classTab = '';
            });
            if (this.tabs[value].estado === false) {
                this.tabs[value].estado = true;
                this.tabs[value].classTab = 'active';
            }
        }
        // if (value == 1) {
        //   this.getclientsPending();
        // }
    }

    getProductos(estacion?: number) {
        this._NominaService.GetProductosTraslados(estacion).subscribe(data => {
            this.productos = data;
        }, error => {
            console.log(error);

        });
    }
}
