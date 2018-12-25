import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-logisticsCompany',
  templateUrl: './logisticsCompany.component.html',
  styleUrls: ['./logisticsCompany.component.css']
})
export class LogisticsCompanyComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public logisticsCompanyList = [];//仓库列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = false;
    this.initstorageList();
    this.isload = true;
  }

  // 获取仓库列表信息
  initstorageList() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/tms/logisticsCompany/list';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "logisticsCompanyName": $("#logisticsCompanyName").val()
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.logisticsCompanyList = res['data']['content'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = this.logisticsCompanyList ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initstorageList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  resetStorage() {
    $("#logisticsCompanyName").val("");
    this.pageNum = 1;
    this.initstorageList();
  }
  isForbid(e, num) {
    console.log($(e).attr('checked'), num);
    var code = $(e).attr('checked');
    if (typeof(code) == "undefined") {
      this.updateStore(1, num, 0)
    } else {
      this.updateStore(1, num, 1)
    }

  }
  isDefault(e, num) {
    console.log($(e).attr('checked'), num);
    // this.updateStore(2, num, code)
    var code = $(e).attr('checked');
    if (typeof(code) == "undefined") {
      this.updateStore(2, num, 0)
    } else {
      this.updateStore(2, num, 1)
    }
  }
  editStorage(flag, sid) {
    this.route.navigate(['tms/logisticsCompany/editLogisticsCompany'], {
      queryParams: {
        flag, sid
      }
    });
  }
  /*delStorage(storageNum,isdefault) {
    this.storageNum = "";
    if (!isdefault) {
      $('#delModal').modal('show');
      this.storageNum = storageNum;
    } else {
      this.showWarnWindow(true, "默认仓库不支持删除", "warning");
    }

  }*/
 /* datadel() {
    this.updateStore(0, this.storageNum, 0);
  }*/
  updateStore(fg, value, code) {
    console.log(code)
    var stourl = '/tms-admin/tms/store/update';
    var stoparams = {
      "storageNum": value
    }
    switch (fg) {
      case 0:
        stoparams['isDelete'] = 1
        break;
      case 1:
        stoparams['isForbid'] = code
        break;
      case 2:
        stoparams['isDefault'] = code
        break;
    }
    this.httpclient.post(stourl, stoparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.initstorageList();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
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
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/tms/storage'])
    }
  }
}
