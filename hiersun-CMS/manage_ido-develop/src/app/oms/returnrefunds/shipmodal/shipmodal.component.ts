import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-shipmodal',
  templateUrl: './shipmodal.component.html',
  styleUrls: ['./shipmodal.component.css']
})
export class ShipmodalComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public refundReasonList = [];//退货原因列表
  public propNameList = [];//明细动态表头
  public saleItemList = [];//退货信息详情
  productsShip = [];//非京东退货
  sumPriceShip = 0;//非京东退货合价
  proNumShip = 0;//非京东退货数量
  hasGift = true;//是否存在赠品
  shiporderNo: any;
  shipsaleNo: any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.refundReason();
  }
  // 退货原因列表
  refundReason() {
    this.isload = false;
    var codeUrl = "/oms-admin/dict/selectCodelist";
    var codeParams = {
      "typeValue": "refundReason2"
    }
    this.httpclient.post(codeUrl, codeParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refundReasonList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  initShipMes(sItemNo, orderNo) {
    $("#modal_plus").modal('show');
    this.shiporderNo = orderNo;
    this.shipsaleNo = sItemNo;
    this.getSaleItemInfo(sItemNo);
  }
  getSaleItemInfo(sItemNo: any) {
    this.isload = false;
    this.hasGift = true;
    var selecturl = '/oms-admin/refundApply/selectSaleItem';
    var selparams = {
      "saleNo": sItemNo
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saleItemList = res['data']['saleItemList'];
          this.propNameList = res['data']['propNameList'];
          // 非京东退货 存在赠品整单退
          this.hasGift = this.saleItemList.every((i, v) => i.isGift == 0);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 非京东提交退货
  submitReturn() {
    this.proNumShip = 0;
    this.productsShip = [];
    var shipflag = false;
    const shipCheckedRows = $('td input[name="checkbox_ship"]:checked').parents("tr");
    if (shipCheckedRows.length == 0) {
      this.showWarnWindow(true, "请选择要退货的商品!", "warning");
      return
    }
    shipCheckedRows.each((index, value) => {
      var shiporderItemNo = $($(value).children('td')[0]).attr('id');
      var shiporderNo = $($(value).children('.shiporderNo')).text();
      var shipbarCode = $($(value).children('.shipbarCode')).text();
      var shipprice = Number($($(value).children('.shipprice')).text());
      var shipproNum = Number($($(value).children('.shiprefundNum')).text());
      var sumPriceNot = shipproNum * shipprice;
      this.sumPriceShip += sumPriceNot;
      this.proNumShip += shipproNum;
      this.productsShip.push({
        "refundNum": shipproNum,
        "orderItemNo": shiporderItemNo,
        "saleItemNo": shiporderItemNo,
        "orderNo": shiporderNo,
        "barCode": shipbarCode
      });
      if (!shipproNum) {
        this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
        shipflag = true;
        return
      }
    })
    if (shipflag) {
      this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
      return
    }
    if (this.productsShip.length != 0 && !shipflag) {
      $("#submit_return").modal('show');
    }
  }
  // 拒收原因
  subReason() {
    var subrurl = "/oms-admin/refundApply/createRefundApplyCS";
    var rejectedReason = $("#rejectedreason").val();
    if (this.proNumShip == 0) {
      this.showWarnWindow(true, "退货数量不能为0", "warning");
      return;
    }
    if (!rejectedReason) {
      this.showWarnWindow(true, "退货原因不能为空", "warning");
      return;
    }
    this.isload = false;
    var subrparams = {
      "refundNum": this.proNumShip,
      "products": this.productsShip,
      "refundClass": "RequestCancelReturn",
      "fromSystem": "PCM",
      "problemDesc": $('#rejectedreason').val(),
      "latestUpdateMan": "admin",
      "orderNo": this.shiporderNo,
      "saleNo": this.shipsaleNo
    }
    this.httpclient.post(subrurl, subrparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          $("#modal_plus").modal('hide');
          $("#submit_return").modal('hide');
          var refundApplyNo = res['data']['refundApplyNo'];
          this.route.navigate(['/oms/reviewreturn'], {
            queryParams: {
              refundApplyNo
            }
          });
        } else {
          this.showWarnWindow(true, res['message'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  // 关闭弹窗
  closeMoadl() {
    var $span = $('.allList tr>:first-child span');
    if ($span.hasClass("glyphicon-minus")) {
      $span.addClass("glyphicon-plus");
      $span.removeClass("glyphicon-minus");
    }
  }
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  //  关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
