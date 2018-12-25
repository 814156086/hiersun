import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public regionList = [];//行政区域列表
  public provList = [];//省列表
  public cityList = [];//市列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.initregionList();
    this.initProvList();
  }
  // 省
  initProvList() {
    this.isload = false;
    var provurl = '/pcm-admin/regions?parentId=1&levelType=1';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.provList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 市
  initCityList() {
    this.isload = false;
    var parentId = $('#provCode').val()
    var provurl = `/pcm-admin/regions?parentId=${parentId}&levelType=2`;
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cityList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 查询
  initregionList() {
    this.isload = false;
    var that = this;
    var selecturl = '/pcm-admin/regions';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "parentid": $("#cityCode").val() ? $("#cityCode").val() : $('#provCode').val(),
      "id": $('#regionCode').val(),
      "name": $('#regionName').val(),
      "leveltype": !$('#regionName').val() && !$('#regionCode').val() && !$('#provCode').val() ? 1 : ""
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.regionList = res['data']['content'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = this.regionList.length ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initregionList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  resetRegion() {
    $('#provCode').val("");
    $('#cityCode').val("");
    $('#regionName').val("");
    $('#regionCode').val("");
    this.pageNum = 1;
    this.cityList = [];
    this.initregionList();
  }
  editRegion() {
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择行政区域进行编辑", "warning");
      return;
    }
    var regionid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/region/editregion'], {
      queryParams: {
        regionid
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
  }
}
