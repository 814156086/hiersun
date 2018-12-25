import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.css']
})
export class OrderdetailComponent implements OnInit {
  // @ViewChild('tradedetail') tradedetail
  @Output() private outer = new EventEmitter<string>();
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public detailOrderList = [];//订单详情单个列表
  public orderNo: any;//订单号
  public c2: any;//尾款单标志
  public oTypeList: Array<any> = [];//订单类型
  public orderItemList = [];//订单明细
  public sourceList = [];//订单来源
  public propNameList = [];//订单明细动态表头
  public detailSaleList = [];//销售单信息
  public payList = [];//订单支付记录
  public packageList = [];//包裹记录
  public invoiceList = [];//发票记录
  public deliveryList = [];//配送记录
  public orderHisList = [];//历史记录
  public remarkList = [];//客服备注
  public orderChildList = [];//尾款信息
  public orderMenuList = []//订单详情菜单
  public isChild = false;//是否子订单tab显示
  deliveryDetailList = [];//折叠物流信息
  isRemarko = 1;//客服备注 销售管理下的订单 不要客服备注
  proTypeList = [];//产品类型
  isDveryFlag = false;//物流信息 区分商品行和物流跟踪
  dveryItemList = [];//物流信息商品行
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.loadSourceList();
    this.loadProTypeCode();
    // this.loadOrderTypes();
  }
  // 加载订单来源
  loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.sourceList = res['data'];
        }
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
        console.log(this.proTypeList);

      } else {
        this.showWarnWindow(true, res['desc'], 'warning');
      }
    });
  }
  loadOrderTypes() {
    this.isload = false;
    var oStatusUrl = "/oms-admin/dict/selectCodelist";
    var oStatusParams = {
      "typeValue": "order_type"
    }
    this.httpclient.post(oStatusUrl, oStatusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.oTypeList = res['data']
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 订单号查询
  initOrderMes(orderNo, isRemarko) {
    this.isload = false;
    this.isChild = false;
    this.orderChildList = [];
    this.orderMenuList = [];
    this.orderNo = orderNo;
    this.isRemarko = isRemarko;
    $("#modal_order").modal('show');
    var dtlUrl = '/oms-admin/order/queryOrderPageList';
    var dtlParams = {
      "orderNo": this.orderNo
    };
    this.httpclient.post(dtlUrl, dtlParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.detailOrderList = res['data']['list'];
          var orderNo1 = this.detailOrderList.length ? this.detailOrderList[0]['orderNo'] : '';
          this.orderMenuList.push({
            "orderNo": orderNo1,
            "menuType": "Master",
            "menuName": '主订单'
          })
          // this.c2 = res['data']['list'][0]['c2'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.otab_1').click().addClass("active");
    if (this.orderNo) {
      this.loadOrderItem(this.orderNo);
      this.loadChildOrder(this.orderNo)
    }
  }
  // toggleOrder(menuType, orderNo) {
  //   this.loadMasterOrder(menuType, orderNo);
  //   menuType == "Master" ? this.loadMasterOrder(orderNo) : this.loadChildOrder(orderNo);
  // }
  // 主订单信息
  loadMasterOrder(menuType, orderNo, menukey) {
    this.isload = false;
    $(`.menu_${menukey}`).parent('li').addClass("active");
    $(`.menu_${menukey}`).parent('li').siblings().removeClass("active");
    this.isChild = menuType == "Master" ? false : true;
    this.detailOrderList = [];
    this.orderNo = orderNo;
    var dtlUrl = '/oms-admin/order/queryOrderPageList';
    var dtlParams = {
      "orderNo": this.orderNo
    };
    this.httpclient.post(dtlUrl, dtlParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.detailOrderList = res['data']['list'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    $('.otab_1').click().addClass("active");
    this.loadOrderItem(this.orderNo);
  }
  // 子订单信息
  loadChildOrder(orderNo) {
    this.isload = false;
    this.orderNo = orderNo;
    // this.detailOrderList = [];
    var childUrl = '/oms-admin/order/queryChildOrderByOrderNo';
    var childParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(childUrl, childParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          res['data'].forEach((value, index) => {
            var num = Number(index);
            this.orderMenuList.push({
              "orderNo": value['orderNo'],
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
  // 订单明细
  loadOrderItem(orderNo) {
    $(".plus_table").remove();
    this.isload = false;
    var dtlUrl = '/oms-admin/order/queryOrderItemList';
    var dtlParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(dtlUrl, dtlParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.orderItemList = res['data']['orderItemList'];
          this.propNameList = res['data']['propNameList'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 订单明细加号
  detailOrderItem(e, oItemNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.op${oItemNo}`).remove();
      $(`.ogs${oItemNo}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryOrderPromotion(e, oItemNo);
      this.queryOrderGetSplit(e, oItemNo);
    }
  }
  // 订单促销分摊明细
  queryOrderPromotion(e, oItemNo) {
    this.isload = false;
    var opUrl = '/oms-admin/order/queryOrderPromotionList';
    var opParams = {
      "orderItemNo": oItemNo
    };
    this.httpclient.post(opUrl, opParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        var opList;
        if (res['code'] == 200) {
          opList = res['data'];
          var opta = "";
          opList.map((opitem, opindex) => {
            return opta += `
          <tr role="row" class="odd">
            /*<td style="text-align: center;">${opitem.orderItemNo}</td>*/
            <td style="text-align: center;">${opitem.promotionCode}</td>
            <td style="text-align: center;">${opitem.promotionName}</td>
            <td style="text-align: center;">${opitem.promotionDesc}</td>
            <td style="text-align: center;">${opitem.promotionAmount}</td>
            <td style="text-align: center;">${opitem.promotionRule}</td>
            <td style="text-align: center;">${opitem.promotionRuleName}</td>
            <td style="text-align: center;">${opitem.splitRate}</td>
            <td style="text-align: center;">${opitem.freightAmount}</td>
          </tr>`
          })
          var opHtml = `
        <tr class="op${oItemNo} plus_table">
          <td></td>
          <td colspan="10">
            <table class="table table-striped table-bordered table-hover dataTable">
              <thead>
                <tr>
                  <!--<th style="text-align: center;">商品行项目编码</th>-->
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
                ${opta}
              </tbody>
            </table>
          </td>
        </tr>`;
          $(e).parent().parent().after(opHtml);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 订单反利分摊
  queryOrderGetSplit(e, oItemNo) {
    this.isload = false;
    var ogsUrl = '/oms-admin/order/queryOrderGetSplitList';
    var ogsParams = {
      "orderItemNo": oItemNo
    };
    this.httpclient.post(ogsUrl, ogsParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        var ogsList;
        if (res['code'] == 200) {
          ogsList = res['data'];
          var ogsta = "";
          ogsList.map((ogsitme, ogsindex) => {
            var deleteFlag = ogsitme.deleteFlag == 0 ? "未删除" : "已删除";
            return ogsta += `
          <tr>
            /*<td style="text-align: center;">${ogsitme.orderItemNo}</td>*/
            <td style="text-align: center;">${ogsitme.code}</td>
            <td style="text-align: center;">${ogsitme.name}</td>
            <td style="text-align: center;">${ogsitme.amount}</td>
            <td style="text-align: center;">${ogsitme.getType}</td>
            <td style="text-align: center;">${ogsitme.getChannel}</td>
            <td style="text-align: center;">${ogsitme.getTime}</td>
            <td style="text-align: center;">${ogsitme.couponBatch}</td>
            <td style="text-align: center;">${deleteFlag}</td>
          </tr>`
          })
          var ogsHtml = `
          <tr class="ogs${oItemNo} plus_table">
            <td></td>
            <td colspan="10">
              <table class="table table-striped table-bordered table-hover dataTable">
                <thead>
                  <tr>
                    <!--<th style="text-align: center;">商品行项目编码</th>-->
                    <th style="text-align: center;">返利编码</th>
                    <th style="text-align: center;">返利名称</th>
                    <th style="text-align: center;">返利值</th>
                    <th style="text-align: center;">返利类型</th>
                    <th style="text-align: center;">返利渠道</th>
                    <th style="text-align: center;">返利时间</th>
                    <th style="text-align: center;">券批次</th>
                    <th style="text-align: center;">删除标志</th>
                  </tr>
                </thead>
                <tbody>
                  ${ogsta}
                </tbody>
              </table>
            </td>
          </tr>`;
          $(e).parent().parent().after(ogsHtml);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 销售单信息
  loadSaleInfo(orderNo) {
    $(".plus_table").remove();
    this.isload = false;
    var dslUrl = '/oms-admin/order/querySaleByOrderNo';
    var dslParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(dslUrl, dslParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.detailSaleList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 加号
  detailSaleItem(e, sItemNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.ds${sItemNo}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.querySaleItem(e, sItemNo);
    }
  }
  querySaleItem(e, sItemNo) {
    this.isload = false;
    var siUrl = '/oms-admin/sale/querySaleItem';
    var siParams = {
      "saleNo": sItemNo
    };
    this.httpclient.post(siUrl, siParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        var dsList = [];
        var pnList = [];
        if (res['code'] == 200) {
          dsList = res['data']['saleItemList'];
          pnList = res['data']['propNameList'];
          var dsta = "";
          dsList.map((dsitem, dsindex) => {
            var isGift = dsitem.isGift == 0 ? "否" : "是";
            var salePropList = dsitem.salePropList;
            var spta = "";
            salePropList.map((spitem, spindex) => {
              var nspitem = spitem == null ? "/" : spitem
              return spta += `<td style="text-align: center;white-space: nowrap;">${nspitem}</td>`
            })
            var productType = this.proTypeList.filter((i, v) => i.code == dsitem.productType)[0]['name'];
            return dsta += `
            <tr>
            <td style="text-align: center;white-space: nowrap;">${dsitem.rowNo}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.spuNo ? dsitem.spuNo : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.skuNo ? dsitem.skuNo : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.barcode ? dsitem.barcode : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.shoppeProName ? dsitem.shoppeProName : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${productType ? productType : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.unit ? dsitem.unit : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.brandName ? dsitem.brandName : ''}</td>
            ${spta}
            <td style="text-align: center;white-space: nowrap;">${dsitem.standPrice ? dsitem.standPrice : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.salePrice ? dsitem.salePrice : ''}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.saleSum}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.refundNum}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.salePrice * dsitem.saleSum}</td>
            <td style="text-align: center;white-space: nowrap;">${isGift}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.shippingFeeSplit}</td>
            <td style="text-align: center;white-space: nowrap;">${dsitem.stockoutAmount}</td>
          </tr>
            `
          })
          var pnta = "";
          pnList.map((dsitem, dsindex) => {
            return pnta += `<th style="text-align: center;">${dsitem}</th>`
          })
          var dsHtml = `
          <tr class="ds${sItemNo} plus_table">
          <td></td>
          <td colspan="29">
            <table class="table table-striped table-bordered table-hover dataTable">
              <thead>
                <tr>
                  <th style="text-align: center;">行号</th>
                  <th style="text-align: center;">产品编码</th>
                  <th style="text-align: center;">SKU编号</th>
                  <th style="text-align: center;">条码编码</th>
                  <th style="text-align: center;">商品名称</th>
                  <th style="text-align: center;">商品类型</th>
                  <th style="text-align: center;">销售单位</th>
                  <th style="text-align: center;">品牌名称</th>
                  ${pnta}
                  <th style="text-align: center;">标准价</th>
                  <th style="text-align: center;">销售价</th>
                  <th style="text-align: center;">销售数量</th>
                  <th style="text-align: center;">可退数量</th>
                  <th style="text-align: center;">销售金额</th>
                  <th style="text-align: center;">是否为赠品</th>
                  <th style="text-align: center;">运费分摊</th>
                  <th style="text-align: center;">缺货数量</th>
                </tr>
              </thead>
              <tbody>
                ${dsta}
              </tbody>
            </table>
          </td>
        </tr>`;
          $(e).parent().parent().after(dsHtml);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 支付信息
  loadPayInfo(orderNo) {
    $(".plus_table").remove();
    this.isload = false;
    var payUrl = '/oms-admin/order/queryOrderPaymentList';
    var payParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(payUrl, payParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.payList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 订单支付明细
  detailPayItem(e, spayNo) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.pay${spayNo}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryPayItem(e, spayNo);
    }
  }
  queryPayItem(e, spayNo) {
    this.isload = false;
    var payPlusUrl = '/oms-admin/order/queryPaymentItemList';
    var payPlusParams = {
      "salesPaymentNo": spayNo
    };
    this.httpclient.post(payPlusUrl, payPlusParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        var payList;
        if (res['code'] == 200) {
          payList = res['data'];
          var payta = "";
          payList.map((payItem, payIndex) => {
            return payta += `
          <tr>
            <td style="text-align: center; white-space: nowrap;">${payItem.name ? payItem.name : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.amount ? payItem.amount : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.acturalAmount ? payItem.acturalAmount : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.rate ? payItem.rate : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.account ? payItem.account : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.userId ? payItem.userId : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.payFlowNo ? payItem.payFlowNo : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.couponType ? payItem.couponType : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.couponBatch ? payItem.couponBatch : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.couponName ? payItem.couponName : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.activityNo ? payItem.activityNo : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.couponRule ? payItem.couponRule : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.couponRuleName ? payItem.couponRuleName : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.cashBalance ? payItem.cashBalance : '——'}</td>
            <td style="text-align: center; white-space: nowrap;">${payItem.remark ? payItem.remark : '——'}</td>
          </tr>`
          })
          var payHtml = `
          <tr class="pay${spayNo} plus_table">
          <td></td>
          <td colspan="8">
            <table class="table table-striped table-bordered table-hover dataTable">
              <thead>
                <tr>
                  <!--<th style="text-align: center; white-space: nowrap;">款机流水号</th>-->
                  <th style="text-align: center; white-space: nowrap;">支付方式</th>
                  <th style="text-align: center; white-space: nowrap;">支付金额</th>
                  <th style="text-align: center; white-space: nowrap;">实际抵扣金额</th>
                  <th style="text-align: center; white-space: nowrap;">汇率(折现率)</th>
                  <th style="text-align: center; white-space: nowrap;">支付账号</th>
                  <th style="text-align: center; white-space: nowrap;">会员面卡号</th>
                  <th style="text-align: center; white-space: nowrap;">支付流水号</th>
                  <th style="text-align: center; white-space: nowrap;">优惠券类型</th>
                  <th style="text-align: center; white-space: nowrap;">优惠券批次</th>
                  <th style="text-align: center; white-space: nowrap;">券模板名称</th>
                  <th style="text-align: center; white-space: nowrap;">活动号</th>
                  <th style="text-align: center; white-space: nowrap;">收券规则</th>
                  <th style="text-align: center; white-space: nowrap;">收券规则描述</th>
                  <th style="text-align: center; white-space: nowrap;">结余</th>
                  <th style="text-align: center; white-space: nowrap;">备注</th>
                </tr>
              </thead>
              <tbody>
                ${payta}
              </tbody>
            </table>
          </td>
        </tr>`;
          $(e).parent().parent().after(payHtml);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
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
          this.dveryItemList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 发票信息
  loadInvoiceInfo(orderNo) {
    this.isload = false;
    var invUrl = '/oms-admin/order/queryInvoiceByOrderNo';
    var invParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(invUrl, invParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.invoiceList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 配送信息
  loadDeliveryInfo(orderNo) {
    this.isload = false;
    this.orderNo = orderNo;
    var delvUrl = '/oms-admin/order/queryOrderPageList';
    var delvParams = {
      "orderNo": this.orderNo
    };
    this.httpclient.post(delvUrl, delvParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.deliveryList = res['data']['list'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
    // 加载包裹信息,面板
    this.loadPackageInfo(this.orderNo);
  }
  // 包裹信息
  loadPackageInfo(orderNo) {
    // $(".plus_table").remove();
    this.isload = false;
    var packUrl = '/oms-admin/package/selectListOmsPackage';
    var packParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(packUrl, packParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.packageList = res['data'];
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
          this.deliveryDetailList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 会员信息
  loadCustomerInfo(orderNo) {

  }
  // 客服备注
  loadRemarkLog(orderNo: any) {
    this.isload = false;
    $('.remarkText').val("");
    var remarkUrl = '/oms-admin/remarklog/selectRemarkLog';
    var remarkParams = {
      "orderNo": orderNo
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
        "orderNo": this.orderNo,
        "remarkType": "string",
        "remark": remark,
      };
    } else {
      this.showWarnWindow(true, '输入内容不能为空', 'warning');
      return;
    }

    this.httpclient.post(createRemaUrl, createRemaParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.loadRemarkLog(this.orderNo)
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
  loadOrderHisInfo(orderNo) {
    this.isload = false;
    var hisUrl = '/oms-admin/order/queryOrderHisList';
    var hisParams = {
      "orderNo": orderNo
    };
    this.httpclient.post(hisUrl, hisParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.orderHisList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 外部订单号
  getDetailShow(tid) {
    this.outer.emit(tid);
    // this.tradedetail.detailShow(tid);
  }
  // 双击
  // dblLoadOrder(e) {
  //   // console.log(e,$(e),$(e.target).parents('tr').find('.tab_first').text());
  //   var dblorder = $(e.target).parents('tr').find('.tab_first').text();
  //   $('.otab_1').click().addClass("active");
  //   this.loadOrderItem(dblorder);
  //   this.orderNo = dblorder;
  // }

  //  全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
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
