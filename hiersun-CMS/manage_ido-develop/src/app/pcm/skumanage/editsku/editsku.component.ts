import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { TabNo, ProductService } from '../../../services/product.service';
declare var $: any;
declare const window: any;
declare const WebUploader: any;
@Component({
  selector: "app-editsku",
  templateUrl: "./editsku.component.html",
  styleUrls: ["./editsku.component.css"]
})
export class EditskuComponent implements OnInit {
  public isShowWarnWin = false; //确认弹窗
  public warnMsg: string; //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public espageNum = 1; //页码
  public pagetotal = ""; //总页数
  public escurrentpage = ""; //当前页码
  public isload = false; //是否加载
  public prodId: any; //详情产品的id
  public isSell: any; //详情跳转编辑
  public disEdit: any; //是否展示修改
  public proTypeList = []; //商品类型
  public proTypeName: any; //商品类型名称
  public proTypeFlag: any; //商品类型有效期是否显示
  public yearToMarket: any; //有效期
  public productCode: any; //版库编码
  public brdName: any; //品牌
  public cateName: any; //产品分类
  public productName: any; //标准名
  public detailParamList = []; //商品信息列表 列表头
  public skuDtlList = []; //商品信息列表
  public commId: any; //编辑商品的id
  public commList = []; //tab2 商品列表
  public headerList = []; //tab2 商品列表  表头
  // public showModal = true;//tab2 详情modal是否显示
  public priConList = []; //tab2 编辑 (详情) 价格控制项的显示
  public commProList = []; //tab2 编辑(详情)  商品属性的显示
  public commTypeList = []; //tab2添加商品类型的显示
  public barCodeMesg: BarCodeInfo; //tab2 编辑(详情)  条码信息的显示
  public priceMesg: PriceInfo; //tab2 编辑(详情)  价格信息的显示
  public storeList = []; //tab2 编辑(详情)  门店的显示
  public uploader: any;//tab4 图片上传
  public showPicList = [];//tab4 图片上传，右侧显示
  public sort = [];//tab4 图片拖拽的顺序
  public enableDrag = true;
  public formData = new FormData();// tab4 图片保存
  protected subscribeTabNo: TabNo;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };
  httpOptionsDelPic = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.prodId = queryParams.pdc
    });
    console.log(this.prodId)
    // this.mycontent = ``;
    productService.TabNoEventer.subscribe(TabNo => {
      productService.defaultTabNo = TabNo;
    })
  }

  ngOnInit() {
    this.barCodeMesg = new BarCodeInfo('', '', '');
    this.priceMesg = new PriceInfo('', '');
    this.subscribeTabNo = this.productService.defaultTabNo;
    console.log(this.subscribeTabNo);

    if (this.subscribeTabNo) {
      console.log(this.subscribeTabNo);
      var tabno = this.subscribeTabNo.num == 1 ? 2 : this.subscribeTabNo.num;
      // this.commId = this.subscribeTabNo.pnum ? this.subscribeTabNo.pnum : '';
    } else {
      var tabno = 2;
    }
    console.log(tabno, this.prodId);

    $(`.ektab_1_${tabno}`).click().addClass('active');
    switch (tabno) {
      case 1:
        this.loadProTypeList();
        break;
      case 2:
        this.esdtabPro();
        break;
      case 3:
        this.esdtabCommPic();
        break;
    }
  }
  // 商品类型列表
  loadProTypeList() {
    var brdurl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(res => {
      if (res['code'] == 200) {
        this.proTypeList = res['data'];
        this.esdtabBase();
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  // 商品信息
  esdtabBase() {
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
  esdtabPro() {
    var that = this;
    this.isload = false;
    let proDtlUrl = '/pcm-admin/commodity/getProDetailListForSearch';
    var proPram = {
      "currentPage": this.espageNum,
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
          this.escurrentpage = res["data"]["currentPage"];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $("#pagination2").pagination({
          currentPage: this.escurrentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.espageNum = current;
            that.esdtabPro();
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
  // 图片上传
  esdtabCommPic() {
    this.showMainPic(1, this.prodId);
  }
  showMainPic(mtype, mid) {
    this.isload = false;
    var spUrl = `/pcm-admin/product/pics/${mtype}/${mid}`;
    var obj = {};
    obj['proDetailCode'] = this.prodId
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
      prodCode = this.prodId;
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
    this.esdtabCommPic();
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

    var mpicUrl = `/pcm-admin/product/pics/primary/1/${this.prodId}/${picSid}`;
    var mpicParams = {
      picSid: picSid
    }

    if (isSingle) {
      this.httpclient.post(mpicUrl, mpicParams, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.showWarnWindow(true, "主图设置成功", "success");
            this.esdtabCommPic();
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
      this.httpclient.post(depcUrl, `productCode=${this.prodId}&picNames=${dpicNames}&noType=1`, this.httpOptionsDelPic).subscribe(
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
          this.esdtabCommPic();
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
}
export class BarCodeInfo {
  constructor(
    public detailName: String,
    public barcode: String,
    public storeName: String
  ) { }
}
export class PriceInfo {
  constructor(
    public currentPrice: String,
    public originalPrice: String
  ) { }
}
