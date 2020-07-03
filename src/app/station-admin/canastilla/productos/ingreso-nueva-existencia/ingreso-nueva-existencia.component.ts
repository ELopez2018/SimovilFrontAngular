import { Component, OnInit } from '@angular/core';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductos } from '../../../../Class/EntProductos';
import { EntProductoInvEstacion } from '../../../../Class/EntProductoInvEstacion';
import { NominaService } from '../../../../services/nomina.service';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { Title } from '@angular/platform-browser';
import { EntCompraProductos } from '../../../../Class/EntCompraProducto';

@Component({
    selector: 'app-ingreso-nueva-existencia',
    templateUrl: './ingreso-nueva-existencia.component.html',
    styleUrls: ['./ingreso-nueva-existencia.component.css']
})
export class IngresoNuevaExistenciaComponent implements OnInit {

    stationsAll: EntStation[];
    stationCode: any;
    productos: EntProductos[];
    fecha: Date;
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    CompraProdutos: EntCompraProductos = new EntCompraProductos;
    cargando = false;
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Ingreso de Productos- Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.fecha = new Date();
    }
    AgregarInventario(forma: EntProductos) {
        // console.log(forma);
        if (forma.CantidadCompra <= 0 || forma.CantidadCompra === null || forma.CantidadCompra === undefined) {
            this.principalComponent.showMsg('warn', 'Cantidad Inválida', 'La Cantidad debe ser mayor a 0');
            return;
        }
        if (forma.PrecioVenta === 0 || forma.PrecioVenta === undefined) {
            this.principalComponent.showMsg('warn', 'Precio de Venta Inválido', 'El Precio de Venta debe ser mayor a 0');
            return;
        }
        if (forma.CantidadCompra === 0 || forma.CantidadCompra === undefined) {
            this.principalComponent.showMsg('warn', 'Precio de Venta Compra', 'El Precio de Compra debe ser mayor a 0');
            return;
        }
        const Porcentaje = ((forma.PrecioVenta - forma.PrecioCompra) / forma.PrecioCompra) * 100;

        if (!forma.Mileniumgas) {
            if (Porcentaje >= 20 && Porcentaje <= 40) {

            } else {
                this.principalComponent.showMsg('warn', 'Utilidad Inválida', 'El margen que esta ingresando es de ' + Porcentaje + '% de utilidad y debe ser entre el 20 y 40%');
                return;
            }
        }
        this.CompraProdutos.FechaCompra = this.fecha;
        this.CompraProdutos.IdEstacion = this.stationCode;
        this.CompraProdutos.IdProducto = forma.id;
        this.CompraProdutos.CantidadCompra = forma.CantidadCompra;
        this.CompraProdutos.PrecioCompra = forma.PrecioCompra;
        this.CompraProdutos.PrecioVenta = forma.PrecioVenta;
        this.CompraProdutos.Documento = forma.detalles;
        // console.log(this.CompraProdutos);
        this.nominaService.InserExistenciaInvEstacion(this.CompraProdutos).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
        }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));
    }

    ngOnInit() {
        this.cargando = true;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
        this.getProductos(this.stationCode);

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

    filterItems(query: any) {
        this.utilService.loader(true);
        this.nominaService.GetProductos(this.stationCode, query, this.fecha).subscribe(data => {
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
        this.nominaService.GetProductos(estacion, null, this.fecha).subscribe(data => {
            this.productos = data;
            // console.log(this.productos);
            this.cargando = false;
            this.utilService.loader(false);
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }

    BorrarProdInve(Id: number, ) {
        this.nominaService.DeleteProductosInvEstacion(Id, this.stationCode).subscribe(data => {
            this.principalComponent.showMsg('success', 'Producto Eliminado', 'El Producto fue eliminado de su Inventario.');
        }, error => this.principalComponent.showMsg('error', 'Error al Borrar', error.error.message));
    }
}
