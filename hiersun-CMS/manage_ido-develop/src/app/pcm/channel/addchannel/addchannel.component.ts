
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'

@Component({
  selector: 'app-addchannel',
  templateUrl: './addchannel.component.html',
  styleUrls: ['./addchannel.component.css']
})
export class AddchannelComponent implements OnInit {
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;

   httpOptions = {     headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })   };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
  }

  subChannel() {
    var issub = true;
    var that = this;
    if ($('.chanCode').val() == '') {
      this.showWarnWindow(true, "销售渠道编码不能为空", "warning");
      return;
    }
    if ($('.chanName').val() == '') {
      this.showWarnWindow(true, "销售渠道名称不能为空", "warning");
      return;
    }
    var params = {
      channelCode: $(".chanCode").val(),
      channelName: $(".chanName").val()
    }
    var subchurl = "/pcm-admin//channel/save";
    if (issub) {
      this.httpclient.post(subchurl, params, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.showWarnWindow(true, "添加成功,返回列表页", "success");
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
        },   (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    }
  }

  goBack() {
    this.route.navigate(['/pcm/channel'])
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
      that.route.navigate(['/pcm/channel'])
    }
  }
}
