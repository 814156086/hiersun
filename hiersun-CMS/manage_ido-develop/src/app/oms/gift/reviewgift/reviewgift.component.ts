import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-reviewgift',
  templateUrl: './reviewgift.component.html',
  styleUrls: ['./reviewgift.component.css']
})
export class ReviewgiftComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  billStatus: any;//状态
  billType: any;//工单类型
  billNo: any;//赠品工单号
  sid: any;//赠品工单sid
  pid: any;//历史信息查询pid
  status: any;//跳转状态
  wotList: Array<any> = [];//工单类型列表
  reviewItemList = [];//赠品信息列表
  invoItemList = [];//发票信息列表
  actHistoryList = [];//审批活动历史记录
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  private tempReason: any;//临时审核意见
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.pid = queryParams.pid;
      this.status = queryParams.status;
    });
  }

  ngOnInit() {
    this.isload = true;
    this.loadWoStatus();// 加载工单类型
    this.initInfo();
    this.initHisActList();
  }
    // 加载工单类型
    loadWoStatus() {
      this.isload = false;
      const woturl = '/oms-admin/dict/selectCodelist';
      const woparam = {
        "typeValue": "work_order_status "
      };
      this.httpclient.post(woturl, woparam, this.httpOptions).subscribe(
        res => {
          this.isload = true;
          if (res['code'] == 200) {
            this.wotList = res['data'];
          }else{
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        });
    }
  initInfo() {
    this.isload = false;
    var billNo = this.billNo
    const selecturl = '/oms-admin/gift-order/list';
    const params = new HttpParams()
      .set('currentPage', "1")
      .set('pageSize', "10")
      .set('billNo', billNo)
      .set('shopName', "")
      .set('billStatus', "");
    this.httpclient.get(selecturl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var giftitem = res['data']['list'][0];
          this.loadReviewModal(giftitem)
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
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
  loadReviewModal(giftitem) {
    // $('#modal_review').modal('show');
    // this.billNo = giftitem.billNo;
    this.billStatus = giftitem.billStatus;
    this.sid = giftitem.sid;
    this.billType = giftitem.billType;
    this.billType == 1 ? this.loadGiftInfo() : this.loadInvoiceInfo();
    // this.reviewItemList = [];
    // this.reviewItemList.push(giftitem)
  }
  // 加载补赠品信息
  loadGiftInfo() {
    this.isload = false;
    this.reviewItemList = [];
    var selecturl = `/oms-admin/gift-order/info/${this.billNo}`;
    this.httpclient.get(selecturl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          // this.isType = false;
          var itemObj = res['data'][0];
          var billType=itemObj['billType']
          itemObj['billTyName'] = this.wotList.filter((i, v) => i.codeValue == billType)[0]['codeName'];
          this.reviewItemList.push(itemObj);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 加载发票信息
  loadInvoiceInfo() {
    this.isload = false;
    this.invoItemList = [];
    var invcurl = `/oms-admin/gift-order/${this.billNo}/gift?billType=2`;
    this.httpclient.get(invcurl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.invoItemList.push(res['data'])
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
    this.isload = true;

  }
  // 审核通过/失败
  reviewStatus(billType, status) {
    let reason = $("#remarks").val();
    this.tempReason = reason;
    if(status != 2){
        if(!reason){
           this.showWarnWindow(true, "请输入审核意见", 'warning');
           return;
        }
    }
    billType == 1 ? this.revGift(status) : this.revInvoice(status);
  }
  // 赠品审核
  revGift(status) {
    var revUrl = '/oms-admin/gift-order/approval';
    var revParams = {
      'billNo': this.billNo,
      'billStatus': status,
      'sid': this.sid,
      'reason':this.tempReason
    }
    this.isload = false;
    this.httpclient.post(revUrl, revParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          // $('#modal_review').modal('hide');
          this.showWarnWindow(true, '操作成功！', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 发票审核
  revInvoice(status) {
    var invUrl = '/oms-admin/invoice-order/invoiceOrder';
    var invParams = {
      'billNo': this.billNo,
      'billStatus': status,
      'sid': this.sid,
      'reason':this.tempReason
    }
    this.isload = false;
    this.httpclient.post(invUrl, invParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          // $('#modal_review').modal('hide');
          // this.route.navigate(['oms/gift']);
          this.showWarnWindow(true, '操作成功！', 'success');
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
    var that=this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['oms/gift']);
      }
  }
}
