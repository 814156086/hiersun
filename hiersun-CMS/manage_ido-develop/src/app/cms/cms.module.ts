import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { CmsmanageComponent } from './cmsmanage/cmsmanage.component';
// import { AddtdkComponent } from './addtdk/addtdk.component';
import { AddtemplateComponent } from './addtemplate/addtemplate.component';
import { GroupcmsComponent } from './groupcms/groupcms.component';
import { ImggalleryComponent } from './imggallery/imggallery.component';
import { ListtemplateComponent } from './listtemplate/listtemplate.component';
import { MgroupcmsComponent } from './mgroupcms/mgroupcms.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { routes } from './cms-routing.module';
import { InnerhtmlPipe } from '../pipe/innerhtml.pipe';
import { ChannelmanageComponent } from './channelmanage/channelmanage.component';
// import { ChanneltreeComponent } from './channeltree/channeltree.component';
import { PagemanageComponent } from './pagemanage/pagemanage.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { VideomanageComponent } from './videomanage/videomanage.component';
import { VideodetailComponent } from './videodetail/videodetail.component';
import { SeomanageComponent } from './seomanage/seomanage.component';
import { PagetemplateComponent } from './pagetemplate/pagetemplate.component';
import { AddpagetplComponent } from './addpagetpl/addpagetpl.component';
import { FragmenttmpComponent } from './fragmenttmp/fragmenttmp.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    ColorPickerModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CmsmanageComponent,
    // AddtdkComponent,
    AddtemplateComponent,
    GroupcmsComponent,
    ImggalleryComponent,
    ListtemplateComponent,
    MgroupcmsComponent,
    SitemapComponent,
    // ChanneltreeComponent,
    InnerhtmlPipe,
    ChannelmanageComponent,
    PagemanageComponent,
    VideomanageComponent,
    VideodetailComponent,
    SeomanageComponent,
    PagetemplateComponent,
    AddpagetplComponent,
    FragmenttmpComponent

  ]
})
export class CmsModule { }
