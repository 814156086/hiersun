import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-returnrefunds',
  templateUrl: './returnrefunds.component.html',
  styleUrls: ['./returnrefunds.component.css']
})
export class ReturnrefundsComponent implements OnInit {
  @ViewChild('shipmodal') shipmodal
  @ViewChild('rejectedmodal') rejectedmodal
  @ViewChild('signedmodal') signedmodal
  @ViewChild('saledetail') saledetail
  @ViewChild('orderdetail') orderdetail
  @ViewChild('tradedetail') tradedetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  public sourceList = [];//销售渠道
  public returnsList = [];//已签收退货信息
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
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
      $('#saleChannel').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadSourceList();
    this.initRejectedInfo();
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
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  initRejectedInfo() {
    this.isload = false;
    var saleChannel = $('#saleChannel').select2('val');
    var that = this;
    var startSaleTime = $('#saleDt').val().split('--')[0];
    var endSaleTime = $('#saleDt').val().split('--')[1];
    // var saleSource=!saleChannel ? "0','C1','C2','M1" : saleChannel;
    var selecturl = '/oms-admin/sale/selectSale2';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "saleNo": $('#saleNum').val(),
      "orderNo": $('#orderNum').val(),
      "startSaleTime": startSaleTime,
      "endSaleTime": endSaleTime,
      "suppllyName": $('#supplierName').val(),
      "supplyNo": $('#supplierNum').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
      "saleSource": "C1",
      "saleStatus": "02','03','04','08','09','10','11','13','14"
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnsList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.returnsList.length ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initRejectedInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  queryReset() {
    $('#saleNum').val("");
    $('#orderNum').val("");
    $("#isStock").val("");
    $('#saleDt').val("");
    $('#supplierName').val("");
    $('#supplierNum').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    $('#saleChannel').select2("val", "");
    this.pageNum = 1;
    this.initRejectedInfo();
  }
  // 加号
  detailPlus(e, sItemNo, saleSource, orderNo,saleStatus) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.getSaleItemInfo(sItemNo,orderNo,saleStatus);
    }
  }
  getSaleItemInfo(sItemNo, orderNo, saleStatus) {
    console.log(saleStatus);
    switch (saleStatus) {
      
      //已签收退货弹窗 
      case '08':
        this.getSignedMes(sItemNo, orderNo);
        break;
      //拒收收退货弹窗
      case '09':
        this.getRejectedMes(sItemNo, orderNo);
        break;
      // 发货前
      default:
        this.getShipMes(sItemNo, orderNo);
        break;
    }
  }
  // 已拒收退款弹窗
  getRejectedMes(saleNo: any,orderNo:any) {
    this.rejectedmodal.initRejectMes(saleNo,orderNo);
  }
  // 发货前退款弹窗
  getShipMes(saleNo: any,orderNo:any) {
    this.shipmodal.initShipMes(saleNo,orderNo);
  }
  // 发货前退款弹窗
  getSignedMes(saleNo: any,orderNo:any) {
    this.signedmodal.initSignedMes(saleNo,orderNo);
  }
  // 销售单详情弹窗
  getSalesMes(saleNo: any,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }
  // 订单号查询
  getOrderItemInfo(orderNo: any,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }
    // 外部订单号
  getDetailShow(tid) {
    this.tradedetail.detailShow(tid);
  }
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  //  关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
