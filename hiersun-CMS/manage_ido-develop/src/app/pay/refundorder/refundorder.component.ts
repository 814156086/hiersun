import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-refundorder',
  templateUrl: './refundorder.component.html',
  styleUrls: ['./refundorder.component.css']
})
export class RefundorderComponent implements OnInit {
  channelErrCode:any;          //渠道错误码
  channelErrMsg:any;           //渠道错误描述
  channelId:any;               //渠道ID
  channelMchId:any;            //渠道商户ID
  channelOrderNo:any;          //渠道订单号
  channelPayOrderNo:any;       //渠道订单号
  channelUser:any;             //渠道用户标识,如微信openId,支付宝账号
  clientIp:any;                //客户端IP
  createTime:any;              //创建时间
  currency:any;                //三位货币代码,人民币:cny
  device:any;                  //设备
  expireTime:any;              //订单失效时间
  extra:any;                    //特定渠道发起时额外参数
  mchId:any;                    //商户ID
  mchRefundNo:any;              //商户退款单号
  notifyUrl:any;                //通知地址
  param1:any;                   //扩展参数1"
  param2:any;                   //扩展参数1"
  payAmount:any;                 //支付金额,单位分
  payOrderId:any;                //支付订单号
  refundAmount:any;              //退款金额,单位分
  refundOrderId:any;             //退款订单号
  refundSuccTime:any;            //订单退款成功时间
  remarkInfo:any;                 //备注
  result:any;                     //退款结果:0-不确认结果,1-等待手动处理,2-确认成功,3-确认失败
  status:any;                     //退款状态:0-订单生成,1-退款中,2-退款成功,3-退款失败,4-业务处理完成
  updateTime:any;                 //更新时间
  username:any;                   //用户姓名
  version:any;
  refundorder:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
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
    this.orderlist();
  }
  orderlist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/refundOrder/queryRefundOrder?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&payOrderId='+$(".orderno").val()+'&username='+$(".usernames").val()+'&status='+$(".orderstatus").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.refundorder=[];
          }else{
            that.refundorder = data['data'].list;
            history.replaceState(null, null, '/pay/refundorder?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.orderlist()
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
    this.orderlist()
  }
}
