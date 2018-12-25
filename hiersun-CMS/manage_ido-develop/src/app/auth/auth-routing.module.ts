import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { AddgroupComponent } from './group/addgroup/addgroup.component';
import { EditgroupComponent } from './group/editgroup/editgroup.component';

import {DutyComponent} from './duty/duty.component'

import {RoleComponent} from './role/role.component'

import { ApplicationComponent } from './application/application.component';


import { DeptComponent } from './dept/dept.component';

import { UserComponent } from './user/user.component';
import { EdituserComponent } from './user/edituser/edituser.component';

export const routes:Routes = [
    
    {
        path: 'group',
        component: GroupComponent
    },
    {
        path: 'groupadd',
        component : AddgroupComponent
    },
    {
        path: 'groupedit/:id',
        component : EditgroupComponent
    },
    {
        path: 'duty',
        component : DutyComponent
    },
    {
        path: 'role',
        component : RoleComponent
    },
    {
        path: 'app',
        component :ApplicationComponent
    },
    {
        path: 'dept',
        component :DeptComponent
    },
    {
        path: 'user',
        component :UserComponent
    },
    {
        path:'edituser',
        component:EdituserComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AuthRoutingModule { }