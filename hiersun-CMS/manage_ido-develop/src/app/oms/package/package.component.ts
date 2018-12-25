import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  @ViewChild('saledetail') saledetail
  @ViewChild('deliverychildview') deliverychildview;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  public recordTotal = 0;
  public packageList = [];//订单列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    $('#sendTime').daterangepicker({
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
    this.initPackageInfo();
  }
  initPackageInfo() {
    this.isload = false;
    const saleTimeStart = $('#sendTime').val().split('--')[0];
    const saleTimeEnd = $('#sendTime').val().split('--')[1];
    const that = this;
    const orderurl = '/oms-admin/package/queryNotPackagePage';
    const orderparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "deliveryNo": $('#deliveryNo').val(),
      "saleNo": $('#saleNo').val(),
      "startTimeStr": saleTimeStart,
      "endTimeStr": saleTimeEnd
    };
    this.httpclient.post(orderurl, orderparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.packageList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = res['data']['list'] ? 1 : 0;
          //console.log(this.packageList+"-"+this.currentpage+"-"+this.pagetotal+"-"+this.recordTotal);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initPackageInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  queryReset() {
    $('#saleNo').val("");
    $('#deliveryNo').val("");
    $('#sendTime').val("");
    this.pageNum = 1;
    this.isload = true;
    this.recordTotal = 0;
    this.packageList = [];
    this.initPackageInfo();
  }
  // 销售单详情弹窗
  getSalesMes(saleNo,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }

  getDeliveryInfoLIst(deliveryNo) {
    this.deliverychildview.initPackageInfo(deliveryNo);
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
