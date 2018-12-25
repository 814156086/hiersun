import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
declare const window: any;
declare const WebUploader: any;
@Component({
  selector: 'app-editcommodity',
  templateUrl: './editcommodity.component.html',
  styleUrls: ['./editcommodity.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditcommodityComponent implements OnInit {
  public commCode: any;//编辑商品的code
  public commId: any;//编辑商品的id
  public proDtlCode: any;//编辑商品productdetailcode
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
  public commTypeList = []//tab2添加商品类型的显示
  public productSid: any;
  public priceMesg: PriceInfo;//tab2 编辑(详情)  价格信息的显示
  public barCodeMesg: BarCodeInfo;//tab2 编辑(详情)  条码信息的显示
  public showMainList = [];//tab3 回显的列表
  public setting: any //ztree
  public valuesList = [];//tab3 点击分类获取value的列表
  public detList = [];//tab3 点击分类右侧显示的内容的列表(含名字)
  public valtitle = "";//tab3 右侧分类显示的单项的名字（拼串）
  public uploader: any;//tab4 图片上传
  // public prodCode: any;//tab4 图片上传 开始上传提交
  // public picType: any;//tab4 图片上传 notype
  public showPicList = [];//tab4 图片上传，右侧显示
  public sort = [];//tab4 图片拖拽的顺序
  public enableDrag = true;
  public formData = new FormData();// tab4 图片保存
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  protected subscribeTabNo: TabNo;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  httpOptionsDelPic = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.commCode = queryParams.pid;
      this.proDtlCode = queryParams.pdc
    });
    console.log(this.commCode)
    // this.mycontent = ``;
    productService.TabNoEventer.subscribe(TabNo => {
      productService.defaultTabNo = TabNo;
    })
  }

  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    this.subscribeTabNo = this.productService.defaultTabNo;
    if (this.subscribeTabNo) {
      console.log(this.subscribeTabNo);
      var tabno = this.subscribeTabNo.num == 1 ? 2 : this.subscribeTabNo.num;
      this.commId = this.subscribeTabNo.pnum ? this.subscribeTabNo.pnum : '';
    } else {
      var tabno = 2;
    }
    $(`.tab_1_${tabno}`).click().addClass('active');
    switch (tabno) {
      case 2:
        this.etabCommPro();
        break;
      case 4:
        this.etabCommPic();
        break;
    }
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
      height: "450"
    };
  }
  etabCommPro() {
    this.isload = false;
    var promesURl = `/pcm-admin/commodity/get_product_commodity_info/${this.commCode}`
    this.httpclient.get(promesURl, this.httpOptions).subscribe(
      res => {
        // console.log(res);
        this.isload = true;
        // this.editData = res['data'];
        if (res["code"] == 200) {
          this.priceMesg = res['data']['commodityPriceDto'];
          this.barCodeMesg = res['data']['commodityBarcodeDto'];
          this.commId = res['data']['commodityBarcodeDto']['sid'];
          var codeType = res['data']['commodityBarcodeDto']['codeType']
          this.priConList = res['data']['priceControlProps'];
          this.commProList = res['data']['commodityProps'];
          this.productSid = res['data']['productSid']
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
  // tab2 保存 商品信息
  subeProMes() {
    this.isload = false;
    if ($('.Not1').val() == '') {
      this.showWarnWindow(true, "红色*为必填项", "warning");
      return;
    }
    // if ($('.typeId').val() == '') {
    //   this.showWarnWindow(true, "商品类型不能为空", "warning");
    //   return;
    // }
    // if ($('.comodName').val() == '') {
    //   this.showWarnWindow(true, "商品名称不能为空", "warning");
    //   return;
    // }
    // if ($('.tagPrice').val() == '') {
    //   this.showWarnWindow(true, "吊牌价不能为空", "warning");
    //   return;
    // }
    // if ($('.retailPrice').val() == '') {
    //   this.showWarnWindow(true, "零售价不能为空", "warning");
    //   return;
    // }
    // if ($('.storeName').val() == '') {
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
    var priParameList = []
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
        // "sid": 0
      },
      // "proActiveBit": 0,
      proDetailName: $('.comodName').val(),
      proType: $('.typeId').val(),
      productSid: this.productSid
      // "sid": this.responseData.sid
    }
    console.log(promessSave);
    var promesSaveUrl = `/pcm-admin/commodity/save_commdity_props_info`;
    this.httpclient.post(promesSaveUrl, promessSave, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "保存成功!", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 维护分类
  // etabCommMain() {
  //   this.detList = [];
  //   this.loadThirdTree();
  //   this.showMainMes(this.commId);
  // }
  // loadThirdTree() {
  //   this.setting = {
  //     check: {
  //       enable: true
  //     },
  //     data: {
  //       simpleData: {
  //         enable: true
  //       }
  //     },
  //     callback: {
  //       beforeCheck: this.beforeCheck,
  //       onCheck: this.onCheck
  //     }
  //   };
  //   // 更换为1
  //   let nowcPageurl = '/pcm-admin/categories/1';
  //   var cmtTree = [];
  //   var newmtTree = [];
  //   var that = this;
  //   this.httpclient.get(nowcPageurl, this.httpOptions).subscribe(res => {
  //     console.log(res);
  //     cmtTree = res['data']
  //     console.log(cmtTree);
  //     // mtTree.map(function (mtv, mti) {
  //     // })
  //     $.fn.zTree.init($("#thirdTree"), this.setting, cmtTree);
  //   },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  // beforeCheck(treeId, treeNode) {
  //   console.log(treeId, treeNode);
  // }
  // onCheck(e, treeId, treeNode) {
  //   console.log(e, treeId, treeNode);
  //   var obj1 = JSON.stringify(treeNode);
  //   $('input[name="mtmsg"]').val(obj1);
  //   $('.thirdclick').click();
  // }

  // thirdclick() {
  //   var that = this;
  //   let obj1 = JSON.parse($('input[name="mtmsg"]').val());
  //   if (obj1.checked) {
  //     var treeObj = $.fn.zTree.getZTreeObj("thirdTree");
  //     var nodes = treeObj.getCheckedNodes();//选中的树父子节点
  //     if (nodes.length > 0) {
  //       for (let i = 0; i < nodes.length; i++) {
  //         if (nodes[i].id == obj1.id) {
  //           var titList = nodes[i].getPath();
  //         }
  //       }
  //     }
  //     var valtitle = ""
  //     titList.forEach(function (v, i) {
  //       valtitle += ">" + v.name
  //     });
  //     this.valtitle = valtitle.substring(1);
  //     console.log(this.valtitle);
  //     var aliurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${obj1.id}&type=1`

  //     this.httpclient.get(aliurl, this.httpOptions).subscribe(
  //       res => {
  //         this.valuesList = res['data'];
  //         this.detList.push({
  //           id: obj1.id,
  //           name: obj1.name,
  //           propName: this.valtitle,
  //           values: this.valuesList,
  //           showValList: this.valuesList//Q1
  //         })
  //         console.log(this.detList);
  //       },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       });
  //   } else {
  //     for (let i = 0; i < this.detList.length; i++) {
  //       if (this.detList[i].id == obj1.id) {
  //         this.detList.splice(i, 1);
  //       }
  //     }
  //     // console.log(this.detList);
  //   }
  // }
  // // 右侧回显内容
  // showMainMes(cid) {
  //   var cateURl = `/pcm-admin/product/procat_propvalues/1/${cid}`;
  //   console.log(cateURl);
  //   var that = this;
  //   this.httpclient.get(cateURl, this.httpOptions).subscribe(
  //     res => {
  //       this.showMainList = res['data'];
  //       this.showItem(this.showMainList);
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     });
  // }
  // showItem(sml) {
  //   var that = this;
  //   sml.map(function (sv, si) {
  //     var aliaurl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${sv.categorySid}&type=${sv.categoryType}`;
  //     that.httpclient.get(aliaurl, that.httpOptions).subscribe(
  //       res => {
  //         that.valuesList = res['data'];
  //         that.detList.push({
  //           id: sv.categorySid,
  //           name: sv.categoryName,
  //           propName: sv.breadUrl,
  //           values: that.valuesList,
  //           showValList: sv.parametersInfos
  //         })
  //         console.log(1);
  //         console.log(sml);

  //         console.log(that.detList);
  //       },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       });
  //   })
  // }
  // // tab3 删除信息
  // delDet(a, b) {
  //   var that = this;
  //   for (var i = 0; i < this.detList.length; i++) {
  //     if (this.detList[i].id == a) {
  //       for (var j = this.detList[i].values.length - 1; j >= 0; j--) {
  //         if (that.detList[i].values[j].propsSid == b) {
  //           this.detList[i].values.splice(j, 1);
  //           // console.log(this.detList);
  //         }
  //       }
  //     }
  //   }
  // }
  // //  保存分类
  // subMtMes() {
  //   var that = this;
  //   for (var i = this.detList.length - 1; i >= 0; i--) {
  //     if (!that.detList[i].values.length) {
  //       that.detList.splice(i, 1)
  //     }
  //   }
  //   var subList = [];
  //   this.detList.map(function (v, i) {
  //     var valList = [];
  //     v.values.map(function (a, b) {
  //       valList.push({
  //         "propName": a.propsName,
  //         "propSid": a.propsSid,
  //         "valueName": $(`.value${v.id}_${a.propsSid}`).find("option:checked").text() || $(`.pro${v.id}_${a.propsSid}`).val(),
  //         "valueSid": $(`.value${v.id}_${a.propsSid}`).val()
  //       })
  //     })
  //     subList.push({
  //       "categoryName": v.name,
  //       "categorySid": v.id,
  //       "categoryType": 1,//修改为1
  //       "channelCode": 0,
  //       "parameters": valList
  //     })
  //   })

  //   var isSub = true;
  //   var that = this;
  //   if ($('.notNull1').val() == '') {
  //     this.alertMsgBox(that, "红色*为必填项", 1);
  //     isSub = false;
  //     return;
  //   }
  //   var sunMturl = "/pcm-admin/product/procat_propvalues/update";
  //   // * categoryType 0 修改为1 channelCode为0
  //   var subMtParam = {
  //     productSid: this.commId,
  //     paramsList: subList
  //   }
  //   // console.log(subMtParam);
  //   if (isSub) {
  //     this.httpclient.post(sunMturl, subMtParam, this.httpOptions).subscribe(
  //       res => {
  //         // console.log(res);
  //         this.alertMsgBox(that, "保存成功", 1);
  //         // this.responseData = res["data"]
  //       },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       }
  //     );
  //   }
  // }

  // 图片上传
  etabCommPic() {
    this.showMainPic(1, this.proDtlCode);
  }
  showMainPic(mtype, mid) {
    this.isload = false;
    var spUrl = `/pcm-admin/product/pics/${mtype}/${mid}`;
    var obj = {};
    obj['proDetailCode'] = this.proDtlCode
    var propsStr = JSON.stringify(obj);
    this.httpclient.post(spUrl, propsStr, this.httpOptions).subscribe(res => {
      this.isload = true;
      if (res["code"] == 200) {
        this.showPicList = res['data']['pics'];
        this.enableDrag = res['data']['enableDrag'];
      }
    },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  addPic() {
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
      prodCode = this.proDtlCode;
    // picType = this.picType;

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
      fileSizeLimit: 5 * 1024 * 1024,    // 200 M
      // fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
    });
    this.uploader.on('error', function (type) {
      if (type == "F_DUPLICATE") {
        window.alert("系统提示", "请不要重复选择文件！");
      } else if (type == "Q_EXCEED_SIZE_LIMIT") {
        window.alert("系统提示", "<span class='C6'>所选附件总大小</span>不可超过<span class='C6'>" + 5 + "M</span>哦！<br>换个小点的文件吧！");
      }
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
      data.noType = 1;
      data.productCode = prodCode;
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
    this.etabCommPic();
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
    console.log("size", size);

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

    var mpicUrl = `/pcm-admin/product/pics/primary/1/${this.proDtlCode}/${picSid}`;
    var mpicParams = {
      picSid: picSid
    }

    if (isSingle) {
      this.httpclient.post(mpicUrl, mpicParams, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.showWarnWindow(true, "主图设置成功", "success");
            this.etabCommPic();
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
          console.log(res);
          // this.responseData = res["data"]
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  // 删除图片
  delPics() {
    this.isload = false;
    var isSingle = true;
    var that = this;
    var size = $('input[type="checkbox"]:checked').length;
    console.log("size", size);

    if (size == 0) {
      this.showWarnWindow(true, "选择要删除的图片", "warning");
      isSingle = false;
      return;
    }
    var picNames = '';
    $('input[name="uplpic"]:checked').each(function (cindex, citem) {
      console.log($(citem).val());
      picNames += $(citem).val() + ","
    })
    var dpicNames = picNames.slice(0, picNames.length - 1);
    // console.log(dpid);
    // if (dpid == '') {
    //   this.showWarnWindow(true, "选择要删除的图片", "warning");
    //   isSingle = false;
    //   return;
    // }
    var depcUrl = `/pcm-admin/product/pics/del`;
    if (isSingle) {
      this.httpclient.post(depcUrl, `productCode=${this.proDtlCode}&picNames=${dpicNames}&noType=1`, this.httpOptionsDelPic).subscribe(
        res => {
          // console.log(dpid);
          this.isload = true;
          if (res['code'] == 200) {
            this.showWarnWindow(true, "删除成功", "success");
          } else if (res['code'] == 10700017) {
            this.showWarnWindow(true, res['desc'], "warning");
          } else {
            this.showWarnWindow(true, "商品主图不允许删除", "warning");
          }
          this.etabCommPic();
          // this.responseData = res["data"]
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  // 图片排序
  sortPics() {
    var sort = [];
    $('.item_pic').each(function (sitem, pitem) {
      $(pitem).find('input[name="uplpic"]').each(function (checkindex, checkitem) {
        sort.push({
          "sid": $(checkitem).attr('title'),
          "sort": sitem + 1
        })
      })
    })
    if (!this.enableDrag) {
      this.showWarnWindow(true, "商品图片暂不支持拖拽", "warning");
      return;
    }
    var movePicUrl = `/pcm-admin/product/pics/modify_sort`;
    this.sort = sort;
    var movePicParams = sort;
    this.httpclient.post(movePicUrl, movePicParams, this.httpOptions).subscribe(
      res => {
        console.log(res, "modify_sort");
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
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
  // 返回
  goBack() {
    this.route.navigate(['/pcm/commodity'])
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
