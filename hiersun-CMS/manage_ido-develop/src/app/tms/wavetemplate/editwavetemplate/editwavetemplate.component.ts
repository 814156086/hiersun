import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-editwavetemplate',
  templateUrl: './editwavetemplate.component.html',
  styleUrls: ['./editwavetemplate.component.css']
})
export class EditwavetemplateComponent implements OnInit {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//判断编辑、添加
  public billNo: any;//编号
  public pid: any;//主键
  public waveMesg: WaveInfo;//波次详情
  public storageList: Array<any> = [];//仓库列表
  public orderTypeList: Array<any> = [];//订单类型列表

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.flag = queryParams.flag;
      this.billNo = queryParams.billNo;
      this.pid = queryParams.pid;
    });
  }

  ngOnInit() {
    this.isload = false;
    $('#activeStartTime').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#activeEndTime').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    this.initStorageList();//加载仓库列表
    this.initOrderType();//加载订单类型
    if (this.flag == 2) {
      this.waveMesg = new WaveInfo('', '', '', '', '');
      this.initWaveItem();
    } else {
      this.waveMesg = new WaveInfo('', '', '', '', '');
    }
    this.isload = true;
  }
  // 加载仓库列表
  initStorageList() {
    this.isload = false;
    var stoUrl = "/tms-admin/tms/stores";
    var sparams = {
      'unlimit': '1'
    }
    this.httpclient.post(stoUrl, sparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.storageList = res['data']['content']
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载订单类型
  initOrderType() {
    this.isload = false;
    var orderUrl = '/oms-admin/dict/selectCodelist'
    var oparams = {
      "typeValue": "order_type"
    }
    this.httpclient.post(orderUrl, oparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.orderTypeList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 编辑加载详情
  initWaveItem() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/wave/selectDetails';
    var selparams = {
      "waveNo": this.billNo,
      "sid": this.pid,
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.waveMesg = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
 // 输入内容为数字
 normalInputChange(event) {  
  const reg = new RegExp("^[0-9]*$", "g");
  event.target.value = !reg.test(event.target.value)?"":event.target.value;
}
  subwave() {
    this.isload = false;
    var waveName=$('.waveName').val(),
        storageName=$('#storageName').val(),
        cronExpression=$('.cronExpression').val(),
        activeStartTime=$('#activeStartTime').val(),
        activeEndTime=$('#activeEndTime').val()
    if (!waveName) {
      this.showWarnWindow(true, "请输入波次名称", "warning");
      this.isload = true;
      return
    }
    if (!storageName) {
      this.showWarnWindow(true, "请选择所属仓库", "warning");
      this.isload = true;
      return
    }
    if (!cronExpression) {
      this.showWarnWindow(true, "请输入执行频次", "warning");
      this.isload = true;
      return
    }

    if (!activeStartTime) {
      this.showWarnWindow(true, "请选择生效开始时间", "warning");
      this.isload = true;
      return
    }
    if (!activeEndTime) {
      this.showWarnWindow(true, "请选择生效结束时间", "warning");
      this.isload = true;
      return
    }
    var aStartTime = new Date(activeStartTime).getTime(),
      aEndTime = new Date(activeEndTime).getTime();
    if (aStartTime > aEndTime) {
      this.showWarnWindow(true, "生效结束时间不能早于生效开始时间", "warning");
      return;
    }
    // if (!$('#storageType').val()) {
    //   this.showWarnWindow(true, "请选择订单类型", "warning");
    //   this.isload = true;
    //   return
    // }
    // if (!$('.beignNum').val()) {
    //   this.showWarnWindow(true, "请选择数量", "warning");
    //   this.isload = true;
    //   return
    // }
    // if (!$('.planSort').val()) {
    //   this.showWarnWindow(true, "请选择优先级", "warning");
    //   this.isload = true;
    //   return
    // }
    var stourl = "";
    if (this.flag == 1) {
      stourl = '/tms-admin/tms/store/save';
    } else {
      stourl = '/tms-admin/tms/store/update';
    }

    var stoparams = {
      "waveName": "string",
      "activeEndTime": "2018-12-24T09:51:12.217Z",
      "activeStartTime": "2018-12-24T09:51:12.217Z",
      "activeStorage": "string",
      "createTime": "2018-12-24T09:51:12.217Z",
      "createUserId": "string",
      "createUserName": "string",
      "cronExpression": "string",
      "updateTime": "2018-12-24T09:51:12.217Z",
      "updateUserId": "string",
      "updateUserName": "string",
    
    }

    this.httpclient.post(stourl, stoparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "操作成功,返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
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
      that.route.navigate(['/tms/storage'])
    }
  }
}
export class WaveInfo {
  constructor(
    public waveName: String,
    public activeStorage: String,
    public cronExpression: String,
    public activeStartTime: String,
    public activeEndTime: String
  ) {
  }
}

