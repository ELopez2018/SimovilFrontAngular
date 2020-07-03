import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductosConsolidado } from '../../../../Class/EntProductosConsolidado';
// Servicios
import { StorageService } from '../../../../services/storage.service';
import { UtilService } from '../../../../services/util.service';
import { NominaService } from '../../../../services/nomina.service';
import { DOCUMENT } from '@angular/common';
import { EntConsolidadoenPesos } from '../../../../Class/EntConsolidadoenPesos';

@Component({
    selector: 'app-consolidado',
    templateUrl: './consolidado.component.html',
    styleUrls: ['./consolidado.component.css']
})
export class ConsolidadoComponent implements OnInit {
    boolNovelty = false;
    ver = false;
    stationsAll: EntStation[];
    stationSel: any;
    stationCode: any;
    IdStacion: any;
    productos: EntProductosConsolidado[] = [];
    ProdutosPesos: EntConsolidadoenPesos[] = [];
    cargando = false;
    es: any;
    Fecha = new Date();
    dates: Date[];
    rangeDates: Date[];
    minDate: Date;
    maxDate: Date;
    invalidDates: Date[];
    // Reporte
    showReport: true;
    nameReport: string;
    params: any[];
    widthReport: number;
    Reporte = 2;
    Invini = 0;
    InvComp = 0;
    InvBaja = 0;
    InvVenta = 0;
    InvFinal = 0;
    InvGanancia = 0;
    InvTaslados = 0;
    InvTasladosRecibidos = 0;
    InvAcredito = 0;
    Totales: EntProductosConsolidado;
    ElementoA: any;

