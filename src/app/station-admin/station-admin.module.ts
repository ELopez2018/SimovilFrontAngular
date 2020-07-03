import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanastillaModule } from './canastilla/canastilla.module';
import { DsCarteraComponent } from './components/ds-cartera/ds-cartera.component';
import { CplModule } from './cpl/cpl.module';
import { StationAdminCalibrationComponent } from './station-admin-calibration/station-admin-calibration.component';
import { StationConsumptionModule } from './station-admin-consumption/station-consumption.module';
import { StationAdminReceivableComponent } from './station-admin-receivable/station-admin-receivable.component';
import { StationAdminSheetDailyModule } from './station-admin-sheet-daily/station-admin-sheet-daily.module';


@NgModule({
    imports: [
        CommonModule,
        CanastillaModule,
        CplModule,
        StationConsumptionModule,
        StationAdminSheetDailyModule
    ],
    declarations: [
        DsCarteraComponent,
        StationAdminCalibrationComponent,
        StationAdminReceivableComponent
    ],

    exports:  [
        StationAdminReceivableComponent
    ]
})
export class StationAdminModule { }
