import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomlistComponent } from './customlist/customlist.component';
import { CustomergroupComponent } from './customergroup/customergroup.component';
import { UpdatecustomerComponent } from './updatecustomer/updatecustomer.component';
import { AddcustomerComponent } from './addcustomer/addcustomer.component';
import { EditorcustomComponent } from './editorcustom/editorcustom.component';
import { CustomidmanageComponent } from './customidmanage/customidmanage.component';
import { UpdatecustomidComponent } from './updatecustomid/updatecustomid.component';
const routes: Routes = [
  {
    path: 'customergroup',
    component: CustomergroupComponent
  },{
    path: 'addcustomer',
    component: AddcustomerComponent
  },{
    path: 'updatecustomer',
    component: UpdatecustomerComponent
  },
  {
    path: 'customlist',
    component: CustomlistComponent
  },
  {
    path: 'editorcustom',
    component: EditorcustomComponent
  },{
    path: 'customidmanage',
    component: CustomidmanageComponent
  },{
    path: 'updatecustomid',
    component: UpdatecustomidComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class customRoutingModule { }
