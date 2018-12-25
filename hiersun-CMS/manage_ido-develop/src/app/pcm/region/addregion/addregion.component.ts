import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { log } from 'util';
declare var $: any;

@Component({
  selector: 'app-addregion',
  templateUrl: './addregion.component.html',
  styleUrls: ['./addregion.component.css']
})
export class AddregionComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public provList = [];//省列表
  public cityList = [];//市列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.initProvList();
  }
  switchGrade() {
    var grade = Number($('#gradeCode').val());
    console.log(grade);
    switch (grade) {
      case 1:
        $('.provCon').css("display", "none");
        $('.cityCon').css("display", "none");
        break;
      case 2:
        $('.provCon').css("display", "block");
        $('.cityCon').css("display", "none");
        break;
      case 3:
        $('.provCon').css("display", "block");
        $('.cityCon').css("display", "block");
        break;
    }
  }
  // 省
  initProvList() {
    this.isload = false;
    var provurl = '/pcm-admin/regions?parentId=1&levelType=1';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.provList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 市
  initCityList() {
    this.isload = false;
    var parentId = $('#provCode').val()
    var provurl = `/pcm-admin/regions?parentId=${parentId}&levelType=2`;
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cityList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  subRegion() {
    this.isload = false;
    var gradeCode = Number($('#gradeCode').val());
    var zipcode = $('.zipcode').val();
    var name = $('.shortname').val();
    var pinyin = $('.pinyin').val();
    var parentid = $("#cityCode").val() ? $("#cityCode").val() : $('#provCode').val();
    var parname = $("#cityCode").val() ?`${$("#provCode option:selected").text()},${$("#cityCode option:selected").text()}` : `${$("#provCode option:selected").text()}`;
    var mergername =`中国,${parname},${name}`;
    switch (gradeCode) {
      case 2:
        if (!$("#provCode").val()) {
          this.showWarnWindow(true, "请选择省", "warning");
          return
        }
        break;
      case 3:
        if (!$("#cityCode").val()) {
          this.showWarnWindow(true, "请选择市", "warning");
          return
        }
        break;
    }
    if (!zipcode) {
      this.showWarnWindow(true, "编码不能为空", "warning");
      return
    }
    if (!name) {
      this.showWarnWindow(true, "名称不能为空", "warning");
      return
    }
    var selecturl = '/pcm-admin/saveRegion';
    var selparams = {
      "leveltype": gradeCode,
      "parentid": parentid,
      "id": zipcode,
      "name": name,
      "shortname": name,
      "pinyin": pinyin,
      "mergername":mergername
    }
    console.log(selparams)
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "添加成功,返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  goBack() {
    this.route.navigate(['/pcm/region'])
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
      that.route.navigate(['/pcm/region'])
    }
  }
}
