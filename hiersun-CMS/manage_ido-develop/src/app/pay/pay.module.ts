import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PayRoutingModule} from './pay-routing.module';
import {BusinessinfoComponent} from './businessinfo/businessinfo.component';
import {AddbusinessComponent} from './addbusiness/addbusiness.component';
import {PaymethodComponent} from './paymethod/paymethod.component';
import {AddchannelComponent} from './addchannel/addchannel.component';
import {BusinessmsgComponent} from './businessmsg/businessmsg.component';
import {BusinessmsgdetailComponent} from './businessmsgdetail/businessmsgdetail.component';
import {PaymanageComponent} from './paymanage/paymanage.component';
import {PaydetailComponent} from './paydetail/paydetail.component';
import {PaytypeComponent} from './paytype/paytype.component';
import {PaymediumComponent} from './paymedium/paymedium.component';
import {JournalComponent} from './journal/journal.component';
import {AlipayComponent} from './journal/alipay/alipay.component';
import {WechatComponent} from './journal/wechat/wechat.component';
import {AddpaytypeComponent} from './paytype/addpaytype/addpaytype.component';
import {AlipaydetailComponent} from './journal/alipay/alipaydetail/alipaydetail.component';
import {WechatdetailComponent} from './journal/wechat/wechatdetail/wechatdetail.component';
import {AddpaymediumComponent} from './paymedium/addpaymedium/addpaymedium.component';
import {PaymediumdetailComponent} from './paymedium/paymediumdetail/paymediumdetail.component';
import {TransactionmsgComponent} from './transactionmsg/transactionmsg.component';
import {RefundorderComponent} from './refundorder/refundorder.component';
import {RefundmsgComponent} from './refundmsg/refundmsg.component';
import {SeconedpaymediumComponent} from './paymedium/seconedpaymedium/seconedpaymedium.component';
import {RefundorderdetailComponent} from './refundorder/refundorderdetail/refundorderdetail.component';
import {RefundmsgdetailComponent} from './refundmsg/refundmsgdetail/refundmsgdetail.component';
import {TransactionmsgdetailComponent} from './transactionmsg/transactionmsgdetail/transactionmsgdetail.component';
import {HistorydetailComponent} from './historydetail/historydetail.component';
import { ApplyComponent } from './apply/apply.component';
import { ZfbapplylistComponent } from './zfbapplylist/zfbapplylist.component';
import { WxapplyComponent } from './wxapply/wxapply.component';
import { MchmsgComponent } from './mchmsg/mchmsg.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PayRoutingModule
  ],
  declarations: [
    BusinessinfoComponent,
    AddbusinessComponent,
    PaymethodComponent,
    AddchannelComponent,
    BusinessmsgComponent,
    BusinessmsgdetailComponent,
    PaymanageComponent,
    PaydetailComponent,
    PaytypeComponent,
    PaymediumComponent,
    JournalComponent,
    AlipayComponent,
    WechatComponent,
    AddpaytypeComponent,
    AlipaydetailComponent,
    WechatdetailComponent,
    AddpaymediumComponent,
    PaymediumdetailComponent,
    TransactionmsgComponent,
    RefundorderComponent,
    RefundmsgComponent,
    SeconedpaymediumComponent,
    RefundorderdetailComponent,
    RefundmsgdetailComponent,
    TransactionmsgdetailComponent,
    HistorydetailComponent,
    ApplyComponent,
    ZfbapplylistComponent,
    WxapplyComponent,
    MchmsgComponent
  ]
})
export class PayModule {
}
