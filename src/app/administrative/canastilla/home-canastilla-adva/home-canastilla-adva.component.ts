import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EntAdtvaDatosEstaciones } from '../../../Class/EntAdtvaDatosEstaciones';
// import { ViewFlags } from '@angular/core/src/view';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home-canastilla-adva',
    templateUrl: './home-canastilla-adva.component.html',
    styleUrls: ['./home-canastilla-adva.component.css']
})
export class HomeCanastillaAdvaComponent implements OnInit {
    FILAS: Number;
    stationCode;
    stationsAll: EntAdtvaDatosEstaciones[];
    stationSel;
    totalVentasBrutas: number = 0;
    totalUtilidad: number = 0;

    /// Variables del Reporte
    boolNovelty = false;
    widthReport: number;
    nameReport: string;
    params: any[];
    showReport: boolean = false;
    constructor(
        private _storageService: StorageService,
        private _NominaService: NominaService,
        private title: Title
    ) { }

    ngOnInit() {
        this.GetEstaciones();
        this.title.setTitle('Lubricantes - Simovil');
    }
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetDatosEstaLubri().subscribe(data => {
            this.stationsAll = data;

            this.stationsAll.forEach(estacion => {
                this.totalUtilidad += estacion.utilidad;
                this.totalVentasBrutas += estacion.ventaBruta;

            });

        }, error => console.error(error.error.message));

    }
    FormatoFecha(fecha: Date): string {
        fecha = new Date(fecha);
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (fecha.getDate());
    }
    VerModal(Estacion: EntAdtvaDatosEstaciones) {
        this.showReport = true;
        this.nameReport = 'Administracion/RPT_VENTAS_DIARIAS';
        this.widthReport = 120;
        this.params = [];
        this.params.push([Estacion.idEstacion, 'idEstacion']);
        this.params.push([this.FormatoFecha(Estacion.fechaUltimoRegistro), 'FechaIncial']);
        this.params.push([this.FormatoFecha(Estacion.fechaUltimoRegistro), 'FechaFinal']);
        this.params.push([null, 'IdProducto']);
        this.boolNovelty = this.showReport;
    }

    // PrintReport(Mes: Date) {
    //     if (this.productos.length > 0) {
    //         console.log('EN unidades');
    //         this.showReport = true;
    //         this.nameReport = 'Administracion/RPT_PRODUCTOS_CONSOLIDADOS_U';
    //         this.widthReport = 100;
    //         this.params = [];
    //         this.params.push([this.stationSel.idEstacion, 'IdEstacion']);
    //         this.params.push([this.FormatoFechaIni(Mes), 'Fecha']);
    //         this.boolNovelty = this.showReport;
    //     } else if (this.ProdutosPesos.length > 0) {
    //         console.log('EN PESOS');
    //         this.showReport = true;
    //         this.nameReport = 'Administracion/RPT_PRODUCTOS_CONSOLIDADOS';
    //         this.widthReport = 100;
    //         this.params = [];
    //         this.params.push([this.stationSel.idEstacion, 'idEstacion']);
    //         this.params.push([this.FormatoFechaIni(Mes), 'fecha']);
    //         this.boolNovelty = this.showReport;
    //     }

    // }
}
