import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {channel} from '../constants';
import {Page} from '../../../structs';

declare var $: any;

interface TopRefunds {
  /**
   * 退款单号
   */
  refundId: String;
  /**
   * 退款版本号（时间戳）
   */
  refundVersion: String;
  /**
   * 退还金额(退还给买家的金额
   */
  refundFee: number;
  /**
   * 退款原因
   */
  reason: String;
  /**
   * 退款申请时间
   */
  created: String;
  /**
   * 支付宝交易号
   */
  alipayNo: String;
  /**
   * 买家昵称
   */
  buyerNick: String;
  /**
   * 交易总金额
   */
  totalFee: number;
  /**
   * TOP交易号
   */
  tid: String;
  /**
   * TOP子订单号。如果是单笔交易oid会等于tid
   */
  oid: String;
  /**
   * 退款状态。可选值
   * <ul>
   * <li>WAIT_SELLER_AGREE(买家已经申请退款，等待卖家同意)</li>
   * <li>WAIT_BUYER_RETURN_GOODS(卖家已经同意退款，等待买家退货)</li>
   * <li>WAIT_SELLER_CONFIRM_GOODS(买家已经退货，等待卖家确认收货)</li>
   * <li>SELLER_REFUSE_BUYER(卖家拒绝退款)</li>
   * <li>CLOSED(退款关闭)</li>
   * <li>SUCCESS(退款成功)</li>
   * </ul>
   */
  status: any;
  /**
   * 退款阶段，可选值：onsale/aftersale
   */
  refundPhase: String;
  /**
   * 更新时间
   */
  modified: String;
  /**
   * 物流公司名称
   */
  companyName: String;
  /**
   * 退货运单号
   */
  sid: String;
  /**
   * 买家是否需要退货。可选值:true(是),false(否)
   */
  hasGoodReturn: any;
  /**
   * 支付给卖家的金额(交易总金额-退还给买家的金额)
   */
  payment: number;
  /**
   * 退款说明<br/>
   * refund.desc
   */
  desc: String;
  /**
   * 申请退款的商品数字编号
   */
  numIid: String;
  /**
   * 商品标题
   */
  title: String;
  /**
   * 商品价格
   */
  price: number;
  /**
   * 商品购买数量
   */
  num: number;
  /**
   * 退货时间
   */
  goodReturnTime: String;
  /**
   * 物流方式.可选值:free(卖家包邮),post(平邮),express(快递),ems(EMS).
   */
  shippingType: String;
  /**
   * 货物状态。可选值BUYER_NOT_RECEIVED (买家未收到货) BUYER_RECEIVED (买家已收到货) BUYER_RETURNED_GOODS (买家已退货)
   */
  goodStatus: any;
  /**
   * 卖家收货地址
   */
  address: String;

  // ========= EDI fields ==========

  /**
   * 渠道
   */
  channel: String;
  /**
   * 店铺代码
   */
  storeCode: String;
  /**
   * OMS退款单号
   */
  omsRefundId: String;
}

const urlBase = '/edi-admin';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.css']
})
export class RefundsComponent implements OnInit {
  public refundsPage: Page<TopRefunds>;
  public loading: boolean;
  private pageSize = 15;
  public noData = true;
  public isHint = false;
  public warning = true;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.reloadGrid();
  }

  clearCondition() {
    $('.form-control').val('');
    this.loadTopRefunds(1, this.pageSize);
  }

  currentPage() {
    if (this.refundsPage == null) {
      return 1;
    } else {
      return this.refundsPage.currentPageNumber;
    }
  }

  pageContent() {
    if (this.refundsPage == null) {
      return new Array<TopRefunds>();
    }
    return this.refundsPage.content;
  }

  reloadGrid() {
    this.loadTopRefunds(this.currentPage(), this.pageSize);
  }

  loadTopRefunds(page: number, pageSize: number) {
    this.loading = true;
    let url = urlBase + '/edi-top-server/edi/ops/top/refunds/channel-page/' + channel + '?pageSize=' + pageSize + '&page=' + page;
    const refundId = $('#edi-top-refunds-condition-refund-id').val();
    if (refundId) {
      url += '&refundId=' + refundId;
    }
    const tid = $('#edi-top-refunds-condition-tid').val();
    if (tid) {
      url += '&tid=' + tid;
    }
    const omsRefundId = $('#edi-top-refunds-condition-oms-refund-id').val();
    if (omsRefundId) {
      url += '&omsRefundId=' + omsRefundId;
    }
    const status = $('#edi-top-refunds-condition-refund-status').val();
    if (status) {
      url += '&status=' + status;
    }
    const refundPhase = $('#edi-top-refunds-condition-refund-phase').val();
    if (refundPhase) {
      url += '&refundPhase=' + refundPhase;
    }
    const shouldReturnGoods = $('#edi-top-refunds-condition-has-good-return').val();
    if (shouldReturnGoods) {
      url += '&shouldReturnGoods=' + shouldReturnGoods;
    }
    const goodStatus = $('#goodStatus').val();
    if (goodStatus) {
      url += '&goodStatus=' + goodStatus;
    }
    console.log(url);
    this.httpClient.get<Page<TopRefunds>>(url).subscribe({
      next: value => {
        this.refundsPage = value;
        const that = this;
        this.noData = value.total === 0;
        $('#item-relation-pagination').pagination({
          currentPage: this.currentPage(),
          totalPage: this.refundsPage.totalPages,
          callback: function (current) {
            that.loadTopRefunds(current, pageSize);
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

}
