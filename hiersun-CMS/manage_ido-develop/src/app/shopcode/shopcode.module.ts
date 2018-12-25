import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopcodeRoutingModule } from './shopcode-routing.module';
import { CodemanageComponent } from './codemanage/codemanage.component';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ShopdemandComponent } from './shopdemand/shopdemand.component';
import { DitchqrcodeComponent } from './ditchqrcode/ditchqrcode.component';
import { DitchmanageComponent } from './ditchmanage/ditchmanage.component';
import { InfomanageComponent } from './infomanage/infomanage.component';

// import { CComponent } from './shopcode/shopcode.component';

@NgModule({
  imports: [
    CommonModule,
    ShopcodeRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  declarations: [CodemanageComponent, ShopdemandComponent, DitchqrcodeComponent, DitchmanageComponent, InfomanageComponent]
})
export class ShopcodeModule { }
