import {Component, OnInit} from '@angular/core';
import {ItemType, Page} from '../../../structs';
import {HttpClient} from '@angular/common/http';
import {channel} from '../constants';

declare var $: any;

/**
 * 天猫商品关联
 */
interface TopItemRelation {
  /**
   * 创建时间
   */
  created: string;
  /**
   * 是否启用
   */
  enabled: boolean;
  /**
   * 商家编码
   */
  itemCode: string;
  /**
   * 商品类型
   */
  itemType: string;
  /**
   * 修改时间
   */
  modified: string;
  /**
   * 数据库SID
   */
  sid: string;
  /**
   * 中台SKU编码
   */
  skuCode: string;
  /**
   * 渠道编码
   */
  channel: string;
  /**
   * 是否下单减库存
   */
  subStock: number;
  /**
   * 天猫商品ID
   */
  topItemId: string;
  /**
   * 天猫商品标题
   */
  topItemName: string;
  /**
   * 天猫SKU编码
   */
  topSkuId: string;
  /**
   * 天猫商品状态
   */
  topStatus: number;
  /**
   * 天猫商品URL
   */
  topUrl: string;
}

const urlBase = '/edi-admin';

@Component({
  selector: 'app-item-relations',
  templateUrl: './item-relations.component.html',
  styleUrls: ['./item-relations.component.css']
})
export class ItemRelationsComponent implements OnInit {
  public itemRelationPage: Page<TopItemRelation>;
  public loading: boolean;
  private pageSize = 15;
  public itemTypeMap: Map<string, string> = new Map<string, string>();
  public removeTopItemId: string;
  public noData = true;
  public isHint = false;
  public warning = true;
  public hintMsg = '关联成功';

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get<ItemType[]>(urlBase + '/edi-item-code-type/edi/item-code-types/types').subscribe({
      next: value => {
        value.forEach(it => this.itemTypeMap.set(it.type, it.name));
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.reloadGrid();
      }
    });
  }

  currentPage() {
    if (this.itemRelationPage == null) {
      return 1;
    } else {
      return this.itemRelationPage.currentPageNumber;
    }
  }

  pageContent() {
    if (this.itemRelationPage == null) {
      return new Array<TopItemRelation>();
    }
    return this.itemRelationPage.content;
  }

  correlation() {
    $('#item-relation-manual-id').val('');
    $('#correlation').modal('show');
  }

  manualCorrelation() {
    const topItemId = $('#item-relation-manual-id').val();
    this.httpClient.post(urlBase + '/edi/top/item-relation/relate?topItemId=' + topItemId + '&channel=' + channel, {})
      .subscribe({
        next: value => {
          console.log(value);
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.loadItemTypes(1, this.pageSize);
          $('#correlation').modal('hide');
        }
      });
  }

  reloadGrid() {
    this.loadItemTypes(this.currentPage(), this.pageSize);
  }

  loadItemTypes(page: number, pageSize: number) {
    this.loading = true;
    let url = urlBase + '/edi-top-server/edi/top/item-relation/channel/' + channel + '/relations?pageSize=' + pageSize + '&page=' + page;
    const topItemId = $('#item-relation-condition-top-item-id').val();
    if (topItemId) {
      url += '&topItemId=' + topItemId;
    }
    const itemCode = $('#item-relation-condition-item-code').val();
    if (itemCode) {
      url += '&itemCode=' + itemCode;
    }
    const topNameQuery = $('#item-relation-condition-top-name-query').val();
    if (topNameQuery) {
      url += '&topItemNameQuery=' + topNameQuery;
    }
    const item_type = $('#item-relation-condition-item-type').val();
    if (item_type) {
      url += '&itemType=' + item_type;
    }
    this.httpClient.get<Page<TopItemRelation>>(url).subscribe({
      next: value => {
        this.itemRelationPage = value;
        const that = this;
        this.noData = value.total === 0;
        $('#item-relation-pagination').pagination({
          currentPage: this.currentPage(),
          totalPage: this.itemRelationPage.totalPages,
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

  clearCondition() {
    $('.topItemId').val('');
    $('.itemCode').val('');
    $('.topItemNameQuery').val('');
    $('.item_type').val('');
    this.loadItemTypes(1, this.pageSize);
  }

  release(item: TopItemRelation) {
    this.removeTopItemId = item.topItemId;
    $('#removerelation').modal('show');
  }

  releaseRelation() {
    const itemId = this.removeTopItemId;
    this.httpClient.post(urlBase + '/edi-top-server/edi/top/item-relation/un-relate?channel=' + channel + '&topItemId=' + itemId, {})
      .subscribe({
        next: value => {
          console.log(value);
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.loadItemTypes(1, this.pageSize);
          $('#removerelation').modal('hide');
        }
      });
  }

  autoCorrelation() {
    this.httpClient.get(urlBase + '/edi-top-server/edi/top/item-relation/scan-listing/' + channel)
    .subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
      }
    });
    this.isHint = true;
    this.hintMsg = '服务器已开始执行自动关联……';
    const that = this;
    setTimeout(function () {
      that.isHint = false;
      that.hintMsg = '';
      that.warning = false;
    }, 1500);
  }
}
