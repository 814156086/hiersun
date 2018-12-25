import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';

@Component({
  selector: 'app-editcompany',
  templateUrl: './editcompany.component.html',
  styleUrls: ['./editcompany.component.css']
})
export class EditcompanyComponent implements OnInit {
  public comId: any;//编辑的id
  public comCode: any;//编辑的公司编码
  public comName: any;//编辑的公司名称
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
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.comId = queryParams.sid;
    });
  }

  ngOnInit() {
    // var that = this;
    this.isload = false;
    var editurl = `/pcm-admin//company/${this.comId}`;
    this.httpclient.post(editurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.comCode = res['data']['organizationCode'];
          this.comName = res['data']['organizationName'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }

  subeCompany() {
    this.isload = false;
    if ($('.orgCode').val() == '') {
      this.showWarnWindow(true, "公司编码不能为空", "warning");
      return;
    }
    if ($('.orgName').val() == '') {
      this.showWarnWindow(true, "公司名称不能为空", "warning");
      return;
    }
    var params = {
      organizationCode: $(".orgCode").val(),
      organizationName: $(".orgName").val(),
      sid: this.comId
    }
    console.log(params);
    var subeurl = "/pcm-admin//company/modify";
    this.httpclient.post(subeurl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "修改成功，返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
