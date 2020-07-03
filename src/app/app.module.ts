import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextMaskModule } from 'angular2-text-mask';

// Componentes PrimeNG
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { TabMenuModule } from 'primeng/tabmenu';
import { MessageService } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

// Servicios
import { AuthenticationService } from './services/authentication.service';
import { NominaService } from './services/nomina.service';
import { StorageService } from './services/storage.service';
import { CarteraService } from './services/cartera.service';
import { UtilService } from './services/util.service';
import { BasicDataService } from './services/basic-data.service';


// Comonentes

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { EmployeeComponent } from './employee/employee.component';
import { LogorderComponent } from './logorder/logorder.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { TurnoComponent } from './turno/turno.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';
import { CupoComponent } from './cartera/cupo/cupo.component';
import { ClientComponent } from './cartera/client/client.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';


import { CustomdropdownDirective } from './directives/customdropdown.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { VehicleComponent } from './cartera/vehicle/vehicle.component';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './cartera/payment/payment.component';
import { AuditComponent } from './audit/audit.component';
import { ReceivableComponent } from './cartera/receivable/receivable.component';
import { ChartsModule } from 'ng2-charts';
import { ClientSelfComponent } from './client-self/client-self.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollService } from './services/scroll.service';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { UserComponent } from './administrator/user/user.component';
import { UserSearchComponent } from './administrator/user/user-search/user-search.component';
import { UserAddComponent } from './administrator/user/user-add/user-add.component';
import { PrintService } from './services/print.service';
import { StationComponent } from './station/station.component';
import { StationHomeComponent } from './station/station-home/station-home.component';
import { StationClientComponent } from './station/station-client/station-client.component';
import { StationConsumptionComponent } from './station/station-consumption/station-consumption.component';
import { StationPaymentComponent } from './station/station-payment/station-payment.component';
import { StationOrderComponent } from './station/station-order/station-order.component';
import { StationReceivableComponent } from './station/station-receivable/station-receivable.component';
import { UserEditComponent } from './administrator/user/user-edit/user-edit.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { ConfirmModalComponent } from './util/confirm-modal/confirm-modal.component';
import { SubirArchivoService } from './services/subir-archivo.service';
import { LoaderComponent } from './util/loader/loader.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ClientSearchComponent } from './cartera/client/client-search/client-search.component';
import { ClientAddComponent } from './cartera/client/client-add/client-add.component';
import { ClientEditComponent } from './cartera/client/client-edit/client-edit.component';
import { InvoiceComponent } from './contabilidad/invoice/invoice.component';
import { InvoiceAddComponent } from './contabilidad/invoice/invoice-add/invoice-add.component';
import { InvoiceSearchComponent } from './contabilidad/invoice/invoice-search/invoice-search.component';
import { InvoiceNoveltyComponent } from './contabilidad/invoice/invoice-novelty/invoice-novelty.component';
import { ModalDialogComponent } from './util/modal-dialog/modal-dialog.component';
import { PendingInvoiceComponent } from './contabilidad/invoice/pending-invoice/pending-invoice.component';
import { AdministrativeComponent } from './administrative/administrative.component';
import { ProviderComponent } from './contabilidad/provider/provider.component';
import { ProviderAddComponent } from './contabilidad/provider/provider-add/provider-add.component';
import { ProviderSearchComponent } from './contabilidad/provider/provider-search/provider-search.component';
import { ProviderEditComponent } from './contabilidad/provider/provider-edit/provider-edit.component';
import { InvoiceHistoryComponent } from './contabilidad/invoice/invoice-history/invoice-history.component';
import { InvoiceEditComponent } from './contabilidad/invoice/invoice-edit/invoice-edit.component';
import { AdvanceComponent } from './contabilidad/advance/advance.component';
import { AdvanceSearchComponent } from './contabilidad/advance/advance-search/advance-search.component';
import { AdvanceAddComponent } from './contabilidad/advance/advance-add/advance-add.component';
import { AdvanceNoveltyComponent } from './contabilidad/advance/advance-novelty/advance-novelty.component';
import { AdvanceHistoryComponent } from './contabilidad/advance/advance-history/advance-history.component';
import { PendingAdvanceComponent } from './contabilidad/advance/pending-advance/pending-advance.component';
import { AdministrativeHomeComponent } from './administrative/administrative-home/administrative-home.component';
import { EmployeeNoveltyComponent } from './employee/employee-novelty/employee-novelty.component';
import { EmployeeNoveltyAddComponent } from './employee/employee-novelty/employee-novelty-add/employee-novelty-add.component';
import { EmployeeNoveltySearchComponent } from './employee/employee-novelty/employee-novelty-search/employee-novelty-search.component';
import { VacationComponent } from './employee/components/vacation/vacation.component';
import { Disability2Component } from './disability2/disability2.component';
import { DisabilityPendingComponent } from './disability2/disability-pending/disability-pending.component';
import { DisabilityPaymentComponent } from './disability2/disability-payment/disability-payment.component';
import { DisabilitySearchComponent } from './disability2/disability-search/disability-search.component';
import { DisabilityNoveltyComponent } from './disability2/disability-novelty/disability-novelty.component';
import { DisabilityHistoryComponent } from './disability2/disability-history/disability-history.component';
import { FiledComponent } from './disability2/filed/filed.component';
import { FiledAddComponent } from './disability2/filed/filed-add/filed-add.component';
import { FiledUpdateComponent } from './disability2/filed/filed-update/filed-update.component';
import { FiledSearchComponent } from './disability2/filed/filed-search/filed-search.component';
import { DisabilityPaymentAddComponent } from './disability2/disability-payment/disability-payment-add/disability-payment-add.component';
import { DisabilityPaymentSearchComponent } from './disability2/disability-payment/disability-payment-search/disability-payment-search.component';
import { CompSearchClientComponent } from './cartera/components/comp-search-client/comp-search-client.component';
import { ProfileComponent } from './administrator/profile/profile.component';
import { RoleComponent } from './administrator/role/role.component';
import { OptionComponent } from './administrator/option/option.component';
import { RoleAddComponent } from './administrator/role/role-add/role-add.component';
import { RoleSearchComponent } from './administrator/role/role-search/role-search.component';
import { OptionAddComponent } from './administrator/option/option-add/option-add.component';
import { OptionEditComponent } from './administrator/option/option-edit/option-edit.component';
import { OptionSearchComponent } from './administrator/option/option-search/option-search.component';
import { ProfileAddComponent } from './administrator/profile/profile-add/profile-add.component';
import { ProfileEditComponent } from './administrator/profile/profile-edit/profile-edit.component';
import { ProfileSearchComponent } from './administrator/profile/profile-search/profile-search.component';
import { RoleEditComponent } from './administrator/role/role-edit/role-edit.component';
import { EmployeePermissionComponent } from './employee/components/employee-permission/employee-permission.component';
import { EmployeeDisabilityComponent } from './employee/components/employee-disability/employee-disability.component';
import { PermissionComponent } from './administrator/permission/permission.component';
import { RolePerfilComponent } from './administrator/role/role-perfil/role-perfil.component';
import { StationAdminComponent } from './station-admin/station-admin.component';
// import { StationAdminSheetDailyComponent } from './station-admin/station-admin-sheet-daily/station-admin-sheet-daily.component';
// import { SheetDailyAddComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-add/sheet-daily-add.component';
// import { SheetDailySearchComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-search/sheet-daily-search.component';
import { FieldsetComponent } from './util/fieldset/fieldset.component';
import { CompSearchProviderComponent } from './contabilidad/components/comp-search-provider/comp-search-provider.component';
import { NumericDirective } from './directives/numeric.directive';
import { BasicStationComponent } from './basic/basic-station/basic-station.component';
import { BsSearchComponent } from './basic/basic-station/bs-search/bs-search.component';
import { BsAddComponent } from './basic/basic-station/bs-add/bs-add.component';
import { CheckboxComponent } from './util/checkbox/checkbox.component';
import { BsEditComponent } from './basic/basic-station/bs-edit/bs-edit.component';
import { BsArtComponent } from './basic/basic-station/bs-art/bs-art.component';
import { BsConfigComponent } from './basic/basic-station/bs-config/bs-config.component';
// import { SheetDailyEditComponent } from './station-admin/station-admin-sheet-daily/sheet-daily-edit/sheet-daily-edit.component';
import { LatestFocusDirective } from './directives/latest-focus.directive';
// import { DsCarteraComponent } from './station-admin/components/ds-cartera/ds-cartera.component';
// import { StationAdminConsumptionComponent } from './station-admin/station-admin-consumption/station-admin-consumption.component';
// import { StationConsumptionAddComponent } from './station-admin/station-admin-consumption/station-consumption-add/station-consumption-add.component';
// import { StationConsumptionEditComponent } from './station-admin/station-admin-consumption/station-consumption-edit/station-consumption-edit.component';
// import { StationConsumptionSearchComponent } from './station-admin/station-admin-consumption/station-consumption-search/station-consumption-search.component';
// import { StationAdminReceivableComponent } from './station-admin/station-admin-receivable/station-admin-receivable.component';
import { CarteraPlanillaComponent } from './report/cartera/cartera-planilla/cartera-planilla.component';
import { CarteraComponent } from './report/cartera/cartera.component';
import { TableConfigComponent } from './util/table-config/table-config.component';
import { PaymentSearchComponent } from './cartera/payment/payment-search/payment-search.component';
import { PaymentAddComponent } from './cartera/payment/payment-add/payment-add.component';
import { PaymentAssignComponent } from './cartera/payment/payment-assign/payment-assign.component';
import { InvoicePaymentComponent } from './contabilidad/invoice/invoice-payment/invoice-payment.component';
import { WholesalerInvoicesComponent } from './contabilidad/invoice/wholesaler-invoices/wholesaler-invoices.component';
// import { StationAdminCalibrationComponent } from './station-admin/station-admin-calibration/station-admin-calibration.component';
import { OtherComponent } from './report/other/other.component';
import { ReportSSRSComponent } from './common/report-ssrs/report-ssrs.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TankRadingComponent } from './inventory/tank-rading/tank-rading.component';
import { FuelUnloadComponent } from './inventory/fuel-unload/fuel-unload.component';
import { PaymentOtherComponent } from './cartera/payment/payment-other/payment-other.component';
import { ReturnedComponent } from './inventory/returned/returned.component';
import { OtherWholesalerComponent } from './report/other/other-wholesaler/other-wholesaler.component';
import { FuelTransferComponent } from './inventory/fuel-transfer/fuel-transfer.component';
import { RosterComponent } from './employee/roster/roster.component';
// import { CanastillaComponent } from './station-admin/canastilla/canastilla.component';
// import { ProductAddComponent } from './station-admin/canastilla/productos/product-add/product-add.component';
// import { PpalCanastillaComponent } from './station-admin/canastilla/ppal-canastilla/ppal-canastilla.component';



