import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-returnagio',
  templateUrl: './returnagio.component.html',
  styleUrls: ['./returnagio.component.css']
})
export class ReturnagioComponent implements OnInit {
  @ViewChild('addreagio') addreagio
  @ViewChild('editreagio') editreagio
  // @ViewChild('reviewagio') reviewagio
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public reagioList:Array<any>;//工单列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.loadAgioList()
  }
  loadAgioList() {
    this.isload = false;
    var orderNo = $("#orderNo").val(),
    billNo = $("#billNo").val(),
    billStatus=$("#billStatus").val();
    var that = this;
    var selecturl = '/oms-admin/refundDifference/selectByPage';
    var seleparams = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      "orderNo": orderNo,
      "billNo": billNo,
      "billStatus": billStatus
    }
    this.httpclient.post(selecturl,seleparams,this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.reagioList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.reagioList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.loadAgioList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  resetSearchInfo() {
    $('input').val('');
    $('select').val('');
    $("#billStatus").val('');
    this.pageNum = 1;
    this.loadAgioList();
  }
  //审核 
  reviewAgio(billNo,status,pid) { 
    // this.reviewagio.initReviewAgio(reagitem);
    this.route.navigate(['oms/returnagio/reviewagio'], {
      queryParams: {
        billNo,pid,status
      }
    });
  }
  //新增退差价
  addReturnagio() {
    this.addreagio.initReturnAgio();
  }
  editReagio(reagitem) {
    this.editreagio.initEditAgio(reagitem);
  }
  // 子组件保存成功后刷新
  refreshChild() { 
    this.loadAgioList();
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
