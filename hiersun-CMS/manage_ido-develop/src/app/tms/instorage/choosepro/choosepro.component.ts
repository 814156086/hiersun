import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-choosepro',
  templateUrl: './choosepro.component.html',
  styleUrls: ['./choosepro.component.css']
})
export class ChooseproComponent implements OnInit {

  public isShowWarnWin = false;  // 确认弹窗
  public warnMsg: string;  // 确认窗口提示消息
  public btn_type_css: string;  // 按钮css类型
  public isload = true; // 是否加载
  public pageNum = 1; // 页码
  public pagetotal = ''; // 总页数
  public currentpage = ''; // 当前页码
  public pageSize = 10;
  public recordTotal = 0; // 记录总数
  productlists = [];       // 产品集合
  choosedproname: any;   // 被选中的商品名字
  choosedprocode: any;   // 被选中的商品编码
  choosedbarcode: any;   // 被选中的商品条码
  choosedproprice: any;  // 被选中的商品价格
  choosedprogg: any;     // 被选中的商品规格
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }

  // 产品列表
  productlist() {
    let that = this;
    var param = {
      'searchText': $('.productnamecode').val(),
      'currentPage': that.pageNum,
      'pageSize': 10
    };
    var pgUrl = '/pcm-admin/commodity/getProDetailListForSearch';
    this.httpclient.post(pgUrl, param, this.httpOptions).subscribe(
      res => {
        console.log(res);
        this.isload = true;
        if (res['code'] == 200) {
          if (res['data'].list != null) {
            that.productlists = res['data'].list;
            console.log(that.productlists);
            that.recordTotal = 1;
            $('#paginationpro').pagination({
              currentPage: res['data'].currentPage,
              totalPage: res['data'].pageTotal,
              callback: function (current) {
                that.pageNum = current;
                that.productlist();
              }
            });
          } else {
            that.productlists = [];
            that.recordTotal = 0;
          }
        } else {
          this.showWarnWindow(true, '查询失败!', 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 点击单选框
  myclick(key) {
    this.choosedproname = $('.prodatalist tr').eq(key).find('.choosename').text();
    this.choosedprocode = $('.prodatalist tr').eq(key).find('.choosecode').text();
    this.choosedbarcode = $('.prodatalist tr').eq(key).find('.choosebarcode').text();
    this.choosedproprice = $('.prodatalist tr').eq(key).find('.chooseprice').text();
    this.choosedprogg = $('.prodatalist tr').eq(key).find('.choosegg').text();
    $('.prodatalist tr').eq(key).find('.radiopro').attr('checked', 'checked');
    /* if(this.choosedproname=='--'){
      this.choosedproname=''
    }
    if(this.choosedprocode=='--'){
      this.choosedprocode=''
    }
    if(this.choosedproprice=='--'){
      this.choosedproprice=''
    }
    if(this.choosedprogg=='--'){
      this.choosedprogg=''
    } */
  }

  // 选择
  productgg() {
    let that = this;
    if (that.choosedproname != '' && that.choosedprocode != '') {
      $('.codeproduct').val(that.choosedprocode);
      $('.barcodeproduct').val(that.choosedbarcode);
      $('.nameproduct').val(that.choosedproname);
      $('.ggproduct').val(that.choosedprogg);
      $('.priceproduct').val(that.choosedproprice);
      $('#productchoose').modal('hide');
    } else {
      this.showWarnWindow(true, '请选择产品', 'warning');
    }
  }

  // 重置选择产品框文本框
  resetchoosepro() {
    $('.chooseproduct .form-control').val('');
    this.productlist();
  }

  // 关闭选择产品框
  cancelchoose() {
    $('#productchoose').modal('hide');
  }

  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }

  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = '';
  }

}
