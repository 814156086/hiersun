
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';

@Component({
  selector: 'app-editbrand',
  templateUrl: './editbrand.component.html',
  styleUrls: ['./editbrand.component.css']
})
export class EditbrandComponent implements OnInit {
  public brdId: any;//编辑的id
  public brName: any;//编辑的品牌名称
  public spellCn: any;//编辑的中文拼音
  public brNameCn: any;//编辑的中文名称
  public brNameEn: any;//编辑的英文名称
  public brLogo: any;//编辑的logo图片
  public brBanner: any;//编辑的banner图片
  public brShow: any;//编辑的是否展示
  public brDesc: any;//编辑的品牌描述
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;

  public isload = false;//是否加载
  public formData = new FormData();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private sanitizer: DomSanitizer, private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.brdId = queryParams.brid;
    });
  }

  ngOnInit() {
    var that = this;
    var editchurl = `/pcm-admin//brand/${this.brdId}/`;
    this.httpclient.get(editchurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.brName = res['data']['brandName'];
          this.spellCn = res['data']['spell'];
          this.brNameEn = res['data']['brandNameEn'];
          this.brShow = res['data']['isDisplay'];
          this.brLogo = this.sanitizer.bypassSecurityTrustResourceUrl(res['data']['brandpic1']);
          this.brBanner = this.sanitizer.bypassSecurityTrustResourceUrl(res['data']['brandpic2']);
          this.brDesc = res['data']['brandDesc'];
          $(`input[name='isdislpay'][title=${this.brShow}]`).attr("checked", true);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )

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
    var isDisplayInput = $('input[name="isdislpay"]:checked').attr('title');
    if (!isDisplayInput) {
      this.showWarnWindow(true, "是否展示不能为空", "warning");
      return;
    }
    if ($('.brDesc').val() == '') {
      this.showWarnWindow(true, "品牌描述不能为空", "warning");
      return;
    }
    this.formData.append('sid ', this.brdId);
    this.formData.append('brandName', $(".brName").val());
    this.formData.append('spell', $(".spellCn").val());
    this.formData.append('brNameEn', $(".spellCn").val());
    this.formData.append('brandNameEn', $(".brNameEn").val());
    this.formData.append('brandDesc', $(".brDesc").val());
    this.formData.append('isDisplay', $('input[name="isdislpay"]:checked').attr('title'));
    this.isload = false;
    $("#submitBtn").attr("disabled", "disabled");
    var subcurl = "/pcm-admin//brand/modify";
    if (issub) {
      // this.http.post(subcurl, this.formData).pipe(map(res => res.json())).subscribe(
      this.httpclient.post(subcurl, this.formData).subscribe(
        res => {
          // console.log(data);
          this.isload = true;
          if (res['code'] == 200) {
            this.showWarnWindow(true, "修改成功,返回列表页", "success");
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
        }, function (err) {
          console.log(err)
        })
    }
  }
  goBack() {
    this.route.navigate(['/pcm/brand']);
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
