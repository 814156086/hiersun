import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodemanageComponent } from './codemanage/codemanage.component';
import { ShopdemandComponent } from './shopdemand/shopdemand.component';
import { DitchqrcodeComponent } from './ditchqrcode/ditchqrcode.component';
import { DitchmanageComponent } from './ditchmanage/ditchmanage.component';
import { InfomanageComponent } from './infomanage/infomanage.component';

export const routes: Routes = [
  {
    path: 'codemanage',
    component: CodemanageComponent,
  },{
    path: 'shopdemand',
    component: ShopdemandComponent,
  },{
    path: 'ditchqrcode',
    component: DitchqrcodeComponent,
  },{
    path: 'ditchmanage',
    component: DitchmanageComponent,
  },{
    path: 'infomanage',
    component: InfomanageComponent,
  },{
    path: '',
    redirectTo: 'codemanage',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopcodeRoutingModule { }