import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-bpayreview',
  templateUrl: './bpayreview.component.html',
  styleUrls: ['./bpayreview.component.css']
})
export class BpayreviewComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  billNo: any;
  status: any;
  pid: any;
  public tempOrder = [];//临时变量,通知单信息
  public actHistoryList = [];//历史活动状态
  public detailOrderStatus;//查看的订单状态;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  private tempReason: any;
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.status = queryParams.status;
      this.pid = queryParams.pid;
    });
  }


  ngOnInit() {
    this.showOrderDetail();
    this.initHisActList();
  }
  showOrderDetail() {
    this.isload = false;
    let selecturl = '/oms-admin/bp-notices';
    const params = new HttpParams()
    .set('currentPage', "1")
    .set('pageSize', "10")
    .set('noticeOrderStatus', `${this.status}`)
    .set('noticeNo', `${this.billNo}`);
    this.httpclient.get(selecturl, {params}).subscribe(
      res => {
        console.log(res);

        if (res['code'] == 200) {
          this.isload = true;
          this.tempOrder = res['data']['list'];
          this.detailOrderStatus = res['data']['list'][0]['noticeOrderStatus'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  //查询历史审批状态
  initHisActList(){
    this.isload = false;
    const queryUrl = "/oms-workflow/api/flow/his-act/list/"+this.pid;
    this.httpclient.get(queryUrl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.actHistoryList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  //处理尾款通知单
  reviewOrder(orderStatus) {
    let reason = $("#remarks").val();
    this.tempReason = reason;
    if(orderStatus != 2){
      if(!reason){
        this.showWarnWindow(true, "请输入审核意见", 'warning');
        return;
      }
    }
    this.isload = false;
    let param = {
      "noticeNo": this.billNo,
      "noticeOrderStatus": orderStatus,
      "taskId": this.tempOrder[0].taskId,
      "reason":this.tempReason
    };
    this.httpclient.post("/oms-admin/bp-notice/check", param, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '操作成功！', 'success');
          // $('#modal_review').modal('hide');
          // this.initBalancePaymentNoticeList();
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }


  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }

  goBack() {
    window.history.go(-1);
  }
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['oms/bpayment_notice']);
    }
  }

}
