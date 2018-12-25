import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddmodeltypeComponent} from './addmodeltype/addmodeltype.component';
import {ItemrelationComponent} from './itemrelation/itemrelation.component';
import {StoresComponent} from './stores/stores.component';

const routes: Routes = [
  {
    path: 'top',
    loadChildren: './top/top.module#TopModule'
  },
  {
    path: 'addmodeltype',
    component: AddmodeltypeComponent,
  },
  {
    path: 'itemrelation',
    component: ItemrelationComponent,
  },
  {
    path: 'stores',
    component: StoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdiRoutingModule {
}
