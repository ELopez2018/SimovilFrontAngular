import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client/client.component';
import { ClientSearchComponent } from './client/client-search/client-search.component';
import { ClientAddComponent } from './client/client-add/client-add.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { ClientConfiguracionComponent } from './client/client-Configuracion/client-Configuracion.component';
import { ClientEstadoCuentasComponent } from './client/client-estado-cuentas/client-estado-cuentas.component';
import { ClientBalanceGeneralComponent } from './client/client-estado-cuentas/client-Balance-General/client-Balance-General.component';
import { StationConsumptionComponent } from '../station/station-consumption/station-consumption.component';
import { PaymentSearchComponent } from './payment/payment-search/payment-search.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalDialogComponent } from '../util/modal-dialog/modal-dialog.component';
import { StationAdminModule } from '../station-admin/station-admin.module';
import { ClientInfoComponent } from './client/client-info/client-info.component';
import { ClientSaldosIncialesComponent } from './client/client-saldosInciales/client-saldosInciales.component';
import { AccordionModule } from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    ClientComponent,
    ClientSearchComponent,
    ClientAddComponent,
    ClientEditComponent,
    ClientConfiguracionComponent,
    ClientEstadoCuentasComponent,
    ClientBalanceGeneralComponent,
    // StationConsumptionComponent,
    PaymentSearchComponent,
    ClientInfoComponent,
    ClientSaldosIncialesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MultiSelectModule,
    TableModule,
    DialogModule,
    FieldsetModule,
    CurrencyMaskModule,
    StationAdminModule,
    AccordionModule,
    MessagesModule,
    MessageModule,
    DropdownModule
  ]
})
export class CarteraModule { }
