import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosModule } from './productos/productos.module';
import { HomeCanatillaComponent } from './home-canatilla/home-canatilla.component';
import { PpalCanastillaComponent } from './ppal-canastilla/ppal-canastilla.component';
import { VentasUpdateComponent } from './ventas-update/ventas-update.component';
import { CanastillaComponent } from './canastilla.component';
import { CalendarModule } from 'primeng/calendar';
// import { ModalDialogComponent } from '../../util/modal-dialog/modal-dialog.component';
import { ReportSSRSComponent } from '../../common/report-ssrs/report-ssrs.component';

@NgModule({
  imports: [
    CommonModule,
    ProductosModule,
    CalendarModule
  ],
  declarations: [
      HomeCanatillaComponent,
      PpalCanastillaComponent,
      VentasUpdateComponent,
      CanastillaComponent
    //   ModalDialogComponent,
    // ReportSSRSComponent
  ],
  exports: [
    HomeCanatillaComponent,
    PpalCanastillaComponent,
    VentasUpdateComponent,
    ReportSSRSComponent

  ]
})
export class CanastillaModule { }
