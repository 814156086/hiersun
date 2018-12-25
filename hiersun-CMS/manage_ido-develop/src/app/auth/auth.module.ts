import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import { routes } from './auth-routing.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { GroupComponent } from './group/group.component';
import { DutyComponent } from './duty/duty.component';
import { RoleComponent } from './role/role.component';
import zh from '@angular/common/locales/zh';

import { AddgroupComponent } from './group/addgroup/addgroup.component';
import { EditgroupComponent } from './group/editgroup/editgroup.component';
import { ApplicationComponent } from './application/application.component';
import { DeptComponent } from './dept/dept.component';
import { UserComponent } from './user/user.component';
import { EdituserComponent } from './user/edituser/edituser.component';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        ColorPickerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        GroupComponent,
        DutyComponent,
        RoleComponent,
        AddgroupComponent,
        EditgroupComponent,
        ApplicationComponent,
        DeptComponent,
        UserComponent,
        EdituserComponent
    ]
})


export class AuthModule { }