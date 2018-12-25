import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {customRoutingModule} from './custom-routing.module';
import { CustomlistComponent } from './customlist/customlist.component';
import { EditorcustomComponent } from './editorcustom/editorcustom.component';
import { CustomergroupComponent } from './customergroup/customergroup.component';
import { AddcustomerComponent } from './addcustomer/addcustomer.component';
import { UpdatecustomerComponent } from './updatecustomer/updatecustomer.component';
import { CustomidmanageComponent } from './customidmanage/customidmanage.component';
import { UpdatecustomidComponent } from './updatecustomid/updatecustomid.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    customRoutingModule
  ],
  declarations: [
    
  CustomlistComponent,
    
  EditorcustomComponent,
    
  CustomergroupComponent,
    
  AddcustomerComponent,
    
  UpdatecustomerComponent,
    
  CustomidmanageComponent,
    
  UpdatecustomidComponent]
})
export class CustomModule { }
