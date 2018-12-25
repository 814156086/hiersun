import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-abnormalorder',
  templateUrl: './abnormalorder.component.html',
  styleUrls: ['./abnormalorder.component.css']
})
export class AbnormalorderComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public abnormalorderList = [];//异常订单列表
  public parameters:any;//异常参数
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }
  ngOnInit() {
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
    this.initAbnormalOrderInfo();
    this.isload = true;
  }
  //  查询销售单信息
  initAbnormalOrderInfo() {
    this.isload = false;
    var that = this;
    var saleTimeStart = $('#saleTime').val().split('--')[0];
    var saleTimeEnd = $('#saleTime').val().split('--')[1];
    var orderurl = '/oms-admin/exceptionLog/queryAll';
    var orderparams = {
      "pageNumber": this.pageNum,
      "pageSize": this.pageSize,
      "orderNo": $('#orderNum').val(),
      "endTime": saleTimeEnd,
      "startTime": saleTimeStart,
      "exceptionType": "",
      // "orderStatus":$('#orderSource').select2('val'),
    };
    this.httpclient.post(orderurl, orderparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.abnormalorderList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = res['data']['list'] ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initAbnormalOrderInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 查看异常信息
  viewDetail(parameters) {
    this.parameters=parameters;
    $("#parameters_detail").modal('show')
  }
  // 重置
  queryReset() {
    $('#saleTime').val("");
    $('#orderNum').val("");
    $('#orderSource').select2('val', "");
    this.pageNum = 1;
    this.initAbnormalOrderInfo();
  }
  // C7000000304
  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }
}
