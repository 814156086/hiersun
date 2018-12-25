import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-reviewagio',
  templateUrl: './reviewagio.component.html',
  styleUrls: ['./reviewagio.component.css']
})
export class ReviewagioComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('tradedetail') tradedetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  billNo: any;
  status: any;
  pid: any;
  revItemList = [];//退差价详情
  billStatus: any;//状态
  billItemObj: any;//状态
  actHistoryList = [];//审批活动历史记录
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.status = queryParams.status;
      this.pid = queryParams.pid;
    });
  }


  ngOnInit() {
    this.isload = true;
    this.initReviewAgio();
    this.initHisActList();
  }
  initReviewAgio() {
    // $('#modal_reviagio').modal('show');
    this.isload = false;
    var selecturl = '/oms-admin/refundDifference/selectByPage';
    var seleparams = {
      "currentPage": 1,
      "pageSize": 10,
      "billNo": this.billNo
    }
    this.httpclient.post(selecturl, seleparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.revItemList = res['data']['list'];
          this.billItemObj = res['data']['list'][0];
          this.billStatus = res['data']['list'][0]['billStatus'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 审核
  reviewStatus(status) {
    let reviurl = '/oms-admin/refundDifference/updateStatus';
    this.billItemObj['billStatus'] = status;
    var trvparam = this.billItemObj;
    this.httpclient.post(reviurl, trvparam, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.showWarnWindow(true, ' 操作成功!', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )

  }
  //查询历史审批状态
  initHisActList() {
    this.isload = false;
    const queryUrl = "/oms-workflow/api/flow/his-act/list/" + this.pid;
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
  // 订单号查询
  getOrderItemInfo(orderNo) {
    this.orderdetail.initOrderMes(orderNo);
  }
  // 外部订单号
  getDetailShow(tid) {
    this.tradedetail.detailShow(tid);
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
      that.route.navigate(['/oms/returnagio'])
    }
  }
}
