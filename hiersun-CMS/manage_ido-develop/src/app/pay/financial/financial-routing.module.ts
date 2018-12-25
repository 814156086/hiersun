import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FinancialStatementComponent} from './financial-statement/financial-statement.component';
import {MonthlyComponent} from './monthly/monthly.component';
import {SettlementComponent} from './settlement/settlement.component';
import {JdbillComponent} from './jdbill/jdbill.component';
import {JdfinanceComponent} from './jdfinance/jdfinance.component';

export const routes: Routes = [
  {
    path: 'financialstatement',
    component: FinancialStatementComponent
  },{
    path: 'monthly',
    component: MonthlyComponent
  },{
    path: 'settlement',
    component: SettlementComponent
  },{
    path: 'jdbill',
    component: JdbillComponent
  },{
    path: 'jdfinance',
    component: JdfinanceComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialRoutingModule { }