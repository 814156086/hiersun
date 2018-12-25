import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-editLogisticsCompany',
  templateUrl: './editLogisticsCompany.component.html',
  styleUrls: ['./editLogisticsCompany.component.css']
})
export class EditLogisticsCompanyComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//判断编辑、添加
  public sid: any;//仓库Id
  public storageType = [];//仓库类型列表
  public logisticsCompany: LogisticsCompany;//仓库详情

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.flag = queryParams.flag;
      this.sid = queryParams.sid;
    });
  }

  ngOnInit() {
    this.isload = false;
    if (this.flag == 2) {
      this.logisticsCompany = new LogisticsCompany('', '', '', 1,'');
      this.initstorageItem();
    } else {
      this.logisticsCompany = new LogisticsCompany('', '', '', 1,'');
    }
    this.isload = true;
  }
  initstorageItem() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/tms/logisticsCompany/list';
    var selparams = {
      "sid": this.sid,
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.logisticsCompany = res['data']['content'][0];
          if(this.logisticsCompany.logisticsStatus==1){

          }
          console.log(this.logisticsCompany);
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
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
      })
  }
  saveLogisticsCompanyInfo() {
    this.isload = false;
    if (!$('.logisticsNo').val()) {
      this.showWarnWindow(true, "请输入承运商编号", "warning");
      this.isload=true;
      return
    }
    if (!$('.logisticsCompanyCode').val()) {
      this.showWarnWindow(true, "请输入承运商编码", "warning");
      this.isload=true;
      return
    }
    if (!$('.logisticsCompanyName').val()) {
      this.showWarnWindow(true, "请输入承运商名称", "warning");
      this.isload=true;
      return
    }
    var stourl = "";
    if (this.flag == 1) {
      stourl = '/tms-admin/tms/logisticsCompany/save';
    } else {
      stourl = '/tms-admin/tms/logisticsCompany/update';
    }


    var stoparams = {
      "logisticsNo": $('.logisticsNo').val(),
      "logisticsCompanyCode": $('.logisticsCompanyCode').val(),
      "logisticsCompanyName": $('.logisticsCompanyName').val(),
      "logisticsStatus": $('input[type="radio"][name="logisticsStatus"]:checked').val(),
      "sid":this.sid
    }

    this.httpclient.post(stourl, stoparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "操作成功,返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "danger");
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
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/tms/logisticsCompany'])
    }
  }
}
export class LogisticsCompany {
  constructor(
    public logisticsNo: String,
    public logisticsCompanyCode: String,
    public logisticsCompanyName: String,
    public logisticsStatus: number,
    public sid: String
  ) {
  }
}
