import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-addinstorage',
  templateUrl: './addinstorage.component.html',
  styleUrls: ['./addinstorage.component.css']
})
export class AddinstorageComponent implements OnInit {
  @ViewChild('choosepro') choosepro
  @ViewChild('storagepro') storagepro
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = true;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  productlist = [];    //入库的产品
  storehouses = [];   //仓库信息
  storename: any;    //选择仓库的名称
  storagetypes = [];  //入库类型
  currentsid: any;     //当前sid
  productName: any;  //商品名称
  productCode: any;  //商品编码
  barcode: any;      //商品条码
  size: any;         //商品规格
  inPrice: any;       //单价
  batchNum: any;     //产品批次
  localNum: any;     //库位
  localType: any;     //库位类型
  num: any;          //数量
  amount: any;        //总价
  storageNum: any;    //仓库
  editinstorages: any;  //要编辑的数据
  flag: any;    //判断是添加还是编辑
  sid: any;      //编辑根据sid
  orderNum:any;  //编辑的时候的orderNum
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      that.currentsid = data.sid;
      if (data.flag == 1) {//添加
        that.flag = data.flag;
      } else {//编辑
        that.flag = data.flag;
        that.editinstorage()
      }
    })
    if ($().select2) {
      $('#suppliercode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#instoragestatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    /* $('#creatdata').datetimepicker({
      format: "yyyy-MM-dd hh:mm:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView:2
    }); */
    this.storehouse()
    this.storagetype()
  }
  //仓库列表
  storehouse() {
    let that = this;
    this.isload = false;
    var param = {}
    var storeUrl = "/tms-admin/tms/stores";
    this.httpclient.post(storeUrl, param).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          that.storehouses = res['data'].content;
        } else {
          this.showWarnWindow(true, '仓库查询异常', "warning")
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //入库类型
  storagetype() {
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=in_storage_type';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.storagetypes = res['data'].in_storage_type
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //编辑
  editinstorage() {
    let that = this;
    this.isload = false;
    var storeUrl = "/tms-admin/InStorage/in-storage?sid=" + that.currentsid;
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          that.editinstorages = res['data'];
          //编号
          $("#instorageorder").val(that.editinstorages.orderNum);
          //入库类型
          $("#rklx").val(that.editinstorages.inType)
          //关联订单号
          $("#linkorder").val(that.editinstorages.contractOrder);
          //仓库
          $("#ck").val(that.editinstorages.storageNum);
          //供应商编号
          $("#suppliercode").val(that.editinstorages.supNum);
          //供应商名称：
          $("#suppliername").val(that.editinstorages.supName);
          //供应商联系人：
          $("#supplierman").val(that.editinstorages.contactName);
          //供应商联系方式：
          $("#suppliertel").val(that.editinstorages.phone);
          //制单时间：
          var creattime = that.formatDate(that.editinstorages.createTime, '-');
          console.log(creattime)
          $("#creatdata").val(creattime);
          //制单人：
          $("#pickTime").val(that.editinstorages.createUser);
          //备注
          $("#remark").val(that.editinstorages.remark);
          that.orderNum=that.editinstorages.orderNum;
          that.sid = that.editinstorages.sid;
          that.productlist = that.editinstorages.inStorageDetailList;
          if (that.editinstorages.inStorageDetailList.length > 0) {
            that.recordTotal = 1;
          }

        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //选择产品
  choosepros() {
    $("#productchoose").modal('show');
    this.choosepro.productlist()
  }
  //选择库位
  choosestorage() {
    $("#productstorage").modal('show');
    this.storagepro.storagelist()
  }
  //新增产品
  addproduct() {
    let that = this;
    if ($("#storage").select2('val') == "") {
      this.showWarnWindow(true, '请选择产品仓库', "warning")
    } else {
      if (that.flag == 1) {//添加
        this.storename = $("#storage").select2('val');
      } else {
        this.storename = $("#ck").val();
      }

      $("#myModal .form-control").val("")
      $("#myModal").modal('show');
    }
  }
  //入库产品
  sureproduct() {
    let that = this;
    if ($(".codeproduct").val() == "") {
      this.showWarnWindow(true, '请选择要入库的产品', "warning")
    }
    if ($(".storagemy").val() == "") {
      this.showWarnWindow(true, '请选择入库库位', "warning")
    }
    if ($(".pnum").val() == "") {
      this.showWarnWindow(true, '请输入要入库的数量', "warning")
    }
    if ($(".storagemy").val() != "" && $(".pnum").val() != "") {
      that.productName = $(".nameproduct").val();
      that.productCode = $(".codeproduct").val();
      that.barcode = $(".barcodeproduct").val();
      that.size = $(".ggproduct").val();
      that.inPrice = $(".priceproduct").val();
      that.batchNum = $(".ppc").val();
      that.localNum = $(".storagecode").val();
      that.localType = $(".localtype").val();
      that.num = $(".pnum").val();
      that.amount = parseInt(that.inPrice ? that.inPrice : 0) * parseInt(that.num);
      if (that.flag == 1) {//添加
        that.storageNum = $("#storage").select2("val");
      } else {
        this.storageNum = $("#ck").val();
      }
      //that.storageNum=$("#storage").select2("val");
      var chooselist = {
        productName: that.productName,
        productCode: that.productCode,
        barcode: that.barcode,
        size: that.size,
        inPrice: that.inPrice ? that.inPrice : 0,
        batchNum: that.batchNum,
        localNum: that.localNum,
        localType: that.localType,
        num: that.num,
        amount: that.amount,
        storageNum: that.storageNum
      }
      that.productlist.push(chooselist);
      $("#myModal").modal('hide');
      that.recordTotal = 1;
      console.log(that.productlist)
    }
  }
  //删除
  deletecurrentpro(key) {
    this.productlist.splice(key, 1);
    console.log(this.productlist)
  }
  //保存
  saveinstorage() {
    let that = this;
    if ($("#instoragestatus").select2("val") == "") {
      this.showWarnWindow(true, '请选择入库单类型', 'warning');
      return false;
    }
    if ($(".product_list tr").length == 0) {
      this.showWarnWindow(true, '请选择要入库的商品', 'warning');
      return false;
    }
    this.isload = false;
    var inStoragePara={};
    if(that.flag==1){//添加
      inStoragePara = {
        "address": "",
        "contactName": $("#supplierman").val(),     //供应商联系人
        "contractOrder": $("#linkorder").val(),     //关联单号
        "phone": $("#suppliertel").val(),           //供应商联系电话
        "remark": $("#remark").val(),               //备注
        "storageNum": $("#storage").select2("val"), //仓位编号
        "supName": $("#suppliername").val(),      //供应商名称
        "supNum": $("#suppliercode").val(),       //供应商编号
        "inType": $("#instoragestatus").select2("val"),   //入库类型
        "inStorageDetailList": that.productlist,          //产品
        "stockType":'1001'
      };
    }else{
      inStoragePara = {
        "address": "",
        "contactName": $("#supplierman").val(),     //供应商联系人
        "contractOrder": $("#linkorder").val(),     //关联单号
        "phone": $("#suppliertel").val(),           //供应商联系电话
        "remark": $("#remark").val(),               //备注
        "storageNum": $("#ck").val(), //仓位编号
        "supName": $("#suppliername").val(),      //供应商名称
        "supNum": $("#suppliercode").val(),       //供应商编号
        "inType": $("#rklx").val(),   //入库类型
        "inStorageDetailList": that.productlist,         //产品
        "sid":that.sid,
        "orderNum":that.orderNum,
        "stockType":'1001'
      };
    }
    console.log(inStoragePara)
    var instoragerul = "/tms-admin/InStorage/edit-in-storage";
    this.httpclient.post(instoragerul, inStoragePara).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          that.router.navigateByUrl('/tms/instorage');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //取消弹框
  cancelpro() {
    $("#myModal").modal('hide');
    $(".addproduct .form-control").val("")
  }
  //取消返回列表
  cancelins() {
    window.history.go(-1)
  }
  formatDate(time, Delimiter) {
    Delimiter = Delimiter || '-';
    var now = new Date(time);

    var year = now.getFullYear() + '';
    var month = now.getMonth() + 1 + '';
    var date = now.getDate() + '';
    var hour = now.getHours() + '';
    var minute = now.getMinutes() + '';
    var second = now.getSeconds() + '';

    // 补0
    month = month.length < 2 ? '0' + month : month;
    date = date.length < 2 ? '0' + date : date;
    hour = hour.length < 2 ? '0' + hour : hour;
    minute = minute.length < 2 ? '0' + minute : minute;
    second = second.length < 2 ? '0' + second : second;

    return year + Delimiter + month + Delimiter + date + " " + hour + ":" + minute + ":" + second;
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
