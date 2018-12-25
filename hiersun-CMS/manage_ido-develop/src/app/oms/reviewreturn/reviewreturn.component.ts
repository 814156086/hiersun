import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-reviewreturn',
  templateUrl: './reviewreturn.component.html',
  styleUrls: ['./reviewreturn.component.css']
})
export class ReviewreturnComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false;//是否加载
  public refundApplyNo: any;//退货申请单号
  public proList = [];//退货商品和数量
  public refundMesg: RefundInfo;//退货详情
  public fare = 0;//运费
  public isFare = 0;//显示运费
  public products: any;
  public giftList: Array<any> = [];
  public deduList = []//退款扣费列表
  public deductionList = [];//退款原因
  public sellPayments = [];//退货扣款
  public deduAmount = 0;//扣款金额合计
  // public quan: any;
  // public refundStatus: any;
  public channel: any;
  // public barCode: any;
  // public shopNo: any;
  // public skuNo: any;
  public botflag: any;//退货申请单管理跳转
  public billOrderList: Array<any>;//工单信息
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.refundApplyNo = queryParams.refundApplyNo;
      // this.quan = queryParams.quan;
      // this.refundStatus = queryParams.refundStatus;
      // this.channel = queryParams.channel;
      // this.barCode = queryParams.barCode;
      // this.shopNo = queryParams.shopNo;
      // this.skuNo = queryParams.skuNo;
      this.botflag = queryParams.botflag;
    });
  }

  ngOnInit() {
    this.refundMesg = new RefundInfo(0, 0, 0, 0, 0, '', '', '');//退货详情
    this.loadRefundInfo(this.refundApplyNo);
    this.deductionList = [
      { "deduType": "ZKKH", "deduName": "折扣扣回" },
      { "deduType": "YFKH", "deduName": "运费扣回" },
      { "deduType": "DKKH", "deduName": "抵扣扣回" },
      { "deduType": "FQKH", "deduName": "返券扣回" },
      { "deduType": "JFKH", "deduName": "积分扣回" },
      { "deduType": "YQKH", "deduName": "用券扣回" },
      { "deduType": "QTKH", "deduName": "其它扣回" }
    ]
  }
  loadRefundInfo(refundApplyNo) {
    this.isload = false;
    var refurl = '/oms-admin/refundApply/selectRefundApplyPage';
    var refparams = {
      "refundApplyNo": refundApplyNo
    }
    this.httpclient.post(refurl, refparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.proList = res['data']['list'];
          this.products = res['data']['list'][0]['products'];
          this.channel = res['data']['list'][0]['channel'];
          this.giftList = this.products ? this.products.filter((i, v) => i.isGift == '1') : [];
          this.refundMesg = res['data']['list'][0];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
    this.loadBillList(refundApplyNo);
  }
  // 差价工单分摊
  loadBillList(refundApplyNo) { 
    var billUrl = '/oms-admin/refundDifference/selectApportionByApplyNo';
    var billParams = {
      "refundApplyNo":refundApplyNo
    }
    this.httpclient.post(billUrl, billParams, this.httpOptions).subscribe(
      res => { 
        if (res['code']==200) { 
          this.billOrderList=res['data']
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 提交快递
  subDelivery() {
    this.isload = false;
    var delurl = '/oms-admin/refundApply/updateRefundApply';
    var delparams = {
      "refundApplyNo": this.refundApplyNo,
      "courierNumber": $('#courierNumber').val(),
      "expressCompanyName": $('#expressCompanyName').val(),
      "warehouseAddress": $('#warehouseAddress').val()
    }
    this.httpclient.post(delurl, delparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.route.navigate(['oms/returnrequest/2']);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  // 退货扣款
  normalInputChange(event) {
    // 输入小数，控制小数点后两位显示
    event.target.value = (/^\d+\.?\d{0,2}$/).test(event.target.value) ? event.target.value : '';
  }
  countAmount() {
    // console.log(event.target.value)
    // this.deduAmount += Number(event.target.value);
    if (this.deduList.length > 0) {
      this.deduAmount = 0;
      var trList = $(".alldeli").find('.deliItem');
      trList.each((trindex, tritem) => {
        var tdArr = trList.eq(trindex).find("td");
        var deduNum = tdArr.eq(1).find('input').val();
        this.deduAmount += Number(deduNum);
        var needRefundAmount = Number(this.refundMesg.needRefundAmount);
        if (this.deduAmount > needRefundAmount) {
          this.showWarnWindow(true, "扣款金额合计不能大于实退款金额", "warning");
        }
      })
    }
  }
  // 删除扣款
  delItem(dukey) {
    // deduList
    this.deduList.splice(dukey, 1);
    var amout = Number($(`.dedu_${dukey}`).val())
    this.deduAmount -= amout;
  }
  // 添加扣款
  addItem() {
    if (this.deduList.length <= 6) {
      this.deduList.push({
      })
    }
  }
  // 获取生成的表格信息
  loadDeduInfo() {
    if (this.deduList.length > 0) {
      var trList = $(".alldeli").find('.deliItem');
      var deduSelect = [];
      trList.each((trindex, tritem) => {
        var tdArr = trList.eq(trindex).find("td");
        var deduItem = tdArr.eq(0).find('select').find("option:selected").val();
        var deduNum = tdArr.eq(1).find('input').val();
        var deduDesc = tdArr.eq(2).find('input').val();
        var money = (deduItem == 'FQKH' || deduItem == 'JFKH' || deduItem == 'YQKH') ? 0 : -1 * deduNum
        deduSelect.push({
          "payType": deduItem,
          "payCode": deduItem,
          "amount": -1 * deduNum,
          "money": money,
          "deduDesc": deduDesc,
        });
      })
      deduSelect.every((i, v) => i.payCode != '') && deduSelect.every((i, v) => i.amount != '')
        ? this.sellPayments = deduSelect
        : this.showWarnWindow(true, "退货扣款存在未填选项", "warning");
    } else {
      this.showWarnWindow(true, "退货扣款不能为空", "warning");
      return
    }
  }

  setFare() {
    this.isFare = 1;
  }
  vertify() {
    var fare = Number($('.refundfare').val());
    var returnFee = this.refundMesg.returnShippingFee;
    if (fare == 0) {
      this.showWarnWindow(true, " 应退运费金额输入不能为0", "warning");
      return
    }
    if (fare > returnFee) {
      this.showWarnWindow(true, " 应退运费金额输入不能大于订单支付运费金额", "warning");
      return
    }
    this.fare = fare;
  }

  hideFare() {
    this.isFare = 0;
    this.fare = 0;
  }

  // 审核通过
  approved(refundStatus) {
    this.loadDeduInfo();
    var needRefundAmount = Number(this.refundMesg.needRefundAmount);
    if (this.deduAmount > needRefundAmount) {
      this.showWarnWindow(true, "扣款金额合计不能大于实退款金额", "warning");
      return
    }
    var billDetail = {
      "billNo": this.refundApplyNo,
      "channel": this.channel,
      "sellDetails": [{
        "originalBillno": this.refundMesg.orderNo
      }],
      "sellPayments": this.sellPayments
    }
    this.isload = false;
    var arvurl = '/oms-admin/refundApply/salereturnAffirmreturn';
    var arvparams = {
      "refundApplyNo": this.refundApplyNo,
      "quan": this.refundMesg.quanAmount,
      "refundStatus": refundStatus,
      "returnShippingFee": this.fare,
      "billDetail": billDetail
      // "shopNo": this.products.shopNo,
      // "products": [{
      //   'barCode': this.barCode,
      //   "shopNo": this.shopNo,
      //   "skuNo": this.skuNo
      // }]
      // "products": this.products
    }
    this.httpclient.post(arvurl, arvparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.route.navigate(['oms/returnrequest/2']);
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        this.showWarnWindow(true, err['error']['message'], "warning");
      });
  }
  // 取消
  goBack() {
    window.history.go(-1);
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
    this.isload = true;
  }

}
export class RefundInfo {
  constructor(
    public refundAmount: any,
    public needRefundAmount: any,
    public quanAmount: any,
    public returnShippingFee: any,
    public orderNo: any,
    public courierNumber: any,
    public expressCompanyName: any,
    public warehouseAddress: any,
    // public refundAmount:String,
  ) {
  }
}