import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderComponent } from './order/order.component';
import { SalesorderComponent } from './salesorder/salesorder.component';
import { PackageComponent } from './package/package.component';
import { ReturnrequestComponent } from './returnrequest/returnrequest.component';
import { ReturnorderComponent } from './returnorder/returnorder.component';
import { RejectedreturnComponent } from './rejectedreturn/rejectedreturn.component';
import { ReviewreturnComponent } from './reviewreturn/reviewreturn.component';
import { SignedreturnComponent } from './signedreturn/signedreturn.component';
import { RefundmoneyComponent } from './refundmoney/refundmoney.component';
import { ReviewrefundComponent } from './reviewrefund/reviewrefund.component';
import { ShipreturnComponent } from './shipreturn/shipreturn.component';
import { DeliverychildviewComponent } from './deliveryChildView/deliverychildview.component';
import { AbnormalorderComponent } from './abnormalorder/abnormalorder.component';
import { OperationsComponent } from './operations/operations.component';
import { BPaymentNoticeComponent } from './bpayment_notice/bpayment_notice.component';
import { ActivitiEditorComponent } from './activiti_editor/activiti_editor.component';
import { OrderformComponent } from './custom/orderform/orderform.component';
import { PricelistComponent } from './custom/pricelist/pricelist.component';
import { DetailformComponent } from './custom/detailform/detailform.component';
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
import { VerifyComponent } from './store/confirm/verify/verify.component';
import { ReserveComponent } from './store/confirm/reserve/reserve.component';
import { CredetailComponent } from './store/confirm/reserve/credetail/credetail.component';
import { ScoreComponent } from './store/confirm/score/score.component';
import { RecoveryreservelistComponent } from './reserveorder/reservelist/recoveryreservelist/recoveryreservelist.component';
import { ReserveordersroreComponent } from './reserveorder/reserveordersrore/reserveordersrore.component';
import { ScoredetailComponent } from './reserveorder/reserveordersrore/scoredetail/scoredetail.component';
import { TotalscoreComponent } from './reserveorder/reserveordersrore/totalscore/totalscore.component';
import { SalelistComponent } from './reserveorder/reserveordersale/salelist/salelist.component';
import { ShoptotalscoreComponent } from './store/confirm/score/shoptotalscore/shoptotalscore.component';
import { ReturnagioComponent } from './returnagio/returnagio.component';
import { AddModelInfoComponent } from './activiti_editor/add-model-info/add-model-info.component';
import { EditModelInfoComponent } from './activiti_editor/edit-model-info/edit-model-info.component';
import { GiftComponent } from './gift/gift.component';
import { AddgiftComponent } from './gift/addgift/addgift.component';
import { SendgiftComponent } from './gift/sendgift/sendgift.component';
import { EditgiftComponent } from './gift/editgift/editgift.component';
import { ActBizModelComponent } from './act-biz-model/act-biz-model.component';
import { ReturnrefundsComponent } from './returnrefunds/returnrefunds.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomeredComponent } from './customer/customered/customered.component';
import { ReviewgiftComponent } from './gift/reviewgift/reviewgift.component';
import { BpayreviewComponent } from './bpayreview/bpayreview.component';
import { ReviewagioComponent } from './returnagio/reviewagio/reviewagio.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [
  {
    path: 'returnrequest/:flag',
    component: ReturnrequestComponent
  },
  {
    path: 'order/:flag',
    component: OrderComponent
  },
  {
    path: 'abnormalorder',
    component: AbnormalorderComponent
  },
  {
    path: 'salesorder/:flag',
    component: SalesorderComponent
  },
  {
    path: 'returnorder/:flag',
    component: ReturnorderComponent
  },
  {
    path: 'package',
    component: PackageComponent
  },
  {
    path: 'returnrefunds',
    component: ReturnrefundsComponent
  },
  {
    path: 'rejectedreturn/:flag',
    component: RejectedreturnComponent
  },
  {
    path: 'reviewreturn',
    component: ReviewreturnComponent
  },
  {
    path: 'signedreturn/:flag',
    component: SignedreturnComponent
  },
  {
    path: 'refundmoney',
    component: RefundmoneyComponent
  },
  {
    path: 'reviewrefund',
    component: ReviewrefundComponent
  },
  {
    path: 'shipreturn/:flag',
    component: ShipreturnComponent
  },
  {
    path: 'deliveryChildView',
    component: DeliverychildviewComponent
  },
  {
    path: 'operations',
    component: OperationsComponent
  },
  {
    path: 'bpayment_notice',
    component: BPaymentNoticeComponent
  },
  {
    path: 'bpayment_notice/bpayreview',
    component: BpayreviewComponent
  },
  {
    path: 'pricelist',
    component: PricelistComponent
  },
  {
    path: 'pricelist/orderform',
    component: OrderformComponent
  },
  {
    path: 'pricelist/detailform',
    component: DetailformComponent
  },
  {
    path: 'activiti_editor',
    component: ActivitiEditorComponent
  },
  {
    path: 'reservestatus',
    component: ReservestatusComponent
  },
  {
    path: 'reserveactive',
    component: ReserveactiveComponent
  },
  {
    path: 'addstatus',
    component: AddstatusComponent
  },
  {
    path: 'addreserveactive',
    component: AddreserveactiveComponent
  },
  {
    path: 'reservelist',
    component: ReservelistComponent
  },
  {
    path: 'reservedetail',
    component: ReservedetailComponent
  },
  {
    path: 'addreserveorder',
    component: AddreserveorderComponent
  },
  {
    path: 'salelist',
    component: SalelistComponent
  },
  {
    path: 'storeaccount',
    component: StoreaccountComponent
  },
  {
    path: 'totalscore',
    component: TotalscoreComponent
  },
  {
    path: 'editacount',
    component: EditacountComponent
  },
  {
    path: 'kefureservelist',
    component: KefureservelistComponent
  },
  {
    path: 'reclaimreserveirder',
    component: ReclaimreserveirderComponent
  },
  {
    path: 'kefureservemanage',
    component: KefureservemanageComponent
  },
  {
    path: 'kefureservedetail',
    component: KefureservedetailComponent
  },
  {
    path: 'recoveryreservelist',
    component: RecoveryreservelistComponent
  },
  {
    path: 'reserveordersrore',
    component: ReserveordersroreComponent
  },
  {
    path: 'scoredetail',
    component: ScoredetailComponent
  },
  {
    path: 'verify',
    component: VerifyComponent
  },
  {
    path: 'reserve',
    component: ReserveComponent
  },
  {
    path: 'reserve/credetail',
    component: CredetailComponent
  },
  {
    path: 'score',
    component: ScoreComponent
  },
  {
    path: 'shoptotalscore',
    component: ShoptotalscoreComponent
  },
  {
    path: 'returnagio',
    component: ReturnagioComponent
  },
  {
    path: 'returnagio/reviewagio',
    component: ReviewagioComponent
  },
  {
    path: 'add_model_info/add-model-info',
    component: AddModelInfoComponent
  },
  {
    path: 'activiti_editor/edit-model-info',
    component: EditModelInfoComponent
  },
  {
    path: 'gift',
    component: GiftComponent
  },
  {
    path: 'gift/addgift',
    component: AddgiftComponent
  },
  {
    path: 'gift/sendgift',
    component: SendgiftComponent
  },
  {
    path: 'gift/editgift',
    component: EditgiftComponent
  },
  {
    path: 'gift/reviewgift',
    component: ReviewgiftComponent
  },
  {
    path: 'act-biz-model',
    component: ActBizModelComponent
  },
  {
    path: 'customer',
    component: CustomerComponent
  },
  {
    path: 'customered',
    component: CustomeredComponent
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmsRoutingModule { }
