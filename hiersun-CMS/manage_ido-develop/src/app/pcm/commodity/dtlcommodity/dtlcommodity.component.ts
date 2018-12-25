import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
declare const window: any;
declare const WebUploader: any;

@Component({
  selector: 'app-dtlcommodity',
  templateUrl: './dtlcommodity.component.html',
  styleUrls: ['./dtlcommodity.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DtlcommodityComponent implements OnInit, OnDestroy {
  public commCode: any;//编辑商品的code
  public isSell: any;//详情跳转编辑
  public disEdit = 1;//编辑按钮显示（库存跳转）
  public commId: any;//编辑商品的id
  public proDtlCode: any;//商品productdetailcode		
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public storeList = [];//tab2 编辑门店列表
  public priConList = []//tab2 编辑 (详情) 价格控制项的显示
  public commProList = []//tab2 编辑(详情)  商品属性的显示
  public priceMesg: PriceInfo;//tab2 编辑(详情)  价格信息的显示
  public commTypeList = [];//tab2添加商品类型的显示
  public barCodeMesg: BarCodeInfo;//tab2 编辑(详情)  条码信息的显示
  public showMainList = [];//tab3 回显的列表
  public setting: any //ztree
  public valuesList = [];//tab3 点击分类获取value的列表
  public detList = [];//tab3 点击分类右侧显示的内容的列表(含名字)
  public valtitle = "";//tab3 右侧分类显示的单项的名字（拼串）
  public uploader: any;//tab4 图片上传
  public showPicList = [];//tab4 图片上传，右侧显示
  public sort = [];//tab4 图片拖拽的顺序
  public formData = new FormData();// tab4 图片保存
  TabNo: TabNo;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.commCode = queryParams.pid;
      this.proDtlCode = queryParams.pdc;
      this.isSell = queryParams.isSell;
      this.disEdit = queryParams.disEdit;
    });
    // this.mycontent = ``;
    productService.TabNoEventer.subscribe(TabNo => {
      productService.defaultTabNo = TabNo;
    })
  }
  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    // if ($().select2) {
    //   $('.select2me').select2({
    //     placeholder: 'Select',
    //     allowClear: true
    //   });
    // }
    this.etabCommPro();
  }

  etabCommPro() {
    this.isload = false;
    var promesURl = `/pcm-admin/commodity/get_product_commodity_info/${this.commCode}`
    this.httpclient.get(promesURl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        // this.editData = res['data'];
        if (res["code"] == 200) {
          this.priceMesg = res['data']['commodityPriceDto'];
          this.barCodeMesg = res['data']['commodityBarcodeDto'];
          this.commId = res['data']['commodityBarcodeDto']['sid'];
          var codeType = res['data']['commodityBarcodeDto']['codeType']
          this.priConList = res['data']['priceControlProps'];
          this.commProList = res['data']['commodityProps'];
          $('.codeId').val(codeType);
        } else { 
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.getCommoType();
    // this.getStore();
  }
  // 获取商品类型信息
  getCommoType() {
    this.isload = false;
    var commourl = "/pcm-admin/dict/dicts/mtart"
    this.httpclient.get(commourl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code']==200) {
          this.commTypeList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 门店信息
  // getStore() {
  //   this.isload = false;
  //   var storeurl = `/pcm-admin/stores/all`;
  //   var stoPa = {
  //     organizationCode: "",
  //     storeType: ""
  //   };
  //   this.httpclient.post(storeurl, stoPa, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       this.storeList = res['data'];
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   );
  // }

  // 图片上传
  etabCommPic() {
    this.showMainPic(1, this.proDtlCode);
  }
  showMainPic(mtype, mid) {
    this.isload = false;
    var spUrl = `/pcm-admin/product/pics/${mtype}/${mid}`;
    var obj = {};
    obj['proDetailCode'] = this.proDtlCode;
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
      that.route.navigate(['/pcm/company'])
    }
  }
  // 返回
  goBack() {
    // this.route.navigate(['/pcm/commodity'])
    window.history.go(-1);
  }
  toCommodity(a) {
    if (this.isSell == 1) {
      this.showWarnWindow(true, "上架商品不能修改", "warning");
      return;
    }
    var pid = this.commCode;
    var pdc = this.proDtlCode;
    this.route.navigate(["/pcm/commodity/editcommodity"], {
      queryParams: {
        pid, pdc
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
