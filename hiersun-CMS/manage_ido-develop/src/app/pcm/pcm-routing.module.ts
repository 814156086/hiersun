import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandComponent } from './brand/brand.component';
import { AddbrandComponent } from './brand/addbrand/addbrand.component';
import { EditbrandComponent } from './brand/editbrand/editbrand.component';
import { ChannelComponent } from './channel/channel.component';
import { AddchannelComponent } from './channel/addchannel/addchannel.component';
import { EditchannelComponent } from './channel/editchannel/editchannel.component';
import { CompanyComponent } from './company/company.component';
import { AddcompanyComponent } from './company/addcompany/addcompany.component';
import { EditcompanyComponent } from './company/editcompany/editcompany.component';
import { StoreComponent } from './store/store.component';
import { AddstoreComponent } from './store/addstore/addstore.component';
import { EditstoreComponent } from './store/editstore/editstore.component';
import { RegionComponent } from './region/region.component';
import { AddregionComponent } from './region/addregion/addregion.component';
import { EditregionComponent } from './region/editregion/editregion.component';
import { AttributeComponent } from './attribute/attribute.component';
import { AddattributeComponent } from './attribute/addattribute/addattribute.component';
import { EditattributeComponent } from './attribute/editattribute/editattribute.component';
import { DispcategoryComponent } from './dispcategory/dispcategory.component';
import { ProductComponent } from './product/product.component';
import { AddproductComponent } from './product/addproduct/addproduct.component';
import { CommodityComponent } from './commodity/commodity.component';
import { StockComponent } from './stock/stock.component';
import { EditstockComponent } from './stock/editstock/editstock.component';
import { EditproductComponent } from './product/editproduct/editproduct.component';
import { DtlproductComponent } from './product/dtlproduct/dtlproduct.component';
import { CommodityCategoryComponent } from "./commodityCategory/commodcategory.component";
import { EditcommodityComponent } from './commodity/editcommodity/editcommodity.component';
import { DtlcommodityComponent } from './commodity/dtlcommodity/dtlcommodity.component';
import { TagComponent } from './tag/tag.component';
import { AddtagComponent } from './tag/addtag/addtag.component';
import { EdittagComponent } from './tag/edittag/edittag.component';
import { AddtagproComponent } from './tag/addtagpro/addtagpro.component';
import { SkumanageComponent } from './skumanage/skumanage.component';
import { DetailskuComponent } from './skumanage/detailsku/detailsku.component';
import { EditskuComponent } from './skumanage/editsku/editsku.component';
import { OrganizationComponent } from './organization/organization.component';
const routes: Routes = [
  //
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'company/addcompany',
    component: AddcompanyComponent
  },
  {
    path: 'company/editcompany',
    component: EditcompanyComponent
  },
  {
    path: 'organization',
    component: OrganizationComponent
  },
  {
    path: 'channel',
    component: ChannelComponent
  },
  {
    path: 'channel/addchannel',
    component: AddchannelComponent
  },
  {
    path: 'channel/editchannel',
    component: EditchannelComponent
  },
  {
    path: 'region',
    component: RegionComponent
  },
  {
    path: 'region/addregion',
    component: AddregionComponent
  },
  {
    path: 'region/editregion',
    component: EditregionComponent
  },
  {
    path: 'store',
    component: StoreComponent
  },
  {
    path: 'store/addstore',
    component: AddstoreComponent
  },
  {
    path: 'store/editstore',
    component: EditstoreComponent
  },
  {
    path: 'brand',
    component: BrandComponent
  },
  {
    path: 'brand/addbrand',
    component: AddbrandComponent
  },
  {
    path: 'brand/editbrand',
    component: EditbrandComponent
  },
  {
    path: 'attribute',
    component: AttributeComponent
  },
  {
    path: 'attribute/addattribute',
    component: AddattributeComponent
  },
  {
    path: 'attribute/editattribute',
    component: EditattributeComponent
  },
  {
    path: 'dispcategory',
    component: DispcategoryComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'product/addproduct',
    component: AddproductComponent
  },
  {
    path: 'product/editproduct',
    component: EditproductComponent
  },
  {
    path: 'product/dtlproduct',
    component: DtlproductComponent
  },
  {
    path: 'commodity',
    component: CommodityComponent
  },
  {
    path: 'skumanage',
    component: SkumanageComponent
  },
  {
    path: 'skumanage/detailsku',
    component: DetailskuComponent
  },
  {
    path: 'skumanage/editsku',
    component: EditskuComponent
  },
  {
    path: 'stock',
    component: StockComponent
  },
  {
    path: 'stock/editstock',
    component: EditstockComponent
  },
  {
    path: 'commodity/editcommodity',
    component: EditcommodityComponent
  },
  {
    path: 'commodity/dtlcommodity',
    component: DtlcommodityComponent
  },
  {
    path: 'commodityCategory',
    component: CommodityCategoryComponent
  },
  {
    path: 'tag',
    component: TagComponent
  },
  {
    path: 'tag/addtag',
    component: AddtagComponent
  },
  {
    path: 'tag/edittag',
    component: EdittagComponent
  },
  {
    path: 'tag/addtagpro',
    component: AddtagproComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcmRoutingModule {
}
