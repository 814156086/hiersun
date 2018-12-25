
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';

@Component({
  selector: 'app-editattribute',
  templateUrl: './editattribute.component.html',
  styleUrls: ['./editattribute.component.css']
})
export class EditattributeComponent implements OnInit {
  public atrId: any;//编辑的id
  public ishidden = true;//添加属性值列表按钮
  // public chanId: any;//编辑的渠道id
  public proName: any;//编辑的属性名称
  public proCode: any;//编辑的属性标识
  public typeId: any;//编辑的属性类型id
  public Iserp: any;//编辑是否erp属性
  public readOnly: any;//编辑是否只读属性
  public status: any;//编辑的属性状态
  public seriesms: any;//编辑的属性描述
  public valueList = []//属性值列表
  public chanList = []//渠道列表
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;

  public isload = false;//是否加载  
   httpOptions = {     headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })   };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.atrId = queryParams.atrid;
    });
    // console.log(this.atrId)
  }

  ngOnInit() {
    var that = this;
    // var urllink = '/pcm-admin//channels';
    // var that = this;
    // this.http.get(urllink).map(res => res.json()).subscribe(function (data) {
    //   console.log(data.data)
    //   that.chanList = data.data;
    // }, function (err) {
    //   console.log(err)
    // })
    this.valueList=[];
    var editsurl = `/pcm-admin//propsdict/get_propsdict/${this.atrId}`;
    this.httpclient.get(editsurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        // this.chanId = data.data.channelCode;
        this.proName = res['data']['propsName'];
        this.proCode = res['data']['propsCode'];
        this.typeId = res['data']['isKeyProp'];
        this.readOnly = res['data']['readOnly'];
        this.Iserp = res['data']['isErpProp'];
        this.status = res['data']['status'];
        this.seriesms = res['data']['propsDesc'];
        this.valueList = res['data']['categoryValueSaveVos'];
        // $('.chanId').val(that.chanId)
        $(`input[name='readonly'][title=${this.readOnly}]`).attr("checked", true);//是否只读属性
        $(`input[name='erp'][title=${this.Iserp}]`).attr("checked", true);//是否erp属性
        $(`input[name='attributestatus'][title=${this.status}]`).attr("checked", true);//属性类型
        $('.typeId').val(this.typeId)
      },  (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
 /*  saveItem() {
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
  // 保存
  subeValue() {
    var issub = true;
    var that = this;
    var categoryValueSaveVos = [];
    var etrList = $(".editvalue").find('.editItem');
    etrList.each((trindex, tritem) => {
      var tdArr = etrList.eq(trindex).find("td");
      var valuesName = tdArr.eq(0).find('input').val();
      var valuesDesc = tdArr.eq(1).find('input').val();
      categoryValueSaveVos.push({
        "valuesName": valuesName,
        "valuesDesc": valuesDesc
      })
    })
    if ($('.proName').val() == '') {
      this.showWarnWindow(true, "属性值称不能为空", "warning");
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
    var params = {
      sid: this.atrId,
      categoryValueSaveVos: categoryValueSaveVos,
      // channelCode: $(".chanId").val(),
      channelCode: 0,
      isErpProp: $('input[name="erp"]:checked').attr('title'),
      status: $('input[name="attributestatus"]:checked').attr('title'),
      propsDesc: $(".seriesms").val(),
      propsName: $(".proName").val(),
      propsCode: $(".proCode").val(),
      isKeyProp: $(".typeId").val()
    }
    var subeurl = `/pcm-admin/propsdict/save`
    if (issub) {
      this.httpclient.post(subeurl, params, this.httpOptions).subscribe(
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
