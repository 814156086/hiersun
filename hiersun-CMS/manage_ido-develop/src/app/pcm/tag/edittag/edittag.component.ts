import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-edittag',
  templateUrl: './edittag.component.html',
  styleUrls: ['./edittag.component.css']
})
export class EdittagComponent implements OnInit {
  public tagCode: any;//编辑的标签id
  public tagName: any;//编辑的标签名称
  public tagType: any;//编辑的标签类型
  public beginDate: any;//编辑的开始时间
  public endDate: any;//编辑的结束时间
  public status: any;//编辑的是否启用
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.tagCode = queryParams.tcode;
    });
    console.log(this.tagCode)
  }

  ngOnInit() {
    $('#beginEDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#endEDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    this.loadTagInfo();
  }
  loadTagInfo() {
    this.isload = false;
    var that = this;
    var tagparams = {
      "tagCode": this.tagCode,
    }
    var tagUrl = '/pcm-admin/tags';
    this.httpclient.post(tagUrl, tagparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.tagName = res['data']['content'][0]['tagName'];
          this.tagType = res['data']['content'][0]['tagType'];
          this.beginDate = res['data']['content'][0]['beginDate'];
          this.endDate = res['data']['content'][0]['endDate'];
          this.status = res['data']['content'][0]['status'];
          $('.tagType').val(this.tagType);
          $(`input[name='isdislpay'][title=${this.status}]`).attr("checked", true);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  subETag() {
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
      "tagType": $('.tagType').val(),
      "tagCode": this.tagCode
    };
    this.httpclient.put(subTagUrl, subTagParams, this.httpOptions).subscribe(
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
  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
}
