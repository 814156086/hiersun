import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-addgift',
  templateUrl: './addgift.component.html',
  styleUrls: ['./addgift.component.css']
})
export class AddgiftComponent implements OnInit {
  @ViewChild('giftmodal') giftmodal
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  isType = false;//赠品类型切换
  documentType: number = 1;//凭证类型
  // itemList = [];//赠品信息列表
  itemObj: ItemInfo;//tab2 编辑(详情)  价格信息的显示;//赠品信息列表
  provList = [];// 省
  cityList = [];// 市
  distList = [];// 区
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
    this.itemObj = new ItemInfo('', '','', '','', '',1, '','','', '','', '','', '','', '','');
    this.initProvList();
  }
  // 查询
  searchOrder() {
    // this.isGift = true;
    this.isload = false;
    // this.itemList = [];
    var orderNo = $('.orderNo').val();
    if (!orderNo) {
      this.showWarnWindow(true, '请输入订单号！', 'warning');
      return
    }
    var selecturl = `/oms-admin/gift-order/${orderNo}/gift`;
    this.httpclient.get(selecturl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.itemObj = res['data'];
          // this.itemList.push(res['data']);
        } else {
          // this.itemList = [];
          // this.itemObj = {};
          this.itemObj = new ItemInfo('', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', '', '');
          this.showWarnWindow(true, res['desc'], 'warning');
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
  switchType() { 
    $('#switchModal').modal('show')
  }
  // 切换弹窗确定
  sureSwitch() {
    this.documentType = $('#documentType').val();
    this.isType = this.documentType == 1 ? false : true;
    // this.itemList = [];
    this.itemObj = new ItemInfo('', '','', '','', '',1, '','','', '','', '','', '','', '','');
  }
  // 弹窗返回信息
  getGiftModal(obj: any) {
    // this.itemList = [];
    this.itemObj = obj;
    // this.itemList.push(obj);
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
    var parentId = $('#provCode').val();
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
    var parenCtId = $('#cityCode').val();
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
  // 保存
  saveGift() {
    this.isload = false;
    const saveUrl = '/oms-admin/gift-order/save';
    const saveParams = this.itemObj;
    var supplyProductNo=saveParams['supplyProductNo']
    if (!supplyProductNo) {
      this.showWarnWindow(true, '请选择赠品信息！', 'warning');
      return
    }
    if(this.documentType==2){
      var reason = $("#reason").val(),
      giftNum = $("#giftNum").val(),
      receptName = $("#receptName").val(),
      receptPhone = $("#receptPhone").val(),
      receptAddress = $('#receptAddress').val(),
      receptProvNo = $('#provCode').val(),
      receptProvName =$('#provCode').find("option:selected").text(),
      receptCityNo = $('#cityCode').val(),
      receptCityName =$('#cityCode').find("option:selected").text(),
      districtCode = $('#districtCode').val(),
      districtName = $('#districtCode').find("option:selected").text(),
      receptCityCode=$('#receptCityCode').val();
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
    }
    saveParams['documentType'] = $('#documentType').val();
    this.httpclient.post(saveUrl, saveParams, this.httpOptions).subscribe(
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
  ) {
  }
}