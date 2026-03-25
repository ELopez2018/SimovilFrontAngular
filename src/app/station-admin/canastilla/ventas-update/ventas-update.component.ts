import { Component, OnInit } from '@angular/core';
import { EntProductos } from '../../../Class/EntProductos';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../services/storage.service';
import { EntVentasEdit } from '../../../Class/EntVentasEdit';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UtilService } from '../../../services/util.service';

import { EntClient } from '../../../Class/EntClient';


@Component({
    selector: 'app-ventas-update',
    templateUrl: './ventas-update.component.html',
    styleUrls: ['./ventas-update.component.css'],
    standalone: false
})
export class VentasUpdateComponent implements OnInit {

    es;
    stationsAll: EntStation[];
    stationCode: any;
    stationSel;
    productos: EntVentasEdit[] = [];
    Fecha: Date = new Date();

    prodBefore = [];
    productosAcredito = [];
    productosFacturado = [];
    listClientCred = false;
    listClientFacturado = false;

    constructor(private nominaService: NominaService,
        private title: Title,
        private utilService: UtilService,
        private storageService: StorageService,
    ) { }

    ngOnInit() {
        this.GetEstaciones();
        this.DatosBasicos();
    }
    DatosBasicos() {
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
    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }

    BuscarFactura(idEstacion: number, Fecha: Date) {
        this.nominaService.GetVentasEdit(idEstacion, Fecha).subscribe(data => {
            if (data.length <= 0) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    title: 'No hay registros',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            this.productos = data;
            console.log(JSON.stringify(this.productos))
        }, error => {
            console.log(error);
        });

    }

