import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigMangerasComponent } from './config-mangeras/config-mangeras.component';
import { EditLecturasComponent } from './edit-lecturas/edit-lecturas.component';
import { HomeCPLComponent } from './home-cpl/home-cpl.component';
import { IngresoLecturasComponent } from './ingreso-lecturas/ingreso-lecturas.component';
import { ReportLecturasComponent } from './report-lecturas/report-lecturas.component';
import { CplComponent } from './cpl.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CplComponent,
        ConfigMangerasComponent,
        EditLecturasComponent,
        HomeCPLComponent,
        IngresoLecturasComponent,
        ReportLecturasComponent
    ]
})
export class CplModule { }
