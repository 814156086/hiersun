import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
@Component({
  selector: 'app-detailsku',
  templateUrl: './detailsku.component.html',
  styleUrls: ['./detailsku.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailskuComponent implements OnInit, OnDestroy {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public spageNum = 1;//页码
  public pagetotal = "";//总页数
  public scurrentpage = ""//当前页码
  public isload = false;//是否加载
  public prodId: any;//详情产品的id
  public isSell: any;//详情跳转编辑
  public disEdit: any;//是否展示修改
  proTypeList = [];//商品类型
  proTypeName: any;//商品类型名称
  proTypeFlag: any;//商品类型有效期是否显示
  yearToMarket: any;//有效期
  productCode: any;//版库编码
  brdName: any;//品牌
  cateName: any;//产品分类
  productName: any;//标准名
  detailParamList = [];//商品信息列表 列表头
  skuDtlList = [];//商品信息列表
  public commId: any;//编辑商品的id
  public commList = [];//tab2 商品列表
  public headerList = [];//tab2 商品列表  表头
  // public showModal = true;//tab2 详情modal是否显示
  public priConList = []//tab2 编辑 (详情) 价格控制项的显示
  public commProList = []//tab2 编辑(详情)  商品属性的显示
  public commTypeList = []//tab2添加商品类型的显示
  public barCodeMesg: BarCodeInfo;//tab2 编辑(详情)  条码信息的显示
  public priceMesg: PriceInfo;//tab2 编辑(详情)  价格信息的显示
  public storeList = []//tab2 编辑(详情)  门店的显示
  public showPicList = [];//tab4 图片上传，右侧显示
  TabNo: TabNo;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.prodId = queryParams.pid;
      this.isSell = queryParams.isSell;
      this.disEdit = queryParams.disEdit;
      console.log(queryParams);
    });
    productService.TabNoEventer.subscribe(TabNo => {
      productService.defaultTabNo = TabNo;
    })
  }

  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    this.loadProTypeList();
  }
  // 商品类型列表
  loadProTypeList() {
    var brdurl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(res => {
      if (res['code'] == 200) {
        this.proTypeList = res['data'];
        this.sdtabBase();
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  // 商品信息
  sdtabBase() {
    this.isload = false;
    this.loadHeaders();
    this.skuDtlList = [];
    var tab1url = '/pcm-admin/sku/getSkuInfoByCode';
    var params = new HttpParams()
      .set('skuCode', `${this.prodId}`)
    this.httpclient.get(tab1url, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var proTypeCode = res['data']['productType'];
          this.productCode = res['data']['productCode'];
          this.brdName = res['data']['brandName'];
          this.productName = res['data']['productName'];
          this.cateName = res['data']['categoryName'];
          this.skuDtlList.push(res['data']);
          this.proTypeName = proTypeCode ? this.proTypeList.filter((b, c) => b.code == proTypeCode)[0]['name'] : '';
        } else {
          this.showWarnWindow(true, res['desc'], 'warnning')
        }
      });
  }
  loadHeaders() {
    this.isload = false;
    this.detailParamList = [];
    var tab1url = '/pcm-admin/sku/getSkuForSearch';
    var params = {
      "searchText": this.prodId
    }
    this.httpclient.post(tab1url, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var detailList = res['data']['headers'];
          detailList.unshift({
            'propsName': '商品编码',
            'propsCode': 'proDetailCode'
          })
          detailList.push({
            'propsName': '价格',
            'propsCode': 'proDetailPrice'
          })
          this.detailParamList = detailList;
        } else {
          this.showWarnWindow(true, res['desc'], 'warnning')
        }
      });
  }
  // 条码商品信息
  sdtabPro() {
    var that = this;
    this.isload = false;
    let proDtlUrl = '/pcm-admin/commodity/getProDetailListForSearch';
    var proPram = {
      "currentPage": this.spageNum,
      "pageSize": 5,
      "searchText": this.prodId
    }
    this.httpclient.post(proDtlUrl, proPram, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res["code"] == 200) {
          this.commList = res["data"]["list"];
          this.headerList = res["data"]["headers"];
          this.pagetotal = res["data"]["pageTotal"];
          this.scurrentpage = res["data"]["currentPage"];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $("#pagination2").pagination({
          currentPage: this.scurrentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.spageNum = current;
            that.sdtabPro();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // tab2 商品详情显示
  dtlProMes(a) {
    var itemId = a;
    $("#modal_dtl").modal('show');
    this.isload = false;
    var promesURl = `/pcm-admin/commodity/get_product_commodity_info/${itemId}`
    this.httpclient.get(promesURl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.priceMesg = res['data']['commodityPriceDto'];
          this.barCodeMesg = res['data']['commodityBarcodeDto'];
          var codeType = res['data']['commodityBarcodeDto']['codeType'];
          this.priConList = res['data']['priceControlProps'];
          this.commProList = res['data']['commodityProps'];
          $('.codeId').val(codeType);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.getCommoType();
    this.getStore();
  }

  // 获取商品类型信息
  getCommoType() {
    this.isload = false;
    var commourl = "/pcm-admin/dict/dicts/mtart"
    this.httpclient.get(commourl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.commTypeList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 门店信息
  getStore() {
    var storeurl = `/pcm-admin/stores/all`;
    var stoPa = {
      organizationCode: "",
      storeType: ""
    };
    this.httpclient.post(storeurl, stoPa, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.storeList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 图片上传
  sdtabCommPic() {
    this.showMainPic(1, this.prodId);
  }
  showMainPic(mtype, mid) {
    this.isload = false;
    var spUrl = `/pcm-admin/product/pics/${mtype}/${mid}`;
    var obj = {};
    obj['proDetailCode'] = this.prodId;
    var propsStr = JSON.stringify(obj);
    this.httpclient.post(spUrl, propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      console.log(res)
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
      }
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 返回
  goBack() {
    // this.route.navigate(['/pcm/skumanage'])
    window.history.go(-1);
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
  }
  toSku(a) {
    if (this.isSell == 1) {
      this.showWarnWindow(true, "上架商品不能修改", "warning");
      return;
    }
    // var pid = this.commCode;
    var pdc = this.prodId;
    this.route.navigate(["/pcm/skumanage/editsku"], {
      queryParams: {
        pdc
      }
    });
    this.TabNo = { num: a, pnum: this.commId, sid: "" };
  }
  ngOnDestroy() {
    this.productService.TabNoEventer.emit(this.TabNo);
  }
}
export class BarCodeInfo {
  constructor(
    public detailName: String,
    public barcode: String,
    public storeName: String
  ) {
  }
}
export class PriceInfo {
  constructor(
    public currentPrice: String,
    public originalPrice: String
  ) {
  }
}