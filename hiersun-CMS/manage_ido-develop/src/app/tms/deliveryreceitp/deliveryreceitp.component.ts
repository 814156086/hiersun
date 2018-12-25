import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-deliveryreceitp',
  templateUrl: './deliveryreceitp.component.html',
  styleUrls: ['./deliveryreceitp.component.css']
})
export class DeliveryreceitpComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  deliveryList = [];   //交接单列表
  deliverydetails = [];  //交接单详情
  handoverNo = '';    //交接单号
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    $('#pickTime').datetimepicker({
      format: "yyyy/MM/dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView:2
    });

    this.delivery();
  }
  delivery() {
    let that = this;
    this.isload = false;
    var sourceUrl = "/tms-admin/handoverOrder/list?currentPage=" + that.pageNum + '&pageSize=10' + '&createTime=' + $("#pickTime").val();
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['data'].content) {
          this.deliveryList = res['data'].content;
          this.recordTotal = 1;
        } else {
          this.recordTotal = 0;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //详情、
  deliverydetail(handoverNo) {
    $("#myModal").modal('show');
    this.handoverNo = handoverNo;
    var sourceUrl = "/tms-admin/handoverOrder/getHandoverOrderItem/" + handoverNo;
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        this.deliverydetails = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //删除提示
  deleteordertips(order) {
    console.log(order);
    $("#deletemodal").modal('show');
    $(".handovernohidden").val(order)
  }
  //删除
  deleteorder() {
    var sourceUrl = "/tms-admin/handoverOrder/delete/" + $(".handovernohidden").val();
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        $("#deletemodal").modal('hide');
        this.delivery();
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //添加交接单
  adddelivery(flag, handoverNo) {
    this.route.navigate(['tms/deliverydetail'], {
      queryParams: {
        flag, handoverNo
      }
    });
  }
  //重置
  reset() {
    $(".form-control").val("");
    this.delivery()
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
