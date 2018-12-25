import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
import {AlipayComponent} from './journal/alipay/alipay.component';
import {WechatComponent} from './journal/wechat/wechat.component';
import {AddpaytypeComponent} from './paytype/addpaytype/addpaytype.component';
import {AlipaydetailComponent} from './journal/alipay/alipaydetail/alipaydetail.component';
import {WechatdetailComponent} from './journal/wechat/wechatdetail/wechatdetail.component';
import {AddpaymediumComponent} from './paymedium/addpaymedium/addpaymedium.component';
import {PaymediumdetailComponent} from './paymedium/paymediumdetail/paymediumdetail.component';
import {SeconedpaymediumComponent} from './paymedium/seconedpaymedium/seconedpaymedium.component';
import {TransactionmsgComponent} from './transactionmsg/transactionmsg.component';
import {TransactionmsgdetailComponent} from './transactionmsg/transactionmsgdetail/transactionmsgdetail.component';
import {RefundorderComponent} from './refundorder/refundorder.component';
import {RefundmsgComponent} from './refundmsg/refundmsg.component';
import {RefundorderdetailComponent} from './refundorder/refundorderdetail/refundorderdetail.component';
import {RefundmsgdetailComponent} from './refundmsg/refundmsgdetail/refundmsgdetail.component';
import {HistorydetailComponent} from './historydetail/historydetail.component';
import { ApplyComponent } from './apply/apply.component';
import { ZfbapplylistComponent } from './zfbapplylist/zfbapplylist.component';
import { WxapplyComponent } from './wxapply/wxapply.component';
const routes: Routes = [
  {
    path: 'financial',
    loadChildren: './financial/financial.module#FinancialModule'
  },
  {
    path: 'businessinfo',
    component: BusinessinfoComponent
  },
  {
    path: 'addbusiness',
    component: AddbusinessComponent
  },
  {
    path: 'paymethod',
    component: PaymethodComponent
  },
  {
    path: 'addchannel',
    component: AddchannelComponent
  },
  {
    path: 'businessmsg',
    component: BusinessmsgComponent
  },
  {
    path: 'businessmsgdetail',
    component: BusinessmsgdetailComponent
  },
  {
    path: 'paymanage',
    component: PaymanageComponent
  },
  {
    path: 'transactionmsg',
    component: TransactionmsgComponent
  },
  {
    path: 'transactionmsgdetail',
    component: TransactionmsgdetailComponent
  },
  {
    path: 'paydetail',
    component: PaydetailComponent
  },
  {
    path: 'paytype',
    component: PaytypeComponent
  },
  {
    path: 'addpaytype',
    component: AddpaytypeComponent
  },
  {
    path: 'paymedium',
    component: PaymediumComponent
  },
  {
    path: 'addpaymedium',
    component: AddpaymediumComponent
  },
  {
    path: 'paymediumdetail',
    component: PaymediumdetailComponent
  },
  {
    path: 'seconedpaymedium',
    component: SeconedpaymediumComponent
  },
  {
    path: 'alipay',
    component: AlipayComponent
  },
  {
    path: 'alipaydetail',
    component: AlipaydetailComponent
  },
  {
    path: 'wechat',
    component: WechatComponent
  },
  {
    path: 'wechatdetail',
    component: WechatdetailComponent
  },
  {
    path: 'refundorder',
    component: RefundorderComponent
  },
  {
    path: 'refundmsg',
    component: RefundmsgComponent
  },
  {
    path: 'refundorderdetail',
    component: RefundorderdetailComponent
  },
  {
    path: 'refundmsgdetail',
    component: RefundmsgdetailComponent
  },
  {
    path: 'historydetail',
    component: HistorydetailComponent
  },
  {
    path: 'apply',
    component: ApplyComponent
  },
  {
    path: 'zfbapplylist',
    component: ZfbapplylistComponent
  },
  {
    path: 'wxapply',
    component: WxapplyComponent
  },
  {
    path: '',
    redirectTo: 'businessinfo',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayRoutingModule {
}
