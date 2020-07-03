import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { SelectItem } from 'primeng/api';
import { EntStation } from '../../../Class/EntStation';
import { EntClient } from '../../../Class/EntClient';

@Component({
    selector: 'app-station-consumption-reports',
    templateUrl: './station-consumption-reports.component.html',
    styleUrls: ['./station-consumption-reports.component.css']
})
export class StationConsumptionReportsComponent implements OnInit {
    desde: Date = new Date();
    hasta: Date = new Date();
    stationCode;
    stationsAll: EntStation[];
    stationSel: EntStation;
    boolClient = false;
    clientSel: EntClient;
    paramSel;
    opcSel;
    params: any[];
    showReport = false;
    nameReport = '';
    widthReport;
    constructor(
        public _storageService: StorageService,
        public _NominaService: NominaService,
        public principal: PrincipalComponent
    ) { }

    ngOnInit(): void {
        this.GetEstaciones();
        this.clientSel = new EntClient();
    }
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }

        }, error => this.principal.showMsg('error', 'ERROR', error.error.message));
    }
    assignClient(client: EntClient) {
        this.clientSel = client;
        console.log(client);
        this.boolClient = false;
    }
    boolClientF() {
        this.boolClient = true;
    }
    imprimirReporte() {
        // console.log(this.clientSel.codCliente);
        // console.log(this.desde);
        // console.log(this.hasta);
        this.nameReport = 'Administracion/RPT_CONSUMOS_CLIENTE';
        this.params = [];
        this.params.push([this.stationSel.idEstacion, 'idEstacion']);
        this.params.push([this.desde, 'desde']);
        this.params.push([this.hasta, 'hasta']);
        this.params.push([this.clientSel.codCliente, 'codCliente']);
        this.widthReport = 130;
        this.showReport = true;

    }

    FormatoFecha(A: Date): string {
        console.log(A);
        const fecha: Date = new Date(A);
        console.log(fecha);
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (fecha.getDate());
    }
}
