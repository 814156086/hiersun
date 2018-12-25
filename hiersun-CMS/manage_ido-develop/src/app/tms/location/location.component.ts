import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  public pageNum = 1; // 页码
  public pageSize = 10; // 每页显示数量
  public pagetotal = 1; // 总页数
  public currentpage = 1; // 当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  // 确认弹窗
  public warnMsg: string;  // 确认窗口提示消息
  public btn_type_css: string;  // 按钮css类型
  public isload = false; // 是否加载
  public locationList = []; // 仓库列表
  public storehouses = [];   // 仓库信息
  public localType = [];   // 库位类型
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };

  constructor(private httpclient: HttpClient, private route: Router) {
  }

  ngOnInit() {
    this.initlocationList();
    this.storehouse();
    this.localDict();
  }

  initlocationList() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/local/tms-store-local?currentPage=' + that.pageNum + '&pageSize=10&localNum=' + $('#localNum').val() + '&localName=' + $('#localName').val() + '&storageNum=' + $('#storageNum').val();
    this.httpclient.get(selecturl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.locationList = res['data']['content'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = this.locationList.length ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            console.log(current);
            that.pageNum = current;
            that.initlocationList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  resetLocation() {
    $('#localNum').val('');
    $('#localName').val('');
    $('#storageNum').val('');
    $('#departNum').val('');
    $('#storageType').val('');
    this.pageNum = 1;
    this.initlocationList();
    this.storehouse();
  }

  editLocation(flag, stoId) {
    this.route.navigate(['tms/location/editlocation'], {
      queryParams: {
        flag, stoId
      }
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

  // 获取相应字典
  localDict() {
    this.isload = false;
    var provurl = '/tms-admin/dict/dict-codes?codeListStr=storage_local_type';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.localType = res['data']['storage_local_type'];
        } else {
          //   此处需要错误提示
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  delLocation() {
    $('#delModal').modal('show');
  }

  datadel() {
    $('#delModal').modal('hide');
  }
}
