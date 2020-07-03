import { Component, OnInit } from '@angular/core';
import { EntVentasProductos } from '../../../../Class/EntVentaProducto';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { EntProductos } from '../../../../Class/EntProductos';
import { EntStation } from '../../../../Class/EntStation';
import { SelectItem } from 'primeng/api';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-listaTodosProductos',
    templateUrl: './listaTodosProductos.component.html',
    styleUrls: ['./listaTodosProductos.component.css']
})
export class ListaTodosProductosComponent implements OnInit {
    stationsAll: EntStation[];
    stationCode: any;
    productos: EntProductos[];
    date3: Date;
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    Venta: EntVentasProductos = new EntVentasProductos();
    cargando = false;
    centroCostos: SelectItem[];
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Editar Productos - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.date3 = new Date();
        this.centroCostos = [{ label: ' SELECCIONE LA EMPRESA  ', value: '', tips: 'Elija el Centro de Costo' }];
    }
    ngOnInit() {
        this.cargando = true;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
        this.getProductos();
        this.GetEmpresas();
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: ['enero ', 'febrero ', 'marzo ', 'abril ', 'mayo ', 'junio', 'julio ', 'agosto ', 'septiembre ', 'octubre ', 'noviembre ', 'diciembre '],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };


    }
    actualizar(producto: EntProductos) {
        this.nominaService.UpdateProd(producto).subscribe();
    }

    GetEmpresas() {
        this.nominaService.GetEmpresas().subscribe(data => {
            this.centroCostos = [];
            data.forEach((elemento: any) => {
                this.centroCostos.push({
                    label: elemento.marca,
                    value: elemento.nit,
                    tips: elemento.nombre
                });
            });
            this.centroCostos.unshift({ label: 'SELECCIONE LA EMPRESA', value: '', tips: 'Elija el Centro de Costo' });
        }, error => {
            console.log(error);
        });
    }
    filterItems(query: any) {
        this.utilService.loader(true);
        this.nominaService.GetProductos(null, query, null).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);

        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }
    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion === id
        ).nombreEstacion;
    }
    getProductos(estacion?: number) {
        this.utilService.loader(true);
        this.nominaService.GetProductos(null, null, null).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }
    GuardarFecha(date3: Date) {
        console.log(this.date3);
    }

}
