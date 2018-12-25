import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity/activity.component';
import { LabelComponent } from './label/label.component';
import { RuleComponent } from './rule/rule.component';
import { FreebieComponent } from './freebie/freebie.component';
// import { ActivitydetailComponent } from './activitydetail/activitydetail.component';
import { LabeldetailComponent } from './labeldetail/labeldetail.component';
import { FreebiedetailComponent } from './freebiedetail/freebiedetail.component';
import { RuledetailComponent } from './ruledetail/ruledetail.component';
import { ScopeComponent } from './scope/scope.component';
import { ScopedetailComponent } from './scopedetail/scopedetail.component';
// import { AddactivityComponent } from './addactivity/addactivity.component';

@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule
  ],
  declarations: [ActivityComponent, LabelComponent, RuleComponent, FreebieComponent, LabeldetailComponent, FreebiedetailComponent, RuledetailComponent, ScopeComponent, ScopedetailComponent]
})
export class ActivityModule { }
