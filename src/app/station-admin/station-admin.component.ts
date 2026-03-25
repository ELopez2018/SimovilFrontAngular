import { CuposConsumidosComponent } from './station-admin-consumption/cupos-consumidos/cupos-consumidos.component';
import { PrincipalComponent } from './../principal/principal.component';
import { DataCupoService } from './../services/data-cupo.service';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../animations';

@Component({
    selector: 'app-station-admin',
    templateUrl: './station-admin.component.html',
    styleUrls: ['./station-admin.component.css'],
    animations: [fadeAnimation],
    standalone: false
})
export class StationAdminComponent implements OnInit {

  constructor(public dataCupoService: DataCupoService) { }

  ngOnInit() {
  }

}
