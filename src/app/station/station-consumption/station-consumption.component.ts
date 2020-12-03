import { Component, OnInit } from '@angular/core';
import { EntConsumptionClient } from '../../Class/EntConsumptionClient';
import { NominaService } from '../../services/nomina.service';
import { CarteraService } from '../../services/cartera.service';
import { StorageService } from '../../services/storage.service';
import { EntStation } from '../../Class/EntStation';
import { PrincipalComponent } from '../../principal/principal.component';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { EntClient } from '../../Class/EntClient';
import { fadeTransition } from '../../routerAnimation';
import { UtilService } from '../../services/util.service';
import {
    rangedate,
    dateToISOString,
    focusById,
    ObjToCSV,
} from '../../util/util-lib';
import { PrintService } from '../../services/print.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-station-consumption',
    templateUrl: './station-consumption.component.html',
    styleUrls: ['./station-consumption.component.css'],
    animations: [fadeTransition()],
})
export class StationConsumptionComponent implements OnInit {
    searchConsumos: EntConsumptionClient[] = [];
    codEstation;
    stationsAll: EntStation[] =[];
    stationSel: EntStation= new EntStation();
    stationCode: number = null;

    client: EntClient;
    searchConsumoFechaIni;
    searchConsumoFechaFin;
    id;
    nombreCliente: string;
    booleanClient = false;
    estilos: string =
        'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';

    constructor(
        private nominaService: NominaService,
        private carteraService: CarteraService,
        private storageService: StorageService,
        private principal: PrincipalComponent,
        private route: ActivatedRoute,
        private location: Location,
        private utilService: UtilService,
        private printService: PrintService,
        private title: Title
    ) {
        this.codEstation = this.storageService.getCurrentStation();
    }

    ngOnInit() {
        this.GetEstaciones();
        let fechas = rangedate(dateToISOString(new Date()), 0);
        this.searchConsumoFechaIni = dateToISOString(fechas[0]);
        this.searchConsumoFechaFin = dateToISOString(fechas[1]);
        this.client = new EntClient();
        this.nominaService.GetStations().subscribe(
            (data) => {
                this.stationsAll = data;
            },
            (error) => console.log(error)
        );
        this.GetParam();
        focusById('btnClient');
        this.title.setTitle('Consumos - Simovil');
    }

    GetParam() {
        const id = this.route.snapshot.paramMap.get('id');
        this.id = id;
        if (id != null) this.searchByParam(id);
    }
    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        this.nominaService.GetStations().subscribe(
            (data) => {
                this.stationsAll = data;
                if (this.stationCode) {
                    this.stationSel = this.stationsAll.find(
                        (e) => e.idEstacion == this.stationCode
                    );
                }
            },
            (error) => console.error(error.error.message)
        );
    }
    searchByParam(id) {
        this.carteraService.GetClient(id).subscribe(
            (client) => {
                this.client = client[0];
                focusById('btnSearch');
            },
            (error) => {
                console.log(error);
                this.location.back();
            }
        );
    }

    searchClient() {
        if (this.client.codCliente == null) return;
        this.carteraService.GetClient(this.client.codCliente).subscribe(
            (client) => {
                if (client.length != 0) this.client = client[0];
                else {
                    this.principal.showMsg(
                        'info',
                        'Información',
                        'Cliente no encontrado.'
                    );
                }
            },
            (error) => {
                console.log(error);
                this.principal.showMsg('error', 'Error', error.error.message);
            }
        );
    }

    getConsumptionSearch() {
        if (!this.stationSel) {
            this.stationSel = new EntStation();
            this.stationSel.idEstacion = null;
        }
        // if(!this.client || !this.client.codCliente) {
        //     this.principal.showMsg('warn','FALTAN DATOS','Seleccione un cliente');
        //     return;
        // }
        this.utilService.loader(true);
        this.carteraService
            .getConsumption(
                this.client.codCliente,
                this.searchConsumoFechaIni,
                this.searchConsumoFechaFin,
                null,
                this.stationSel.idEstacion
            )
            .subscribe(
                (consumptions) => {
                    if(!consumptions || consumptions.length <= 0) {
                        this.principal.showMsg('warn','SIN RESULTADOS','No se encontraron registros')
                    }
                    this.searchConsumos = consumptions;
                    this.utilService.loader(false);
                    if (
                        this.searchConsumos.length > 0 &&
                        this.searchConsumos !== null
                    ) {
                        this.estilos =
                            'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center pb-2';
                    } else {
                        this.estilos =
                            'form-group col-sm-12 p-0 form-inline mb-0 justify-content-center shadow pb-2';
                    }
                },
                (error) => {
                    console.log(error);
                    this.utilService.loader(false);
                    this.principal.showMsg(
                        'error',
                        'Error',
                        error.error.message
                    );
                },
                () => this.utilService.loader(false)
            );
    }

    sumConsumption() {
        let array: EntConsumptionClient[];
        var suma = 0;
        array = this.searchConsumos;
        array.forEach((element) => {
            suma += element.valor;
        });
        return suma;
    }

    cleanConsumptionSearch() {
        this.searchConsumoFechaIni = null;
        this.searchConsumoFechaFin = null;
        this.searchConsumos = null;
        this.client = new EntClient();
    }

    printConsumptionSearch(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-consumption').innerHTML;
        popupWin = window.open(
            '',
            '_blank',
            'top=0,left=0,height=100%,width=auto'
        );
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Consumos</title>
          <style>
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
          <h4 class="text-center mt-3">Consumos del ${this.searchConsumoFechaIni} al ${this.searchConsumoFechaFin}</h4>
          ${printContents}
        </body>
      </html>`);
        popupWin.document.close();
    }

    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) return;
        return this.stationsAll.find((e) => e.idEstacion == id).nombreEstacion;
    }

    back() {
        this.location.back();
    }

    resultClient(client: EntClient) {
        this.client = client;
        this.nombreCliente = client.nombre;
        this.booleanClient = false;
        focusById('btnSearch');
    }

    openModCli() {
        this.booleanClient = true;
        setTimeout(() => {
            focusById('searchCli');
        }, 10);
    }

    csvConsumptionSearch() {
        let title = [
            'fechaConsumo',
            'horaConsumo',
            'ConsecutivoEstacion',
            'cantidad',
            'DESCRIPCION',
            'placa',
            'valor',
            'idPedido',
            'estacionConsumo',
            'cuentaCobro',
        ];
        let titleB = [
            'Fecha',
            'Hora',
            'Tiquete',
            'Cantidad',
            'Combustible',
            'Placa',
            'Valor',
            'Pedido',
            'Estación',
            'Cuenta de Cobro',
        ];
        let item = JSON.parse(JSON.stringify(this.searchConsumos));
        console.log(item);
        item.map((e) => {
            e.fechaConsumo = formatDate(
                e.fechaConsumo,
                'dd/MM/yyyy',
                'en-US',
                '+0000'
            );
            e.horaConsumo = e.horaConsumo;
        });
        this.printService.downloadCSV(
            ObjToCSV(item, title, titleB),
            'CONSUMOS ' + this.nombreCliente
        );
    }
}
