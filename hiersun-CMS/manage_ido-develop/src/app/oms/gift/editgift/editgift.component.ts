import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-editgift',
  templateUrl: './editgift.component.html',
  styleUrls: ['./editgift.component.css']
})
export class EditgiftComponent implements OnInit {
  @ViewChild('giftmodal') giftmodal
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  isHintSucc = false;//回车信息查询成功
  isHintSucc2 = false;//发票回车信息查询成功
  prefixList = [];//模糊查询列表
  billNo: any;//工单编码
  billType = 1;//补赠品/发票
  sid: any;//sid主键
  isType = false;//赠品类型切换
  documentType: number = 1;//凭证类型
  itemObj: ItemInfo;//tab2 编辑(详情)  价格信息的显示;//赠品信息列表
  provList = [];// 省
  cityList = [];// 市
  distList = [];// 区
  invoiceType = 1;//发票 个人 单位
  invoiceAmount: any;//订单金额(发票)
  shopNo_iv: any;//门店编号(发票)
  shopName_iv: any;//门店名称(发票)
  receptProvNo: any;//省(发票)
  receptCityNo: any;//市(发票)
  receptDistrictNo: any;//区(发票)
  sid_iv: any;//主键(发票)
  documentValue_iv: any;//主键(发票)
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.billNo = queryParams.billNo;
      this.billType = queryParams.billType;
      this.sid = queryParams.sid;
    });
  }

  ngOnInit() {
    this.isload = true;
    this.itemObj = new ItemInfo('', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 1, '');
    this.initProvList();
    this.billType == 1 ? this.loadOrderInfo() : this.loadInvoiceInfo();
  }
  // 加载赠品信息
  loadOrderInfo() {
    // var orderNo = $('.orderNo').val();
    // if (!orderNo) {
    //   this.showWarnWindow(true, '请输入订单号！', 'warning');
    //   return
    // }
    this.isload = false;
    var selecturl = `/oms-admin/gift-order/info/${this.billNo}`;
    this.httpclient.get(selecturl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          // this.isType = false;
          this.itemObj = res['data'][0];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 加载发票信息
  loadInvoiceInfo() {
    var invcurl = `/oms-admin/gift-order/${this.billNo}/gift?billType=2`;
    this.httpclient.get(invcurl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.invoiceAmount = res['data']['invoiceAmount'];
          this.invoiceType = res['data']['invoiceType'];
          // $('#invoiceType2').val(this.invoiceType);
          if (this.invoiceType == 1) {
            $('#invoiceType2').val(this.invoiceType);
          } else if (this.invoiceType == 2) {
            $('#invoiceType2').val(this.invoiceType);
          } else {
            $('#invoiceType2').val(2);
            var registeredAddress = res['data']['registeredAddress'],
              registeredPhone = res['data']['registeredPhone'],
              bankAccount = res['data']['bankAccount'],
              bankNo = res['data']['bankNo']
            $('.eregAddress').val(registeredAddress);
            $('.eregTel').val(registeredPhone);
            $('.ebankAccount').val(bankAccount);
            $('.ebankNo').val(bankNo);
          }
          this.sid_iv = res['data']['sid'];
          this.receptProvNo = res['data']['receptProvNo'];
          this.receptCityNo = res['data']['receptCityNo'];
          this.receptDistrictNo = res['data']['receptDistrictNo'];
          var invoiceTitle = res['data']['invoiceTitle'];
          var invoiceTaxno = res['data']['invoiceTaxno'];
          var reason = res['data']['reason'];
          var receptAddress = res['data']['receptAddress'];
          var receptCityCode = res['data']['receptCityCode'];
          var receptName = res['data']['receptName'];
          var receptPhone = res['data']['receptPhone'];
          var receptProvNo = res['data']['receptProvNo'];
          var receptCityNo = res['data']['receptCityNo'];
          var receptDistrictNo = res['data']['receptDistrictNo'];
          $('#receptName_iv').val(receptName);
          $('#receptPhone_iv').val(receptPhone);
          $('#receptCityCode_iv').val(receptCityCode);
          $('#provCode_iv').val(receptProvNo);
          $('#cityCode_iv').val(receptCityNo);
          $('#districtCode_iv').val(receptDistrictNo);
          $('#reason_iv').val(reason);
          $('#receptAddress_iv').val(receptAddress)
          if (invoiceTitle) {
            $('.invoiceTitle').val(invoiceTitle);
            $('.invoiceTaxno').val(invoiceTaxno);
          }
          this.initCityDist(receptProvNo, 2);
          this.initCityDist(receptCityNo, 3);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });

  }
  completeSearch(event) {
    this.prefixList = [];
    var that = this;
     var idDom = this.billType == 1 ? 'edocumentValue' : 'einvoiceOrderNo';
    var prefix = event.target.value;
    if (prefix != '') {
      // this.prefixList = [];
      $(`#${idDom}`).typeahead({
        source: function (query, process) {
          // console.log(query)
          var preurl = `/oms-admin/order/orderdatalist?orderNo=${query}`;
          return that.httpclient.get(preurl).subscribe(
            res => {
              if (res['code'] == 200) {
                var datalist = res['data']
                datalist.forEach(element => {
                  that.prefixList.push(element['orderNo']);
                });
                return process(that.prefixList)
              }
            },
            (err: HttpErrorResponse) => {
              console.log(err.error);
            }
          )
        }
      });
    }
  }
  onEnter(event) {
    var orderNo = $.trim($(event.target).val());
    // this.patternId = patternId;
    orderNo ? this.searchOrder(orderNo) : this.showWarnWindow(true, "请输入订单号", 'warning');
  }
  // 查询
  searchOrder(orderNo) {
    // var orderNo = this.billType == 1 ? $('.orderNo').val() : $('.orderNo2').val();
    // if (!orderNo) {
    //   this.showWarnWindow(true, '请输入订单号！', 'warning');
    //   return
    // }
    this.isload = false;
    this.billType == 1 ? this.isHintSucc = false : this.isHintSucc2 = false;
    var selecturl = `/oms-admin/gift-order/${orderNo}/gift?billType=1`;
    this.httpclient.get(selecturl).subscribe(
      res => {
        this.isload = true;
        if (this.billType == 1) {
          // 补赠品
          if (res['code'] == 200 && res['data']['spuNo']) {
            this.isType = false;
            this.documentType = 1;
            this.itemObj = res['data'];
            this.isHintSucc = true;
          } else if (res['code'] == 200 && !res['data']['spuNo']) {
            this.isType = true;
            this.documentType = 2;
            this.itemObj = new ItemInfo('', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '', 1, '');
          }
          else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        } else {
          // 补发票
          if (res['code'] == 200) {
            this.invoiceAmount = res['data']['invoiceAmount'];
            this.shopNo_iv = res['data']['shopNo'];
            this.shopName_iv = res['data']['shopName'];
            this.documentValue_iv = res['data']['documentValue'];
            this.isHintSucc2 = true;
          } else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 选择赠品
  selectGift() {
    this.giftmodal.loadModal()
  }
  // 切换按钮
  // switchType() {
  //   if (this.itemObj['supplyProductNo']) {
  //     $('#switchModal').modal('show');
  //   } else {
  //     this.documentType = $('#documentType').val();
  //     this.isType = this.documentType == 1 ? false : true;
  //   }
  // }
  // 切换弹窗确定
  // sureSwitch() {
  //   this.documentType = $('#documentType').val();
  //   this.isType = this.documentType == 1 ? false : true;
  //   this.itemObj = new ItemInfo('', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '');
  // }
  // 切换弹窗关闭
  // cancelSwitch() {
  //   // data-dismiss="modal" aria-hidden="true" ;
  //   $('#documentType').val(this.documentType);
  //   $('#switchModal').modal('hide');
  // }
  // 弹窗返回信息
  getGiftModal(obj: any) {
    this.itemObj = obj;
  }
  // 赠品数量数量校验
  inputGiftNum(event) {
    const reg = new RegExp("^[1-9][0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 联系方式校验
  normalInputChange(event) {
    const reg = new RegExp("^[0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 省
  initProvList() {
    this.isload = false;
    var provurl = '/pcm-admin/regions?parentId=1&levelType=1';
    this.httpclient.get(provurl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.provList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 市
  initCityList() {
    this.isload = false;
    this.distList = [];
    var parentId = this.billType == 1 ? $('#provCode').val() : $('#provCode_iv').val();
    var cityurl = `/pcm-admin/regions?parentId=${parentId}&levelType=2`;
    this.httpclient.get(cityurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.cityList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 区
  initDistrict() {
    this.isload = false;
    var parenCtId = this.billType == 1 ? $('#cityCode').val() : $('#cityCode_iv').val();
    var disturl = `/pcm-admin/regions?parentId=${parenCtId}&levelType=3`;
    this.httpclient.get(disturl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.distList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 市区
  initCityDist(parentId, type) {
    var cityurl = `/pcm-admin/regions?parentId=${parentId}&levelType=${type}`;
    this.httpclient.get(cityurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          type == 2 ? this.cityList = res['data'] : this.distList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // changeInvoiceType() {
  //   console.log(123);
  //   this.invoiceType = $('.invoiceType2').val();
  // }
  // 保存赠品
  saveGift(billstatus) {
    const saveUrl = '/oms-admin/gift-order/save';
    const saveParams = this.itemObj;
    var spuNo = saveParams['spuNo']
    if (!spuNo) {
      this.showWarnWindow(true, '请选择赠品信息！', 'warning');
      return
    }
    if (this.documentType == 2) {
      var reason = $("#reason").val(),
        giftNum = $("#giftNum").val(),
        receptName = $("#receptName").val(),
        receptPhone = $("#receptPhone").val(),
        receptAddress = $('#receptAddress').val(),
        receptProvNo = $('#provCode').val(),
        receptProvName = $('#provCode').find("option:selected").text(),
        receptCityNo = $('#cityCode').val(),
        receptCityName = $('#cityCode').find("option:selected").text(),
        districtCode = $('#districtCode').val(),
        districtName = $('#districtCode').find("option:selected").text(),
        receptCityCode = $('#receptCityCode').val();
      if (!giftNum) {
        this.showWarnWindow(true, '请填写赠品数量！', 'warning');
        return
      }
      if (!reason) {
        this.showWarnWindow(true, '请填写申请原因！', 'warning');
        return
      }
      if (!receptName || !receptPhone || !receptAddress) {
        this.showWarnWindow(true, '请完善收货信息！', 'warning');
        return
      }
      saveParams['giftNum'] = giftNum;
      saveParams['reason'] = reason;
      saveParams['receptCityCode'] = receptCityCode;
      saveParams['receptProvNo'] = receptProvNo;
      saveParams['receptProvName'] = receptProvName;
      saveParams['receptCityNo'] = receptCityNo;
      saveParams['receptCityName'] = receptCityName;
      saveParams['receptDistrictNo'] = districtCode;
      saveParams['receptDistrictName'] = districtName;
      saveParams['receptName'] = receptName;
      saveParams['receptPhone'] = receptPhone;
      saveParams['receptAddress'] = receptAddress;
    } else {
      var reason1 = $("#reason1").val();
      saveParams['reason'] = reason1;
    }
    saveParams['documentType'] = this.documentType;
    saveParams['billNo'] = this.billNo;
    saveParams['sid'] = this.sid;
    saveParams['billStatus'] = billstatus;
    this.isload = false;
    this.httpclient.post(saveUrl, saveParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '操作成功！', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      }
    )
  }

  // 保存发票
  saveInvoice(billstatus) {
    var invoiceTaxno = this.invoiceType != 1 ? $('.invoiceTaxno').val() : '';
    var invoiceTitle = this.invoiceType != 1 ? $('.invoiceTitle').val() : '';
    var reason = $("#reason_iv").val(),
      receptName = $("#receptName_iv").val(),
      receptPhone = $("#receptPhone_iv").val(),
      receptAddress = $('#receptAddress_iv').val(),
      receptProvNo = $('#provCode_iv').val(),
      receptProvName = $('#provCode_iv').find("option:selected").text(),
      receptCityNo = $('#cityCode_iv').val(),
      receptCityName = $('#cityCode_iv').find("option:selected").text(),
      receptDistrictNo = $('#districtCode_iv').val(),
      receptDistrictName = $('#districtCode_iv').find("option:selected").text(),
      receptCityCode = $('#receptCityCode_iv').val();
    if (!this.invoiceAmount) {
      this.showWarnWindow(true, '订单金额不能为空', 'warning');
      return
    }
    if (this.invoiceType == 2 && !invoiceTitle) {
      this.showWarnWindow(true, '请填写公司名称', 'warning');
      return
    }
    if (this.invoiceType == 2 && !invoiceTaxno) {
      this.showWarnWindow(true, '请填写税号', 'warning');
      return
    }
    if (this.invoiceType == 3) {
      var registeredAddress = $('.eregAddress').val(),
        registeredPhone = $('.eregTel').val(),
        bankAccount = $('.ebankAccount').val(),
        bankNo = $('.ebankNo').val()
      if (!registeredAddress) {
        this.showWarnWindow(true, '注册地址不能为空', 'warning');
        return
      }
      if (!registeredPhone) {
        this.showWarnWindow(true, '注册电话不能为空', 'warning');
        return
      }
      if (!bankNo) {
        this.showWarnWindow(true, '银行账户不能为空', 'warning');
        return
      }
      if (!bankAccount) {
        this.showWarnWindow(true, '开户银行不能为空', 'warning');
        return
      }
      invParams['registeredAddress'] = registeredAddress;
      invParams['registeredPhone'] = registeredPhone;
      invParams['bankAccount'] = bankAccount;
      invParams['bankNo'] = bankNo;
    }
    if (!reason) {
      this.showWarnWindow(true, '请填写申请原因！', 'warning');
      return
    }
    if (!receptName || !receptPhone || !receptAddress) {
      this.showWarnWindow(true, '请完善收货信息！', 'warning');
      return
    }
    this.isload = false;
    const invUrl = '/oms-admin/invoice-order/save';
    var invParams = {
      "invoiceAmount": this.invoiceAmount,
      "invoiceTaxno": invoiceTaxno,
      "invoiceTitle": invoiceTitle,
      "invoiceType": this.invoiceType,
      "reason": reason,
      "receptAddress": receptAddress,
      "receptCityCode": receptCityCode,
      "receptCityName": receptCityName,
      "receptCityNo": receptCityNo,
      "receptDistrictName": receptDistrictName,
      "receptDistrictNo": receptDistrictNo,
      "receptName": receptName,
      "receptPhone": receptPhone,
      "receptProvName": receptProvName,
      "receptProvNo": receptProvNo,
      "documentValue": this.documentValue_iv,
      "shopName": this.shopName_iv,
      "shopNo": this.shopNo_iv,
      "billstatus": billstatus,
      "sid": this.sid_iv
    }
    this.httpclient.post(invUrl, invParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, '保存成功！', 'success');
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  goBack() {
    window.history.go(-1);
  }
  /**
* 全局弹窗
*/
  showWarnWindow(status, warnMsg, btnType) {
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
      that.route.navigate(['/oms/gift'])
    }
  }
}
export class ItemInfo {
  constructor(
    public supplyProductName: String,
    public supplyProductNo: String,
    public spuNo: String,
    public skuNo: String,
    public brandName: String,
    public shopName: String,
    public giftNum: Number,
    public reason: String,
    public receptPhone: String,
    public receptName: String,
    public receptProvName: String,
    public receptProvNo: String,
    public receptCityName: String,
    public receptCityNo: String,
    public receptDistrictName: String,
    public receptDistrictNo: String,
    public receptAddress: String,
    public pictureUrl: String,
    public documentType: Number,
    public documentValue: String,
  ) {
  }
}