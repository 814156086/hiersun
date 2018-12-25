import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
import { TryCatchStmt } from '@angular/compiler';

@Component({
  selector: 'app-addcompany',
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.css']
})
export class AddcompanyComponent implements OnInit {
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }


  ngOnInit() {
  }
  subCompany() {
    this.isload = false;
    if ($('.orgCode').val() == '') {
      this.showWarnWindow(true, "公司编码不能为空", "warning");
      return;
    }
    if ($('.orgName').val() == '') {
      this.showWarnWindow(true, "公司编码不能为空", "warning");
      return;
    }
    var params = {
      organizationCode: $(".orgCode").val(),
      organizationName: $(".orgName").val()
    }
    var subcurl = "/pcm-admin//company/save";
    this.httpclient.post(subcurl, params, this.httpOptions).subscribe(
     res=>{
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "添加成功，返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  goBack() {
    this.route.navigate(['/pcm/company'])
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
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/pcm/company'])
    }
  }
}
