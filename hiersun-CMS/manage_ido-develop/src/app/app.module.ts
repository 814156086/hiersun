import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {AppComponent} from './app.component';

import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {SidemenuComponent} from './components/sidemenu/sidemenu.component';

import {CommonService} from './services/common.service';
import {SortablejsModule} from 'angular-sortablejs';
import {CKEditorModule} from 'ng2-ckeditor';
import {FileUploadModule} from 'ng2-file-upload';
import {AppRoutingModule} from './app-routing.module';
import zh from '@angular/common/locales/zh';
import { DashboardComponent } from './dashboard/dashboard.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    AppRoutingModule,
    FormsModule,
    FileUploadModule,
    NgZorroAntdModule,
    SortablejsModule.forRoot({animation: 150}),
    CKEditorModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {useValue: zh_CN, provide: LocationStrategy, useClass: PathLocationStrategy},
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
