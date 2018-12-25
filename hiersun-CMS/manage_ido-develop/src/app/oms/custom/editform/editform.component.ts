import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'

declare var $: any;
@Component({
  selector: 'app-editform',
  templateUrl: './editform.component.html',
  styleUrls: ['./editform.component.css']
})
export class EditformComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  public egiaMesg: GiaInfoe;//弹窗gia
  certTypeList = [];//证书类别list
  modelList: Array<any>;//核价查询
  proModelZmtrDic: Array<any>;//c材质
  proModelAttrList: Array<any>;// 子版库
  proModelZlsDmdDic: Array<any>;// 主石重量
  dicscore: any;//分数
  imgUrl = "";//图片地址
  isColor = false;//金属颜色
  isWeightType = false;//主石重量、证书是否显示
  certType = false;//证书类别是否显示
  isNgtc = false;//净度、钻石颜色是否显示
  isGia = false;//GIA
  isCleaness = false;//钻石净度VA是否显示
  maxWgt = false;//H0系列下钻石颜色
  zstkCat: string;//版库分类tower系列 净度 颜色
  bsWeight = false;//单颗主石重量
  bsWgt: number;//单颗主石重量
  losdata: any;//裸石选择返回信息
  public tempScoreCode: any;
  engContent: any;//刻字内容
  detailInfo: any;//选择的值的值
  // priceList = [];//核价操作返回的值
  pricingPrice = ""//核价后的价格
  signTime = ""//核价后的时间
  ecusDetail: any;//定做明细
  ecusGiaDetail: any;//GIA主石规格明细


  isPrice = false;//已核算价格
  orderNo: any;//线上单据号
  modelNo: any;//版库编码
  sid: any;//工单sid
  cusOrder: any;//工单号
  zfigrNum: any;//指圈号
  zmaterial: any;//材质
  zlsSpec: any;//主石重量
  zcrtName: any;//证书名称

  saleSource: any;//渠道Code
  shopNo: any;//门店编号
  storeName: any;//门店名称
  earnestAmount: any;//应付金额含运费
  address: any;//收件地址
  regPhone: any;//联系方式
  customer: any;//收件人
  shoppeNo:any;//买家留言
  shoppeName:any;//商品属性
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    this.isload = true;
    this.isPrice = false;
    this.egiaMesg = new GiaInfoe('', '', '', '', '');
  }
  initInfo(sitem) {
    this.saleSource = sitem.saleSource//渠道
    this.orderNo = sitem.saleNo;//线上单据号
    this.storeName = sitem.storeName;//门店名称
    this.shopNo = sitem.shopNo;//门店编号
    this.earnestAmount = Number(sitem.paymentAmount) - Number(sitem.shippingFee);//应付金额（含运费）
    this.address = sitem.receptAddress;
    this.regPhone = sitem.receptPhone;
    this.customer = sitem.receptName;
    this.shoppeNo = sitem.shoppeNo;
    this.shoppeName = sitem.shoppeName;
    $('#modal_editf').modal('show');
    this.loadFormDetail(sitem.saleNo);
  }
  // 根据线上订单号查看详情
  loadFormDetail(orderNo) {
    this.isload = false;
    var selecturl = '/pcm-admin/price-order/list';
    var params = new HttpParams()
      .set("orderNo", orderNo)
    this.httpclient.get(selecturl, { params }).subscribe(
      res => {
        this.isload = true;
        var alength = res['data']['content'] ? res['data']['content'].length : 0;
        if (res['code'] == 200 && alength) {
          var contnet = res['data']['content']['0'];
          this.modelNo = contnet['modelNo'];//版库编码
          this.sid = contnet['sid'];//工单sid
          this.cusOrder = contnet['cusOrder'];//工单号
          this.zfigrNum = contnet['zfigrNum'];//指圈号
          this.zmaterial = contnet['zmaterial'];//金属材质
          this.zlsSpec = contnet['zlsSpec'];//主石重量
          this.dicscore = contnet['zlsWgt'];//主石分数
          this.imgUrl = contnet['pictureUrl'];//图片地址
          /* 金属颜色 */
          var zmtlCol = contnet['zmtlCol'];
          $(`input[name='color'][title=${zmtlCol}]`).attr("checked", true)
          /* 金属表面处理 */
          var zsfProc = contnet['zsfProc'];
          $(`input[name='surface'][title=${zsfProc}]`).attr("checked", true);
          /* 根据GIA主石规格有无进行处理 */
          var cusGiaDetail = contnet['cusGiaDetail'];
          var clarity = contnet['zlsNet'];
          var cut = contnet['zlsCut'];
          var polish = contnet['zcutPol'];
          var symmetry = contnet['zcutSym'];
          var florescence = contnet['zlsColor'];
          if (cusGiaDetail) {
            this.isNgtc = true;
            this.isGia = false;
            this.egiaMesg = new GiaInfoe(`${clarity}`, `${cut}`, `${polish}`, `${symmetry}`, `${florescence}`);
          } else {
            $(`input[name='clarity'][title=${clarity}]`).attr("checked", true);
            $(`input[name='dicolor'][title=${florescence}]`).attr("checked", true);
          }
          /* 根据刻字内容的有无判断 刻字按钮是否显示 */
          this.engContent = contnet['engContent'];
          if (this.engContent) {
            $("input[name='lettering'][title=1]").attr("checked", true);
          } else {
            $("input[name='lettering'][title=0]").attr("checked", true);
          }
          /* 是否加急 */
          var isUrgent = contnet['isUrgent'];
          $(`input[name='expedited'][title=${isUrgent}]`).attr("checked", true)
          this.zcrtName = contnet['zcrtName'];/* 证书类别 */
          this.loadModelInfo(this.modelNo);
          this.loadByCode(this.zlsSpec);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 根据主石重量回显内容,关联内容的显示
  loadByCode(scoreCode) {
    console.log(scoreCode);

    this.tempScoreCode = scoreCode;
    var certList = [{ "typeCode": "NGTC", "typeName": "NGTC" }, { "typeCode": "GIA", "typeName": "GIA" }]
    if (scoreCode == '01' || scoreCode == '02' || scoreCode == '03') {
      this.certTypeList = certList;
      this.isNgtc = true;
      this.isGia = true;
      this.certType = true;
      this.isCleaness = false;
      this.maxWgt = false;
      $("input[name='clarity']").attr('checked', false);
      $("input[name='dicolor']").attr('checked', false);
      this.egiaMesg = new GiaInfoe('', '', '', '', '');
    } else if (scoreCode === "04" || scoreCode === "05") {
      this.isNgtc = false;
      this.maxWgt = false;
      $("input[name='clarity']").attr('checked', false);
      $("input[name='dicolor']").attr('checked', false);
      $("#eVS").attr('checked', true);
      $("#eIJ").attr('checked', true);
      this.certTypeList = certList.filter((i, v) => i.typeCode == "NGTC");
      this.isGia = true;
      this.certType = false;
      this.isCleaness = true;
      this.egiaMesg = new GiaInfoe('', '', '', '', '');
    } else if (scoreCode >= '06' && scoreCode < '13') {
      this.certTypeList = certList;
      this.certType = false;
      this.isCleaness = false;
      this.maxWgt = false;
      if (this.zcrtName == 'GIA') {
        this.isNgtc = true;
        this.isGia = false;
        console.log(this.isNgtc, this.isGia);
      } else {
        this.isNgtc = false;
        this.isGia = true;
      }
      // Tower系列 默认NGTC
      $("input[name='clarity']").attr('checked', false);//钻石净度
      $("input[name='dicolor']").attr('checked', false);//钻石颜色
      $("input[name='diaColor']").attr('checked', false);//裸石选择颜色
      $("input[name='dclarity']").attr('checked', false);//裸石选择净度
      // this.egiaMesg = new GiaInfoe('', '', '', '', '');
      if (this.zstkCat == "H0") {
        $("#eIJ").attr('checked', true);
        this.maxWgt = true;
      }
    } else {
      this.certTypeList = certList.filter((i, v) => i.typeCode == "GIA");
      // $('#eselDia').modal('show');
      this.isNgtc = true;
      this.isGia = false;
      this.certType = false;
      this.isCleaness = false;
      this.maxWgt = false;
      $("input[name='clarity']").attr('checked', false);
      $("input[name='dicolor']").attr('checked', false);
      $("input[name='diaColor']").attr('checked', false);
      $("input[name='dclarity']").attr('checked', false);
      // this.egiaMesg = new GiaInfoe('', '', '', '', '');
    }
  }
  // 根据版库编码查询
  loadModelInfo(modelNo) {
    this.isload = false;
    var priUrl = `/pcm-core/pricing/modelList/${modelNo}`;
    this.httpclient.get(priUrl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200 && res['data']) {
          this.modelList = res['data'];
          this.proModelAttrList = res['data'][0]['proModelAttrList'];//子版库
          var shapeStatus = this.proModelAttrList.every((i, v) => i.zlsShape != 16)
          var zsubcategory = this.modelList[0]['zsubcategory'];
          this.zstkCat = this.modelList[0]['zstkCat'];//版库分类
          // 是否存在多个主石形状/异形钻
          if (!shapeStatus && zsubcategory != '18') {
            this.proModelZlsDmdDic = res['data'][0]['proModelZlsDmdDic'];//主石重量
            this.isNgtc = (this.proModelZlsDmdDic.length == 0) ? true : false;
            this.isWeightType = (this.proModelZlsDmdDic.length == 0) ? true : false;
            //版库分类58，不显示PT990
            var preModelDic = res['data'][0]['proModelZmtrDic'];
            var preModelDic2 = [];
            if (preModelDic.some((i, v) => i.dicCode == '14') && preModelDic[0]['dicCode'] != '14') {
              preModelDic.map((value) => {
                return (value.dicCode == '14') ? (preModelDic.unshift(value), preModelDic.pop(value)) : ''
              })
              preModelDic2 = preModelDic;
            } else {
              preModelDic2 = preModelDic
            }
            this.proModelZmtrDic = (this.zstkCat != "58") ? preModelDic2 : preModelDic2.filter((i, v) => i.dicCode != "05");
          } else {
            // 定制价格按钮不能点击
            this.showWarnWindow(true, "此版库不能定制", 'warning');
            return
          }
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 指圈号输入内容为数字
  normalInputChange(event) {
    const reg = new RegExp("^[0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  showPic(picode) {
    this.imgUrl = '';
    var baseUrl = "http://192.168.2.244/ido/dimage/"
    this.imgUrl = `${baseUrl}${this.modelNo}_${picode}.jpg`
  }
  // 金属材质
  selectMaterial() {
    // 05,06 只显示白色
    var color = $('#eshowColor').find("option:selected").val();
    this.isColor = (color == '05' || color == '06') ? true : false;
    $('.edWeight').val('');
    this.dicscore = '';
  }
  letter(a) {
    a == 1 ? $('.letterContent').attr('readonly', "readonly") : $('.letterContent').removeAttr('readonly');
  }
  // 主石分数的选择
  selectScore() {
    this.certTypeList = [{ "typeCode": "NGTC", "typeName": "NGTC" }, { "typeCode": "GIA", "typeName": "GIA" }];
    var material = $('#eshowColor').find("option:selected").val();
    var scoreCode = $(".edWeight").find("option:selected").val();
    var scoreName = this.proModelZlsDmdDic.filter((i, v) => i.dicCode == scoreCode)[0]['dicName']
    this.tempScoreCode = scoreCode;
    var scoreText = (scoreCode != '01') ? Number(scoreName.split('-')[1]) : 7.99;
    var that = this;
    // $('.certificate').val('');
    // 主石分数选择的变化：显示隐藏净度、颜色、GIA、证书类别
    let socreFn = function () {
      var certList = [{ "typeCode": "NGTC", "typeName": "NGTC" }, { "typeCode": "GIA", "typeName": "GIA" }]
      if (scoreCode == '01' || scoreCode == '02' || scoreCode == '03') {
        that.certTypeList = certList;
        that.isNgtc = true;
        that.isGia = true;
        that.certType = true;
        that.isCleaness = false;
        that.maxWgt = false;
        $("input[name='clarity']").attr('checked', false);
        $("input[name='dicolor']").attr('checked', false);
        that.zcrtName = 'NGTC';
        that.egiaMesg = new GiaInfoe('', '', '', '', '');
      } else if (scoreCode === "04" || scoreCode === "05") {
        that.isNgtc = false;
        that.maxWgt = false;
        $("input[name='clarity']").attr('checked', false);
        $("input[name='dicolor']").attr('checked', false);
        $("#eVS").attr('checked', true);
        $("#eIJ").attr('checked', true);
        that.certTypeList = certList.filter((i, v) => i.typeCode == "NGTC");
        that.isGia = true;
        that.certType = false;
        that.isCleaness = true;
        that.zcrtName = 'NGTC';
        that.egiaMesg = new GiaInfoe('', '', '', '', '');
      } else if (scoreCode >= '06' && scoreCode < '13') {
        that.certTypeList = certList;
        that.isNgtc = false;
        that.isGia = true;
        that.certType = false;
        that.isCleaness = false;
        that.maxWgt = false;
        that.zcrtName = 'NGTC';
        // Tower系列 默认NGTC
        $("input[name='clarity']").attr('checked', false);//钻石净度
        $("input[name='dicolor']").attr('checked', false);//钻石颜色
        $("input[name='diaColor']").attr('checked', false);//裸石选择颜色
        $("input[name='dclarity']").attr('checked', false);//裸石选择净度
        that.egiaMesg = new GiaInfoe('', '', '', '', '');
        if (that.zstkCat == "H0") {
          $("#VS").attr('checked', true);
          that.maxWgt = true;
          // $("#IJ").attr('checked', true);
        }
      } else {
        that.certTypeList = certList.filter((i, v) => i.typeCode == "GIA");
        $('#eselDia').modal('show');
        that.isNgtc = true;
        that.isGia = false;
        that.certType = false;
        that.isCleaness = false;
        that.maxWgt = false;
        $("input[name='clarity']").attr('checked', false);
        $("input[name='dicolor']").attr('checked', false);
        $("input[name='diaColor']").attr('checked', false);
        $("input[name='dclarity']").attr('checked', false);
        that.egiaMesg = new GiaInfoe('', '', '', '', '');
      }
    }
    var proModelList = [];
    if (material != '') {
      // (scoreCode != '') ? proModelList = (this.proModelAttrList.filter((i, v) => i.zmtr == `${material}`).filter((i, v) => i.zlsDmd == `${scoreCode}`)) : this.dicscore = '';
      if (scoreCode != '') {
        //  从子版库中取数量，计算分数
        proModelList = (this.proModelAttrList.filter((i, v) => i.zmtr == `${material}`).filter((i, v) => i.zlsDmd == `${scoreCode}`));
        var zlsNum = Number(proModelList[0]['zlsNum']);
        var zlsWgt = Number(proModelList[0]['zlsWgt']);
        var wghItem = zlsWgt / zlsNum;
        this.bsWgt = wghItem;
        this.bsWeight = (wghItem >= 30 && wghItem < 100) ? true : false;
        this.dicscore = (scoreCode != '02' && scoreCode != '03') ? wghItem : scoreText * zlsNum;
        // 显示隐藏净度、颜色、GIA、证书类别
        socreFn();
      } else {
        this.dicscore = '';
      }
    } else {
      this.showWarnWindow(true, "请选择金属材质", 'warning');
      return
    }

  }
  // 证书类别的选择
  selectDiamond() {
    var material = $('#eshowColor').find("option:selected").val();
    this.egiaMesg = new GiaInfoe('', '', '', '', '');
    if (!material) {
      this.showWarnWindow(true, "请选择主石重量/单颗", 'warning');
      return
    }
    var type = $(".certificate").find("option:selected").val();
    this.zcrtName = type;
    if (type == 'GIA') {
      this.isNgtc = true;
      this.isGia = false;
      $('#eselDia').modal('show');
      $("input[name='diaColor']").attr('checked', false);
      $("input[name='dclarity']").attr('checked', false);
      $("input[title='VG']").attr('checked', true);
    } else {
      this.isNgtc = false;
      this.isGia = true;
    }
  }
  // 定制价格
  esubPrice(orderStatus) {
    this.isPrice = false;
    var certype = $('.certificate').find("option:selected").val();
    var certificateType = "";
    if (!this.certType) {
      certificateType = certype ? certype : ""
    } else {
      certificateType = "NGTC"
    }
    var efingerRing = $('.efingerRing').val(),
      metal = $('#eshowColor').find("option:selected").val(),
      metalText = $('#eshowColor').find("option:selected").text(),
      metalColor = $('input[name="color"]:checked').attr('title'),
      metalSurface = $('input[name="surface"]:checked').attr('title'),
      diamondGradeSection = $('.edWeight').find("option:selected").val(),
      diamonedWeight = this.dicscore,
      diamondClarity = (certificateType == 'NGTC') ? $('input[name="clarity"]:checked').attr('title') : this.egiaMesg.clarity,
      diamondColor = (certificateType == 'NGTC') ? $('input[name="dicolor"]:checked').attr('title') : this.egiaMesg.florescence,
      diamondCut = this.egiaMesg.cut,
      diamondPolishing = this.egiaMesg.polish,
      diamondSymmetry = this.egiaMesg.symmetry,
      diamondProduceId = this.losdata ? this.losdata.stoneCode : '',
      diamondRapaport = this.losdata ? this.losdata.totalCost : '',
      urgent = $('input[name="expedited"]:checked').attr('title');
    var engContent = $('input[name="lettering"]:checked').attr('title') ? $('.letterContent').val() : ""
    var ecusDetail = `版库编号：${this.modelNo}，指圈号：${efingerRing}，材质：${metalText}，金属颜色：${metalColor}，表面处理：${metalSurface}，主石重量：${diamonedWeight}，主石类别：${certificateType}，主石颜色：${diamondColor ? diamondColor : ''}，主石净度：${diamondClarity ? diamondClarity : ''}`;
    var ecusGiaDetail = `净度：${diamondClarity}，切工：${diamondCut}，抛光：${diamondPolishing}，对称：${diamondSymmetry}，荧光:`;
    if (!this.modelNo) {
      this.showWarnWindow(true, "请输入版库编号", "warning");
      return
    }
    if (!efingerRing) {
      this.showWarnWindow(true, "请输入指圈", "warning");
      return
    }
    if (!metal) {
      this.showWarnWindow(true, "请选择金属材质", "warning");
      return
    }
    if (!metalColor) {
      this.showWarnWindow(true, "请选择金属颜色", "warning");
      return
    }
    if (!metalSurface) {
      this.showWarnWindow(true, "请选择金属表面处理", "warning");
      return
    }
    if (!diamondGradeSection) {
      this.showWarnWindow(true, "请选择主石重量/单颗", "warning");
      return
    }
    if (!this.certType && certificateType == "") {
      this.showWarnWindow(true, "请选择证书类别", "warning");
      return
    }
    if (!this.isNgtc && !diamondClarity) {
      this.showWarnWindow(true, "请选择钻石净度", "warning");
      return
    }
    if (!this.isNgtc && !diamondColor) {
      this.showWarnWindow(true, "请选择钻石颜色", "warning");
      return
    }
    if (!this.isGia && !this.egiaMesg["clarity"]) {
      this.showWarnWindow(true, "请选择GIA主石颜色", "warning");
      return
    }
    if ($('input[name="lettering"]:checked').attr('title') == '1' && $('.letterContent').val() == '') {
      this.showWarnWindow(true, "请输入刻字内容", "warning");
      return
    }
    if (!urgent) {
      this.showWarnWindow(true, "请选择是否加急", "warning");
      return
    }
    this.isload = false;
    var url = '/pcm-core/pricing/pricing';
    var params = new HttpParams()
      .set('patternId', `${this.modelNo}`)
      .set('fingerRing', efingerRing)
      .set('metal', metal)
      .set('metalColor', metalColor)
      .set('metalSurface', metalSurface)
      .set('diamondGradeSection', diamondGradeSection)
      .set('diamondWeight', diamonedWeight)
      .set('certificateType', certificateType)
      .set('diamondColor', diamondColor)
      .set('diamondClarity', diamondClarity)//净度
      .set('diamondCut', diamondCut)//切工
      .set('diamondPolishing', diamondPolishing) //抛光
      .set('diamondSymmetry', diamondSymmetry) //对称
      .set('diamondFluores', '') //荧光
      .set('diamondProduceId', diamondProduceId)
      .set('diamondRapaport', diamondRapaport)
      .set('urgent', urgent);
    this.httpclient.get(url, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.isPrice = true;
          this.pricingPrice = res['data']['pricingPrice']
          this.signTime = res['data']['pickDate'];
          this.detailInfo = params['updates'];
          this.engContent = engContent;
          this.ecusDetail = ecusDetail;
          this.ecusGiaDetail = certificateType == "GIA" ? ecusGiaDetail : '';
          this.subCustom(orderStatus);
        } else {
          this.showWarnWindow(true, res['desc'], "warning")
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 裸石选择
  subDiamond() {
    var clarity = $('input[name="dclarity"]:checked').attr('title');
    var cut = $('input[name="cut"]:checked').attr('title');
    var polish = $('input[name="polish"]:checked').attr('title');
    var symmetry = $('input[name="symmetry"]:checked').attr('title');
    var florescence = $('input[name="diaColor"]:checked').attr('title');
    if (clarity && cut && polish && symmetry && florescence) {
      var pricUrl = '/pcm-core/pricing/pricinglos';
      // var lsWgt=new BigDecimal(this.bsWgt)
      var params = new HttpParams()
        .set('patternId', `${this.modelNo}`)
        .set('lsColor', florescence)
        .set('lsNet', clarity)
        .set('lsCut', cut)
        .set('lsPol', polish)
        .set('lsSym', symmetry)
        .set('lsWgt', `${this.bsWgt}`);
      this.httpclient.get(pricUrl, { params })
        .subscribe(
          res => {
            if (res['code'] == 200) {
              this.egiaMesg['clarity'] = clarity;
              this.egiaMesg['cut'] = cut;
              this.egiaMesg['polish'] = polish;
              this.egiaMesg['symmetry'] = symmetry;
              this.egiaMesg['florescence'] = florescence;
              this.losdata = res['data'];
              $('#eselDia').modal('hide');
            } else {
              this.showWarnWindow(true, res['desc'], 'warning');
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err.error);
          }
        );
    } else {
      this.showWarnWindow(true, "请选择信息", 'warning')
    }

  }
  // 裸石选择弹窗关闭
  queryReset() {
    $('.certificate').val('');
    this.isNgtc = false;
    $("input[name='diaColor']").attr("checked", false);
    $("input[name='dclarity']").attr("checked", false);
    this.egiaMesg = new GiaInfoe('', '', '', '', '');
    $('#eselDia').modal('hide');
  }

  // 保存
  // 定制价格和保存合二为一
  subCustom(orderStatus) {
    if (this.isPrice) {
      var certype = $('.certificate').find("option:selected").val();
      var certificateType = "";
      if (!this.certType) {
        certificateType = certype ? certype : ""
      } else {
        certificateType = "NGTC"
      }
      this.isload = false;
      var totalCost = this.losdata ? this.losdata.totalCost : '',
        stoneCode = this.losdata ? this.losdata.stoneCode : '',
        ecusGiaDetail = this.ecusGiaDetail,
        ecusDetail = this.ecusDetail,
        modelNo = this.modelNo,
        cusOrder = this.cusOrder,
        sid = this.sid,
        zfigrNum = $('.efingerRing').val(),
        zmaterial = $('#eshowColor').find("option:selected").val(),
        zmtlCol = $('input[name="color"]:checked').attr('title'),
        zsfProc = $('input[name="surface"]:checked').attr('title'),
        zlsWgt = this.dicscore,
        zlsSpec = $('.edWeight').find("option:selected").val(),
        zcrtName = certificateType,
        zlsNet = (certificateType == 'NGTC') ? $('input[name="clarity"]:checked').attr('title') : this.egiaMesg.clarity,
        zlsColor = (certificateType == 'NGTC') ? $('input[name="dicolor"]:checked').attr('title') : this.egiaMesg.florescence,
        zlsCut = this.egiaMesg.cut,
        zcutPol = this.egiaMesg.polish,
        zcutSym = this.egiaMesg.symmetry,
        isUrgent = $('input[name="expedited"]:checked').attr('title'),
        engContent = this.engContent ? this.engContent : "",
        pictureUrl = this.imgUrl ? this.imgUrl : "",
        saleTime = new Date().getTime(),
        signTime = new Date(this.signTime).getTime(),
        orderAmount = this.pricingPrice,
        earnestAmount = this.earnestAmount,
        balanceAmount = Number(this.pricingPrice) - this.earnestAmount;
      var subUrl = "/pcm-admin/price-order/save";
      var params = {
        "sid": sid,
        "cusOrder": cusOrder,
        "address": this.address,
        "regPhone": this.regPhone,
        "customer": this.customer,
        "storeCode": this.shopNo,
        "storeName": this.storeName,
        "sourceCode": this.saleSource,
        "orderNo": this.orderNo,
        "cusGiaDetail": ecusGiaDetail,
        "cusDetail": ecusDetail,
        "modelNo": modelNo,
        "zfigrNum": zfigrNum,
        "zmaterial": zmaterial,
        "zmtlCol": zmtlCol,
        "zsfProc": zsfProc,
        "zlsWgt": zlsWgt,
        "zlsSpec": zlsSpec,
        "zcrtName": zcrtName,
        "zlsColor": zlsColor,
        "zlsNet": zlsNet,
        "zlsCut": zlsCut,
        "zcutPol": zcutPol,
        "zcutSym": zcutSym,
        "engContent": engContent,
        "isUrgent": isUrgent,
        "earnestAmount": earnestAmount,
        "balanceAmount": balanceAmount,
        "saleTime": saleTime,
        "signTime": signTime,
        "pictureUrl": pictureUrl,
        "orderAmount": orderAmount,
        "stoneCode": stoneCode,
        "totalCost": totalCost,
        "orderStatus": orderStatus
      }
      this.httpclient.post(subUrl, params, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.isload = true;
            $('#modal_editf').modal('hide');
            orderStatus == 0 ? this.showWarnWindow(true, "保存成功", 'success') : this.showWarnWindow(true, "提交成功", 'success')
          } else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      )
    }
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
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
      that.route.navigate(['/oms/pricelist'])
    }
  }
}
export class GiaInfoe {
  constructor(
    public clarity: string,
    public cut: string,
    public polish: string,
    public symmetry: string,
    public florescence: string
  ) {
  }
}