    constructor(
        private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService,
        @Inject(DOCUMENT) private _document
    ) {
        this.title.setTitle('Consolidado de Ventas - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.IdStacion = this.stationCode;

    }
    ngOnInit() {
        this.GetEstaciones();
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const prevMonth = (month === 0) ? 11 : month - 1;
        const prevYear = (prevMonth === 11) ? year - 1 : year;
        const nextMonth = (month === 11) ? 0 : month + 1;
        const nextYear = (nextMonth === 0) ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);
        const invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today, invalidDate];
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['ENERO ', 'FEBRERO ', 'MARZO ', 'ABRIL ', 'MAYO ', 'JUNIO', 'JULIO ', 'AGOSTO ', 'SEPTIEMBRE ', 'OCTUBRE ', 'NOVIEMBRE ', 'DICIEMBRE '],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
        this.cargando = true;
    }
    aplicarActive(link: any) {
        const selectores: any = document.getElementsByClassName('selectores');

        for (const ref of selectores) {
            ref.classList.remove('active');
        }
        link.classList.add('active');
    }
    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    getNameStation(id: number) {
        if (this.stationsAll === null || id === null) {
            return;
        }
        return this.stationsAll.find(e => e.idEstacion === id).nombreEstacion;
    }
    getProductos(estacion?: number, Fecha?: Date) {
        // this.utilService.loader(true);
        this.nominaService.GetProductosConsolidado(estacion, Fecha).subscribe(data => {
            this.ProdutosPesos = [];
            this.productos = data;
            this.cargando = false;
            // this.utilService.loader(false);
            if (data.length <= 0) {
                this.principalComponent.showMsg('info', 'Información', 'No existen Datos');
            }
            this.Invini = 0;
            this.InvComp = 0;
            this.InvBaja = 0;
            this.InvVenta = 0;
            this.InvFinal = 0;
            this.InvGanancia = 0;
            this.Totalizar();
            // this.utilService.loader(false);
            // if (this.productos.length > 0) {
            //     this.productos.push(this.Totales);
            // }
        }, error => {
            this.utilService.loader(false);
        });
    }
    getProductosPesos(estacion?: number, Fecha?: Date) {
        this.utilService.loader(true);
        this.nominaService.GetProductosConsolidadoPesos(estacion, Fecha).subscribe(data => {
            this.productos = [];
            this.ProdutosPesos = data;
            this.cargando = false;
            this.utilService.loader(false);
            if (data.length <= 0) {
                this.principalComponent.showMsg('info', 'Información', 'No existen Datos');
            }
            this.Invini = 0;
            this.InvComp = 0;
            this.InvBaja = 0;
            this.InvVenta = 0;
            this.InvFinal = 0;
            this.InvGanancia = 0;
            this.Totalizar();
            if (this.productos.length > 0) {
                this.productos.push(this.Totales);
            }
        }, error => {
            this.utilService.loader(false);
        });
    }
    VerConsolidado(Fecha: Date) {
        if (this.IdStacion) {
            this.getProductos(this.IdStacion, Fecha);
        } else {
            this.principalComponent.showMsg('info', 'Información', 'Debe seleccionar la Estación a consultar');
        }
    }
    VerModal(idProducto: number, Mes: Date) {
        this.showReport = true;
        this.nameReport = 'Administracion/RPT_VENTAS_DIARIAS';
        this.widthReport = 100;
        this.params = [];
        this.params.push([this.IdStacion, 'idEstacion']);
        this.params.push([this.FormatoFechaIni(Mes), 'FechaIncial']);
        this.params.push([this.FormatoFechaFin(Mes), 'FechaFinal']);
        this.params.push([idProducto, 'IdProducto']);
        this.boolNovelty = this.showReport;
    }
    PrintReport(Mes: Date) {
        if (this.productos.length > 0) {
            console.log('EN unidades');
            this.showReport = true;
            this.nameReport = 'Administracion/RPT_PRODUCTOS_CONSOLIDADOS_U';
            this.widthReport = 100;
            this.params = [];
            this.params.push([this.stationSel.idEstacion, 'IdEstacion']);
            this.params.push([this.FormatoFechaIni(Mes), 'Fecha']);
            this.boolNovelty = this.showReport;
        } else if (this.ProdutosPesos.length > 0) {
            console.log('EN PESOS');
            this.showReport = true;
            this.nameReport = 'Administracion/RPT_PRODUCTOS_CONSOLIDADOS';
            this.widthReport = 100;
            this.params = [];
            this.params.push([this.stationSel.idEstacion, 'idEstacion']);
            this.params.push([this.FormatoFechaIni(Mes), 'fecha']);
            this.boolNovelty = this.showReport;
        }

    }

    FormatoFechaIni(fecha: Date): string {
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-01';
    }
    FormatoFechaFin(fecha: Date): string {
        const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        return fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + (ultimoDia.getDate());
    }
    VerEstacion(estacion) {
        this.IdStacion = estacion.idEstacion;
    }
    Cambiar(Fecha: Date, Reporte: number, elemento: any) {
        this.Reporte = Reporte;
        switch (this.Reporte) {
            case 2:
                this.getProductosPesos(this.IdStacion, Fecha);
                this.aplicarActive(elemento);
                break;
            case 3:
                this.getProductos(this.IdStacion, Fecha);
                this.aplicarActive(elemento);
                break;
        }
    }
    Totalizar() {
        switch (this.Reporte) {
            case 2:
                // tslint:disable-next-line: forin
                for (const I in this.ProdutosPesos) {
                    // Totales Acumulados
                    this.Invini = this.Invini + (this.ProdutosPesos[I].InvInicial);
                    this.InvComp = this.InvComp + (this.ProdutosPesos[I].Compras);
                    this.InvVenta = this.InvVenta + (this.ProdutosPesos[I].Ventas);
                    this.InvFinal = this.InvFinal + (this.ProdutosPesos[I].InvFinal);
                    this.InvGanancia += this.ProdutosPesos[I].ganancia;
                }
                break;
            case 3:
                // tslint:disable-next-line: forin
                for (const I in this.productos) {
                    // Totales Acumulados
                    this.Invini = this.Invini + (this.productos[I].InvInicial);
                    this.InvComp = this.InvComp + (this.productos[I].Compras);
                    this.InvBaja += this.productos[I].Bajas;
                    this.InvTaslados += this.productos[I].traslados;
                    this.InvVenta = this.InvVenta + (this.productos[I].Ventas);
                    this.InvFinal = this.InvFinal + (this.productos[I].InvFinal);
                    this.InvGanancia += this.productos[I].ganancia;
                    this.InvTasladosRecibidos += this.productos[I].trasladosRecibidos;
                    this.InvAcredito += this.productos[I].acredito;
                }
                break;
        }
    }


}
