import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.css']
})
export class AllocateComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1//当前页码
  public recordTotal = 0;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public allocateList = [];//调拨列表
  public orderProList = [];//订单下商品列表
  public delOrderNo:String;//删除订单号
  public createOrderTime:String;//制单日期
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    $('#beginTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    $('#endTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    this.initAllocateList();
  }
  // 查询
  initAllocateList() {
    this.isload = false;
    let selecturl = '/tms-admin/tms/trans-order/list';
    let selparams = {
      "orderNo":$("#orderNo").val(),
      "orderStatus":$("#orderStatus").val(),
      "beginTime":$("#beginTime").val() != '' ? new Date($('#beginTime').val()+" 00:00:00").getTime() : '',
      "endTime":$("#endTime").val() != '' ? new Date($('#endTime').val()+" 00:00:00").getTime() : ''
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.allocateList = res['data']['content'];
          this.recordTotal = res['data']['recordTotal'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  // 重置
  resetAllocate() {
    $("#orderNo").val("");
    $("#beginTime").val("");
    $("#endTime").val("");
    this.initAllocateList();
  }
  // 查看
  showOrderDetail(code, act) {
    this.isload = false;
    let selecturl = '/tms-admin/tms/trans-order/list';
    let selparams = {
      "orderNo":code
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.orderProList = res['data']['content'];
          let o = this.orderProList[0];
          $("#review_orderNo").text(o.orderNo);
          if(o.orderStatus == 0){
            o.orderStatus = "待审核";
          }else if(o.orderStatus == 1){
            o.orderStatus = '审核成功';
          }else if(o.orderStatus == -1){
            o.orderStatus = '审核失败';
          }
          $("#review_orderStatus").text(o.orderStatus);
          $("#review_contractOrder").text(o.contractOrder);
          $("#review_createUserName").text(o.createUserName);
          //$("#review_createTime").text(o.createTime.format("YYYY-MM-dd"));
          this.createOrderTime = o.createTime;
          $("#review_remark").text(o.remark);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    if(act == 'r'){
      $("#review_btn_suc").hide();
      $("#review_btn_fail").hide();
    }else{
      $("#review_btn_suc").show();
      $("#review_btn_fail").show();
    }
    $("#modal_review").modal('show');
    this.isload = true;
  }
  // 编辑
  editAlloate(flag, locateId) {
    this.route.navigate(['tms/allocate/addallocate'], {
      queryParams: {
        flag, locateId
      }
    });
  }
  // 删除
  delAllocate(code) {
    $('#delModal').modal('show');
    this.delOrderNo = code;
  }
  // 确认删除
  datadel() {
    this.isload = false;
    let selecturl = '/tms-admin/tms/trans-order/list';
    let selparams = {
      "orderNo":this.delOrderNo
    }
    let delList = [];
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
            let resultList = res['data']['content'];
            console.log(resultList);
            for (var i of resultList){
              delList.push(new TransferOrderDeleteVo(i.sid,1));
            }
          //提交删除
          this.httpclient.post("/tms-admin/tms/trans-order/status", delList, this.httpOptions).subscribe(
            resItem => {
              if (resItem['code'] == 200) {
                this.initAllocateList();
              }
            });
        }
      });
  }
  //审核调度单
  reviewOrder(orderStatus) {
    this.isload = false;
    let paramList = [];
    this.orderProList.forEach(item=>{
        paramList.push(new TransferOrderReviewVo(item.sid,orderStatus));
    });
    console.log("==================")
    console.log(paramList);
    this.httpclient.post("tms-admin/tms/trans-order/status", paramList, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          $('#modal_review').modal('hide');
          this.orderProList = [];
          this.initAllocateList();
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  // 取消
  clearTransferList() {

  }
}

/**
 * 审核参数
 */
export class TransferOrderReviewVo {
  constructor(
    public sid : number,
    public orderStatus:number,
  ){}
}

/**
 * 删除参数
 */
export class TransferOrderDeleteVo {
  constructor(
    public sid : number,
    public ifDelete:number,

  ){}
}
