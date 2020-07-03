import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { fadeTransition } from '../../routerAnimation';
import { NominaService } from '../../services/nomina.service';
import { StorageService } from '../../services/storage.service';
import { EntStation } from '../../Class/EntStation';

@Component({
    selector: 'app-cpl',
    templateUrl: './cpl.component.html',
    styleUrls: ['./cpl.component.css'],
    animations: [fadeAnimation, fadeTransition()]
})
export class CplComponent implements OnInit {
    stationCode;
    stationsAll: EntStation[];
    stationSel;
    Area: number;
    constructor(
        private _NominaService: NominaService,
        private _storageService: StorageService
    ) { 
        this.Area = this._storageService.getCurrentUserDecode().Area;
    }

    ngOnInit() {
        this.GetEstaciones();
    }

    GetEstaciones() {
        this.stationCode = this._storageService.getCurrentStation();
        this._NominaService.GetStations().subscribe(data => {
            this.stationsAll = data;
            if (this.stationCode) {
                this.stationSel = this.stationsAll.find(e => e.idEstacion == this.stationCode);
            }
        }, error => console.error(error.error.message));
    }
}
