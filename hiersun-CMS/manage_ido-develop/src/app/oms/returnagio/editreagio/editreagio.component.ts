import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-editreagio',
  templateUrl: './editreagio.component.html',
  styleUrls: ['./editreagio.component.css']
})
export class EditreagioComponent implements OnInit {
  @Output() private outer = new EventEmitter<string>();
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  public agioItem: any;
  refundWayList = [];//退款介质
  editItemList = [];//退差价详情
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) {

  }
  ngOnInit() {
    this.isload = true;
  }
  initEditAgio(agioItem) {
    this.refundWayList = [
      { "wayCode": 1, "wayName": "支付宝" },
      { "wayCode": 2, "wayName": "微信" },
      { "wayCode": 3, "wayName": "银联" }
    ];
    this.editItemList = [];
    this.agioItem = agioItem;
    // $("#editRefWay").val(agioItem.refundWay);
    this.editItemList.push(agioItem);
    // var billNo = agioItem.billNo
    // var selecturl = '/oms-admin/refundDifference/selectByPage';
    // var seleparams = {
    //   "currentPage": 1,
    //   "pageSize": 10,
    //   "billNo": billNo
    // }
    // this.httpclient.post(selecturl, seleparams, this.httpOptions).subscribe(
    //   res => {
    //     this.isload = true;
    //     if (res['code'] == 200) {
    //       this.editItemList = res['data']['list'];
    //       var refundWay = res['data']['list'][0]['refundWay'];
    //     } else {
    //       this.showWarnWindow(true, res['desc'], "warning");
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err.error);
    //   });
    $('#modal_editag').modal('show');
  }
  normalInputChange(event) {
    const reg = new RegExp("^[0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 保存
  subEditAgio(status) {
    var saleAmount = this.agioItem['saleAmount'],
      refundAmount = $('#editRefAmount').val(),
      refundWay = $('#editRefWay').val(),
      bankNo = $('#editbankNo').val(),
      bankName = $('#editbankName').val();

    if (refundAmount > saleAmount) {
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
    this.agioItem['refundAmount'] = refundAmount;
    this.agioItem['refundWay'] = refundWay;
    this.agioItem['bankNo'] = bankNo;
    this.agioItem['bankName'] = bankName;
    this.agioItem['billStatus'] = status;
    this.isload = false;
    var editurl = '/oms-admin/refundDifference/updateRefundDifference'
    // var editparams = {

    // }
    this.httpclient.post(editurl, this.agioItem, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $('#modal_editag').modal('hide');
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
