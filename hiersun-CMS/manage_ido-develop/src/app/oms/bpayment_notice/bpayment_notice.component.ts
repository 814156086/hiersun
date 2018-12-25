import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-bpayment_notice',
  templateUrl: './bpayment_notice.component.html',
  styleUrls: ['./bpayment_notice.component.css']
})
export class BPaymentNoticeComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public noticeList = [];//通知单列表
  public orderProList = [];//订单下商品列表
  public delOrderNo: String;//删除订单号
  public createOrderTime: String;//制单日期
  public tempOrder = [];//临时变量,通知单信息
  public actHistoryList = [];//历史活动状态
  public detailOrderStatus;//查看的订单状态;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  private tempNoticeNo: String;

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    $('#beginTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    $('#endTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    this.initBalancePaymentNoticeList();
  }
  // 查询
  initBalancePaymentNoticeList() {
    let that = this;
    this.isload = false;
    let selecturl = `/oms-admin/bp-notices?pageSize=${this.pageSize}&currentPage=${this.currentpage}&noticeNo=${$("#orderNo").val()}&noticeOrderStatus=${$("#orderStatus").val()}&beginTime=${$("#beginTime").val() != '' ? new Date($('#beginTime').val() + " 00:00:00").getTime() : ''}&endTime=${$("#endTime").val() != '' ? new Date($('#endTime').val() + " 00:00:00").getTime() : ''}`;
    this.httpclient.get(selecturl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.noticeList = res['data']['list'];
          this.recordTotal = res['data']['count'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          $("#pagination1").pagination({
            currentPage: that.currentpage,
            totalPage: that.pagetotal,
            callback: function (current) {
              that.currentpage = current;
              that.initBalancePaymentNoticeList();
            }
          });
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  // 重置
  resetAllocate() {
    $("#orderNo").val("");
    $("#beginTime").val("");
    $("#endTime").val("");
    this.initBalancePaymentNoticeList();
  }
  // 查看
  showOrderDetail(billNo,status, pid,act) {
    this.route.navigate(['oms/bpayment_notice/bpayreview'], {
      queryParams: {
        billNo,pid,status
      }})
    // this.tempOrder = [];
    // $("#modal_review").modal("show");
    // this.tempNoticeNo = code;
    // this.noticeList.forEach((v,i)=>{
    //   if(v.noticeNo == code){
    //     this.tempOrder.push(v);
    //     this.detailOrderStatus = v.noticeOrderStatus;
    //   }
    // });
    // //查询历史审批状态
    // this.httpclient.get(`/oms-admin/notices/act-list/${this.tempOrder[0].processId}`, this.httpOptions).subscribe(
    //   res => {
    //     if (res['code'] == 200) {
    //       this.isload = true;
    //       this.actHistoryList = res['data'];
    //       console.log(this.actHistoryList);
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err.error);
    //   });
  }
  // 编辑
  editAlloate(flag, locateId) {
    this.route.navigate(['tms/allocate/addallocate'], {
      queryParams: {
        flag, locateId
      }
    });
  }
  //处理尾款通知单
  reviewOrder(orderStatus) {
    let param = {
      "noticeNo": this.tempNoticeNo,
      "noticeOrderStatus": orderStatus,
      "taskId":this.tempOrder[0].taskId
    };
    this.httpclient.post("/oms-admin/bp-notice/check", param, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $('#modal_review').modal('hide');
          this.initBalancePaymentNoticeList();
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }

}
function closeWin() {

}

/**
 * 审核参数
 */
export class TransferOrderReviewVo {
  constructor(
    public sid: number,
    public orderStatus: number,
  ) { }
}

/**
 * 删除参数
 */
export class TransferOrderDeleteVo {
  constructor(
    public sid: number,
    public ifDelete: number,

  ) { }
}
