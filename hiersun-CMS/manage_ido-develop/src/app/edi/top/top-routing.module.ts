import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LogisticsCompanyComponent} from './logistics-company/logistics-company.component';

const routes: Routes = [
  {
    path: 'tmall-ido',
    loadChildren: './tmall-ido/tmall-ido.module#TmallIdoModule'
  },
  {
    path: 'logistics-company',
    component: LogisticsCompanyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopRoutingModule {
}
