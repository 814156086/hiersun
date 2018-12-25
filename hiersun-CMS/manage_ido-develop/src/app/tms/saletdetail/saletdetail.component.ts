import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import {Component, OnInit} from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-saletdetail',
  templateUrl: './saletdetail.component.html',
  styleUrls: ['./saletdetail.component.css']
})
export class SaletdetailComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public sourceList = [];//销售单来源
  public detailSaleList = [];//销售单详情单个列表
  public delivetyNo: any;//销售单号
  public saleItemList = [];//销售单明细
  public propNameList = [];//订单明细动态表头
  public salepackageList = [];//包裹记录
  deliveryDetailList = [];//折叠物流信息
  wuliuname:any;
  wuliunum:any;
  wuliustatus:any;
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
        this.isload = true;
        this.sourceList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 单条销售单查询
  initDeliversMes(delivetyNo) {
    this.delivetyNo = delivetyNo;
    $("#modal_saletde").modal('show');
    var dslUrl = '/oms-admin/sale/querySalePageList';
    var dslParams = {
      "currentPage": 1,
      "pageSize": 10,
      "saleNo": this.delivetyNo
    };
    this.httpclient.post(dslUrl, dslParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.detailSaleList = res['data']['list'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.stab_1').click().addClass("active");
    this.loadSaleItem(this.delivetyNo);
  }
  // 销售单商品明细
  loadSaleItem(delivetyNo) {
    // $(".plus_table").remove();
    this.isload = false;
    var siUrl = '/tms-admin/deliverOrder/query-sale-item?deliverNo='+delivetyNo;
    this.httpclient.get(siUrl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saleItemList = res['data']['saleItemList'];
          this.propNameList = res['data']['propNameList'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 包裹信息
  loadSalePackageInfo(delivetyNo) {
    let that=this;
    $(".plus_table").remove();
    this.isload = false;
    var packUrl = '/tms-admin/logistics/details?deliverNo='+delivetyNo;
    this.httpclient.get(packUrl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          //this.salepackageList = res['data'];
          console.log(res['data'])
          that.wuliuname=res['data'].logisticsCompanyName;
          that.wuliunum=res['data'].logistics.mailNo;
          that.wuliustatus=res['data'].logistics.state;
          that.loadPackageItem();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 加载物流信息（时间轴）
  loadPackageItem() {
    let that=this;
    this.isload = false;
    console.log(that.delivetyNo)
    const orderurl = '/tms-admin/logistics/details?deliverNo='+that.delivetyNo;
    this.httpclient.get(orderurl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.deliveryDetailList = res['data'].logisticsDetails;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  detailPackageItem(e, pgNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.pg${pgNo}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryPackageItem(e, pgNo);
    }
  }
  queryPackageItem(e, pgNo) {
    var pgUrl = '/oms-admin/package/queryPackageItem';
    var pgParams = {
      "packageNo": pgNo
    };
    this.httpclient.post(pgUrl, pgParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        var pgList;
        if (res['code'] == 200) {
          pgList = res['data'];
          var pgta = "";
          pgList.map((pgItem, pgIndex) => {
            return pgta += `
              <tr>
                <td style="text-align: center;">${pgItem.packageNo}</td>
                <td style="text-align: center;">${pgItem.deliveryNo}</td>
                <td style="text-align: center;">${pgItem.saleNo}</td>
                <td style="text-align: center;">${pgItem.saleItemNo}</td>
                <td style="text-align: center;">${pgItem.saleNum}</td>
              </tr>`
          });
          var pgHtml = `
              <tr class="pg${pgNo} plus_table">
              <td></td>
              <td colspan="8">
                <table class="table table-striped table-bordered table-hover dataTable">
                  <thead>
                    <tr>
                      <th style="text-align: center;">内部交货单号</th>
                      <th style="text-align: center;">快递单号</th>
                      <th style="text-align: center;">销售单号</th>
                      <th style="text-align: center;">销售单明细号</th>
                      <th style="text-align: center;">数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pgta}
                  </tbody>
                </table>
              </td>
            </tr>`;
          $(e).parent().parent().after(pgHtml);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );

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