// import { HomeCanatillaComponent } from './station-admin/canastilla/home-canatilla/home-canatilla.component';
// import { EditProductosComponent } from './station-admin/canastilla/productos/edit-productos/edit-productos.component';
// import { ProductInventarioComponent } from './station-admin/canastilla/productos/product-inventario/product-inventario.component';

// import { InventarioMenuComponent } from './station-admin/canastilla/productos/inventario-menu/inventario-menu.component';
// import { IngresoNuevaExistenciaComponent } from './station-admin/canastilla/productos/ingreso-nueva-existencia/ingreso-nueva-existencia.component';
// import { DesincorporacionesExitenciaComponent } from './station-admin/canastilla/productos/desincorporaciones-exitencia/desincorporaciones-exitencia.component';
// import { SolicitudBajaProductosComponent } from './station-admin/canastilla/productos/solicitud-baja-productos/solicitud-baja-productos.component';
// import { ReportesCanastillaComponent } from './station-admin/canastilla/productos/reportes-canastilla/reportes-canastilla.component';
// import { ConsolidadoComponent } from './station-admin/canastilla/productos/consolidado/consolidado.component';
// import { EstadisticasComponent } from './station-admin/canastilla/productos/consolidado/estadisticas/estadisticas.component';
// import { ListProductosComponent } from './station-admin/canastilla/productos/list-productos/list-productos.component';
// import { ListaClientesComponent } from './station-admin/canastilla/productos/lista-clientes/lista-clientes.component';
// import { TrasladosComponent } from './station-admin/canastilla/productos/traslados/traslados.component';
import { InvoiceImportComponent } from './contabilidad/invoice/invoice-import/invoice-import.component';
// import { IntrasladosComponent } from './station-admin/canastilla/productos/traslados/intraslados/intraslados.component';
// import { OuttrasladosComponent } from './station-admin/canastilla/productos/traslados/outtraslados/outtraslados.component';
// import { CplComponent } from './station-admin/cpl/cpl.component';
// import { IngresoLecturasComponent } from './station-admin/cpl/ingreso-lecturas/ingreso-lecturas.component';
// import { HomeCPLComponent } from './station-admin/cpl/home-cpl/home-cpl.component';
// import { EditLecturasComponent } from './station-admin/cpl/edit-lecturas/edit-lecturas.component';
// import { ReportLecturasComponent } from './station-admin/cpl/report-lecturas/report-lecturas.component';
// import { ConfigMangerasComponent } from './station-admin/cpl/config-mangeras/config-mangeras.component';
// import { PreciosProductosComponent } from './station-admin/canastilla/productos/precios-productos/precios-productos.component';
// import { ProductoDstoComponent } from './station-admin/canastilla/productos/producto-dsto/producto-dsto.component';
import { HomeCanastillaAdvaComponent } from './administrative/canastilla/home-canastilla-adva/home-canastilla-adva.component';
// import { VentasUpdateComponent } from './station-admin/canastilla/ventas-update/ventas-update.component';
import { DisabilityPaymentEditComponent } from './disability2/disability-payment/disability-payment-edit/disability-payment-edit.component';
import { CplAdmonComponent } from './administrative/cpl-admon/cpl-admon.component';
// import { ListaTodosProductosComponent } from './station-admin/canastilla/productos/listaTodosProductos/listaTodosProductos.component';
// import { StationConsumptionFormapagoComponent } from './station-admin/station-admin-consumption/stationConsumptionFormapago/stationConsumptionFormapago.component';
// import { StationConsumptionReportsComponent } from './station-admin/station-admin-consumption/station-consumption-reports/station-consumption-reports.component';
// import { OtrasVentasAddComponent } from './station-admin/station-admin-consumption/otras-ventas-add/otras-ventas-add.component';
// import { AnticipoAProveedoresComponent } from './station-admin/station-admin-sheet-daily/anticipo-a-proveedores/anticipo-a-proveedores.component';
// import { ProductAddMenuComponent } from './station-admin/canastilla/productos/product-add-menu/product-add-menu.component';
// import { ProductoCrearCodigosComponent } from './station-admin/canastilla/productos/product-add/producto-crear-codigos/producto-crear-codigos.component';
import { ClientConfiguracionComponent } from './cartera/client/client-Configuracion/client-Configuracion.component';
import { ClientSaldosIncialesComponent } from './cartera/client/client-saldosInciales/client-saldosInciales.component';
import { ClientInfoComponent } from './cartera/client/client-info/client-info.component';
import { ClientEstadoCuentasComponent } from './cartera/client/client-estado-cuentas/client-estado-cuentas.component';
import { ClientBalanceGeneralComponent } from './cartera/client/client-estado-cuentas/client-Balance-General/client-Balance-General.component';
import { StationAdminModule } from './station-admin/station-admin.module';



