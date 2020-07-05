import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanastillaModule } from './canastilla/canastilla.module';
import { DsCarteraComponent } from './components/ds-cartera/ds-cartera.component';
import { CplModule } from './cpl/cpl.module';
import { StationAdminCalibrationComponent } from './station-admin-calibration/station-admin-calibration.component';
import { StationConsumptionModule } from './station-admin-consumption/station-consumption.module';
import { StationAdminReceivableComponent } from './station-admin-receivable/station-admin-receivable.component';
import { StationAdminSheetDailyModule } from './station-admin-sheet-daily/station-admin-sheet-daily.module';
import { ReportSSRSComponent } from '../common/report-ssrs/report-ssrs.component';
import { EstadisticasComponent } from './canastilla/productos/consolidado/estadisticas/estadisticas.component';
import { ConsolidadoComponent } from './canastilla/productos/consolidado/consolidado.component';
import { DesincorporacionesExitenciaComponent } from './canastilla/productos/desincorporaciones-exitencia/desincorporaciones-exitencia.component';
import { EditProductosComponent } from './canastilla/productos/edit-productos/edit-productos.component';
import { IngresoNuevaExistenciaComponent } from './canastilla/productos/ingreso-nueva-existencia/ingreso-nueva-existencia.component';
import { InventarioMenuComponent } from './canastilla/productos/inventario-menu/inventario-menu.component';
import { ListProductosComponent } from './canastilla/productos/list-productos/list-productos.component';
import { ListaClientesComponent } from './canastilla/productos/lista-clientes/lista-clientes.component';
import { ListaTodosProductosComponent } from './canastilla/productos/listaTodosProductos/listaTodosProductos.component';
import { PreciosProductosComponent } from './canastilla/productos/precios-productos/precios-productos.component';
import { ProductoCrearCodigosComponent } from './canastilla/productos/product-add/producto-crear-codigos/producto-crear-codigos.component';
import { ProductAddComponent } from './canastilla/productos/product-add/product-add.component';
import { ProductAddMenuComponent } from './canastilla/productos/product-add-menu/product-add-menu.component';
import { ProductInventarioComponent } from './canastilla/productos/product-inventario/product-inventario.component';
import { ProductoDstoComponent } from './canastilla/productos/producto-dsto/producto-dsto.component';
import { ReportesCanastillaComponent } from './canastilla/productos/reportes-canastilla/reportes-canastilla.component';
import { SolicitudBajaProductosComponent } from './canastilla/productos/solicitud-baja-productos/solicitud-baja-productos.component';
import { TrasladosComponent } from './canastilla/productos/traslados/traslados.component';
import { IntrasladosComponent } from './canastilla/productos/traslados/intraslados/intraslados.component';
import { OuttrasladosComponent } from './canastilla/productos/traslados/outtraslados/outtraslados.component';
import { HomeCanatillaComponent } from './canastilla/home-canatilla/home-canatilla.component';
import { PpalCanastillaComponent } from './canastilla/ppal-canastilla/ppal-canastilla.component';
import { VentasUpdateComponent } from './canastilla/ventas-update/ventas-update.component';
import { CanastillaComponent } from './canastilla/canastilla.component';
import { CplComponent } from './cpl/cpl.component';
import { ConfigMangerasComponent } from './cpl/config-mangeras/config-mangeras.component';
import { EditLecturasComponent } from './cpl/edit-lecturas/edit-lecturas.component';
import { HomeCPLComponent } from './cpl/home-cpl/home-cpl.component';
import { IngresoLecturasComponent } from './cpl/ingreso-lecturas/ingreso-lecturas.component';
import { ReportLecturasComponent } from './cpl/report-lecturas/report-lecturas.component';
import { StationAdminSheetDailyComponent } from './station-admin-sheet-daily/station-admin-sheet-daily.component';
import { AnticipoAProveedoresComponent } from './station-admin-sheet-daily/anticipo-a-proveedores/anticipo-a-proveedores.component';
import { SheetDailyAddComponent } from './station-admin-sheet-daily/sheet-daily-add/sheet-daily-add.component';
import { SheetDailyEditComponent } from './station-admin-sheet-daily/sheet-daily-edit/sheet-daily-edit.component';
import { SheetDailySearchComponent } from './station-admin-sheet-daily/sheet-daily-search/sheet-daily-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { StationReceivableComponent } from '../station/station-receivable/station-receivable.component';
import { StationAdminConsumptionComponent } from './station-admin-consumption/station-admin-consumption.component';
import { OtrasVentasAddComponent } from './station-admin-consumption/otras-ventas-add/otras-ventas-add.component';
import { StationConsumptionAddComponent } from './station-admin-consumption/station-consumption-add/station-consumption-add.component';
import { StationConsumptionEditComponent } from './station-admin-consumption/station-consumption-edit/station-consumption-edit.component';
import { StationConsumptionReportsComponent } from './station-admin-consumption/station-consumption-reports/station-consumption-reports.component';
import { StationConsumptionSearchComponent } from './station-admin-consumption/station-consumption-search/station-consumption-search.component';
import { StationConsumptionFormapagoComponent } from './station-admin-consumption/stationConsumptionFormapago/stationConsumptionFormapago.component';
import { ReceivableComponent } from '../cartera/receivable/receivable.component';
import { ModalDialogComponent } from '../util/modal-dialog/modal-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { CompSearchProviderComponent } from '../contabilidad/components/comp-search-provider/comp-search-provider.component';
import { FieldsetComponent } from '../util/fieldset/fieldset.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { WholesalerInvoicesComponent } from '../contabilidad/invoice/wholesaler-invoices/wholesaler-invoices.component';
import { CarteraPlanillaComponent } from '../report/cartera/cartera-planilla/cartera-planilla.component';
import { CompSearchClientComponent } from '../cartera/components/comp-search-client/comp-search-client.component';
import { StationConsumptionComponent } from '../station/station-consumption/station-consumption.component';
import { StationAdminRoutes } from './station-admin.routing';

