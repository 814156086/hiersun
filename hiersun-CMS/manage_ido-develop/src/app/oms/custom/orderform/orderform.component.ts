import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.component.html',
  styleUrls: ['./orderform.component.css']
})
export class OrderformComponent implements OnInit {
  @ViewChild('verifyprice') verifyprice
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  sourceList = [];
  today: object = new Date();
  balanceAmount = 0;//尾款
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    if ($().select2) {
      $('#orderSource').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadSourceList();
  }
  // 加载订单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.sourceList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 定做明细
  vetrifyModal() {
    this.verifyprice.initVerify()
  }
  countAmount() {
    this.balanceAmount = 0
    var earnestAmount = Number($('.earnestAmount').val()),
      orderAmount = Number($('.finanprice').val());
    this.balanceAmount = orderAmount - earnestAmount;
  }
  // 保存/提交
  subCustom() {
    this.isload = false;
    var orderNo = $('.orderNo').val(),
      sourceCode = $('#orderSource').select2('val'),
      // storeCode = $('#storeCode').select2('val'),
      // storeName = $('#storeCode').select2('data').text,
      saleTime = new Date($('.saleTime').val()).getTime(),
      signTime = new Date($('.signTime').val()).getTime(),
      cusGiaDetail = $('.cusGiaDetail').val(),
      cusDetail = $('.cusDetail').val(),
      earnestAmount = $('.earnestAmount').val(),
      balanceAmount = $('.balanceAmount').val(),
      orderAmount = $('.finanprice').val();
    if (Number(earnestAmount) > Number(orderAmount)) {
      this.showWarnWindow(true, "定金额（现金）不能大于财务定价", "warning")
      return
    }
    if (!sourceCode) {
      this.showWarnWindow(true, "线上订单渠道不能为空", "warning")
      return
    }
    if (!orderNo) {
      this.showWarnWindow(true, "线上单据号不能为空", "warning")
      return
    }
    if (!cusDetail) {
      this.showWarnWindow(true, "定做明细不能为空", "warning")
      return
    }
    if (!earnestAmount) {
      this.showWarnWindow(true, "定金额不能为空", "warning")
      return
    }
    if (!balanceAmount) {
      this.showWarnWindow(true, "尾款不能为空", "warning")
      return
    }
    var priceList = this.verifyprice.loadPriceList();
    var totalCost = priceList[0]['totalCost'];
    var stoneCode = priceList[0]['stoneCode'];
    var detailInfo = priceList[0]['detailInfo']
    var engContent = priceList[0]['engContent'] ? priceList[0]['engContent'] : "";
    var pictureUrl = priceList[0]['pictureUrl'] ? priceList[0]['pictureUrl'] : "";
    var modelNo = detailInfo.filter((i, v) => i.param == "patternId")[0]['value'],
      zfigrNum = detailInfo.filter((i, v) => i.param == "fingerRing")[0]['value'],
      zmaterial = detailInfo.filter((i, v) => i.param == "metal")[0]['value'],
      zmtlCol = detailInfo.filter((i, v) => i.param == "metalColor")[0]['value'],
      zsfProc = detailInfo.filter((i, v) => i.param == "metalSurface")[0]['value'],
      zlsWgt = detailInfo.filter((i, v) => i.param == "diamondWeight")[0]['value'],
      zlsSpec = detailInfo.filter((i, v) => i.param == "diamondGradeSection")[0]['value'],
      zcrtName = detailInfo.filter((i, v) => i.param == "certificateType")[0]['value'],
      zlsNet = detailInfo.filter((i, v) => i.param == "diamondClarity")[0]['value'],
      zlsColor = detailInfo.filter((i, v) => i.param == "diamondColor")[0]['value'],
      zlsCut = detailInfo.filter((i, v) => i.param == "diamondCut")[0]['value'],
      zcutPol = detailInfo.filter((i, v) => i.param == "diamondPolishing")[0]['value'],
      zcutSym = detailInfo.filter((i, v) => i.param == "diamondSymmetry")[0]['value'],
      isUrgent = detailInfo.filter((i, v) => i.param == "urgent")[0]['value'],
      engContent = engContent,
      pictureUrl = pictureUrl,
      orderAmount = orderAmount;
    var subUrl = "/pcm-admin/price-order/save";
    var params = {
      // "storeCode": storeCode,
      // "storeName": storeName,
      "sourceCode": sourceCode,
      "orderNo": orderNo,
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
      "totalCost": totalCost
    }
    this.httpclient.post(subUrl, params, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.showWarnWindow(true, "保存成功", 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  normalInputChange(event) {
    // 输入小数，控制小数点后两位显示
    event.target.value = (/^\d+\.?\d{0,2}$/).test(event.target.value) ? event.target.value : '';
  }
  goBack() {
    window.history.go(-1);
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
