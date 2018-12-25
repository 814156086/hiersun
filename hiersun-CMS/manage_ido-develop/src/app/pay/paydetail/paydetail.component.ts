import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-paydetail',
  templateUrl: './paydetail.component.html',
  styleUrls: ['./paydetail.component.css']
})
export class PaydetailComponent implements OnInit {
  payOrderNo:any;                   //支付单号： 
  businessid:any;                  //商户ID： 
  businessno:any;                  //商户单号： 
  money:any;                       //金额(元)： 
  currency:any;                    //币种： 
  orderstatus:any;                 //订单状态： 
  businesstitle:any;               //商品标题： 
  businessconent:any;              //商品内容： 
  channelid:any;                   //渠道商户ID： 
  channelno:any;                   //渠道单号： 
  errorno:any;                     //错误码： 
  errormsg:any;                    // 错误消息： 
  tzcanshu:any;                    //扩展参数： 
  canshu1:any;                     //参数1： 
  canshu2:any;                     //参数2： 
  mesaddress:any;                  //通知地址： 
  losetime:any;                    //失效时间： 
  successtime:any;                 //成功时间： 
  creattime:any;                   //创建时间： 
  updatetime:any;                  //更新时间：
  pid:any;                         //支付平台
  mchChannel:any;                  //销售渠道
  payChannel:any;                  //支付渠道
  clientIp:any;                    //客户的ip
  device:any;                      //设备
  notifyCount:any;                 //通知次数
  sid:any;
  pagetype:any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
     
    })
  }
  ngOnInit() {
    let that=this;
    $(".form-control").attr("disabled","disabled")
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.nextpage=data.page;
      that.payOrderNo=data.payorderid;
      that.sid=data.sid;
    })
    //查询接口
    let qudaourl="";
    if(that.sid){
      qudaourl='/api/v1/pay-mgr/payOrderHistory/queryPayOrderHistoryById/'+that.sid;
    }
    if(that.payOrderNo){
      qudaourl='/api/v1/pay-mgr/payOrder/queryPayOrderByCode/'+that.payOrderNo;
    }
    console.log(qudaourl)
    this.http.get(qudaourl).subscribe(
      data=>{
        console.log("11")
        console.log(data);
        if(data['code'] == 200){
          that.isload = false;
          that.payOrderNo=data['data'].payOrderNo;                   //支付单号： 
          that.businessid=data['data'].mchId;                  //商户ID： 
          that.businessno=data['data'].mchOrderNo;                //商户单号： 
          that.money=data['data'].amount;                    //金额(元)： 
          that.currency=data['data'].currency;                    //币种： 
          that.orderstatus=data['data'].status;              //订单状态： 
          that.pid=data['data'].pid;                   //支付平台
          that.mchChannel=data['data'].mchChannel;     //销售渠道
          that.payChannel=data['data'].payChannel;     //支付渠道
          that.clientIp=data['data'].clientIp;         //客户的ip
          that.device=data['data'].device;             //设备
          that.notifyCount=data['data'].notifyCount;    //通知次数
          if(data['data'].status==0){
            that.orderstatus="订单生成"
          }else if(data['data'].status==1){
            that.orderstatus="支付中"
          }else if(data['data'].status==2){
            that.orderstatus="支付成功"
          }
          else if(data['data'].status==3){
            that.orderstatus="业务处理完成"
          }
          that.businesstitle=data['data'].subject;              //商品标题： 
          that.businessconent=data['data'].body;            //商品内容： 
          that.channelno=data['data'].channelPayOrderNo;                  //渠道单号： 
          //that.errorno=data['data'].errCode;                   //错误码： 
          if(data['data'].errCode==null){
            that.errorno='--'
          }else{
            that.errorno=data['data'].errCode
          }
          //that.errormsg=data['data'].errMsg;                   // 错误消息： 
          if(data['data'].errMsg==null){
            that.errormsg='--'
          }else{
            that.errormsg=data['data'].errMsg
          }
          that.tzcanshu=data['data'].extra;                   //扩展参数： 
          //that.canshu1=data['data'].param1;                    //参数1：
          if(data['data'].param1=="" || data['data'].param1==null){
            that.canshu1='--'
          }else{
            that.canshu1=data['data'].param1;
          }
          //that.canshu2=data['data'].param2;                   //参数2：
          if(data['data'].param2=="" || data['data'].param2==null){
            that.canshu2='--'
          }else{
            that.canshu2=data['data'].param2;
          } 
          //that.mesaddress=data['data'].notifyUrl;                  //通知地址：
          if(data['data'].notifyUrl=="" || data['data'].notifyUrl==null){
            that.mesaddress='--'
          }else{
            that.mesaddress=data['data'].notifyUrl;
          }
          that.losetime=data['data'].expireTime;                  //失效时间： 
          that.successtime=data['data'].paySuccTime;                //成功时间：
          that.creattime=data['data'].createTime;                   //创建时间： 
          that.updatetime=data['data'].updateTime;                  //更新时间
          
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      }
    )
  }
  goback() {
    let that=this;
    that.router.navigateByUrl('pay/paymanage?page='+that.nextpage);
  }
}