import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any

@Component({
  selector: 'app-faretemplate',
  templateUrl: './faretemplate.component.html',
  styleUrls: ['./faretemplate.component.css']
})
export class FaretemplateComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public tempList = [];//模板列表
  public sid: any;//模板id
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.loadTempList();
  }
  loadTempList() {
    this.isload = false;
    var tempurl = '/tms-admin/shipping/selectList';
    this.httpclient.get(tempurl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          console.log(res);
          this.tempList = res['data'];
          console.log(this.tempList);
          this.tempList.forEach((value, index) => {
            var shipMeList = value.shippingMethods;
            shipMeList.forEach((element, value) => {
              if (element.shippingMethod == 1 && element.isDefalut == 0) {
                var regionName = "";
                JSON.parse(element.deliverRegion).forEach(element => {
                  regionName += element.name + "、"
                });
                var regionName = regionName.substring(0, regionName.length - 1)
                element.regionName = regionName;
              } else if (element.shippingMethod == 3) {
                var regionName = "";
                JSON.parse(element.deliverRegion).forEach(element => {
                  regionName += element.name + "、"
                });
                var regionName = regionName.substring(0, regionName.length - 1)
                element.regionName = regionName;
              }
            });
          })
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 编辑模板
  editTemplate(sid) {
    this.route.navigate(['tms/faretemplate/edittemp'], {
      queryParams: {
        sid
      }
    });
  }
  // 删除模板
  delTemplate(sid) {
    this.sid = sid;
    console.log(sid)
    $('#delModal').modal('show')
  }
  datadel() {
    this.isload = false;
    var delturl = `/tms-admin/shipping/delete?sid=${this.sid}`;
    this.httpclient.get(delturl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "删除成功！", "success")
          this.loadTempList();
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
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
  }
}
