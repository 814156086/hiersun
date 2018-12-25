import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.css'
  ]
})
export class CommodityComponent implements OnInit {

  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public detailList = []//详情列表
  public recordTotal = 0;//记录总数
  public headerList = [];//tab2 商品列表  表头

  public isload = false;//是否加载
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  productList;
  // brandList;//品牌
  cateList=[];//品类
  // zprcList;// 产品系列
  proTypeList; // 商品类型
  storeList;//门店
  constructor(private httpclient: HttpClient, private route: Router) {
  }

  ngOnInit() {
    if ($().select2) {
      $('#select2_cate').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#select2_store').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#select2_proType').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.productList = [];
    this.headerList = [];
    this.loadCateList();//品类列表
    this.loadProTypeList();//商品类型列表
    this.loadStoreList();//门店列表
    // this.loadZprcList();//产品系列列表
    // this.loadBrandList();//品牌列表
    this.initProductList();//加载列表
  }
  editCommodity(pid,pdc,isread) {
    // var size = $('td input[type="checkbox"]:checked').length;
    // if (size != 1) {
    //   this.showWarnWindow(true, "请选择一个商品进行编辑", "warning");
    //   return;
    // }
    // var isRead = $('td input[type="checkbox"]:checked').attr("class");
    // var newread = isRead.substring(3);
    if (isread == 1) {
      this.showWarnWindow(true, "上架商品不能修改", "warning");
      return;
    }
    // var pid = $('td input[type="checkbox"]:checked').attr('title');
    // var pdc = $('td input[type="checkbox"]:checked').val();
    // var pid = 'A006643791';
    this.route.navigate(['pcm/commodity/editcommodity'], {
      queryParams: {
        pid, pdc
      }
    });
  }
  dtlCommodity(bCode, dCode, isSell,disEdit) {
    // var pid = 'A006643791';
    var pid = bCode;
    var pdc = dCode;
    var isSell = isSell;
    var disEdit = disEdit;
    this.route.navigate(['pcm/commodity/dtlcommodity'], {
      queryParams: {
        pid, pdc, isSell,disEdit
      }
    });
  }
  // 品类列表
  loadCateList() {
    this.isload = false;
    let nowPageurl = '/pcm-admin/dict/dicts/ZCATEGORY';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if(res['code']==200){
          this.cateList = res['data'];
          this.cateList.forEach(element=>{
            element['namecode']=`${element['name']}(${element['code']})`
          })
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
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
        this.storeList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  //商品类型列表
  loadProTypeList() {
    this.isload = false;
    const protUrl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(protUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        this.proTypeList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 品牌列表
  // loadBrandList() {
  //   this.isload = false;
  //   const url = '/pcm-admin/brands';
  //   this.httpclient.get(url, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       this.brandList = res['data'];
  //     });
  // }
  // 产品系列
  // loadZprcList() {
  //   this.isload = false;
  //   const zprcUrl = '/pcm-admin/dict/dicts/ZPRD_SRS';
  //   this.httpclient.get(zprcUrl, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       this.zprcList = res['data'];
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     });
  // }

  initProductList() {
    this.productList = [];
    this.headerList = [];
    this.isload = false;
    // var ca = $("#select2_cate").select2('val');
    // if (!ca) {
    //   this.showWarnWindow(true, "请选择品类", "warning");
    //   return;
    // }
    const url = '/pcm-admin/commodity/getProDetailListForSearch';
    // var nListObj = {};
    // if ($(".cateId").select2('val')) {
    //   nListObj['categoryCode'] = $(".cateId").select2('val');
    // }
    // if ($(".storeId").select2('val')) {
    //   nListObj['storeCode'] = $(".storeId").select2('val');
    // }
    // if ($(".proType  ").select2('val')) {
    //   nListObj['mtart'] = $(".proType  ").select2('val');
    // }
    // if ($('#sellingStatus').val()) {
    //   nListObj['proDetailIsSelling'] = $('#sellingStatus').val();
    // }
    // var nListArr = [];
    // nListArr.push(nListObj);
    var params = {
      'currentPage': this.pageNum,
      'pageSize': 10,
      'categoryCode':$("#select2_cate").select2('val'),
      'storeCode':$("#select2_store").select2('val'),
      'productType': $("#select2_proType").select2('val'),
      'proDetailIsSelling':$("#sellingStatus").val()
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
      // this.productList = data.list;
      // this.headerList = data.headers;
      // this.currentpage = data.currentPage;
      // this.pagetotal = data.total;
      // this.recordTotal = data.recordTotal;
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
    $("#select2_cate").select2('val', '');
    $("#select2_store").select2('val', '');
    $("#select2_proType").select2('val', '');
    $('#sellingStatus').val("");
    $('.searchText').val("");
    this.pageNum = 1;
    this.isload = true;
    this.recordTotal = 0;
    this.productList = [];
    this.headerList = [];
    this.initProductList();
  }

  /**
   * 商品停用启用
   */
 /*  changeSkuStatus(status) {
    this.isload = false;
    const thisObjRef = this;
    //判断是否有选择的数据
    const checkBoxs = $('td input[type="checkbox"]:checked');
    const checkedData = checkBoxs.attr('title');
    if (typeof (checkedData) == 'undefined') {
      this.showWarnWindow(true, "请选择商品信息", "warning");
      // this.alertMsgBox(thisObjRef, "请选择商品信息", 1);
      return;
    }
    //遍历每一行选中的数据
    const checkedRows = $('td input[type="checkbox"]:checked').parents("tr");
    const statusText = status == 0 ? "禁用" : "启用";
    //状态退出方法
    let state = true;
    checkedRows.each(function () {
      if ($(this).children("td")[5].innerText == statusText) {
        this.showWarnWindow(true, "请选择未" + statusText + "的商品信息", "warning");
        // thisObjRef.alertMsgBox(thisObjRef, "请选择未" + statusText + "的商品信息", 2);
        state = false;
      }
    });
    if (!state) {
      return;
    }
    //编码列表
    let skuCodes = [];
    //遍历选中的checkbox信息
    checkBoxs.each(function () {
      skuCodes.push($(this).val());
    });
    const url = "/pcm-admin/product/status";
    const params = {
      'productType': 1,//sku
      'status': status,//状态 0 禁用 1启用
      'sids': skuCodes //编码列表
    };
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      console.log(res);
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      if (!res.hasOwnProperty('code')) {
        return;
      }
      this.isload = true;
      const code = res['code'];
      if (code == 200) {
        this.initProductList();
        this.showWarnWindow(true, "操作处理成功", "success");
        // this.alertMsgBox(thisObjRef, "操作处理成功", 1);
      } else {
        this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
        // this.alertMsgBox(thisObjRef, "操作处理失败[" + code + "]" + res["desc"], 2);
      }
      // this.initProductList();
    });
  } */

  /**
   * 弹窗组件
   * @param that
   * @param msg
   */
  // alertMsgBox(that, msg, delay) {
  //   delay *= 1000;
  //   this.isHint = false;
  //   this.hintMsg = msg;
  //   setTimeout(function () {
  //     that.isHint = true;
  //     that.hintMsg = '';
  //   }, delay);
  // }

  /**
   * 上架产品信息
   */
 /*  changeSkuSaleStatus(status) {
    this.isload = false;
    // const thisObjRef = this;
    //判断是否有选择的数据
    const checkBoxs = $('td input[type="checkbox"]:checked');
    const checkedData = checkBoxs.attr('title');
    if (typeof (checkedData) == 'undefined') {
      this.showWarnWindow(true, "请选择商品信息", "warning");
      return;
    }
    //遍历每一行选中的数据
    const checkedRows = $('td input[type="checkbox"]:checked').parents("tr");
    //状态退出方法
    let state = true;
    checkedRows.each(function () {
      if (status == 0) {
        if ($(this).children("td")[4].innerText == "已下架" || $(this).children("td")[4].innerText == "未上架") {
          this.showWarnWindow(true, "请选择" + "未下架" + "的商品信息", "warning");
          // thisObjRef.alertMsgBox(thisObjRef, "请选择" + "未下架" + "的商品信息", 2);
          state = false;
        }
      } else {
        if ($(this).children("td")[4].innerText == "已上架") {
          this.showWarnWindow(true, "请选择" + "未上架" + "的商品信息", "warning");
          // thisObjRef.alertMsgBox(thisObjRef, "请选择" + "未上架" + "的商品信息", 2);
          state = false;
        }
      }
    });
    if (!state) {
      return;
    }
    //编码列表
    let skuCodes = [];
    //遍历选中的checkbox信息
    checkBoxs.each(function () {
      skuCodes.push($(this).val());
    });
    let url = "";
    //下架
    if (status == 0) {
      url = "/pcm-admin/product/dis_sale";
    } else {
      //上架
      url = "/pcm-admin/product/offer_sale";
    }

    const params = {
      'type': 1,//状态 产品0 商品1
      'sids': skuCodes //编码列表
    };
    console.log(params);
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      console.log(res);
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('code')) {
        return;
      }
      this.isload = true;
      const code = res['code'];
      if (code == 200) {
        this.showWarnWindow(true, "操作处理成功", "success");
        // this.alertMsgBox(thisObjRef, "操作处理成功", 1);
      } else {
        this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
      }
      this.initProductList();
    });
  } */

  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
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
    this.isload = true;
  }
}

