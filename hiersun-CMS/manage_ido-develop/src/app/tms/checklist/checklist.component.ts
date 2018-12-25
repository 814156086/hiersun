import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"]
})
export class ChecklistComponent implements OnInit {
  // @ViewChild("reviewcheck") reviewcheck;
  public isShowWarnWin = false; //确认弹窗
  public warnMsg: string; //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false; //是否加载
  public pageNum = 1; //页码
  public pagetotal = ""; //总页数
  public currentpage = ""; //当前页码
  public pageSize = 10;
  public recordTotal = 0; //记录总数
  public orderstate = []; //状态列表
  public checkList = []; //盘点列表
  orderNum: any;//盘点单号
  sid: any;//主键


  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };

  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    $("#saleTime").daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: "--",
      format: "YYYY-MM-DD HH:mm:ss",
      locale: {
        applyLabel: "确定",
        cancelLabel: "取消",
        fromLabel: "开始时间",
        toLabel: "截止时间"
      }
    });
    this.orderstatus();
    this.loadCheckList();
  }
  //单号状态
  orderstatus() {
    this.isload = false;
    var storeUrl = "/tms-admin/dict/dict-codes?codeListStr=review_status";
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res);
        if (res["code"] == 200) {
          this.isload = true;
          this.orderstate = res["data"].review_status;
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  // 搜索
  loadCheckList() {
    let that = this;
    this.isload = false;
    var saleTimeStart = "";
    var saleTimeEnd = "";
    var orderNum = $("#orderNo").val(),
      contractOrder = $("#contractOrder").val(),
      status = $("#orderstatus").val()
    if ($("#saleTime").val() == "") {
      saleTimeStart = "";
      saleTimeEnd = "";
    } else {
      saleTimeStart = $("#saleTime")
        .val()
        .split("--")[0];
      saleTimeEnd = $("#saleTime")
        .val()
        .split("--")[1];
    }
    var params = new HttpParams()
      .set("currentPage", `${this.pageNum}`)
      .set("pageSize", "10")
      .set("startTime", saleTimeStart)
      .set("endTime", saleTimeEnd)
      .set("orderNum", orderNum)
      .set("contractOrder", contractOrder)
      .set("status", status);
    var sourceUrl = "/tms-admin/check/stocks";
    this.httpclient.get(sourceUrl, { params }).subscribe(
      res => {
        console.log(res);
        this.isload = true;
        if (res["data"].content.length > 0) {
          that.checkList = res["data"]['content'];
          that.recordTotal = 1;
          $("#pagination1").pagination({
            currentPage: res["data"].currentPage,
            totalPage: res["data"].pageTotal,
            callback: function (current) {
              that.pageNum = current;
              that.loadCheckList();
            }
          });
        } else {
          that.checkList = [];
          that.recordTotal = 0;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 重置
  reset() {
    $(".form-control").val("");
    $("#instoragestatus").select2("val", null);
    this.loadCheckList();
  }
  // 全选
  allchoose() { }

  //查看
  reviewCheck(billNo, pid, status) {
    // this.reviewcheck.loadReviewMoadl();
    this.route.navigate(['tms/checklist/reviewcheck'], {
      queryParams: {
        billNo, pid, status
      }
    });
  }
  // 编辑
  editCheck(billNo, pid) {
    this.route.navigate(['tms/checklist/editcheck'], {
      queryParams: {
        billNo, pid
      }
    });
  }
  // 上传
  uploadCheck(billNo, pid) {
    this.route.navigate(['tms/checklist/uploadcheck'], {
      queryParams: {
        billNo, pid
      }
    });
  }
  //删除
  deleteinstorage(orderNum, sid) {
    this.orderNum = orderNum;
    this.sid = sid;
    $("#myModal").modal("show");
  }
  sureDelete() {
    var delUrl = '/tms-admin/check/edit-check-stock';
    var params = new HttpParams()
      .set('orderNum', `${this.orderNum}`)
      .set('sid', `${this.sid}`)
    this.httpclient.delete(delUrl, { params }).subscribe(
      res => {
        if (res['code'] == 200) {
          $("#myModal").modal("hide");
          this.showWarnWindow(true, '删除成功!', 'success');
          this.loadCheckList();
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
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
