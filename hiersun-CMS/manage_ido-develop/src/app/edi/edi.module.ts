import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdiRoutingModule } from './edi-routing.module';
import { AddmodeltypeComponent } from './addmodeltype/addmodeltype.component';
import { ItemrelationComponent } from './itemrelation/itemrelation.component';
import { StoresComponent } from './stores/stores.component';

@NgModule({
  imports: [
    CommonModule,
    EdiRoutingModule
  ],
  declarations: [
  AddmodeltypeComponent,
  ItemrelationComponent,
  StoresComponent]
})
export class EdiModule { }
