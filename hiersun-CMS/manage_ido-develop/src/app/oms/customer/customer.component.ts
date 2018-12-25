import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import {forEach} from '@angular/router/src/utils/collection';
declare var $: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1;//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  cusWorderList: Array<any> = [];//客服工单列表
  //字典表
  public codeList = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    $('#timeSpan').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    this.initCodeList();
    this.initCustWorkList();
  }
  // 加载工单类型
  // loadWoStatus() {
  //   this.isload = false;
  //   const woturl = '/oms-admin/dict/selectCodelist';
  //   const woparam = {
  //     "typeValue": "work_order_status "
  //   };
  //   this.httpclient.post(woturl, woparam, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         this.wotList = res['data'];
  //       }
  //     });
  // }
  // 加载客服工单列表
  initCustWorkList() {
    this.isload = false;
    var that = this;
    var orderNo = $('#orderNo').val(),
      orderType = $('#orderType').val(),
      timeSpan = $("#timeSpan").val(),
      originator = $("#originator").val();
      // orderStatus = $('#orderStatus').val();
    const cusurl = '/oms-admin/customer/act/list';
    let params = new HttpParams()
      .set('currentPage', `${this.pageNum}`)
      .set('pageSize', "10")
      .set('orderNo', orderNo)
      .set('orderType',orderType)
      .set('orderStatus', '1')
      .set('originator',originator);
    if(timeSpan){
      params = params
        .set('createBeginTime',timeSpan.split("--")[0])
        .set('createEndTime',timeSpan.split('--')[1]);
    }
    this.httpclient.get(cusurl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cusWorderList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.cusWorderList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initCustWorkList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  /* 重置 */
  resetCustList() {
    $('#orderNo').val("");
    $('#orderName').val("");
    // $('#orderStatus').val("");
    $('#orderType').val("");
    $("#timeSpan").val("");
    $("#originator").val("");
    this.pageNum = 1;
    this.initCustWorkList();
  }
  /**
* 全局弹窗
*/
  showWarnWindow(status, warnMsg, btnType) {
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
  initCodeList(){
    this.isload = false;
    let codeUrl = "/oms-admin/dict/selectCodelist";
    let codeParams = {
      "typeValue": "work_order_type"
    };
    this.httpclient.post(codeUrl, codeParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.codeList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  /**
   * 跳转详情页
   * @param item
   */
  toDetail(item) {
    console.log(item);
  }
}