@NgModule({
    imports: [
        CommonModule,
        StationAdminRoutes,
        FormsModule,
        CalendarModule,
        ReactiveFormsModule,
        DropdownModule,
        CardModule,
        RouterModule,
        ChartModule,
        CurrencyMaskModule,
    ],
    declarations: [
        DsCarteraComponent,
        StationAdminCalibrationComponent,
        StationAdminReceivableComponent,
        ReportSSRSComponent,
        //// nueva config
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
        /// canastilla
        HomeCanatillaComponent,
        PpalCanastillaComponent,
        VentasUpdateComponent,
        CanastillaComponent,
        /// Cpl
        CplComponent,
        ConfigMangerasComponent,
        EditLecturasComponent,
        HomeCPLComponent,
        IngresoLecturasComponent,
        ReportLecturasComponent,
        // Admin-Sheet
        StationAdminSheetDailyComponent,
        AnticipoAProveedoresComponent,
        SheetDailyAddComponent,
        SheetDailyEditComponent,
        SheetDailySearchComponent,
        ///
        StationAdminConsumptionComponent,
        OtrasVentasAddComponent,
        StationConsumptionAddComponent,
        StationConsumptionEditComponent,
        StationConsumptionReportsComponent,
        StationConsumptionSearchComponent,
        StationConsumptionFormapagoComponent,
        // Otros
        StationReceivableComponent,
        ReceivableComponent,
        ModalDialogComponent,
        CompSearchProviderComponent,
        FieldsetComponent,
        WholesalerInvoicesComponent,
        CarteraPlanillaComponent,
        CompSearchClientComponent,
        StationConsumptionComponent,



    ],

    exports: [
        StationAdminReceivableComponent,
        ReportSSRSComponent,
        ReceivableComponent,
        ModalDialogComponent,
        CompSearchClientComponent,
        CompSearchProviderComponent,
        CarteraPlanillaComponent,
        WholesalerInvoicesComponent
    ]
})
export class StationAdminModule { }
