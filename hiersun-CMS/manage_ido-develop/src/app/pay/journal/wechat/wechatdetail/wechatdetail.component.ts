import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-wechatdetail',
  templateUrl: './wechatdetail.component.html',
  styleUrls: ['./wechatdetail.component.css']
})
export class WechatdetailComponent implements OnInit {
  appid:any;      //
  attach:any;     //商家数据包
  bankType:any;   //付款银行
  cashFee:any;    //现金支付金额
  cashFeeType:any;//现金支付货币类型
  couponCount:any;//代金券使用数量
  couponFee:any;  //总代金券金额
  deviceInfo:any; //设备号
  errorCode:any;
  errorCodeDes:any;
  feeType:any;     //货币种类
  mchId:any;       //商户id
  /* nonceStr:any; */
  openid:any;
  outTradeNo:any;   //订单号
 resultCode:any;
  returnCode:any;
  returnMsg:any;
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
    that.wechatdetail();
  }
  wechatdetail(){
    let that=this;
    if (that.sid) {//查看和编辑
      let businesdetail = '/api/v1/pay-mgr/wxpayNotifyLog/queryWxpayNotifyLogByCode/' + that.sid;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.appid=data['data'].appid;      //
            that.attach=data['data'].attach;     //商家数据包
            that.bankType=data['data'].bankType;   //付款银行
            that.cashFee=data['data'].cashFee;    //现金支付金额
            that.cashFeeType=data['data'].cashFeeType;//现金支付货币类型
            that.couponCount=data['data'].couponCount;//代金券使用数量
            that.couponFee=data['data'].couponFee;  //总代金券金额
            that.deviceInfo=data['data'].deviceInfo; //设备号
            that.errorCode=data['data'].errorCode;
            that.errorCodeDes=data['data'].errorCodeDes;
            that.feeType=data['data'].feeTypel;     //货币种类
            that.mchId=data['data'].mchId;       //商户id
            /* that.nonceStr=data['data'].nonceStr */
            that.outTradeNo=data['data'].outTradeNo;   //订单号
            
            if(data['data'].resultCode==null || data['data'].resultCode==""){
              that.resultCode='--';
            }else{
              that.resultCode=data['data'].resultCode;
            }
            if(data['data'].returnCode==null || data['data'].returnCode==""){
              that.returnCode='--';
            }else{
              that.returnCode=data['data'].returnCode;
            }
            if(data['data'].returnMsg==null || data['data'].returnMsg==""){
              that.returnMsg='--';
            }else{
              that.returnMsg=data['data'].returnMsg;
            }
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
    that.router.navigateByUrl('pay/wechat?page='+that.nextpage);
  }
}
