import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import 'rxjs/Rx';
declare var $: any;

@Component({
  selector: 'app-addmodeltype',
  templateUrl: './addmodeltype.component.html',
  styleUrls: ['./addmodeltype.component.css']
})
export class AddmodeltypeComponent implements OnInit {
  public modelCode:string;
  public modelType:string;
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
  }

  submitModel() {
    this.isload = false;
    this.modelCode = $('.modelCode').val();
    this.modelType = $('.modelType').val();
    if (this.modelCode == '') {
      this.showWarnWindow(true, "版库号不能为空", "warning");
      return;
    }
    if (this.modelType == '') {
      this.showWarnWindow(true, "版库类型不能为空", "warning");
      return;
    }

    let param = {
      "code": this.modelCode,
      "type": this.modelType
    };
    let addurl = '/edi-admin/edi-item-code-type/edi/item-code-types';
    this.httpclient.post(addurl, param, this.httpOptions).subscribe(
      res=>{
        this.isload = true;
        if (res == null) {
          this.showWarnWindow(true, "添加成功，返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  goBack() {
    this.route.navigate(['/edi/modelcode'])
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
    let that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/edi/modelcode'])
    }
  }

}
