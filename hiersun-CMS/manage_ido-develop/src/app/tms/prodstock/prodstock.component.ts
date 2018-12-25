import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-prodstock',
  templateUrl: './prodstock.component.html',
  styleUrls: ['./prodstock.component.css']
})
export class ProdstockComponent implements OnInit {

  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public cateList = [];//品类
  public stockList = [];//商品信息
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    if ($().select2) {
      $('#categoryCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadCateList();//品类列表
    this.loadStockList();
  }
  // 品类列表
  loadCateList() {
    this.isload = false;
    let nowPageurl = '/pcm-admin/dict/dicts/ZCATEGORY';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cateList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载库存
  loadStockList() {
    this.isload = false;
    var that = this;
    var invturl = '/tms-admin/inventory/books';
    var skuNo = $('#skuNo').val(),
      spuNo = $('#spuNo').val(),
      categoryCode = $("#categoryCode").select2('val')
    var params = new HttpParams()
      .set("currentPage", `${this.pageNum}`)
      .set("pageSize", "10")
      .set("skuNo", skuNo)
      .set("spuNo", spuNo)
      .set("categoryCode", categoryCode)
    this.httpclient.get(invturl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.stockList = res['data']['content']
          console.log(this.stockList);
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = res['data']['recordTotal'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.loadStockList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
// 重置
  resetStockList() {
    $("#categoryCode").select2('val', '');
    $("#skuNo").val("");
    $("#spuNo").val("");
    this.pageNum = 1;
    this.loadStockList();
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
}

