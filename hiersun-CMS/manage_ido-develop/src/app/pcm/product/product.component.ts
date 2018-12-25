import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { collectExternalReferences } from '@angular/compiler';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'
  ]
})
export class ProductComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  productList;
  // brandList;
  public pageNum = 1;
  public pagetotal = 1;
  public currentpage = 1;
  public pageSize = 10;
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public cateList;//品类
  // public zprcList;// 产品系列
  public recordTotal = 0;//记录总数
  proTypeList = [];//商品类型列表
  constructor(private httpclient: HttpClient, private route: Router) {
  }

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
    this.productList = [];
    this.loadCateList();//品类列表
    this.loadProTypeList();//商品类型列表
    // this.loadBrandList();//品牌列表 
    // this.loadZprcList();//产品系列列表
    this.initProductList();
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
  // 品类列表
  loadCateList() {
    this.isload = false;
    let nowPageurl = '/pcm-admin/dict/dicts/ZCATEGORY';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cateList = res['data'];
          this.cateList.forEach(element => {
            element['namecode'] = `${element['name']}(${element['code']})`
          })
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 产品系列
  // loadZprcList() {
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
  // loadBrandList() {
  //   const url = '/pcm-admin/brands';
  //   this.httpclient.get(url, this.httpOptions).subscribe(res => {
  //     console.log(res);
  //     this.isload = true;
  //     this.brandList = res['data'];
  //   });
  // }
  // queryProduct() {
  //   this.initProductList();
  // }
  initProductList() {
    this.productList = [];
    var purl = '/pcm-admin/commodity/getProductListForSearch';
    // var nObj = {};
    // if ($(".cateId").select2('val')) {
    //   nObj['categoryCode'] = $(".cateId").select2('val');
    // }
    // if ($('#select2_selling').val()) {
    //   nObj['productIsSelling'] = $('#select2_selling').val();
    // }
    // if ($('#SaleStatus').val()) {
    //   nObj['productStatus'] = $('#SaleStatus').val();
    // }
    // var nList = [];
    // nList.push(nObj);
    var params = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      // "list": nList
      "productType": $("#select2_proType").select2('val'),
      "categoryCode": $(".cateId").select2('val'),
      "productIsSelling": $('#select2_selling').val(),
      "productStatus": $('#SaleStatus').val()
    };
    if ($('.searchText').val()) {
      params['searchText'] = $('.searchText').val()
    }
    const that = this;
    this.httpclient.post(purl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        // if (res == null) {
        //   return;
        // }
        // if (!res.hasOwnProperty('data')) {
        //   return;
        // }
        if (res['code'] == 200) {
          const data = res['data'];
          var dlen = data ? data.list.length : 0;
          if (dlen != 0) {
            if (data.total < data.currentPage) {
              this.pageNum = 1;
            }
            this.productList = data.list;
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
        }
        else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      });
  }

  queryReset() {
    $(".cateId").select2('val', '');
    $('#select2_selling').val("");
    $('#SaleStatus').val("");
    $('.searchText').val("");
    $("#select2_proType").select2('val', '');
    this.pageNum = 1;
    this.isload = true;
    this.recordTotal = 0;
    this.productList = [];
    this.initProductList();
  }

  editProduct(productCode) {
    // var that = this;
    // var size = $('td input[type="checkbox"]:checked').length;
    // if (size != 1) {
    //   this.showWarnWindow(true, "请选择一个产品进行编辑", "warning");
    //   return;
    // }
    // var isRead = $('td input[type="checkbox"]:checked').val();
    // if (isRead == 1) {
    //   this.showWarnWindow(true, "此产品暂不能修改", "warning");
    //   return;
    // }
    // var pid = $('td input[type="checkbox"]:checked').attr('title');
    var pid = productCode;
    this.route.navigate(['pcm/product/editproduct'], {
      queryParams: {
        pid
      }
    });
  }
  /**
 * 上架产品信息
 */
  // changeSkuSaleStatus(status) {
  //   this.isload = false;
  //   // const thisObjRef = this;
  //   //判断是否有选择的数据
  //   const checkBoxs = $('td input[type="checkbox"]:checked');
  //   const checkedData = checkBoxs.attr('title');
  //   if (typeof (checkedData) == 'undefined') {
  //     this.showWarnWindow(true, "请选择商品信息", "warning");
  //     return;
  //   }
  //   //遍历每一行选中的数据
  //   const checkedRows = $('td input[type="checkbox"]:checked').parents("tr");
  //   //状态退出方法
  //   let state = true;
  //   checkedRows.each(function () {
  //     if (status == 0) {
  //       if ($(this).children("td")[4].innerText == "已下架" || $(this).children("td")[4].innerText == "未上架") {
  //         this.showWarnWindow(true, "请选择" + "未下架" + "的商品信息", "warning");
  //         // thisObjRef.alertMsgBox(thisObjRef, "请选择" + "未下架" + "的商品信息", 2);
  //         state = false;
  //       }
  //     } else {
  //       if ($(this).children("td")[4].innerText == "已上架") {
  //         this.showWarnWindow(true, "请选择" + "未上架" + "的商品信息", "warning");
  //         // thisObjRef.alertMsgBox(thisObjRef, "请选择" + "未上架" + "的商品信息", 2);
  //         state = false;
  //       }
  //     }
  //   });
  //   if (!state) {
  //     return;
  //   }
  //   //编码列表
  //   let skuCodes = [];
  //   //遍历选中的checkbox信息
  //   checkBoxs.each(function () {
  //     skuCodes.push($(this).attr("title"));
  //   });
  //   console.log(skuCodes, "skuCodes");

  //   let url = "";
  //   //下架
  //   if (status == 0) {
  //     url = "/pcm-admin/product/dis_sale";
  //   } else {
  //     //上架
  //     url = "/pcm-admin/product/offer_sale";
  //   }

  //   const params = {
  //     'type': 0,//状态 产品0 商品1
  //     'sids': skuCodes //编码列表
  //   };
  //   this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
  //     console.log(res);
  //     if (res == null) {
  //       return;
  //     }
  //     if (!res.hasOwnProperty('code')) {
  //       return;
  //     }
  //     this.isload = true;
  //     const code = res['code'];
  //     if (code == 200) {
  //       this.showWarnWindow(true, "操作处理成功", "success");
  //       // this.alertMsgBox(thisObjRef, "操作处理成功", 1);
  //     } else {
  //       this.showWarnWindow(true, "操作处理失败[" + code + "]" + res["desc"], "warning");
  //     }
  //     this.initProductList();
  //   });
  // }
  changeSkuSaleStatus(status, productCode) {
    this.isload = false;

    //编码列表
    let skuCodes = [];
    skuCodes.push(productCode)
    console.log(skuCodes, "skuCodes");
    let url = "";
    //上架
    if (status == 0) {
      url = "/pcm-admin/product/offer_sale";
    } else {
      //下架
      url = "/pcm-admin/product/dis_sale";
    }

    const params = {
      'type': 0,//状态 产品0 商品1
      'sids': skuCodes //编码列表
    };
    this.httpclient.post(url, params, this.httpOptions).subscribe(
      res => {
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
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  dtlProduct() {
    var that = this;
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择一个产品", "warning");
      return;
    }
    var pid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/product/dtlproduct'], {
      queryParams: {
        pid
      }
    });
  }
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
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.initProductList();
    }

  }
  // 定做商品详情
  // verifyPrice() { 
  //   this.route.navigate(['/pcm/verifyprice'])
  // }
}

