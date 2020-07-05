import { Routes, RouterModule } from '@angular/router';
import { StationAdminComponent } from './station-admin.component';
import { AuthGuard } from '../guards/auth.guard';
import { StationAdminSheetDailyComponent } from './station-admin-sheet-daily/station-admin-sheet-daily.component';
import { SheetDailySearchComponent } from './station-admin-sheet-daily/sheet-daily-search/sheet-daily-search.component';
import { SheetDailyAddComponent } from './station-admin-sheet-daily/sheet-daily-add/sheet-daily-add.component';
import { CanDesactivateGuard } from '../guards/can-desactivate.guard';
import { SheetDailyEditComponent } from './station-admin-sheet-daily/sheet-daily-edit/sheet-daily-edit.component';
import { ReportLecturasComponent } from './cpl/report-lecturas/report-lecturas.component';
import { StationAdminConsumptionComponent } from './station-admin-consumption/station-admin-consumption.component';
import { StationConsumptionSearchComponent } from './station-admin-consumption/station-consumption-search/station-consumption-search.component';
import { StationConsumptionAddComponent } from './station-admin-consumption/station-consumption-add/station-consumption-add.component';
import { StationConsumptionEditComponent } from './station-admin-consumption/station-consumption-edit/station-consumption-edit.component';
import { StationConsumptionFormapagoComponent } from './station-admin-consumption/stationConsumptionFormapago/stationConsumptionFormapago.component';
import { StationConsumptionReportsComponent } from './station-admin-consumption/station-consumption-reports/station-consumption-reports.component';
import { OtrasVentasAddComponent } from './station-admin-consumption/otras-ventas-add/otras-ventas-add.component';
import { StationAdminReceivableComponent } from './station-admin-receivable/station-admin-receivable.component';
import { PpalCanastillaComponent } from './canastilla/ppal-canastilla/ppal-canastilla.component';
import { HomeCanatillaComponent } from './canastilla/home-canatilla/home-canatilla.component';
import { ProductAddComponent } from './canastilla/productos/product-add/product-add.component';
import { CanastillaComponent } from './canastilla/canastilla.component';
import { ProductInventarioComponent } from './canastilla/productos/product-inventario/product-inventario.component';
import { InventarioMenuComponent } from './canastilla/productos/inventario-menu/inventario-menu.component';
import { IngresoNuevaExistenciaComponent } from './canastilla/productos/ingreso-nueva-existencia/ingreso-nueva-existencia.component';
import { DesincorporacionesExitenciaComponent } from './canastilla/productos/desincorporaciones-exitencia/desincorporaciones-exitencia.component';
import { SolicitudBajaProductosComponent } from './canastilla/productos/solicitud-baja-productos/solicitud-baja-productos.component';
import { ReportesCanastillaComponent } from './canastilla/productos/reportes-canastilla/reportes-canastilla.component';
import { ConsolidadoComponent } from './canastilla/productos/consolidado/consolidado.component';
import { EstadisticasComponent } from './canastilla/productos/consolidado/estadisticas/estadisticas.component';
import { TrasladosComponent } from './canastilla/productos/traslados/traslados.component';
import { InvoiceImportComponent } from '../contabilidad/invoice/invoice-import/invoice-import.component';
import { PreciosProductosComponent } from './canastilla/productos/precios-productos/precios-productos.component';
import { ProductoDstoComponent } from './canastilla/productos/producto-dsto/producto-dsto.component';
import { VentasUpdateComponent } from './canastilla/ventas-update/ventas-update.component';
import { ListaTodosProductosComponent } from './canastilla/productos/listaTodosProductos/listaTodosProductos.component';
import { EditProductosComponent } from './canastilla/productos/edit-productos/edit-productos.component';
import { ProductAddMenuComponent } from './canastilla/productos/product-add-menu/product-add-menu.component';
import { ProductoCrearCodigosComponent } from './canastilla/productos/product-add/producto-crear-codigos/producto-crear-codigos.component';

const ROUTES: Routes = [
    {
        path: 'stationAdmin', component: StationAdminComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            // { path: '', redirectTo: 'sheetDaily', pathMatch: 'full' },
            {
                path: 'sheetDaily', component: StationAdminSheetDailyComponent, canActivateChild: [AuthGuard], children: [
                    { path: 'search', component: SheetDailySearchComponent },
                    { path: 'add', component: SheetDailyAddComponent, canDeactivate: [CanDesactivateGuard] },
                    { path: 'edit', component: SheetDailyEditComponent, canDeactivate: [CanDesactivateGuard] },
                    { path: 'ReportesCpl', component: ReportLecturasComponent },
                    { path: '', redirectTo: 'search', pathMatch: 'full' },
                ]
            },
            {
                path: 'consumption', component: StationAdminConsumptionComponent, canActivateChild: [AuthGuard], children: [
                    { path: 'search', component: StationConsumptionSearchComponent },
                    { path: 'add', component: StationConsumptionAddComponent },
                    { path: 'edit', component: StationConsumptionEditComponent },
                    { path: 'formaPagos', component: StationConsumptionFormapagoComponent },
                    { path: 'consumptionReports', component: StationConsumptionReportsComponent },
                    { path: 'otrasVentasAdd', component: OtrasVentasAddComponent },
                    // { path: '', redirectTo: 'search', pathMatch: 'full' },
                ]
            },
            { path: 'receivable', component: StationAdminReceivableComponent },

        ]
    },
    {
        path: 'ppalCanastilla', component: PpalCanastillaComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'homeCanastilla', pathMatch: 'full' },
            { path: 'homeCanastilla', component: HomeCanatillaComponent },
            { path: 'addProducto', component: ProductAddComponent },
            { path: 'canastilla', component: CanastillaComponent },
            { path: 'InventarioProducto', component: ProductInventarioComponent },
            { path: 'Inventariohome', component: InventarioMenuComponent },
            { path: 'Ingresoexistencia', component: IngresoNuevaExistenciaComponent },
            { path: 'desincorporaciones', component: DesincorporacionesExitenciaComponent },
            { path: 'aprobacionBajaProductos', component: SolicitudBajaProductosComponent },
            { path: 'reportesCanastilla', component: ReportesCanastillaComponent },
            { path: 'consolidado', component: ConsolidadoComponent },
            { path: 'estadisticas', component: EstadisticasComponent },
            { path: 'traslados', component: TrasladosComponent },
            { path: 'hojaExel', component: InvoiceImportComponent },
            { path: 'Preciosproductos', component: PreciosProductosComponent },
            { path: 'Descuentos', component: ProductoDstoComponent },
            { path: 'EditarVentas', component: VentasUpdateComponent },
            { path: 'ListaTodosProd', component: ListaTodosProductosComponent },
            { path: 'editProd/:id', component: EditProductosComponent },
            { path: 'productoAddMenu', component: ProductAddMenuComponent },
            { path: 'crearCodContable', component: ProductoCrearCodigosComponent }

        ]
    },
];

export const StationAdminRoutes = RouterModule.forChild(ROUTES);
