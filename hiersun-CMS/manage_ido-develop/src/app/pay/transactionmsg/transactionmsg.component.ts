import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-transactionmsg',
  templateUrl: './transactionmsg.component.html',
  styleUrls: ['./transactionmsg.component.css']
})
export class TransactionmsgComponent implements OnInit {
  actualAmount: any;           //实际支付金额
  client: any;                 //客户端ip或消息编号
  clientType: any;             //终端类型
  comm: any;                   //订单备注
  content: any;                //订单内容
  couponAmount: any;           //使用优惠券抵扣金额
  createTime: any;             //创建时间
  discountAmount: any;         //折扣金额
  enabled: any;                //交易信息状态,0删除,1有效
  mchCouponAmount: any;        //商家优惠金额
  mchId: any;                   //商户id
  mchOrderNo: any;              //商户订单号
  payAmount: any;               //待支付金额
  pointAmount: any;             //积分对应金额
  poundageAmount: any;          //手续费
  sid: any;                     //用户id
  status: any;                  //订单状态 订单状态,-1关闭,0初始化,1等待付款,2支付成功,3退款申请,4部分退款申请,5退款完成,6部分退款完成
  totalAmount: any;             //总金额
  tradeSuccTime: any;           //订单成功时间
  tradeTime: any;               //订单创建时间
  type: any;                    //订单类型,1线上,2线下
  uid: any;                     //用户id
  updateTime: any;              //修改时间
  version: any;                 //版本
  orderdetail: any;
  detailactivityNo: any;        //订单明细活动号
  detailamount: any;            //订单明细支付金额
  detailchannelId: any;         //订单明细支付渠道
  detailcouponAmount: any;      //订单明细优惠券抵扣金额
  detailcouponFee: any;         //优惠券费用
  detailcouponNo: any;          //券类别
  detailcouponRate: any;        //优惠券费率
  detailcreateTime: any;        //创建时间
  detailmchId: any;             //商户id
  detailmchOrderNo: any;        //商户订单号
  detailpayMeduim: any;         //支付介质
  detailpayOrderId: any;        //第三方支付单号
  detailpayTradeSid: any;       //商户交易ID
  detailpointAmount: any;       //积分抵扣金额
  detailpointFee: any;          //积分数量
  detailpointRate: any;         //积分费率
  detailsid: any;               //用户id
  detailupdateTime: any;        //更新时间
  messagelists: any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  businesslist = [];
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
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
  messagelist() {
    let that = this;
    let businesurl = '/api/v1/pay-mgr/payTrade/queryPayTrade?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&mchOrderNo=' + $(".orderno").val();
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].list.length == 0) {
            that.nodata = true;
            this.messagelists = [];
            $(".linecla").remove();
          } else {
            that.messagelists = data['data'].list;
            history.replaceState(null, null, '/pay/transactionmsg?page=' + that.pageNo)
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.messagelist()
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
  reset() {
    $(".form-control").val("");
    this.messagelist()
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
    let detailitem = '/api/v1/pay-mgr/payTradeItem/queryPayTradeItem?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&payTradeSid=' + index;
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
          <tr class="line${index} linecla">
            <td></td>
            <td colspan="11">
              <table class="table table-bordered">
                <thead>
                  <tr>
                  <th style="width:10%">订单号</th>
                  <th style="width:10%">支付渠道</th>
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
}
