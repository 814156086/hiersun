import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-refundmsg',
  templateUrl: './refundmsg.component.html',
  styleUrls: ['./refundmsg.component.css']
})
export class RefundmsgComponent implements OnInit {
  couponAmount:any;       //优惠券金额
  createTime:any;         //创建时间
  enabled:any;            //退款交易状态0删除1有效
  mchCouponAmount:any;    //商家优惠金额
  mchId:any;              //商家id
  mchOrderNo:any;         //订单号
  mchRefundNo:any;        //商户退款单号
  poundageAmount:any;     //手续费
  refundAmount:any;       //退款金额
  refundOrderId:any;      //退款订单ID
  refundSuccTime:any;     //退款成功时间
  refundTime:any;         //退款时间
  sid:any;                //退款交易信息
  status:any;             //退款单状态-1退款失败0初始化1发起退款2退款成功状态
  uid:any;                //用户id
  updateTime:any;         //修改时间
  version:any;            //版本
  orderdetail:any;
  detailactivityNo:any;        //订单明细活动号     
  detailamount:any;            //订单明细支付金额
  detailchannelId:any;          //支付渠道ID
  detailcouponAmount:any;       // 优惠券抵扣金额  
  detailcouponFee:any;          //优惠券费用
  detailcouponNo:any;           //券类别
  detailcouponRate:any;         //优惠券费率  
  detailcreateTime:any;          //创建时间
  detailmchId:any;              //商户id
  detailmchOrderNo:any;          //商户订单号
  detailpayMeduim:any;          //支付介质
  detailpayOrderId:any;          //第三方支付单号
  detailpayRefundTradeSid:any;   //退款交易明细id   
  detailpointAmount:any;          //积分抵扣金额
  detailpointFee:any;             //积分数量
  detailpointRate:any;             //积分费率
  detailsid:any;                   //
  detailupdateTime:any;            //更新时间
  detailversion:any;              //版本
  messagelists;any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  businesslist=[];
  nodata=false;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      if (data.page) {
        that.pageNo = data.page;
      } else {
        that.pageNo = 1;
      }
    })
    this.messagelist()
  }
  messagelist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/payRefundTrade/queryPayRefundTrade?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&mchOrderNo='+$(".orderno").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              $(".linncla").remove();
              this.messagelists=[];
          }else{
            that.messagelists = data['data'].list;
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.messagelist()
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
   // 订单明细加号
   detailItem(e, index) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.line${index}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryorderdetail(e, index);
    }
  }
  queryorderdetail(e, index) {
    console.log(index);
    let that = this;
    let detailitem = '/api/v1/pay-mgr/payRefundTrade/queryPayTradeItem?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&payTradeSid=' + index;
    this.http.get(detailitem).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].list.length == 0) {
            that.nodata = true;
            this.orderdetail = [];
          } else {
            var opList;
            opList = data['data'].list;
            var opta = '';
            opList.map((opitem, opindex) => {
              if(opitem.mchOrderNo==null){
                opitem.mchOrderNo="--"
              }
              if(opitem.channelId==null){
                opitem.channelId="--"
              }
              if(opitem.amount==null){
                opitem.amount="--"
              }
              if(opitem.activityNo==null){
                opitem.activityNo="--"
              }
              if(opitem.couponAmount==null){
                opitem.couponAmount="--"
              }
              if(opitem.couponFee==null){
                opitem.couponFee="--"
              }
              if(opitem.pointAmount==null){
                opitem.pointAmount="--"
              }
              if(opitem.pointFee==null){
                opitem.pointFee="--"
              }
              if(opitem.payMeduim==null){
                opitem.payMeduim="--"
              }
              if(opitem.payOrderId==null){
                opitem.payOrderId="--"
              }
              if(opitem.couponNo==null){
                opitem.couponNo="--"
              }
              return opta += `
            <tr>
              <td>${opitem.mchOrderNo}</td>
              <td>${opitem.channelId}</td>
              <td>${opitem.amount}</td>
              <td>${opitem.activityNo}</td>
              <td>${opitem.couponAmount}</td>
              <td>${opitem.couponFee}</td>
              <td>${opitem.pointAmount}</td>
              <td>${opitem.pointFee}</td>
              <td>${opitem.payMeduim}</td>
              <td>${opitem.payOrderId}</td>
              <td>${opitem.couponNo}</td>
            </tr>`
            })
            var opHtml = `
          <tr class="line${index} linncla">
            <td></td>
            <td colspan="11">
              <table class="table table-bordered">
                <thead>
                  <tr>
                  <th style="width:10%">订单号</th>
                  <th style="width:10%">支付渠道ID</th>
                  <th style="width:7%">支付金额 </th>
                  <th style="width:10%">活动号</th>
                  <th style="width:10%">优惠券抵扣金额</th>
                  <th style="width:7%">优惠券费用</th>
                  <th style="width:7%">积分抵扣金额</th>
                  <th style="width:10%">积分数量</th>
                  <th style="width:10%">支付介质</th>
                  <th style="width:10%">第三方支付单号</th>
                  <th style="width:9%">券类别</th>
                  </tr>
                </thead>
                <tbody>
                  ${opta}
                </tbody>
              </table>
            </td>
          </tr>`;
            $(e).parent().parent().after(opHtml);
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.detailItem(e, index)
              }
            });
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
  }
  reset(){
    $(".form-control").val("");
    this.messagelist()
  }
}
