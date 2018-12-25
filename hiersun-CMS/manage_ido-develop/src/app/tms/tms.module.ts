import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { TmsRoutingModule } from './tms-routing.module';
import { StorageComponent } from './storage/storage.component';
import { EditstorageComponent } from './storage/editstorage/editstorage.component';
import { LocationComponent } from './location/location.component';
import { EditlocationComponent } from './location/editlocation/editlocation.component';
import { EditLogisticsCompanyComponent } from './logisticsCompany/editLogisticsCompany/editLogisticsCompany.component';
import { LogisticsCompanyComponent } from './logisticsCompany/logisticsCompany.component';
import { SaleshipComponent } from './saleship/saleship.component';
import { SaletdetailComponent } from './saletdetail/saletdetail.component';
import { FaretemplateComponent } from './faretemplate/faretemplate.component';
import { AddtempComponent } from './faretemplate/addtemp/addtemp.component';
import { AllocateComponent } from './allocate/allocate.component';
import { AddallocateComponent } from './allocate/addallocate/addallocate.component';
import { EdittempComponent } from './faretemplate/edittemp/edittemp.component';
import { RegionselectComponent } from './regionselect/regionselect.component';
import { ShipsaleComponent } from './shipsale/shipsale.component';
import { ShipdetailComponent } from './shipdetail/shipdetail.component';
import { PrintepmComponent } from './printepm/printepm.component';
import { WavalistComponent } from './wavalist/wavalist.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';
import { PrintComponent } from './print/print.component';
import { PrintwavalistComponent } from './wavalist/printwavalist/printwavalist.component';
import { PrintshiporderComponent } from './wavalist/printshiporder/printshiporder.component';
import { InterceptorComponent } from './interceptor/interceptor.component';
import { DeliveryreceitpComponent } from './deliveryreceitp/deliveryreceitp.component';
import { DeliverydetailComponent } from './deliveryreceitp/deliverydetail/deliverydetail.component';
import { InstorageComponent } from './instorage/instorage.component';
import { AddinstorageComponent } from './instorage/addinstorage/addinstorage.component';
import { ChooseproComponent } from './instorage/choosepro/choosepro.component';
import { StorageproComponent } from './instorage/storagepro/storagepro.component';
import { ProdslistComponent } from './prodslist/prodslist.component';
import { ProdstockComponent } from './prodstock/prodstock.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { AddcheckComponent } from './checklist/addcheck/addcheck.component';
import { EditcheckComponent } from './checklist/editcheck/editcheck.component';
import { UploadcheckComponent } from './checklist/uploadcheck/uploadcheck.component';
import { ReviewcheckComponent } from './checklist/reviewcheck/reviewcheck.component';
import { WavetemplateComponent } from './wavetemplate/wavetemplate.component';
import { EditwavetemplateComponent } from './wavetemplate/editwavetemplate/editwavetemplate.component';


@NgModule({
  imports: [
    CommonModule,
    TmsRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [StorageComponent, EditstorageComponent, LocationComponent, EditlocationComponent, EditLogisticsCompanyComponent, LogisticsCompanyComponent, SaleshipComponent, SaleshipComponent, SaletdetailComponent, FaretemplateComponent, AddtempComponent, AllocateComponent, AddallocateComponent, EdittempComponent, RegionselectComponent, ShipsaleComponent, ShipdetailComponent, PrintepmComponent, WavalistComponent, OrderreviewComponent, PrintComponent, PrintwavalistComponent, PrintshiporderComponent, InterceptorComponent, DeliveryreceitpComponent, DeliverydetailComponent, InstorageComponent, AddinstorageComponent, ChooseproComponent, StorageproComponent, ProdslistComponent, ProdstockComponent, ChecklistComponent, AddcheckComponent, EditcheckComponent, UploadcheckComponent, ReviewcheckComponent, WavetemplateComponent, EditwavetemplateComponent]
})
export class TmsModule { }
