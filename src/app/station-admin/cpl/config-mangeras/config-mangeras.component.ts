import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { EntCplMangueras } from '../../../Class/EntCplMangueras';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
    selector: 'app-config-mangeras',
    templateUrl: './config-mangeras.component.html',
    styleUrls: ['./config-mangeras.component.css']
})
export class ConfigMangerasComponent implements OnInit {
    stationSel;
    stationCode;
    stationsAll: EntStation[];
    stations;
    mangueras: EntCplMangueras[];
    articulos = [];
    Fecha = new Date();
    USUARIO;
    es = {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: ['enero ', 'febrero ', 'marzo ', 'abril ', 'mayo ', 'junio', 'julio ', 'agosto ', 'septiembre ', 'octubre ', 'noviembre ', 'diciembre '],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Borrar'
    };
    constructor(
        private _storageService: StorageService,
        private _NominaService: NominaService,
    ) { }

    ngOnInit() {
        this.GetEstaciones();
        this.getCplMangueras(this.stationCode);
    }
    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this.USUARIO = this._storageService.getCurrentUserDecode().Usuario;
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            this.stations = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                this.articulos = this.stationSel.articulos;
            }
        }, error => console.error(error.error.message));
    }
    CambiaEstacion() {
        this.articulos = this.stationSel.articulos;
        this.getCplMangueras(this.stationSel.idEstacion);
    }
    getCplMangueras(idEstacion: number) {
        this._NominaService.getCplMangueras(idEstacion).subscribe(data => {
            this.mangueras = data;
        }, error => console.error(error.error.message));
    }

     async CambiarValorArt(Articulo: any) {

        const { value: precio } = await Swal.fire({
            input: 'number',
            inputPlaceholder: 'Ingrese el precio nuevo'
        });

        if (Articulo.VALOR) {
            if (precio) {
                Articulo.VALOR = precio;
            }
        } else {
            if (precio) {
                Articulo.PRECIO = precio;
            }
        }

    }
    GuardarCambios(manguera: EntCplMangueras) {
        if (!manguera) {
            return;
        }
        Swal.fire({
            title: '¿ESTA SEGURO QUE DESEA GUARDAR?',
            text: 'Al Aceptar cambiará solo el precio de las manguera actual, ¿Desea Continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.value) {
                const Datos = {
                    ID: manguera.ID,
                    IDPRECIO: manguera.IDPRECIO,
                    PRECIO: manguera.PRECIO,
                    IDESTACION: this.stationSel.idEstacion,
                    USUARIO: this.USUARIO,
                    COD_ART: manguera.COD_ART
                };
                this._NominaService.updateCplPrecio(Datos).subscribe(data => {
                    Swal.fire(
                        'PRECIO ACTUALIZADO',
                        'La manguera fue actualizada Correctamente',
                        'success'
                    );
                    manguera.UpdPrecio = true;
                }, error => {
                    Swal.fire(
                        'NO SE GUARDÓ',
                        error.error.message,
                        'error'
                    );
                });
            }
        });
    }
    UpdateTodasMangueras(Articulo: any) {
        Swal.fire({
            title: '¿ESTA SEGURO QUE DESEA GUARDAR?',
            text: 'Al Aceptar cambiará todos  los precios de las mangueras que tengan el Articulo, ¿Desea Continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.value) {
                const datos = {
                    idEstacion: Articulo.ID_ESTACION,
                    idArticulo: Articulo.ID_ARTICULO,
                    Precio: Articulo.VALOR
                };
                this._NominaService.UpdateCplPrecioGroup(datos).subscribe(data => {
                    Swal.fire(
                        '¡PRECIOS ACTUALIZADOS!',
                        'Las Mangueras fueron Actualizadas correctamente',
                        'success'
                    );
                    Articulo.CAM_VAL = true;

                }, error => {
                    Swal.fire(
                        'NO SE GUARDÓ',
                        error.error.message,
                        'error'
                    );
                });
            }
        });

    }
}
