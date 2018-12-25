
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';

@Component({
  selector: 'app-editchannel',
  templateUrl: './editchannel.component.html',
  styleUrls: ['./editchannel.component.css']
})
export class EditchannelComponent implements OnInit {
  public chanId: any;//编辑的id
  public chanCode: any;//编辑的销售渠道编码
  public chanName: any;//编辑的销售渠道名称
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
   httpOptions = {     headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })   };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.chanId = queryParams.cid;
    });
    console.log(this.chanId)
  }
  ngOnInit() {
    var that = this;
    var editchurl = `/pcm-admin//channel/${this.chanId}`;
    this.httpclient.post(editchurl, this.httpOptions).subscribe(
      res => {
        that.isload = true;
        if (res['code'] == 200) {
          this.chanCode = res['data']['channelCode'];
          this.chanName = res['data']['channelName'];
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
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
      channelName: $(".chanName").val(),
      sid: this.chanId
    }
    console.log(params);
    var subeurl = "/pcm-admin/channel/modify";
    if (issub) {
      console.log(subeurl);
      this.httpclient.post(subeurl, params, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            that.showWarnWindow(true, "修改成功,返回列表页", "success");
          } else {
            that.showWarnWindow(true, res['desc'], "warning");
          }
        }, (err: HttpErrorResponse) => {
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
