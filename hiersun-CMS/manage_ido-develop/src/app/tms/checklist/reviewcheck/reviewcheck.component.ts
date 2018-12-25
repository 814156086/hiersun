import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-reviewcheck',
  templateUrl: './reviewcheck.component.html',
  styleUrls: ['./reviewcheck.component.css']
})
export class ReviewcheckComponent implements OnInit {
  public isShowWarnWin = false; //确认弹窗
  public warnMsg: string; //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false; //是否加载
  public billNo: any;
  public status: any;
  public pid: any;
  public billStatus: any;
  public isComplete: any;
  public checkItem = [];//盘点单详情
  public checkDataList = [];//盘点单商品列表
  public actHistoryList = [];//审批活动历史记录
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };
  constructor(private httpclient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.status = queryParams.status;
      this.pid = queryParams.pid;
    });
    console.log(this.billNo, this.status, this.pid);

  }

  ngOnInit() {
    this.isload = true;
    this.loadReviewCheck();
    this.initHisActList();
  }
  /* 查看详情 */
  loadReviewCheck() {
    this.isload = false;
    this.checkItem = [];
    var bookUrl = '/tms-admin/check/stock-info-book';
    var params = new HttpParams()
      .set('orderNum', `${this.billNo}`)
    this.httpclient.get(bookUrl, { params }).subscribe(
      res => {
        if (res['code'] == 200) {
          this.billStatus = res['data']['status'];
          this.isComplete = res['data']['isComplete'];
          this.checkDataList = res['data']['checkDataList'];
          this.checkItem.push(res['data'])
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      }, (err: HttpErrorResponse) => {
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
  // 审核
  reviewStatus(status) {
    let reviurl = '/tms-admin/check/edit-check-stock';
    var trvparam = {
      "sid": this.pid,
      "orderNum": this.billNo,
      "status": status
    }
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
      that.route.navigate(['/tms/checklist'])
    }
  }
}