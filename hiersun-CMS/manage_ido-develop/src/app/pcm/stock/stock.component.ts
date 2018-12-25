import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  public pageNum = 1;//页码
  public currentPage: number;//当前页
  public pageSize = 10;//每页显示数量
  public pagetotal = '';//总页数
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public detailList = []//详情列表
  public recordTotal = 0;//记录总数
  public detailStoreList = [];//库存变动详情门店列表
  public stockHistoryList = [];//库存变动详情门店列表

  public npageNum = 1;//详情modal页码
  public ncurrentPage: number;//详情modal当前页
  public npageSize = 10;//详情modal每页显示数量
  public npagetotal = '';//详情modal总页数
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  productList;
  brandList;
  storeList;

  constructor(private httpclient: HttpClient, private route: Router) {
  }

  ngOnInit() {
    if ($().select2) {
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#brandCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadStoreList();
    this.loadBrandList();
  }

  loadBrandList() {
    this.isload = false;
    const url = '/pcm-admin/brands';
    this.httpclient.get(url, this.httpOptions).subscribe(res => {
      this.isload = true;
      this.brandList = res['data'];
    });
  }


  loadStoreList() {
    this.isload = false;
    const url = '/pcm-admin/stores/all';
    const param = {
      "organizationCode": "",
      "storeType": 1
    };
    this.httpclient.post(url, param, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code']==200) {
        this.storeList = res['data'];
      }else{
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }

  initStockInfoList() {
    var storeCode=$.trim($('#storeCode').val())
    if (!storeCode) { 
      this.showWarnWindow(true, "请选择所属门店!", "warning");
      return
    }
    const url = '/pcm-admin/stock/get_all_productstocks';
    const params = {
      'currentPage': this.pageNum,
      'pageSize': this.pageSize,
      'storeCode': storeCode,
      'productCode': $.trim($('#productCode').val()),
      'skuCode': $.trim($('#skuCode').val()),
      'brandCode': $.trim($('#brandCode').val()),
      'productType': $.trim($('#skuType').val()),
      'barcode': $.trim($('#barcode').val()),
    };
    this.isload = false;
    var that = this;
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      var data = res['data'];
      if (res['code'] == 200) {
        this.isload = true;
        this.productList = data['content'];
        this.currentPage = data['currentPage'];
        this.pagetotal = data['pageTotal'];
        this.recordTotal = data['recordTotal'];
      } else { 
        this.showWarnWindow(true, res['desc'], "warning");
      }
      $('#pagination1').pagination({
        currentPage: that.currentPage,
        totalPage: that.pagetotal,
        callback: function (current) {
          that.pageNum = current;
          that.initStockInfoList();
        }
      });
    });
  }

  queryReset() {
    $('#brandCode').select2("val", "");
    $('#storeCode').select2("val", "");
    $('#productCode').val("");
    $('#skuCode').val("");
    $('#skuType').val("");
    $('#barcode').val("");
    this.pageNum = 1;
    this.productList = [];
    this.recordTotal = 0;
    this.isload = true;
    // this.initStockInfoList();
  }
  // 修改库存
  editStock() {
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择一个库存进行编辑", "warning");
      return;
    }
    // var isRead = $('td input[type="checkbox"]:checked').val();
    // if (isRead == 1) {
    //   this.showWarnWindow(true, "此库存暂不能修改", "warning");
    //   return;
    // }
    var spid = $('td input[type="checkbox"]:checked').attr('title');
    var stoId = $('td input[type="checkbox"]:checked').val();
    this.route.navigate(['pcm/stock/editstock'], {
      queryParams: {
        spid,
        stoId
      }
    });
  }
  // 库存变动详情
  changeStockDetail(barCode) {
    $("#modal_stock").modal('show');
    // this.loaddetailStoreList(barCode);
    this.loadStockHistoryList();
  }
  // loaddetailStoreList(spSid){
  //   this.isload = false;
  //   var stoitemurl = "/pcm-admin/stock/get_current_stockInfos";
  //   var stoitemPa = {
  //     shoppeProSid: spSid
  //   };
  //   this.httpclient.post(stoitemurl, stoitemPa, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         this.detailStoreList = res['data'];
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   );
  // }
  loadStockHistoryList() {
    var that = this;
    this.isload = false;
    var shcitemurl = "/pcm-admin/stock/stock_history_change";
    var shcitemPa = {
      'currentPage': this.npageNum,
      'pageSize': this.npageSize,
      "channelSid": $('#channelCode').val(),
      "stockTypeSid": $('#stockType').val()
    };
    this.httpclient.post(shcitemurl, shcitemPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.stockHistoryList = res['data']['content'];
          this.ncurrentPage = res['data']['currentPage'];
          this.npagetotal = res['data']['pageTotal'];
          this.recordTotal = res['data']['recordTotal'];
        }
        $('#pagination2').pagination({
          currentPage: that.ncurrentPage,
          totalPage: that.npagetotal,
          callback: function (current) {
            that.npageNum = current;
            that.loadStockHistoryList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  disModal() {
    this.npageNum = 1;
    this.stockHistoryList = [];
  }

  /**
   * 商品停用启用
   */
  changeSkuStatus(status) {
    this.isload = false;
    // const thisObjRef = this;
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
      skuCodes.push($(this).attr("title"));
    });
    const url = "/pcm-admin/product/status";
    const params = {
      'productType': 1,//sku
      'status': status,//状态 0 禁用 1启用
      'sids': skuCodes //编码列表
    };
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      this.isload = true;
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
      const code = res['code'];
      if (code == 200) {
        this.showWarnWindow(true, "操作处理成功", "success");
      } else {
        this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
      }
      this.initStockInfoList();
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
    this.isShowWarnWin = false;
    this.warnMsg = "";
    this.isload = true;
  }

  /**
   * 上架产品信息
   */
  changeSkuSaleStatus(status) {
    const thisObjRef = this;
    //判断是否有选择的数据
    const checkBoxs = $('td input[type="checkbox"]:checked');
    const checkedData = checkBoxs.attr('title');
    if (typeof (checkedData) == 'undefined') {
      this.showWarnWindow(true, "请选择商品信息", "warning");
      return;
    }
    this.isload = false;
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
      skuCodes.push($(this).attr("title"));
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
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      console.log(res);
      this.isload = true;
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('code')) {
        return;
      }
      const code = res['code'];
      if (code == 200) {
        this.showWarnWindow(true, "操作处理成功", "success");
      } else {
        this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
        // this.alertMsgBox(thisObjRef, "操作处理失败[" + code + "]" + res["desc"], 2);
      }
      this.initStockInfoList();
    });
  }

  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
  // 库存跳转产品详情
  dtlProducta(pCode, isSell, disEdit) {
    var pid = pCode;
    var isSell = isSell;
    var disEdit = disEdit;
    this.route.navigate(['pcm/product/dtlproduct'], {
      queryParams: {
        pid, isSell, disEdit
      }
    });
  }
  // 库存跳转商品详情
  dtlCommodity(bCode, dCode, isSell, disEdit) {
    // var pid = 'A006643791';
    console.log(bCode, dCode, isSell, disEdit)
    var pid = bCode;
    var pdc = dCode;
    var isSell = isSell;
    var disEdit = disEdit;
    this.route.navigate(['pcm/commodity/dtlcommodity'], {
      queryParams: {
        pid, pdc, isSell, disEdit
      }
    });
  }
}
