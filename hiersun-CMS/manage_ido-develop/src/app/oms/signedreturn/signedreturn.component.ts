import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-signedreturn',
  templateUrl: './signedreturn.component.html',
  styleUrls: ['./signedreturn.component.css']
})
export class SignedreturnComponent implements OnInit {
  @ViewChild('orderdetail') orderdetail
  @ViewChild('saledetail') saledetail

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  public flag = 2;//已签收退货单查询/管理
  public sourceList = [];//销售渠道
  public returnsList = [];//已签收退货信息
  public propNameList = [];//明细动态表头
  public saleItemList = [];//退货信息详情
  public proNum = 0;//退货数量
  public proNumJD = 0;//京东退货数量
  public proNumJDNot = 0;//非京东退货数量
  public refundReasonList = [];//退货原因
  // public returnMesg: ReturnInfo;//创建退货单的回显
  public saleSource: any;//销售渠道
  hasGift = true;
  productsJD = [];//JD申请单详情
  productsJDNot = [];//非JD申请单详情
  JDorderNo: any;
  JDsaleNo: any;
  NotJDorderNo: any;
  NotJDsaleNo: any;
  sumPrice = 0;
  sumPriceNot = 0;
  // public formData = new FormData();
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
    // this.returnMesg = new ReturnInfo('', '', '', '', '', '', 0);
    this.activatedRoute.params.subscribe(data => {
      this.flag = data.flag;
      if (this.flag != 2) {
        $('.disChannel').css("display", "none");
        this.refundReason();
        this.loadSourceList();
        this.initRejectedInfo();
      } else {
        this.refundReason();
        this.loadSourceList();
        this.initRejectedInfo();
        $('.disChannel').css("display", "");
      }
      // this.flag != 2 ? $('.disChannel').css("display", "none"):'';   
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
  initRejectedInfo() {
    this.isload = false;
    var that = this;
    var saleChannel = $('#saleChannel').select2('val');
    var startSaleTime = $('#saleDt').val().split('--')[0];
    var endSaleTime = $('#saleDt').val().split('--')[1];
    var selecturl = '/oms-admin/sale/selectSale';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "saleNo": $('#saleNum').val(),
      "orderNo": $('#orderNum').val(),
      "startSaleTime": startSaleTime,
      "endSaleTime": endSaleTime,
      "saleStatus": "08",
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
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
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
  // 重置
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
  detailPlus(e, oItemNo, saleSource, JDorderNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      this.saleSource = "";
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.getSaleItemInfo(oItemNo);
      this.saleSource = saleSource;
      this.JDorderNo = JDorderNo;
      this.JDsaleNo = oItemNo;
      this.NotJDorderNo = JDorderNo;
      this.NotJDsaleNo = oItemNo;
    }
  }
  getSaleItemInfo(oItemNo) {
    this.flag == 2 ? $("#modal_plus").modal('show') : $("#modal_plusjd").modal('show');
    this.isload = false;
    this.hasGift = true;
    var selecturl = '/oms-admin/refundApply/selectSaleItem';
    var selparams = {
      "saleNo": oItemNo
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
  // upPic(event) {
  //   let file = event.target.files[0];
  //   this.formData.append('logoPic', file);
  // }
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
    if (this.saleSource != "C3" && this.productsJDNot.length != 0 && !NotJDflag) {
      $("#submit_returnNotJD").modal('show');
    }

  }
  // 京东提交退货
  submitReturnJD() {
    this.productsJD = [];
    this.proNumJD = 0;
    var JDflag = false;
    // var JDsaleItemList=this.saleItemList;
    const checkedRows = $('td input[name="checkbox_JD"]:checked').parents("tr");
    checkedRows.each((index, element) => {
      // console.log($($(element).children('td')[0]).attr('id'));
      var JDorderItemNo = $($(element).children('td')[0]).attr('id');
      var JDorderNo = $($(element).children('.JDorderNo')).text();
      var JDbarCode = $($(element).children('.JDbarCode')).text();
      var JDprice = Number($($(element).children('.JDprice')).text());
      var JDproNum = Number($($(element).children('.JDrefundNum').children('.input-small').children('input')).val());
      var sumPrice = JDproNum * JDprice;
      this.sumPrice += sumPrice;
      this.proNumJD += JDproNum;
      this.productsJD.push({
        "refundNum": JDproNum,
        "orderItemNo": JDorderItemNo,
        "orderNo": JDorderNo,
        "barCode": JDbarCode
      });
      if (!JDproNum) {
        this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
        JDflag = true;
        return
      }
    })
    if (this.productsJD.length == 0) {
      this.showWarnWindow(true, "请选择要退货的商品!", "warning");
      return
    }
    if (JDflag) {
      this.showWarnWindow(true, "可退货数量为0,暂时无法退货", "warning");
      return
    }
    if (this.saleSource == "C3" && this.productsJD.length != 0 && !JDflag) {
      $("#submit_jdreturn").modal('show');
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
  plusNumJD(refundNum, sid) {
    var JDpronum = Number($(`.JDproNum_${sid}`).val());
    if (JDpronum < refundNum) {
      JDpronum += 1;
      $(`.JDproNum_${sid}`).val(JDpronum)
    }
  }
  lowerNumJD(refundNum, sid) {
    var JDpronum = Number($(`.JDproNum_${sid}`).val());
    if (JDpronum) {
      JDpronum -= 1;
      $(`.JDproNum_${sid}`).val(JDpronum)
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
    console.log(subrparams)
    this.httpclient.post(subrurl, subrparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          $("#modal_plus").modal('hide');
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
  // 京东提交
  subJDReason() {
    // if (this.proNumJD == 0) {
    //   this.showWarnWindow(true, "退货数量不能为0", "warning");
    //   return;
    // }
    var taxDeduction = Number($('#taxDeduction').val());
    var Jingdou = Number($('#Jingdou').val());
    var otherPay = Number($('#otherPay').val());
    var sum = taxDeduction + Jingdou + otherPay;
    if (sum > this.sumPrice) {
      this.showWarnWindow(true, "京东创建申请单扣款分摊扣税金额大于销售金额", "warning");
      return;
    }
    console.log(this.sumPrice, "this.sumPrice");

    var refundAmount = $('#refundAmount').val();
    if (!refundAmount) {
      this.showWarnWindow(true, "退款金额不能为空", "warning");
      return;
    }
    var subrjdurl = "/oms-admin/refundApply/createRefundApplyCSForJD";
    var deductionJD = []
    deductionJD.push({
      "amount": refundAmount,
      "money": refundAmount,
      "paycode": "14120",
      "payType": "12",
    })
    var subrjdparams = {
      "refundNum": this.proNumJD,
      "needRefundAmount": refundAmount,
      'packStatus': $('#packStatusJD').val(),
      'productsStatus': $('#productsStatusJD').val(),
      "refundClass": "RequestReturn",
      "products": this.productsJD,
      // "fromSystem": "PCM",
      "callCenterComments": $('#callCenterCommentsJD').val(),
      "problemDesc": $('#rejectedReasonJD').val(),
      "latestUpdateMan": "admin",
      "orderNo": this.JDorderNo,
      "saleNo": this.JDsaleNo,
      "deduction": deductionJD
    }
    this.httpclient.post(subrjdurl, subrjdparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $("#modal_plusjd").modal('hide');
          $("#submit_jdreturn").modal('hide');
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