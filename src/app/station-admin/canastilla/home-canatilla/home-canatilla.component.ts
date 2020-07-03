import { Component, OnInit } from '@angular/core';
import { NominaService } from '../../../services/nomina.service';
import { EntStation } from '../../../Class/EntStation';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-home-canatilla',
    templateUrl: './home-canatilla.component.html',
    styleUrls: ['./home-canatilla.component.css']
})
export class HomeCanatillaComponent implements OnInit {
    data: any;
    hoy: Date = new Date();
    Fecha: String[] = [];
    Valor: number[] = [];
    stationsAll: EntStation[];
    stationCode: any;
    nombreEstacion: any;
    constructor(
        private _ns: NominaService,
        private _StorageServices: StorageService

    ) {
        this.GetDatos();

    }

    ngOnInit() {

    }
    GetDatos() {
        this.GetEstaciones();
        this._ns.GetProductosDatosGrafVentas(this.stationCode, this.hoy, 4).subscribe(datos => {
             // tslint:disable-next-line: forin
            for (const items in datos) {
                this.Fecha.push(this.FormatoFecha(datos[items].FECHA));
                this.Valor.push(datos[items].VALOR);
            }
            this.data = {
                labels: this.Fecha,
                datasets: [
                    {
                        label: this.nombreEstacion,
                        data: this.Valor,
                        fill: true,
                        borderColor: '#4bc0c0'
                    }
                ]
            };

        }, error => console.log(error.error.message));
    }
    FormatoFecha(fecha: Date): string {
        fecha = new Date(fecha);
        const Mes  = fecha.getMonth() + 1 ;
        let fechaF;
        switch ( Mes ) {
            case 1:
                fechaF =  'Enero';
            break;
            case 2:
                fechaF =  'Febrero';
            break;
            case 3:
                fechaF =  'Marzo';
            break;
            case 4:
                fechaF =  'Abril';
            break;
            case 5:
                fechaF =  'Mayo';
            break;
            case 6:
                fechaF =  'Junio';
            break;
            case 7:
                fechaF =  'Julio';
            break;
            case 8:
                fechaF =  'Agosto';
            break;
            case 9:
                fechaF =  'Septiembre';
            break;
            case 10:
                fechaF =  'Octubre';
            break;
            case 11:
                fechaF =  'Noviembre';
            break;
            case 12:
                fechaF =  'Diciembre';
            break;
        }




        // const fechaF = (fecha.getDate() ) + '-' + (fecha.getMonth() + 1) + '-' +  fecha.getFullYear() ;
        return fechaF;
    }
    GetEstaciones() {
        this.stationCode = this._StorageServices.getCurrentStation();
        this._ns.GetStations().subscribe(data => {
            this.stationsAll = data;

            if (this.stationCode) {
                this.nombreEstacion = this.stationsAll.find(e => e.idEstacion == this.stationCode).nombreEstacion;
            }
        }, error => console.error(error.error.message));



    }
}

// his.data = {
//     labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'],
//     datasets: [
//         {
//             label: 'Ventas',
//             data: [2800, 480, 4000, 1900, 8600, 270, 9000, 4500],
//             fill: true,
//             borderColor: '#4bc0c0'
//         }
//     ]
// };
