import { Component, OnInit } from '@angular/core';
import { EntVentasProductos } from '../../../../Class/EntVentaProducto';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { EntProductos } from '../../../../Class/EntProductos';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductoInvEstacion } from '../../../../Class/EntProductoInvEstacion';
import { GuardsCheckStart } from '@angular/router';

@Component({
    selector: 'app-product-inventario',
    templateUrl: './product-inventario.component.html',
    styleUrls: ['./product-inventario.component.css']
})
export class ProductInventarioComponent implements OnInit {

    stationsAll: EntStation[];
    stationCode: any;
    productos: EntProductos[];
    fecha: Date;
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    InventarioEstacion: EntProductoInvEstacion = new EntProductoInvEstacion();
    cargando = false;
    bloqueado = true;
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Inventario Estacion- Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.fecha = new Date();
    }
    AgregarInventario(forma: EntProductos) {
        console.log(forma);
        const Porcentaje = ((forma.PrecioVenta - forma.PrecioCompra) / forma.PrecioCompra) * 100;
        if (forma.Mileniumgas) {
            this.Guardar(forma);
        } else {
            if (Porcentaje >= 20 && Porcentaje <= 40) {
                this.Guardar(forma);
            } else {
                this.principalComponent.showMsg('error', 'Advertencia', 'El margen de utilidad  es del' + Porcentaje + '% y debe ser del 20 al 40%');
            }
        }
    }

    Guardar(forma: EntProductos) {
        this.InventarioEstacion.fecha = this.fecha;
        this.InventarioEstacion.IdEstacion = this.stationCode;
        this.InventarioEstacion.idProductos = forma.id;
        this.InventarioEstacion.ExistenciaInicial = forma.existencia;
        this.InventarioEstacion.PrecioCompra = forma.PrecioCompra;
        this.InventarioEstacion.Precio = forma.PrecioVenta;
        this.nominaService.InserProductosInvEstacion(this.InventarioEstacion).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'Se guardó correctamente.');
        }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));
    }

    ngOnInit() {
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


        this.cargando = true;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
        this.getProductos(this.stationCode);


    }
    Tecla(formulario: any) {
        console.log(formulario);
    }

    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion === id
        ).nombreEstacion;
    }
    filterItems(query: any) {
        this.utilService.loader(true);
        this.nominaService.GetProductostostation(this.stationCode, query).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);

        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }

    getProductos(estacion?: number) {
        this.utilService.loader(true);
        this.nominaService.GetProductostostation(this.stationCode, null).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }
    BorrarProdInve(Id: number, ) {
        this.nominaService.DeleteProductosInvEstacion(Id, this.stationCode).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'El Producto fue eliminado del Inventario.');
        }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));
        console.log(this.InventarioEstacion);
    }
    Evaluar(forma: EntProductos) {
        const Porcentaje = ((forma.PrecioVenta - forma.PrecioCompra) / forma.PrecioCompra) * 100;
        if (!forma.Mileniumgas) {
            if (Porcentaje >= 20 && Porcentaje <= 40) {
                this.bloqueado = false;
            } else {
                this.bloqueado = true;

            }
        }

    }
}
