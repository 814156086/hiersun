import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'

declare var $: any;
@Component({
  selector: 'app-verifyprice',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './verifyprice.component.html',
  styleUrls: ['./verifyprice.component.css']
})
export class VerifypriceComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  public giaMesg: GiaInfo;//弹窗gia
  patternId: any;//版库号
  certTypeList = [];//证书类别list
  modelList: Array<any>;//核价查询
  proModelZmtrDic: Array<any>;//c材质
  proModelAttrList: Array<any>;// 子版库
  proModelZlsDmdDic: Array<any>;// 主石重量
  dicscore: any;
  imgUrl = "";//图片地址
  isHintSucc = false;//回车信息查询成功
  prefixList = [];//模糊查询列表
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
  engContent: any;//刻字内容
  detailInfo: any;//选择的值的值
  // priceList = [];//核价操作返回的值
  pricingPrice = ""//核价后的价格
  signTime = ""//核价后的时间
  cusDetail: any;//定做明细
  cusGiaDetail: any;//GIA主石规格明细
  isPrice = false;//已核算价格
  saleSource: any;//渠道
  orderNo: any;//线上单据号
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
  public tempScoreCode;
  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    this.isload = true;
    this.isPrice = false;
    this.giaMesg = new GiaInfo('', '', '', '', '');
    // this.certTypeList = [{ "typeCode": "NGTC", "typeName": "NGTC" }, { "typeCode": "GIA", "typeName": "GIA" }]
  }
  initVerify(item) {
    this.detailInfo = {};
    // this.priceList = [];
    this.isHintSucc = false;
    this.certTypeList = [];
    // 定做按钮传的值 item
    console.log(item);
    this.saleSource = item.saleSource
    this.orderNo = item.saleNo;//线上单据号
    this.storeName = item.storeName;//门店名称
    this.shopNo = item.shopNo;//门店编号
    this.earnestAmount = Number(item.paymentAmount) - Number(item.shippingFee);//应付金额（含运费）
    this.address = item.receptAddress;
    this.regPhone = item.receptPhone;
    this.customer = item.receptName;
    this.shoppeNo = item.shoppeNo;
    this.shoppeName = item.shoppeName;
    $('#modal_verify').modal('show');
  }
  completeSearch(event) {
    this.prefixList = [];
    var that = this;
    var prefix = event.target.value;
    if (prefix != '') {
      // this.prefixList = [];
      $("#autoPatId").typeahead({
        source: function (query, process) {
          // console.log(query)
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
  onEnter(event) {
    var patternId = $.trim($(event.target).val());
    this.patternId = patternId;
    patternId ? this.loadPrice(patternId) : this.showWarnWindow(true, "请输入版库号", 'warning');
  }
  // 核价版库查询
  loadPrice(patternId) {
    this.imgUrl = ''
    var baseUrl = "http://192.168.2.244/ido/dimage/"
    this.imgUrl = `${baseUrl}${patternId}.jpg`
    this.isload = false;
    // 内容清空操作
    this.isHintSucc = false;
    this.dicscore = '';
    this.modelList = []
    this.proModelAttrList = []
    this.proModelZmtrDic = []
    this.certTypeList = [];
    $("input[type='radio']").attr('checked', false);
    $('select').val('');
    $('.fingerRing').val('');//指圈号清空
    $('.letterContent').val('');//刻字内容清空
    this.zstkCat = "";
    this.giaMesg = new GiaInfo('', '', '', '', '');
    var priUrl = `/pcm-core/pricing/modelList/${patternId}`;
    this.httpclient.get(priUrl).subscribe(
      res => {
        if (res['code'] == 200 && res['data']) {
          this.isload = true;
          this.isHintSucc = true;
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
    this.imgUrl = `${baseUrl}${this.patternId}_${picode}.jpg`
  }
  // 金属材质
  selectMaterial() {
    // 05,06 只显示白色
    var color = $('#showColor').find("option:selected").val();
    this.isColor = (color == '05' || color == '06') ? true : false;
    $('.dWeight').val('');
    this.dicscore = '';
  }
  letter(a) {
    a == 1 ? $('.letterContent').attr('readonly', "readonly") : $('.letterContent').removeAttr('readonly');
  }
  // 主石分数的选择
  selectScore() {
    this.certTypeList = [{ "typeCode": "NGTC", "typeName": "NGTC" }, { "typeCode": "GIA", "typeName": "GIA" }];
    var material = $('#showColor').find("option:selected").val();
    var scoreCode = $(".dWeight").find("option:selected").val();
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
        that.giaMesg = new GiaInfo('', '', '', '', '');
      } else if (scoreCode === "04" || scoreCode === "05") {
        that.isNgtc = false;
        that.maxWgt = false;
        $("input[name='clarity']").attr('checked', false);
        $("input[name='dicolor']").attr('checked', false);
        $("#VS").attr('checked', true);
        $("#IJ").attr('checked', true);
        that.certTypeList = certList.filter((i, v) => i.typeCode == "NGTC");
        that.isGia = true;
        that.certType = false;
        that.isCleaness = true;
        that.giaMesg = new GiaInfo('', '', '', '', '');
      } else if (scoreCode >= '06' && scoreCode < '13') {
        that.certTypeList = certList;
        that.isNgtc = false;
        that.isGia = true;
        that.certType = false;
        that.isCleaness = false;
        that.maxWgt = false;
        // Tower系列 默认NGTC
        $("input[name='clarity']").attr('checked', false);//钻石净度
        $("input[name='dicolor']").attr('checked', false);//钻石颜色
        $("input[name='diaColor']").attr('checked', false);//裸石选择颜色
        $("input[name='dclarity']").attr('checked', false);//裸石选择净度
        that.giaMesg = new GiaInfo('', '', '', '', '');
        if (that.zstkCat == "H0") {
          $("#VS").attr('checked', true);
          that.maxWgt = true;
          // $("#IJ").attr('checked', true);
        }
      } else {
        that.certTypeList = certList.filter((i, v) => i.typeCode == "GIA");
        $('#selDia').modal('show');
        that.isNgtc = true;
        that.isGia = false;
        that.certType = false;
        that.isCleaness = false;
        that.maxWgt = false;
        $("input[name='clarity']").attr('checked', false);
        $("input[name='dicolor']").attr('checked', false);
        $("input[name='diaColor']").attr('checked', false);
        $("input[name='dclarity']").attr('checked', false);
        that.giaMesg = new GiaInfo('', '', '', '', '');
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
    var material = $('#showColor').find("option:selected").val();
    this.giaMesg = new GiaInfo('', '', '', '', '');
    if (!material) {
      this.showWarnWindow(true, "请选择主石重量/单颗", 'warning');
      return
    }
    var type = $(".certificate").find("option:selected").val();
    if (type == 'GIA') {
      this.isNgtc = true;
      this.isGia = false;
      $('#selDia').modal('show');
      $("input[name='diaColor']").attr('checked', false);
      $("input[name='dclarity']").attr('checked', false);
      $("input[title='VG']").attr('checked', true);
      // 证书类别
      // $("input[name='dclarity']").attr('checked', false);
      // $("input[name='dclarity']").attr('checked', false);
    } else {
      this.isNgtc = false;
      this.isGia = true;
    }
  }
  // 定制价格
  subPrice(orderStatus) {
    this.isPrice = false;
    var certype = $('.certificate').find("option:selected").val();
    var certificateType = "";
    if (!this.certType) {
      certificateType = certype ? certype : ""
    } else {
      certificateType = "NGTC"
    }
    var fingerRing = $('.fingerRing').val(),
      metal = $('#showColor').find("option:selected").val(),
      metalText = $('#showColor').find("option:selected").text(),
      metalColor = $('input[name="color"]:checked').attr('title'),
      metalSurface = $('input[name="surface"]:checked').attr('title'),
      diamondGradeSection = $('.dWeight').find("option:selected").val(),
      diamondWeight = this.dicscore,
      diamondClarity = (certificateType == 'NGTC') ? $('input[name="clarity"]:checked').attr('title') : this.giaMesg.clarity,
      diamondColor = (certificateType == 'NGTC') ? $('input[name="dicolor"]:checked').attr('title') : this.giaMesg.florescence,
      diamondCut = this.giaMesg.cut,
      diamondPolishing = this.giaMesg.polish,
      diamondSymmetry = this.giaMesg.symmetry,
      diamondProduceId = this.losdata ? this.losdata.stoneCode : '',
      diamondRapaport = this.losdata ? this.losdata.totalCost : '',
      urgent = $('input[name="expedited"]:checked').attr('title');
    var engContent = $('input[name="lettering"]:checked').attr('title') ? $('.letterContent').val() : ""
    var cusDetail = `版库编号：${this.patternId}，指圈号：${fingerRing}，材质：${metalText}，金属颜色：${metalColor}，表面处理：${metalSurface}，主石重量：${diamondWeight}，主石类别：${certificateType}，主石颜色：${diamondColor ? diamondColor : ''}，主石净度：${diamondClarity ? diamondClarity : ''}`;
    var cusGiaDetail = `净度：${diamondClarity}，切工：${diamondCut}，抛光：${diamondPolishing}，对称：${diamondSymmetry}，荧光:`;
    if (!this.patternId) {
      this.showWarnWindow(true, "请输入版库编号", "warning");
      return
    }
    if (!fingerRing) {
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
    if (!this.isGia && !this.giaMesg["clarity"]) {
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
      .set('patternId', `${this.patternId}`)
      .set('fingerRing', fingerRing)
      .set('metal', metal)
      .set('metalColor', metalColor)
      .set('metalSurface', metalSurface)
      .set('diamondGradeSection', diamondGradeSection)
      .set('diamondWeight', diamondWeight)
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
          this.cusDetail = cusDetail;
          this.cusGiaDetail = certificateType == "GIA" ? cusGiaDetail : '';
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
  //确定
  // resetPrice() {
  //   // data-dismiss="modal"
  //   this.priceList.push({
  //     "detailInfo": this.detailInfo,
  //     "engContent": this.engContent,
  //     "pictureUrl": this.imgUrl,
  //     "stoneCode": this.losdata ? this.losdata.stoneCode : '',
  //     "totalCost": this.losdata ? this.losdata.totalCost : ''
  //   })
  //   $('#modal_verify').modal('hide');
  // }
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
        .set('patternId', `${this.patternId}`)
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
              this.giaMesg['clarity'] = clarity;
              this.giaMesg['cut'] = cut;
              this.giaMesg['polish'] = polish;
              this.giaMesg['symmetry'] = symmetry;
              this.giaMesg['florescence'] = florescence;
              this.losdata = res['data'];
              $('#selDia').modal('hide');
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
    this.giaMesg = new GiaInfo('', '', '', '', '');
    $('#selDia').modal('hide');
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
        cusGiaDetail = this.cusGiaDetail,
        cusDetail = this.cusDetail,
        modelNo = this.patternId,
        zfigrNum = $('.fingerRing').val(),
        zmaterial = $('#showColor').find("option:selected").val(),
        zmtlCol = $('input[name="color"]:checked').attr('title'),
        zsfProc = $('input[name="surface"]:checked').attr('title'),
        zlsWgt = this.dicscore,
        zlsSpec = $('.dWeight').find("option:selected").val(),
        zcrtName = certificateType,
        zlsNet = (certificateType == 'NGTC') ? $('input[name="clarity"]:checked').attr('title') : this.giaMesg.clarity,
        zlsColor = (certificateType == 'NGTC') ? $('input[name="dicolor"]:checked').attr('title') : this.giaMesg.florescence,
        zlsCut = this.giaMesg.cut,
        zcutPol = this.giaMesg.polish,
        zcutSym = this.giaMesg.symmetry,
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
        "address": this.address,
        "regPhone": this.regPhone,
        "customer": this.customer,
        "storeCode": this.shopNo,
        "storeName": this.storeName,
        "sourceCode": this.saleSource,
        "orderNo": this.orderNo,
        "cusGiaDetail": cusGiaDetail,
        "cusDetail": cusDetail,
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
            $('#modal_verify').modal('hide');
            orderStatus == 0 ? this.showWarnWindow(true, "保存成功", 'success') : this.showWarnWindow(true, "提交成功", 'success');
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
  // 提交




  // 返回的值
  // loadPriceList() {
  //   return this.priceList
  // }
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
export class GiaInfo {
  constructor(
    public clarity: string,
    public cut: string,
    public polish: string,
    public symmetry: string,
    public florescence: string
  ) {
  }
}
