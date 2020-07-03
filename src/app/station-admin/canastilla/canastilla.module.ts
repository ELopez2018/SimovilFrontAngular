import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosModule } from './productos/productos.module';
import { HomeCanatillaComponent } from './home-canatilla/home-canatilla.component';
import { PpalCanastillaComponent } from './ppal-canastilla/ppal-canastilla.component';
import { VentasUpdateComponent } from './ventas-update/ventas-update.component';
import { CanastillaComponent } from './canastilla.component';
import { CalendarModule } from 'primeng/calendar';
import { EstadisticasComponent } from './productos/consolidado/estadisticas/estadisticas.component';
import { ConsolidadoComponent } from './productos/consolidado/consolidado.component';
import { DesincorporacionesExitenciaComponent } from './productos/desincorporaciones-exitencia/desincorporaciones-exitencia.component';
import { EditProductosComponent } from './productos/edit-productos/edit-productos.component';
import { IngresoNuevaExistenciaComponent } from './productos/ingreso-nueva-existencia/ingreso-nueva-existencia.component';
import { InventarioMenuComponent } from './productos/inventario-menu/inventario-menu.component';
import { ListProductosComponent } from './productos/list-productos/list-productos.component';
import { ListaClientesComponent } from './productos/lista-clientes/lista-clientes.component';
import { ListaTodosProductosComponent } from './productos/listaTodosProductos/listaTodosProductos.component';
import { PreciosProductosComponent } from './productos/precios-productos/precios-productos.component';
import { ProductoCrearCodigosComponent } from './productos/product-add/producto-crear-codigos/producto-crear-codigos.component';
import { ProductAddComponent } from './productos/product-add/product-add.component';
import { ProductAddMenuComponent } from './productos/product-add-menu/product-add-menu.component';
import { ProductInventarioComponent } from './productos/product-inventario/product-inventario.component';
import { ProductoDstoComponent } from './productos/producto-dsto/producto-dsto.component';
import { ReportesCanastillaComponent } from './productos/reportes-canastilla/reportes-canastilla.component';
import { SolicitudBajaProductosComponent } from './productos/solicitud-baja-productos/solicitud-baja-productos.component';
import { TrasladosComponent } from './productos/traslados/traslados.component';
import { IntrasladosComponent } from './productos/traslados/intraslados/intraslados.component';
import { OuttrasladosComponent } from './productos/traslados/outtraslados/outtraslados.component';
import { ReportSSRSComponent } from '../../common/report-ssrs/report-ssrs.component';
import { ChartModule } from 'primeng/chart';
// import { ModalDialogComponent } from '../../util/modal-dialog/modal-dialog.component';
// import { ReportSSRSComponent } from '../../common/report-ssrs/report-ssrs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    // ProductosModule,
    // CalendarModule,
    // ChartModule,
    // BrowserAnimationsModule,
    // FormsModule,
    // ReactiveFormsModule
  ],
  declarations: [

    //   ModalDialogComponent,
    // ReportSSRSComponent


  ],
  exports: [
    // HomeCanatillaComponent,
    // PpalCanastillaComponent,
    // VentasUpdateComponent

  ]
})
export class CanastillaModule { }
