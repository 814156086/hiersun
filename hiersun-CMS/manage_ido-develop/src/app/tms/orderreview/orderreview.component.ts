import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
import { copyStyles } from '@angular/animations/browser/src/util';
import { TmsprintService } from '../../services/tmsprint.service';
declare var $: any;

@Component({
  selector: 'app-orderreview',
  templateUrl: './orderreview.component.html',
  styleUrls: ['./orderreview.component.css']
})
export class OrderreviewComponent implements OnInit ,AfterViewInit{
  @ViewChild('targetInput') targetInput: ElementRef;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = true;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  saleItemList: any;  //查询发货单
  patternId = '';    //销售单号
  productcodes = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute, private common: TmsprintService, private _elementRef: ElementRef,
    private _render: Renderer2) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.targetInput.nativeElement.focus();
  }
  onEnter(event) {
    var patternId = $.trim($(event.target).val());
    this.patternId = patternId;
    patternId ? this.loadorder(patternId) : this.showWarnWindow(true, "请输入发货单号", 'warning');
  }
  //拣货单
  loadorder(orderno) {
    let that = this;
    this.isload = false;
    var siUrl = '/tms-admin/deliverOrder/query-sale-item?deliverNo=' + orderno;
    this.httpclient.get(siUrl).subscribe(
      res => {
        //console.log(res)
        this.isload = true;
        if (res['code'] == 200) {
          this.saleItemList = res['data']['saleItemList'];
          // this.propNameList = res['data']['propNameList'];
          $.each(this.saleItemList, function (index, obj) {
            that.productcodes.push(obj.barcode);
            //console.log(that.productcodes)
          });
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //tiaoma
  procode(event) {
    let that = this;
    var procode = $.trim($(event.target).val());
    if (that.patternId == "") {
      that.showWarnWindow(true, "请输入发货单号", 'warning');
      $(event.target).val("")
      return false;
    } else {
      var arry = [];
      for (var i = 0; i < that.productcodes.length; i++) {
        if (procode == that.productcodes[i]) {
          var num = parseInt($(".odd").eq(i).find(".sum").text()) + 1;
          $(".odd").eq(i).find(".sum").text(num);
          $(event.target).val("");
          // 光标回到第一个input框
          this.targetInput.nativeElement.focus();
        } else {
          arry.push("0")
        }
      }
      if (arry.length == that.productcodes.length) {
        that.showWarnWindow(true, "该发货单没有此商品条码", 'warning');
      }
    }
    //比较订单数和商品条码数是不是一致
    var flag = 0;
    for (var i = 0; i < $(".odd").length; i++) {
      //console.log($(".odd").eq(i).find("td").eq(3).text()+$(".odd").eq(i).find("td").eq(4).text())
      if ($(".odd").eq(i).find("td").eq(3).text() == $(".odd").eq(i).find("td").eq(4).text()) {
        flag = 1;
      } else {
        flag = 0;
      }
    }
    //console.log(flag)
    if (flag == 1) {
      that.saleItemList = [];
      $("#orderNo").val("");
      $("#product").val("");
      if ($(".printorder").val() == "1") { //打印面单
        that.checkorder();
        that.printorders()
      } else {
        that.checkorder()
      }
    }
  }
  //打印面单
  printorders() {
    let that = this;
    this.isload = false;
    var storeUrl = "/tms-admin/deliverOrder/print-single-record?deliverNos=" + this.patternId + "&operator=" + 'qqq';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          var wzcontent = res['data'][0];
          console.log(wzcontent)
          $("#print").append('<iframe src=' + wzcontent + ' id="printcont" style="width:100%;height:600px;border:none"></iframe>');
          this.common.publicprint();
          $("#print").hide();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  //订单复核
  checkorder() {
    let that = this;
    this.isload = false;
    var storeUrl = "/tms-admin/deliverOrder/review-deliver-order-modify?deliverNos=" + this.patternId + "&operator=" + 'qqq';
    this.httpclient.post(storeUrl, null).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
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
    this.warnMsg = "";
  }
}
