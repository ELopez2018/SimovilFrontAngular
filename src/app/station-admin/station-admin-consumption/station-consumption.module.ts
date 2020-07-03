import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationAdminConsumptionComponent } from './station-admin-consumption.component';
import { OtrasVentasAddComponent } from './otras-ventas-add/otras-ventas-add.component';
import { StationConsumptionAddComponent } from './station-consumption-add/station-consumption-add.component';
import { StationConsumptionEditComponent } from './station-consumption-edit/station-consumption-edit.component';
import { StationConsumptionReportsComponent } from './station-consumption-reports/station-consumption-reports.component';
import { StationConsumptionSearchComponent } from './station-consumption-search/station-consumption-search.component';
import { StationConsumptionFormapagoComponent } from './stationConsumptionFormapago/stationConsumptionFormapago.component';


@NgModule({
    imports: [
        CommonModule,

    ],
    declarations: [
        StationAdminConsumptionComponent,
        OtrasVentasAddComponent,
        StationConsumptionAddComponent,
        StationConsumptionEditComponent,
        StationConsumptionReportsComponent,
        StationConsumptionSearchComponent,
        StationConsumptionFormapagoComponent
    ]
})
export class StationConsumptionModule { }
