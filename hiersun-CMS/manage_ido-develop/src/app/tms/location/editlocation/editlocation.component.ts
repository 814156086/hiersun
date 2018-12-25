import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {StorageInfo} from '../../storage/editstorage/editstorage.component';

declare var $: any;

@Component({
  selector: 'app-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrls: ['./editlocation.component.css']
})
export class EditlocationComponent implements OnInit {
  public isShowWarnWin = false;  // 确认弹窗
  public warnMsg: string;   // 确认窗口提示消息
  public btn_type_css: string;  // 按钮css类型
  public isload = false; // 是否加载
  public flag = 1; // 判断编辑、添加
  public stoId: any; // 仓库Id
  public localType = []; // 库位类型
  public storehouses = [];   // 仓库信息
  public tmsLocal: localInfo;   // 库位信息
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
    let that = this;
    if (this.flag == 1) {// 添加
      that.flag = this.flag;
      this.tmsLocal = new localInfo(0, '', '', 0, '', 0, '');
    } else {// 编辑
      that.flag = this.flag;
      this.tmsLocal = new localInfo(0, '', '', 0, '', 0, '');
      that.editinstorage();
    }
    this.localDict();
    this.storehouse();
  }

  editinstorage() {
    this.isload = true;
    const that = this;
    const selecturl = '/tms-admin/local/tms-store-local?unlimit=1&localNum=' + that.stoId;
    this.httpclient.get(selecturl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.tmsLocal = res['data']['content'][0];
          console.log(res['data']['content'][0]);
          $(`input[name='isDefault'][value=${this.tmsLocal.isDefault}]`).attr('checked', true);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  subLocation() {
    let that = this;
    if ($('#localType').val() == '') {
      this.showWarnWindow(true, '请选择库位类型', 'warning');
      return false;
    }
    if ($('.localName').val() == '') {
      this.showWarnWindow(true, '请填写库位名称', 'warning');
      return false;
    }
    if ($('#storageNum').val() == '') {
      this.showWarnWindow(true, '请选择仓库', 'warning');
      return false;
    }
    if ($('input[name="isDefault"]:checked').val() == '') {
      this.showWarnWindow(true, '请勾选是否为默认', 'warning');
      return false;
    }
    this.isload = false;
    var localPara = {};
    if (that.flag == 1) {// 添加
      localPara = {
        'localName': $('.localName').val(),     // 库位名称
        'localType': $('#localType').val(),     // 库位类型
        'storageNum': $('#storageNum').val(),      // 仓库编码
        'isDefault': $('input[name="isDefault"]:checked').val(),           // 是否默认
        'remark': $('.remark').val()    // 备注
      };
    } else {
      localPara = {
        'localName': $('.localName').val(),     // 库位名称
        'localType': $('#localType').val(),     // 库位类型
        'storageNum': $('#storageNum').val(),      // 仓库编码
        'isDefault': $('input[name="isDefault"]:checked').val(),           // 是否默认
        'remark': $('.remark').val(),      // 备注
        'sid': $('.localSid').val(),
        'localNum': $('.localNum').val()
      };
    }
    console.log(localPara);
    var localUrl = '/tms-admin/local/edit-storage-local';
    this.httpclient.post(localUrl, localPara).subscribe(
      res => {
        console.log(res);
        if (res['code'] == 200) {
          this.isload = true;
          that.route.navigateByUrl('/tms/location');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
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

  // 仓库列表
  storehouse() {
    let that = this;
    this.isload = false;
    var param = {};
    var storeUrl = '/tms-admin/tms/stores';
    this.httpclient.post(storeUrl, param).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          that.storehouses = res['data'].content;
        } else {
          // this.showWarnWindow(true, '仓库查询异常', "warning")
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
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
      that.route.navigate(['/tms/location']);
    }
  }
}

export class localInfo {
  constructor(
    public localType: Number,
    public localName: String,
    public storageNum: String,
    public isDefault: Number,
    public remark: String,
    public sid: Number,
    public localNum: String
  ) {
  }
}
