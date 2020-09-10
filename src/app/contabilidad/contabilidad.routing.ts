import { Routes, RouterModule } from '@angular/router';
import { AdvanceComponent } from './advance/advance.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdvanceSearchComponent } from './advance/advance-search/advance-search.component';
import { AdvanceAddComponent } from './advance/advance-add/advance-add.component';
import { AdvanceBalanceComponent } from './advance/advance-balance/advance-balance.component';

const routes: Routes = [
    {
        path: 'advance', component: AdvanceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: AdvanceSearchComponent },
            { path: 'search/:id', component: AdvanceSearchComponent },
            { path: 'add', component: AdvanceAddComponent },
            { path: 'add/:id', component: AdvanceAddComponent }

        ]
    },
];

export const ContabilidadRoutes = RouterModule.forChild(routes);
