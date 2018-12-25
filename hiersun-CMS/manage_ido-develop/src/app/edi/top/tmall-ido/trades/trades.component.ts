import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../../structs';
import {HttpClient} from '@angular/common/http';
import {channel} from '../constants';

declare var $: any;

/**
 * 天猫交易
 */
interface TopTrade {
  /**
   * 买家的支付宝id号
   */
  alipayId: string;
  /**
   * 支付宝交易号
   */
  alipayNo: string;
  /**
   * 淘宝下单成功了,但由于某种错误支付宝订单没有创建时返回的信息
   */
  alipayWarnMsg: string;
  /**
   * 区域id
   */
  areaId: string;
  /**
   * 交易中剩余的确认收货金额
   */
  availableConfirmFee: number;
  /**
   * 买家支付宝账号
   */
  buyerAlipayNo: string;
  /**
   * 买家下单的地区
   */
  buyerArea: string;
  /**
   * 买家邮件地址
   */
  buyerEmail: string;
  /**
   * 买家留言
   */
  buyerMessage: string;
  /**
   * 买家昵称
   */
  buyerNick: string;
  /**
   * 买家获得积分,返点的积分。格式:100;单位:个。返点的积分要交易成功之后才能获得
   */
  buyerObtainPointFee: number;
  /**
   * EDI检查(错误）信息
   */
  checkMsg: string;
  /**
   * EDI查检是否通过
   */
  checkPassed: boolean;
  /**
   * 交易佣金
   */
  commissionFee: number;
  /**
   * 卖家发货时间。格式:yyyy-MM-dd HH:mm:ss
   */
  consignTime: string;
  /**
   * 交易创建时间
   */
  created: string;
  /**
   * 使用信用卡支付金额数
   */
  creditCardFee: number;
  /**
   * 优惠总价
   */
  discountFee: number;
  /**
   * 交易结束时间
   */
  endTime: string;
  /**
   * 判断订单是否有买家留言
   */
  hasBuyerMessage: boolean;
  /**
   * 是否包含邮费
   */
  hasPostFee: boolean;
  /**
   * 发票抬头
   */
  invoiceName: string;
  /**
   * 发票类型
   */
  invoiceType: string;
  /**
   * 是否是多次发货的订单如果卖家对订单进行多次发货，则为true否则为false
   */
  isPartConsign: boolean;
  /**
   *  本地系统市名称
   */
  localCityName: string;
  /**
   * 本地系统市编码
   */
  localCityNo: string;
  /**
   * 本地系统区名称
   */
  localDistrictName: string;
  /**
   * 本地系统区编码
   */
  localDistrictNo: string;
  /**
   * 本地系统省名称
   */
  localStateName: string;
  /**
   * 本地系统省编码
   */
  localStateNo: string;
  /**
   * 订单出现异常问题的时候,给予用户的描述,没有异常的时候，此值为空
   */
  markDesc: string;
  /**
   * 记录修改时间
   */
  modified: string;
  /**
   * 付款时间
   */
  payTime: string;
  /**
   * 实付金额
   */
  payment: number;
  /**
   * 买家使用积分,下单时生成，且一直不变
   */
  pointFee: number;
  /**
   * 邮费
   */
  postFee: number;
  /**
   * 商品价格
   */
  price: number;
  /**
   * 买家实际使用积分
   */
  realPointFee: number;
  /**
   * 卖家实际收到的支付宝打款金额（由于子订单可以部分确认收货，这个金额会随着子订单的确认收货而不断增加，
   * 交易成功后等于买家实付款减去退款金额）
   */
  receivedPayment: number;
  /**
   * 收货人的详细地址
   */
  receiverAddress: string;
  /**
   * 收货人的所在城市
   */
  receiverCity: string;
  /**
   * 收货人的所在地区
   */
  receiverDistrict: string;
  /**
   * 收货人的手机号码
   */
  receiverMobile: string;
  /**
   * 收货人的姓名
   */
  receiverName: string;
  /**
   * 收货人的电话号码
   */
  receiverPhone: string;
  /**
   * 收货人的所在省份
   */
  receiverState: string;
  /**
   * 收货人的邮编
   */
  receiverZip: string;
  /**
   * 记录入库时间
   */
  recordCreated: string;
  /**
   * 记录修改时间
   */
  recordModified: string;
  /**
   * 卖家备注
   */
  sellerMemo: string;
  /**
   * 创建交易时的物流方式
   */
  shippingType: string;
  /**
   * 交易状态
   */
  status: string;
  /**
   * 交易编号
   */
  tid: string;
  /**
   * 超时到期时间
   */
  timeoutActionTime: string;
  /**
   * 是否TOP预售交易
   */
  topPreSale: boolean;
  /**
   * 商品金额
   */
  totalFee: number;
  /**
   * 交易备注。
   */
  tradeMemo: string;
  /**
   * 订单来源
   */
  tradeSource: string;
  /**
   * 渠道编码
   */
  channel: string;
  /**
   * 是否有定制子订单
   */
  hasCustomizationOrder: boolean;
  /**
   * 是否所有定制子订单已绑定定制核价单。没有定制子单，一直true
   */
  hasAllCOrderBind: boolean;
  /**
   * 是否所有定制子订单绑定的定制核价单审校通过。没有定制子单，一直true
   */
  hasAllCOrderPass: boolean;
  /**
   * OMS订单状态
   */
  omsStatus: string;
}
/**
 * 子订单
 */
