import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import {LabelComponent} from "./label/label.component";
import {LabeldetailComponent} from "./labeldetail/labeldetail.component";
import {FreebieComponent} from "./freebie/freebie.component";
import {FreebiedetailComponent} from "./freebiedetail/freebiedetail.component";
import {RuleComponent} from "./rule/rule.component";
import {RuledetailComponent} from "./ruledetail/ruledetail.component";
import {ScopeComponent} from "./scope/scope.component";
import {ScopedetailComponent} from "./scopedetail/scopedetail.component";

const routes: Routes = [
  {
    path: 'activity',
    component: ActivityComponent
  },
  {
    path: 'label',
    component: LabelComponent
  },
  {
    path: 'labeldetail',
    component: LabeldetailComponent
  },
  {
    path: 'freebie',
    component: FreebieComponent
  },
  {
    path: 'freebiedetail',
    component: FreebiedetailComponent
  },
  {
    path: 'rule',
    component: RuleComponent
  },
  {
    path: 'ruledetail',
    component: RuledetailComponent
  },
  {
    path: 'scope',
    component: ScopeComponent
  },
  {
    path: 'scopedetail',
    component: ScopedetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
