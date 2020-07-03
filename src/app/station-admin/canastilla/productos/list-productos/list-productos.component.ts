import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { delay } from 'rxjs/operators';
import { interval } from 'rxjs';
import { EntVentasProductos } from '../../../../Class/EntVentaProducto';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductos } from '../../../../Class/EntProductos';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';



@Component({
    selector: 'app-list-productos',
    templateUrl: './list-productos.component.html',
    styleUrls: ['./list-productos.component.css']
})
export class ListProductosComponent implements OnInit {
    @Input() date3: Date;
    @Input() msjTrasla: string;
    @Input() stationCode: any;
    @Output() submiter = new EventEmitter<EntProductos>();

    stationsAll: EntStation[];
    stationSel;
    productos: EntProductos[];
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    Venta: EntVentasProductos = new EntVentasProductos();
    cargando = false;
    VentaRegistrada = false;

    // CONSTRUCTOR  //////////////
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Productos - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.date3 = new Date();
        // console.log('constructor', this.stationCode);
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
    }
    // ngOnInit////////////////////////////////////
    ngOnInit() {
        // console.log('ngOnInit', this.stationCode);
        this.cargando = true;
        this.getProductos(this.stationCode, null, this.date3);
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
////////////////// FUNCIONES /////////////////////
    GuardarVenta(forma: any, Dia: Date) {
        let suma: number;
        suma = 0;
        let exitenciamayor: string = '';
        // tslint:disable-next-line: forin
        for (const item in forma) {

            if (forma[item].ventas > forma[item].existencia) {
                exitenciamayor += forma[item].descripcion + '; ';
            }

            if (forma[item].ventas > 0) {
                suma++;
            }
        }
        if (exitenciamayor !== '') {
            this.principalComponent.showMsg('warn', 'Advertencia', 'No hay suficiente existencia de los siguientes productos: \n' + exitenciamayor);
            return;
        }
        if (suma <= 0) {
            this.principalComponent.showMsg('warn', 'Advertencia', 'No ha ingresado ningun valor a guardar');
            return;
        }

        this.utilService.confirm('¿Esta seguro que desea guardar?, Recuerde que una vez guardada la información, NO PODRÁ MODIFICARLA', res => {
            if (res) {
                for (const item in forma) {
                    if (forma[item].ventas) {
                        this.Venta.FechaV = Dia;
                        this.Venta.IdEstacionV = this.stationCode;
                        this.Venta.idProductoV = forma[item].id;
                        this.Venta.ventasV = forma[item].ventas;
                        this.Venta.PrecioV = forma[item].precio;
                        this.nominaService.InserVentas(this.Venta).subscribe(data => {
                            this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
                            this.BuscarVenta();
                        }, error => {
                            this.principalComponent.showMsg('error', error.error.message, forma[item].descripcion);
                        });
                    }
                }
            }
        });
        //  if (Errores === '') {
        //     this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
        //     this.getProductos(this.stationCode);
        // } else {
        //     console.log('error', Errores);
        //     this.principalComponent.showMsg('error', 'Advertencia', 'Hubo errores al guardar ' + Errores);
        // }
        //  console.log('\nfuera ');
        //  if (Errores === '') {
        //     this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
        //     this.getProductos(this.stationCode);
        // } else {
        //     console.log('error', Errores);
        //     this.principalComponent.showMsg('error', 'Advertencia', 'Hubo errores al guardar ' + Errores);
        // }
        //   this.Venta.FechaV = Dia;
        //   this.Venta.IdEstacionV = this.stationCode;
        //   this.Venta.idProductoV = forma.id;
        //   this.Venta.ventasV = forma.ventas;
        //   this.Venta.PrecioV = forma.PrecioVenta;
        //   console.log(this.Venta);
        //   this.nominaService.InserVentas(this.Venta).subscribe (data => {
        //     this.principalComponent.showMsg('success', 'Éxito', 'Se Guardo correctamente.');
        //   }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));

    }


    EnviarProducto(Producto: EntProductos) {
        console.log('EnviarProducto', Producto);
        this.submiter.emit(Producto);
        this.productos = [];
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
        // console.log('get productos', this.stationCode, query, this.date3);
        this.nominaService.GetProductos(this.stationCode, query, this.date3).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);

        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }


    getProductos(estacion?: number, query?: string, fecha?: Date) {
        // console.log('get productos', estacion, query, fecha);
        this.productos = [];
        if (this.VentaRegistrada) {
            return;
        }
        this.utilService.loader(true);
        this.nominaService.GetProductos(estacion, query, fecha, null).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }
    BuscarVenta() {
        this.productos = [];
        this.ComprobarSiHayVentas(this.stationCode, this.date3);
    }
    ComprobarSiHayVentas(idestacion: number, fecha: Date) {
        this.nominaService.GetVentastoday(idestacion, fecha).subscribe(data => {
            if (data[0].repuesta === 'true') {
                this.VentaRegistrada = true;
                this.getProductos(this.stationCode);
            } else {
                this.VentaRegistrada = false;
                this.getProductos(this.stationCode);
            }
        }, error => {
            console.log(error);
        });
    }

    Resetear() {
        this.getProductos(this.stationCode);
    }
}
