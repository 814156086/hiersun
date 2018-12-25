import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-addallocate',
  templateUrl: './addallocate.component.html',
  styleUrls: ['./addallocate.component.css']
})
export class AddallocateComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public recordTotal = 0;//是否有数据
  public flag = 1;//1添加 2编辑
  public orderNo: any;//调拨单号Id
  productList: Array<any> = [];//产品列表
  stockProductList: Array<any> = [];//调拨产品列表
  public storageList = [];//仓库列表
  public tempDelIndex:number;
  transferOrderList : Array<TransferOrder> = [] ;//调度单列表
  delTransferOrderList : Array<TransferOrder> = [] ;//调度单列表-存放删除掉的调度单信息

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.flag = queryParams.flag;
      this.orderNo = queryParams.locateId;
    });
  }

  ngOnInit() {
    $('#tableTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    this.initstorageList();
    //this.initOrderList();
    this.isload = true;
  }

  // 获取仓库列表信息
  initstorageList() {
    this.isload = false;
    var that = this;
    var selecturl = '/tms-admin/tms/stores';
    var selparams = {
      "unlimit":1
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.storageList = res['data']['content'];
          //初始化调拨单列表
          if(this.flag == 2){
            this.initOrderList();
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }

  //初始化调拨单信息
  initOrderList(){
    this.isload = false;
    let selecturl = '/tms-admin/tms/trans-order/list';
    let selparams = {
      "orderNo":this.orderNo
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.transferOrderList = res['data']['content'];
          //拆分成产品列表
          this.transferOrderList.forEach(item=>{
            this.stockProductList.push(new TransferProduct(item.sid,item.orderNo,item.productName,item.barcode,item.num,'默认正式库位',0));
          });
          console.log("=====初始化=======");
          console.log(this.stockProductList);
          let o = this.transferOrderList[0];
          let _fromNo = o.fromStorageNum;
          let _toNo = o.toStorageNum;
          $("#txtReOrderNo").val(o.contractOrder);
          $("#fromStorage option").each(function () {
            var txt = $(this).val();
            if(txt.indexOf(_fromNo)!=-1){
              $("#fromStorage").val(txt);
            }
          });
          $("#toStorage option").each(function () {
            var txt = $(this).val();
            if(txt.indexOf(_toNo)!=-1){
              $("#toStorage").val(txt);
            }
          });
          $("#remark").val(o.remark);
          $("#orderNo").val(o.orderNo);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }

  // 新增产品
  addProduct() {
    var str = $("#fromStorage").val();
    if(str == ""){
      this.showWarnWindow(true, "请选择调拨仓库", "warning");
      return;
    }
    $('#modal_product').modal('show')
  }
  // 搜索
  loadProductList() {
    var str = $("#fromStorage").val();
    this.isload = false;
    let shopNo = str.split("-")[0];
    var selecturl = '/tms-admin/tms/trans-order/prolist';
    var selparams = {
      "shopNo":shopNo,
      "supplyProductNo":$("#barCode").val()
    }
    this.httpclient.post(selecturl, selparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.productList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  // 选择
  subProduct() {
    let transferProList =  $('.transferPro input[type="checkbox"]:checked');
    /*console.log(transferProList);*/
    if(transferProList.length==0){
      this.showWarnWindow(true, "请选择调度产品信息", "warning");
      return;
    }
    //检查库存
    var reg = /^[\d]+$/;
    for(var obj of transferProList){
      let num = $("#proNum_"+obj.title).val();
      if(num==""||!reg.test(num)||num<=0){
        this.showWarnWindow(true, "请输入正确的商品数量", "warning");
        return;
      }
     /* console.log($("#proNum_"+obj.title).attr("title"));
      console.log(num);*/
      if(num > parseInt($("#proNum_"+obj.title).attr("title"))){
        this.showWarnWindow(true, "调度数量不能大于库存数量", "warning");
        return;
      }
    }
    //this.clearTransferList();
    $('#modal_product').modal('hide');
    /*console.log(this.productList);*/
    this.productList.forEach(item=>{
      for(var obj of transferProList){
        if(item.barcode==obj.title){
          let pro = new TransferProduct('','',item.shoppeProName,item.barcode,$("#proNum_"+item.barcode).val(),'默认正式库位',1);
          this.stockProductList.push(pro);
        }
      }
    });
    console.log("----");
    console.log(this.stockProductList);
   /* for(let i in this.productList){
      for(let j in transferProList){
        console.log($(transferProList[j]));
        console.log(this.productList[i]['barcode']+"----")
      }
    }*/
    this.clearTransferList();
  }
  // 保存
  saveProduct() {
      this.isload = false;
      let fromStorageNum = $("#fromStorage").val();
      let toStorageNum =$("#toStorage").val();
      let remark =$("#remark").val();
      let contractOrder =$("#txtReOrderNo").val();

      //let realNum =$("#toStorage").val();
      if(fromStorageNum == ""){
        this.showWarnWindow(true, "调拨仓库不能为空", "warning");
        this.isload = true;
        return;
      }
      if(toStorageNum == ""){
        this.showWarnWindow(true, "调拨至仓库不能为空", "warning");
        this.isload = true;
        return;
      }
      if(this.stockProductList.length==0){
        this.showWarnWindow(true, "请选择调拨商品", "warning");
        this.isload = true;
        return;
      }
      let _fromStorageNum = fromStorageNum.split("--")[1];
      let _toStorageNum = toStorageNum.split("--")[1];
      let nextApproverId = toStorageNum.split('--')[0];
      let nextApproverName = $("#toStorage").find("option:selected").text();
      let _orderNo = $("#orderNo").val();
      this.transferOrderList = [];
      //拆分组合调度单模板
      this.stockProductList.forEach(item=>{
          let oItem = new TransferOrder(item.sid,_orderNo,_fromStorageNum,_toStorageNum,item.productName,item.barcode,item.num,item.num,nextApproverId,nextApproverName,remark,contractOrder,item.actFlag)
          this.transferOrderList.push(oItem);
      });
      console.log("---------------------");
      console.log(this.transferOrderList)
      if(this.flag == 2){
        //合并增删改的所有list
        console.log("开始合并");
        this.delTransferOrderList.forEach(item=>{
          this.transferOrderList.push(item);
        })
        console.log(this.transferOrderList);
      }

    //请求接口:
    let apiUrl = this.flag == 1 ? "/tms-admin/tms/trans-order/create" : "/tms-admin/tms/trans-order/update";
    this.httpclient.post(apiUrl, this.transferOrderList, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.showWarnWindow(true, "操作成功,返回列表页", "success");
        }else{
          this.showWarnWindow(true, "操作处理失败", "danger");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    this.isload = true;
  }
  //清除调度产品
  clearTransferList(){
    this.productList=[];
    $("#barCode").val("");
    $("#proName").val("");
    $("#stockLocation").val("");
  }
  // 删除
  delProduct(pcode) {
    $('#delModal').modal('show');
    this.tempDelIndex = pcode;
  }
  // 确认删除
  datadel() {
    let tempObj = this.stockProductList[this.tempDelIndex];
    this.stockProductList.splice(this.tempDelIndex,1);
    if(tempObj.sid != ""){
      console.log("删除掉:");
      console.log(tempObj);
      //查找要删除的项
      this.transferOrderList.forEach(item=>{
        if(tempObj.sid == item.sid){
          item.actFlag = 2;
          this.delTransferOrderList.push(item);
        }
      })
    }else{
      console.log("不删除");
    }
    console.log("====删除list")
    console.log(this.delTransferOrderList);
  }
  // 返回
  goBack() {
    window.history.go(-1);
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
      that.route.navigate(['/tms/allocate'])
    }
  }
}

/**
 * 调度单商品列表
 */
export class TransferProduct {
  constructor(
    public sid:String,
    public orderNo:String,
    public productName:String,
    public barcode:String,
    public num:String,
    public proStockLocation:String,
    public actFlag:Number
  ){}
}

/**
 * 调度单信息,与商品保持一致
 */
export class TransferOrder {
  constructor(
    public sid:String,
    public orderNo:String,
    public fromStorageNum:String,
    public toStorageNum:String,
    public productName:String,
    public barcode:String,
    public num:String,
    public realNum:Number,
    public nextApproverId:String,
    public nextApproverName:String,
    public remark:String,
    public contractOrder:String,
    public actFlag:Number
  ){}
}
