import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'cms',
    loadChildren: './cms/cms.module#CmsModule'
  },
  {
    path: 'pcm',
    loadChildren: './pcm/pcm.module#PcmModule'
  },
  {
    path: 'oms',
    loadChildren: './oms/oms.module#OmsModule'
  },
  {
    path: 'shopcode',
    loadChildren: './shopcode/shopcode.module#ShopcodeModule'
  },
  {
    path: 'article',
    loadChildren: './article/article.module#ArticleModule'
  },
  {
    path: 'tms',
    loadChildren: './tms/tms.module#TmsModule'
  },
  {
    path: 'pay',
    loadChildren: './pay/pay.module#PayModule'
  },
  {
    path: 'auth',
    loadChildren : './auth/auth.module#AuthModule'
  },
  {
    path: 'edi',
    loadChildren: './edi/edi.module#EdiModule'
  },
  {
    path: 'custom',
    loadChildren: './custom/custom.module#CustomModule'
  },
  {
    path: 'activity',
    loadChildren: './activity/activity.module#ActivityModule'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
