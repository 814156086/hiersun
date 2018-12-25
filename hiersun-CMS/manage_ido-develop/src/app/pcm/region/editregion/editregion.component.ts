import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-editregion',
  templateUrl: './editregion.component.html',
  styleUrls: ['./editregion.component.css']
})
export class EditregionComponent implements OnInit {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public regionMesg:RegionInfo;//指定区域列表
  public regionId: any;//区域Id
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.regionId = queryParams.regionid;
    });
  }
  ngOnInit() {
    this.initRegionInfo();
    this.regionMesg = new RegionInfo('', '','');
  }
  initRegionInfo() {
    this.isload = false;
    var provurl = `/pcm-admin/region/superiors/${this.regionId}`;
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          res['data'].forEach(element => {
            if (this.regionId == element.id) {
              this.regionMesg=element
            }
          });
        }
        console.log(this.regionMesg);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }

  subRegion() {
    this.isload = false;
    var regionId = this.regionId;
    var name = $('.shortname').val();
    var pinyin = $('.pinyin').val();
    if (!name) {
      this.showWarnWindow(true, "名称不能为空", "warning");
      return
    }
    var selecturl = '/pcm-admin/updateRegion';
    var selparams = {
      "id": regionId,
      "name": name,
      "pinyin": pinyin,
    }
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
export class RegionInfo {
  constructor(
	public id: String,
	public name: String,
	public pinyin: String
  ) {
  }
}