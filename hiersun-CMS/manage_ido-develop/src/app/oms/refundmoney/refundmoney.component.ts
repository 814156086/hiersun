import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-refundmoney',
  templateUrl: './refundmoney.component.html',
  styleUrls: ['./refundmoney.component.css']
})
export class RefundmoneyComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('returndetail') returndetail
  @ViewChild('saledetail') saledetail
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  refundList: Array<any> = [];
  sourceList: Array<any> = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    $('#allRefTime').daterangepicker({
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
    $('#confirmRefMonTime').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      opens: 'left',
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
    this.loadRefundInfo();
  }
  // 加载销售单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.sourceList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  loadRefundInfo() {
    this.isload = false;
    var that = this;
    var allRefTimeStart = $('#allRefTime').val().split('--')[0];
    var allRefTimeEnd = $('#allRefTime').val().split('--')[1];
    var confirmRefundMonTimeStartStr = $('#confirmRefMonTime').val().split('--')[0];
    var confirmRefundMonTimeEndStr = $('#confirmRefMonTime').val().split('--')[1];
    var selecturl = '/oms-admin/refundApply/selectRefundAndMon';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "allRefTimeStartStr": allRefTimeStart,
      "allRefTimeEndStr": allRefTimeEnd,
      "confirmRefundMonTimeStartStr": confirmRefundMonTimeStartStr,
      "confirmRefundMonTimeEndStr": confirmRefundMonTimeEndStr,
      "refundMonNo": $('#refundMonNo').val(),
      "refundNo": $('#refundNum').val(),
      "orderNo": $('#orderNo').val(),
      "outOrderNo": $("#outOrderNo").val(),
      "saleNo": $('#saleNo').val(),
      "orderSource": $('#saleChannel').select2('val'),
      "reMonStatus": $('#reMonStatus').val(),
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refundList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.refundList? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('.page').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.loadRefundInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  queryReset() {
    $('#allRefTime').val("");
    $('#confirmRefMonTime').val("");
    $('#refundMonNo').val("");
    $('#refundNum').val("");
    $('#orderNo').val("");
    $("#outOrderNo").val("");
    $('#saleNo').val("");
    $('#saleChannel').select2('val', "");
    $('#reMonStatus').val("");
    this.pageNum = 1;
    this.loadRefundInfo();
  }
  exportInfo() {

  }
  viewProInfo(refundNo,refundMonNo,reMonStatus,financeMemo) {
    this.route.navigate(['/oms/reviewrefund'], {
      queryParams: {
        refundNo,refundMonNo,reMonStatus,financeMemo
      }
    });
  }
  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }
  // 销售单号查询
  getSalesMes(saleNo,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }

  // 退货单号查询
  getReturnMes(returnNo) {
    this.returndetail.initReturnMes(returnNo);
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
