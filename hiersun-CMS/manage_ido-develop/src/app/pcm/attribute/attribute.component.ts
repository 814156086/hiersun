
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FormControlName, FormControl, FormGroup, FormArray } from '@angular/forms';

declare var $: any;
import { Router } from '@angular/router';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  public dataShow = [];// 列表显示
  public currentPage: number;//当前页
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = '';//总页数
  public detailList: AttributeInfo;//详情列表
  public recordTotal = 0;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;

  public isload = false;//是否加载
  constructor(private httpclient: HttpClient, private route: Router) {
  }

  ngOnInit() {
    this.detailList = new AttributeInfo('', '', null, null, null, null, '');
    this.searchattribute();
  }

  editAttribute() {
    // this.detailList = new AttributeInfo('', '', null, null, null, null, '');
    var that = this;
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, '请选择一个属性进行编辑', 'warning');
      return;
    }
    var atrid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/attribute/editattribute'], {
      queryParams: {
        atrid
      }
    });
  }

  // 查询
  searchattribute() {
    var that = this;
    this.isload = false;
    var proparams = {
      'propsName': $('#propName').val(),
      'propsCode': $('#propCode').val(),
      'isKeyProp': $('#propsType').val(),
      'currentPage': this.pageNum,
      'pageSize': this.pageSize,
    };
    var seurl = '/pcm-admin/propsdict/propsdictList';
    this.httpclient.post(seurl, proparams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          const data = res['data'];
          this.dataShow = data['content'];
          this.pagetotal = data['pageTotal'];
          this.currentPage = data['currentPage'];
          this.recordTotal = data['content'] ? 1 : 0;
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $('#pagination1').pagination({
          currentPage: this.currentPage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchattribute();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  // 重置
  resetattribute() {
    $('#propCode').val('');
    $('#propName').val('');
    $('#propsType').val('');
    this.pageNum = 1;
    this.ngOnInit();
  }

  itemDetail(detailId) {
    var burl = `/pcm-admin/propsdict/get_propsdict/${detailId}`;
    this.httpclient.get(burl, this.httpOptions).subscribe(
      res => {
        this.detailList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  normalInputChange = function (event) {
    const reg = new RegExp(' ', 'g');
    event.target.value = $.trim(event.target.value.replace(reg, ''));
  };

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
    this.isShowWarnWin = false;
    this.warnMsg = '';
  }
}

export class AttributeInfo {
  constructor(
    public propsName: String,
    public propsCode: String,
    public isEnumProp: Number,
    public isKeyProp: Number,
    public isErpProp: Number,
    public status: Number,
    public propsDesc: String
  ) {
  }
}
