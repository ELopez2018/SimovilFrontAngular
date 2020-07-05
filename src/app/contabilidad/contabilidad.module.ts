import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceComponent } from './advance/advance.component';
import { AdvanceSearchComponent } from './advance/advance-search/advance-search.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StationAdminModule } from '../station-admin/station-admin.module';
import { AdvanceHistoryComponent } from './advance/advance-history/advance-history.component';
import { ContabilidadRoutes } from './contabilidad.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    StationAdminModule,
    ContabilidadRoutes
  ],
  declarations: [
    AdvanceComponent,
    AdvanceSearchComponent,
    AdvanceHistoryComponent

  ],
  exports: [
    AdvanceHistoryComponent
  ]
})
export class ContabilidadModule { }