    GuardarCambios(producto, PVP, COSTO, Cant, icono, icono1, icono2) {
        const Porcentaje = ((producto.PrecioV - producto.PrecioCompra) / producto.PrecioCompra);
        if (Porcentaje < 0.2 || Porcentaje > 0.4) {
            Swal.fire(
                'LA UTILIDAD ES DE ' + (Porcentaje * 100) + '%',
                'La utilidad permitida esta entre el 20 y el 40%',
                'warning'
            );
            PVP.classList.add('bg-danger');
            PVP.classList.add('text-white');
            COSTO.classList.add('bg-danger');
            COSTO.classList.add('text-white');
            // return;
        } else {
            PVP.classList.remove('bg-danger');
            PVP.classList.remove('text-white');
            COSTO.classList.remove('bg-danger');
            COSTO.classList.remove('text-white');
        }
        this.nominaService.UpdateSalesProd(producto).subscribe(datos => {
            console.log(JSON.stringify(producto));
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'ACTUALIZADO',
                showConfirmButton: false,
                timer: 1500
            });
            console.log(datos);
            COSTO.classList.add('border-primary');
            PVP.classList.add('border-primary');
            Cant.classList.add('border-primary');
        }, error => {
            console.log(error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'SE PRESENTARON ERRORES',
                showConfirmButton: false,
                timer: 1500
            });
        });
    }

    Borrar(idVenta: number) {
        Swal.fire({
            title: '<strong>BORRAR VENTA</strong>',
            showClass: {
                popup: 'animated zoomIn '
            },
            hideClass: {
                popup: 'animated zoomOut faster'
            },
            icon: 'question',
            html:
                'Esta a punto de Borrar una Venta <br>' +
                '<strong>¿Desea continuar?</strong> ',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Sí',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"> No</i>',
            cancelButtonColor: '#d33',
            cancelButtonAriaLabel: 'Thumbs down'
        })
            .then((result) => {
                if (result.value) {
                    this.nominaService.DeleteVenta(idVenta).subscribe(resp => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'info',
                            title: 'BORRADO',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }, err => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'NO SE PUDO BORRAR',
                            showConfirmButton: false,
                            html:
                                'Surgieron los siguientes errores:' +
                                '<strong>' + err + '</strong> ',
                            timer: 1500
                        });
                    });
                }
            })
    }

    Acredito(idProductoV: number, idVenta: number, idEstacionV: number, FechaV: Date,
        ventasV, PrecioCompra, PrecioV, cantidadFacturado: number, productoRow, producto) {

        if (producto.credito == true || producto.facturado == true) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'YA ESTA FACTURADO',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if ((ventasV - cantidadFacturado) < 0) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Cantidad negativa',
                text: 'la cantidad facturada no puede superar la cantidad de la venta',
                showConfirmButton: false,
                timer: 4500
            });
            return;
        }

        if (this.productosAcredito.findIndex(array => array.idVenta === idVenta) < 0
            && this.productosFacturado.findIndex(array => array.idVenta === idVenta) < 0) {
            this.utilService.confirm('¿Desea venderlo a Crédito? ', (res) => {
                if (res) {
                    this.listClientCred = true;
                    this.productosAcredito.push({
                        idProductoV, idVenta, idEstacionV, FechaV, ventasV, PrecioCompra, PrecioV,
                        "codCliente": null, "aCredito": 1, "facturado": null, "cantidadFacturado": Number(cantidadFacturado)
                    })
                    productoRow.classList.add('bg-primary');
                    productoRow.classList.add('text-white');
                }
            });
        }

        if (this.productosAcredito.findIndex(array => array.idVenta === idVenta) >= 0
            || this.productosFacturado.findIndex(array => array.idVenta === idVenta) >= 0) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'YA ESTA FACTURADO',
                showConfirmButton: false,
                timer: 1500
            });
        }
        console.log("aCredito: " + JSON.stringify(this.productosAcredito));
        console.log(cantidadFacturado)

    }

    pFacturado(idProductoV: number, idVenta: number, idEstacionV: number, FechaV: Date,
        ventasV, PrecioCompra, PrecioV, cantidadFacturado: number, productoRow,producto) {

        if (producto.credito == true || producto.facturado == true) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'YA ESTA FACTURADO',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if ((ventasV - cantidadFacturado) < 0) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Cantidad negativa',
                text: 'la cantidad facturada no puede superar la cantidad de la venta',
                showConfirmButton: false,
                timer: 4500
            });
            return;
        }

        if (this.productosAcredito.findIndex(array => array.idVenta === idVenta) < 0
            && this.productosFacturado.findIndex(array => array.idVenta === idVenta) < 0) {
            this.utilService.confirm('¿Desea facturar el producto ? ', (res) => {
                if (res) {
                    this.listClientFacturado = true;
                    this.productosFacturado.push({
                        idProductoV, idVenta, idEstacionV, FechaV, ventasV, PrecioCompra, PrecioV,
                        "codCliente": null, "aCredito": null, "facturado": 1, "cantidadFacturado": Number(cantidadFacturado)
                    })
                    productoRow.classList.add('bg-success');
                    productoRow.classList.add('text-white');
                }
            });
        }

        if (this.productosAcredito.findIndex(array => array.idVenta === idVenta) >= 0
            || this.productosFacturado.findIndex(array => array.idVenta === idVenta) >= 0) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'YA ESTA FACTURADO',
                showConfirmButton: false,
                timer: 1500
            });
        }
        console.log(JSON.stringify(this.productosFacturado));
    }

    clienteElegido(Cliente: EntClient) {
        this.listClientCred = false;
        this.productosAcredito[this.productosAcredito.length - 1].codCliente = Cliente.codCliente
        console.log(JSON.stringify(this.productosAcredito[this.productosAcredito.length - 1].codCliente))
    }

    clienteSeleccionado(Cliente: EntClient) {
        this.listClientFacturado = false;
        this.productosFacturado[this.productosFacturado.length - 1].codCliente = Cliente.codCliente
        console.log(JSON.stringify(this.productosFacturado[this.productosFacturado.length - 1].codCliente))
    }

    GuardarCambios2(Producto, productoRow) {

        if (Producto.credito == true || Producto.facturado == true) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'YA ESTA FACTURADO',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (this.productosAcredito.findIndex(array => array.idVenta === Producto.idVenta) < 0
            && this.productosFacturado.findIndex(array => array.idVenta === Producto.idVenta) < 0) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'PRODUCTO NO FACTURADO',
                text: 'Por favor seleccionar modo de factura: CREDITO ó FACTURADO',
                showConfirmButton: false,
                timer: 4000
            });
            return;
        }
        /* productoRow.classList.contains('bg-primary') */

        Producto = this.productosAcredito[
            this.productosAcredito.findIndex(p => p.idVenta === Producto.idVenta)
        ]

        if (this.productosAcredito.findIndex(array => array.idVenta === Producto.idVenta) >= 0
            || this.productosFacturado.findIndex(array => array.idVenta === Producto.idVenta) >= 0) {

            this.nominaService.UpdateSalesProd(Producto).subscribe(datos => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'ACTUALIZADO',
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(datos);
                this.limpiar(this.productosAcredito[
                    this.productosAcredito.findIndex(p => p.idVenta === Producto.idVenta)
                ].idVenta, productoRow)
                this.BuscarFactura(this.stationSel.idEstacion, this.Fecha)
            }, error => {
                console.log(error);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'SE PRESENTARON ERRORES',
                    showConfirmButton: false,
                    timer: 1500
                });
            });

        }

    }


    limpiar(idVenta: number, productoRow) {
        console.log(this.productosAcredito)

        if (this.productosAcredito.findIndex(array => array.idVenta === idVenta) >= 0) {
            this.productosAcredito.splice(this.productosAcredito.findIndex(busca => busca.idVenta === idVenta), 1)
            productoRow.classList.remove('bg-primary');
            productoRow.classList.remove('text-white');
        }

        if (this.productosFacturado.findIndex(array => array.idVenta === idVenta) >= 0) {
            this.productosFacturado.splice(this.productosFacturado.findIndex(busca => busca.idVenta === idVenta), 1)
            productoRow.classList.remove('bg-success');
            productoRow.classList.remove('text-white');
        }

        console.log(this.productosAcredito)
    }
}

