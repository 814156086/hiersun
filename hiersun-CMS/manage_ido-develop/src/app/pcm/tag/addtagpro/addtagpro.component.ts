import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-addtagpro',
  templateUrl: './addtagpro.component.html',
  styleUrls: ['./addtagpro.component.css']
})
export class AddtagproComponent implements OnInit {
  public tagCode: any;//标签的Code
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public detailList = []//详情列表
  public recordTotal = 0;//记录总数
  public headerList = [];//tab2 商品列表  表头
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public isAdd: any;//添加 批量导入
  public SraechJson: any;//查询的json串
  productList;
  cateList;//品类
  proTypeList; // 商品类型
  storeList;//门店
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.tagCode = queryParams.tcode;
      this.isAdd = queryParams.isadd;
    });
  }
  ngOnInit() {
    if ($().select2) {
      $('.select2me').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.productList = [];
    this.headerList = [];
    this.loadCateList();//品类列表
    this.loadProTypeList();//商品类型列表
    this.loadStoreList();//门店列表
  }
  // 品类列表
  loadCateList() {
    this.isload = false;
    let nowPageurl = '/pcm-admin/dict/dicts/ZCATEGORY';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        console.log(res);
        this.cateList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 门店列表
  loadStoreList() {
    this.isload = false;
    var storeurl = `/pcm-admin/stores/all`;
    var stoPa = {
      organizationCode: "",
      storeType: ""
    };
    this.httpclient.post(storeurl, stoPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code']==200) {
          this.storeList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  //商品类型列表
  loadProTypeList() {
    this.isload = false;
    const protUrl = '/pcm-admin/dict/dicts/MTART';
    this.httpclient.get(protUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        this.proTypeList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  initProductList() {
    this.productList = [];
    this.headerList = [];
    this.isload = false;
    var ca = $(".cateId").select2('val');
    if (!ca) {
      this.showWarnWindow(true, "请选择品类", "warning");
      return;
    }
    const url = '/pcm-admin/commodity/getProDetailListForSearch';
    var nListObj = {};
    if ($(".cateId").select2('val')) {
      nListObj['categoryCode'] = $(".cateId").select2('val');
    }
    if ($(".storeId").select2('val')) {
      nListObj['storeCode'] = $(".storeId").select2('val');
    }
    if ($(".proType  ").select2('val')) {
      nListObj['mtart'] = $(".proType  ").select2('val');
    }
    if ($('#sellingStatus').val()) {
      nListObj['proDetailIsSelling'] = $('#sellingStatus').val();
    }
    // 批量导入json串
    var impObj = nListObj;
    impObj['searchText'] = $('.searchText').val();
    this.SraechJson = JSON.stringify(impObj);
    // var nListArr = [];
    // nListArr.push(nListObj);
    var params = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "categoryCode":$(".cateId").select2('val'),
      "storeCode":$(".storeId").select2('val'),
      "mtart": $(".proType  ").select2('val'),
      "proDetailIsSelling":$('#sellingStatus').val(),
      // list: nListArr
    };
    if ($('.searchText').val()) {
      params['searchText'] = $('.searchText').val()
    }

    const that = this;
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      console.log(res);
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      this.isload = true;
      const data = res['data'];
      var dlen = data ? data.list.length : 0;
      if (dlen != 0) {
        if (data.total < data.currentPage) {
          this.pageNum = 1;
          // this.initProductList();
        }
        this.productList = data.list;
        this.headerList = data.headers;
        this.currentpage = data.currentPage;
        this.pagetotal = data.pageTotal;
        this.recordTotal = 1;
      } else {
        this.recordTotal = 0
      }
      $('#pagination1').pagination({
        currentPage: this.currentpage,
        totalPage: this.pagetotal,
        callback: function (current) {
          that.pageNum = current;
          that.initProductList();
        }
      });
    });
  }

  queryReset() {
    $(".cateId").select2('val', '');
    $(".storeId").select2('val', '');
    $(".proType").select2('val', '');
    $('#sellingStatus').val("");
    $('.searchText').val("");
    this.pageNum = 1;
    this.isload = true;
    this.recordTotal = 0;
    this.productList = [];
    this.headerList = [];
  }
  addTotag(a) {
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请查询选择要添加的商品", "warning");
      return;
    }
    if (this.recordTotal == 0) {
      this.showWarnWindow(true, "暂无相关商品记录", "warning");
      return;
    }
    var tagProId = '';
    $('input[name="tagPro"]:checked').each(function (cindex, citem) {
      tagProId += $(citem).attr('title') + ","
    })
    var tagProCode = tagProId.slice(0, tagProId.length - 1)
    var addTagProUrl = '/pcm-admin/tag-bind';
    var addTagProParams = {
      "proDetailCodeList": [
        tagProCode
      ],
      "tagCode": this.tagCode
    };
    var importTagProParams = {
      "queryStr": this.SraechJson,
      "tagCode": this.tagCode
    };
    var TagProParams = a == 0 ? addTagProParams : importTagProParams;
    this.httpclient.post(addTagProUrl, TagProParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "添加成功，返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  removeFromTag() {

  }
  goBack() {
    this.route.navigate(['/pcm/tag'])
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
      that.route.navigate(['/pcm/tag'])
    }
  }
}
