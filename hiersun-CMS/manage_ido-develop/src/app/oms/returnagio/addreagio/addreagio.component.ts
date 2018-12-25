import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-addreagio',
  templateUrl: './addreagio.component.html',
  styleUrls: ['./addreagio.component.css']
})
export class AddreagioComponent implements OnInit {
  @Output() private outer = new EventEmitter<string>();
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  isHintSucc = false;
  prefixList = [];//模糊查询列表
  orderNo: any;//订单号
  saleAmount=0;//销售金额
  saleNum=0;;//销售数量
  saleItemNo: any;//明细号
  selectList: Array<any>;//列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) {

  }


  ngOnInit() {
    this.isload = true;
  }
  initReturnAgio() {
    this.isHintSucc = false;
    // 清空
    $('input').val('')
    $('select').val('')
    this.selectList = [];
    $('#modal_reagio').modal('show');
  }

  completeSearch(event) {
    this.prefixList = [];
    var that = this;
    var prefix = event.target.value;
    console.log(prefix);

    if (prefix != '') {
      // this.prefixList = [];
      $('#addOrderNo').typeahead({
        source: function (query, process) {
          console.log(query)
          var preurl = `/oms-admin/order/orderdatalist?orderNo=${query}`;
          return that.httpclient.get(preurl).subscribe(
            res => {
              if (res['code'] == 200) {
                var datalist = res['data']
                datalist.forEach(element => {
                  that.prefixList.push(element['orderNo']);
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
    var orderNo = $.trim($(event.target).val());
    orderNo ? this.loadOrderList(orderNo) : this.showWarnWindow(true, "请输入订单号", 'warning');
  }
  loadOrderList(orderNo) {
    this.isload = false;
    this.saleNum = 0;
    this.saleAmount = 0;
    var itemurl = "/oms-admin/order/queryOrderItemList";
    var itemParams = {
      "orderNo": orderNo
    }
    var that=this;
    this.httpclient.post(itemurl, itemParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] = 200) {
          this.isHintSucc = true;
          this.isload = true;
          this.selectList = res['data']['orderItemList'];
          this.orderNo = orderNo;
          this.selectList.forEach((element) => {       
            that.saleNum += Number(element.saleSum);
            that.saleAmount += Number(element.paymentAmount);
          })
        } else {
          this.orderNo = "";
          this.saleNum = 0;
          this.saleAmount = 0;
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 选中的内容
  // chedkedRadio(itemObj) {
  //   this.saleAmount = itemObj.paymentAmount;
  //   this.saleNum = itemObj.saleNum;
  //   this.saleItemNo = itemObj.orderItemNo;
  // }
  normalInputChange(event) {
    const reg = new RegExp("^[0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 提交保存
  subReturnAgio(billstatus) {
    var orderNo = this.orderNo,
      refundAmount = Number($('#refundAmount').val()),
      refundWay = $('#refundWay').val(),
      bankNo = $('#bankNo').val(),
      bankName = $('#bankName').val();
    if (!orderNo) {
      this.showWarnWindow(true, "请输入订单号", "warning");
      return
    }
    // if (!this.saleItemNo) {
    //   this.showWarnWindow(true, "请选择订单", "warning");
    //   return
    // }
    if (refundAmount > this.saleAmount) {
      this.showWarnWindow(true, "退款金额不能大于支付金额", "warning");
      return
    }
    if (!refundAmount) {
      this.showWarnWindow(true, "请输入退款金额", "warning");
      return
    }
    if (!refundWay) {
      this.showWarnWindow(true, "请选择退款介质", "warning");
      return
    }
    if (!bankNo) {
      this.showWarnWindow(true, "请输入账号", "warning");
      return
    }
    
    console.log(this.saleNum,this.saleAmount);
    
    var subUrl = '/oms-admin/refundDifference/saveRefundDifference';
    var subparams = {
      "orderNo": orderNo,
      "refundAmount": refundAmount,
      "refundWay": refundWay,
      "bankNo": bankNo,
      "bankName": bankName,
      "saleAmount": this.saleAmount,
      "saleNum": this.saleNum,
      "saleItemNo": this.saleItemNo,
      "createUser": "admin",
      "billstatus": billstatus
    }
    this.httpclient.post(subUrl, subparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $('#modal_reagio').modal('hide');
          // 刷新父组件的页面
          this.outer.emit();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
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
