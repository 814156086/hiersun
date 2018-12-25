import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-skumanage',
  templateUrl: './skumanage.component.html',
  styleUrls: ['./skumanage.component.css']
})
export class SkumanageComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public cateList = [];//品类列表
  public proTypeList=[];//品类列表
  public skuList = [];//信息列表
  public headerList = [];//动态加载的表头
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    if ($().select2) {
      $('#select2_cate').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#select2_proType').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.isload = true;
    this.loadProTypeList();//商品类型列表
    this.loadCateList();//品类列表
    this.loadSkuList();//查询列表
  }
  // 品类列表
  loadCateList() {
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
  // 查询列表
  loadSkuList() {
    this.isload = false;
    var that = this;
    this.headerList = [];
    // var ca = $("#select2_cate").select2('val');
    // if (!ca) {
    //   this.showWarnWindow(true, "请选择品类", "warning");
    //   return;
    // }
    var skuUrl = '/pcm-admin/sku/getSkuForSearch';
    // var nObj = {};
    // if ($(".cateId").select2('val')) {
    //   nObj['categoryCode'] = $("#select2_cate").select2('val');
    // }
    // if ($('#select2_selling').val()) {
    //   nObj['productIsSelling'] = $('#select2_selling').val();
    // }
    // if ($('#SaleStatus').val()) {
    //   nObj['productStatus'] = $('#SaleStatus').val();
    // }
    // var nList = [];
    // nList.push(nObj);
    var skuParams = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      // "list": nList
      "productType":$("#select2_proType").select2('val'),
      "categoryCode": $("#select2_cate").select2('val'),
      "productIsSelling": $('#select2_selling').val(),
      "productStatus": $('#SaleStatus').val(),
    };
    if ($('.searchText').val()) {
      skuParams['searchText'] = $('.searchText').val()
    }
    this.httpclient.post(skuUrl, skuParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.skuList = res['data']['list'];
          this.headerList = res['data']['headers'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = this.skuList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.loadSkuList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  queryReset() {
    $('select').val('');
    $("#select2_cate").select2('val', "");
    $("#select2_proType").select2('val', '');
    $('.searchText').val('');
    this.pageNum = 1;
    this.recordTotal = 0;
    this.loadSkuList();
  }
  /**
* 上架产品信息
*/
/*   changeSkuSaleStatus(status) {
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
      skuCodes.push($(this).attr("title"));
    });
    console.log(skuCodes, "skuCodes");

    let url = "";
    //下架
    if (status == 0) {
      url = "/pcm-admin/product/dis_sale";
    } else {
      //上架
      url = "/pcm-admin/product/offer_sale";
    }

    const params = {
      'type': 0,//状态 产品0 商品1
      'sids': skuCodes //编码列表
    };
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
      this.loadSkuList();
    });
  } */
  changeSkuSaleStatus(status, productCode) {
    this.isload = false;

    //编码列表
    let skuCodes = [];
    skuCodes.push(productCode)
    let url = "";
    //下架
    if (status == 0) {
      url = "/pcm-admin/product/offer_sale";
    } else {
      //上架
      url = "/pcm-admin/product/dis_sale";
    }

    const params = {
      'type': 1,//状态 产品0 商品1
      'sids': skuCodes //编码列表
    };
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('code')) {
        return;
      }
      this.isload = true;
      const code = res['code'];
      if (code == 200) {
        status == 0 ? this.showWarnWindow(true, `${res["data"]}`, "success") : this.showWarnWindow(true, '操作处理成功', "success");
        // this.alertMsgBox(thisObjRef, "操作处理成功", 1);
      } else {
        this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
      }
    });
  }

  // 详情
  detailtlSku(pCode: any, isSell: any, disEdit: any) {
    var pid = pCode;
    var isSell = isSell;
    var disEdit = disEdit;
    this.route.navigate(['pcm/product/dtlproduct'], {
      queryParams: {
        pid, isSell, disEdit
      }
    });
  }
  getDtlSku(pCode: any, isSell: any, disEdit: any){
    var pid = pCode;
    var isSell = isSell;
    var disEdit = disEdit;
    this.route.navigate(['pcm/skumanage/detailsku'], {
      queryParams: {
        pid,isSell,disEdit
      }
    });
  }
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      this.loadSkuList();
    }

  }
}
