import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../animations';
import { fadeTransition } from '../../../routerAnimation';
import { NominaService } from '../../../services/nomina.service';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../../../services/storage.service';
import { EntStation } from '../../../Class/EntStation';

@Component({
    selector: 'app-ppal-canastilla',
    templateUrl: './ppal-canastilla.component.html',
    styleUrls: ['./ppal-canastilla.component.css'],
    animations: [fadeAnimation, fadeTransition()]
})
export class PpalCanastillaComponent implements OnInit {
    stationSel;
    stationsAll: EntStation[];
    stationCode: any;
    VerGrafico: boolean;
    Area;
    productos = [];
    constructor(private nominaService: NominaService,
        private title: Title,
        private storageService: StorageService,
    ) {
        this.title.setTitle('Inventario Canastilla - Simovil');
        this.stationCode = this.storageService.getCurrentStation();
    }

    ngOnInit() {
        this.GetEstaciones();
        this.getProductos(this.stationCode);
    }
    GetEstaciones() {
        this.stationCode = this.storageService.getCurrentStation();
        this.Area = this.storageService.getCurrentUserDecode().Area;
        this.nominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);

            }
        }, error => console.error(error.error.message));
    }
    getProductos(estacion?: number) {
        this.nominaService.GetProductosTraslados(estacion).subscribe(data => {
            this.productos = data;
        }, error => {
            console.log(error);

        });
    }
}
