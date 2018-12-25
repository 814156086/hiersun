import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
  }
  mergeWKOrder() {
    var originalWKOrderNo = $('#originalWKOrderNo').val();
    var newWKOrderNo = $('#newWKOrderNo').val();
    if (!originalWKOrderNo) {
      this.showWarnWindow(true, "主销售单号不能为空", "warning");
      return;
    }
    if (!newWKOrderNo) {
      this.showWarnWindow(true, "尾款销售单号不能为空", "warning");
      return;
    }
    this.isload = false;
    var merUrl = "/oms-admin/sale/mergeWkSale"
    var merparams = {
      "originalOrderNo": originalWKOrderNo,
      "newOrderNo": newWKOrderNo
    }
    this.httpclient.post(merUrl, merparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "尾款销售单合并成功！", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  mergeCJOrder() {
    var originalCJOrderNo = $('#originalCJOrderNo').val();
    var newCJOrderNo = $('#newCJOrderNo').val();
    if (!originalCJOrderNo) {
      this.showWarnWindow(true, "主销售单号不能为空", "warning");
      return;
    }
    if (!newCJOrderNo) {
      this.showWarnWindow(true, "差价销售单号不能为空", "warning");
      return;
    }
    this.isload = false;
    var mercjUrl = "/oms-admin/sale/mergeCjSale"
    var mercjparams = {
      "originalOrderNo": originalCJOrderNo,
      "newOrderNo": newCJOrderNo
    }
    this.httpclient.post(mercjUrl, mercjparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "差价销售单合并成功！", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }

  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
    this.isload = true;
  }
}
