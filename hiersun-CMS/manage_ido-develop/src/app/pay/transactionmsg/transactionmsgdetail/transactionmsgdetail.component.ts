import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-transactionmsgdetail',
  templateUrl: './transactionmsgdetail.component.html',
  styleUrls: ['./transactionmsgdetail.component.css']
})
export class TransactionmsgdetailComponent implements OnInit {
  actualAmount:any;           //实际支付金额
  client:any;                 //客户端ip或消息编号
  clientType:any;             //终端类型
  comm:any;                   //订单备注
  content:any;                //订单内容
  couponAmount:any;           //使用优惠券抵扣金额
  createTime:any;             //创建时间
  discountAmount:any;         //折扣金额
  enabled:any;                //交易信息状态,0删除,1有效
  mchCouponAmount:any;        //商家优惠金额
  mchId:any;                   //商户id
  mchOrderNo:any;              //商户订单号
  payAmount:any;               //待支付金额
  pointAmount:any;             //积分对应金额
  poundageAmount:any;          //手续费
  sid:any;                     //用户id
  status:any;                  //订单状态 "支付状态,0-订单生成,1-支付中(目前未使用),2-支付成功,3-业务处理完成"
  totalAmount:any;             //总金额
  tradeSuccTime:any;           //订单成功时间
  tradeTime:any;               //订单创建时间
  type:any;                    //订单类型,1线上,2线下
  uid:any;                     //用户id
  updateTime:any;              //修改时间
  version:any;                 //版本
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      that.nextpage=data.page;
      that.sid = data.id;//商户id
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
    if (that.sid) {//查看和编辑
      let businesdetail = '/api/v1/pay-mgr/payTrade/queryPayTradeBySid/' + that.sid;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
             //实际支付金额
            if(data['data'].actualAmount==null){
              that.actualAmount='--'
            }else{
              that.actualAmount=data['data'].actualAmount
            }
            that.client=data['data'].client                 //客户端ip或消息编号
            that.clientType=data['data'].clientType             //终端类型
            //订单备注
            if(data['data'].comm==null){
              that.comm='--'
            }else{
              that.comm=data['data'].comm
            }
            //订单内容
            if(data['data'].content==null){
              that.content='--'
            }else{
              that.content=data['data'].content
            }
            //使用优惠券抵扣金额
            if(data['data'].couponAmount==null || data['data'].couponAmount==""){
              that.couponAmount='--'
            }else{
              that.couponAmount=data['data'].couponAmount 
            }
            that.createTime=data['data'].createTime             //创建时间
            //折扣金额
            if(data['data'].discountAmount==null && data['data'].discountAmount==""){
              that.discountAmount='--'
            }else{
              that.discountAmount=data['data'].discountAmount
            }
            //that.enabled=data['data'].enabled                //交易信息状态,0删除,1有效
            if(data['data'].enabled==0){
              that.enabled="删除"
            }else{
              that.enabled="有效"
            }
            //商家优惠金额
            if(data['data'].mchCouponAmount==null || data['data'].mchCouponAmount==""){
              that.mchCouponAmount='--'
            }else{
              that.mchCouponAmount=data['data'].mchCouponAmount
            }
            that.mchId=data['data'].mchId                   //商户id
            that.mchOrderNo=data['data'].mchOrderNo              //商户订单号
            that.payAmount=data['data'].payAmount               //待支付金额
            that.pointAmount=data['data'].pointAmount             //积分对应金额
            that.poundageAmount=data['data'].poundageAmount          //手续费
            that.sid=data['data'].sid                     //用户id
            //that.status=data['data'].status                  //订单状态 -1关闭,0初始化,1等待付款,2支付成功,3退款申请,4部分退款申请,5退款完成,6部分退款完成
            if(data['data'].status==-1){
              that.status="关闭"
            }else if(data['data'].status==0){
              that.status="初始化"
            }else if(data['data'].status==1){
              that.status="等待付款"
            }else if(data['data'].status==2){
              that.status="支付成功"
            }else if(data['data'].status==3){
              that.status="退款申请"
            }else if(data['data'].status==4){
              that.status="部分退款申请"
            }else if(data['data'].status==5){
              that.status="退款完成"
            }else if(data['data'].status==6){
              that.status="部分退款完成"
            }
            that.totalAmount=data['data'].totalAmount             //总金额
            that.tradeSuccTime=data['data'].tradeSuccTime           //订单成功时间
            that.tradeTime=data['data'].tradeTime               //订单创建时间
            //that.type=data['data'].type                    //订单类型,1线上,2线下
            if(data['data'].type==1){
              that.type="线上"
            }else{
              that.type="线下"
            }
            that.uid=data['data'].uid                     //用户id
            that.updateTime=data['data'].updateTime              //修改时间
            that.version=data['data'].version                 //版本
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
    let that=this;
    that.router.navigateByUrl('pay/transactionmsg?page='+that.nextpage);
  }
}
