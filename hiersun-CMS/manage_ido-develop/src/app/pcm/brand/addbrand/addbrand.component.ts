
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FormControlName, FormControl, FormGroup, FormArray } from "@angular/forms";
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'

@Component({
  selector: 'app-addbrand',
  templateUrl: './addbrand.component.html',
  styleUrls: ['./addbrand.component.css']
})
export class AddbrandComponent implements OnInit {
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;
  public logoUrl: any;
  public bannerUrl: any;
  public formData = new FormData();
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
  }

  upLogo(event) {
    let file = event.target.files[0];
    this.formData.append('logoPic', file);
  }

  upBanner(event) {
    let fileBanner = event.target.files[0];
    this.formData.append('bannerPic', fileBanner);
  }

  subBrand() {
    var issub = true;
    var that = this;
    if ($('.brName').val() == '') {
      this.showWarnWindow(true, "品牌名称不能为空", "warning");
      return;
    }
    var brLogoImg = $(".brLogo").val();
    if (brLogoImg == "") {
      this.showWarnWindow(true, "logo图片不能为空", "warning");
      return;
    }
    var brBannerImg = $(".brBanner").val();
    if (brBannerImg == "") {
      this.showWarnWindow(true, "banner图片不能为空", "warning");
      return;
    }
    var isDisplayInput = $('input[name="isdislpay"]:checked').attr('title');
    if (!isDisplayInput) {
      this.showWarnWindow(true, "是否展示不能为空", "warning");
      return;
    }
    if ($('.brDesc').val() == '') {
      this.showWarnWindow(true, "品牌描述不能为空", "warning");
      return;
    }
    this.isload = false;
    this.formData.append('brandName', $(".brName").val());
    this.formData.append('spell', $(".spellCn").val());
    this.formData.append('brNameEn', $(".spellCn").val());
    this.formData.append('brandNameEn', $(".brNameEn").val());
    this.formData.append('brandDesc', $(".brDesc").val());
    this.formData.append('isDisplay', $('input[name="isdislpay"]:checked').attr('title'));
    var subcurl = "/pcm-admin//brand/save";
    if (issub) {
      $("#submitBtn").attr("disabled", "disabled");
      this.httpclient.post(subcurl, this.formData).subscribe(
        res => {
          this.isload = true;
          if (res['code'] == 200) {
            this.showWarnWindow(true, "添加成功,返回列表页", "success");
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
        }, (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    }
  }
  goBack() {
    this.route.navigate(['/pcm/brand'])
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
      that.route.navigate(['/pcm/brand'])
    }
  }
}

