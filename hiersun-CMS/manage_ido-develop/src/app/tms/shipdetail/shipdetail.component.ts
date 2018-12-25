import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-shipdetail',
  templateUrl: './shipdetail.component.html',
  styleUrls: ['./shipdetail.component.css']
})
export class ShipdetailComponent implements OnInit {
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
  logisticsHistory = [];//物流信息
  storeList: any;   //门店列表
  wuliuname: any;
  wuliunum: any;
  wuliustatus: any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.loadSourceList();
    this.loadStoreList()
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
  // 加载门店
  loadStoreList() {
    this.isload = false;
    var storeUrl = "/pcm-inner/org/findstorelist";
    this.httpclient.get(storeUrl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.storeList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 单条销售单查询
  initDeliversMes(delivetyNo) {
    this.delivetyNo = delivetyNo;
    $("#modal_delivety").modal('show');
    var dslUrl = '/tms-admin/deliverOrder/selectDeliverOrder';
    var deliverOrderPara = {
      "currentPage": 1,
      "pageSize": 10,
      "delivetyNo": this.delivetyNo
    };
    this.httpclient.post(dslUrl, deliverOrderPara, this.httpOptions).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['code'] == 200) {
          if(res['data'].content.length>0){
            this.detailSaleList = res['data'].content;
          }
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
    var siUrl = '/tms-admin/deliverOrder/query-sale-item?deliverNo=' + delivetyNo;
    this.httpclient.get(siUrl).subscribe(
      res => {
        console.log(res)
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
    let that = this;
    $(".plus_table").remove();
    this.isload = false;
    var packUrl = '/tms-admin/logistics/details?deliverNo=' + delivetyNo;
    this.httpclient.get(packUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['code'] == 200) {
          //this.salepackageList = res['data'];
          console.log(res['data'])
          that.wuliuname = res['data'].logisticsCompanyName;
          if (res['data'].logistics != null) {
            that.wuliunum = res['data'].logistics.mailNo;
            if (res['data'].logistics.state == 0) { //0在途中、1已揽收、2疑难、3已签收、4退签、5同城派送中、6退回、7转单
              that.wuliustatus = "在途中"
            } else if (res['data'].logistics.state == 1) {
              that.wuliustatus = "已揽收"
            } else if (res['data'].logistics.state == 2) {
              that.wuliustatus = "疑难"
            } else if (res['data'].logistics.state == 3) {
              that.wuliustatus = "已签收"
            } else if (res['data'].logistics.state == 4) {
              that.wuliustatus = "退签"
            } else if (res['data'].logistics.state == 5) {
              that.wuliustatus = "同城派送中"
            } else if (res['data'].logistics.state == 6) {
              that.wuliustatus = "退回"
            } else if (res['data'].logistics.state == 7) {
              that.wuliustatus = "转单"
            }
          }
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
    let that = this;
    this.isload = false;
    console.log(that.delivetyNo)
    const orderurl = '/tms-admin/logistics/details?deliverNo=' + that.delivetyNo;
    this.httpclient.get(orderurl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          if(res['data'].logisticsDetails!=null){
            this.deliveryDetailList = res['data'].logisticsDetails;
          }
          if(res['data'].logisticsHistory!=null){
            this.logisticsHistory = res['data'].logisticsHistory;
          }
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
