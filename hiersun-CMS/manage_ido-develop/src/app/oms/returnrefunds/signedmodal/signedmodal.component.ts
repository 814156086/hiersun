import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-signedmodal',
  templateUrl: './signedmodal.component.html',
  styleUrls: ['./signedmodal.component.css']
})
export class SignedmodalComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载

  public refundReasonList = [];//退货原因
  public propNameListS = [];//明细动态表头
  public saleItemListS = [];//退货信息详情
  public proNumJDNot = 0;//非京东退货数量
  hasGift = true;
  productsJDNot = [];//非JD申请单详情
  NotJDorderNo: any;
  NotJDsaleNo: any;
  sumPriceNot = 0;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.refundReason();
  }
  // 退货原因列表
  refundReason() {
    this.isload = false;
    var codeUrl = "/oms-admin/dict/selectCodelist";
    var codeParams = {
      "typeValue": "refundReason"
    }
    this.httpclient.post(codeUrl, codeParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refundReasonList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  initSignedMes(sItemNo, orderNo) {
    $('#modal_signed').modal('show');
    this.NotJDorderNo = orderNo;
    this.NotJDsaleNo = sItemNo;
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
          this.saleItemListS = res['data']['saleItemList'];
          this.propNameListS = res['data']['propNameList'];
          // 非京东退货 存在赠品整单退
          this.hasGift = this.saleItemListS.every((i, v) => i.isGift == 0);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  closeMoadl() {
    var $span = $('.allList tr>:first-child span');
    if ($span.hasClass("glyphicon-minus")) {
      $span.addClass("glyphicon-plus");
      $span.removeClass("glyphicon-minus");
    }
  }
  // 非京东提交退货
  submitReturn() {
    this.productsJDNot = [];
    this.proNumJDNot = 0;
    var NotJDflag = false;
    const NotcheckedRows = $('td input[name="checkbox_NotJD"]:checked').parents("tr");
    if (NotcheckedRows.length == 0) {
      this.showWarnWindow(true, "请选择要退货的商品!", "warning");
      return
    }
    NotcheckedRows.each((index, element) => {
      // console.log($($(element).children('td')[0]).attr('id'));
      var NotJDorderItemNo = $($(element).children('td')[0]).attr('id');
      var NotJDorderNo = $($(element).children('.NotJDorderNo')).text();
      var NotJDbarCode = $($(element).children('.NotJDbarCode')).text();
      var NotJDprice = Number($($(element).children('.NotJDprice')).text());
      var NotJDproNum = Number($($(element).children('.NotJDrefundNum').children('.input-small').children('input')).val());
      var sumPriceNot = NotJDproNum * NotJDprice;
      this.sumPriceNot += sumPriceNot;
      this.proNumJDNot += NotJDproNum;
      this.productsJDNot.push({
        "refundNum": NotJDproNum,
        "orderItemNo": NotJDorderItemNo,
        "saleItemNo": NotJDorderItemNo,
        "orderNo": NotJDorderNo,
        "barCode": NotJDbarCode
      });
      if (!NotJDproNum) {
        this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
        NotJDflag = true;
        return
      }
    })
    if (NotJDflag) {
      this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
      return
    }
    if (this.productsJDNot.length != 0 && !NotJDflag) {
      $("#submit_returnNotJD").modal('show');
    }
  }
  // 非京东提交退货前数量变化
  plusNumJDNot(refundNum, sid) {
    var NotJDpronum = Number($(`.NotJDproNum_${sid}`).val());
    if (NotJDpronum < refundNum) {
      NotJDpronum += 1;
      $(`.NotJDproNum_${sid}`).val(NotJDpronum)
    }
  }
  lowerNumJDNot(refundNum, sid) {
    var NotJDpronum = Number($(`.NotJDproNum_${sid}`).val());
    if (NotJDpronum) {
      NotJDpronum -= 1;
      $(`.NotJDproNum_${sid}`).val(NotJDpronum)
    }
  }
  // 非京东拒收
  subReason() {
    var rejectedReason = $("#rejreason").val();
    // var rejectedReason1 = $("#rejreason").find("option:selected").text();
    if (this.proNumJDNot == 0) {
      this.showWarnWindow(true, "退货数量不能为0", "warning");
      return;
    }
    if (!rejectedReason) {
      this.showWarnWindow(true, "退货原因不能为空", "warning");
      return;
    }
    this.isload = false;
    var subrurl = "/oms-admin/refundApply/createRefundApplyCS";
    var subrparams = {
      "refundNum": this.proNumJDNot,
      "refundClass": "RequestReturn",
      "products": this.productsJDNot,
      "fromSystem": "PCM",
      "problemDesc": rejectedReason,
      "latestUpdateMan": "admin",
      "orderNo": this.NotJDorderNo,
      "saleNo": this.NotJDsaleNo
    }
    this.httpclient.post(subrurl, subrparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          $("#modal_signed").modal('hide');
          $("#submit_returnNotJD").modal('hide');
          $('tbody td input').val("");
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
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
