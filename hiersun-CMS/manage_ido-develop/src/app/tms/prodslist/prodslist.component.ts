import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-prodslist',
  templateUrl: './prodslist.component.html',
  styleUrls: ['./prodslist.component.css']
})
export class ProdslistComponent implements OnInit {
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
  public prodsList = [];//商品信息
  public headerList = [];//动态表头信息
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    if ($().select2) {
      $('#select2_cate').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadCateList();//品类列表
    this.loadProdsList();
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
  // 查询数据
  loadProdsList() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/localproduct/selectLocalProduct';
    var skuNo = $('#skuNo').val(),
      spuNo = $('#spuNo').val(),
      categoryCode = $("#select2_cate").select2('val')
    var params = new HttpParams()
      .set("currentPage", `${this.pageNum}`)
      .set("pageSize", "10")
      .set("skuNo", skuNo)
      .set("spuNo", spuNo)
      .set("categoryCode", categoryCode)
    this.httpclient.get(selecturl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          if (res['data']['content'].length) {
            this.headerList = res['data']['content'][0]['propNameList'];
            this.prodsList = res['data']['content'][0]['saleItemList'];
            console.log(this.prodsList);
            this.currentpage = res['data']['currentPage'];
            this.pagetotal = res['data']['pageTotal'];
            this.recordTotal = res['data']['recordTotal'];
          } else {
            this.headerList = [];
            this.prodsList = [];
            this.recordTotal = 0;
          }
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.loadProdsList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  /* 重置 */
  resetProdsList() {
    $("#select2_cate").select2('val', '');
    $("#skuNo").val("");
    $("#spuNo").val("");
    this.pageNum = 1;
    this.loadProdsList();
  }
  getProp(itemList) {
    var proplist = []
    if (itemList && itemList.length) {
      proplist = itemList;
    } else {
      this.headerList.forEach(elemrnt => {
        proplist.push('——')
      })
    }
    return proplist;
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
