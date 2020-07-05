import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogorderComponent } from './logorder/logorder.component';
import { EmployeeComponent } from './employee/employee.component';
import { PrincipalComponent } from './principal/principal.component';
import { TurnoComponent } from './turno/turno.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';
import { ClientComponent } from './cartera/client/client.component';
import { CupoComponent } from './cartera/cupo/cupo.component';
import { VehicleComponent } from './cartera/vehicle/vehicle.component';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './cartera/payment/payment.component';
import { AuditComponent } from './audit/audit.component';
import { ReceivableComponent } from './cartera/receivable/receivable.component';
import { ClientSelfComponent } from './client-self/client-self.component';
import { RolGuard } from './guards/rol.guard';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { UserComponent } from './administrator/user/user.component';
import { UserSearchComponent } from './administrator/user/user-search/user-search.component';
import { UserAddComponent } from './administrator/user/user-add/user-add.component';
import { StationComponent } from './station/station.component';
import { StationHomeComponent } from './station/station-home/station-home.component';
import { StationClientComponent } from './station/station-client/station-client.component';
import { StationConsumptionComponent } from './station/station-consumption/station-consumption.component';
import { StationPaymentComponent } from './station/station-payment/station-payment.component';
import { StationOrderComponent } from './station/station-order/station-order.component';
import { StationReceivableComponent } from './station/station-receivable/station-receivable.component';
import { UserEditComponent } from './administrator/user/user-edit/user-edit.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { ClientSearchComponent } from './cartera/client/client-search/client-search.component';
import { ClientAddComponent } from './cartera/client/client-add/client-add.component';
import { ClientEditComponent } from './cartera/client/client-edit/client-edit.component';
import { InvoiceComponent } from './contabilidad/invoice/invoice.component';
import { InvoiceSearchComponent } from './contabilidad/invoice/invoice-search/invoice-search.component';
import { InvoiceAddComponent } from './contabilidad/invoice/invoice-add/invoice-add.component';
import { PendingInvoiceComponent } from './contabilidad/invoice/pending-invoice/pending-invoice.component';
import { ProviderComponent } from './contabilidad/provider/provider.component';
import { ProviderSearchComponent } from './contabilidad/provider/provider-search/provider-search.component';
import { ProviderAddComponent } from './contabilidad/provider/provider-add/provider-add.component';
import { ProviderEditComponent } from './contabilidad/provider/provider-edit/provider-edit.component';
import { InvoiceEditComponent } from './contabilidad/invoice/invoice-edit/invoice-edit.component';
import { AdvanceComponent } from './contabilidad/advance/advance.component';
import { AdvanceAddComponent } from './contabilidad/advance/advance-add/advance-add.component';
import { AdvanceSearchComponent } from './contabilidad/advance/advance-search/advance-search.component';
import { PendingAdvanceComponent } from './contabilidad/advance/pending-advance/pending-advance.component';
import { AdministrativeComponent } from './administrative/administrative.component';
import { AdministrativeHomeComponent } from './administrative/administrative-home/administrative-home.component';
import { EmployeeNoveltyComponent } from './employee/employee-novelty/employee-novelty.component';
import { EmployeeNoveltySearchComponent } from './employee/employee-novelty/employee-novelty-search/employee-novelty-search.component';
import { EmployeeNoveltyAddComponent } from './employee/employee-novelty/employee-novelty-add/employee-novelty-add.component';
import { Disability2Component } from './disability2/disability2.component';
import { DisabilityPaymentComponent } from './disability2/disability-payment/disability-payment.component';
import { DisabilitySearchComponent } from './disability2/disability-search/disability-search.component';
import { DisabilityPendingComponent } from './disability2/disability-pending/disability-pending.component';
import { FiledComponent } from './disability2/filed/filed.component';
import { FiledSearchComponent } from './disability2/filed/filed-search/filed-search.component';
import { FiledAddComponent } from './disability2/filed/filed-add/filed-add.component';
import { DisabilityPaymentSearchComponent } from './disability2/disability-payment/disability-payment-search/disability-payment-search.component';
import { DisabilityPaymentAddComponent } from './disability2/disability-payment/disability-payment-add/disability-payment-add.component';
import { ProfileComponent } from './administrator/profile/profile.component';
import { ProfileSearchComponent } from './administrator/profile/profile-search/profile-search.component';
import { ProfileAddComponent } from './administrator/profile/profile-add/profile-add.component';
import { ProfileEditComponent } from './administrator/profile/profile-edit/profile-edit.component';
import { RoleSearchComponent } from './administrator/role/role-search/role-search.component';
import { RoleComponent } from './administrator/role/role.component';
import { RoleAddComponent } from './administrator/role/role-add/role-add.component';
import { OptionComponent } from './administrator/option/option.component';
import { OptionSearchComponent } from './administrator/option/option-search/option-search.component';
import { OptionAddComponent } from './administrator/option/option-add/option-add.component';
import { PermissionComponent } from './administrator/permission/permission.component';
import { StationAdminComponent } from './station-admin/station-admin.component';
import { StationAdminSheetDailyComponent } from './station-admin/station-admin-sheet-daily/station-admin-sheet-daily.component';
import { SheetDailyAddComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-add/sheet-daily-add.component';
import { SheetDailySearchComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-search/sheet-daily-search.component';
import { BasicStationComponent } from './basic/basic-station/basic-station.component';
import { BsSearchComponent } from './basic/basic-station/bs-search/bs-search.component';
import { BsAddComponent } from './basic/basic-station/bs-add/bs-add.component';
import { SheetDailyEditComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-edit/sheet-daily-edit.component';
import { StationAdminConsumptionComponent } from './station-admin/station-admin-consumption/station-admin-consumption.component';
import { StationConsumptionSearchComponent } from './station-admin/station-admin-consumption/station-consumption-search/station-consumption-search.component';
import { StationConsumptionAddComponent } from './station-admin/station-admin-consumption/station-consumption-add/station-consumption-add.component';
import { StationConsumptionEditComponent } from './station-admin/station-admin-consumption/station-consumption-edit/station-consumption-edit.component';
import { StationAdminReceivableComponent } from './station-admin/station-admin-receivable/station-admin-receivable.component';
import { CarteraComponent } from './report/cartera/cartera.component';
import { PaymentSearchComponent } from './cartera/payment/payment-search/payment-search.component';
import { PaymentAddComponent } from './cartera/payment/payment-add/payment-add.component';
import { PaymentAssignComponent } from './cartera/payment/payment-assign/payment-assign.component';
import { InvoicePaymentComponent } from './contabilidad/invoice/invoice-payment/invoice-payment.component';
import { StationAdminCalibrationComponent } from './station-admin/station-admin-calibration/station-admin-calibration.component';
import { OtherComponent } from './report/other/other.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TankRadingComponent } from './inventory/tank-rading/tank-rading.component';
import { FuelUnloadComponent } from './inventory/fuel-unload/fuel-unload.component';
import { CanDesactivateGuard } from './guards/can-desactivate.guard';
import { PaymentOtherComponent } from './cartera/payment/payment-other/payment-other.component';
import { ReturnedComponent } from './inventory/returned/returned.component';
import { FuelTransferComponent } from './inventory/fuel-transfer/fuel-transfer.component';
import { RosterComponent } from './employee/roster/roster.component';
import { CanastillaComponent } from './station-admin/canastilla/canastilla.component';
import { PpalCanastillaComponent } from './station-admin/canastilla/ppal-canastilla/ppal-canastilla.component';
import { ProductAddComponent } from './station-admin/canastilla/productos/product-add/product-add.component';
import { HomeCanatillaComponent } from './station-admin/canastilla/home-canatilla/home-canatilla.component';
import { EditProductosComponent } from './station-admin/canastilla/productos/edit-productos/edit-productos.component';
import { ProductInventarioComponent } from './station-admin/canastilla/productos/product-inventario/product-inventario.component';
import { InventarioMenuComponent } from './station-admin/canastilla/productos/inventario-menu/inventario-menu.component';
import { IngresoNuevaExistenciaComponent } from './station-admin/canastilla/productos/ingreso-nueva-existencia/ingreso-nueva-existencia.component';
import { DesincorporacionesExitenciaComponent } from './station-admin/canastilla/productos/desincorporaciones-exitencia/desincorporaciones-exitencia.component';
import { SolicitudBajaProductosComponent } from './station-admin/canastilla/productos/solicitud-baja-productos/solicitud-baja-productos.component';
import { ReportesCanastillaComponent } from './station-admin/canastilla/productos/reportes-canastilla/reportes-canastilla.component';
import { ConsolidadoComponent } from './station-admin/canastilla/productos/consolidado/consolidado.component';
import { EstadisticasComponent } from './station-admin/canastilla/productos/consolidado/estadisticas/estadisticas.component';
import { TrasladosComponent } from './station-admin/canastilla/productos/traslados/traslados.component';
import { InvoiceImportComponent } from './contabilidad/invoice/invoice-import/invoice-import.component';
import { CplComponent } from './station-admin/cpl/cpl.component';
import { IngresoLecturasComponent } from './station-admin/cpl/ingreso-lecturas/ingreso-lecturas.component';
import { HomeCPLComponent } from './station-admin/cpl/home-cpl/home-cpl.component';
import { EditLecturasComponent } from './station-admin/cpl/edit-lecturas/edit-lecturas.component';
import { ConfigMangerasComponent } from './station-admin/cpl/config-mangeras/config-mangeras.component';
import { ReportLecturasComponent } from './station-admin/cpl/report-lecturas/report-lecturas.component';
import { PreciosProductosComponent } from './station-admin/canastilla/productos/precios-productos/precios-productos.component';
import { ProductoDstoComponent } from './station-admin/canastilla/productos/producto-dsto/producto-dsto.component';
import { HomeCanastillaAdvaComponent } from './administrative/canastilla/home-canastilla-adva/home-canastilla-adva.component';
import { VentasUpdateComponent } from './station-admin/canastilla/ventas-update/ventas-update.component';
import { DisabilityPaymentEditComponent } from './disability2/disability-payment/disability-payment-edit/disability-payment-edit.component';
import { CplAdmonComponent } from './administrative/cpl-admon/cpl-admon.component';
import { ListaTodosProductosComponent } from './station-admin/canastilla/productos/listaTodosProductos/listaTodosProductos.component';
import { StationConsumptionFormapagoComponent } from './station-admin/station-admin-consumption/stationConsumptionFormapago/stationConsumptionFormapago.component';
import { StationConsumptionReportsComponent } from './station-admin/station-admin-consumption/station-consumption-reports/station-consumption-reports.component';
import { OtrasVentasAddComponent } from './station-admin/station-admin-consumption/otras-ventas-add/otras-ventas-add.component';
import { AnticipoAProveedoresComponent } from './station-admin/station-admin-sheet-daily/anticipo-a-proveedores/anticipo-a-proveedores.component';
import { ProductAddMenuComponent } from './station-admin/canastilla/productos/product-add-menu/product-add-menu.component';
import { ProductoCrearCodigosComponent } from './station-admin/canastilla/productos/product-add/producto-crear-codigos/producto-crear-codigos.component';
import { ClientConfiguracionComponent } from './cartera/client/client-Configuracion/client-Configuracion.component';
import { ClientEstadoCuentasComponent } from './cartera/client/client-estado-cuentas/client-estado-cuentas.component';
import { ClientBalanceGeneralComponent } from './cartera/client/client-estado-cuentas/client-Balance-General/client-Balance-General.component';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'logorder', component: LogorderComponent, canActivate: [AuthGuard] },
    {
        path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: EmployeeSearchComponent },
            { path: 'search/:id', component: EmployeeSearchComponent },
            { path: 'add', component: EmployeeAddComponent },
            { path: 'edit', component: EmployeeEditComponent },
            { path: 'edit/:id', component: EmployeeEditComponent },
            {
                path: 'novelty', component: EmployeeNoveltyComponent, canActivateChild: [AuthGuard], children: [
                    { path: '', redirectTo: 'search', pathMatch: 'full' },
                    { path: 'search', component: EmployeeNoveltySearchComponent },
                    { path: 'search/:id', component: EmployeeNoveltySearchComponent },
                    { path: 'add', component: EmployeeNoveltyAddComponent },
                    { path: 'add/:id', component: EmployeeNoveltyAddComponent }
                ]
            },
            {
                path: 'roster', component: RosterComponent, canActivateChild: [AuthGuard], children: [
                    /* { path: '', redirectTo: 'search', pathMatch: 'full' },
                     { path: 'search', component: EmployeeNoveltySearchComponent },
                     { path: 'search/:id', component: EmployeeNoveltySearchComponent },
                     { path: 'add', component: EmployeeNoveltyAddComponent },
                     { path: 'add/:id', component: EmployeeNoveltyAddComponent }*/
                ]
            }
        ]
    },
    {
        path: 'disability', component: Disability2Component, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: DisabilitySearchComponent },
            { path: 'pending', component: DisabilityPendingComponent },
            {
                path: 'filed', component: FiledComponent, canActivateChild: [AuthGuard], children: [
                    { path: 'search', component: FiledSearchComponent },
                    { path: 'search/:id', component: FiledSearchComponent },
                    { path: 'add', component: FiledAddComponent },
                    { path: 'add/:id', component: FiledAddComponent }
                ]
            },
            {
                path: 'payment', component: DisabilityPaymentComponent, canActivateChild: [AuthGuard], children: [
                    { path: 'search', component: DisabilityPaymentSearchComponent },
                    { path: 'add', component: DisabilityPaymentAddComponent },
                    { path: 'edit', component: DisabilityPaymentEditComponent }
                ]
            }
        ]
    },
    { path: 'principal', component: PrincipalComponent },
    { path: 'turnos', component: TurnoComponent, canActivate: [AuthGuard] },
    { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
    {
        path: 'client', component: ClientComponent, canActivate: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: ClientSearchComponent },
            { path: 'search/:id', component: ClientSearchComponent },
            { path: 'add', component: ClientAddComponent },
            { path: 'add/:id', component: ClientAddComponent },
            { path: 'edit', component: ClientEditComponent },
            { path: 'edit/:id', component: ClientEditComponent },
            { path: 'config', component: ClientConfiguracionComponent },
            { path: 'EstadodeCuentas', component: ClientEstadoCuentasComponent, children: [
                { path: '', redirectTo: 'balance', pathMatch: 'full' },
                { path: 'balance', component: ClientBalanceGeneralComponent },
                { path: 'consumos', component: StationConsumptionComponent },
                { path: 'pagos', component: PaymentSearchComponent },
            ]
        }

        ]
    },
    {
        path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: InvoiceSearchComponent },
            { path: 'search/:id', component: InvoiceSearchComponent },
            { path: 'add', component: InvoiceAddComponent },
            { path: 'add/:id', component: InvoiceAddComponent },
            { path: 'edit', component: InvoiceEditComponent },
            { path: 'edit/:id', component: InvoiceEditComponent },
            { path: 'payment', component: InvoicePaymentComponent }
        ]
    },
    {
        path: 'advance', component: AdvanceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: AdvanceSearchComponent },
            { path: 'search/:id', component: AdvanceSearchComponent },
            { path: 'add', component: AdvanceAddComponent },
            { path: 'add/:id', component: AdvanceAddComponent }
        ]
    },
    {
        path: 'provider', component: ProviderComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: ProviderSearchComponent },
            { path: 'search/:id', component: ProviderSearchComponent },
            { path: 'add', component: ProviderAddComponent },
            { path: 'add/:id', component: ProviderAddComponent },
            { path: 'edit', component: ProviderEditComponent },
            { path: 'edit/:id', component: ProviderEditComponent }
        ]
    },
    { path: 'cupo/:id', component: CupoComponent, canActivate: [AuthGuard] },
    { path: 'vehicle', component: VehicleComponent, canActivate: [AuthGuard] },
    {
        path: 'report', component: ReportComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: 'cartera', component: CarteraComponent },
            { path: 'other', component: OtherComponent }
        ]
    },
    {
        path: 'payment', component: PaymentComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: PaymentSearchComponent },
            { path: 'add', component: PaymentAddComponent },
            { path: 'assign', component: PaymentAssignComponent },
            { path: 'otherDiscounts', component: PaymentOtherComponent }
        ]
    },
    { path: 'audit', component: AuditComponent, canActivate: [AuthGuard] },
    { path: 'receivable', component: ReceivableComponent, canActivate: [AuthGuard] },
    { path: 'account', component: ClientSelfComponent, canActivate: [AuthGuard] },
    { path: 'pendingInvoices', component: PendingInvoiceComponent, canActivate: [AuthGuard] },
    { path: 'pendingAdvances', component: PendingAdvanceComponent, canActivate: [AuthGuard] },
    { path: 'updatepass', component: UpdatePassComponent, canActivate: [AuthGuard] },
    {
        path: 'basic_station', component: BasicStationComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: BsSearchComponent },
            { path: 'add', component: BsAddComponent },
            { path: 'edit/:id', component: UserEditComponent }
        ]
    },
    {
        path: 'user', component: UserComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: UserSearchComponent },
            { path: 'add', component: UserAddComponent },
            { path: 'edit/:id', component: UserEditComponent }
        ]
    },
    {
        path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: ProfileSearchComponent },
            { path: 'add', component: ProfileAddComponent }
        ]
    },
    {
        path: 'role', component: RoleComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: RoleSearchComponent },
            { path: 'add', component: RoleAddComponent }
        ]
    },
    {
        path: 'option', component: OptionComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: OptionSearchComponent },
            { path: 'add', component: OptionAddComponent }
        ]
    },
    {
        path: 'permission', component: PermissionComponent, canActivate: [AuthGuard]
    },
    {
        path: 'administrative', component: AdministrativeComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: AdministrativeHomeComponent },
            { path: 'pendingAdvance', component: PendingAdvanceComponent },
            { path: 'pendingInvoice', component: PendingInvoiceComponent },
            { path: 'AdvaHomCanast', component: HomeCanastillaAdvaComponent },
            { path: 'cplEstatus', component: CplAdmonComponent }

        ]
    },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
