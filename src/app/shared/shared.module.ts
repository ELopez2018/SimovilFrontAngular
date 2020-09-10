import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengConponentsModule } from './components/primeng-conponents.module';
import { SearchPlacaComponent } from './components/search-placa/search-placa.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { FormVehiculosComponent } from '../components/sistema/form-vehiculos/form-vehiculos.component';
import { FormClienteComponent } from '../components/sistema/form-cliente/form-cliente.component';




@NgModule({
  declarations: [
    SearchPlacaComponent,
    StatusbarComponent,
    FormVehiculosComponent,
    FormClienteComponent
  ],
  imports: [
    CommonModule,
    PrimengConponentsModule,

  ],
  exports: [
    SearchPlacaComponent,
    PrimengConponentsModule,
    StatusbarComponent
  ]
})
export class SharedModule { }
