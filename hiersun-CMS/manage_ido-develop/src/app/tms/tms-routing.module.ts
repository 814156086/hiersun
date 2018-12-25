import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { EdittempComponent } from './faretemplate/edittemp/edittemp.component';
import { AllocateComponent } from './allocate/allocate.component';
import { AddallocateComponent } from './allocate/addallocate/addallocate.component';
import { ShipsaleComponent } from './shipsale/shipsale.component';
import { PrintepmComponent } from './printepm/printepm.component';
import { WavalistComponent } from './wavalist/wavalist.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';
import { InterceptorComponent } from './interceptor/interceptor.component';
import { DeliveryreceitpComponent } from './deliveryreceitp/deliveryreceitp.component';
import { DeliverydetailComponent } from './deliveryreceitp/deliverydetail/deliverydetail.component';
import { InstorageComponent } from './instorage/instorage.component';
import { AddinstorageComponent } from './instorage/addinstorage/addinstorage.component';
import { ProdslistComponent } from './prodslist/prodslist.component';
import { ProdstockComponent } from './prodstock/prodstock.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { AddcheckComponent } from './checklist/addcheck/addcheck.component';
import { EditcheckComponent } from './checklist/editcheck/editcheck.component';
import { UploadcheckComponent } from './checklist/uploadcheck/uploadcheck.component';
import { ReviewcheckComponent } from './checklist/reviewcheck/reviewcheck.component';
import { WavetemplateComponent } from './wavetemplate/wavetemplate.component';
import { EditwavetemplateComponent } from './wavetemplate/editwavetemplate/editwavetemplate.component';

const routes: Routes = [
  {
    path: 'storage',
    component: StorageComponent
  },
  {
    path: 'storage/editstorage',
    component: EditstorageComponent
  },
  {
    path: 'location',
    component: LocationComponent
  },
  {
    path: 'location/editlocation',
    component: EditlocationComponent
  },
  {
    path: 'saleship/:flag',
    component: SaleshipComponent
  },
  {
    path: 'shipsale',
    component: ShipsaleComponent
  },
  {
    path: 'logisticsCompany/editLogisticsCompany',
    component: EditLogisticsCompanyComponent
  },
  {
    path: 'logisticsCompany',
    component: LogisticsCompanyComponent
  },
  {
    path: 'saletdetail',
    component: SaletdetailComponent
  },
  {
    path: 'faretemplate',
    component: FaretemplateComponent
  },
  {
    path: 'faretemplate/addtemp',
    component: AddtempComponent
  },
  {
    path: 'faretemplate/edittemp',
    component: EdittempComponent
  },
  {
    path: 'allocate',
    component: AllocateComponent
  },
  {
    path: 'allocate/addallocate',
    component: AddallocateComponent
  },
  {
    path: 'wavalist',
    component: WavalistComponent
  },
  {
    path: 'orderreview',
    component: OrderreviewComponent
  },
  {
    path: 'printepm',
    component: PrintepmComponent
  },
  {
    path: 'interceptor',
    component: InterceptorComponent
  },
  {
    path: 'deliveryreceitp',
    component: DeliveryreceitpComponent
  },
  {
    path: 'deliverydetail',
    component: DeliverydetailComponent
  },
  {
    path: 'instorage',
    component: InstorageComponent
  },
  {
    path: 'addinstorage',
    component: AddinstorageComponent
  },
  {
    path: 'prodslist',
    component: ProdslistComponent
  },
  {
    path: 'prodstock',
    component: ProdstockComponent
  },
  {
    path: 'checklist',
    component: ChecklistComponent
  },
  {
    path: 'addcheck',
    component: AddcheckComponent
  },
  {
    path: 'checklist/editcheck',
    component: EditcheckComponent
  },
  {
    path: 'checklist/uploadcheck',
    component: UploadcheckComponent
  },
  {
    path: 'checklist/reviewcheck',
    component: ReviewcheckComponent
  },
  {
    path: 'wavetemplate',
    component: WavetemplateComponent
  },
  {
    path: 'wavetemplate/editwavetemplate',
    component: EditwavetemplateComponent
  },
  // import { EditwavetemplateComponent } from './wavetemplate/editwavetemplate/editwavetemplate.component';
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TmsRoutingModule { }
