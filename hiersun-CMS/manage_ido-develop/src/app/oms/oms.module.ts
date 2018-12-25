import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OmsRoutingModule } from './oms-routing.module';
import { OrderComponent } from './order/order.component';
import { SalesorderComponent } from './salesorder/salesorder.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { SaledetailComponent } from './saledetail/saledetail.component';
import { PackageComponent } from './package/package.component';
import { ReturnrequestComponent } from './returnrequest/returnrequest.component';
import { ReturnorderComponent } from './returnorder/returnorder.component';
import { RejectedreturnComponent } from './rejectedreturn/rejectedreturn.component';
import { ReturndetailComponent } from './returndetail/returndetail.component';
import { ReviewreturnComponent } from './reviewreturn/reviewreturn.component';
import { SignedreturnComponent } from './signedreturn/signedreturn.component';
import { RefundmoneyComponent } from './refundmoney/refundmoney.component';
import { ReviewrefundComponent } from './reviewrefund/reviewrefund.component';
import { ShipreturnComponent } from './shipreturn/shipreturn.component';
import { OmsService } from '../services/oms.service';
import { DeliverychildviewComponent } from './deliveryChildView/deliverychildview.component';
import { AbnormalorderComponent } from './abnormalorder/abnormalorder.component';
import { ApplydetailComponent } from './applydetail/applydetail.component';
import { OperationsComponent } from './operations/operations.component';
import { BPaymentNoticeComponent } from './bpayment_notice/bpayment_notice.component';
import { VerifypriceComponent } from './custom/verifyprice/verifyprice.component';
import { OrderformComponent } from './custom/orderform/orderform.component';
import { PricelistComponent } from './custom/pricelist/pricelist.component';
import { DetailformComponent } from './custom/detailform/detailform.component';
import { ActivitiEditorComponent } from './activiti_editor/activiti_editor.component';
import { AddModelInfoComponent } from './activiti_editor/add-model-info/add-model-info.component';
import { EditModelInfoComponent } from './activiti_editor/edit-model-info/edit-model-info.component';
import { ReservestatusComponent } from './reserveorder/reservemanage/reservestatus/reservestatus.component';
import { ReserveactiveComponent } from './reserveorder/reservemanage/reserveactive/reserveactive.component';
import { AddstatusComponent } from './reserveorder/reservemanage/reservestatus/addstatus/addstatus.component';
import { AddreserveactiveComponent } from './reserveorder/reservemanage/reserveactive/addreserveactive/addreserveactive.component';
import { ReservelistComponent } from './reserveorder/reservelist/reservelist.component';
import { ReservedetailComponent } from './reserveorder/reservelist/reservedetail/reservedetail.component';
import { AddreserveorderComponent } from './reserveorder/reservelist/addreserveorder/addreserveorder.component';
import { StoreaccountComponent } from './store/storeaccount/storeaccount.component';
import { EditacountComponent } from './store/storeaccount/editacount/editacount.component';
import { KefureservelistComponent } from './reserveorder/reservelist/kefureservelist/kefureservelist.component';
import { ReclaimreserveirderComponent } from './reserveorder/reservelist/reclaimreserveirder/reclaimreserveirder.component';
import { KefureservemanageComponent } from './reserveorder/reservelist/kefureservemanage/kefureservemanage.component';
import { KefureservedetailComponent } from './reserveorder/reservelist/kefureservedetail/kefureservedetail.component';
import { RecoveryreservelistComponent } from './reserveorder/reservelist/recoveryreservelist/recoveryreservelist.component';
import { VerifyComponent } from './store/confirm/verify/verify.component';
import { ReserveComponent } from './store/confirm/reserve/reserve.component';
import { CredetailComponent } from './store/confirm/reserve/credetail/credetail.component';
import { ScoreComponent } from './store/confirm/score/score.component';
import { ReserveordersroreComponent } from './reserveorder/reserveordersrore/reserveordersrore.component';
import { ScoredetailComponent } from './reserveorder/reserveordersrore/scoredetail/scoredetail.component';
import { TotalscoreComponent } from './reserveorder/reserveordersrore/totalscore/totalscore.component';
import { SalelistComponent } from './reserveorder/reserveordersale/salelist/salelist.component';
import { ShoptotalscoreComponent } from './store/confirm/score/shoptotalscore/shoptotalscore.component';
import { ReturnagioComponent } from './returnagio/returnagio.component';
import { AddreagioComponent } from './returnagio/addreagio/addreagio.component';
import { GiftComponent } from './gift/gift.component';
import { AddgiftComponent } from './gift/addgift/addgift.component';
import { GiftmodalComponent } from './gift/giftmodal/giftmodal.component';
import { ReviewgiftComponent } from './gift/reviewgift/reviewgift.component';
import { ActBizModelComponent } from './act-biz-model/act-biz-model.component';
import { ReturnrefundsComponent } from './returnrefunds/returnrefunds.component';
import { ShipmodalComponent } from './returnrefunds/shipmodal/shipmodal.component';
import { RejectedmodalComponent } from './returnrefunds/rejectedmodal/rejectedmodal.component';
import { SignedmodalComponent } from './returnrefunds/signedmodal/signedmodal.component';
import { SendgiftComponent } from './gift/sendgift/sendgift.component';
import { EditformComponent } from './custom/editform/editform.component';
import { EditgiftComponent } from './gift/editgift/editgift.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomeredComponent } from './customer/customered/customered.component';
import { TradedetailComponent } from './tradedetail/tradedetail.component';
import { ReviewagioComponent } from './returnagio/reviewagio/reviewagio.component';
import { BpayreviewComponent } from './bpayreview/bpayreview.component';
import { EditreagioComponent } from './returnagio/editreagio/editreagio.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  imports: [
    CommonModule,
    OmsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  declarations: [
    OrderComponent,
    SalesorderComponent,
    OrderdetailComponent,
    SaledetailComponent,
    PackageComponent,
    ReturnrequestComponent,
    ReturnorderComponent,
    RejectedreturnComponent,
    ReturndetailComponent,
    ReviewreturnComponent,
    SignedreturnComponent,
    RefundmoneyComponent,
    ReviewrefundComponent,
    ShipreturnComponent,
    DeliverychildviewComponent,
    AbnormalorderComponent,
    ApplydetailComponent,
    OperationsComponent,
    BPaymentNoticeComponent,
    OrderformComponent,
    VerifypriceComponent,
    PricelistComponent,
    DetailformComponent,
    ActivitiEditorComponent,
    OrderComponent,
    SalesorderComponent,
    OrderdetailComponent,
    SaledetailComponent,
    PackageComponent,
    ReturnrequestComponent,
    ReturnorderComponent,
    RejectedreturnComponent,
    ReturndetailComponent,
    ReviewreturnComponent,
    SignedreturnComponent,
    RefundmoneyComponent,
    ReviewrefundComponent,
    ReservestatusComponent,
    ReserveactiveComponent,
    AddstatusComponent,
    AddreserveactiveComponent,
    ReservelistComponent,
    ReservedetailComponent,
    AddreserveorderComponent,
    StoreaccountComponent,
    EditacountComponent,
    VerifyComponent,
    ReserveComponent,
    ScoreComponent,
    CredetailComponent,
    KefureservelistComponent,
    ReclaimreserveirderComponent,
    KefureservemanageComponent,
    KefureservedetailComponent,
    RecoveryreservelistComponent,
    ReserveordersroreComponent,
    ScoredetailComponent,
    TotalscoreComponent,
    SalelistComponent,
    ShoptotalscoreComponent,
    ReturnagioComponent,
    AddreagioComponent,
    AddModelInfoComponent,
    EditModelInfoComponent,
    GiftComponent,
    AddgiftComponent,
    GiftmodalComponent,
    ReviewgiftComponent,
    ActBizModelComponent,
    ReturnrefundsComponent,
    ShipmodalComponent,
    RejectedmodalComponent,
    SignedmodalComponent,
    SendgiftComponent,
    EditformComponent,
    EditgiftComponent,
    CustomerComponent,
    CustomeredComponent,
    TradedetailComponent,
    ReviewagioComponent,
    BpayreviewComponent,
    EditreagioComponent,
    MaintenanceComponent,
    SendgiftComponent
  ],
  providers: [OmsService],
})
export class OmsModule {
}
