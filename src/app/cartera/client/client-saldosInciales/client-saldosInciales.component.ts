import { Component, OnInit, Input } from '@angular/core';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { UtilService } from '../../../services/util.service';
import { StorageService } from '../../../services/storage.service';
import { PrincipalComponent } from '../../../principal/principal.component';
import { currencyNotDecimal } from '../../../util/util-lib';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CarteraService } from '../../../services/cartera.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-client-saldosInciales',
    templateUrl: './client-saldosInciales.component.html',
    styleUrls: ['./client-saldosInciales.component.css']
})
export class ClientSaldosIncialesComponent implements OnInit {
    @Input() codCliente: number;
    @Input() stationCode: number;
    @Input() estacionElegida: EntStation;
    idUsuario;
    stationsAll: EntStation[];
    stations: EntStation[];
    fecha = new Date().toISOString();
    notdecimal = currencyNotDecimal();
    formulario: FormGroup;
    SaldosInciales: boolean;
    estacion: any;
    Titulo: string;
    EtiquetaSaldo: string;
    constructor(
        private _nService: NominaService,
        private _utilService: UtilService,
        private _storaService: StorageService,
        private _toast: PrincipalComponent,
        private _cartService: CarteraService,
        private title: Title
    ) {

    }

    ngOnInit() {
        this.stationCode = this._storaService.getCurrentStation();
        this.Inicio();
        this.fecha = this.FormatFecha(this.fecha);
        this.basicData();
        this.title.setTitle('Clientes - Simovil');
    }
    basicData() {
        this._utilService.loader();

        this._nService.GetStations().subscribe(res => {
            this.stationsAll = res;
            this.stations = res.filter(e => e.listoSimovil == true);
            if (this.stationCode) {
                this.estacionElegida = this.stations.find(e => e.idEstacion == this.stationCode);

            }
            this.buscarSaldoInicial(this.estacionElegida.idEstacion, this.fecha, this.codCliente);
            this._utilService.loader(false);
        }, error => {
            this._utilService.loader(false);
            this._toast.showMsg('error', 'ERROR', error.error.message);
        });
    }
    CrearSaldosIniciales(formulario) {
        formulario.codClient = this.codCliente;
        formulario.detalles = 'SALDOS INICIALES CREADOS EN LA ESTACION EL ' + this.FormatFecha(new Date().toISOString());
        this._nService.CrearSaldosIniciales(formulario).subscribe(resp => {
            console.log(resp);
            if (resp.length > 0) {
                const MSG = resp[0];
                this._toast.showMsg(MSG.icon, MSG.title, MSG.text);
            } else {
                this._toast.showMsg('error', 'Registro Fallido', 'algo falló');
            }
        });

    }
    Inicio() {
        if (this.codCliente == null) {
            return;
        }
        this.formulario = new FormGroup({
            idEstacion: new FormControl(null),
            fecha: new FormControl(null),
            valor: new FormControl([null, Validators.required]),
            detalles: new FormControl(null),
            observaciones: new FormControl(null)

        });
    }
    buscarSaldoInicial(idEstacion: number, fecha: string, CodCliente: number) {

        this._cartService.getSaldoIncicialCliente(idEstacion, fecha, CodCliente).subscribe(resp => {
            if (resp.length > 0) {
                this.SaldosInciales = true;
                this.formulario.setValue({
                    idEstacion: resp[0].ID_ESTACION,
                    fecha: this.FormatFecha(resp[0].FECHA),
                    valor: resp[0].SALDO,
                    detalles: resp[0].DETALLES,
                    observaciones: resp[0].OBSERVACIONES

                });
                this.Titulo = 'INFORMACION SALDO INICIAL';
                this.EtiquetaSaldo = 'Saldo :';
            } else {
                this.Titulo = 'CREAR SALDO INICIAL';
                this.EtiquetaSaldo = 'Saldo Inicial :';
                this.SaldosInciales = false;
                this.formulario.setValue({
                    idEstacion: idEstacion,
                    fecha: fecha,
                    valor: null,
                    detalles: null,
                    observaciones: null
                });
            }

        });
    }
    Busqueda() {
        const idEstacion = this.formulario.get('idEstacion').value;
        this.buscarSaldoInicial(idEstacion, this.fecha, this.codCliente);

    }
    FormatFecha(string): string {
        string = string.split('T');
        const info = string[0].split('-');
        return info[0] + '-' + info[1] + '-' + info[2];
    }
}
