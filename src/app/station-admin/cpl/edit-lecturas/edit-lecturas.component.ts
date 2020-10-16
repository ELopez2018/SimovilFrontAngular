import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PrincipalComponent } from '../../../principal/principal.component';

@Component({
    selector: 'app-edit-lecturas',
    templateUrl: './edit-lecturas.component.html',
    styleUrls: ['./edit-lecturas.component.css']
})
export class EditLecturasComponent implements OnInit {
    es;
    stationCode;
    stationsAll: EntStation[];
    stationSel;
    IslaSel = null;
    turnoSel;
    Turnos = [];
    fecha = new Date();
    Islas = [];
    Lecturas;

    constructor(
        private _storageService: StorageService,
        private _NominaService: NominaService,
        public toast: PrincipalComponent
    ) {
        this.GetEstaciones();
     }

    ngOnInit() {
        this.GetDatosCalendario();

    }

    GetDatosCalendario() {
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
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                this.GetTurnos();
                this.GetIslas(this.stationSel.islas);
                console.log(this.stationSel);
            }
        }, error => console.error(error.error.message));
    }
    GetTurnos() {
        const turnos = this.stationSel.turno;
        this.Turnos = [];
        let i = 1;
        while (i <= turnos) {
            this.Turnos.push({
                id: i,
                value: 'Turno ' + i
            });
            i = i + 1;
        }
    }
    GetIslas(datos: Array<any>) {
        if (datos.length== 0 || !datos || datos == undefined) {
            return;
        }
        this.Islas = [{
            id: 0,
            value: 'TODAS '
        }];
        datos.forEach(element => {
            this.Islas.push({
                id: element.ID,
                value: element.DETALLE
            });
        });
    }
    GetArticulos(Articulos: Array<any>) {
    console.log(Articulos);
    }
    GetLecturas(idEstacion: number, Fecha: Date, Turno: Number, Isla: any) {
        if (Isla.id == 0) {
            Isla.id = null;
        }
        let idIsla = null;
        if (Isla !== null) {
            idIsla = Isla.id;
        }
        console.log(idIsla);
        this.Lecturas = [];
        this._NominaService.getCplLecturas(idEstacion, Fecha, Turno, idIsla).subscribe(data => {
            this.Lecturas = data;
            if (this.Lecturas.length <= 0) {
                Swal.fire(
                    'NO EXISTEN LECTURAS',
                    'No existen lecturas para esta fecha',
                    'error'
                );
            }
        }, error => console.log(error.error.message));
    }
    Guardar(Lecturas) {
        this._NominaService.updateCplLect(Lecturas).subscribe(data => {
            // Swal.fire(
            //     'LECTURA ACTUALIZADA',
            //     'La Lectura fue actualizada Correctamente',
            //     'success'
            // );
            this.toast.showMsg('success', 'LECTURA ACTUALIZADA', 'La Lectura fue actualizada Correctamente');

        }, error => {
            // Swal.fire(
            //     'NO SE GUARDÓ',
            //     error.error.message,
            //     'error'
            // );
            this.toast.showMsg('error', 'NO SE GUARDÓ', error.error.message);
        });
    }
    CambioEstacion() {
        this.GetTurnos();
        this.GetIslas(this.stationSel.islas);
    }
}
