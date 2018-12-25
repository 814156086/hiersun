import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-alipaydetail',
  templateUrl: './alipaydetail.component.html',
  styleUrls: ['./alipaydetail.component.css']
})
export class AlipaydetailComponent implements OnInit {
  buyerLogonId:any;           //买家支付宝账号
  buyerPayAmount:any;         //付款金额
  buyerUserId:any;            //买家支付宝用户号
  discountGoodsDetail:any;    //本次交易支付所使用的单品券优惠的商品优惠信息
  fundBillList:any;           //交易支付使用的资金单据列表
  cardBalance:any;            //支付宝卡余额
  gmtPayment:any;             //交易付款时间
  invoiceAmount:any;          //开票金额
  notifyType:any;             //通知类型
  orderTradeNo:any;           //订单号
  pointAmount:any;            //集分宝金额
  receiptAmount:any;          //实收金额
  totalAmount:any;            //订单金额，交易金额
  storeName:any;              //发生支付交易的商户门店名称
  tradeNo:any;                //支付宝交易号
  sid:any;
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      that.nextpage=data.page;
      that.sid = data.id;//商户id
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled","disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    that.aliplydetail();
  }
  aliplydetail(){
    let that=this;
    if (that.sid) {//查看和编辑
      let businesdetail = '/api/v1/pay-mgr/alipayNotifyLog/queryAlipayNotifyLogBySid/' + that.sid;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.buyerLogonId=data['data'].buyerLogonId           //买家支付宝账号
            that.buyerPayAmount=data['data'].buyerPayAmount         //付款金额
            that.buyerUserId=data['data'].buyerUserId           //买家支付宝用户号
            that.discountGoodsDetail=data['data'].discountGoodsDetail    //本次交易支付所使用的单品券优惠的商品优惠信息
            that.fundBillList=data['data'].fundBillList           //交易支付使用的资金单据列表
            that.cardBalance=data['data'].cardBalance           //支付宝卡余额
            that.gmtPayment=data['data'].gmtPayment            //交易付款时间
            that.invoiceAmount=data['data'].invoiceAmount          //开票金额
            that.notifyType=data['data'].notifyType            //通知类型
            that.orderTradeNo=data['data'].orderTradeNo         //订单号
            that.pointAmount=data['data'].pointAmount           //集分宝金额
            that.receiptAmount=data['data'].receiptAmount          //实收金额
            that.totalAmount=data['data'].totalAmount           //订单金额，交易金额
            that.storeName=data['data'].storeName             //发生支付交易的商户门店名称
            that.tradeNo=data['data'].tradeNo             //支付宝交易号
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        },
        err => {
          that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      )
    }else{//新添加
      that.isload = false;
    }
  }
  goback() {
    let that=this;
    that.router.navigateByUrl('pay/alipay?page='+that.nextpage);
  }
}
