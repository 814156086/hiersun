import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-editstorage',
  templateUrl: './editstorage.component.html',
  styleUrls: ['./editstorage.component.css']
})
export class EditstorageComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//判断编辑、添加
  public stoId: any;//仓库Id
  public storageType = [];//仓库类型列表
  public localType = [];//库位类型列表
  public storageMesg: StorageInfo;//仓库详情
  storeList: Array<any> = [];//门店列表

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.flag = queryParams.flag;
      this.stoId = queryParams.stoId;
    });
  }

  ngOnInit() {
    this.isload = false;
    $('#leaseTime').datetimepicker({
      format: 'yyyy-MM-dd',
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    this.initDict();
    this.localDict();
    if (this.flag == 2) {
      this.storageMesg = new StorageInfo('', '', 0, 0, '', '', '', '', '', '');
      this.initstorageItem();
    } else {
      this.storageMesg = new StorageInfo('', '', 0, 0, '', '', '', '', '', '');
    }
    this.loadStoreList();
    this.isload = true;
  }

  initstorageItem() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/tms/stores';
    var selparams = {
      'storageNum': this.stoId,
    };
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storageMesg = res['data']['content'][0];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  // 门店信息
  loadStoreList() {
    this.isload = false;
    const url = '/pcm-admin/stores/all';
    const param = {
      'organizationCode': '',
      'storeType': 1
    };
    this.httpclient.post(url, param, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storeList = res['data'];
        }else{
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      });
  }

  // 获取相应字典
  initDict() {
    this.isload = false;
    var provurl = '/tms-admin/dict/dict-codes?codeListStr=storage_type';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storageType = res['data']['storage_type'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  // 获取相应字典
  localDict() {
    this.isload = false;
    var provurl = '/tms-admin/dict/dict-codes?codeListStr=storage_local_type';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.localType = res['data']['storage_local_type'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  subStorage() {
    this.isload = false;
    if (!$('.storageName').val()) {
      this.showWarnWindow(true, '请输入仓库名', 'warning');
      this.isload = true;
      return;
    }
 /*   if (!$('.storageName').val()) {
      this.showWarnWindow(true, '请选择租赁时间', 'warning');
      this.isload = true;
      return;
    }*/
    if (!$('#storeCode').val()) {
      this.showWarnWindow(true, '请选择所属门店', 'warning');
      this.isload = true;
      return;
    }
    var stourl = '';
    var stoparams: any;
    if (this.flag != 1) {
      stourl = '/tms-admin/tms/store/update';
      stoparams = {
        'storageNum': $('.storageNum').val(),
        'storageName': $('.storageName').val(),
        'storageType': $('#storageType').val(),
        // 'leaseTime': new Date($('#leaseTime').val()).getTime(),
        // 'area': $('.area').val(),
        // 'address': $('.address').val(),
        // 'phone': $('.phone').val(),
        'shopNo': $('#storeCode').val(),
        'shopName': $('#storeCode').find('option:selected').text()
        // 'contact': $('.contact').val()
      };
    } else {
      stourl = '/tms-admin/tms/store/save';
      stoparams = {
        // 'storageNum': $('.storageNum').val(),
        'storageName': $('.storageName').val(),
        'storageType': $('#storageType').val(),
        'localName': $('.localName').val(),
        'localType': $('#localType').val(),
        // 'leaseTime': new Date($('#leaseTime').val()).getTime(),
        // 'area': $('.area').val(),
        // 'address': $('.address').val(),
        // 'phone': $('.phone').val(),
        'shopNo': $('#storeCode').val(),
        'shopName': $('#storeCode').find('option:selected').text()
        // 'contact': $('.contact').val()
      };
    }
    this.httpclient.post(stourl, stoparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '操作成功,返回列表页', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  goBack() {
    window.history.go(-1);
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
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = '';
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/tms/storage']);
    }
  }
}

export class StorageInfo {
  constructor(
    public storageNum: String,
    public storageName: String,
    public storageType: Number,
    public localType: Number,
    public leaseTime: String,
    public area: String,
    public address: String,
    public contact: String,
    public phone: String,
    public shopNo: String
  ) {
  }
}
