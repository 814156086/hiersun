import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-returndetail',
  templateUrl: './returndetail.component.html',
  styleUrls: ['./returndetail.component.css']
})
export class ReturndetailComponent implements OnInit {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public returnNo: any;//退货单号
  public returnOrderList = [];//退货单详情单个列表
  public refundItemList = [];//退货单明细
  public rebateList = [];//退款信息
  public refundHisList = [];//历史记录
  sourceList: Array<any> = [];//销售单来源
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.loadSourceList();
  }
  // 加载销售单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.sourceList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  initReturnMes(returnNo) {
    this.returnNo = returnNo;
    $("#modal_return").modal('show');
    var dslUrl = '/oms-admin/refundApply/selectRefund';
    var dslParams = {
      "currentPage": 1,
      "pageSize": 10,
      "refundNo": this.returnNo
    };
    this.httpclient.post(dslUrl, dslParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnOrderList = res['data']['list'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.rtab_1').click().addClass("active");
    this.loadReturnItem(this.returnNo);
  }
  // 退货商品明细
  loadReturnItem(returnNo) {
    $(".plus_table").remove();
    this.isload = false;
    var reUrl = '/oms-admin/refundApply/selectRefundItem';
    var reParams = {
      "saleNo": returnNo
    };
    this.httpclient.post(reUrl, reParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refundItemList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 退货单明细加号
  detailReturnItem(e, rItemNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.re${rItemNo}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryReturnPlus(e, rItemNo);
    }
  }
  queryReturnPlus(e, rItemNo) {
    var reta = `
    <tr role="row" class="odd">
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
      <td style="text-align: center;">——</td>
    </tr>`;
    var reHtml = `
  <tr class="re${rItemNo} plus_table">
    <td></td>
    <td colspan="9">
      <table class="table table-striped table-bordered table-hover dataTable">
        <thead>
          <tr>
            <th style="text-align: center;">商品行项目编码</th>
            <th style="text-align: center;">促销编码</th>
            <th style="text-align: center;">促销名称</th>
            <th style="text-align: center;">促销描述</th>
            <th style="text-align: center;">促销优惠分摊金额</th>
            <th style="text-align: center;">促销规则</th>
            <th style="text-align: center;">促销规则值</th>
            <th style="text-align: center;">分摊比例</th>
            <th style="text-align: center;">运费促销分摊</th>
          </tr>
        </thead>
        <tbody>
          ${reta}
        </tbody>
      </table>
    </td>
  </tr>`;
    $(e).parent().parent().after(reHtml);
  }
  // 退款信息
  loadRebateInfo(returnNo) {
    this.isload = false;
    var rhUrl = '/oms-admin/refundApply/selectRefundAndMon';
    var rhParams = {
      "currentPage": 1,
      "pageSize": 10,
      "refundNo": returnNo
    };
    this.httpclient.post(rhUrl, rhParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.rebateList = res['data']['list'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 历史信息
  loadHisInfo(returnNo) {
    this.isload = false;
    var rhUrl = '/oms-admin/refundApply/selectRefundHistory';
    var rhParams = {
      "saleNo": returnNo
    };
    this.httpclient.post(rhUrl, rhParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.refundHisList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
