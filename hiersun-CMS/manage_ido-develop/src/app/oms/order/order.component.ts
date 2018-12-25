import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router,ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('tradedetail') tradedetail
  sourceList: Array<any> = [];//订单来源
  oStatusList: Array<any> = [];//订单状态
  oTypeList: Array<any> = [];//订单类型
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public orderList = [];//订单列表
  public flag = 1;//线上订单查询/管理
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(data => {
      this.flag = data.flag;
    });
   }

  ngOnInit() {
    this.isload = false;
    $('#saleTime').daterangepicker({
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
      $('#orderStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#orderSource').select2({
        placeholder: 'Select',
        allowClear: true
      });
      // $('#orderType').select2({
      //   placeholder: 'Select',
      //   allowClear: true
      // });
    }
    this.loadOrderStatus();
    // this.loadOrderTypes();
    this.loadSourceList();
    this.initOrderInfo();
    this.isload = true;
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
  // 加载订单状态
  loadOrderStatus() {
    this.isload = false;
    var oStatusUrl = "/oms-admin/dict/selectCodelist";
    var oStatusParams = {
      "typeValue": "order_status"
    }
    this.httpclient.post(oStatusUrl, oStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.oStatusList = res['data']
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  loadOrderTypes() {
    this.isload = false;
    var oStatusUrl = "/oms-admin/dict/selectCodelist";
    var oStatusParams = {
      "typeValue": "order_type"
    }
    this.httpclient.post(oStatusUrl, oStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.oTypeList = res['data']
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  //  查询销售单信息
  initOrderInfo() {
    this.isload = false;
    var that = this;
    var saleTimeStart = $('#saleTime').val().split('--')[0];
    var saleTimeEnd = $('#saleTime').val().split('--')[1];
    var orderurl = '/oms-admin/order/queryOrderPageList';
    var orderparams = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      "isCod": $('#isCod').val(),
      "memberNo": $('#memberNum').val(),
      "orderNo": $('#orderNum').val(),
      "orderSource": $('#orderSource').select2('val'),
      "orderStatus": $('#orderStatus').select2('val'),
      // "orderType": $('#orderType').select2('val'),
      "outOrderNo": $('#outOrderNum').val(),
      "payStatus": $('#payStatus').val(),
      "paymentAmountEnd": $('#payStart').val(),
      "paymentAmountStart": $('#payEnd').val(),
      "receptPhone": $('#receptPhone').val(),
      "saleTimeEndStr": saleTimeEnd,
      "saleTimeStartStr": saleTimeStart,
      "supplyProductNo": $('#supplyProductNum').val()
    };
    this.httpclient.post(orderurl, orderparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.orderList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = res['data']['list'].length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initOrderInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  queryReset() {
    $('#saleTime').val("");
    $('#isCod').val("");
    $('#memberNum').val("");
    $('#orderNum').val("");
    $('#orderSource').select2('val', "");
    $('#orderStatus').select2('val', "");
    $('#outOrderNum').val("");
    $('#payStatus').val("");
    // $('#orderType').select2('val', "");
    $('#payStart').val("");
    $('#payEnd').val("");
    $('#receptPhone').val("");
    $('#supplyProductNum').val("");
    this.pageNum = 1;
    // this.isload = true;
    // this.recordTotal = 0;
    // this.orderList = [];
    this.initOrderInfo();
  }
  // C7000000304
  // 订单号查询
  getOrderItemInfo(orderNo, isRemark) {
    this.orderdetail.initOrderMes(orderNo, isRemark);
  }
  // 外部订单号
  getDetailShow(tid) {
    this.tradedetail.detailShow(tid);
  }
  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
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
