import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
import {  } from 'ng-zorro-antd';
declare var $: any;

@Component({
  selector: 'app-deliverychildview',
  templateUrl: './deliverychildview.component.html',
  styleUrls: ['./deliverychildview.component.css']
})
export class DeliverychildviewComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public orderNo: any;//订单号
  public sourceList = [];//订单来源
  public propNameList = [];//订单明细动态表头
  public packageList = [];//包裹记录
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
  }
  // 快递单查询
  initPackageInfo(deliveryNo) {
    $("#modal_order").modal('show');
    this.isload = false;
    const that = this;
    const orderurl = '/oms-admin/package/queryPackageHistoryByOrderNo';
    const orderparams = {
      "deliveryNo":deliveryNo
    };
    this.httpclient.post(orderurl, orderparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.packageList = res['data'];
          console.log("列表:");
          console.log(res);
          console.log(this.packageList);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }


}
