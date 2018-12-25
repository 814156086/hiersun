import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.css']
})
export class WechatComponent implements OnInit {
  appid:any;      //
  attach:any;     //商家数据包
  bankType:any;   //付款银行
  cashFee:any;    //现金支付金额
  cashFeeType:any;//现金支付货币类型
  couponCount:any;//代金券使用数量
  couponFee:any;  //总代金券金额
  deviceInfo:any; //设备号
  /* errorCode:any;
  errorCodeDes:any; */
  feeType:any;     //货币种类
  mchId:any;       //商户id
  /* nonceStr:any; */
  openid:any;
  outTradeNo:any;   //商户订单号
 /*  resultCode:any;
  returnCode:any;
  returnMsg:any; */
  sid:any;
  sign:any;           //签名
  timeEnd:any;       //支付完成时间
  totalFee:any;      //订单金额
  tradeType:any;     //交易类型
  transactionId:any; //微信支付订单号

  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  jornallist=[];
  nodata=false;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    })
    this.wechatlist()
  }
  wechatlist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/wxpayNotifyLog/queryWxpayNotifyLog?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&outTradeNo='+$(".orderno").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.jornallist=[];
          }else{
            that.jornallist = data['data'].list;
            history.replaceState(null, null, '/pay/wechat?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.wechatlist()
              }
            });
          }
          
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
  reset(){
    $(".form-control").val("");
    this.wechatlist()
  }
}
