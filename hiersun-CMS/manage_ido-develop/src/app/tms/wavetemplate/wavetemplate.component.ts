import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-wavetemplate',
  templateUrl: './wavetemplate.component.html',
  styleUrls: ['./wavetemplate.component.css']
})
export class WavetemplateComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public waveList = [];//波次列表
  public sid=''
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    $('#orderTime').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    this.initWaveList();
  }

  // 获取相应字典
  /*initDict() {
    this.isload = false;
    var str = "'storage_type','storage_type1'"
    var provurl = `/tms-admin/tms/dict-codes?codeListStr=${str}`;
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
  }*/
  // 获取波次列表信息
  initWaveList() {
    this.isload = false;
    var that = this;
    var startSaleTime = $('#orderTime').val().split('--')[0];
    var endSaleTime = $('#orderTime').val().split('--')[1];
    var selecturl = '/tms-admin/wave/selectByParam';
    var selparams = {
      "currentPage": this.pageNum,
      "pageSize": 10,
      "activeStorage": $("#activeStorage").val(),
      "waveName": $('#waveName').val(),
      "waveNo": $('#waveNo').val(),
      "activeEndTime": endSaleTime,
      "activeStartTime": startSaleTime
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.waveList = res['data']['content'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          this.recordTotal = this.waveList ? 1 : 0;
        }
        $('#pagination1').pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.initWaveList();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  resetStorage() {
    $("#orderTime").val("");
    $("#activeStorage").val("");
    this.pageNum = 1;
    this.initWaveList();
  }
  editWave(flag, billNo, pid) {
    console.log(flag, billNo)
    this.route.navigate(['tms/wavetemplate/editwavetemplate'], {
      queryParams: {
        flag, billNo, pid
      }
    });
  }
  delWave(sid) {
    $('#delModal').modal('show');
    this.sid=sid
  }
  datadel() {
    this.isload=false;
    var delUrl = '/tms-admin/wave/delete';
    var params=new HttpParams()
    .set('sid',`${this.sid}`)
    this.httpclient.get(delUrl,{params}).subscribe(
      res=>{
        if (res['code'] == 200) {
          this.showWarnWindow(true, '删除成功!', 'success');
          this.initWaveList();
        }else{
          this.showWarnWindow(true,res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
      that.initWaveList();
    }
  }
}

