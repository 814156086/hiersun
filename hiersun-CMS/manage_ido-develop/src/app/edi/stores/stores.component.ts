import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

declare var $: any;

interface OrderChannel {
  channelCode: string;
  channelName: string;
  status: number;
}

interface Response<T> {
  code: number;
  data: T;
  desc: string;
}

interface Brand {
  brandSid: string;
  brandName: string;
}

interface Platform {
  platform: string;
  platformName: string;
}

interface Store {
  sid: number;
  shopNo: string;
  channel: string;
  sellerName: string;
  platform: string;
  brand: string;
  enabled: boolean;
  appId: string;
  appSecret: string;
  accessToken: string;
}

class MyStore implements Store {
  sid: number;
  shopNo: string;
  channel: string;
  sellerName: string;
  platform: string;
  brand: string;
  enabled: boolean;
  appId: string;
  appSecret: string;
  accessToken: string;
}

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  private initialing: boolean;
  private loading: boolean;
  private orderChannels: OrderChannel[];
  private orderChannelMap: Map<string, OrderChannel> = new Map();
  private platforms: Platform[];
  private platformMap: Map<string, Platform> = new Map();
  private brands: Brand[];
  private brandSidMap: Map<string, Brand> = new Map();
  public shouldShowHint: boolean;
  public warning: boolean;
  public hintMsg: string;
  private stores: Store[];
  public storeEditing: Store = new MyStore();
  public editing: boolean;
  public editorError = '';

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.warning = false;
    this.hintMsg = '';
    this.initialing = true;
    this.shouldShowHint = false;
    this.httpClient.get<Response<Brand[]>>('/pcm-admin/brands').subscribe({
      next: value => {
        if (value.code === 200) {
          this.brands = value.data;
          if (this.brands !== null) {
            const that = this;
            this.brands.forEach(function (brand) {
              that.brandSidMap.set(brand.brandSid, brand);
            });
          }
        } else {
          console.error(value);
          this.shouldShowHint = true;
          this.warning = true;
          this.hintMsg = '加载品牌数据失败，请刷新页面重试:\n' + value.desc;
        }
      },
      error: err => {
        console.error(err);
        this.shouldShowHint = true;
        this.warning = true;
        this.hintMsg = '加载品牌数据失败，请刷新页面重试';
      },
      complete: () => {
        this.initialing = false;
      }
    });
    this.httpClient.get<Response<OrderChannel[]>>('/pcm-admin/channels').subscribe({
      next: value => {
        if (value.code === 200) {
          this.orderChannels = value.data;
          if (this.orderChannels !== null) {
            const that = this;
            this.orderChannels.forEach(function (oc) {
              that.orderChannelMap.set(oc.channelCode, oc);
            });
          }
        } else {
          console.error(value);
          this.shouldShowHint = true;
          this.warning = true;
          this.hintMsg = '加载订单渠道数据失败，请刷新页面重试:\n' + value.desc;
        }
      },
      error: err => {
        console.error(err);
        this.shouldShowHint = true;
        this.warning = true;
        this.hintMsg = '加载品牌数据失败，请刷新页面重试';
      },
      complete: () => {
        this.initialing = false;
      }
    });
    this.httpClient.get<Platform[]>('/edi-admin/edi-channel/edi/channels/platforms').subscribe({
      next: value => {
        this.platforms = value;
        if (this.platforms !== null) {
          const that = this;
          this.platforms.forEach(function (p) {
            that.platformMap.set(p.platform, p);
          });
        }
      },
      error: err => {
        console.error(err);
        this.shouldShowHint = true;
        this.warning = true;
        this.hintMsg = '加载渠道数据失败，请刷新页面重试';
      },
      complete: () => {
        this.initialing = false;
      }
    });
    this.search();
  }

  shouldShowSpinner() {
    return this.initialing || this.loading;
  }

  getOrderChannels() {
    if (this.orderChannels != null) {
      return this.orderChannels;
    }
    return new Array<OrderChannel>();
  }

  getBrands() {
    if (this.brands != null) {
      return this.brands;
    }
    return new Array<Brand>();
  }

  getPlatforms() {
    if (this.platforms != null) {
      return this.platforms;
    }
    return new Array<Platform>();
  }

  search() {
    let url = '/edi-admin/edi-channel/edi/stores/_list';
    let params = '';
    const channel = $('#edi-stores-f-channel').val();
    if (channel) {
      if (params !== '') {
        params += '&';
      }
      params += 'platform=' + channel;
    }
    const brand = $('#edi-stores-f-brand').val();
    if (brand) {
      if (params !== '') {
        params += '&';
      }
      params += 'brand=' + brand;
    }
    const enabled = $('#edi-stores-f-enabled').val();
    if (enabled) {
      if (params !== '') {
        params += '&';
      }
      params += 'enabled=' + enabled;
    }
    if (params !== '') {
      url += '?' + params;
    }
    this.loading = true;
    this.httpClient.get<Store[]>(url).subscribe({
      next: value => {
        this.stores = value;
      },
      error: err => {
        console.error(err);
        this.showHint(true, '查询店铺列表失败', 5000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  resetAndSearch() {
    $('#edi-stores-f-channel').val('');
    $('#edi-stores-f-brand').val('');
    $('#edi-stores-f-enabled').val('');
    this.search();
  }

  private showHint(warn: boolean, msg: string, timeout: number = 2000) {
    this.shouldShowHint = true;
    this.warning = warn;
    this.hintMsg = msg;
    const that = this;
    setTimeout(function () {
      that.shouldShowHint = false;
      that.hintMsg = '';
    }, timeout);
  }

  getStores(): Array<Store> {
    if (this.stores != null) {
      return this.stores;
    }
    return new Array<Store>();
  }

  getOrderChannelName(orderChannel: string): string {
    if (orderChannel) {
      const oc = this.orderChannelMap.get(orderChannel);
      return oc ? oc.channelName : '未知';
    }
    return '未知';
  }

  getPlatformName(platform: string) {
    if (platform) {
      const p = this.platformMap.get(platform);
      return p ? p.platformName : 'UNKNOWN';
    }
    return 'UNKNOWN';
  }

  getBrandName(brand: string) {
    if (brand) {
      const b = this.brandSidMap.get(brand);
      return b ? b.brandName : '未知';
    }
    return '未知';
  }

  disable(store: Store) {
    const url = '/edi-admin/edi-channel/edi/stores/_disable/' + store.sid;
    this.httpClient.post(url, {}).subscribe({
      next: ignored => {
      },
      error: err => {
        console.log(err);
        this.showHint(true, '禁用店铺失败', 2000);
      },
      complete: () => {
        this.search();
      }
    });
  }

  enable(store: Store) {
    const url = '/edi-admin/edi-channel/edi/stores/_enable/' + store.sid;
    this.httpClient.post(url, {}).subscribe({
      next: ignored => {
      },
      error: err => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          this.showHint(true, err.error['error'], 2000);
        } else {
          this.showHint(true, '启用店铺失败', 2000);
        }
      },
      complete: () => {
        this.search();
      }
    });
  }

  showEdit(store: Store) {
    this.editorError = '';
    this.storeEditing = new MyStore();
    if (store) {
      this.storeEditing = store;
      this.editing = true;
    } else {
      this.editing = false;
    }
  }

  addStore() {
    const store = this.storeToCommit();
    if (store == null) {
      return;
    }
    this.httpClient.post('/edi-admin/edi-channel/edi/stores/_add', store).subscribe({
      next: ignored => {
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        $('#edi-store-editor').modal('hide');
        this.search();
      }
    });
  }

  updateStore() {
    const store = this.storeToCommit();
    if (store == null) {
      return;
    }
    this.httpClient.post('/edi-admin/edi-channel/edi/stores/_update', store).subscribe({
      next: ignored => {
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        $('#edi-store-editor').modal('hide');
        this.search();
      }
    });
  }

  storeToCommit(): Store {
    this.editorError = '';
    const channel = $('#edi-store-editor-channel').val();
    if (!channel) {
      this.editorError += '订单渠道必填！';
    }
    const sellerName = $('#edi-store-editor-name').val();
    if (!sellerName) {
      this.editorError += '商家名称必填！';
    }
    const platform = $('#edi-store-editor-platform').val();
    if (!platform) {
      this.editorError += '请指定店铺渠道！';
    }
    const brand = $('#edi-store-editor-brand').val();
    if (!brand) {
      this.editorError += '请指定店铺品牌！';
    }
    const omsCode = $('#edi-store-editor-oms-code').val();
    if (!omsCode) {
      this.editorError += '非现货订单绑定OMS门店号必填！';
    }
    const enabled = $('#edi-store-editor-enabled').val();
    if (enabled === '') {
      this.editorError += '请指定是否启用！';
    }
    const appKey = $('#edi-store-editor-app-key').val();
    if (!appKey) {
      this.editorError += '授权APP_KEY/APP_ID必填！';
    }
    const appSecret = $('#edi-store-editor-app-secret').val();
    if (!appSecret) {
      this.editorError += '授权APP_SECRET必填！';
    }
    const sessionKey = $('#edi-store-editor-session-key').val();
    if (!sessionKey) {
      this.editorError += '授权TOKEN/SESSION_KEY必填！';
    }
    if (this.editorError) {
      return null;
    }
    const store = new MyStore();
    if (this.editing) {
      store.sid = this.storeEditing.sid;
    }
    store.channel = channel;
    store.sellerName = sellerName;
    store.platform = platform;
    store.brand = brand;
    store.shopNo = omsCode;
    store.enabled = enabled;
    store.appId = appKey;
    store.appSecret = appSecret;
    store.accessToken = sessionKey;
    return store;
  }
}
