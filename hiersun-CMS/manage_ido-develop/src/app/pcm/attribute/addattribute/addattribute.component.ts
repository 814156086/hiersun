
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FormControlName, FormControl, FormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: 'app-addattribute',
  templateUrl: './addattribute.component.html',
  styleUrls: ['./addattribute.component.css']
})
export class AddattributeComponent implements OnInit {
  public ishidden = true;//添加属性值列表按钮
  // public chanels: any;
  public valueList = [];//属性值列表
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    // var urllink = '/pcm-admin//channels';
    // var that = this;
    // this.http.get(urllink).map(res => res.json()).subscribe(function (data) {
    //   console.log(data.data)
    //   that.chanels = data.data;
    // }, function (err) {
    //   console.log(err)
    // })
    this.isload = true;
  }
  // 属性值的添加
  addValue() {
    // this.ishidden = false;
    this.valueList.push({
      "valuesName": '',
      'valuesDesc': ''
    })
  }
  // 属性值的删除
  delValue(i) {
    this.valueList.splice(i, 1)
  }
  // 属性值的确认
  /*   saveItem() {
      var that = this;
      var issave = true;
      if ($('.valname').val() == '') {
        this.showWarnWindow(true, "属性值名称不能为空", "warning");
        issave = false;
        return;
      }
      // if ($('.valdesc').val() == '') {
      //   this.isHint = false;
      //   this.hintMsg = '属性值描述不能为空';
      //   setTimeout(function () {
      //     that.isHint = true;
      //     that.hintMsg = '';
      //   }, 1000);
      //   issave = false;
      //   return;
      // }
      if (issave) {
        this.valueList.push({
          valuesDesc: $('.valdesc').val(),
          valuesName: $('.valname').val()
        })
      }
      $('.valdesc').val('')
      $('.valname').val('')
    } */
  // closeItem() {
  //   this.ishidden = true;
  // }
  //添加保存
  subValue() {
    var that = this;
    var issub = true;
    var categoryValueSaveVos = [];
    var trList = $(".allvalue").find('.detlItem');
    trList.each((trindex, tritem) => {
      var tdArr = trList.eq(trindex).find("td");
      var valuesName = tdArr.eq(0).find('input').val();
      var valuesDesc = tdArr.eq(1).find('input').val();
      categoryValueSaveVos.push({
        "valuesName": valuesName,
        "valuesDesc": valuesDesc
      })
    })
    if ($('.proName').val() == '') {
      this.showWarnWindow(true, "属性名称不能为空", "warning");
      issub = false;
      return;
    }
    if ($('.proCode').val() == '') {
      this.showWarnWindow(true, "属性标识不能为空", "warning");
      issub = false;
      return;
    }
    if ($('.typeId').val() == '') {
      this.showWarnWindow(true, "请选择属性类型", "warning");
      issub = false;
      return;
    }
    categoryValueSaveVos.forEach((elem) => {
      if (elem.valuesName == "" || elem.valuesDesc == "") {
        this.showWarnWindow(true, "属性值不能为空", "warning");
        issub = false;
        return;
      }
    })
    this.isload = false;
    var that = this
    var params = {
      categoryValueSaveVos: categoryValueSaveVos,
      // channelCode: $(".chanId").val(),
      channelCode: 0,
      readOnly: $('input[name="readonly"]:checked').attr('title'),
      isErpProp: $('input[name="erp"]:checked').attr('title'),
      status: $('input[name="attributestatus"]:checked').attr('title'),
      propsDesc: $(".seriesms").val(),
      propsName: $(".proName").val(),
      propsCode: $(".proCode").val(),
      isKeyProp: $(".typeId").val()
    }
    var suburl = `/pcm-admin/propsdict/save`
    if (issub) {
      this.httpclient.post(suburl, params, this.httpOptions).subscribe(
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
  }

  goBack() {
    this.route.navigate(['/pcm/attribute'])
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
      that.route.navigate(['/pcm/attribute'])
    }
  }
}
