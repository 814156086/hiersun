import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FinancialRoutingModule} from './financial-routing.module';
import {FinancialStatementComponent} from './financial-statement/financial-statement.component';
import {MonthlyComponent} from './monthly/monthly.component';
import {SettlementComponent} from './settlement/settlement.component';
import {JdbillComponent} from './jdbill/jdbill.component';
import {JdfinanceComponent} from './jdfinance/jdfinance.component';

@NgModule({
  imports: [
    CommonModule,
    FinancialRoutingModule
  ],
  declarations: [FinancialStatementComponent, MonthlyComponent, SettlementComponent, JdbillComponent, JdfinanceComponent]
})
export class FinancialModule { }
