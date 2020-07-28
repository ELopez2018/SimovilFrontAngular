import { Component, OnInit } from '@angular/core';
import { EntClient } from '../../../../Class/EntClient';
import { NominaService } from '../../../../services/nomina.service';
import { StorageService } from '../../../../services/storage.service';
import { UtilService } from '../../../../services/util.service';
import { EntStation } from '../../../../Class/EntStation';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { focusById } from '../../../../util/util-lib';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'app-client-Balance-General',
    templateUrl: './client-Balance-General.component.html',
    styleUrls: ['./client-Balance-General.component.css'],
})
export class ClientBalanceGeneralComponent implements OnInit {
    booleanClient: boolean = false;
    cliente: EntClient = new EntClient();
    searchConsumoFechaIni: string;
    searchConsumoFechaFin: string;
    stationCode: number;
    stacionElegida: any;
    stationsAll: EntStation[];
    estaciones: any[] = [];
    id;
    totalValorConsumo: number = 0;
    totalGalones: number = 0;
    totalPagos: number = 0;
    totalRetenciones: number = 0;
    totalDescuento: number = 0;
    saldoInicial: any = 0;
    consumos: any[] = [];
    descuentos: any[] = [];
    pagos: any[] = [];
    retenciones: any[] = [];
    fecha = new Date().toISOString();

    msgsConsumo = [{ severity: 'info', summary: '', detail: 'NO EXISTEN CONSUMOS' }];
    msgsPagos = [{ severity: 'info', summary: '', detail: 'NO EXISTEN PAGOS' }];
    msgsRetenciones = [{ severity: 'info', summary: '', detail: 'NO EXISTEN RETENCIONES' }];
    msgsDescuento = [{ severity: 'info', summary: '', detail: 'NO EXISTEN DESCUENTOS' }];

    constructor(
        public nominaService: NominaService,
        public _storaService: StorageService,
        public _utilService: UtilService,
        public _toast: PrincipalComponent,
        private title: Title
    ) { }

    ngOnInit() {
        this.stationCode = this._storaService.getCurrentStation();
        this.searchConsumoFechaIni = this.FormatFecha(this.fecha);
        this.searchConsumoFechaFin = this.FormatFecha(this.fecha);
        this.basicData();
        this.title.setTitle('Balance - Simovil');
    }
    resultClient($event) {
        this.booleanClient = false;
        this.cliente = $event;
    }
    getEstadoCuentas(
        idEstacion: number,
        CodCli: number,
        fechaIni: string,
        fechaFin: string
    ) {
        this.nominaService
            .GetEstadoCuentas(idEstacion, CodCli, fechaIni, fechaFin)
            .subscribe((resp) => {
                console.log(resp);
                this.totalPagos = 0;
                this.totalRetenciones = 0;
                this.totalDescuento = 0;
                this.totalValorConsumo = 0;
                this.totalGalones = 0;

                this.consumos = resp[0].CONSUMOS || [];
                this.retenciones = resp[0].RETENCIONES || [];
                this.pagos = resp[0].PAGOS || [];
                console.log(this.pagos );
                this.descuentos = resp[0].DESCUENTOS || [];
                this.saldoInicial = resp[0].SALDOINICIAL || 0;

                if (this.consumos.length > 0) {
                    this.consumos.forEach(item => {
                        this.totalValorConsumo += item.valor;
                        this.totalGalones += item.cantidad;
                        focusById('tablaConsumo', true);
                    });
                }
                if (this.pagos.length > 0) {

                    this.pagos.forEach(item => {
                        this.totalPagos += item.valor;
                    });
                }

                if (this.retenciones.length > 0) {

                    this.retenciones.forEach(item => {
                        this.totalRetenciones += item.valor;
                    });
                }
                if (this.descuentos.length > 0) {

                    this.descuentos.forEach(item => {
                        this.totalDescuento += item.valor;
                    });
                }
            });

    }

    FormatFecha(string): string {
        string = string.split('T');
        const info = string[0].split('-');
        return info[0] + '-' + info[1] + '-' + info[2];
    }
    basicData() {
        this._utilService.loader();
        this.nominaService.GetStations().subscribe(
            (res) => {
                this.stationsAll = res;
                res.map((i) => {
                    this.estaciones.push({
                        label: i.nombreEstacion.toString(),
                        value: i,
                    });
                });
                this.stacionElegida = this.estaciones.filter(
                    (i) => i.value.idEstacion == this.stationCode
                )[0].value;
                this._utilService.loader(false);
            },
            (error) => {
                this._utilService.loader(false);
                this._toast.showMsg('error', 'ERROR', error.error.message);
            }
        );
    }

    consultar() {
        this.getEstadoCuentas(
            this.stacionElegida.idEstacion,
            this.cliente.codCliente,
            this.searchConsumoFechaIni,
            this.searchConsumoFechaFin
        );
    }
}
