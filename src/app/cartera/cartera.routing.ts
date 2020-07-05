import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { AuthGuard } from '../guards/auth.guard';
import { ClientSearchComponent } from './client/client-search/client-search.component';
import { ClientAddComponent } from './client/client-add/client-add.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { ClientConfiguracionComponent } from './client/client-Configuracion/client-Configuracion.component';
import { ClientEstadoCuentasComponent } from './client/client-estado-cuentas/client-estado-cuentas.component';
import { ClientBalanceGeneralComponent } from './client/client-estado-cuentas/client-Balance-General/client-Balance-General.component';
import { StationConsumptionComponent } from '../station/station-consumption/station-consumption.component';
import { PaymentSearchComponent } from './payment/payment-search/payment-search.component';
import { StationAdminReceivableComponent } from '../station-admin/station-admin-receivable/station-admin-receivable.component';

const routes: Routes = [
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
            { path: 'receivable', component: StationAdminReceivableComponent },
            { path: 'EstadodeCuentas', component: ClientEstadoCuentasComponent, children: [
                { path: '', redirectTo: 'balance', pathMatch: 'full' },
                { path: 'balance', component: ClientBalanceGeneralComponent },
                { path: 'consumos', component: StationConsumptionComponent },
                { path: 'pagos', component: PaymentSearchComponent },
            ]
        }

        ]
    },
];

export const CarteraRoutes = RouterModule.forChild(routes);
