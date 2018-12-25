import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsmanageComponent } from './cmsmanage/cmsmanage.component';
// import { AddtdkComponent } from './addtdk/addtdk.component';
import { AddtemplateComponent } from './addtemplate/addtemplate.component';
import { GroupcmsComponent } from './groupcms/groupcms.component';
// import { ImggalleryComponent } from './imggallery/imggallery.component';
import { ListtemplateComponent } from './listtemplate/listtemplate.component';
import { MgroupcmsComponent } from './mgroupcms/mgroupcms.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { ChannelmanageComponent } from './channelmanage/channelmanage.component';
import { PagemanageComponent } from './pagemanage/pagemanage.component';
import { VideomanageComponent } from './videomanage/videomanage.component';
// import { ChanneltreeComponent } from './channeltree/channeltree.component';
import { ImggalleryComponent } from './imggallery/imggallery.component';
import { VideodetailComponent } from './videodetail/videodetail.component';
import { SeomanageComponent } from './seomanage/seomanage.component';
import { PagetemplateComponent } from './pagetemplate/pagetemplate.component';
import { AddpagetplComponent } from './addpagetpl/addpagetpl.component';
import { FragmenttmpComponent } from './fragmenttmp/fragmenttmp.component';

export const routes: Routes = [
  {
    path: 'cmsmanage',
    component: CmsmanageComponent,
  },
  // {
  //   path: 'addtdk/:id',
  //   component: AddtdkComponent 
  // },
  {
    path: 'groupcms',
    component: GroupcmsComponent 
  },
  {
    path: 'mgroupcms',
    component: MgroupcmsComponent 
  },
  {
    path: 'addtemplate',
    component: AddtemplateComponent 
  },
  {
    path: 'sitemap/:id',
    component: SitemapComponent 
  },
  {
    path: 'fragmenttmp',
    component: FragmenttmpComponent,
  },
  {
    path: 'listtemplate',
    component: ListtemplateComponent,
  },
  {
    path: 'pagetemplate',
    component: PagetemplateComponent,
  },
  {
    path: 'addpagetpl',
    component: AddpagetplComponent,
  },
  {
    path: 'imggallery',
    component: ImggalleryComponent 
  },
  {
    path: 'videomanage',
    component: VideomanageComponent 
  },
  {
    path: 'channelmanage',
    component: ChannelmanageComponent 
  },
  {
    path: 'pagemanage',
    component: PagemanageComponent 
  },
  {
    path: 'videodetail',
    component: VideodetailComponent 
  },
  {
    path: 'seomanage',
    component: SeomanageComponent 
  },
  {
    path: '**',
    component: CmsmanageComponent 
  },
  {
    path: '',
    redirectTo: 'cmsmanage',
    pathMatch: 'full'
  }
];