import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';

import { Router, UrlHandlingStrategy } from '@angular/router'

declare var $: any;
declare const window: any;
declare const WebUploader: any;
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  @ViewChild('skuprice') skuprice: any
  @ViewChild('isskuprice') isskuprice: any
  public isload = false;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public titleMesg: string;//切换提示信息
  public pageNum = 1;//页码
  public pageList = [];//页码列表
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public setting: any //ztree
  public prodId = "";//编辑产品的id
  public brandList = [];//品牌选择
  public cateName = "";//产品分类名称显示
  public cateId = ""//产品分类的id
  // pcTree = [];//产品分类树
  // public isTree = true;//是否显示树
  // public iscate = false;//是否显示树
  public categoryList = [];//产品分类列表
  public paaList = [];//产品属性列表
  public productsList = [];//产品属性列表
  prefixList = [];//版库编码列表返回的值
  detailParamList = [];//商品属性表头信息表
  skuDetailList = [];//商品属性信息表
  skulength = 0;//数组长度
  proTypeList = [];//商品属性信息表
  productCode = "";//版库编码
  // brandName: string;//品牌名称
  brandSid: string; //品牌sid
  // categoryName: string;//产品分类名称
  // categorySid: string;//产品分类sid
  categoryCode: string; //产品分类code
  // proTypeName: string; //商品分类名称
  proTypeSid = "";//商品分类code
  proTypeFlag = 0;//商品分类标志,1美妆 0 非美妆
  proTypeRemark = 1;//商品分类标志,0美妆 1 非美妆
  proTypeSidCopy: any;//取消切换商品类型
  brandSidCopy: any;//取消切换品牌
  cateIdCopy: any;// 取消切换分类
  public responseData: any;//基本信息保存成功返回的数据
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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  httpOptionsDelPic = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };


  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    this.isload = true;
    if ($().select2) {
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#category').select2({
        placeholder: 'Select',
        allowClear: true
      }); 
    }
    var that=this;
    $("#category").change(function(e){
      // console.log($(e.target),1);      
      that.selectCategory()
      })
    this.loadBrandList();//加载品牌列表
    this.loadProTypeList();//加载产品分类列表
    this.loadCateList();//加载分类列表
    // this.loadTree();    // 产品分类树
  }
  // 品牌列表
  loadBrandList() {
    var brdurl = '/pcm-admin/brands';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(res => {
      if (res['code'] == 200) {
        this.brandList = res['data'];
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  // 商品类型列表
  loadProTypeList() {
    var brdurl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(res => {
      if (res['code'] == 200) {
        this.proTypeList = res['data'];
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  // 有效期验证
  comValidity(event) {
    const reg = new RegExp("^[1-9][0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 加载产品分类列表
  loadCateList() {
    this.isload = false;
    let nowPageurl = '/pcm-admin/categories/0';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.categoryList = res['data'].filter((a, b) => a.pid != 0);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 版库编码模糊查询
  completeSearch(event) {
    this.prefixList = [];
    var that = this;
    var prefix = event.target.value;
    if (prefix != '') {
      // this.prefixList = [];
      $("#patternCode").typeahead({
        source: function (query, process) {
          var preurl = `/pcm-inner/common/model/${query}`;
          return that.httpclient.get(preurl).subscribe(
            res => {
              if (res['code'] == 200) {
                var datalist = res['data']
                datalist.forEach(element => {
                  that.prefixList.push(element['matnr']);
                });
                return process(that.prefixList)
              }
            },
            (err: HttpErrorResponse) => {
              console.log(err.error);
            }
          )
        }
      });
    }
  }
  // 版库编码
  getSku() {
    const patternCode = $('#patternCode').val();
    if (patternCode) {
      this.getEffectInfo(patternCode, this.proTypeRemark);
    }
  }

  // 查看有效产品主信息
  getEffectInfo(productCode: any, proTypeRemark: any) {
    this.isload = false;
    var effUrl = "/pcm-admin/product/get_productinfo_effect";
    var brandId = $('.brdId').val();
    var categorySid = $('#category').select2('val');
    const params = new HttpParams()
      .set('remark', proTypeRemark)
      .set('brandId', brandId)
      .set('categorySid', categorySid)
      .set('productCode', productCode);
    this.httpclient.get(effUrl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          if (res['data'] && res['data']['productSid']) {
            if (this.proTypeRemark) {
              // 非美妆类型
              $('#select2_brand').val('').attr('disabled', 'disabled');
              $('.productName').val('').attr('disabled', 'disabled');
              $('#category').select2('val','').attr('disabled', 'disabled');
              $('#validity').val('').attr('disabled', 'disabled');
              $('.addsku_btn').attr('disabled', 'disabled');
              this.cateName = "";
              this.cateId = "";
              this.categoryCode='';
              this.paaList = [];
              this.skuDetailList = [];
              this.detailParamList = [];
              this.skulength = 0;
              this.showWarnWindow(true, '产品已存在,请重新选择！', 'warning');
            }
            else {
              // 美妆类型
              this.cateName = "";
              this.cateId = "";
              this.categoryCode='';
              this.paaList = [];
              this.skuDetailList = [];
              this.detailParamList = [];
              this.skulength = 0;
              $('.addsku_btn').attr('disabled', 'disabled');
              $('#select2_brand').removeAttr('disabled');
              $('#category').removeAttr('disabled');
              $('#validity').removeAttr('disabled');
              this.showWarnWindow(true, '产品已存在,请重新选择！', 'warning');
              // $('.productName').val("").removeAttr('disabled');
              // this.productCode = res['data']['productSid'];
              // this.paaList = res['data']['categoryPropsDtos'];
              // $('#patternCode').val(this.productCode);
              // this.getHeadersList(this.productCode);
            }
          } else {
            // 产品有效
            // $('#select2_brand').val('').removeAttr('disabled');
            // $('#category').val('').removeAttr('disabled');
            // $('.addsku_btn').val('').removeAttr('disabled');
            // $('.productName').val("").removeAttr('disabled');
            // this.cateName = "";
            // this.cateId = "";
            // this.paaList = [];
            // this.skuDetailList = [];
            // this.detailParamList = [];
            // this.skulength = 0;
            // this.paaList = res['data']['categoryPropsDtos'];
            // this.productCode = res['data']['productSid'];
            // this.getHeadersList(this.productCode);
            if (this.proTypeRemark) {
              $('#select2_brand').val('').removeAttr('disabled');
              $('#category').select2('val','').removeAttr('disabled');
              $('.addsku_btn').val('').removeAttr('disabled');
              $('.productName').val("").removeAttr('disabled');
              this.cateName = "";
              this.cateId = "";
              this.categoryCode='';
              this.paaList = [];
              this.skuDetailList = [];
              this.detailParamList = [];
              this.skulength = 0;
              // this.getHeadersList(productCode);
            } else {
              this.getCateProps(categorySid);
              this.getPropsHeader(categorySid);
            }
          }
        } else {
          // 产品不存在
          this.showWarnWindow(true, res['desc'], 'warning');
          // this.iscate = false;
          // 非美妆产品
          if (this.proTypeRemark) {
            this.cateName = "";
            this.cateId = "";
            this.paaList = [];
            this.skuDetailList = [];
            this.detailParamList = [];
            this.skulength = 0
            $('#validity').val('').attr('disabled', 'disabled');
            $('#select2_brand').select2('val','').attr('disabled', 'disabled');
            $('#category').select2('val','').attr('disabled', 'disabled');
            $('.productName').val('').attr('disabled', 'disabled');
            $('.addsku_btn').attr('disabled', 'disabled');
          } else {
            // 美妆产品
            $('#select2_brand').removeAttr('disabled');
            $('#category').removeAttr('disabled');
            $('.addsku_btn').attr('disabled', 'disabled');
            $('#patternCode').val('');
            $('.productName').val("").removeAttr('disabled');
            this.cateName = "";
            this.cateId = "";
            this.paaList = [];
            this.skuDetailList = [];
            this.detailParamList = [];
            this.skulength = 0
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  // 商品类型
  selectSkuType() {
    if (this.skulength) {
      this.titleMesg = "确定要切换商品类型？"
      $("#switchModal").modal('show');
    }
    this.proTypeSid = $('#proType').val();
    this.proTypeList.forEach((value, index) => {
      if (this.proTypeSid == value.code) {
        this.proTypeFlag = Number(value.flag);
        this.proTypeRemark = Number(value.remark);
      }
    })
    console.log('proTypeFlag', this.proTypeFlag, 'proTypeRemark', this.proTypeRemark);
    this.proTypeRemark == 0 ? $('#patternCode').val("").attr('disabled', 'disabled') : $('#patternCode').val('').removeAttr('disabled');
    this.proTypeFlag == 0 ? $('#validity').val("").attr('disabled', 'disabled') : $('#validity').val('').removeAttr('disabled');
    $('#select2_brand').removeAttr('disabled');//品牌
    $('#category').removeAttr('disabled');//产品分类
    $('.productName').removeAttr('disabled');//标准名
    // $('.addsku_btn').removeAttr('disabled');   
    if (!this.skulength && this.proTypeRemark == 0) {
      $('#select2_brand').val('');
      $('#category').select2('val','');
      this.cateName = "";
      this.cateId = "";
      this.paaList = [];
      this.skuDetailList = [];
      this.detailParamList = [];
      this.skulength = 0; 
    }
  }
  // 品牌切换
  selectBrand() {
    if (this.skulength && this.proTypeRemark == 0) {
      this.titleMesg = "确定要切换品牌？"
      $("#switchModal").modal('show')
    }
    this.brandSid = $('#select2_brand').val()
    this.cateId = $("#category").select2('val');//产品分类
    var patternCode = $('#patternCode').val();//版库编码
    // 美妆产品、产品分类已选
    if (this.proTypeRemark == 0 && this.cateId && !this.skulength) {
      this.getEffectInfo(patternCode, this.proTypeRemark);
    }
  }
  // 产品分类
  selectCategory() {
    // 如果已经添加商品，切换，提示是否切换
    if (this.skulength && this.proTypeRemark == 0) {
      this.titleMesg = "确定要切换产品分类？"
      $("#switchModal").modal('show')
    }
    this.cateId = $("#category").select2('val');//产品分类
    var brandId = $('.brdId').val();//品牌
    var patternCode = $('#patternCode').val();//版库编码
    // this.categoryCode= this.categoryList.filter((a, b) => a.id ==this.cateId)[0]['categoryCode'];    
    // 美妆类型 品牌名称必填
    if (!this.skulength && this.proTypeRemark == 0) {
      brandId ? this.getEffectInfo(patternCode, this.proTypeRemark) : this.showWarnWindow(true, '请选择品牌!', 'warning');
    }
    // else{
    //   // 非美妆、版库编码必填
    //   patternCode? this.getEffectInfo(patternCode, this.proTypeRemark):this.showWarnWindow(true,'请输入版库编码','warning');
    // }
    if(patternCode &&this.proTypeRemark == 1){
      this.getCateProps(this.cateId);
      this.getPropsHeader(this.cateId);
    }else if(!patternCode &&this.proTypeRemark == 1){
      this.showWarnWindow(true, '请输入产品编码!', 'warning');
      return
    }
  }
  // 获取产品属性
  getCateProps(cateId) {
    var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${cateId}&type=0`
    this.httpclient.get(aliurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.paaList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 获取列表头
  getPropsHeader(cateId) {
    this.detailParamList = [];
    var detailList = [];
    this.skuDetailList = [];
    var aliurl = `/pcm-admin/propsdict/getCategoryPropsList?categorySid=${cateId}&type=0`
    this.httpclient.get(aliurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          detailList = res['data'];
          detailList.unshift({
            'propsName': '商品编码',
            'propsCode': 'proDetailCode'
          })
          detailList.push({
            'propsName': '价格',
            'propsCode': 'proDetailPrice'
          })
          this.detailParamList = detailList;
          // this.skuDetailList = res['data'];
          // this.skulength = this.skuDetailList.length ? this.skuDetailList.length : 0;
          this.proTypeSidCopy = $('#proType').val();
          this.brandSidCopy = $('#select2_brand').val();
          this.cateIdCopy = $('#category').select2('val');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 是否确定切换
  sureSwitch() {
    var patternCode = $('#patternCode').val();//版库编码
    // 如果商品类型切换 全部清空
    if (this.titleMesg == "确定要切换商品类型？") {
      this.cateName = "";
      this.cateId = "";
      this.paaList = [];
      this.skuDetailList = [];
      this.detailParamList = [];
      this.skulength = 0;
      $('#select2_brand').val('');
      $('#category').select2('val','');
      $('.productName').val('');
      $('#validity').val('');
      $('#patternCode').val('');
    }
    if (this.titleMesg == "确定要切换品牌？") {
      this.getEffectInfo(patternCode, this.proTypeRemark);
      this.skulength = 0;
    }
    if (this.titleMesg == "确定要切换产品分类？") {
      this.getEffectInfo(patternCode, this.proTypeRemark);
      this.skulength = 0;
    }

  }
  cancelSwitch() {
    if (this.titleMesg == "确定要切换商品类型？") { $('#proType').val(this.proTypeSidCopy); }
    if (this.titleMesg == "确定要切换品牌？") { $('#select2_brand').val(this.brandSidCopy); }
    if (this.titleMesg == "确定要切换产品分类？") { $('#category').val(this.cateIdCopy).select2(); }



    $("#switchModal").modal('hide')
  }
  // 商品属性信息
  // getHeadersList(productCode: any) {
  //   this.isload = false;
  //   this.detailParamList = [];
  //   var detailList = [];
  //   this.skuDetailList = [];
  //   const skuUrl = '/pcm-admin/sku/getSkuForSearch';
  //   const skuParams = {
  //     "productCode":productCode
  //   }
  //   this.httpclient.post(skuUrl, skuParams, this.httpOptions).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         detailList = res['data']['headers'];
  //         detailList.unshift({
  //           'propsName': '商品编码',
  //           'propsCode': 'proDetailCode'
  //         })
  //         detailList.push({
  //           'propsName': '价格',
  //           'propsCode': 'proDetailPrice'
  //         })
  //         this.detailParamList = detailList;
  //         this.skuDetailList = res['data']['list'];
  //         this.skulength = this.skuDetailList.length ? this.skuDetailList.length : 0;
  //         this.proTypeSidCopy = $('#proType').val();
  //         this.brandSidCopy = $('#select2_brand').val();
  //         this.cateIdCopy = $('#category').val();
  //       } else {
  //         this.showWarnWindow(true, res['desc'], 'warning');
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
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
    var proTypeSid = $('#proType').val();
    var categorySid = this.cateId;
    if (!patternCode && this.proTypeRemark == 1) {
      this.showWarnWindow(true, "请输入版库编码！", "warning");
      return
    }
    // console.log(categorySid, 2312);

    if (categorySid) {
      proTypeSid == '2' ? this.skuprice.initVerify(patternCode) : this.isskuprice.initProInfo(categorySid);
    } else {
      this.showWarnWindow(true, "请选择产品分类！", "warning");
      return
    }
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
      this.skulength=this.skuDetailList.length;
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
      this.skulength=this.skuDetailList.length;
    }
  }
  // 保存基本信息
  subProduct() {
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
    var that = this;
    var yearToMarket = $('#validity').val();
    var brandName = $("#select2_brand").find("option:selected").text();
    var brandSid = $("#select2_brand").find("option:selected").val();
    var categorySid = this.cateId;
    var detailType = $('#proType').val();
    if ($('#patternCode').val() == '' && this.proTypeRemark == 1) {
      this.showWarnWindow(true, "版库编码不能为空", "warning");
      return;
    }
    if (!brandSid) {
      this.showWarnWindow(true, "品牌不能为空", "warning");
      return;
    }
    if ($('.productName').val() == '') {
      this.showWarnWindow(true, "标准名不能为空", "warning");
      return;
    }
    if (!categorySid) {
      this.showWarnWindow(true, "产品分类不能为空", "warning");
      return;
    }
    if (!yearToMarket && this.proTypeFlag) {
      this.showWarnWindow(true, "有效期不能为空", "warning");
      return;
    }
    if ($('.Not1').val() == '') {
      this.showWarnWindow(true, "产品属性中红色*为必填项", "warning");
      return;
    }
    if (!this.skulength) {
      this.showWarnWindow(true, "添加商品不能为空", "warning");
      return;
    }
    this.isload = false;
    var proParameList = [];
    this.paaList.forEach(function (v, i) {
      proParameList.push({
        "level": v.level,
        "propName": v.propsName,
        "propSid": v.propsSid,
        "valueName": $(`.value${v.propsSid}`).find("option:checked").text() || $(`.pro${v.propsSid}`).val(),
        "valueSid": $(`.value${v.propsSid}`).val()
      })
    })
    var proSave = {
      "productCode": $('#patternCode').val(),
      "brandName": brandName,
      "brandSid": brandSid,
      "detailType": detailType,
      "categorySid": categorySid,
      "productName": $('.productName').val(),
      "productParameters": proParameList,
      "detailParameters": alllist,
      "yearToMarket": yearToMarket
    }
    var proSaveUrl = '/pcm-admin/product/save_productinfo';
    if (issub) {
      this.httpclient.post(proSaveUrl, proSave, this.httpOptions).subscribe(
        res => {
          this.isload = true;
          if (res['code'] == 200) {
            this.responseData = res["data"];
            this.prodId = res["data"]['productSid'];
            // this.prodId = res["data"]['sid'];
            that.showWarnWindow(true, "保存成功，请填写展示分类信息", "success");
            $(".tab_1_3").click().addClass('active');
            this.tabMain();
            this.tabPic();
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

  // the third tab 
  tabMain() {
    if (!this.responseData) {
      this.showWarnWindow(true, "请填写商品信息", "warning");
      return;
    }
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
    var mtTree: Array<any>;
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          mtTree = res['data']
        }
        $.fn.zTree.init($("#thirdTree"), this.setting, mtTree);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  beforeCheck(treeId: any, treeNode: any) {
    console.log(treeId, treeNode);
  }
  onCheck(e, treeId: any, treeNode: any) {
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
      // console.log(titList);
      var valtitle = ""
      titList.forEach(function (v, i) {
        valtitle += ">" + v.name
      });
      this.valtitle = valtitle.substring(1);
      // if (treeObj.cancelCheckedNode(nodes[0])) {
      //   console.log("取消选中");
      // }
      // 0切换为1
      // var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${obj1.id}&type=1`
      var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${obj1.id}`;
      this.httpclient.get(aliurl, this.httpOptions).subscribe(
        res => {
          // console.log(res);
          this.valuesList = res['data'];
          // 在此处添加判断，点击获取的数据为空
          this.detList.push({
            id: obj1.id,
            name: obj1.name,
            propName: this.valtitle,
            values: this.valuesList
          })
          console.log(this.detList);
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
  // tab3 删除信息
  delDet(a, b) {
    // console.log(a, b);
    var that = this;
    // $(`.hide${a}_${b}`).css("display", "none")
    for (var i = 0; i < this.detList.length; i++) {
      if (this.detList[i].id == a) {
        // for (var j = 0, len = this.detList[i].values.length; j < len; j++) {
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
    // var subList = this.detList;
    // for (var i = subList.length - 1; i >= 0; i--) {
    //   if (!subList[i].values.length) {
    //     subList.splice(i, 1)
    //   }
    // }
    // console.log(subList);
    for (var i = this.detList.length - 1; i >= 0; i--) {
      if (!that.detList[i].values.length) {
        that.detList.splice(i, 1)
      }
    }
    // console.log(this.detList);
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
      // console.log(valList, 1);
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
      return;
    }
    var sunMturl = "/pcm-admin/product/procat_propvalues/update";
    // * categoryType 0 修改为1 channelCode为0
    var subMtParam = {
      productSid: this.responseData.sid,
      paramsList: subList
    }
    // console.log(subMtParam);

    if (isSub) {
      this.httpclient.post(sunMturl, subMtParam, this.httpOptions).subscribe(
        res => {
          // console.log(res);
          this.showWarnWindow(true, "保存成功", "success");
          $(".tab_1_4").click().addClass('active');
          // this.responseData = res["data"]
        },
        (err: HttpErrorResponse) => {
          // console.log(err.error);
        }
      );
    }
  }
  // tab four 
  tabPic() {
    this.loadAllProps(this.prodId);
  }

  // the picture tree in the fourth tab

  loadAllProps(proCode: any) {
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
    if (!this.responseData) {
      this.showWarnWindow(true, "请填写商品信息", "warning");
      return;
    }
    var that = this;
    this.PicObjList = [];
    $('.propList').removeClass("tb-out-of-stock tb-selected");/* tab切换选中 未选中状态切换 */
    var pCode = "", vCode = "", vName = "";
    this.salePropList.map(function (spItem, spIndex) {
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
    var propsStr = JSON.stringify(pStr)
    this.propsStr = propsStr;
    this.httpclient.post(spUrl, propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
        this.enableDrag = res['data']['enableDrag'];
      }
      //console.log(this.showPicList, "showPicList");
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  beforeClick() {

  }


  showAllPics() {
    var prodCode = this.prodId;
    var spUrl = `/pcm-admin/product/pics/0/${prodCode}`;
    console.log(this.propsStr, "propsStr")
    this.httpclient.post(spUrl, this.propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res['code'] == 200) {
        this.showPicList = res['data']['pics'];
        this.enableDrag = res['data']['enableDrag'];
      }
      console.log(this.showPicList, "showPicList");
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

      // accept: {
      //     title: 'Images',
      //     extensions: 'gif,jpg,jpeg,bmp,png',
      //     mimeTypes: 'image/*'
      // },

      // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
      disableGlobalDnd: true,
      fileNumLimit: 300,
      fileSizeLimit: 5 * 1024 * 1024,    // 5 M
      // fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
    });
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
    console.log(JSON.parse(this.propsStr));
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

  // 获取CMS数据
  tabCmsPackage() {
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
