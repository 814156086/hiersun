import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-rejectedmodal',
  templateUrl: './rejectedmodal.component.html',
  styleUrls: ['./rejectedmodal.component.css']
})
export class RejectedmodalComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public propNameListR = [];//明细动态表头
  public saleItemListR = [];//退货信息详情
  public refundReasonList = [];//退货原因
  productsRejec = [];//非京东退货
  sumPriceRejec = 0;//非京东退货合价
  proNumRejec = 0;//非京东退货数量
  hasGift = true;//是否存在赠品
  rejecorderNo: any;
  rejecsaleNo: any;
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
  initRejectMes(sItemNo, orderNo) {
    $("#modal_replus").modal('show');
    this.rejecorderNo = orderNo;
    this.rejecsaleNo = sItemNo;
    this.getSaleItemInfo(sItemNo);
  }
  getSaleItemInfo(sItemNo) {
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
          this.saleItemListR = res['data']['saleItemList'];
          this.propNameListR = res['data']['propNameList'];
          // 非京东退货 存在赠品整单退
          this.hasGift = this.saleItemListR.every((i, v) => i.isGift == 0);
        }else{
          this.showWarnWindow(true, res['desc'], "warning");
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
  //  提交发货
  submitReturnRejec() {
    this.proNumRejec=0;
    this.productsRejec = [];
    var rejecflag = false;
    const rejecCheckedRows = $('td input[name="checkbox_rejec"]:checked').parents("tr");
    console.log(rejecCheckedRows.length)
    if (rejecCheckedRows.length == 0) {
      this.showWarnWindow(true, "请选择要退货的商品!", "warning");
      return
    }
    rejecCheckedRows.each((index, element) => {
      var rejecorderItemNo = $($(element).children('td')[0]).attr('id');
      var rejecorderNo = $($(element).children('.rejecorderNo')).text();
      var rejecbarCode = $($(element).children('.rejecbarCode')).text();
      var rejecprice = Number($($(element).children('.rejecprice')).text());
      var rejecproNum = Number($($(element).children('.rejecrefundNum')).text());
      var sumPriceNot = rejecproNum * rejecprice;
      this.sumPriceRejec += sumPriceNot;
      this.proNumRejec += rejecproNum;
      this.productsRejec.push({
        "refundNum": rejecproNum,
        "orderItemNo": rejecorderItemNo,
        "saleItemNo": rejecorderItemNo,
        "orderNo": rejecorderNo,
        "barCode": rejecbarCode
      });
      if (!rejecproNum) {
        this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
        rejecflag = true;
        return
      }
    })
    if (rejecflag) {
      this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
      return
    }
    if (this.productsRejec.length != 0 && !rejecflag) {
      $("#submit_return").modal('show');
    }

  }
    // 退货原因
    subReasonRejec() {
      var subrurl = "/oms-admin/refundApply/createRefundApplyCS";
      var rejectedReason = $("#rejectedReason").val();
      if (this.proNumRejec == 0) {
        this.showWarnWindow(true, "退货数量不能为0", "warning");
        return;
      }
      if (!rejectedReason) {
        this.showWarnWindow(true, "退货原因不能为空", "warning");
        return;
      }
      this.isload = false;
      var subrparams = {
        "refundNum": this.proNumRejec,
        "products": this.productsRejec,
        "refundClass": "RejectReturn",
        "fromSystem": "PCM",
        "problemDesc": $('#rejectedReason').val(),
        "latestUpdateMan": "admin",
        "orderNo": this.rejecorderNo,
        "saleNo": this.rejecsaleNo
      }
      this.httpclient.post(subrurl, subrparams, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.isload = true;
            $("#modal_replus").modal('hide');
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
