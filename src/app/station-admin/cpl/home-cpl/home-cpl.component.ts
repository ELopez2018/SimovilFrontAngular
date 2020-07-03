import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-home-cpl',
    templateUrl: './home-cpl.component.html',
    styleUrls: ['./home-cpl.component.css']
})
export class HomeCPLComponent implements OnInit {
    data: any;
    hoy: Date = new Date();
    Fecha: String[] = [];
    Valor: number[] = [];
    stationsAll: EntStation[];
    stationCode: any;
    stationSel;
    nombreEstacion: any;
    es;
    options;
    Rango: number = 8;
    constructor(
        private _ns: NominaService,
        private _StorageServices: StorageService

    ) {
        this.GetDatos();

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
    GetDatos() {
        this.GetEstaciones();


    }

    GetDatosGraficos() {
        this._ns.getCplDatosGraf(this.stationSel.idEstacion, this.hoy, this.hoy, this.Rango).subscribe(datos => {
            this.Fecha = [];
            this.Valor = [];
            this.CambioEstacion();
            // tslint:disable-next-line: forin
            for (const items in datos) {
                this.Fecha.push(this.FormatoFecha(datos[items].FECHA));
                this.Valor.push(datos[items].VALOR);
            }
            this.data = {
                labels: this.Fecha,
                datasets: [
                    {
                        label: 'Ventas',
                        data: this.Valor,
                        backgroundColor: '#42A5F5',
                        fill: true,
                        borderColor: '#4bc0c0',
                        // barPercentage: 0.5,
                        // barThickness: 6,
                        // maxBarThickness: 8,
                        minBarLength: 2
                    }

                ]
            };

            this.options = {
                title: {
                    display: true,
                    text: this.nombreEstacion,
                    fontSize: 16
                },
                legend: {
                    position: 'right'
                }
            };


        }, error => console.log(error.error.message));
    }
    FormatoFecha(fecha: Date): string {
        fecha = new Date(fecha);
        const fechaCorta = (fecha.getDate() ) + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
        const Mes = fecha.getDay() + 1;

        console.log('getDate',fecha.getDate());
        console.log('getDay', fecha.getDay());
        let fechaF;
        switch (Mes) {
            case 1:
                fechaF = 'Lu ' + fechaCorta;
                break;
            case 2:
                fechaF = 'Ma ' + fechaCorta;
                break;
            case 3:
                fechaF = 'Mi ' + fechaCorta;
                break;
            case 4:
                fechaF = 'Ju ' + fechaCorta;
                break;
            case 5:
                fechaF = 'Vi ' + fechaCorta;
                break;
            case 6:
                fechaF = 'Sá ' + fechaCorta;
                break;
            case 7:
                fechaF = 'Do ' + fechaCorta;
                break;
            case 0:
                fechaF = 'Do ' + fechaCorta;
                break;
        }

        return fechaF;
    }
    GetEstaciones() {
        this.stationSel = [];
        this.stationCode = this._StorageServices.getCurrentStation();
        this._ns.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
                this.nombreEstacion = this.stationsAll.find(e => e.idEstacion == this.stationCode).nombreEstacion;
                this.GetDatosGraficos();
            } else {
                this.nombreEstacion = this.stationsAll[0].nombreEstacion;
            }

        }, error => console.error(error.error.message));



    }
    CambioEstacion() {
        this.nombreEstacion = this.stationSel.nombreEstacion;
    }
}
