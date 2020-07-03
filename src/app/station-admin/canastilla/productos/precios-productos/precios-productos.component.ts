import { Component, OnInit } from '@angular/core';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductos } from '../../../../Class/EntProductos';
import { StorageService } from '../../../../services/storage.service';
import { NominaService } from '../../../../services/nomina.service';
import { dateToISOString } from '../../../../util/util-lib';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EntCompraProductos } from '../../../../Class/EntCompraProducto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
    selector: 'app-precios-productos',
    templateUrl: './precios-productos.component.html',
    styleUrls: ['./precios-productos.component.css']
})
export class PreciosProductosComponent implements OnInit {
    stationsAll: EntStation[];
    stationCode: any;
    stationSel;
    productos: EntProductos[];
    Fecha: Date = new Date();
    es;
    Usuario;
    constructor(
        private _storageService: StorageService,
        private _NominaService: NominaService
    ) {

    }

    ngOnInit() {
        this.ConfiguracionCalendario();
        this.GetEstaciones();
        this.getProductos(this.stationCode);
    }
    // OBTENCION Y CARGA DE DATOS
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this.Usuario = this._storageService.getCurrentUserDecode().Usuario;
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
    getProductos(estacion?: number) {
        this.productos = [];
        this._NominaService.GetProductos(estacion, null, this.Fecha).subscribe(data => {
            this.productos = data;
        }, error => {
            console.log(error);
        });
    }
    ConfiguracionCalendario() {
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
    // FUNCIONES
    filterItems(query: any) {
        this._NominaService.GetProductos(this.stationCode, query, this.Fecha).subscribe(data => {
            this.productos = data;
        }, error => {
            console.log(error);
        });
    }


    async CambiarValorArt(Articulo: any, Campo: string, objeto) {
        let Porcentaje;
        let Titulo = 'Ingrese Precio de Costo';
        if (Campo === 'precio') {
            Titulo = 'Ingrese Precio de Venta';
        }

        const { value: precio } = await Swal.fire({
            title: Titulo,
            input: 'number',
            inputPlaceholder: '0,00',

        });
        if (Campo === 'precio') {
            if (precio) {
                if (Articulo.Mileniumgas) {
                    Articulo.precio = precio;
                    objeto.classList.remove('bg-danger');
                    objeto.classList.remove('text-white');
                    return;
                }
                Porcentaje = ((precio - Articulo.PrecioCompra) / Articulo.PrecioCompra);
                if (Porcentaje < 0.2 || Porcentaje > 0.4) {
                    Swal.fire(
                        'LA UTILIDAD ES DE ' + (Porcentaje * 100) + '%',
                        'La utilidad permitida esta entre el 20 y el 40%',
                        'error'
                    );
                    objeto.classList.add('bg-danger');
                    objeto.classList.add('text-white');
                } else {
                    Articulo.precio = precio;
                    objeto.classList.remove('bg-danger');
                    objeto.classList.remove('text-white');
                }
            }
        } else {
            if (precio) {
                Articulo.PrecioCompra = precio;
            }
        }
    }
    AgregarInventario(Precio: EntProductos) {
        if (Precio.PrecioCompra <= 0 || Precio.PrecioCompra === null || Precio.PrecioCompra === undefined) {
            this.MostrarModal('PRECIO DE COMPRA EN O', ' EL precio no puede ser cero', 'error');
            return;
        }
        if (Precio.precio <= 0 || Precio.precio === undefined) {
            this.MostrarModal('PRECIO DE VENTA EN O', ' EL precio no puede ser cero', 'error');
            return;
        }
        const Porcentaje = ((Precio.precio - Precio.PrecioCompra) / Precio.PrecioCompra) * 100;

        if (!Precio.Mileniumgas) {
            if (Porcentaje >= 20 && Porcentaje <= 40) {

            } else {
                this.MostrarModal('Utilidad Inválida', 'El margen que esta ingresando es de ' + Porcentaje + '% de utilidad y debe ser entre el 20 y 40%', 'error');
                return;
            }
        }
        Swal.fire({
            title: '¿ESTA SEGURO?',
            text: 'Al Aceptar cambiara los Precios a Partir de la fecha actual, ¿Desea Continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.value) {
                let Datos: EntCompraProductos;
                Datos = {
                    FechaCompra: this.Fecha,
                    IdEstacion: this.stationSel.idEstacion,
                    IdProducto: Precio.id,
                    CantidadCompra: 0,
                    PrecioCompra: Precio.PrecioCompra,
                    PrecioVenta: Precio.precio,
                    Documento: 'CAMBIO DE PRECIOS POR ' + this.Usuario
                };
                this._NominaService.InserExistenciaInvEstacion(Datos).subscribe(data => {
                    this.MostrarModal('Éxito', 'Precios guardados correctamente.', 'success');
                }, error => this.MostrarModal('Advertencia', error.error.message, 'error'));
            } else {
                return;
            }

        });

    }
    MostrarModal(Titulo: String, Mensaje: String, Icono: string) {
        Swal.fire(
            Titulo,
            Mensaje,
            Icono
        );
    }
}
