import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TryCatchStmt } from '@angular/compiler';
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
declare const window: any;
declare const WebUploader: any;
@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditproductComponent implements OnInit {
  @ViewChild('skuprice') skuprice: any
  @ViewChild('isskuprice') isskuprice: any
  public prodId: any;//编辑产品的id
  public valueId: any;//编辑产品的id
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  tabno = 1;//详情跳转穿的tab值
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public setting: any //ztree
  public brdName: any;//tab1 品牌名称
  public brdSid: any;//tab1 品牌id
  public productName: any;//tab1 产品名称
  public productSid: any;//tab1 产品id
  public sid: any;//tab1 sid
  public cateId: any;//tab1 产品分类 id
  public cateName: any;//tab1 产品分类名
  public catePropList = [];//tab1 产品属性列表
  proTypeList = [];//商品类型
  proTypeName = "";//商品类型名称
  proTypeFlag: any;//商品类型有效期是否显示
  yearToMarket: any;//有效期
  proTypeSid = "";//商品sid
  detailParamList = [];//商品属性表头信息表
  skuDetailList = [];//商品属性信息表
  skulength = 0;//数组长度
  public commList = [];//tab2 商品列表
  public headerList = [];//tab2 商品列表  表头
  public showModal = true;//tab2 详情modal是否显示
  public storeList = [];//tab2 编辑门店列表
  public priConList = []//tab2 编辑 (详情) 价格控制项的显示
  public commProList = []//tab2 编辑(详情)  商品属性的显示
  public commTypeList = []//tab2添加商品类型的显示
  public priceMesg: PriceInfo;//tab2 编辑(详情)  价格信息的显示
  public barCodeMesg: BarCodeInfo;//tab2 编辑(详情)  条码信息的显示
  public treeObj: any;//tab3 左侧树显示 
  public showMainList = [];//tab3 回显的列表
  public valuesList = [];//tab3 点击分类获取value的列表
  public detList = [];//tab3 点击分类右侧显示的内容的列表(含名字)
  public valtitle = "";//tab3 右侧分类显示的单项的名字（拼串）
  public uploader: any;//tab4 图片上传
  public LevelPropsList = [];//tab4 图片上传 左侧 初始化显示 V1
  public salePropList = [];//tab4 图片上传 左侧 初始化显示
  public skuList = [];//tab4 图片上传 左侧 相关处理数组
  public skuCode: any;//tab4 图片上传 左侧 初始化skucode
  public skuLoadFlag = false;//tab4 图片上传 左侧 初始化是否结束
  public LevelList = [];//tab4 图片上传 左侧 点击返回的数组
  public ObjList = [];//tab4 图片上传 左侧 post提交
  public PicObjList = [];//tab4 图片上传 左侧 post提交
  public BackList = [];//tab4 图片上传 左侧 点击添加取消
  public flag = false;
  public wflag = false;//tab4 字符串数组 操作
  public propsStr = "";
  public prodCode: any;//tab4 图片上传 开始上传提交
  public picType: any;//tab4 图片上传 notype
  public showPicList = [];//tab4 图片上传，右侧显示
  public sort = [];//tab4 图片拖拽的顺序
  public enableDrag = true;//是否支持拖拽
  public formData = new FormData();// tab4 图片保存
  public shortDesc = "";//短名称
  public longDesc = "";//描述名称
  public siteList = [];//精包装站点列表
  public childList = [];// 右侧子页面信息列表
  delId: any;//站点ID
  channelId: any;
  siteId: any;
  haveChild = false;//精包装 子集
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  //查询的销售品类型 0:spu 1:sku
  public prType: any;
  //查询的商品/产品的sid
  // public prSid: any;
  // public skuNo: any;
  protected subscribeTabNo: TabNo;
  isSel = true;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  httpOptionsDelPic = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.prodId = queryParams.pid;
    });
    this.mycontent = ``;
    productService.TabNoEventer.subscribe(TabNo => {
      productService.defaultTabNo = TabNo;
    })
  }

  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    this.etabPic();
    this.subscribeTabNo = this.productService.defaultTabNo;
    if (this.subscribeTabNo) {
      this.tabno = this.subscribeTabNo.num;
      this.productSid = this.subscribeTabNo.pnum ? this.subscribeTabNo.pnum : '';
      this.sid = this.subscribeTabNo.sid ? this.subscribeTabNo.sid : '';
    } else {
      this.tabno = 1;
    }
    var that=this;
    // console.log(this.tabno, "tabno")
    $(`.tab_1_${this.tabno}`).click().addClass('active');
    switch (this.tabno) {
      case 1:
        this.etabBase();
        break;
      case 2:
        this.etabPro();
        break;
      case 3:
        this.etabMain();
        break;
      case 4:
        this.etabPic();
        setTimeout(function(){
          that.getChecked(); 
      }, 500);
        break;
      case 5:
        this.etabPackage();
        break;
      case 6:
        this.etabCmsPackage();
        break;
    }
    // this.etabBase();
    // if ($().select2) {
    //   $('.select2me').select2({
    //     placeholder: 'Select',
    //     allowClear: true
    //   });

    // }
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: "divarea,imagebrowser",
      forcePasteAsPlainText: true,
      imageBrowser_listUrl: "",
      image_previewText: " ",
      height: "300"
    };
  }
  // 商品类型列表
  loadProTypeList(proTypeSid) {
    var brdurl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.proTypeList = res['data'];
          this.proTypeList.forEach((elem => {
            if (elem.code == proTypeSid) {
              this.proTypeName = elem.name;
              this.proTypeFlag = elem.flag;
            }
          }))
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  etabBase() {
    this.isload = false;
    // this.loadProTypeList();
    // this.tabProduct(1);
    var tab1url = `/pcm-admin/product/get_productinfo/${this.prodId}`
    // var tab1url = '/pcm-admin/product/get_productinfo_effect';
    // const params = new HttpParams()
    // .set('productCode', `${this.prodId}`);
    this.httpclient.get(tab1url).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.proTypeSid = res['data']['detailType'];
          this.brdName = res["data"]["brandName"];
          this.brdSid = res["data"]["brandSid"];
          this.productName = res["data"]["productName"];
          this.yearToMarket = res["data"]["yearToMarket"];
          this.productSid = res["data"]["productSid"];
          this.sid = res["data"]["sid"];
          this.cateId = res["data"]["categorySid"];
          this.catePropList = res["data"]["categoryPropsDtos"];
          this.loadProTypeList(this.proTypeSid);
          // this.proTypeName = this.proTypeList.filter((b, c) => b.code == this.proTypeSid)[0]['name'];
          // this.proTypeFlag = this.proTypeList.filter((b, c) => b.code == this.proTypeSid)[0]['flag'];
          this.categotyInfo(this.cateId);
        } else {
          this.showWarnWindow(true, res['desc'], 'warnning')
        }
      });
    this.getHeadersList(this.prodId);
  }
  // tab 产品属性列表
  categotyInfo(a: any) {
    var cateUrl = `/pcm-admin/category/${a}`
    this.httpclient.get(cateUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.cateName = res["data"]["categoryName"];
        }
      });
    // this.getHeadersList(a)
  }
  // 商品属性信息
  getHeadersList(searchText: any) {
    this.isload = false;
    this.detailParamList = [];
    var detailList = [];
    this.skuDetailList = [];
    // var nObj={};
    // var nList = [];
    // nObj['productCode'] = searchText;
    // nList.push(nObj);
    const skuUrl = '/pcm-admin/sku/getSkuForSearch';
    const skuParams = {
      // 'searchText': searchText
      // 'list':nList
      "productCode": searchText
    }
    this.httpclient.post(skuUrl, skuParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          detailList = res['data']['headers'];
          detailList.unshift({
            'propsName': '商品编码',
            'propsCode': 'proDetailCode'
          })
          detailList.push({
            'propsName': '价格',
            'propsCode': 'proDetailPrice'
          })
          this.detailParamList = detailList;
          this.skuDetailList = res['data']['list'];
          this.skulength = this.skuDetailList.length ? this.skuDetailList.length : 0;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 商品属性删除
  delectSkuItem() {
    var skeyList = [];
    const checkRows = $('td input[name="sku_check"]:checked').parents("tr");
    checkRows.each((index: any, element: any) => {
      var skey = Number($($(element).children('td')[0]).attr('id'));
      skeyList.push(skey)
    });
    // var reverseList = skeyList.reverse();
    for (let val of skeyList) {
      this.skuDetailList.splice(val, 1)
    }

  }
  // 定做明细
  vetrifyModal() {
    var patternCode = $('#patternCode').val();
    // var categorySid = this.categorySid ? this.categorySid : this.cateId
    this.proTypeSid == '6' ? this.skuprice.initVerify(patternCode) : this.isskuprice.initProInfo(this.cateId);
  }
  // 获取定制商品弹窗传回的信息
  runChild(ObjInfo: Object) {
    var isChildObjCopy = {};//不含价格属性
    for (let i in ObjInfo) {
      if (i != 'proDetailPrice') {
        isChildObjCopy[i] = ObjInfo[i];
      }
    }
    // 不含价格属性的判断
    var that = this;
    var flag = false;
    for (let index = 0; index < this.skuDetailList.length; index++) {
      var length = 0;
      const val = this.skuDetailList[index];
      for (let icopy in isChildObjCopy) {
        if (val[icopy] == isChildObjCopy[icopy]) {
          length++;
        }
        if (length == that.detailParamList.length - 1) {
          val['proDetailPrice'] = ObjInfo['proDetailPrice'];
          flag = true;
        }
      }
    }
    if (!flag) {
      this.skuDetailList.push(ObjInfo);
    }

  }
  // 获取非定制商品弹窗返回的信息
  runIsChild(isListInfo: any) {
    var isChildObj = {};
    // 返回的数组添加propsCode
    var isChildObjCopy = {};//不含价格属性
    isListInfo.forEach((value: any, index: number) => {
      value['propsCode'] = this.detailParamList.filter((c, d) => c.propsName == value.propName)[0]['propsCode'];
    });
    isListInfo.forEach((element: any) => {
      isChildObj[`${element['propsCode']}`] = element['valueName'];
    });
    for (let i in isChildObj) {
      if (i != 'proDetailPrice') {
        isChildObjCopy[i] = isChildObj[i];
      }
    }
    var isflag = false;
    var that = this;
    for (let index = 0; index < this.skuDetailList.length; index++) {
      var length = 0;
      const val = this.skuDetailList[index];
      for (let icopy in isChildObjCopy) {
        if (val[icopy] == isChildObjCopy[icopy]) {
          length++;
        }
        if (length == that.detailParamList.length - 1) {
          val['proDetailPrice'] = isChildObj['proDetailPrice'];
          isflag = true;
        }
      }
    }
    if (!isflag) {
      this.skuDetailList.push(isChildObj);
    }
  }
  // 保存产品信息
  subeProduct() {
    this.isload = false;
    var alllist = [];
    $('.tr_sku').each((index: any, value: any) => {
      var obj = {};
      this.detailParamList.forEach(ele => {
        obj[`${ele['propsCode']}`] = $($(value).children(`.${ele['propsCode']}`)).text()
      })
      var price = $($(value).children('.proDetailPrice')).text();
      var proDetailCode = $($(value).children('.proDetailCode')).text();
      alllist.push({ 'map': obj, 'price': price, 'productCode': proDetailCode });
    })
    var issub = true;
    // if ($('.productName').text() == '') {
    //   this.showWarnWindow(true, "请填写产品名称", "warning");
    //   issub = false;
    //   return;
    // }
    if ($('.Not1').val() == '') {
      this.showWarnWindow(true, "红色*为必填项", "warning");
      issub = false;
      return;
    }
    if (!this.skulength) {
      this.showWarnWindow(true, "添加商品不能为空", "warning");
      issub = false;
      return;
    }
    var eproParameList = [];
    this.catePropList.forEach(function (v, i) {
      eproParameList.push({
        "level": v.level,
        "propName": v.propsName,
        "propSid": v.propsSid,
        "valueName": $(`.value${v.propsSid}`).find("option:checked").text() || $(`.pro${v.propsSid}`).val(),
        "valueSid": $(`.value${v.propsSid}`).val()
      })
    })
    this.isload = false;
    var eproSaveUrl = '/pcm-admin/product/save_productinfo';
    var eproSave = {
      "sid": this.sid,
      "productCode": this.prodId,
      "brandName": this.brdName,
      "brandSid": this.brdSid,
      "detailType": this.proTypeSid,
      "categorySid": this.cateId,
      "productName": $('.productName').text(),
      "productParameters": eproParameList,
      "detailParameters": alllist,
      "yearToMarket": this.yearToMarket
    }
    if (issub) {
      this.httpclient.post(eproSaveUrl, eproSave, this.httpOptions).subscribe(
        res => {
          this.isload = true;
          if (res['code'] == 200) {
            this.showWarnWindow(true, "保存成功", "success");
            $(`.tab_1_2`).click().addClass('active').show();
          } else {
            this.showWarnWindow(true, res['desc'], "warning")
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  etabPro() {
    this.isload = false;
    // this.tabProduct(2);
    var that = this;
    let proDtlUrl = '/pcm-admin/commodity/getProDetailListForSearch';
    // let proDtlUrl = '/pcm-admin/commodity/get_all_commodityinfos';
    // var proPram = {
    //   "currentPage": this.pageNum,
    //   "pageSize": 10,
    //   "spuNo": this.productSid
    // }
    var proPram = {
      "currentPage": this.pageNum,
      "pageSize": 5,
      "productCode": this.prodId
      // list: [{ }]
    }
    this.httpclient.post(proDtlUrl, proPram, this.httpOptions).subscribe(
      res => {
        // console.log(res);
        this.isload = true;
        if (res["data"]) {
          this.commList = res["data"]["list"];
          this.headerList = res["data"]["headers"];
          this.pagetotal = res["data"]["pageTotal"];
          this.currentpage = res["data"]["currentPage"];
          // console.log(this.commList);
        }
        $("#pagination1").pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.etabPro();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // tab 2 编辑信息
  editProMes(a, barcode) {
    // 数据回显
    // if (a == 1) {
    //   var size = $('input[type="checkbox"]:checked').length;
    //   if (size != 1) {
    //     this.showWarnWindow(true, "请选择一个商品进行编辑", "warning");
    //     this.showModal = true;
    //     return;
    //   }
    //   var itemId = $('input[type="checkbox"]:checked').attr('title');
    //   $("#modal_edit").modal('show');
    // } else {
    //   var itemId = a;
    //   $("#modal_detail").modal('show');
    // }
    a == 1 ? $("#modal_edit").modal('show') : $("#modal_detail").modal('show');
    var itemId = barcode;
    this.isload = false;
    var promesURl = `/pcm-admin/commodity/get_product_commodity_info/${itemId}`
    this.httpclient.get(promesURl, this.httpOptions).subscribe(
      res => {
        // console.log(res);
        this.isload = true;
        // this.editData = res['data'];
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
    // this.getStore();
  }
  // 获取商品类型信息
  getCommoType() {
    this.isload = false;
    var commourl = "/pcm-admin/dict/dicts/mtart"
    this.httpclient.get(commourl, this.httpOptions).subscribe(
      res => {
        // console.log(res);
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

  // tab2 保存 商品信息
  subeProMes() {
    this.isload = false;
    // if ($('.typeId').val() == '') {
    //   this.showWarnWindow(true, "商品类型不能为空", "warning");
    //   return;
    // }
    // if ($('.comodName').val() == '') {
    //   this.showWarnWindow(true, "商品名称不能为空", "warning");
    //   return;
    // }
    if ($('.Not1').val() == '') {
      this.showWarnWindow(true, "红色*为必填项", "warning");
      return;
    }
    // if ($('.tagPrice').val() == '') {
    //   this.showWarnWindow(true, "吊牌价不能为空", "warning");
    //   return;
    // }
    // if ($('.retailPrice').val() == '') {
    //   this.showWarnWindow(true, "零售价不能为空", "warning");
    //   return;
    // }
    // if ($('.storeName').select2('val') == '') {
    //   this.showWarnWindow(true, "门店不能为空", "warning");
    //   return;
    // }
    // if ($('.codeId').val() == '') {
    //   this.showWarnWindow(true, "条码类型不能为空", "warning");
    //   return;
    // }
    // if ($('.barCode').val() == '') {
    //   this.showWarnWindow(true, "条码编码不能为空", "warning");
    //   return;
    // }
    var priParameList = [];
    this.priConList.forEach(function (v, i) {
      priParameList.push({
        level: v.level,
        propName: v.propsName,
        propSid: v.propsSid,
        valueName: $(`.value${v.propsSid}`).find("option:checked").text() || $(`.pro${v.propsSid}`).val(),
        valueSid: $(`.value${v.propsSid}`).val()
      })
    })
    var comParameList = [];
    this.commProList.map(function (c, d) {
      comParameList.push({
        level: c.level,
        propName: c.propsName,
        propSid: c.propsSid,
        valueName: $(`.cpvalue${c.propsSid}`).find("option:checked").text() || $(`.cppro${c.propsSid}`).val(),
        valueSid: $(`.cpvalue${c.propsSid}`).val()
      })
    })
    var promessSave = {
      commodityBarcode: {
        barcode: $(".barCode").val(),
        codeType: $(".codeId").val(),
        storeCode: this.barCodeMesg['storeCode'],
        sid: this.barCodeMesg['sid']
      },
      barcodeParameters: comParameList,//商品属性
      commodityParameters: priParameList,//价格控制项
      commodityPrice: {
        currentPrice: $('.retailPrice').val(),
        originalPrice: $('.tagPrice').val(),
        promotionPrice: $('.retailPrice').val(),
      },
      proDetailName: $('.comodName').val(),
      mtart: $('.typeId').val(),
      productSid: this.sid
    }
    console.log(promessSave);
    this.isload = false;
    var promesSaveUrl = `/pcm-admin/commodity/save_commdity_props_info`
    this.httpclient.post(promesSaveUrl, promessSave, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "保存成功！", "success");
          $('#modal_add').hide()
          $(".modal-backdrop").hide();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        console.log(res);
        this.etabPro();
        // this.responseData = res["data"]
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  etabMain() {
    // this.tabProduct(3);
    this.detList = [];
    this.loadThirdTree();

  }
  //  the tree in third tab
  loadThirdTree() {
    this.setting = {
      check: {
        enable: true
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        beforeCheck: this.beforeCheck,
        onCheck: this.onCheck
      }
    };
    this.isload = false;
    // 更换为1
    let nowPageurl = '/pcm-admin/categories/1';
    var mtTree = [];
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var myobj = res['data'];
          myobj.forEach((value, index) => {
            value['pId'] = value['pid'];
          })
          let result = myobj.reduce(function (prev, item) {
            // console.log(prev,item);
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in result) {
            result[prop].forEach(function (item, i) {
              result[item.id] ? item.children = result[item.id] : ''
            });
          }
          mtTree = result[0];
          $.fn.zTree.init($("#thirdTree"), this.setting, mtTree);
          var treeObj = $.fn.zTree.getZTreeObj("thirdTree");
          this.treeObj = treeObj;
          treeObj.expandAll(true);
          this.showMainMes(this.prodId);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  beforeCheck(treeId, treeNode) {
    
  }
  onCheck(e, treeId, treeNode) {
    var obj1 = JSON.stringify(treeNode);
    $('input[name="mtmsg"]').val(obj1);
    $('.thirdclick').click();
  }

  thirdclick() {
    var that = this;
    let obj1 = JSON.parse($('input[name="mtmsg"]').val());
    if (obj1.checked) {
      var treeObj = $.fn.zTree.getZTreeObj("thirdTree");
      var nodes = treeObj.getCheckedNodes();//选中的树父子节点
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id == obj1.id) {
            var titList = nodes[i].getPath();
          }
        }
      }
      var valtitle = ""
      titList.forEach(function (v, i) {
        valtitle += ">" + v.name
      });
      this.valtitle = valtitle.substring(1);
      // console.log(this.valtitle);
      // var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${obj1.id}&type=1`
      var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${obj1.id}`
      this.isload = false;
      this.httpclient.get(aliurl, this.httpOptions).subscribe(
        res => {
          this.isload = true;
          this.valuesList = res['data'];
          this.detList.push({
            id: obj1.id,
            name: obj1.name,
            propName: this.valtitle,
            values: this.valuesList,
            showValList: this.valuesList//Q1
          })
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    } else {
      for (let i = 0; i < this.detList.length; i++) {
        if (this.detList[i].id == obj1.id) {
          this.detList.splice(i, 1);
        }
      }
      // console.log(this.detList);
    }
  }
  // 右侧回显内容
  showMainMes(cid) {
    this.isload = false;
    var cateURl = `/pcm-admin/product/procat_propvalues/1/${cid}`;
    var that = this;
    this.httpclient.get(cateURl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res["code"] == 200) {
          this.showMainList = res['data'];
          this.showMainList.forEach((elem) => {
            var treenode = this.treeObj.getNodeByParam("name", `${elem.categoryName}`, null);
            this.treeObj.checkNode(treenode);
          })
          if (res['data'].length) {
            that.showItem(that.showMainList);
          }
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  showItem(sml) {
    this.isload = false;
    var that = this;
    sml.map(function (sv, si) {
      var aliaurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${sv.categorySid}`;
      that.httpclient.get(aliaurl, that.httpOptions).subscribe(
        res => {
          that.isload = true;
          that.valuesList = res['data'];
          var newArr = [];
          for (var j = 0, jlen = sv.parametersInfos.length; j < jlen; j++) {
            for (var i = 0, len = that.valuesList.length; i < len; i++) {
              if (that.valuesList[i].propsSid == sv.parametersInfos[j].propSid) {
                newArr.push(that.valuesList[i])
              }
            }
          }
          that.valuesList = newArr;
          that.detList.push({
            id: sv.categorySid,
            name: sv.categoryName,
            propName: sv.breadUrl,
            values: that.valuesList,
            showValList: sv.parametersInfos
          })
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    })
  }
  // tab3 删除信息
  delDet(a, b) {
    var that = this;
    for (var i = 0; i < this.detList.length; i++) {
      if (this.detList[i].id == a) {
        for (var j = this.detList[i].values.length - 1; j >= 0; j--) {
          if (that.detList[i].values[j].propsSid == b) {
            this.detList[i].values.splice(j, 1);
            // console.log(this.detList);
          }
        }
      }
    }
  }
  //  保存分类
  subMtMes() {
    var that = this;
    for (var i = this.detList.length - 1; i >= 0; i--) {
      if (!that.detList[i].values.length) {
        that.detList.splice(i, 1)
      }
    }
    var subList = [];
    this.detList.map(function (v, i) {
      var valList = [];
      v.values.map(function (a, b) {
        valList.push({
          "propName": a.propsName,
          "propSid": a.propsSid,
          "valueName": $(`.value${v.id}_${a.propsSid}`).find("option:checked").text() || $(`.pro${v.id}_${a.propsSid}`).val(),
          "valueSid": $(`.value${v.id}_${a.propsSid}`).val()
        })
      })
      subList.push({
        "categoryName": v.name,
        "categorySid": v.id,
        "categoryType": 1,//修改为1
        "channelCode": 0,
        "parameters": valList
      })
    })

    var isSub = true;
    var that = this;
    if ($('.notNull1').val() == '') {
      this.showWarnWindow(true, "红色*为必填项", "warning");
      isSub = false;
      return;
    }
    var sunMturl = "/pcm-admin/product/procat_propvalues/update";
    // * categoryType 0 修改为1 channelCode为0
    var subMtParam = {
      productSid: this.sid,
      paramsList: subList
    }
    // console.log(subMtParam);
    this.isload = false;
    if (isSub) {
      this.httpclient.post(sunMturl, subMtParam, this.httpOptions).subscribe(
        res => {
          // console.log(res);
          this.isload = true;
          this.showWarnWindow(true, "保存成功!", "success");
          // this.responseData = res["data"]
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  etabPic() {
    // var pobj = {};
    // pobj['productCode'] = this.prodId;
    // var levelPras = {
    //   "searchs": JSON.stringify(pobj)
    // }
    // this.loadLevelProps(levelPras);
    // this.showMainPic(0, this.sid); //回显父节点图片
    this.loadAllProps(this.prodId);
  }
  loadAllProps(proCode) {
    var allUrl = `/pcm-admin/product/item-detail/${proCode}`;
    this.httpclient.post(allUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.salePropList = res['data']['salePropList'];
          this.skuList = res['data']['skuList'];
          // this.getChecked();
          // this.skuCode = res['data']['skuCode'];
          // this.skuLoadFlag = true;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        // if (this.skuLoadFlag) {
        //   this.getOptionArray(this.skuCode);
        // }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  getChecked() {
    var that = this;
    this.PicObjList = [];
    $('.propList').removeClass("tb-out-of-stock tb-selected");/* tab切换选中 未选中状态切换 */
    var pCode = "", vCode = "", vName = "";
    this.salePropList.forEach(function (spItem, spIndex) {
      if (spItem.values) {
        for (var lv = 0, len = spItem.values.length; lv < len; lv++) {
          if (spItem.values[lv].checked) {
            pCode = spItem.propCode;
            vCode = spItem.values[lv].valueCode;
            vName = spItem.values[lv].valueName;
            var aObj = {};
            aObj[pCode] = vCode;
            that.ObjList.push(aObj);
            var picObj = {};
            picObj[pCode] = vName;
            that.PicObjList.push(picObj);
            var newPicObj = {};
            that.PicObjList.map(function (pe, pf) {
              $.extend(true, newPicObj, pe)
            });
            that.getPicList(newPicObj);
            let isChecked = spItem.values[lv].checked;
            // console.info("=====" + isChecked);
            // console.info("+++" + `#${pCode}${vCode}`);
            if (isChecked) {
              $(`.${pCode}${vCode}`).addClass("tb-selected");
              $(`.${pCode}${vCode}`).siblings().addClass("tb-out-of-stock");
            }
          } else {
            pCode = spItem.propCode;
            vCode = spItem.values[lv].valueCode;
            $(`.${pCode}${vCode}`).addClass("tb-out-of-stock");
          }
        }
      }
    })
  }

  getProps(valueCode, propCode, valueName) {
    if (!$(`.${propCode}${valueCode}`).hasClass("tb-out-of-stock")) {
      var that = this;
      var itemObj = {};
      var picObj = {};
      if (!$(`.${propCode}${valueCode}`).hasClass("tb-selected")) {
        $(`.${propCode}${valueCode}`).addClass("tb-selected");
        $(`.${propCode}${valueCode}`).siblings().removeClass("tb-selected");
        this.getSelectArray();
        picObj[`${propCode}`] = valueName;
        this.PicObjList.push(picObj);
        var newPicObj = {};
        this.PicObjList.map(function (pe, pf) {
          $.extend(true, newPicObj, pe)
        });
        this.getPicList(newPicObj);
      } else {
        $(`.${propCode}${valueCode}`).removeClass("tb-selected");
        $(`.${propCode}${valueCode}`).siblings().removeClass("tb-out-of-stock");
        this.getSelectArray();
        picObj[`${propCode}`] = valueName;
        this.PicObjList.map((poi, pom) => {
          if (JSON.stringify(poi) == JSON.stringify(picObj)) {
            this.PicObjList.splice(pom, 1)
          }
        })
        var newPicObj = {};
        this.PicObjList.map(function (pe, pf) {
          $.extend(true, newPicObj, pe)
        });
        this.getPicList(newPicObj);
      }
    }
  }

  getSelectArray() {
    let paramObj = {};
    $(".tb-selected").each(function (index, item) {
      let paramAarry = $(item).attr("id").split("[]");
      paramObj[paramAarry[0]] = paramAarry[1];
    });
    var arr = this.skuList;
    var enables = [];
    $(".propList").addClass("tb-out-of-stock");
    if (Object.getOwnPropertyNames(paramObj).length == 1) {
      for (var aname in paramObj) {
        $(`.${aname}${paramObj[aname]}`).siblings().removeClass("tb-out-of-stock");
      }
    }
    for (var i = 0, len = arr.length; i < len; i++) {
      let isChecked = true;
      for (var key in paramObj) {
        if (typeof (arr[i][key]) != "undefined") {
          if (paramObj[key] == arr[i][key]) {

          } else {
            isChecked = false;
          }
        } else {
          isChecked = false;
        }
      }
      if (isChecked) {
        enables.push(arr[i]);
      }
    }
    enables.map((ei, ek) => {
      for (var ekey in ei) {
        if (ekey != "pictureUrl" && ekey != "skuCode") {
          $(`.${ekey}${ei[ekey]}`).removeClass("tb-out-of-stock")
        }
      }
    })
  }

  getPicList(pStr) {
    pStr['productCode'] = this.prodId;
    var prodCode = this.prodId;
    var spUrl = `/pcm-admin/product/pics/0/${prodCode}`;
    var propsStr = JSON.stringify(pStr);
    this.propsStr = propsStr;
    this.httpclient.post(spUrl, propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
        this.enableDrag = res['data']['enableDrag'];
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
      //console.log(this.showPicList, "showPicList");
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }


  // the picture tree in the fourth tab
  // loadFourthTree() {
  //   this.isload = false;
  //   var that = this;
  //   this.setting = {
  //     data: {
  //       key: {
  //         title: "t"
  //       },
  //       simpleData: {
  //         enable: true
  //       }
  //     },
  //     callback: {
  //       beforeClick: this.beforeClick,
  //       onClick: this.onClick3
  //     }
  //   };
  //   var pciupurl = `/pcm-admin/commodity/list/tree/${this.productSid}`;
  //   var picTree;
  //   this.httpclient.get(pciupurl, this.httpOptions).subscribe(res => {
  //     this.isload = true;
  //     picTree = res['data']
  //     $.fn.zTree.init($("#fourthTree"), this.setting, picTree);
  //   },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }

  beforeClick() {

  }

  // onClick3(event, treeId, treeNode, clickFlag) {
  //   var obj3 = JSON.stringify(treeNode);
  //   $('input[name="picmsg"]').val(obj3);
  //   $('.fourthclick').click();
  // }

  // // 图片上传树 点击获取图片数据
  // fourthclick() {
  //   let obj3 = JSON.parse($('input[name="picmsg"]').val());
  //   console.log(obj3)
  //   var spUrl = `/pcm-admin/product/pics/${obj3.noType}/${obj3.id}`;
  //   this.isload = false;
  //   if (obj3) {
  //     this.prodCode = obj3.id;
  //     this.picType = obj3.noType;
  //     this.httpclient.get(spUrl, this.httpOptions).subscribe(res => {
  //       this.isload = true;
  //       this.showPicList = res['data'];
  //       console.log(this.showPicList, 1);
  //     },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       }
  //     )
  //   }
  // }
  showAllPics() {
    var prodCode = this.prodId;
    var spUrl = `/pcm-admin/product/pics/0/${prodCode}`;
    // var spParams = {
    //   'productCode': this.prodCode,
    //   'prodSid': this.sid,
    //   'noType': 0,
    //   'propsStr': this.propsStr
    // };
    // console.log(this.propsStr, "propsStr")
    this.httpclient.post(spUrl, this.propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
        this.enableDrag = res['data']['enableDrag'];
        // console.log(this.showPicList, "showPicList");
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  addPic() {
    if (this.ObjList.length == 0) {
      this.showWarnWindow(true, "请选择商品属性", "warning");
      return;
    } else {
      // href="#addpic"
      $("#addpic").modal('show');
    }
    //  点击图片上传
    this.picUploader();
  }
  //  图片上传 右侧
  picUploader() {
    var $wrap = $('#uploader'),

      // 图片容器
      // $queue = $(`<ul class="filelist filelist${this.prodCode}"></ul>`)
      //   .appendTo($wrap.find('.queueList')),
      $queue = $('<ul class="filelist"></ul>')
        .appendTo($wrap.find('.queueList')),

      // 状态栏，包括进度和控制按钮
      $statusBar = $wrap.find('.statusBar'),

      // 文件总体选择信息。
      $info = $statusBar.find('.info'),

      // 上传按钮
      $upload = $wrap.find('.uploadBtn'),

      // 没选择文件之前的内容。
      $placeHolder = $wrap.find('.placeholder'),

      $progress = $statusBar.find('.progress').hide(),

      // 添加的文件数量
      fileCount = 0,

      // 添加的文件总大小
      fileSize = 0,

      // 优化retina, 在retina下这个值是2
      ratio = window.devicePixelRatio || 1,

      // 缩略图大小
      thumbnailWidth = 110 * ratio,
      thumbnailHeight = 110 * ratio,

      // 可能有pedding, ready, uploading, confirm, done.
      state = 'pedding',

      // 所有文件的进度信息，key为file id
      percentages = {},
      // 判断浏览器是否支持图片的base64
      isSupportBase64 = (function () {
        var data = new Image();
        var support = true;
        data.onload = data.onerror = function () {
          if ($(this).width != 1 || $(this).height != 1) {
            support = false;
          }
        }
        data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        return support;
      })(),

      // 检测是否已经安装flash，检测flash的版本
      // flashVersion = (function () {
      //   var version;

      //   try {
      //     version = navigator.plugins['Shockwave Flash'];
      //     version = version.description;
      //   } catch (ex) {
      //     try {
      //       version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
      //         .GetVariable('$version');
      //     } catch (ex2) {
      //       version = '0.0';
      //     }
      //   }
      //   version = version.match(/\d+/g);
      //   return parseFloat(version[0] + '.' + version[1], 10);
      // })(),

      supportTransition = (function () {
        var s = document.createElement('p').style,
          r = 'transition' in s ||
            'WebkitTransition' in s ||
            'MozTransition' in s ||
            'msTransition' in s ||
            'OTransition' in s;
        s = null;
        return r;
      })(),

      // WebUploader实例
      uploader,
      showPicList = this.showPicList,
      prodCode = this.prodId,
      // prodCode = this.prodCode,
      // picType = this.picType,
      picType = 0,
      propsStr = this.propsStr;
    // refPicList=this.fourthclick();
    // console.log(showPicList, "test");

    // if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

    //   // flash 安装了但是版本过低。
    //   if (flashVersion) {
    //     (function (container) {
    //       window['expressinstallcallback'] = function (state) {
    //         switch (state) {
    //           case 'Download.Cancelled':
    //             alert('您取消了更新！')
    //             break;

    //           case 'Download.Failed':
    //             alert('安装失败')
    //             break;

    //           default:
    //             alert('安装已成功，请刷新！');
    //             break;
    //         }
    //         delete window['expressinstallcallback'];
    //       };

    //       var swf = './expressInstall.swf';
    //       // insert flash object
    //       var html = '<object type="application/' +
    //         'x-shockwave-flash" data="' + swf + '" ';

    //       if (WebUploader.browser.ie) {
    //         html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
    //       }

    //       html += 'width="100%" height="100%" style="outline:0">' +
    //         '<param name="movie" value="' + swf + '" />' +
    //         '<param name="wmode" value="transparent" />' +
    //         '<param name="allowscriptaccess" value="always" />' +
    //         '</object>';

    //       container.html(html);

    //     })($wrap);

    //     // 压根就没有安转。
    //   } else {
    //     $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
    //   }

    //   return;
    // } else if (!WebUploader.Uploader.support()) {
    //   alert('Web Uploader 不支持您的浏览器！');
    //   return;
    // }

    // 实例化
    this.uploader = WebUploader.create({
      pick: {
        id: '#filePicker',
        label: '点击选择图片'
      },
      formData: {
        uid: 123
      },
      dnd: '#dndArea',
      paste: '#uploader',
      swf: './Uploader.swf',
      chunked: false,
      chunkSize: 512 * 1024,
      server: '/pcm-admin/product/pics/upload',
      // runtimeOrder: 'flash',

      /* accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png',
          mimeTypes: 'image/*'
      }, */

      // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
      disableGlobalDnd: true,
      fileNumLimit: 300,
      fileSizeLimit: 5 * 1024 * 1024,    // 5 M
      // fileSingleSizeLimit: 50 * 1024 * 1024    // 单个文件 限制50 M
    });
    // 拖拽时不接受 js, txt 文件。
    // uploader.on('dndAccept', function (items) {
    //   var denied = false,
    //     len = items.length,
    //     i = 0,
    //     // 修改js类型
    //     unAllowed = 'text/plain;application/javascript ';

    //   for (; i < len; i++) {
    //     // 如果在列表里面
    //     if (~unAllowed.indexOf(items[i].type)) {
    //       denied = true;
    //       break;
    //     }
    //   }

    //   return !denied;
    // });

    this.uploader.on('error', function (type) {
      if (type == "F_DUPLICATE") {
        window.alert("系统提示", "请不要重复选择文件！");
      } else if (type == "Q_EXCEED_SIZE_LIMIT") {
        window.alert("系统提示", "<span class='C6'>所选附件总大小</span>不可超过<span class='C6'>" + 5 + "M</span>哦！<br>换个小点的文件吧！");
      }
    });
    this.uploader.on('dialogOpen', function () {
      console.log('here');
    });

    this.uploader.on('filesQueued', function () {
      that.uploader.sort(function (a, b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
    });

    // 添加“添加文件”的按钮，
    this.uploader.addButton({
      id: '#filePicker2',
      label: '继续添加'
    });

    this.uploader.on('ready', function () {
      window.uploader = uploader;
    });

    this.uploader.on('uploadBeforeSend', function (block, data, headers) {
      console.log('uploadBeforeSend');
      // block为分块数据。
      // console.log(this.showPicList, 2);
      // file为分块对应的file对象。
      const file = block.file;
      const sorts = file.id;
      // console.log('file_id:', sorts);
      // console.log('file_id:', sorts.split('_'));
      const sort = Number(sorts.split('_')[2]) + 1;
      data.sort = showPicList.length + sort;
      console.log(data.sort);
      // data.productCode = $('#input_prodcut').val();
      // data.noType = $('#input_noType').val();picType
      data.noType = picType;
      data.productCode = prodCode;
      data.propsStr = propsStr;
      // data.isPrintMark = $('#input_isPrintMark').val();
      console.log('data:', data);
    });

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
      var $li = $('<li id="' + file.id + '">' +
        '<p class="title">' + file.name + '</p>' +
        '<p class="imgWrap"></p>' +
        '<p class="progress"><span></span></p>' +
        '</li>'),

        $btns = $('<div class="file-panel">' +
          '<span class="cancel">删除</span>' +
          '<span class="rotateRight">向右旋转</span>' +
          '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
        $prgress = $li.find('p.progress span'),
        $wrap = $li.find('p.imgWrap'),
        $info = $('<p class="error"></p>'),

        showError = function (code) {
          var text
          switch (code) {
            case 'exceed_size':
              text = '文件大小超出';
              break;

            case 'interrupt':
              text = '上传暂停';
              break;

            default:
              text = '上传失败，请重试';
              break;
          }

          $info.text(text).appendTo($li);
        };

      if (file.getStatus() === 'invalid') {
        showError(file.statusText);
      } else {
        // @todo lazyload
        $wrap.text('预览中');
        that.uploader.makeThumb(file, function (error, src) {
          var img;

          if (error) {
            $wrap.text('不能预览');
            return;
          }

          if (isSupportBase64) {
            img = $('<img src="' + src + '">');
            $wrap.empty().append(img);
          } else {
            $.ajax('./preview.php', {
              method: 'POST',
              data: src,
              dataType: 'json'
            }).done(function (response) {
              if (response.result) {
                img = $('<img src="' + response.result + '">');
                $wrap.empty().append(img);
              } else {
                $wrap.text("预览出错");
              }
            });
          }
        }, thumbnailWidth, thumbnailHeight);

        percentages[file.id] = [file.size, 0];
        file.rotation = 0;
        console.log("文件id:" + file.id);

      }

      file.on('statuschange', function (cur, prev) {
        if (prev === 'progress') {
          $prgress.hide().width(0);
        } else if (prev === 'queued') {
          $li.off('mouseenter mouseleave');
          $btns.remove();
        }

        // 成功
        if (cur === 'error' || cur === 'invalid') {
          console.log(file.statusText);
          showError(file.statusText);
          percentages[file.id][1] = 1;
        } else if (cur === 'interrupt') {
          showError('interrupt');
        } else if (cur === 'queued') {
          $info.remove();
          $prgress.css('display', 'block');
          percentages[file.id][1] = 0;
        } else if (cur === 'progress') {
          $info.remove();
          $prgress.css('display', 'block');
        } else if (cur === 'complete') {
          $prgress.hide().width(0);
          $li.append('<span class="success"></span>');
        }

        $li.removeClass('state-' + prev).addClass('state-' + cur);
      });

      $li.on('mouseenter', function () {
        $btns.stop().animate({ height: 30 });
      });

      $li.on('mouseleave', function () {
        $btns.stop().animate({ height: 0 });
      });

      $btns.on('click', 'span', function () {
        var index = $(this).index(),
          deg;

        switch (index) {
          case 0:
            console.log(file);
            that.uploader.removeFile(file);
            return;
          case 1:
            file.rotation += 90;
            break;

          case 2:
            file.rotation -= 90;
            break;
        }

        if (supportTransition) {
          deg = 'rotate(' + file.rotation + 'deg)';
          $wrap.css({
            '-webkit-transform': deg,
            '-mos-transform': deg,
            '-o-transform': deg,
            'transform': deg
          });
        } else {
          $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
          // use jquery animate to rotation
          // $({
          //     rotation: rotation
          // }).animate({
          //     rotation: file.rotation
          // }, {
          //     easing: 'linear',
          //     step: function( now ) {
          //         now = now * Math.PI / 180;

          //         var cos = Math.cos( now ),
          //             sin = Math.sin( now );

          //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
          //     }
          // });
        }


      });

      $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
      var $li = $('#' + file.id);

      delete percentages[file.id];
      updateTotalProgress();
      $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
      var loaded = 0,
        total = 0,
        spans = $progress.children(),
        percent;

      $.each(percentages, function (k, v) {
        total += v[0];
        loaded += v[0] * v[1];
      });

      percent = total ? loaded / total : 0;


      spans.eq(0).text(Math.round(percent * 100) + '%');
      spans.eq(1).css('width', Math.round(percent * 100) + '%');
      updateStatus();
    }
    var that = this
    function updateStatus() {
      var text = '', stats;

      if (state === 'ready') {
        text = '选中' + fileCount + '张图片，共' +
          WebUploader.formatSize(fileSize) + '。';
      } else if (state === 'confirm') {
        stats = that.uploader.getStats();
        if (stats.uploadFailNum) {
          text = '已成功上传' + stats.successNum + '张照片至XX相册，' +
            stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
        }

      } else {
        stats = that.uploader.getStats();
        text = '共' + fileCount + '张（' +
          WebUploader.formatSize(fileSize) +
          '），已上传' + stats.successNum + '张';

        if (stats.uploadFailNum) {
          text += '，失败' + stats.uploadFailNum + '张';
        }
      }

      $info.html(text);
    }

    function setState(val) {
      var file, stats;

      if (val === state) {
        return;
      }

      $upload.removeClass('state-' + state);
      $upload.addClass('state-' + val);
      state = val;

      switch (state) {
        case 'pedding':
          $placeHolder.removeClass('element-invisible');
          $queue.hide();
          $statusBar.addClass('element-invisible');
          that.uploader.refresh();
          break;

        case 'ready':
          $placeHolder.addClass('element-invisible');
          $('#filePicker2').removeClass('element-invisible');
          $queue.show();
          $statusBar.removeClass('element-invisible');
          that.uploader.refresh();
          break;

        case 'uploading':
          $('#filePicker2').addClass('element-invisible');
          $progress.show();
          $upload.text('暂停上传');
          break;

        case 'paused':
          $progress.show();
          $upload.text('继续上传');
          break;

        case 'confirm':
          $progress.hide();
          $('#filePicker2').removeClass('element-invisible');
          $upload.text('开始上传');
          stats = that.uploader.getStats();
          if (stats.successNum && !stats.uploadFailNum) {
            setState('finish');
            return;
          }
          break;
        case 'finish':
          stats = that.uploader.getStats();
          if (stats.successNum) {
            console.log('上传成功');
          } else {
            // 没有成功的图片，重设
            state = 'done';
            location.reload();
          }
          break;
      }

      updateStatus();
    }

    this.uploader.onUploadProgress = function (file, percentage) {
      var $li = $('#' + file.id),
        $percent = $li.find('.progress span');

      $percent.css('width', percentage * 100 + '%');
      percentages[file.id][1] = percentage;
      updateTotalProgress();
    };

    this.uploader.onFileQueued = function (file) {
      fileCount++;
      fileSize += file.size;

      if (fileCount === 1) {
        $placeHolder.addClass('element-invisible');
        $statusBar.show();
      }

      addFile(file);
      setState('ready');
      updateTotalProgress();
    };

    this.uploader.onFileDequeued = function (file) {
      fileCount--;
      fileSize -= file.size;

      if (!fileCount) {
        setState('pedding');
      }

      removeFile(file);
      updateTotalProgress();

    };

    //   this.uploader.on("uploadFinished", function () {
    //     this.uploader.destroy();
    // });

    this.uploader.on('all', function (type) {
      var stats;
      switch (type) {
        case 'uploadFinished':
          setState('confirm');
          break;

        case 'startUpload':
          setState('uploading');
          break;

        case 'stopUpload':
          setState('paused');
          break;

      }
    });
    // 重复选择图片的提示
    this.uploader.onError = function (code) {
      alert('Eroor: ' + code);
    };

    $upload.on('click', function () {
      if ($(this).hasClass('disabled')) {
        return false;
      }

      if (state === 'ready') {
        that.uploader.upload();
      } else if (state === 'paused') {
        that.uploader.upload();
      } else if (state === 'uploading') {
        that.uploader.stop();
      }
    });

    $info.on('click', '.retry', function () {
      that.uploader.retry();
      console.log("retry");

    });

    $info.on('click', '.ignore', function () {
      alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();
  }
  // 图片上传成功后 关闭弹窗
  closeUploader() {
    console.log(1)
    // this.fourthclick();
    this.showAllPics();
    for (var i = 0; i < this.uploader.getFiles().length; i++) {
      this.uploader.removeFile(this.uploader.getFiles()[i]);
      var $li = $('#' + this.uploader.getFiles()[i].id);
      $li.off().remove();
    }
    this.uploader.reset();

    // 法2
    // $('#progress' + file.id).slideUp(2000, function () {
    //   $('#progress' + file.id).remove();
    //   // 清空队列
    //   uploader.reset();
    // });
  }
  // 设为主图
  setMainPic() {
    var isSingle = true;
    var that = this;
    var size = $('input[type="checkbox"]:checked').length;
    // console.log("size", size);
    if (size > 1) {
      this.showWarnWindow(true, "只能设置一个图片为主图", "warning");
      isSingle = false;
      return;
    }
    if (size == 0) {
      this.showWarnWindow(true, "请选择图片", "warning");
      isSingle = false;
      return;
    }
    var picSid = $('input[type="checkbox"]:checked').attr('title')
    console.log("picSid", picSid);

    var mpicUrl = `/pcm-admin/product/pics/primary/0/${this.prodCode}/${picSid}`;
    // var mpicParams = {
    //   picSid: picSid
    // }
    if (isSingle) {
      this.httpclient.post(mpicUrl, this.propsStr, this.httpOptions).subscribe(
        res => {
          console.log(res);
          if (res['code'] == 200) {
            this.showWarnWindow(true, "主图设置成功", "success");
            this.showAllPics();
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
          // this.fourthclick();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  // 删除图片
  delPics() {
    var isSingle = true;
    var that = this;
    var size = $('input[type="checkbox"]:checked').length;
    console.log("size", size);
    if (size == 0) {
      this.showWarnWindow(true, "选择要删除的图片", "warning");
      // isSingle = false;
      return;
    }
    var picNames = '';
    $('input[name="uplpic"]:checked').each(function (cindex, citem) {
      console.log($(citem).val());
      picNames += $(citem).val() + ","
    })
    var dpicNames = picNames.slice(0, picNames.length - 1);
    // console.log("dpid", dpid);
    // if (dpid != '') {
    //   this.showWarnWindow(true, "是否确定删除", "warning");
    //   return;
    // }
    var depcUrl = `/pcm-admin/product/pics/del`;
    if (isSingle) {
      this.httpclient.post(depcUrl, `picNames=${dpicNames}&productCode=${this.prodCode}&noType=0&propsStr=${this.propsStr}`, this.httpOptionsDelPic).subscribe(
        res => {
          // console.log(res);
          if (res['code'] == 200) {
            this.showWarnWindow(true, "删除成功", "success");
            this.showAllPics();
          } else if (res['code'] == 10700017) {
            this.showWarnWindow(true, res['desc'], "warning");
          } else {
            this.showWarnWindow(true, "商品主图不允许删除", "warning");
          }
          // this.fourthclick();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  // 图片排序
  sortPics() {
    if (!this.enableDrag) {
      this.showWarnWindow(true, "商品图片暂不支持拖拽", "warning");
      return;
    }
    var sort = [];
    $('.item_pic').each(function (sitem, pitem) {
      $(pitem).find('input[name="uplpic"]').each(function (checkindex, checkitem) {
        sort.push({
          "sid": $(checkitem).attr('title'),
          "sort": sitem + 1
        })
      })
    })
    var movePicUrl = `/pcm-admin/product/pics/modify_sort`;
    this.sort = sort;
    var movePicParams = sort;
    this.httpclient.post(movePicUrl, movePicParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          console.log(res, "modify_sort");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  etabPackage() {
    // $('#cke_37').css({ display: 'none' });
    // this.loadFifthTree();
    let listUrl = `/pcm-admin/product/pics/json/0/${this.sid}`;
    localStorage.setItem('imageBrowser_listUrl', listUrl);
    this.initProductDesc(this.productSid);
  }
  // loadFifthTree() {
  //   this.isload = false;
  //   var that = this;
  //   this.setting = {
  //     data: {
  //       key: {
  //         title: "t"
  //       },
  //       simpleData: {
  //         enable: true
  //       }
  //     },
  //     callback: {
  //       beforeClick: this.beforeClick,
  //       onClick: this.onClick4
  //     }
  //   };
  //   var descurl = `/pcm-admin/commodity/list/tree/${this.productSid}`;
  //   var descTree;
  //   this.httpclient.get(descurl, this.httpOptions).subscribe(res => {
  //     this.isload = true;
  //     descTree = res['data']
  //     $.fn.zTree.init($("#fifthTree"), this.setting, descTree);
  //   },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  // onClick4(event, treeId, treeNode, clickFlag) {
  //   var obj4 = JSON.stringify(treeNode);
  //   $('input[name="descmsg"]').val(obj4);
  //   $('.fifclick').click();
  // }
  // fifclick() {
  //   let obj4 = JSON.parse($('input[name="descmsg"]').val());
  //   console.log(obj4)
  //   if (obj4) {
  //     this.prType = obj4.noType;
  //     this.prSid = obj4.id;
  //     this.skuNo = obj4.id;
  //   }
  //   let listUrl = `/pcm-admin/product/pics/json/${this.prType}/${this.prSid}`;
  //   localStorage.setItem('imageBrowser_listUrl', listUrl);
  //   this.initProductDesc(this.skuNo);
  // }
  /**
      * 读取商品描述信息
      */
  initProductDesc(skuNo) {
    this.isload = false;
    // let skuNo = "10001";
    const url = '/pcm-admin/product/descriptions/' + skuNo;
    const that = this;
    this.httpclient.get(url, this.httpOptions).subscribe(res => {
      console.log(res);
      this.isload = true;
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      const data = res['data'];
      if (res["code"] == 200) {
        // if (!res['data'].hasOwnProperty('content')) {
        //   return;
        // }
        if (data) {
          this.mycontent = data["content"];
          this.shortDesc = data['shortDesc'];
          this.longDesc = data['longDesc'];
        }
      } else {
        console.log(res);
        this.showWarnWindow(true, "读取商品信息失败:" + res["desc"], "warning");
      }
    });
  }

  ngAfterViewInit() {
    this.ckeditor.instance.on('key', (event) => {

    });
  }

  /**
   * 当内容发生改变时
   * @param $event
   */
  onChange($event: any): void {
  }


  /**
   * 点击保存信息
   */
  saveDescInfo() {
    // let skuNo = "10001";
    var url = '/pcm-admin/product/descriptions/';
    this.isload = false;
    if (!$('.longDesc').val()) {
      this.showWarnWindow(true, "描述名称不能为空", "warning");
      return;
    }
    if (!$('.shortDesc').val()) {
      this.showWarnWindow(true, "短名称不能为空", "warning");
      return;
    }
    const params = {
      content: this.mycontent,
      productCode: this.productSid,
      longDesc: $('.longDesc').val(),
      productName: this.productName,
      shortDesc: $('.shortDesc').val(),
    };
    const that = this;
    this.httpclient.post(url, params, this.httpOptions).subscribe(res => {
      console.log(res);
      this.isload = true;
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      const data = res['data'];
      if (res["code"] == 200) {
        this.showWarnWindow(true, "商品信息保存成功", "success");
      } else {
        this.showWarnWindow(true, "操作失败:" + res["desc"], "warning");
      }
    });
  };
  // 获取CMS数据
  etabCmsPackage() {
    this.isload = false;
    this.getSiteList();//加载精包装站点
    this.siteId = 1;
    this.getChannelId();
    this.isload = true;
    // this.getChildList();
  }
  // 站点列表
  getSiteList() {
    this.isload = false;
    var siteurl = "/api/cms/site/list";
    this.httpclient.get(siteurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['header']['code'] == 200) {
          this.siteList = res["body"];
        }
      });
  }
  // 获取频道id
  getChannelId() {
    var that = this;
    this.isload = false;
    this.siteId = $("#siteId").val() ? $("#siteId").val() : 1;
    var chanurl = `/api/cms/channel/root-channel?siteId=${this.siteId}`;
    this.httpclient.get(chanurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['header']['code'] == 200) {
          that.channelId = res["body"]['id'];
          that.getChildList();
        }
      });
  }
  // 获取右侧列表信息
  getChildList() {
    var that = this;
    this.isload = false;
    this.siteId = $("#siteId").val() ? $("#siteId").val() : 1;
    // let childUrl = `/api/cms/page/page-list-code?siteId=${this.siteId}&productCode=${this.prodId}`;
    let childUrl = `/api/cms/page/page-list-code?siteId=0&productCode=${this.prodId}`;
    this.httpclient.get(childUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['header'].code == 200) {
          that.haveChild = false;
          that.childList = res['body'];
        } else {
          this.haveChild = true;
        }
      },
      err => { console.log(err) }
    )
  }
  //删除页面
  delMsg(id) {
    this.delId = id;
  }
  sure() {
    this.isload = true;
    var that = this;
    var url = `/api/cms/page/del-page?pageId=${this.delId}&channelId=0`;
    this.httpclient.delete(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          this.showWarnWindow(true, "删除成功!", "success");
          this.getChildList();
        }
      }, function (err) {
        console.log(err)
      }
    )

  }
  // 返回
  goBack() {
    this.route.navigate(['/pcm/product'])
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
