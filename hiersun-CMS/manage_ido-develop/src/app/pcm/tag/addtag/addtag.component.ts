import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-addtag',
  templateUrl: './addtag.component.html',
  styleUrls: ['./addtag.component.css']
})
export class AddtagComponent implements OnInit {
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
    this.isload = false;
    $('#beginADt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#endADt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    this.isload = true;
  }
  subTag() {
    this.isload = false;
    if ($('.tagType').val() == '') {
      this.showWarnWindow(true, "标签类型不能为空", "warning");
      return;
    }
    if ($('.tagName').val() == '') {
      this.showWarnWindow(true, "标签名称不能为空", "warning");
      return;
    }
    var beginDate = new Date($('.beginDate').val()).getTime();
    var endDate = new Date($('.endDate').val()).getTime();
    if (beginDate > endDate) {
      this.showWarnWindow(true, "结束时间不能早于开始时间", "warning");
      return;
    }
    if ($('.beginDate').val() == '') {
      this.showWarnWindow(true, "标签开始时间不能为空", "warning");
      return;
    }
    if ($('.endDate').val() == '') {
      this.showWarnWindow(true, "标签结束时间不能为空", "warning");
      return;
    }
    var isDisplayInput = $('input[name="isdislpay"]:checked').attr('title');
    if (!isDisplayInput) {
      this.showWarnWindow(true, "标签是否启用不能为空", "warning");
      return;
    }
    var subTagUrl = '/pcm-admin/tag';
    var subTagParams = {
      "beginDate": beginDate,
      "endDate": endDate,
      "status": $('input[name="isdislpay"]:checked').attr('title'),
      "tagName": $.trim($('.tagName').val()),
      "tagType": $('.tagType').val()
    };
    console.log(subTagParams);

    this.httpclient.post(subTagUrl, subTagParams, this.httpOptions).subscribe(
      res => {
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
    this.route.navigate(['/pcm/tag'])
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
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/pcm/tag'])
    }
  }
}
