import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-giftmodal',
  templateUrl: './giftmodal.component.html',
  styleUrls: ['./giftmodal.component.css']
})
export class GiftmodalComponent implements OnInit {
  @Output() private giftItemObj = new EventEmitter<Object>()
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotalm = 1;//总页数
  public currentpagem = 1//当前页码
  public giftsTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  checkedObj = {};
  giftsList = [];//赠品信息列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }


  ngOnInit() {
    this.isload = true;
  }
  loadModal() {
    this.checkedObj = {};
    $('#modal_gifts').modal('show');
    $("#receptName").val("");
    $("#receptPhone").val("");
    $('#receptAddress').val("");
    this.loadGiftsList();
  }
  // 赠品信息列表
  loadGiftsList() {
    this.isload = false;
    var that = this;
    var barCode = $('#barCode').val();
    const gifturl = '/oms-admin/gift-order/gifts';
    const params = new HttpParams()
      .set('currentPage', `${this.pageNum}`)
      .set('pageSize', "10")
      .set('barCode', barCode)
    this.httpclient.get(gifturl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.giftsList = res['data']['list'];
          this.currentpagem = res['data']['currentPage'];
          this.pagetotalm = res['data']['pageTotal'];
          this.giftsTotal = this.giftsList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination2').pagination({
          currentPage: this.currentpagem,
          totalPage: this.pagetotalm,
          callback: function (current: number) {
            that.pageNum = current;
            that.loadGiftsList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 选中的内容
  chedkedRadio(itemObj: Object) {
    this.checkedObj['supplyProductName'] = itemObj['productName'];
    this.checkedObj['supplyProductNo'] = itemObj['barcode'];
    this.checkedObj['spuNo'] = itemObj['productCode'];
    this.checkedObj['skuNo'] = itemObj['proDetailCode'];
    this.checkedObj['brandName'] = itemObj['brandName'];
    this.checkedObj['shopName'] = itemObj['storeName'];
    this.checkedObj['pictureUrl'] = itemObj['proDetailPictureUrl'];
    this.giftItemObj.emit(this.checkedObj);
    $("#modal_gifts").modal("hide");
  }
  //确定 
  // selectGiftItem() {

  // }
  /**
* 全局弹窗
*/
  showWarnWindow(status, warnMsg, btnType) {
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
