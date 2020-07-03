import { Component, OnInit } from '@angular/core';
import { EntProductosSoliciBaja } from '../../../../Class/EntProductosSoliciBaja';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { EntStation } from '../../../../Class/EntStation';

@Component({
    selector: 'app-solicitud-baja-productos',
    templateUrl: './solicitud-baja-productos.component.html',
    styleUrls: ['./solicitud-baja-productos.component.css']
})
export class SolicitudBajaProductosComponent implements OnInit {
    Solicitudes: EntProductosSoliciBaja[] = [];
    stationsAll: EntStation[];
    stationCode: any;
    Area: number;
    date3: Date;
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    // Venta:  EntVentasProductos = new EntVentasProductos();
    cargando = false;
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Solicitudes de baja de Productos - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.date3 = new Date();
    }
    ngOnInit() {
        this.cargando = true;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
        this.GetSolicitudesBajaProductos(this.stationCode, null);

        this.GetArea();
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
    GetArea() {
        this.Area = this.storageService.getCurrentUserDecode().Area;
    }
    //   filterItems(query: any) {
    //     this.utilService.loader(true);
    //     this.nominaService.GetProductos(null, query).subscribe(data => {
    //       this.productos = data;
    //       this.cargando = false;
    //       this.utilService.loader(false);

    //     }, error => {
    //       console.log(error);
    //       this.utilService.loader(false);
    //     });
    // }


    GetSolicitudesBajaProductos(Idestacion?: number, Estado?: boolean): void {
        this.cargando = true;
        this.nominaService.GetSolicitudes(Idestacion, Estado).subscribe(data => {
            this.Solicitudes = data;
            console.log(data);
            this.cargando = false;
        }, error => console.log(error));
    }
    CambiarConta(Solicitud: EntProductosSoliciBaja) {
        if (!Solicitud.Contabilidad) {
            this.utilService.confirm('¿Está seguro de Aprobar la Solicitud?', (result: any) => {
                if (result) {
                    Solicitud.Contabilidad = !Solicitud.Contabilidad;
                    this.nominaService.UpdateSolicitudBajaProductos(Solicitud).subscribe();
                }
            });
        }
    }
    CambiarAudito(Solicitud: EntProductosSoliciBaja) {
        if (!Solicitud.Auditoria) {
            this.utilService.confirm('¿Está seguro de Aprobar la Solicitud?', (result: any) => {
                if (result) {
                    Solicitud.Auditoria = !Solicitud.Auditoria;
                    this.nominaService.UpdateSolicitudBajaProductos(Solicitud).subscribe();
                }
            });
        }
    }
    CambiarOPera(Solicitud: EntProductosSoliciBaja) {
        if (!Solicitud.Operaciones) {
            this.utilService.confirm('¿Está seguro de Aprobar la Solicitud?', (result: any) => {
                if (result) {
                    Solicitud.Operaciones = !Solicitud.Operaciones;
                    this.nominaService.UpdateSolicitudBajaProductos(Solicitud).subscribe();
                }
            });
        };
    }
    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion === id
        ).nombreEstacion;
    }


}
