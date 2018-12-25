import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  public tagsList = [];//标签列表
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public isload = false;//是否加载
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    $('#beginDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#endDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    this.searchTag();
  }
  // resetDate() {
  //   console.log("resetDate");
  // }
  // setBegin() {
  //   console.log("setBegin");
  //   $('#beginDt').datetimepicker({
  //     format: "yyyy-MM-dd hh:ii",//21 1 2013 - 03:25 PM
  //     showMeridian: false,
  //     autoclose: true,
  //     todayBtn: true
  //   });
  // }
  // setEnd() {
  //   $('#endDt').datetimepicker({
  //     format: "yyyy-MM-dd hh:ii",
  //     showMeridian: false,
  //     autoclose: true,
  //     todayBtn: true,
  //   });
  // }
  searchTag() {
    var beginDate = new Date($('.beginDate').val()).getTime();
    var endDate = new Date($('.endDate').val()).getTime()
    if (beginDate > endDate) {
      this.showWarnWindow(true, "结束时间不能早于开始时间", "warning");
      return;
    }
    this.isload = false;
    var that = this;
    var tagparams = {
      "beginDate": beginDate,
      "currentPage": this.pageNum,
      "endDate": endDate,
      "pageSize": this.pageSize,
      // "status": 0,
      // "tagCode": "string",
      "tagName": $.trim($('.tagName').val()),
      "tagType": $('.tagType').val()
    }
    var tagUrl = '/pcm-admin/tags';
    this.httpclient.post(tagUrl, tagparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.tagsList = res['data']['content'];
          this.pagetotal = res['data']['pageTotal'];
          this.currentpage = res['data']['currentPage'];
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchTag();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  resetTag() {
    $('.tagName').val("");
    $('.tagType').val("");
    $('.beginDate').val("");
    $('.endDate').val("");
    this.ngOnInit();
  }
  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
  editTag(tcode) {
    this.route.navigate(['pcm/tag/edittag'], {
      queryParams: {
        tcode
      }
    });
  }
  addTagPro(tcode,isadd) {
    this.route.navigate(['pcm/tag/addtagpro'], {
      queryParams: {
        tcode,isadd
      }
    });
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
}
