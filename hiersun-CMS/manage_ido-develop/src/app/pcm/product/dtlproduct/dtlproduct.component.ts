import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
@Component({
  selector: 'app-dtlproduct',
  templateUrl: './dtlproduct.component.html',
  styleUrls: ['./dtlproduct.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DtlproductComponent implements OnInit, OnDestroy {
  public prodId: any;//详情产品的id
  public isSell: any;//详情跳转编辑
  public disEdit: any;//是否展示修改(库存跳转到此页面)
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public pageNum = 1;//页码
  public pageList = [];//页码列表
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public isload = false;//是否加载
  public setting: any //ztree
  public brdName: any;//tab1 品牌名称
  public brdSid: any;//tab1 品牌id
  public productName: any;//tab1 产品名称
  public productSid: any;//tab1 产品id
  public sid: any;//tab1 产品sid
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
  // public showModal = true;//tab2 详情modal是否显示
  public priConList = []//tab2 编辑 (详情) 价格控制项的显示
  public commProList = []//tab2 编辑(详情)  商品属性的显示
  public commTypeList = []//tab2添加商品类型的显示
  public priceMesg: PriceInfo;//tab2 编辑(详情)  价格信息的显示
  public barCodeMesg: BarCodeInfo;//tab2 编辑(详情)  条码信息的显示
  public storeList = []//tab2 编辑(详情)  门店的显示
  public treeObj: any;//tab3 左侧树显示
  public detList = []//tab3 右侧详情显示
  public showMainList = [];//tab3 回显的列表
  public valuesList = [];//tab3 点击分类获取value的列表
  public showPicList = [];//tab4 图片上传，右侧显示
  public LevelPropsList = [];//tab4 图片上传 左侧 初始化显示
  public salePropList = [];//tab4 图片上传 左侧 初始化显示
  public skuList = [];//tab4 图片上传 左侧 相关处理数组
  public skuCode: any;//tab4 图片上传 左侧 初始化skucode
  public LevelList = [];//tab4 图片上传 左侧 点击返回的数组
  public PicObjList = [];//tab4 图片上传 左侧 post提交
  public ObjList = [];//tab4 图片上传 左侧 post提交
  public wflag = false;//tab4 字符串数组 操作
  public propsStr = "";
  public siteList = [];//精包装站点列表
  public childList = [];// 右侧子页面信息列表
  channelId: any;
  siteId: any;
  haveChild = false;//精包装 子集
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  public shortDesc = "";//短名称
  public longDesc = "";//描述名称
  TabNo: TabNo;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.prodId = queryParams.pid;
      this.isSell = queryParams.isSell;
      this.disEdit = queryParams.disEdit;
    });
  }

  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    this.dtabBase();
    this.dtabPic();
    this.getSiteList();//加载精包装站点
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
  dtabBase() {
    this.isload = false;
    // this.loadProTypeList();
    var tab1url = `/pcm-admin/product/get_productinfo/${this.prodId}`;
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
          this.productSid = res["data"]["productSid"];
          this.yearToMarket = res["data"]["yearToMarket"];
          this.sid = res["data"]["sid"];
          this.cateId = res["data"]["categorySid"];
          this.catePropList = res["data"]["categoryPropsDtos"];
          // this.proTypeName = this.proTypeList.filter((b, c) => b.code == this.proTypeSid)[0]['name'];
          // this.proTypeFlag = this.proTypeList.filter((b, c) => b.code == this.proTypeSid)[0]['flag'];
          this.loadProTypeList(this.proTypeSid)

          this.categotyInfo(this.cateId);
        } else {
          this.showWarnWindow(true, res['desc'], 'warnning')
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.getHeadersList(this.prodId);
  }
  // tab 产品属性列表
  categotyInfo(a) {
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
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  dtabPro() {
    var that = this;
    // console.log(this.productSid, 1)
    // let proDtlUrl = '/pcm-admin/commodity/get_all_commodityinfos';
    // var proPram = {
    //   "currentPage": this.pageNum,
    //   "pageSize": 10,
    //   "spuNo": this.productSid
    // }
    this.isload = false;
    let proDtlUrl = '/pcm-admin/commodity/getProDetailListForSearch';
    var proPram = {
      "currentPage": this.pageNum,
      "pageSize": 5,
      "productCode": this.prodId
      // list: [{ "productCode": this.prodId }]
    }
    this.httpclient.post(proDtlUrl, proPram, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res["data"]) {
          this.commList = res["data"]["list"];
          this.headerList = res["data"]["headers"];
          this.pagetotal = res["data"]["pageTotal"];
          this.currentpage = res["data"]["currentPage"];
        }
        $("#pagina").pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.dtabPro();
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
        console.log(res);
        this.commTypeList = res['data'];
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
        this.storeList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // tab3 维护分类
  dtabMain() {
    this.loadThirdTree();
    // this.showCateMesg(this.prodId);
  }
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
    var dmtTree = [];
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var dmyobj = res['data'];
          dmyobj.forEach((value, index) => {
            value['pId'] = value['pid'];
          })
          let result = dmyobj.reduce(function (prev, item) {
            // console.log(prev,item);
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in result) {
            result[prop].forEach(function (item, i) {
              result[item.id] ? item.children = result[item.id] : ''
            });
          }
          dmtTree = result[0];
          $.fn.zTree.init($("#thirdTree"), this.setting, dmtTree);
          var treeObj = $.fn.zTree.getZTreeObj("thirdTree");
          this.treeObj = treeObj;
          treeObj.expandAll(true);
          this.showCateMesg(this.prodId);
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
    console.log(treeId, treeNode);
  }
  onCheck(e, treeId, treeNode) {
    console.log(e, treeId, treeNode);
    var obj1 = JSON.stringify(treeNode);
    $('input[name="mtmsg"]').val(obj1);
    $('.thirdclick').click();
  }
  thirdclick() {
    // console.log("维护分类！");
  }

  showCateMesg(cid) {
    this.isload = false;
    this.detList = [];
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
        }else{
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
    // console.log(sml, 'sml')
    sml.map(function (sv, si) {
      var aliaurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${sv.categorySid}`;
      that.httpclient.get(aliaurl, that.httpOptions).subscribe(
        res => {
         if(res['code']==200){
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
         }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    })
  }
  dtabPic() {
    // var pobj = {};
    // pobj['productCode'] = this.prodId;
    // var levelPras = {
    //   "searchs": JSON.stringify(pobj)
    // }
    // this.loadLevelProps(levelPras);
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
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  getChecked() {
    var that = this;
    var pCode = "", vCode = "", vName = "";
    this.salePropList.map(function (spItem, spIndex) {
      if (spItem.values) {
        for (var lv = 0, len = spItem.values.length; lv < len; lv++) {
          if (spItem.values[lv].checked) {
            // ckeckFlag = true;
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

  getPicList(pStr) {
    pStr['productCode'] = this.prodId;
    var prodCode = this.prodId;
    var spUrl = `/pcm-admin/product/pics/0/${prodCode}`;
    var propsStr = JSON.stringify(pStr)
    this.httpclient.post(spUrl, propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
        // this.enableDrag = res['data']['enableDrag'];
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  // loadLevelProps(a) {
  //   this.isload = false;
  //   var levelPras = a;
  //   var levelUrl = `/pcm-admin/commodity/queryLevelDetailProps`;
  //   this.httpclient.post(levelUrl, levelPras, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         this.LevelPropsList = res['data']['levelDetailPropsValues'];
  //         var picDetails = res['data']['pictureDetail'];
  //         this.detailProps(picDetails);
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  // detailProps(dtl) {
  //   var that = this;
  //   dtl.map(function (dtlv, dtli) {
  //     if (dtlv.valuesDesc) {
  //       that.changeProps(dtlv.valuesName, dtlv.propsCode, dtlv.valuesDesc, 0);
  //     }
  //   })
  // }
  // changeProps(p, a, b, x) {
  //   $(`.isShow${p}`).css({ 'border': '1px solid #e3393c' }).parent().siblings().children('a').css({ 'border': '1px solid #ccc' });
  //   var obj = {};
  //   obj['productCode'] = this.prodId;
  //   obj[`${a}`] = b;
  //   this.ObjList.push(obj);
  //   var newobj = {};
  //   this.ObjList.map(function (e, f) {
  //     $.extend(true, newobj, e)
  //   });
  //   // 全部取消后，判断
  //   if (Object.getOwnPropertyNames(newobj).length == 1) {
  //     this.wflag = false;
  //   } else {
  //     this.propsStr = JSON.stringify(newobj);
  //     this.showAllPics();
  //   }
  //   var levelPras2 = {
  //     "searchs": JSON.stringify(newobj)
  //   }
  //   var levelUrl = `/pcm-admin/commodity/queryLevelDetailProps`;
  //   this.httpclient.post(levelUrl, levelPras2, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         this.LevelList = res['data']['levelDetailPropsValues'];
  //         this.selectShow(this.LevelList, p, x);
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  // selectShow(list, p, x) {
  //   $('.lpitem').css({ 'opacity': '1' });
  //   list.map(function (v, i) {
  //     for (var lv = 0, len = v.levelValuesDtos.length; lv < len; lv++) {
  //       $(`.isShow${v.levelValuesDtos[lv].valuesName}`).parent().siblings().css({ 'opacity': '0.5' });
  //       if (x == 0) {
  //         $(`.isShow${v.levelValuesDtos[lv].valuesName}`).css({ 'border': '1px solid #e3393c' }).parent().siblings().children('a').css({ 'border': '1px solid #ccc' });
  //       }
  //     }
  //   })
  // }
  // showAllPics() {
  //   var prodCode = this.prodId;
  //   var spUrl = `/pcm-admin/product/pics/0/${prodCode}`;
  //   this.httpclient.post(spUrl, this.propsStr, this.httpOptions).subscribe(res => {
  //     this.isload = true;
  //     if (res['code'] == 200) {
  //       this.showPicList = res['data']['pics'];
  //     }
  //   },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  beforeClick() {

  }

  dtabPackage() {
    this.initProductDesc(this.productSid);
  }
  // loadFifthTree() {
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
  //   this.isload = false;
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
  //   if (obj4) {
  //     this.prType = obj4.noType;
  //     this.prSid = obj4.id;
  //     this.skuNo = obj4.id
  //   }
  //   let listUrl = `/pcm-admin/product/pics/json/${this.prType}/${this.prSid}`
  //   localStorage.setItem('imageBrowser_listUrl', listUrl);
  //   this.initProductDesc(this.skuNo);
  // }
  /**
      * 读取商品描述信息
      */
  initProductDesc(skuNo) {
    // let skuNo = "10001";
    this.isload = false;
    const url = '/pcm-admin/product/descriptions/' + skuNo;
    const that = this;
    this.httpclient.get(url, this.httpOptions).subscribe(res => {
      console.log(res);
      if (res == null) {
        return;
      }
      if (!res.hasOwnProperty('data')) {
        return;
      }
      this.isload = true;
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
        this.showWarnWindow(true, "读取商品信息失败:" + res["code"], "warning");
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
  // 获取CMS数据
  etabCmsPackage() {
    this.getChannelId();
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
    this.siteId = $("#siteId").val() ? $("#siteId").val() : 1;
    var chanurl = `/api/cms/channel/root-channel?siteId=${this.siteId}`;
    this.httpclient.get(chanurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['header']['code'] == 200) {
          that.channelId = res["body"]['id'];
        }
      });
    this.getChildList();
  }
  // 获取右侧列表信息
  getChildList() {
    var that = this;
    this.siteId = $("#siteId").find("option:selected").val() ? $("#siteId").val() : 1;
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
  // 返回
  goBack() {
    // this.route.navigate(['/pcm/product'])
    window.history.go(-1);
  }
  // tab跳转
  toProduct(a) {
    if (this.isSell == 1) {
      this.showWarnWindow(true, "上架产品不能修改", "warning");
      return;
    }
    var pid = this.prodId;
    this.route.navigate(["pcm/product/editproduct"], {
      queryParams: {
        pid
      }
    });
    if (a == 2) {
      $('#modal_dtl').hide();
      $(".modal-backdrop").hide();
    }
    this.TabNo = { num: a, pnum: this.productSid, sid: this.sid };
  }

  ngOnDestroy() {
    this.productService.TabNoEventer.emit(this.TabNo);
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