function getNameStation(id: any, number: any) {
    throw new Error('Function not implemented.');
}

function id(id: any, number: any) {
    throw new Error('Function not implemented.');
}
// buscar objeto en array
/* const array = [
    {"idProducto":25,"idVenta":74435,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"},
    {"idProducto":222,"idVenta":74436,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"},
    {"idProducto":145,"idVenta":74437,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"},
    {"idProducto":38,"idVenta":74438,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"},
    {"idProducto":40,"idVenta":74439,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"},
    {"idProducto":126,"idVenta":74440,"idEstacion":91,"Fecha":"2021-09-13T00:00:00.000Z"}
  ];
  //console.log(array.some(idVenta => idVenta.idVenta === 744330));

  const array2 = [
   {"value": "Pacific/Niue", "name": "(GMT-11:00) Niue"},
   {"value": "Pacific/Pago_Pago", "name": "(GMT-11:00) Pago Pago"},
   {"value": "Pacific/Honolulu", "name": "(GMT-10:00) Hawaii Time"},
   {"value": "Pacific/Rarotonga", "name": "(GMT-10:00) Rarotonga"},
   {"value": "Pacific/Tahiti", "name": "(GMT-10:00) Tahiti"},
   {"value": "Pacific/Marquesas", "name": "(GMT-09:30) Marquesas"},
   {"value": "America/Anchorage", "name": "(GMT-09:00) Alaska Time"},
   {"value": "Pacific/Gambier", "name": "(GMT-09:00) Gambier"},
   {"value": "America/Los_Angeles", "name": "(GMT-08:00) Pacific Time"},
   {"value": "America/Tijuana", "name": "(GMT-08:00) Pacific Time -  Tijuana"},
   {"value": "America/Vancouver", "name": "(GMT-08:00) Pacific Time - Vancouver"},
  ];

  console.log(array2.findIndex( s => s.value === "Pacific/Pago_Pago")) */