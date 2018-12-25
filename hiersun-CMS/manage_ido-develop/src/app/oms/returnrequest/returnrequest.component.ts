import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-returnrequest',
  templateUrl: './returnrequest.component.html',
  styleUrls: ['./returnrequest.component.css']
})
export class ReturnrequestComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('saledetail') saledetail
  @ViewChild('applydetail') applydetail
  @ViewChild('tradedetail') tradedetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//退货申请单查询/管理
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public reqList = [];//订单列表
  public refaList = [];//退货申请单状态
  public refundApplyNo: any//退货申请单号
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      this.flag = data.flag;
    });
    $('#appTime').daterangepicker({
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
      $('#refundStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.flag == 1 ? this.initRequestInfo() : this.initRequestInfo();
    this.loadRefStatusList();
    this.isload = true;
  }
    // 退货申请单单状态
    loadRefStatusList() {
      this.isload = false;
      var refsurl = '/oms-admin/dict/selectCodelist';
      var refsobj = {
        "typeValue": "refund_apply_status"
      }
      this.httpclient.post(refsurl, refsobj, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.refaList = res['data']
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      )
    }
  initRequestInfo() {
    this.isload = false;
    var that = this;
    var startRefundTime = $('#appTime').val().split('--')[0];
    var endRefundTime = $('#appTime').val().split('--')[1];
    var selecturl = '/oms-admin/refundApply/selectRefundApplyPage';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "startRefundTime": startRefundTime,
      "endRefundTime": endRefundTime,
      "refundApplyNo": $('#returnNum').val(),
      "orderNo": $('#orderNum').val(),
      "refundStatus": $("#refundStatus").select2('val'),
      "refundClass": $('#refundClass').val(),
      "memberNo": $('#memberNo').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.reqList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.reqList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('.page').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initRequestInfo();
          }
        });
        // $('#pagination2').pagination({
        //   currentPage: this.currentpage,
        //   totalPage: this.pagetotal,
        //   callback: function (current) {
        //     that.pageNum = current;
        //     that.initRequestInfo();
        //   }
        // });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  queryReset() {
    $('#appTime').val("");
    $('#returnNum').val("");
    $('#orderNum').val("");
    $("#refundStatus").select2("val", "");
    $('#refundClass').val("");
    $('#memberNo').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    this.pageNum = 1;
    this.initRequestInfo();
  }
  // 审核
  reviewRequest(refundApplyNo) {
    let botflag = 2;
    this.route.navigate(['/oms/reviewreturn'], {
      queryParams: {
        refundApplyNo, botflag
      }
    });
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
  invalidRequest(refundApplyNo) {
    $("#invalid_request").modal('show');
    this.refundApplyNo = refundApplyNo
  }
  // 拒收原因
  subReason() {
    $("#invalid_request").modal('hide');
    var invalidText = $('#invalidText').val();
    this.isload = false;
    var delurl = '/oms-admin/refundApply/deleteRefundApplyStatus';
    var delparams = {
      "refundApplyNo": this.refundApplyNo,
      "problemDesc": invalidText,
      "latestUpdateMan": "admin"
    }
    this.httpclient.post(delurl, delparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "作废成功!", "success");
          this.initRequestInfo();
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