interface TopOrder {
  /**
   * 卖家发货时间
   */
  consignTime: string;
  /**
   * 订单优惠金额
   */
  discountFee: number;
  /**
   * 实付金额
   */
  divideOrderFee: number;
  /**
   * 交易结束时间
   */
  endTime: string;
  /**
   * 快递公司名称
   */
  logisticsCompany: string;
  /**
   * 运单号
   */
  logisticsNo: string;
  /**
   * 修改时间
   */
  modified: string;
  /**
   * 购买数量
   */
  num: number;
  /**
   * 商品数字ID
   */
  numIid: string;
  /**
   * 子订单编号
   */
  oid: string;
  /**
   * 订单渠道/店铺
   */
  orderFrom: string;
  /**
   * OMS订单商品行
   */
  orderItemSid: string;
  /**
   * 商家外部编码
   */
  outerIid: string;
  /**
   * 商家Sku编号
   */
  outerSkuId: string;
  /**
   * 优惠分摊
   */
  partMjzDiscount: number;
  /**
   * 实付金额
   */
  payment: number;
  /**
   * 商品价格
   */
  price: number;
  /**
   * 最近退款ID
   */
  refundId: string;
  /**
   * 退款状态
   */
  refundStatus: string;
  /**
   * 发货状态
   */
  sendStatus: string;
  /**
   * 运送方式
   */
  shippingType: string;
  /**
   * 最小库存单位Sku的id
   */
  skuId: string;
  /**
   * SKU的值
   */
  skuPropertiesName: string;
  /**
   * 是否OMS拆单
   */
  split: boolean;
  /**
   * 拆单后交易编号
   */
  splitTid: string;
  /**
   * 订单状态
   */
  status: string;
  /**
   * 销售单号
   */
  subOrderSid: string;
  /**
   * 减库存方式
   */
  subStock: string;
  /**
   * 拆单前交易编号
   */
  tid: string;
  /**
   * 订单超时到期时间
   */
  timeoutActionTime: string;
  /**
   * 商品标题
   */
  title: string;
  /**
   * 应付金额
   */
  totalFee: number;
  /**
   * 交易类型
   */
  tradeType: string;
  /**
   * 商品类型
   */
  itemType: string;
  /**
   * 子订单异常信息。空表示没有问题
   */
  error: string;
}
const urlBase = '/edi-admin';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  @ViewChild('tradesdetail') tradesdetail
  public topTradePage: Page<TopTrade>;
  public topChildOrders: Array<TopOrder>;
  public loading: boolean;
  private pageSize = 15;
  public noData = true;
  public isHint = false;
  public warning = true;
  public hintMsg = '关联成功';
  public tid: string;
  public detailOrder = [];
  public discounts = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.reloadGrid();
    const updateOrder = $('#item-update-order');
    updateOrder.on('hidden.bs.modal', function () {
      $('body').addClass('modal-open');
    });
  }

  currentTradePage() {
    if (this.topTradePage == null) {
      return 1;
    } else {
      return this.topTradePage.currentPageNumber;
    }
  }

  tradePageContent() {
    if (this.topTradePage == null) {
      return new Array<TopTrade>();
    }
    return this.topTradePage.content;
  }

  reloadGrid() {
    this.loadItemTypes(this.currentTradePage(), this.pageSize);
  }
  // 分页展示订单
  loadItemTypes(page: number, pageSize: number) {
    this.loading = true;
    let url = urlBase + '/edi-top-server/edi/ops/top/trades/channel/' + channel + '/page?pageSize=' + pageSize + '&page=' + page;
    const buyerNick = $('#item-relation-condition-item-buyerNick').val();
    if (buyerNick) {
      url += '&buyerNick=' + buyerNick;
    }
    const tid = $('#item-relation-condition-item-tid').val();
    if (tid) {
      url += '&tid=' + tid;
    }
    const alipayNo = $('#item-relation-condition-item-alipayNo').val();
    if (alipayNo) {
      url += '&alipayNo=' + alipayNo;
    }
    const ediCheckPassed = $('#item-relation-condition-item-ediCheckPassed').val();
    if (ediCheckPassed) {
      url += '&ediCheckPassed=' + ediCheckPassed;
    }
    const status = $('#item-relation-condition-item-status').val();
    if (status) {
      url += '&status=' + status;
    }
    const topPreSale = $('#item-relation-condition-item-topPreSale').val();
    if (topPreSale) {
      url += '&topPreSale=' + topPreSale;
    }
    this.httpClient.get<Page<TopTrade>>(url).subscribe({
      next: value => {
        this.topTradePage = value;
        const that = this;
        this.noData = value.total === 0;
        $('#item-relation-pagination').pagination({
          currentPage: this.currentTradePage(),
          totalPage: this.topTradePage.totalPages,
          callback: function (current) {
            that.loadItemTypes(current, pageSize);
          }
        });
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getDetailShow(tid) {
    this.tradesdetail.detailShow(tid);
  }
  // 子订单
  // childOrder(tid) {
    //   const url = urlBase + '/edi-top-server/edi/ops/top/trade/orders/' + tid;
    //   this.tid = tid;
    //   this.httpClient.get<Array<TopOrder>>(url).subscribe({
    //     next: value => {
    //       this.topChildOrders = value;
    //       const ul = $('#tabs-nav');
    //       for (let i = 0; i < value.length; i++) {
    //         const li = $('<li><a style="color:#000" href = "#otab_' + i + '" class = "otab_ ' + i + '"  data-toggle="tab"> 子订单 </a></li>');
    //         ul.append(li);
    //       }
    //       $('#tabs-nav li:first').addClass('active');
    //     },
    //     error: err => {
    //       console.error(err);
    //     },
    //     complete: () => {
    //     }
    //   });
  // }
  //清空
  clearCondition() {
    $('#item-relation-condition-item-buyerNick').val('');
    $('#item-relation-condition-item-tid').val('');
    $('#item-relation-condition-item-status').val('');
    $('#item-relation-condition-item-alipayNo').val('');
    $('#item-relation-condition-item-ediCheckPassed').val('');
    $('#item-relation-condition-item-topPreSale').val('');
    this.loadItemTypes(1, this.pageSize);
  }
  
  //是否漏单扫描
  orderScan() {
    $('#item-order-scan').modal('show');
  }
  // 手工抓单弹窗
  grabOrder() {
    $('#item-grab-order-tid').val('');
    $('#item-grab-order').modal('show');
  }
  //漏单扫描
  orderScaning() {
    this.loading = true;
    const that = this;
    const url = urlBase + '/edi-top-server/edi/ops/top/trades/channel/' + channel + '/fetch-last-day';
    this.httpClient.get(url).subscribe({
      next: ignored => {
        this.loading = false;
        this.isHint = true;
        this.hintMsg = '扫描成功';
        this.warning = false;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  //手工抓单
  grabOrdering() {
    const that = this;
    const tid = $('#item-grab-order-tid').val();
    // console.log(typeof (tid));
    const url = urlBase + '/edi-top-server/edi/ops/top/trades/fetch/' + channel + '/' + tid;
    this.httpClient.get(url).subscribe({
      next: ignored => {
        $('#item-grab-order').modal('hide');
        this.isHint = true;
        this.hintMsg = '抓取完成';
        this.warning = false;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
