import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-detailform',
  templateUrl: './detailform.component.html',
  styleUrls: ['./detailform.component.css']
})
export class DetailformComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  public orderNo: any;//线上单据号
  public cusOrder: any;//定做单单号
  public sid: any;//主键编号
  public pid: any;
  public cusStatus: any;//定做单状态
  public sourceName: any;//线上订单来源
  public sourceList = [];//渠道列表
  public itemMesg: detailItemInfo;//定做单详情
  public actHistoryList = [];//历史活动状态
  public shoppeNo:any;//买家留言
  public shoppeName:any;//商品属性
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  private tempReason: any;
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.orderNo = queryParams.billNo;
      this.cusStatus = queryParams.status;
      this.pid = queryParams.pid;
    });
  }

  ngOnInit() {
    this.itemMesg = new detailItemInfo("", "", "", "", "", "", "", "", "", "", "");
    this.loadSourceList();
    this.loadFormDetail();
    this.initHisActList();
  }
  // 加载订单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.sourceList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  loadFormDetail() {
    this.isload = false;
    var that = this;
    var selecturl = '/pcm-admin/price-order/list';
    var params = new HttpParams()
      .set("cusOrder", `${this.orderNo}`)
    this.httpclient.get(selecturl, { params }).subscribe(
      res => {
        this.isload = true;
        // console.log(res['data']['content']);
        var alength = res['data']['content'] ? res['data']['content'].length : 0;
        if (res['code'] == 200 && alength) {
          // this.orderList = res['data']['content'];
          this.sourceName = res['data']['content'][0]['sourceCode'];
          this.itemMesg = res['data']['content'][0];
          this.cusOrder = res['data']['content'][0]['cusOrder'];
          this.sid = res['data']['content'][0]['sid'];
          var saleNo=res['data']['content'][0]['orderNo'];
          this.loadSaleItemInfo(saleNo)
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  loadSaleItemInfo(saleNo){
    this.isload = false;
    var saleurl = '/oms-admin/sale/querySalePageList';
    var saparams = {
      "currentPage": 1,
      "pageSize": 10,
      "saleNo": saleNo,
      "arrtibute1": "DJ,DZ",
      "payStatus": "5002,5004",
    };
    this.httpclient.post(saleurl, saparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          // this.salesList = res['data']['list'];
          this.shoppeNo=res['data']['list']['shoppeNo'];
          this.shoppeName=res['data']['list']['shoppeName'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
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
  getStoreName() {
    var sourceName: any;
    this.sourceList.forEach((value, index) => {
      if (value['channelCode'] == this.sourceName) {
        sourceName = value['channelName'];
      }
    })
    return sourceName;
  }
  // 审核
  sureReview(status) {
    let reason = $("#remarks").val();
    this.tempReason = reason;
    if(status != 2){
      if(!reason){
        this.showWarnWindow(true, "请输入审核意见", 'warning');
        return;
      }
    }
    this.isload = false;
    var arvUrl = '/pcm-admin/price-order/approval';
    var arvPrms = {
      "cusOrder": this.cusOrder,
      "sid": this.sid,
      "status": status,
      "opinion":this.tempReason
    }
    this.httpclient.post(arvUrl, arvPrms, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '审核成功！', 'success');
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
  public showWarnWindow(status, warnMsg, btnType) {
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
      that.route.navigate(['/oms/pricelist']);
    }
  }
}
export class detailItemInfo {
  constructor(
    public sourceCode: string,
    public orderNo: string,
    public cusGiaDetail: string,
    public cusDetail: string,
    public earnestAmount: string,
    public balanceAmount: string,
    public saleTime: string,
    public signTime: string,
    public orderAmount: string,
    public barcode: string,
    public pictureUrl: string
  ) {
  }
}
