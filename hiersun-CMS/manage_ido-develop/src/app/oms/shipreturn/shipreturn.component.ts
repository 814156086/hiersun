import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;


@Component({
  selector: 'app-shipreturn',
  templateUrl: './shipreturn.component.html',
  styleUrls: ['./shipreturn.component.css']
})
export class ShipreturnComponent implements OnInit {

  @ViewChild('saledetail') saledetail
  @ViewChild('orderdetail') orderdetail
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  public flag = 2;//发货前退货单查询/管理
  public sourceList = [];//销售渠道
  public returnsList = [];//已签收退货信息
  public propNameList = [];//明细动态表头
  public saleItemList = [];//退货信息详情
  public refundReasonList = [];//退货信息详情
  // public returnMesg: any;//创建退货单的回显
  public saleSource: any;//销售渠道
  JDorderNo: any;
  JDsaleNo: any;
  sumPrice = 0;
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
    $('#saleDt').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    if ($().select2) {
      $('#saleChannel').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.activatedRoute.params.subscribe(data => {
      this.flag = data.flag;
      if (this.flag != 2) {
        $('.disChannel').css("display", "none");
        this.loadSourceList();
        this.refundReason();
        this.initRejectedInfo();
      } else {
        this.loadSourceList();
        this.refundReason();
        this.initRejectedInfo();
        $('.disChannel').css("display", "");
      }
    });
    this.isload = true;
  }
  // 加载销售单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        this.sourceList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  initRejectedInfo() {
    this.isload = false;
    var saleChannel = $('#saleChannel').select2('val');
    var that = this;
    var startSaleTime = $('#saleDt').val().split('--')[0];
    var endSaleTime = $('#saleDt').val().split('--')[1];
    var selecturl = '/oms-admin/sale/selectSale2';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "saleNo": $('#saleNum').val(),
      "orderNo": $('#orderNum').val(),
      "startSaleTime": startSaleTime,
      "endSaleTime": endSaleTime,
      // "saleStatus": $("#isStock").val(),
      "suppllyName": $('#supplierName').val(),
      "supplyNo": $('#supplierNum').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
      "saleSource": this.flag != 3 ? (!saleChannel ? "0','C1','C2','M1" : saleChannel) : "C3"
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnsList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.returnsList.length ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initRejectedInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  queryReset() {
    $('#saleNum').val("");
    $('#orderNum').val("");
    $("#isStock").val("");
    $('#saleDt').val("");
    $('#supplierName').val("");
    $('#supplierNum').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    $('#saleChannel').select2("val", "");
    this.pageNum = 1;
    this.initRejectedInfo();
  }
  // 加号
  detailPlus(e, sItemNo, saleSource, JDorderNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      this.saleSource = "";
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.getSaleItemInfo(sItemNo);
      this.saleSource = saleSource;
      this.JDsaleNo = sItemNo;
      this.JDorderNo = JDorderNo;
      this.shiporderNo = JDorderNo;
      this.shipsaleNo = sItemNo;
    }
  }
  getSaleItemInfo(sItemNo) {
    this.flag == 2 ? $("#modal_plus").modal('show') : $("#modal_plusjd").modal('show');
    // this.flag != 2 ? $("#modal_plus").modal('show') : $("#modal_plusjd").modal('show');
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
  closeMoadl() {
    var $span = $('.allList tr>:first-child span');
    if ($span.hasClass("glyphicon-minus")) {
      $span.addClass("glyphicon-plus");
      $span.removeClass("glyphicon-minus");
    }
  }
  // 提交退货
  // submitReturn(slitem) {
  //   if (slitem.refundNum && this.saleSource != "C3") {
  //     $("#submit_return").modal('show');
  //   } else if (slitem.refundNum && this.saleSource == "C3") {
  //     $("#submit_jdreturn").modal('show');
  //   } else {
  //     this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
  //   }
  //   this.returnMesg = slitem;
  // }
  // 非京东提交退货
  submitReturn() {
    this.proNumShip=0;
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
    if (this.saleSource != "C3" && this.productsShip.length != 0 && !shipflag) {
      $("#submit_return").modal('show');
    }
  }
  // JD提交退货
  submitReturnJD() {
    // $("#submit_jdreturn").modal('show');
    var JDproducts = this.saleItemList;
    var JDrefundNum = 0;
    var sumPrice = 0;
    JDproducts.forEach((value, index) => {
      JDrefundNum += Number(value.refundNum);
      sumPrice += Number(value.refundNum) * Number(value.salePrice)
    })
    this.sumPrice += sumPrice;
    if (JDrefundNum) {
      $("#submit_jdreturn").modal('show');
    } else {
      this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
    }
  }
  // 拒收原因
  subReason() {
    // var products = [];
    // products.push({
    //   "refundNum": this.returnMesg.refundNum,
    //   "orderItemNo": this.returnMesg.salesItemNo,
    //   "saleItemNo": this.returnMesg.salesItemNo,
    //   "saleNo": this.returnMesg.saleNo,
    //   "barCode": this.returnMesg.barcode,
    // });
    this.isload = false;
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
  // 京东拒收原因
  subJDReason() {
    var taxDeduction = Number($('#taxDeduction').val());
    var Jingdou = Number($('#Jingdou').val());
    var otherPay = Number($('#otherPay').val());
    var sum = taxDeduction + Jingdou + otherPay;
    if (sum > this.sumPrice) {
      this.showWarnWindow(true, "京东创建申请单扣款分摊扣税金额大于销售金额", "warning");
      return;
    }
    var refundAmount = $('#refundAmount').val();
    if (!refundAmount) {
      this.showWarnWindow(true, "退款金额不能为空", "warning");
      return;
    }
    var subrurl = "/oms-admin/refundApply/createRefundApplyCSForJD";
    var JDproducts = this.saleItemList;
    var products = [];
    var JDrefundNum = 0;
    JDproducts.forEach((value, index) => {
      products.push({
        "refundNum": value.refundNum,
        "orderItemNo": value.salesItemNo,
        "saleItemNo": value.salesItemNo,
        "saleNo": value.saleNo,
        "barCode": value.barcode,
      });
      JDrefundNum += Number(value.refundNum);
    })
    var deductionJD = []
    deductionJD.push({
      "amount": refundAmount,
      "money": refundAmount,
      "paycode": "14120",
      "payType": "12",
    })
    var subrparams = {
      "refundNum": JDrefundNum,
      "products": products,
      "refundClass": "RequestCancelReturn",
      "fromSystem": "PCM",
      "problemDesc": $('#rejectedreason').val(),
      "latestUpdateMan": "admin",
      "orderNo": this.JDorderNo,
      "saleNo": this.JDsaleNo,
      "deduction": deductionJD
    }
    this.httpclient.post(subrurl, subrparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $("#modal_plusjd").modal('hide');
          $("#submit_jdreturn").modal('hide');
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
  // 销售单详情弹窗
  getSalesMes(saleNo,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }
  // 订单号查询
  getOrderItemInfo(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
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
  }
}
