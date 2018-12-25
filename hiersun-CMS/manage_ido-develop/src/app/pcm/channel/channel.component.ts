import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  public channelList = [];//渠道列表
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.searchChannel();
  }
  editChannel() {
    var that = this;
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择一个渠道进行编辑", "warning");
      return;
    }
    var cid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/channel/editchannel'], {
      queryParams: {
        cid
      }
    });
  }
  // 查询
  searchChannel() {
    this.isload = false;
    var that = this;
    var url = '/pcm-admin/channels';
    var params = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      "channelName": $.trim($('.chanName').val()),
      "channelCode": $.trim($('.chanId').val())
    }
    this.httpclient.post(url, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.channelList = res['data']['content'];
          this.pagetotal = res['data']['pageTotal'];
          this.currentpage = res['data']['currentPage'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
        $("#pagination1").pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchChannel();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  resetChannel() {
    $('.chanName').val("");
    $('.chanId').val("");
    this.pageNum = 1;
    this.searchChannel();
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
