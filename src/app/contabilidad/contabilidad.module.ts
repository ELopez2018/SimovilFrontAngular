import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceComponent } from './advance/advance.component';
import { AdvanceSearchComponent } from './advance/advance-search/advance-search.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AdvanceComponent,
    AdvanceSearchComponent

  ]
})
export class ContabilidadModule { }
