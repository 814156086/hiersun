import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;


@Component({
  selector: 'app-returnorder',
  templateUrl: './returnorder.component.html',
  styleUrls: ['./returnorder.component.css']
})
export class ReturnorderComponent implements OnInit {
  @ViewChild('returndetail') returndetail
  @ViewChild('orderdetail') orderdetail
  @ViewChild('applydetail') applydetail
  @ViewChild('saledetail') saledetail
  @ViewChild('tradedetail') tradedetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//退货单查询/管理
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public returnOrderList = [];//退货单列表
  refsList: Array<any> = [];//退货单状态
  storeList: Array<any> = [];//门店列表
  public refundNo: any//退货单号

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      this.flag = data.flag;
    });
    this.isload = true;
    $('#returnTime').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    if ($().select2) {
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#refundStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    if (this.flag == 1) {
      this.loadRefStatusList();
      this.loadStoreList();
      this.initReturnOrderInfo();
    } else {
      this.loadRefStatusList();
      this.loadStoreList();
      this.initReturnOrderInfo();
    }
  }
  // 退货单状态
  loadRefStatusList() {
    this.isload = false;
    var refsurl = '/oms-admin/dict/selectCodelist';
    var refsobj = {
      "typeValue": "refund_status"
    }
    this.httpclient.post(refsurl, refsobj, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refsList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 门店信息
  loadStoreList() {
    this.isload = false;
    const url = '/pcm-admin/stores/all';
    const param = {
      "organizationCode": "",
      "storeType": 1
    };
    this.httpclient.post(url, param, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storeList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  initReturnOrderInfo() {
    this.isload = false;
    var that = this;
    var startRefundTime = $('#returnTime').val().split('--')[0];
    var endRefundTime = $('#returnTime').val().split('--')[1];
    var selecturl = '/oms-admin/refundApply/selectRefund';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "startRefundTime": startRefundTime,
      "endRefundTime": endRefundTime,
      "refundApplyNo": $('#requestNum').val(),
      "refundNo": $('#refundNum').val(),
      "orderNo": $('#orderNum').val(),
      "originalSalesNo": $('#originalSalesNum').val(),
      "shopNo": $("#storeCode").select2('val'),
      "refundStatus": $("#refundStatus").select2('val'),
      "rebateStatus": $("#rebateStatus").val(),
      "refundType": $('#refundType').val(),
      "refundClass": $('#returnClass').val(),
      "memberNo": $('#memberNo').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnOrderList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.returnOrderList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initReturnOrderInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  queryReset() {
    $('#returnTime').val("");
    $('#requestNum').val("");
    $('#refundNum').val("");
    $('#orderNum').val("");
    $('#originalSalesNum').val("");
    $("#refundStatus").select2("val", "");
    $("#rebateStatus").val("");
    $('#refundType').val("");
    $('#returnClass').val("");
    $('#memberNo').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    $("#storeCode").select2("val", "");
    this.pageNum = 1;
    this.initReturnOrderInfo();
  }
  // 查看
  viewRequest(refundApplyNo) {
    let botflag = 1;
    this.route.navigate(['/oms/reviewreturn'], {
      queryParams: {
        refundApplyNo, botflag
      }
    });
  }
  // 作废
  invalidRequest(refundNo) {
    $("#invalid_return").modal('show');
    this.refundNo = refundNo
  }
  // 拒收原因
  subReason() {
    var invalidText = $('#invalidText').val();
    this.isload = false;
    var delurl = '/oms-admin/refundApply/deleteRefundStatus';
    var delparams = {
      "refundNo": this.refundNo,
      "problemDesc": invalidText,
      "latestUpdateMan": "admin"
    }
    this.httpclient.post(delurl, delparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "作废成功!", "success");
          $("#invalid_return").modal('hide');
          this.initReturnOrderInfo();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 销售单详情弹窗
  getSalesMes(saleNo,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }
  // 退货单号查询
  getReturnMes(returnNo) {
    this.returndetail.initReturnMes(returnNo);
  }
  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }
  // 退货申请单号查询
  getApplyItemInfo(refundApplyNo) {
    this.applydetail.initApplyMes(refundApplyNo);
  }
    // 外部订单号
    getDetailShow(tid) {
      this.tradedetail.detailShow(tid);
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
