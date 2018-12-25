
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';

declare var $: any;

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  public brandList = [];//品牌列表
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = '';//总页数
  public currentpage = '';//当前页码
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public detailList: BrandInfo;//详情列表
  public brLogo: any;//logo
  public brBanner: any;//banner
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };

  constructor(private httpclient: HttpClient, private route: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.detailList = new BrandInfo('', '', '', '', 0,
      '', '', '');
    this.searchBrand();
  }

  editBrand() {
    var that = this;
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, '请选择一个品牌进行编辑', 'warning');
      return;
    }
    var brid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/brand/editbrand'], {
      queryParams: {
        brid
      }
    });
  }

  // 查询
  searchBrand() {
    this.isload = false;
    var that = this;
    var params = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      'brandSid': $('.brandId').val(),
      'brandName': $('.brandName').val()
    };
    var url = '/pcm-admin/brands';
    this.httpclient.post(url, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.brandList = res['data']['content'];
          this.pagetotal = res['data']['pageTotal'];
          this.currentpage = res['data']['currentPage'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchBrand();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });

  }

  // 重置
  resetBrand() {
    $('.brandId').val('');
    $('.brandName').val('');
    this.ngOnInit();
  }

  // 查看详情
  itemDetail(detailId) {
    var that = this;
    console.log(detailId);
    var burl = `/pcm-admin/brand/${detailId}`;
    this.httpclient.get(burl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.detailList = res['data'];
          this.brLogo = this.sanitizer.bypassSecurityTrustResourceUrl(res['data']['brandpic1']);
          this.brBanner = this.sanitizer.bypassSecurityTrustResourceUrl(res['data']['brandpic2']);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
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
    this.warnMsg = '';
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/pcm/company']);
    }
  }
}

export class BrandInfo {
  constructor(
    public brandName: String,
    public brandSid: String,
    public spell: String,
    public brandNameEn: String,
    public isDisplay: Number,
    public brandDesc: String,
    public organizationName: String,
    public organizationCode: String
  ) {
  }
}
