import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasComponent } from './consolidado/estadisticas/estadisticas.component';
import { ConsolidadoComponent } from './consolidado/consolidado.component';
import { DesincorporacionesExitenciaComponent } from './desincorporaciones-exitencia/desincorporaciones-exitencia.component';
import { EditProductosComponent } from './edit-productos/edit-productos.component';
import { IngresoNuevaExistenciaComponent } from './ingreso-nueva-existencia/ingreso-nueva-existencia.component';
import { InventarioMenuComponent } from './inventario-menu/inventario-menu.component';
import { ListProductosComponent } from './list-productos/list-productos.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { ListaTodosProductosComponent } from './listaTodosProductos/listaTodosProductos.component';
import { PreciosProductosComponent } from './precios-productos/precios-productos.component';
import { ProductoCrearCodigosComponent } from './product-add/producto-crear-codigos/producto-crear-codigos.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductAddMenuComponent } from './product-add-menu/product-add-menu.component';
import { ProductInventarioComponent } from './product-inventario/product-inventario.component';
import { ProductoDstoComponent } from './producto-dsto/producto-dsto.component';
import { ReportesCanastillaComponent } from './reportes-canastilla/reportes-canastilla.component';
import { SolicitudBajaProductosComponent } from './solicitud-baja-productos/solicitud-baja-productos.component';
import { TrasladosComponent } from './traslados/traslados.component';
import { IntrasladosComponent } from './traslados/intraslados/intraslados.component';
import { OuttrasladosComponent } from './traslados/outtraslados/outtraslados.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ModalDialogComponent } from '../../../util/modal-dialog/modal-dialog.component';
import { ReportComponent } from '../../../report/report.component';
import { ReportSSRSComponent } from '../../../common/report-ssrs/report-ssrs.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
      EstadisticasComponent,
      ConsolidadoComponent,
      DesincorporacionesExitenciaComponent,
      EditProductosComponent,
      IngresoNuevaExistenciaComponent,
      InventarioMenuComponent,
      ListProductosComponent,
      ListaClientesComponent,
      ListaTodosProductosComponent,
      PreciosProductosComponent,
      ProductoCrearCodigosComponent,
      ProductAddComponent,
      ProductAddMenuComponent,
      ProductInventarioComponent,
      ProductoDstoComponent,
      ReportesCanastillaComponent,
      SolicitudBajaProductosComponent,
      TrasladosComponent,
      IntrasladosComponent,
      OuttrasladosComponent,
      ReportSSRSComponent
    //   ModalDialogComponent
  ],
  exports: [
    ReportSSRSComponent
  ]
})
export class ProductosModule { }
