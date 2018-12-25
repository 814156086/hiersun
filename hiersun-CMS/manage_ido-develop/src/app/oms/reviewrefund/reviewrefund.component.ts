import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-reviewrefund',
  templateUrl: './reviewrefund.component.html',
  styleUrls: ['./reviewrefund.component.css']
})
export class ReviewrefundComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public refundNo: any;//退货单号
  public reMonStatus: any;//退款状态
  public refundMonNo: any;//退款单号
  public financeMemo: any;//财务备注
  public proList = [];//退货商品和数量
  public refundMesg: RefundInfo;//退货详情
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.refundNo = queryParams.refundNo;
      this.refundMonNo = queryParams.refundMonNo;
      this.reMonStatus = queryParams.reMonStatus;
      this.financeMemo = queryParams.financeMemo;
    });
  }

  ngOnInit() {
    this.refundMesg = new RefundInfo(0, 0, 0, 0, 0);//退货详情
    this.loadRefundInfo(this.refundNo);
  }
  loadRefundInfo(refundNo) {
    this.isload = false;
    var refurl = '/oms-admin/refundApply/selectALL';
    var refparams = {
      "refundApplyNo": refundNo
    }
    this.httpclient.post(refurl, refparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.proList.push(res['data']);
          // this.products = res['data']['list'][0]['products'];
          this.refundMesg = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  updateRfMon() {
    this.isload = false;
    var refurl = '/oms-admin/refundApply/updateRefundMon';
    var refparams = {
      "allRefUser": "admin",
      "reMonStatus": 1,
      "refundMonNo": this.refundMonNo,
      "financeMemo": $('.financeMemo').val()
    }
    this.httpclient.post(refurl, refparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.route.navigate(['oms/refundmoney']);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  // 取消
  goBack() {
    window.history.go(-1);
  }
  /**
* 全局弹窗
*/
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  /**
  * 关闭窗口
  */
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
export class RefundInfo {
  constructor(
    public refundAmount: any,
    public needRefundAmount: any,
    public quanAmount: any,
    public returnShippingFee: any,
    public orderNo: any,
    // public refundAmount:String,
  ) {
  }
}