@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        EmployeeComponent,
        LogorderComponent,
        LoginComponent,
        PrincipalComponent,
        TurnoComponent,
        WelcomeComponent,
        CupoComponent,
        ClientComponent,
        CustomdropdownDirective,
        AutofocusDirective,
        VehicleComponent,
        ReportComponent,
        PaymentComponent,
        AuditComponent,
        ReceivableComponent,
        ClientSelfComponent,
        UpdatePassComponent,
        UserComponent,
        UserSearchComponent,
        UserAddComponent,
        StationComponent,
        StationHomeComponent,
        StationClientComponent,
        StationConsumptionComponent,
        StationPaymentComponent,
        StationOrderComponent,
        StationReceivableComponent,
        UserEditComponent,
        EmployeeEditComponent,
        EmployeeAddComponent,
        EmployeeSearchComponent,
        ConfirmModalComponent,
        LoaderComponent,
        ClientSearchComponent,
        ClientAddComponent,
        ClientEditComponent,
        InvoiceComponent,
        InvoiceAddComponent,
        InvoiceSearchComponent,
        InvoiceNoveltyComponent,
        ModalDialogComponent,
        PendingInvoiceComponent,
        AdministrativeComponent,
        ProviderComponent,
        ProviderAddComponent,
        ProviderSearchComponent,
        ProviderEditComponent,
        InvoiceHistoryComponent,
        InvoiceEditComponent,
        AdvanceComponent,
        AdvanceSearchComponent,
        AdvanceAddComponent,
        AdvanceNoveltyComponent,
        AdvanceHistoryComponent,
        PendingAdvanceComponent,
        AdministrativeHomeComponent,
        EmployeeNoveltyComponent,
        EmployeeNoveltyAddComponent,
        EmployeeNoveltySearchComponent,
        VacationComponent,
        PermissionComponent,
        Disability2Component,
        DisabilityPendingComponent,
        DisabilityPaymentComponent,
        DisabilitySearchComponent,
        DisabilityNoveltyComponent,
        DisabilityHistoryComponent,
        FiledComponent,
        FiledAddComponent,
        FiledUpdateComponent,
        FiledSearchComponent,
        DisabilityPaymentAddComponent,
        DisabilityPaymentSearchComponent,
        CompSearchClientComponent,
        ProfileComponent,
        RoleComponent,
        OptionComponent,
        RoleAddComponent,
        RoleSearchComponent,
        OptionAddComponent,
        OptionEditComponent,
        OptionSearchComponent,
        ProfileAddComponent,
        ProfileEditComponent,
        ProfileSearchComponent,
        RoleEditComponent,
        EmployeePermissionComponent,
        EmployeeDisabilityComponent,
        RolePerfilComponent,
        StationAdminComponent,
        // StationAdminSheetDailyComponent,
        // SheetDailyAddComponent,
        // SheetDailySearchComponent,
        FieldsetComponent,
        CompSearchProviderComponent,
        NumericDirective,
        BasicStationComponent,
        BsSearchComponent,
        BsAddComponent,
        CheckboxComponent,
        BsEditComponent,
        BsArtComponent,
        BsConfigComponent,
        // SheetDailyEditComponent,
        LatestFocusDirective,
        // DsCarteraComponent,
        // StationAdminConsumptionComponent,
        // StationConsumptionAddComponent,
        // StationConsumptionEditComponent,
        // StationConsumptionSearchComponent,
        // StationAdminReceivableComponent,
        CarteraPlanillaComponent,
        CarteraComponent,
        TableConfigComponent,
        PaymentSearchComponent,
        PaymentAddComponent,
        PaymentAssignComponent,
        InvoicePaymentComponent,
        WholesalerInvoicesComponent,
        // StationAdminCalibrationComponent,
        OtherComponent,
        // ReportSSRSComponent,
        InventoryComponent,
        TankRadingComponent,
        FuelUnloadComponent,
        PaymentOtherComponent,
        ReturnedComponent,
        OtherWholesalerComponent,
        FuelTransferComponent,
        RosterComponent,
        // CanastillaComponent,
        // ProductAddComponent,
        // PpalCanastillaComponent,
        // HomeCanatillaComponent,
        // EditProductosComponent,
        // ProductInventarioComponent,
        // InventarioMenuComponent,
        // IngresoNuevaExistenciaComponent,
        // DesincorporacionesExitenciaComponent,
        // SolicitudBajaProductosComponent,
        // ReportesCanastillaComponent,
        // ConsolidadoComponent,
        // EstadisticasComponent,
        // ListProductosComponent,
        // ListaClientesComponent,
        // TrasladosComponent,
        InvoiceImportComponent,
        // IntrasladosComponent,
        // OuttrasladosComponent,
        // CplComponent,
        // IngresoLecturasComponent,
        // HomeCPLComponent,
        // EditLecturasComponent,
        // ReportLecturasComponent,
        // ConfigMangerasComponent,
        // PreciosProductosComponent,
        // ProductoDstoComponent,
        HomeCanastillaAdvaComponent,
        // VentasUpdateComponent,
        DisabilityPaymentEditComponent,
        CplAdmonComponent,
        // ListaTodosProductosComponent,
        // StationConsumptionFormapagoComponent,
        // StationConsumptionReportsComponent,
        // OtrasVentasAddComponent,
        // AnticipoAProveedoresComponent,
        // ProductAddMenuComponent,
        // ProductoCrearCodigosComponent,
        ClientConfiguracionComponent,
        ClientSaldosIncialesComponent,
        ClientInfoComponent,
        ClientEstadoCuentasComponent,
        ClientBalanceGeneralComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        CurrencyMaskModule,
        CalendarModule,
        TabMenuModule,
        // GrowlModule,
        ToastModule,
        TieredMenuModule,
        MenubarModule,
        AutoCompleteModule,
        TabViewModule,
        FieldsetModule,
        TableModule,
        DialogModule,
        InputTextareaModule,
        ChartsModule,
        ScrollToModule.forRoot(),
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        TextMaskModule,
        CurrencyMaskModule,
        ButtonModule,
        ChartModule,
        InputTextModule,
        CardModule,
        CheckboxModule,
        DropdownModule,
        RadioButtonModule,
        MultiSelectModule,
        AccordionModule,
        MessagesModule,
        MessageModule,
        StationAdminModule
    ],
    providers: [
        AuthenticationService,
        NominaService,
        AuthGuard,
        StorageService,
        CarteraService,
        MessageService,
        ScrollService,
        PrintService,
        BasicDataService,
        UtilService,
        SubirArchivoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
