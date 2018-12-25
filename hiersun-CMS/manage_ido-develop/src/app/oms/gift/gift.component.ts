import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {
  @ViewChild('reviewgift') reviewgift
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  storeList: Array<any> = [];//门店列表
  wotList: Array<any> = [];//工单类型列表
  public giftOrderList = [];//补赠品列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    if ($().select2) {
      $('#shopName').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadStoreList();
    this.loadWoStatus();
    this.initGiftWorkList();
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
  // 加载工单类型
  loadWoStatus() {
    this.isload = false;
    const woturl = '/oms-admin/dict/selectCodelist';
    const woparam = {
      "typeValue": "work_order_status "
    };
    this.httpclient.post(woturl, woparam, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.wotList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      });
  }

  initGiftWorkList() {
    this.isload = false;
    var that = this;
    var billNo = $('#billNo').val(),
      shopName = $("#shopName").select2('data').text == '请选择' ? '' : $("#shopName").select2('data').text,
      billStatus = $('#billStatus').val(),
      documentValue = $('#docValue').val();
    const selecturl = '/oms-admin/gift-order/list';
    const params = new HttpParams()
      .set('currentPage', `${this.pageNum}`)
      .set('pageSize', "10")
      .set('billNo', billNo)
      .set('shopName', shopName)
      .set('billStatus', billStatus)
      .set('documentValue', documentValue);
    this.httpclient.get(selecturl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.giftOrderList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal = this.giftOrderList.length ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initGiftWorkList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  resetGiftList() {
    $('#billNo').val('');
    $('#shopName').select2('val', '');
    $('#billStatus').val('');
    $('#docValue').val('');
    this.pageNum = 1;
    this.initGiftWorkList();
  }
  // 审核
  reviewGift(billNo,pid,status) {
    this.route.navigate(['oms/gift/reviewgift'], {
      queryParams: {
        billNo,pid,status
      }
    });
    // this.reviewgift.loadReviewModal(giftitem);
  }
  // 编辑
  editGift(billNo, billType, sid) {
    this.route.navigate(['oms/gift/editgift'], {
      queryParams: {
        billNo, billType, sid
      }
    });
  }
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
