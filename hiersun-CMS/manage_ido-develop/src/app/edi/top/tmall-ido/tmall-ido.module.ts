import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TmallIdoRoutingModule} from './tmall-ido-routing.module';
import {StoreItemCodeTypesComponent} from './store-item-code-types/store-item-code-types.component';
import {ItemRelationsComponent} from './item-relations/item-relations.component';
import {TradesComponent} from './trades/trades.component';
import {RefundsComponent} from './refunds/refunds.component';
import {TradesdetailComponent} from './tradesdetail/tradesdetail.component';

@NgModule({
  imports: [
    CommonModule,
    TmallIdoRoutingModule
  ],
  declarations: [StoreItemCodeTypesComponent, ItemRelationsComponent, TradesComponent, RefundsComponent, TradesdetailComponent]
})
export class TmallIdoModule {
}
