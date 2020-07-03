import { Component, OnInit } from '@angular/core';
import { EntStation } from '../../../../Class/EntStation';
import { EntProductos } from '../../../../Class/EntProductos';
import { EntProductoInvEstacion } from '../../../../Class/EntProductoInvEstacion';
import { NominaService } from '../../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../../services/storage.service';
import { PrincipalComponent } from '../../../../principal/principal.component';
import { UtilService } from '../../../../services/util.service';
import { SolicitudBajaProductosComponent } from '../solicitud-baja-productos/solicitud-baja-productos.component';
import { EntProductosSoliciBaja } from '../../../../Class/EntProductosSoliciBaja';

@Component({
    selector: 'app-desincorporaciones-exitencia',
    templateUrl: './desincorporaciones-exitencia.component.html',
    styleUrls: ['./desincorporaciones-exitencia.component.css']
})
export class DesincorporacionesExitenciaComponent implements OnInit {
    stationsAll: EntStation[];
    Solicitud: EntProductosSoliciBaja;
    stationCode: any;
    productos: EntProductos[];
    date3: Date;
    es: any;
    ventas: any[] = [];
    IdProducto: any[] = [];
    InventarioEstacion: EntProductoInvEstacion = new EntProductoInvEstacion();
    cargando = false;
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
        private principalComponent: PrincipalComponent,
        private utilService: UtilService
    ) {
        this.title.setTitle('Baja de Productos- Simovil');
        this.stationCode = this.storageService.getCurrentStation();
        this.date3 = new Date();
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
    ngOnInit() {
        this.cargando = true;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
        }, error => console.log(error.error.message));
        this.getProductos(this.stationCode);
    }
    getNameStation(id: number) {
        if (this.stationsAll == null || id == null) {
            return;
        }
        return this.stationsAll.find(
            e => e.idEstacion === id
        ).nombreEstacion;
    }
    getProductos(estacion?: number) {
        this.utilService.loader(true);
        this.nominaService.GetProductos(estacion, null, this.date3).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);
        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }

    BorrarProdInve(Solicitud: EntProductosSoliciBaja) {
        this.Solicitud = Solicitud;
        this.Solicitud.idEstacion = this.stationCode;
        this.Solicitud.Fecha = this.date3;
        console.log(this.Solicitud);
        this.nominaService.InsertSolicitudBajaProductos(this.Solicitud).subscribe(data => {
            this.principalComponent.showMsg('success', 'Éxito', 'Solicitud para dar de Baja a Productos fue Registrada.');
        }, error => this.principalComponent.showMsg('error', 'Advertencia', error.error.message));
        console.log(this.InventarioEstacion);
    }

    filterItems(query: any) {
        this.utilService.loader(true);
        this.nominaService.GetProductos(this.stationCode, query, this.date3).subscribe(data => {
            this.productos = data;
            this.cargando = false;
            this.utilService.loader(false);

        }, error => {
            console.log(error);
            this.utilService.loader(false);
        });
    }

}
