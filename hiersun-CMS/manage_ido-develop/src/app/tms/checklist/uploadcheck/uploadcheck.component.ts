import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-uploadcheck',
  templateUrl: './uploadcheck.component.html',
  styleUrls: ['./uploadcheck.component.css']
})
export class UploadcheckComponent implements OnInit {
  @ViewChild('choosepro') choosepro
  @ViewChild('storagepro') storagepro
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
  localStores = [];//库位列表
  storename: any; //选择仓库的名称
  headerList = []; //动态规格列表
  ucheckedList = []; //选中的列表
  public ucheckMesg: CheckInfou;
  public billNo: any;
  public pid: any;
  public isAllSave = true;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };
  constructor(private httpclient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.pid = queryParams.pid;
    });
  }

  ngOnInit() {
    this.ucheckMesg = new CheckInfou('', '', '', '', '', '');
    this.storehouse();
    this.loadEditCheck();
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
  // 加载编辑信息
  loadEditCheck() {
    this.isload = false;
    var editUrl = '/tms-admin/check/stock-info-book';
    var params = new HttpParams()
      .set('orderNum', `${this.billNo}`)
    this.httpclient.get(editUrl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.ucheckMesg = res['data'];
          this.storename = res['data']['storageNum']; /* 双击选择库位显示 */
          this.ucheckedList = res['data']['checkDataList'];
          // this.ucheckedList.forEach(elem => {
          //   elem['productCode'] = elem['productNum'];
          // })
          this.loadLocalstore();
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载库位
  loadLocalstore() {
    this.isload = false;
    var stoUrl = '/tms-admin/local/tms-store-local';
    var params = new HttpParams()
      .set('unlimit', '1')
      .set('storageNum', `${this.storename}`)
    this.httpclient.get(stoUrl, { params }).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.localStores = res['data']['content']
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
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
    this.choosepro.productlist();
  }
  //选择库位
  choosestorage() {
    $("#productstorage").modal('show');
    this.storagepro.storagelist();
  }
  // 新增
  addproduct() {
    // let that = this;
    if ($("#ustorage").val() == "") {
      this.showWarnWindow(true, '请选择产品仓库', "warning")
    } else {
      $("#myModal .form-control").val("")
      $("#myModal").modal('show');
    }
  }
  //入库产品 新增 保存
  sureproduct() {
    let that = this;
    if ($(".codeproduct").val() == "") {
      this.showWarnWindow(true, '请选择要入库的产品', "warning");
      return
    }
    if ($(".storagemy").val() == "") {
      this.showWarnWindow(true, '请选择入库库位', "warning");
      return
    }
    if ($(".pnum").val() == "") {
      this.showWarnWindow(true, '请输入要入库的数量', "warning");
      return
    }
    if ($(".storagemy").val() != "" && $(".pnum").val() != "") {
      var productName = $(".nameproduct").val();
      var productCode = $(".codeproduct").val();
      var barcode = $(".barcodeproduct").val();
      var size = $(".ggproduct").val();
      var inPrice = $(".priceproduct").val();
      var batchNum = $(".ppc").val();
      var localName = $(".storagemy").val();
      var localNum = $(".storagecode").val();
      var localType = $(".localtype").val();
      var num = $(".pnum").val();
      var amount = parseInt(inPrice ? inPrice : 0) * parseInt(num);
      var storageNum = this.storename;
      var chooselist = {
        'barcode': barcode,
        'batchNum': batchNum,
        'firstQty': num,
        'localNum': localNum,
        'localName': localName,
        'localQty': 0,
        'localType': localType,
        'orderNum': this.billNo,
        'productName': productName,
        'productNum': productCode,
        'storageNum': storageNum,
        'size': size
        // 'inPrice': inPrice ? inPrice : 0,
        // 'amount': amount,
      }

      this.recordTotal = 1;
      var uaUrl = '/tms-admin/check/edit-check-data';
      this.httpclient.post(uaUrl, chooselist, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            console.log(res);
            this.loadEditCheck();
            $("#myModal").modal('hide');
            // this.ucheckedList.push(chooselist);

          } else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      )
    }
  }
  //取消弹框
  cancelpro() {
    $("#myModal").modal('hide');
    $(".addproduct .form-control").val("")
  }
  // 编辑保存
  saveProItem(ckeitem, ckekey) {
    // console.log($(e.target).parent('tr'));
    // $(`#clctr${ckekey}`).each((index, value)=>{
    //   console.log($($(value).children('.batchNum')).text());
    // })
    console.log($(`#batchNum${ckekey}${ckeitem.sid}`).val());
    var batchNum = $(`#batchNum${ckekey}${ckeitem.sid}`).val(),
      firstQty = $(`#firstQty${ckekey}${ckeitem.sid}`).val(),
      localNum = $(`#localSto${ckekey}${ckeitem.sid}`).find("option:selected").val(),
      localName = $(`#localSto${ckekey}${ckeitem.sid}`).find("option:selected").text()

    var proItem = {
      'sid': ckeitem.sid,
      'barcode': ckeitem.barcode,
      'batchNum': batchNum,
      'firstQty': firstQty,
      'localNum': localNum,
      'localName': localName,
      'localQty': ckeitem.localQty,
      'localType': ckeitem.localType,
      'orderNum': ckeitem.orderNum,
      'productName': ckeitem.productName,
      'productNum': ckeitem.productNum,
      'storageNum': ckeitem.storageNum,
      'size': ckeitem.size
    }
    this.recordTotal = 1;
    var uiaUrl = '/tms-admin/check/edit-check-data';
    this.httpclient.post(uiaUrl, proItem, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isAllSave = false;
          this.showWarnWindow(true, '保存成功!', 'success');
          this.loadEditCheck();
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 保存盘点单
  saveCheck() {
    this.isAllSave = true;
    var storageNum = this.ucheckMesg.storageNum,
      contractOrder = $("#contractOrder").val(),
      createUser = $("#createUser").val(),
      createTime = $("#creatdata").val(),
      remark = $("#remark").val();
    if (!storageNum) {
      this.showWarnWindow(true, "请选择仓库", 'warning');
      return;
    }
    if (!this.ucheckedList.length) {
      this.showWarnWindow(true, "请选择要入库的产品", 'warning');
      return;
    }
    var checkDataList = this.ucheckedList;
    checkDataList.forEach((elem) => {
      elem['storageNum'] = this.ucheckMesg.storageNum;
      elem['productNum'] = elem['productCode'];
    })
    this.isload = false;
    var addUrl = '/tms-admin/check/edit-check-stock';
    var params = {
      "sid": this.pid,
      "orderNum": this.ucheckMesg.orderNum,
      "contractOrder": contractOrder, //关联单号
      "createUser": createUser,//制单人
      "isComplete": 1,
      // "createTime": createTime,//制单时间
      "storageNum": this.ucheckMesg.storageNum, //仓库
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
    if (this.isAllSave && this.btn_type_css == 'success') {
      that.route.navigate(["/tms/checklist"]);
    }
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
export class CheckInfou {
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
