import { Component, OnInit } from '@angular/core';
import { EntProductos } from '../../../Class/EntProductos';
import { EntStation } from '../../../Class/EntStation';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../services/storage.service';
import { EntVentasEdit } from '../../../Class/EntVentasEdit';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-ventas-update',
    templateUrl: './ventas-update.component.html',
    styleUrls: ['./ventas-update.component.css']
})
export class VentasUpdateComponent implements OnInit {
    es;
    stationsAll: EntStation[];
    stationCode: any;
    stationSel;
    productos: EntVentasEdit[] = [];
    Fecha: Date = new Date();
    constructor(private nominaService: NominaService,
        private title: Title,
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
                this.nominaService.DeleteVenta(idVenta).subscribe( resp =>{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'info',
                        title: 'BORRADO',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }, err =>{
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
}
