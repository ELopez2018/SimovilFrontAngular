import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { NominaService } from '../../../../services/nomina.service';
import { EntProductos } from '../../../../Class/EntProductos';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-producto-dsto',
    templateUrl: './producto-dsto.component.html',
    styleUrls: ['./producto-dsto.component.css']
})
export class ProductoDstoComponent implements OnInit {
    @Input() Producto: EntProductos;
    @Input() Obj: any;
    @Input() Fecha = new Date();
    @Output() Salir: EventEmitter<any> = new EventEmitter;
    @Output() ObjetoEE: EventEmitter<any> = new EventEmitter;
    es;
    stationCode;
    stationsAll;
    stationSel;
    articulos;
    Productos;
    constructor(
        private _storageService: StorageService,
        private _NominaService: NominaService
    ) {

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
        this.GetEstaciones();
    }

    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                this.articulos = this.stationSel.articulos;
            }
        }, error => console.error(error.error.message));
    }
    GuardarDescuento(datos: any) {
        console.log(datos);
        const Descuento = {
            idEstacion: datos.idEstacion,
            idProducto: datos.id,
            cantidad: datos.cantidad,
            precio: datos.precio,
            descuento: datos.descuento,
            detalles: datos.detalles,
            fecha: datos.fecha
        };
        console.log(Descuento);
        Swal.fire({
            title: 'GUARDAR',
            text: '¿Desea aplicar el Descuento?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {
            this._NominaService.InsertDescuento(Descuento).subscribe(res => {
                if (result.value) {
                    Swal.fire(
                        'EXITO',
                        'El descuento fué registrado',
                        'success'
                    );
                    // this.Salir.emit(datos);
                    this.ObjetoEE.emit(this.Obj);
                }
            }, error => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'NO SE PUDO REGISTRAR',
                    html:
                        `No se pudo registrar debido al siguinte error: <br>` +
                        `<strong>${error.error.message}</strong> `,
                    showConfirmButton: true
                });
            });

        });
    }

}
