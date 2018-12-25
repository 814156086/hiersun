import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-saleship',
  templateUrl: './saleship.component.html',
  styleUrls: ['./saleship.component.css']
})
export class SaleshipComponent implements OnInit {
  @ViewChild('saletdetail') saletdetail
  // @ViewChild('print') print
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  expComList: Array<any> = [];//快递公司
  storeList: Array<any> = [];//门店名称
  storageList: Array<any> = [];//门店名称
  shipSaleList: Array<any> = [];//发货单信息
  orderstatus: any;
  delivetyItemList: Array<any> = [];//发货单详情
  mergerorderarry = '';  //合单数组
  sourceList: any;   //订单来源
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    $('#saleTime').daterangepicker({
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
      $('#delivetyStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#saleStore').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#storageNum').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#expCompany').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadSourceList();
    this.loadorderstatus();
    this.loadExpCompanyList();
    this.loadStoreList();
    this.loadStorageList();
    this.initShipInfo();
    this.isload = true;
  }
  // 加载订单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        this.sourceList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 发货单状态
  loadorderstatus() {
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=delivety_status';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.orderstatus = res['data'].delivety_status
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载门店
  loadStoreList() {
    this.isload = false;
    var storeUrl = "/pcm-inner/org/findstorelist";
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.storeList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载快递公司
  loadExpCompanyList() {
    this.isload = false;
    var expUrl = "/tms-admin/tms/logisticsCompany/list";
    var exParams = {
      "unlimit": 1
    }
    this.httpclient.post(expUrl, exParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.expComList = res['data']['content'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载仓库
  loadStorageList() {
    this.isload = false;
    var stoUrl = "/tms-admin/tms/stores";
    var stParams = {
      "unlimit": 1
    }
    this.httpclient.post(stoUrl, stParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.storageList = res['data']['content'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 获取发货单信息
  initShipInfo() {
    this.isload = false;
    var that = this;
    var startSaleTime = '';
    var endSaleTime = ''
    if ($('#saleTime').val() == "") {
      startSaleTime = '';
      endSaleTime = ''
    } else {
      startSaleTime = $('#saleTime').val().split('--')[0];
      endSaleTime = $('#saleTime').val().split('--')[1];
    }
    var deoUrl = "/tms-admin/deliverOrder/selectDeliverOrder";
    var deoParams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "saleNo": $("#orderNo").val(),
      "delivetyNo": $("#delivetyNo").val(),
      "delivetyStatus": $("#delivetyStatus").select2('val'),
      "shopNo": $("#saleStore").select2('val'),
      "storageNum": $("#storageNum").select2('val'),
      "logisticsNo": $("#expCompany").select2('val'),
      "expressNo": $("#expressNo").val(),
      "receptPhone": $("#receptPhone").val(),
      "startTime": startSaleTime,
      "endTime": endSaleTime,
      "interceptStatus": "0",
      "mark":"0"
    }
    console.log(deoParams)
    this.httpclient.post(deoUrl, deoParams, this.httpOptions).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.shipSaleList = res['data']['content'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = res['data']['content'].length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initShipInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 重置
  queryReset() {
    $('input').val("");
    $("#delivetyStatus").select2('val', "");
    $("#saleStore").select2('val', "");
    $("#storageNum").select2('val', "");
    $("#expCompany").select2('val', "");
    this.pageNum = 1;
    this.initShipInfo();
  }
  // 加号
  detailPlus(delivetyNo) {
    this.getDeoItemInfo(delivetyNo);
  }
  getDeoItemInfo(delivetyNo) {
    var itemUrl = "/tms-admin/deliverOrder/selectDeliverOrderItem"
    var itemParams = {
      "delivetyNo": delivetyNo
    }
    this.httpclient.post(itemUrl, itemParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $("#modal_ship").modal('show');
          this.delivetyItemList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning")
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  closeMoadl() {
    var $span = $('.allList tr>:first-child span');
    if ($span.hasClass("glyphicon-minus")) {
      $span.addClass("glyphicon-plus");
      $span.removeClass("glyphicon-minus");
    }
  }
  // 发货
  submitShip() {
    var ships = [];
    const checkedRows = $('td input[name="checkbox_ship"]:checked').parents("tr");
    checkedRows.each((index, element) => {
      var sid = $($(element).children('td')[0]).attr('id');
      var delivetyNo = $($(element).children('.delivetyNo')).text();
      var salesItemNo = $($(element).children('.salesItem')).text();
      var qty = Number($($(element).children('.qty')).text());
      ships.push({
        "qty": qty,
        "sid": sid,
        "delivetyNo": delivetyNo,
        "salesItemNo": salesItemNo
      });
      // if (!qty) {
      //   this.showWarnWindow(true, "可发货数量为0", "warning");
      //   return
      // }
    })
    if (!ships.length) {
      this.showWarnWindow(true, "请选择发货单！", "warning");
      return;
    }
    var subUrl = "/tms-admin/deliverOrder/splitDeliver";
    this.httpclient.post(subUrl, ships, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $("#modal_ship").modal('hide');
          this.showWarnWindow(true, "拆分成功！", "success");
          this.initShipInfo();
        } else {
          this.showWarnWindow(true, res['desc'], "warning")
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  getDelivesMes(delivetyNo) {
    this.saletdetail.initDeliversMes(delivetyNo);
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
  //全选
  allchoose() {
    let that = this;
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderIds']").attr("checked", "checked");
    } else {
      $("input[name='orderIds']").attr("checked", false)
    }

  }
  //获取选中的订单号
  clickme() {
    let that = this;
    var orderlistno = '';
    $("input[name='orderIds']:checked").each(function (i, item) {
      orderlistno = $(this).val();
    })
    that.mergerorderarry += orderlistno + ',';
  }
  //打印
  /*prindorder() {
    var checkoutlength = $("input[name='orderIds']:checked").length;
    if (checkoutlength < 1) {
      this.showWarnWindow(true, '请至少选择一个订单哦!', "warning")
    } else {
      var orderarry = [];
      $("input[name='orderIds']:checked").each(function (i) {
        orderarry[i] = $(this).val();
      });
      this.print.printorder(orderarry);
    }
  }*/
  //合单
  /*mergeorder() {
    let that = this;
    var checkoutlength = $("input[name='orderIds']:checked").length;
    if (checkoutlength <= 1) {
      this.showWarnWindow(true, '至少选择两个订单哦!', "warning")
    } else {
      var orderarry = [];
      orderarry.push(that.mergerorderarry)
      console.log(orderarry)
      /!*  var itemUrl = "/tms-admin/deliverOrder/mergeDeliverOrder"
       var deliverOrderParas= {

       }
       this.httpclient.post(itemUrl, deliverOrderParas, this.httpOptions).subscribe(
         res => {
           console.log(res)
           if (res['code'] == 200) {

           } else {
             this.showWarnWindow(true,res['desc'],"warning")
           }
         },
         (err: HttpErrorResponse) => {
           console.log(err.error);
         }
       ) *!/
    }
  }*/
  //拆单
  /*demolition() {
    var checkoutlength = $("input[name='orderIds']:checked").length;
    if (checkoutlength < 1) {
      this.showWarnWindow(true, '请选择订单!', "warning")
    } else if (checkoutlength > 1) {
      this.showWarnWindow(true, '只能选择一个订单哦!', "warning")
    } else {
      var checkourorderno = $("input[name='orderIds']:checked").val();
      this.detailPlus(checkourorderno)
    }

  }*/
  // 组波
  groupWave() {
    var waveUrl = "/tms-admin/waveOrder/saveGroupWave";
    var waveParams = {
      "beignNum": 10
    }
    this.httpclient.post(waveUrl, waveParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

}
