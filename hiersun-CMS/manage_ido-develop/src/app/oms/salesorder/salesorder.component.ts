import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('saledetail') saledetail
  @ViewChild('tradedetail') tradedetail
  storeList: Array<any> = [];//门店列表
  sourceList: Array<any> = [];//来源列表
  saStatusList: Array<any> = [];//销售单状态
  oTypeList: Array<any> = [];//订单类型
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  public salesList = [];//销售单列表
  public detailSaleList = [];//单个销售单列表
  public saleNo: any;//销售单号
  public flag = 1;//门店订单查询/管理
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
    $('#saleDt').daterangepicker({
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
      $('#saleStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#payStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#saleSource').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#orderType').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadStoreList();
    this.loadSourceList();
    this.loadSaleStatus();
    this.loadOrderTypes();
    this.initSaleOrderInfo();
    this.isload = true;
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
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      });
  }
  // 加载销售单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.sourceList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载销售单状态
  loadSaleStatus() {
    this.isload = false;
    var saStatusUrl = "/oms-admin/dict/selectCodelist";
    var saStatusParams = {
      "typeValue": "sale_status"
    }
    this.httpclient.post(saStatusUrl, saStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saStatusList = res['data']
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
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
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  //  查询销售单信息
  initSaleOrderInfo() {
    this.isload = false;
    var that = this;
    var startSaleTime = $('#saleDt').val().split('--')[0];
    var endSaleTime = $('#saleDt').val().split('--')[1];
    var saleurl = '/oms-admin/sale/querySalePageList';
    var saparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "startSaleTime": startSaleTime,
      "endSaleTime": endSaleTime,
      "orderNo": $('#orderNum').val(),
      "saleNo": $('#saleNum').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
      "accountNo": $('#accountNum').val(),
      "shopNo": $("#storeCode").select2('val'),
      "saleStatus": $('#saleStatus').select2('val'),
      "arrtibute1": $('#orderType').select2('val'),
      "payStatus": $('#payStatus').select2('val'),
      "casherNo": $('#casherNum').val(),
      "saleSource": $('#saleSource').select2('val')
    };
    this.httpclient.post(saleurl, saparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.salesList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.salesList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initSaleOrderInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  queryReset() {
    $('#saleDt').val("");
    $('#orderNum').val("");
    $('#saleNum').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    $('#accountNum').val("");
    $("#storeCode").select2("val", "");
    $("#orderType").select2("val", "");
    $('#saleStatus').select2("val", "");
    $('#payStatus').select2("val", "");
    $('#casherNum').val("");
    $('#saleSource').select2("val", "");
    this.pageNum = 1;
    // this.isload = true;
    // this.recordTotal = 0;
    this.initSaleOrderInfo();
  }
  // 销售单详情弹窗
  getSalesMes(saleNo, isRemark) {
    this.saledetail.initSalesMes(saleNo, isRemark);
  }

  // 订单详情弹窗
  getOrderMes(orderNo, isRemark) {
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
