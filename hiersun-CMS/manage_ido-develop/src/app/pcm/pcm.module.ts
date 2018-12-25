import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortablejsModule } from 'angular-sortablejs';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { PcmRoutingModule } from './pcm-routing.module';
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
import { AttributeComponent } from './attribute/attribute.component';
import { AddattributeComponent } from './attribute/addattribute/addattribute.component';
import { EditattributeComponent } from './attribute/editattribute/editattribute.component';
import { DispcategoryComponent } from './dispcategory/dispcategory.component';
import { ProductComponent } from './product/product.component';
import { AddproductComponent } from './product/addproduct/addproduct.component';
import { StockComponent } from './stock/stock.component';
import { CommodityComponent } from './commodity/commodity.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { EditproductComponent } from './product/editproduct/editproduct.component';
import { DtlproductComponent } from './product/dtlproduct/dtlproduct.component';
import { CommodityCategoryComponent } from './commodityCategory/commodcategory.component';
import { EditcommodityComponent } from './commodity/editcommodity/editcommodity.component';
import { DtlcommodityComponent } from './commodity/dtlcommodity/dtlcommodity.component';
import { ProductService } from '../services/product.service';
import { TagComponent } from './tag/tag.component';
import { AddtagComponent } from './tag/addtag/addtag.component';
import { EdittagComponent } from './tag/edittag/edittag.component';
import { AddtagproComponent } from './tag/addtagpro/addtagpro.component';
import { EditstockComponent } from './stock/editstock/editstock.component';
import { RegionComponent } from './region/region.component';
import { AddregionComponent } from './region/addregion/addregion.component';
import { EditregionComponent } from './region/editregion/editregion.component';
import { SkupriceComponent } from './product/skuprice/skuprice.component';
import { IsskupriceComponent } from './product/isskuprice/isskuprice.component';
import { SkumanageComponent } from './skumanage/skumanage.component';
import { OrganizationComponent } from './organization/organization.component';
import { DetailskuComponent } from './skumanage/detailsku/detailsku.component';
import { EditskuComponent } from './skumanage/editsku/editsku.component';
@NgModule({
  imports: [
    CommonModule,
    PcmRoutingModule,
    CKEditorModule,
    FormsModule,
    SortablejsModule,
    NgZorroAntdModule
  ],
  declarations: [BrandComponent, AddbrandComponent, EditbrandComponent, ChannelComponent, AddchannelComponent, EditchannelComponent, CompanyComponent, AddcompanyComponent, EditcompanyComponent, StoreComponent, AddstoreComponent, EditstoreComponent, AttributeComponent, AddattributeComponent, EditattributeComponent, DispcategoryComponent, ProductComponent, AddproductComponent, StockComponent, CommodityComponent, EditproductComponent, DtlproductComponent, CommodityCategoryComponent, EditcommodityComponent, DtlcommodityComponent, TagComponent, AddtagComponent, EdittagComponent, AddtagproComponent, EditstockComponent, RegionComponent, AddregionComponent, EditregionComponent, SkupriceComponent, IsskupriceComponent, SkumanageComponent, OrganizationComponent, DetailskuComponent, EditskuComponent],
  providers: [ProductService],
})
export class PcmModule { }
