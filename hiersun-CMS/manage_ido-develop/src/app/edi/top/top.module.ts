import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TopRoutingModule} from './top-routing.module';
import {LogisticsCompanyComponent} from './logistics-company/logistics-company.component';

@NgModule({
  imports: [
    CommonModule,
    TopRoutingModule
  ],
  declarations: [LogisticsCompanyComponent]
})
export class TopModule {
}
