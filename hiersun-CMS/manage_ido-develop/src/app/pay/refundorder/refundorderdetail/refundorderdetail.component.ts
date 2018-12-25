import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-refundorderdetail',
  templateUrl: './refundorderdetail.component.html',
  styleUrls: ['./refundorderdetail.component.css']
})
export class RefundorderdetailComponent implements OnInit {
  channelErrCode: any;          //渠道错误码
  channelErrMsg: any;           //渠道错误描述
  channelId: any;               //渠道ID
  channelMchId: any;            //渠道商户ID
  channelOrderNo: any;          //渠道订单号
  channelPayOrderNo: any;       //渠道订单号
  channelUser: any;             //渠道用户标识,如微信openId,支付宝账号
  clientIp: any;                //客户端IP
  createTime: any;              //创建时间
  currency: any;                //三位货币代码,人民币:cny
  device: any;                  //设备
  expireTime: any;              //订单失效时间
  extra: any;                    //特定渠道发起时额外参数
  mchId: any;                    //商户ID
  mchRefundNo: any;              //商户退款单号
  notifyUrl: any;                //通知地址
  param1: any;                   //扩展参数1"
  param2: any;                   //扩展参数1"
  payAmount: any;                 //支付金额,单位分
  payOrderId: any;                //支付订单号
  refundAmount: any;              //退款金额,单位分
  refundOrderId: any;             //退款订单号
  refundSuccTime: any;            //订单退款成功时间
  remarkInfo: any;                 //备注
  result: any;                     //退款结果:0-不确认结果,1-等待手动处理,2-确认成功,3-确认失败
  status: any;                     //退款状态:0-订单生成,1-退款中,2-退款成功,3-退款失败,4-业务处理完成
  updateTime: any;                 //更新时间
  username: any;                   //用户姓名
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage: any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      that.nextpage = data.page;
      that.refundOrderId = data.id;//商户id
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled", "disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    if (that.refundOrderId) {//查看和编辑
      let businesdetail = '/api/v1/pay-mgr/refundOrder/queryRefundOrderByCode/' + that.refundOrderId;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            //渠道错误码
            if(data['data'].channelErrCode==null || data['data'].channelErrCode==""){
              that.channelErrCode ='--'
            }else{
              that.channelErrCode = data['data'].channelErrCode 
            }
            //渠道错误描述
            if(data['data'].channelErrMsg==null || data['data'].channelErrMsg==""){
              that.channelErrMsg ='--'
            }else{
              that.channelErrMsg = data['data'].channelErrMsg 
            }          
            that.channelId = data['data'].channelId               //渠道ID
            that.channelMchId = data['data'].channelMchId            //渠道商户ID
            that.channelOrderNo = data['data'].channelOrderNo          //渠道订单号
            that.channelPayOrderNo = data['data'].channelPayOrderNo       //渠道订单号
            that.channelUser = data['data'].channelUser             //渠道用户标识,如微信openId,支付宝账号
            that.createTime = data['data'].createTime              //创建时间
            that.currency = data['data'].currency                //三位货币代码,人民币:cny
            //设备
            if(data['data'].device==null || data['data'].device==""){
              that.device ='--'
            }else{
              that.device = data['data'].device 
            }
            that.expireTime = data['data'].expireTime              //订单失效时间
            //客户端IP
            if(data['data'].clientIp==null || data['data'].clientIp==""){
              that.clientIp ='--'
            }else{
              that.clientIp = data['data'].clientIp 
            }
            //特定渠道发起时额外参数
            if(data['data'].extra==null || data['data'].extra==""){
              that.extra ='--'
            }else{
              that.extra = data['data'].extra 
            } 
            that.mchId = data['data'].mchId                    //商户ID
            that.mchRefundNo = data['data'].mchRefundNo              //商户退款单号
            //通知地址
            if(data['data'].notifyUrl==null || data['data'].notifyUrl==""){
              that.notifyUrl ='--'
            }else{
              that.notifyUrl = data['data'].notifyUrl 
            } 
            //扩展参数1"
            if(data['data'].param1==null || data['data'].param1==""){
              that.param1 ='--'
            }else{
              that.param1 = data['data'].param1 
            } 
            //扩展参数2"
            if(data['data'].param2==null || data['data'].param2==""){
              that.param2 ='--'
            }else{
              that.param2 = data['data'].param2 
            }
            that.payAmount = data['data'].payAmount                 //支付金额,单位分
            that.payOrderId = data['data'].payOrderId                //支付订单号
            that.refundAmount = data['data'].refundAmount              //退款金额,单位分
            that.refundOrderId = data['data'].refundOrderId             //退款订单号

            that.refundSuccTime = data['data'].refundSuccTime //退款成功时间
          
            //备注
            if(data['data'].remarkInfo==null || data['data'].remarkInfo==""){
              that.remarkInfo ='--'
            }else{
              that.remarkInfo = data['data'].remarkInfo 
            }
            //that.result=data['data'].result                     //退款结果:0-不确认结果,1-等待手动处理,2-确认成功,3-确认失败
            if (data['data'].result == 0) {
              that.result = "不确认结果"
            } else if (data['data'].result == 1) {
              that.result = "等待手动处理"
            } else if (data['data'].result == 2) {
              that.result = "确认成功"
            } else if (data['data'].result == 3) {
              that.result = "确认失败"
            }
            //that.status=data['data'].status                     //退款状态:0-订单生成,1-退款中,2-退款成功,3-退款失败,4-业务处理完成
            if (data['data'].status == 0) {
              that.status = "订单生成"
            } else if (data['data'].status == 1) {
              that.status = "退款中"
            } else if (data['data'].status == 2) {
              that.status = "退款成功"
            } else if (data['data'].status == 3) {
              that.status = "退款失败"
            } else if (data['data'].status == 3) {
              that.status = "业务处理完成"
            }
            that.updateTime = data['data'].updateTime                 //更新时间
            that.username = data['data'].username                   //用户姓名
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
    } else {//新添加
      that.isload = false;
    }
  }
  goback() {
    let that = this;
    that.router.navigateByUrl('pay/refundorder?page=' + that.nextpage);
  }
}
