import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public companyList = [];//公司列表
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public isload = false;//是否加载
  // public isHint = true;//提示弹窗
  // public hintMsg = '';//提示内容
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    var that = this;
    this.searchCompany();
  }
  editCompany() {
    var that = this;
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择一个公司进行编辑", "warning");
      return
    }
    var sid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/company/editcompany'], {
      queryParams: {
        sid
      }
    });
  }
  // 查询
  searchCompany() {
    this.isload = false;
    var that = this;
    var params = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      "organizationCode": $('.comId').val(),
      "organizationName": $('.comName').val()
    }
    var url = '/pcm-admin//companies'
    this.httpclient.post(url, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.companyList = res['data']['content'];
          this.pagetotal = res['data']['pageTotal'];
          this.currentpage = res['data']['currentPage'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchCompany();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 重置
  resetCompany() {
    $('.comId').val("");
    $('.comName').val("");
    this.ngOnInit();
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
