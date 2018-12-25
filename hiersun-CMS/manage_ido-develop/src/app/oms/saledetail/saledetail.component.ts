import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
// import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-saledetail',
  templateUrl: './saledetail.component.html',
  styleUrls: ['./saledetail.component.css']
})
export class SaledetailComponent implements OnInit {
  // @ViewChild('tradedetail') tradedetail
  @Output() private outer = new EventEmitter<string>();
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public sourceList = [];//销售单来源
  public detailSaleList = [];//销售单详情单个列表
  public saleNo: any;//销售单号
  public saleItemList = [];//销售单明细
  public propNameList = [];//订单明细动态表头  
  public salepackageList = [];//包裹记录
  public salepayList = [];//发票记录
  public saleInvoiceList = [];//发票记录
  public remarkList = [];//客服备注
  public returnOrderList = [];//历史记录
  public saleHisList = [];//历史记录
  delComName: any;//物流名称
  packageNo: any;//物流单号
  packageStatusDesc: any;//物流状态
  public salesMenuList = [];//销售详情菜单
  public hasChild = false;//是否子订单tab显示
  public isRemarks = 1;//客服备注 销售管理下销售单 不要客服备注
  proTypeList = [];
  public deliveryList = [];//配送记录
  isDveryFlag = false;//物流信息 区分商品行和物流跟踪
  sdeliveryDetailList = [];//折叠物流信息
  sdveryItemList = [];//物流信息商品行
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.loadSourceList();
    this.loadProTypeCode();
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
  //加载产品类型 
  loadProTypeCode() {
    var brdurl = '/pcm-admin/dict/dicts/productType';
    this.httpclient.get(brdurl, this.httpOptions).subscribe(res => {
      if (res['code'] == 200) {
        this.proTypeList = res['data'];
      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  // 单条销售单查询
  initSalesMes(saleNo, isRemarks) {
    this.isload = false;
    this.hasChild = false;
    this.salesMenuList = [];
    this.saleNo = saleNo;
    this.isRemarks = isRemarks;
    $("#modal_sale").modal('show');
    var dslUrl = '/oms-admin/sale/querySalePageList';
    var dslParams = {
      "currentPage": 1,
      "pageSize": 10,
      "saleNo": this.saleNo
    };
    this.httpclient.post(dslUrl, dslParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.detailSaleList = res['data']['list'];
          var saleNo1 = this.detailSaleList.length ? this.detailSaleList[0]['saleNo'] : '';
          this.salesMenuList.push({
            "saleNo": saleNo1,
            "menuType": "Master",
            "menuName": '主订单'
          })
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.stab_1').click().addClass("active");
    if (this.saleNo) {
      this.loadSaleItem(this.saleNo);
      this.loadChildSale(this.saleNo);
    }
  }
  // 主销售单信息
  loadMasterSales(menuType, saleNo, menukey) {
    this.isload = false;
    $(`.menu_${menukey}`).parent('li').addClass("active");
    $(`.menu_${menukey}`).parent('li').siblings().removeClass("active");
    this.hasChild = menuType == "Master" ? false : true;
    this.detailSaleList = [];
    this.saleNo = saleNo;
    var dtlUrl = '/oms-admin/sale/querySalePageList';
    var dtlParams = {
      "currentPage": 1,
      "pageSize": 10,
      "saleNo": this.saleNo
    };
    this.httpclient.post(dtlUrl, dtlParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
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
    this.loadSaleItem(this.saleNo);
  }
  // 子订单信息
  loadChildSale(saleNo) {
    this.isload = false;
    this.saleNo = saleNo;
    // this.detailOrderList = [];
    var childUrl = '/oms-admin/sale/queryChildSale';
    var childParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(childUrl, childParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          res['data'].forEach((value, index) => {
            var num = Number(index);
            this.salesMenuList.push({
              "saleNo": value['saleNo'],
              "menuType": "Non-master",
              "menuName": `子订单${num + 1}`
            })
          })
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    // $('.otab_1').click().addClass("active");
    // this.loadOrderItem(this.orderNo);
  }
  // 销售单商品明细
  loadSaleItem(saleNo) {
    // $(".plus_table").remove();
    this.isload = false;
    var siUrl = '/oms-admin/sale/querySaleItem';
    var siParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(siUrl, siParams, this.httpOptions).subscribe(
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
  // 销售单明细
  detailSales(e, sItemNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      console.log("隐藏内容")
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      console.log("显示内容")
    }
  }
  querySaleItem(e, sItemNo) {

  }
  // 支付介质分摊信息
  loadSalePayInfo(saleNo) {
    this.isload = false;
    var salepayUrl = '/oms-admin/sale/querySalePayments';
    var salepayParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(salepayUrl, salepayParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.salepayList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  loadDeliveryInfo(saleNo) {
    this.isload = false;
    this.saleNo = saleNo;
    var delvUrl = '/oms-admin/sale/querySalePageList';
    var delvParams = {
      "currentPage": 1,
      "pageSize": 10,
      "saleNo": this.saleNo
    };
    this.httpclient.post(delvUrl, delvParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.deliveryList = res['data']['list'];
          console.log(this.deliveryList);
          
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    // 加载包裹信息,面板
    this.loadSalePackageInfo(this.saleNo);
  }
  // 包裹信息
  loadSalePackageInfo(saleNo) {
    $(".plus_table").remove();
    this.isload = false;
    var packUrl = '/oms-admin/package/selectListOmsPackage';
    var packParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(packUrl, packParams, this.httpOptions).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['code'] == 200) {
          this.salepackageList = res['data'];
          /* this.delComName=res['data'].delComName;
          this.packageNo=res['data'].packageNo;
          this.packageStatusDesc=res['data'].packageStatusDesc; */
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  loadDveryItem(pgNo) {
    this.isDveryFlag = false;
    this.isload = false;
    var pgUrl = '/oms-admin/package/queryPackageItem';
    var pgParams = {
      "packageNo": pgNo
    };
    this.httpclient.post(pgUrl, pgParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.sdveryItemList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载物流信息（时间轴）
  loadPackageItem(deliveryNo) {
    this.isload = false;
    const orderurl = '/oms-admin/package/queryPackageHistoryByOrderNo';
    const orderparams = {
      "deliveryNo": deliveryNo
    };
    this.httpclient.post(orderurl, orderparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        this.isDveryFlag = true;
        if (res['code'] == 200) {
          this.sdeliveryDetailList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
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
  // 发票信息
  loadSaleInvoiceInfo(saleNo) {
    this.isload = false;
    var saiUrl = '/oms-admin/sale/queryInvoice';
    var saiParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(saiUrl, saiParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saleInvoiceList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 会员信息
  loadSaleCustomerInfo(saleNo) {

  }
  // 退货信息
  loadRefundInfo(saleNo) {
    this.isload = false;
    var selecturl = '/oms-admin/refundApply/selectRefund';
    var selparams = {
      "currentPage": 1,
      "pageSize": 10,
      "originalSalesNo": saleNo
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.returnOrderList = res['data']['list'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 客服备注
  loadRemarkLog(saleNo: any) {
    this.isload = false;
    $('.remarkText').val("");
    var remarkUrl = '/oms-admin/remarklog/selectRemarkLog';
    var remarkParams = {
      "orderNo": saleNo
    };
    this.httpclient.post(remarkUrl, remarkParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.remarkList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  createRemarkLog() {
    this.isload = false;
    var createRemaUrl = '/oms-admin/remarklog/createRemarkLog';
    var remark = $('.remarkText').val();
    if (remark) {
      var createRemaParams = {
        "createMan": "admin",
        "fromSystem": "oms",
        "orderType": "Customer",
        "orderNo": this.saleNo,
        "remarkType": "string",
        "remark": remark
      };
    } else {
      this.showWarnWindow(true, '输入内容不能为空', 'warning');
      return;
    }

    this.httpclient.post(createRemaUrl, createRemaParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.loadRemarkLog(this.saleNo)
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 历史信息
  loadSaleHisInfo(saleNo) {
    this.isload = false;
    var shUrl = '/oms-admin/sale/querySaleHistory';
    var shParams = {
      "saleNo": saleNo
    };
    this.httpclient.post(shUrl, shParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.saleHisList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  getDetailShow(tid) {
    // this.tradedetail.detailShow(tid);
    this.outer.emit(tid);
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
