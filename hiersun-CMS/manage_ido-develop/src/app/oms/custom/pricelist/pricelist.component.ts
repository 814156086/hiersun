import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {
  @ViewChild('verifyprice') verifyprice
  @ViewChild('editform') editform
  @ViewChild('orderdetail') orderdetail
  @ViewChild('saledetail') saledetail
  @ViewChild('tradedetail') tradedetail
  storeList: Array<any> = [];//门店列表
  sourceList: Array<any> = [];//来源列表
  saStatusList: Array<any> = [];//销售单状态
  oTypeList: Array<any> = [];//订单类型
  salesList: Array<any> = [];//列表
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  // public orderList = [];//定做单列表列表

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    // this.loadFormList()
    $('#priceDate').daterangepicker({
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
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      // $('#payStatus').select2({
      //   placeholder: 'Select',
      //   allowClear: true
      // });
      $('#saleSource').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#saleStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      // $('#orderType').select2({
      //   placeholder: 'Select',
      //   allowClear: true
      // });
    }
    this.loadStoreList();
    this.loadSourceList();
    this.loadSaleStatus();
    this.loadOrderTypes();
    this.initSaleOrderInfo();
    this.isload = true;
  }
  // 门店信息
  loadStoreList() {
    this.isload = false;
    const url = '/pcm-admin/stores/all';
    const param = {
      "organizationCode": "",
      "storeType": 1
    };
    this.httpclient.post(url, param, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storeList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      });
  }
  // 加载销售单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if(res['code']==200){
          this.sourceList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载销售单状态
  loadSaleStatus() {
    this.isload = false;
    var saStatusUrl = "/oms-admin/dict/selectCodelist";
    var saStatusParams = {
      "typeValue": "sale_status"
    }
    this.httpclient.post(saStatusUrl, saStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saStatusList = res['data']
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  loadOrderTypes() {
    this.isload = false;
    var oStatusUrl = "/oms-admin/dict/selectCodelist";
    var oStatusParams = {
      "typeValue": "order_type"
    }
    this.httpclient.post(oStatusUrl, oStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.oTypeList = res['data']
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  //  查询销售单信息
  initSaleOrderInfo() {
    this.isload = false;
    var that = this;
    var startSaleTime = $('#priceDate').val().split('--')[0];
    var endSaleTime = $('#priceDate').val().split('--')[1];
    var saleurl = '/oms-admin/sale/querySalePageList';
    var saparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "startSaleTime": startSaleTime,
      "endSaleTime": endSaleTime,
      "orderNo": $('#orderNum').val(),
      "saleNo": $('#saleNum').val(),
      "outOrderNo": $('#outOrderNum').val(),
      "receptPhone": $('#receptPhone').val(),
      "accountNo": $('#accountNum').val(),
      "shopNo": $("#storeCode").select2('val'),
      "saleStatus": $('#saleStatus').select2('val'),
      "arrtibute1": "DJ,DZ",
      "payStatus": "5002,5004",
      "casherNo": $('#casherNum').val(),
      "saleSource": $('#saleSource').select2('val')
    };
    this.httpclient.post(saleurl, saparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.salesList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.salesList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initSaleOrderInfo();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 重置
  queryReset() {
    $('#saleDate').val("");
    $('#orderNum').val("");
    $('#saleNum').val("");
    $('#outOrderNum').val("");
    $('#receptPhone').val("");
    $('#accountNum').val("");
    $("#storeCode").select2("val", "");
    // $("#orderType").select2("val", "");
    $('#saleStatus').select2("val", "");
    // $('#payStatus').select2("val", "");
    $('#casherNum').val("");
    $('#saleSource').select2("val", "");
    this.pageNum = 1;
    // this.isload = true;
    // this.recordTotal = 0;
    this.initSaleOrderInfo();
  }
  // 销售单详情弹窗
  getSalesMes(saleNo,isRemark) {
    this.saledetail.initSalesMes(saleNo,isRemark);
  }

  // 订单详情弹窗
  getOrderMes(orderNo,isRemark) {
    this.orderdetail.initOrderMes(orderNo,isRemark);
  }
  // 外部订单号
  getDetailShow(tid) {
    this.tradedetail.detailShow(tid);
  }
  normalInputChange = function (event) {
    const reg = new RegExp(" ", "g");
    event.target.value = $.trim(event.target.value.replace(reg, ""));
  };
  // 查询定做单列表
  // loadFormList() {
  //   this.isload = false;
  //   var orderNo = $("#orderNo").val();
  //   var cusOrder = $("#cusOrder").val();
  //   var barcode = $("#barcode").val();
  //   var modelNo = $("#modelNo").val();
  //   var that = this;
  //   var selecturl = '/pcm-admin/price-order/list';
  //   var params = new HttpParams()
  //     .set("currentPage",`${this.pageNum}`)
  //     .set("pageSize","10")
  //     .set("orderNo",orderNo)
  //     .set("cusOrder",cusOrder)
  //     .set("barcode",barcode)
  //     .set("modelNo",modelNo)
  //   this.httpclient.get(selecturl, {params}).subscribe(
  //     res => {
  //       this.isload = true;
  //       if (res['code'] == 200) {
  //         this.orderList = res['data']['content'];
  //         this.currentpage = res['data']['currentPage'];
  //         this.pagetotal = res['data']['pageTotal'];
  //         this.recordTotal = this.orderList ? 1 : 0;
  //       } else {
  //         this.showWarnWindow(true, res['desc'], "warning");
  //       }
  //       $('#pagination1').pagination({
  //         currentPage: this.currentpage,
  //         totalPage: this.pagetotal,
  //         callback: function (current) {
  //           that.pageNum = current;
  //           that.loadFormList();
  //         }
  //       });
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     });
  // }

  // 重置
  // resetForm() {
  //   $("input").val("");
  //   this.pageNum = 1;
  //   this.loadFormList();
  // }


  // 查看详情
  detailForm(billNo, status,pid) {
    var cusStatus = cusStatus
    this.route.navigate(['oms/pricelist/detailform'], {
      queryParams: {
        billNo, status,pid
      }
    });
  }
  // 添加定做
  vetrifyModal(item) {
    this.verifyprice.initVerify(item)
  }
  // 编辑模板
  editForm(item) {
    this.editform.initInfo(item)
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
}
