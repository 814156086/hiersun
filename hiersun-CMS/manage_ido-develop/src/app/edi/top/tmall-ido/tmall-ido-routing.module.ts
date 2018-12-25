import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StoreItemCodeTypesComponent} from './store-item-code-types/store-item-code-types.component';
import {ItemRelationsComponent} from './item-relations/item-relations.component';
import {TradesComponent} from './trades/trades.component';
import {RefundsComponent} from './refunds/refunds.component';
import {TradesdetailComponent} from './tradesdetail/tradesdetail.component';

const routes: Routes = [
  {
    path: 'store-item-code-types',
    component: StoreItemCodeTypesComponent
  },
  {
    path: 'item-relations',
    component: ItemRelationsComponent
  },
  {
    path: 'trades',
    component: TradesComponent
  },
  {
    path: 'refunds',
    component: RefundsComponent
  },
  {
    path: 'tradesdetail',
    component: TradesdetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TmallIdoRoutingModule {
}
