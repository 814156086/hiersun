import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: "app-editcheck",
  templateUrl: "./editcheck.component.html",
  styleUrls: ["./editcheck.component.css"]
})
export class EditcheckComponent implements OnInit {
  public isShowWarnWin = false; //确认弹窗
  public warnMsg: string; //确认窗口提示消息
  public btn_type_css: string; //按钮css类型
  public isload = false; //是否加载
  public pageNum = 1; //页码
  public pagetotal = ""; //总页数
  public currentpage = ""; //当前页码
  public pageSize = 10;
  public recordTotal = 0; //记录总数
  storehouses = []; //仓库列表
  storename: any; //选择仓库的名称
  headerList = []; //动态规格列表
  productlists = []; //新增产品弹窗列表
  echeckedList = []; //选中的列表
  public checkMesg: CheckInfo;
  public billNo: any;
  public pid: any;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };
  constructor(
    private httpclient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.pid = queryParams.pid;
    });
  }

  ngOnInit() {
    // $("#creatdata").datetimepicker({
    //   format: "yyyy-MM-dd",
    //   showMeridian: false,
    //   autoclose: true,
    //   todayBtn: true,
    //   minView: 2
    // });
    // if ($().select2) {
      //   $("#storage").select2({
        //     placeholder: "Select",
        //     allowClear: true
        //   });
        // }
    this.checkMesg = new CheckInfo('', '', '', '', '', '');
    this.storehouse();
    this.loadEditCheck();
  }
  loadEditCheck(){
    this.isload=false;
    var editUrl='/tms-admin/check/stock-info';
    var params=new HttpParams()
    .set('orderNum',`${this.billNo}`)
    this.httpclient.get(editUrl,{params}).subscribe(
      res=>{
        this.isload = true;
        if (res['code'] == 200) {
          this.checkMesg=res['data'];
          this.echeckedList=res['data']['checkDataList'];
          this.echeckedList.forEach(elem=>{
            elem['productCode']=elem['productNum'];
          })
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  addproduct() {
    // if ($("#storage").select2("val") == "") {
    //   this.showWarnWindow(true, "请选择产品仓库", "warning");
    // } else {
      // this.storename = $("#storage").select2("val");
      this.pageNum = 1;
      this.productlist();
      $("#myModal .form-control").val("");
      $("#myModal").modal("show");
    // }
  }
  // 产品列表
  productlist() {
    let that = this;
    var param = {
      searchText: $(".productnamecode").val(),
      currentPage: that.pageNum,
      pageSize: 10
    };
    var pgUrl = "/pcm-admin/commodity/getProDetailListForSearch";
    this.httpclient.post(pgUrl, param, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res["code"] == 200) {
          if (res["data"].list != null) {
            this.productlists = res["data"]['list'];
            this.headerList = res["data"]['headers'];
            that.recordTotal = 1;
            $("#paginationpro").pagination({
              currentPage: res["data"].currentPage,
              totalPage: res["data"].pageTotal,
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
          this.showWarnWindow(true, "查询失败!", "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 重置选择产品框文本框
  resetchoosepro() {
    $(".chooseproduct .form-control").val("");
    this.productlist();
  }
  // 点击单选框
  myclick() { }
  // 选择
  productgg() {
    const checkedRows = $('td input[name="pro_check"]:checked').parents("tr");
    if (checkedRows.length == 0) {
      this.showWarnWindow(true, "请选择产品信息!", "warning");
      return
    }
    var isRepeat = false;
    checkedRows.each((index, element) => {
      var barcode = $($(element).children('.choosebarcode')).text();
      isRepeat = this.echeckedList.some((i, v) => i.barcode == barcode)
      if (!isRepeat) {
        this.echeckedList.push(this.productlists.filter((v, i) => v.barcode == barcode)[0]);
      } else {
        this.showWarnWindow(true, `不能重复选择条码为${barcode}的产品!`, 'warning');
        return
      }
    })
    if (!isRepeat) {
      $("#myModal").modal("hide");
    }
  }
  // 删除
  delProItem(productCode) {
    this.echeckedList.forEach((v, i) => {
      if (v.productCode == productCode) {
        this.echeckedList.splice(i, 1)
      }
    })
  }
  // 保存盘点单
  saveCheck() {
    var storageNum = this.checkMesg.storageNum,
      contractOrder = $("#contractOrder").val(),
      createUser = $("#createUser").val(),
      createTime = $("#creatdata").val(),
      remark = $("#remark").val();
    if (!storageNum) {
      this.showWarnWindow(true, "请选择仓库", 'warning');
      return;
    }
    if (!this.echeckedList.length) {
      this.showWarnWindow(true, "请选择要入库的产品", 'warning');
      return;
    }
    var checkDataList = this.echeckedList;
    checkDataList.forEach((elem) => {
      elem['storageNum'] = this.checkMesg.storageNum;
      elem['productNum'] = elem['productCode'];
    })
    this.isload = false;
    var addUrl = '/tms-admin/check/edit-check-stock';
    var params = {
      "sid":this.pid,
      "orderNum": this.checkMesg.orderNum,
      "contractOrder": contractOrder, //关联单号
      "createUser": createUser,//制单人
      // "createTime": createTime,//制单时间
      "storageNum": this.checkMesg.storageNum, //仓库
      "remark": remark, //备注
      "checkDataList": checkDataList
    }
    this.httpclient.post(addUrl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '保存成功！', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      }
    )
  }
  //仓库列表
  storehouse() {
    this.isload = false;
    var param = {};
    var storeUrl = "/tms-admin/tms/stores";
    this.httpclient.post(storeUrl, param).subscribe(
      res => {
        if (res["code"] == 200) {
          this.isload = true;
          this.storehouses = res["data"]['content'];
        } else {
          this.showWarnWindow(true, "仓库查询异常", "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  //取消返回列表
  cancelchk() {
    window.history.go(-1);
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(["/tms/checklist"]);
    }
  }
}
export class CheckInfo {
  constructor(
	public orderNum: String,
  public storageNum: String,
  public contractOrder: String,
  public createUser: String,
  public createTime: String,
  public remark: String
  ) {
  }
}