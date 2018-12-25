import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-refundmsgdetail',
  templateUrl: './refundmsgdetail.component.html',
  styleUrls: ['./refundmsgdetail.component.css']
})
export class RefundmsgdetailComponent implements OnInit {
  couponAmount:any;       //优惠券金额
  createTime:any;         //创建时间
  enabled:any;            //退款交易状态0删除1有效
  mchCouponAmount:any;    //商家优惠金额
  mchId:any;              //商家id
  mchOrderNo:any;         //订单号
  mchRefundNo:any;        //商户退款单号
  poundageAmount:any;     //手续费
  refundAmount:any;       //退款金额
  refundOrderId:any;      //退款订单id
  refundSuccTime:any;     //退款成功时间
  refundTime:any;         //退款时间
  sid:any;                //退款交易信息
  status:any;             //退款单状态-1退款失败0初始化1发起退款2退款成功状态
  uid:any;                //用户id
  updateTime:any;         //修改时间
  version:any;            //版本
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
      let businesdetail = '/api/v1/pay-mgr/payRefundTrade/queryPayRefundTradeBySid/' + that.sid;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.couponAmount=data['data'].couponAmount;       //优惠券金额
            that.createTime=data['data'].createTime;         //创建时间
            ///that.enabled=data['data'].enabled;            //退款交易状态0删除1有效
            if(data['data'].enabled==0){
              that.enabled="删除"
            }else{
              that.enabled="有效"
            }
            that.mchCouponAmount=data['data'].mchCouponAmount;    //商家优惠金额
            that.mchId=data['data'].mchId;              //商家id
            that.mchOrderNo=data['data'].mchOrderNo;         //订单号
            that.mchRefundNo=data['data'].mchRefundNo;        //商户退款单号
            that.poundageAmount=data['data'].poundageAmount;     //手续费
            that.refundAmount=data['data'].refundAmount;       //退款金额
            that.refundOrderId=data['data'].refundOrderId;      //用户ID
            that.refundSuccTime=data['data'].refundSuccTime;     //退款成功时间
            that.refundTime=data['data'].refundTime;         //退款时间
            that.sid=data['data'].sid;                //退款交易信息
            //that.status=data['data'].status;             //退款单状态-1退款失败0初始化1发起退款2退款成功状态
            if(data['data'].status==-1){
              that.status="退款失败"
            }else if(data['data'].status==0){
              that.status="初始化"
            }else if(data['data'].status==1){
              that.status="发起退款"
            }else if(data['data'].status==2){
              that.status="退款成功"
            }
            that.uid=data['data'].uid;                //用户id
            that.updateTime=data['data'].updateTime;         //修改时间
            that.version=data['data'].version;            //版本
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
    that.router.navigateByUrl('pay/refundmsg?page='+that.nextpage);
  }

}
