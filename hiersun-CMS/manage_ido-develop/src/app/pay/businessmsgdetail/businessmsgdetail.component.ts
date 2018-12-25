import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-businessmsgdetail',
  templateUrl: './businessmsgdetail.component.html',
  styleUrls: ['./businessmsgdetail.component.css']
})
export class BusinessmsgdetailComponent implements OnInit {
  orderno:any;         //订单号
  businessid:any;      //商户id
  businessorderno:any; //商户单号
  ordertype:any;       //订单类型
  tzstatus:any;        //通知状态
  tzresult:any;        //通知结果
  tzadress:any;        //通知地址
  tzcount:any;         //通知次数
  lasttztime:any;      //最后通知
  creattime:any;       //创建时间
  updatetime:any;      //更新时间
  orderId:any;
  pagetype:any;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nextpage:any;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {}

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.nextpage=data.page;
      that.orderId=data.orderId;
      that.pagetype=data.type;
    })
    //查询商户信息
    let businessmeg='/api/v1/pay-mgr/mchNotify/queryMchNotifyById/'+that.orderId;
    this.http.get(businessmeg).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.orderno=data['data'].orderId            //订单号
          that.businessid=data['data'].mchId           //商户id
          that.businessorderno=data['data'].mchOrderNo //商户单号
          if(data['data'].orderType==1){               //订单类型:1-支付,2-转账,3-退款
            that.ordertype="支付"
          }else if(data['data'].orderType==2){
            that.ordertype="转账"
          }else if(data['data'].orderType==3){
            that.ordertype="退款"
          }else{
            that.ordertype=""
          }
          if(data['data'].status==1){               //通知状态,1-通知中,2-通知成功,3-通知失败
            that.tzstatus="通知中"
          }else if(data['data'].status==2){
            that.tzstatus="通知成功"
          }else if(data['data'].status==3){
            that.tzstatus="通知失败"
          }else{
            that.tzstatus=""
          }               
          that.tzresult=data['data'].result            //通知结果
          that.tzadress=data['data'].notifyUrl         //通知地址
          that.tzcount=data['data'].notifyCount        //通知次数
          that.lasttztime=data['data'].lastNotifyTime  //最后通知
          that.creattime=data['data'].createTime       //创建时间
          that.updatetime=data['data'].updateTime      //更新时间
          
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
  goback(){
    let that=this;
    that.router.navigateByUrl('pay/businessmsg?page='+that.nextpage);
  }
}
