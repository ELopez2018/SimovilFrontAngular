import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogorderComponent } from './logorder/logorder.component';
import { EmployeeComponent } from './employee/employee.component';
import { PrincipalComponent } from './principal/principal.component';
import { TurnoComponent } from './turno/turno.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './cartera/payment/payment.component';
import { AuditComponent } from './audit/audit.component';
import { ReceivableComponent } from './cartera/receivable/receivable.component';
import { ClientSelfComponent } from './client-self/client-self.component';
import { UserSearchComponent } from './administrator/user/user-search/user-search.component';
import { UserAddComponent } from './administrator/user/user-add/user-add.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { InvoiceSearchComponent } from './contabilidad/invoice/invoice-search/invoice-search.component';
import { InvoiceAddComponent } from './contabilidad/invoice/invoice-add/invoice-add.component';
import { PendingInvoiceComponent } from './contabilidad/invoice/pending-invoice/pending-invoice.component';
import { ProviderComponent } from './contabilidad/provider/provider.component';
import { ProviderSearchComponent } from './contabilidad/provider/provider-search/provider-search.component';
import { ProviderAddComponent } from './contabilidad/provider/provider-add/provider-add.component';
import { ProviderEditComponent } from './contabilidad/provider/provider-edit/provider-edit.component';
import { InvoiceEditComponent } from './contabilidad/invoice/invoice-edit/invoice-edit.component';
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
import { RoleSearchComponent } from './administrator/role/role-search/role-search.component';
import { RoleComponent } from './administrator/role/role.component';
import { RoleAddComponent } from './administrator/role/role-add/role-add.component';
import { OptionComponent } from './administrator/option/option.component';
import { OptionSearchComponent } from './administrator/option/option-search/option-search.component';
import { OptionAddComponent } from './administrator/option/option-add/option-add.component';
import { PermissionComponent } from './administrator/permission/permission.component';
import { BasicStationComponent } from './basic/basic-station/basic-station.component';
import { BsSearchComponent } from './basic/basic-station/bs-search/bs-search.component';
import { BsAddComponent } from './basic/basic-station/bs-add/bs-add.component';
import { CarteraComponent } from './report/cartera/cartera.component';
import { PaymentSearchComponent } from './cartera/payment/payment-search/payment-search.component';
import { PaymentAddComponent } from './cartera/payment/payment-add/payment-add.component';
import { PaymentAssignComponent } from './cartera/payment/payment-assign/payment-assign.component';
import { InvoicePaymentComponent } from './contabilidad/invoice/invoice-payment/invoice-payment.component';
import { OtherComponent } from './report/other/other.component';
import { PaymentOtherComponent } from './cartera/payment/payment-other/payment-other.component';
import { RosterComponent } from './employee/roster/roster.component';
import { HomeCanastillaAdvaComponent } from './administrative/canastilla/home-canastilla-adva/home-canastilla-adva.component';
import { DisabilityPaymentEditComponent } from './disability2/disability-payment/disability-payment-edit/disability-payment-edit.component';
import { CplAdmonComponent } from './administrative/cpl-admon/cpl-admon.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { InvoiceComponent } from './contabilidad/invoice/invoice.component';
import { CupoComponent } from './cartera/cupo/cupo.component';
import { VehicleComponent } from './cartera/vehicle/vehicle.component';
import { PendingAdvanceComponent } from './contabilidad/advance/pending-advance/pending-advance.component';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { UserEditComponent } from './administrator/user/user-edit/user-edit.component';
import { UserComponent } from './administrator/user/user.component';
import { AdvanceBalanceComponent } from './contabilidad/advance/advance-balance/advance-balance.component';


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
        path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: InvoiceSearchComponent },
            { path: 'search/:id', component: InvoiceSearchComponent },
            { path: 'add', component: InvoiceAddComponent },
            { path: 'add/:id', component: InvoiceAddComponent },
            { path: 'edit', component: InvoiceEditComponent },
            { path: 'edit/:id', component: InvoiceEditComponent },
            { path: 'payment', component: InvoicePaymentComponent },
            { path: 'anticiposPay', component: AdvanceBalanceComponent }
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
