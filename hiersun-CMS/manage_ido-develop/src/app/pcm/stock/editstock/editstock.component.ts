import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-editstock',
  templateUrl: './editstock.component.html',
  styleUrls: ['./editstock.component.css']
})
export class EditstockComponent implements OnInit {
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public spSid: any;//库存编码
  public stoId: any;//原门店编码
  public storeItemList = [];// 指定门店列表
  public numList = [];// 判断库存数量
  public storeList = [];// 所有门店列表
  public transList = [];// 转移库存显示列表
  public transferStockVos = [];// 转移库存保存列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.spSid = queryParams.spid;
      this.stoId = queryParams.stoId;
    });
  }

  ngOnInit() {
    if ($().select2) {
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    $('#skuCode').val(this.spSid);
    this.loadStoreItemList(this.spSid);//加载指定门店列表
    this.loadStoreList();//加载所有门店列表
    this.changeStore()
  }
  // 加载指定门店列表
  loadStoreItemList(spSid) {
    this.isload = false;
    var stoitemurl = "/pcm-admin/stock/get_current_stockInfos";
    var stoitemPa = {
      shoppeProSid: spSid
    };
    this.httpclient.post(stoitemurl, stoitemPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storeItemList = res['data'];
          this.numList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 门店列表
  loadStoreList() {
    this.isload = false;
    var storeurl = `/pcm-admin/stores/all`;
    var stoPa = {
      organizationCode: "",
      storeType: ""
    };
    this.httpclient.post(storeurl, stoPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storeList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 门店切换显示数量
  changeStore() {
    this.isload = false;
    var stoitemurl = "/pcm-admin/stock/get_current_stockInfos";
    var stoitemPa = {
      shoppeProSid: this.spSid,
      storeCode: $("#storeItemCode").val()
    }
    this.httpclient.post(stoitemurl, stoitemPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var proSum = res['data'][0]['proSum'];
          $('#proSum').val(proSum);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 添加库存
  addStock() {
    var that = this;
    var isAdd = true;
    var storeCodeOriginal = $("#storeItemCode").val();
    var storeCode = $('#storeCode').select2('val');
    var proSum = $('#proSum').val();
    var transNum = $('#transNum').val();
    if (storeCode == "") {
      isAdd = false;
      this.showWarnWindow(true, "转移门店不能为空!", "warning");
      return;
    }
    if (storeCodeOriginal == storeCode) {
      isAdd = false;
      this.showWarnWindow(true, "不能转移到同一个门店!", "warning");
      return;
    }
    if (transNum == "") {
      isAdd = false;
      this.showWarnWindow(true, "转移数量不能为空！", "warning");
      return;
    }
    if (transNum > proSum) {
      isAdd = false;
      this.showWarnWindow(true, "转移数量不能超过原有数量！", "warning");
      return;
    }
    this.numList.map((nitem, nindex) => {
      if (nitem.storeCode == storeCodeOriginal) {
        if (transNum > nitem.proSum) {
          isAdd = false;
          that.showWarnWindow(true, `最多只能转移${nitem.proSum}`, "warning");
          return;
        }
        nitem.proSum -= transNum;
      }
    })
    if (isAdd) {
      this.transList.push({
        "storeCodeOriginal": storeCodeOriginal,
        "storeNameOriginal": $("#storeItemCode").find("option:selected").text(),
        "stockCodeOriginal": $('#skuType').val(),
        "stockNameOriginal": $('#skuType').find("option:selected").text(),
        "storeCode": storeCode,
        "storeName": $('#storeCode').select2('data').text,
        "stockCode": $('#transCode').val(),
        "stockName": $('#transCode').find("option:selected").text(),
        "num": transNum
      })
      this.transferStockVos.push({
        "num": transNum,
        "channelSid": 0,
        "channelSidOriginal": 0,
        "storeCode": storeCode,
        "storeCodeOriginal": storeCodeOriginal
      })
    }
  }
  // 删除
  delStock(trankey, CodeOriginal, num) {
    this.transList.splice(trankey, 1);
    this.transferStockVos.splice(trankey, 1);
    this.numList.map((nitem, nindex) => {
      if (nitem.storeCode == CodeOriginal) {
        nitem.proSum = Number(nitem.proSum) + Number(num);
      }
    });
  }
  // 保存
  subStock() {
    this.isload = false;
    var suburl = "/pcm-admin/stock/transfer_stock";
    var subPa = {
      barcode: this.spSid,
      fromSystem: "OMSADMIN",
      transferStockVos: this.transferStockVos
    };
    this.httpclient.post(suburl, subPa, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, res['data']['resultMsg'], "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  goBack() {
    this.route.navigate(['/pcm/stock']);
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
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
