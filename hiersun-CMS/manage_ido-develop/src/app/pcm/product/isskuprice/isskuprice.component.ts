import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-isskuprice',
  templateUrl: './isskuprice.component.html',
  styleUrls: ['./isskuprice.component.css']
})
export class IsskupriceComponent implements OnInit {
  @Output() private isouter = new EventEmitter<Object>();
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;//确认窗口提示消息
  public btn_type_css: string;//按钮css类型
  public isload = false;//是否加载
  public priConList = []//价格控制项的显示
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    this.isload = true;
  }
  initProInfo(cateId:any){
    this.isload = false;
    var promesURl = `/pcm-admin/propsdict/get_category_props_include_values?categorySid=${cateId}&type=1`
    this.httpclient.get(promesURl).subscribe(
      res => {
        this.isload = true;
        // this.editData = res['data'];
        if (res['code'] == 200) {
          this.priConList = res['data'];
          $('#issku_Modal').modal('show');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 确定
  subSkuInfo(){
    if ($('.Not1').val() == '') {
      this.showWarnWindow(true, "红色*为必填项", "warning");
      return;
    }
    var priParameList = [];
    this.priConList.forEach(function (v, i) {
      priParameList.push({
        // level: v.level,
        propName: v.propsName,
        // propSid: v.propsSid,
        valueName: $(`.value${v.propsSid}`).find("option:checked").text() || $(`.pro${v.propsSid}`).val()
        // valueSid: $(`.value${v.propsSid}`).val()
      })
    })
    this.isouter.emit(priParameList);
    $('#issku_Modal').modal('hide');
  }
    // 关闭商品明细弹窗
    closeMoadl(){
      $('#issku_Modal').modal('hide');
    }
  // 全局弹窗
  public showWarnWindow(status:boolean, warnMsg:string, btnType:string) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
