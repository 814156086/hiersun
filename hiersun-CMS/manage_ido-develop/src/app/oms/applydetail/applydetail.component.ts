import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-applydetail',
  templateUrl: './applydetail.component.html',
  styleUrls: ['./applydetail.component.css']
})
export class ApplydetailComponent implements OnInit {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public applyNo: any;//退货申请单号
  public returnApplyList = [];//退货申请单详情单个列表
  public applyItemList = [];//退货申请单明细
  public applyHisList = [];//历史记录
  public refaList = [];//退货申请单状态
  // sourceList: Array<any> = [];//销售单来源
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.loadRefStatusList();
    this.isload=true
  }
    // 退货申请单单状态
    loadRefStatusList() {
      this.isload = false;
      var refsurl = '/oms-admin/dict/selectCodelist';
      var refsobj = {
        "typeValue": "refund_apply_status"
      }
      this.httpclient.post(refsurl, refsobj, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.refaList = res['data']
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      )
    }
  initApplyMes(applyNo) {
    this.applyNo = applyNo;
    $("#modal_apply").modal('show');
    var dslUrl = '/oms-admin/refundApply/selectRefundApplyPage';
    var dslParams = {
      "currentPage": 1,
      "pageSize": 10,
      "refundApplyNo": this.applyNo
    };
    this.httpclient.post(dslUrl, dslParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnApplyList = res['data']['list'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.applyrtab_1').click().addClass("active");
    this.loadApplyItem(this.applyNo);
  }
  // 退货申请单明细
  loadApplyItem(applyNo) {
    $(".plus_table").remove();
    this.isload = false;
    var reUrl = '/oms-admin/refundApply/getRefundItemByOrderNo';
    var reParams = {
      "applyNo": applyNo
    };
    this.httpclient.post(reUrl, reParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.applyItemList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
// 退货申请单明细加号
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
  // 历史信息
  loadHisInfo(applyNo) {
    this.isload = false;
    var rhUrl = '/oms-admin/refundApply/selectRefundApplyHistory';
    var rhParams = {
      "refundApplyNo": applyNo
    };
    this.httpclient.post(rhUrl, rhParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.applyHisList = res['data'];
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
