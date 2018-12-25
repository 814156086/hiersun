import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit {
  public pageSize = 10;
  public startPage = 1;
  public startPage2 = 1;
  public pageCount = 1;
  public pageCount2 = 1;
  public monthList = [];
  public detailList = [];
  public monthInfo = '';
  public startdate = '';
  public enddate = '';
  public isHint = false;
  public warning = false;
  public hintMsg = '';
  public primarySaleItemNo = '';
  public type = '';
  public storeList = [];
  public brandlist = [];
  public data = '';
  public sourceList = [];
  public monthStoreCode = '';
  public typeList = [];
  public noData = false;
  public billTypeList = [];
  public updateMonthList = [];
  public num = '';
  public updateErr = false;
  public noCheck = false;
constructor(private httpClient: HttpClient) {
}

  ngOnInit() {
    const that = this;
    $('#detail').on('show.bs.modal', function () {
      $('body').attr('overflow','hidden!important');
    });
    $('#detail').on('hidden.bs.modal', function () {
      $('body').attr('overflow','auto');
      that.noCheck = false;
    });
    $('#month-successtime').daterangepicker({
      timePicker: false,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    $('#mmonth').datetimepicker({
      format: 'yyyy-mm',
      weekStart: 1,
      autoclose: true,
      startView: 3,
      minView: 3,
      forceParse: false,
      language: 'zh-CN'
    });

    if ($().select2) {
      $('#mstorecode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#storecode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#mbrandno').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#brandno').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#mchannelcode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#channelcode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.getType();
    this.loadStoreList();
    this.loadSourceList();
    this.choosebranch();
    this.monthstatement();
    this.ordertype();
    
    $("#btnbox").bind('DOMNodeInserted', function(e) {
      let btn = $('#btnbox').children('input').length-1
      if(that.billTypeList.length == $('#btnbox').children('input').length){
        $('#btnbox input').each(function(i){
          let value = $(this).val();
          for(var l=0;l<that.billTypeList.length;l++){
            if(value == that.billTypeList[l].text){
              let text = that.billTypeList[l].value;
              $(this).bind('click',function(){
                that.billType(text)
              })
            }
          }
        })
      }
    });
    $('#otype').on('change',function(){
      $('#otype').val() == 5 || $('#otype').val() == 6 ? that.conditionhide() : that.conditionshow();
    })
  }

  conditionhide() {
    $('#isSettlementbox').hide();
    $('#isVerifybox').hide();
  }

  conditionshow() { 
    $('#isSettlementbox').show();
    $('#isVerifybox').show();    
  }

  //门店
  loadStoreList() {
    const that = this;
    // const url = '/pcm-admin/stores/all?organizationCode=' + '' + '&storeType=1';
    const url = '/pcm-inner/org/findstorelist';
    this.httpClient.get(url).subscribe({
      next: ignored =>{
        that.storeList = ignored['data'];
      }
    })
  }

  //重置
  loadAgain() {
    $('#mmonth').val(' ');
    $('#mchannelcode').select2("val","");
    $('#mstorecode').select2("val","");
    $('#mbrandno').select2("val","");
    this.monthstatement();
  }

  // 月报
  monthstatement() {
      const that = this;
      let url = '/api/v1/pay-mgr/admin/bill/month-reports?pageSize=' + this.pageSize + '&startPage=' + this.startPage;
      const month = $('#mmonth').val();
      if(month){
        url += '&month=' + month
      }
      const channelCode = $('#mchannelcode').select2('val');
      if(channelCode){
        url += '&channelCode=' + channelCode
      }
      const storeCode = $('#mstorecode').select2('val').split(':')[0];
      if(storeCode){
        url += '&storeCode=' + storeCode
      }
      const brandNo = $('#mbrandno').select2('val');
      if(brandNo){
        url += '&brandNo=' + brandNo
      }
      this.httpClient.get(url).subscribe({
        next: ignored => {
          this.monthList = ignored['data']['list']
          for(let i=0;i<that.monthList.length;i++){
            let channelCode = that.monthList[i].channelCode;
            let brandNo = that.monthList[i].brandNo;
            $.each(that.sourceList,function(){
              let cCode = this.channelCode;
              let cName = this.channelName;
              if(channelCode == cCode){
                that.monthList[i].channelName = cName
              }
            })
            $.each(that.brandlist,function(){
              let bNo = this.brandSid;
              let bName = this.brandName;
              if(brandNo == bNo){
                that.monthList[i].brandName = bName
              }
            })
          }
          that.pageCount = ignored['data'].pages;
          that.startPage = ignored['data'].currentPage;
          $('#pagination2').pagination({
            currentPage:that.startPage,
            totalPage: that.pageCount,
            callback: function(current) {
              that.startPage = current;
              that.monthstatement()
            }
          });
        },
        complete: () => {
        }
      });

  }
  detailLoad() {
    this.detailShow(this.data)
  }
  
  detail(data) {
    let that = this;
    $('#btnbox').html('');
    $('#channelCode').val('');
    $('#storeCode').val('');
    $('#outTradeNo').val('');
    $('#brandNo').val('');
    $('#month-successtime').val('');
    $('#isSettlement').val('');
    $('#isVerify').val('');
    this.data = data;
    // console.log(this.billTypeList.length)
    for(let i=0;i<this.billTypeList.length;i++){
      let input = $('<input class="typebtn" (click)="billType('+ this.billTypeList[i].value +')" style="margin:0 15px;border:none;padding:5px 10px;color:#000;outline:none" type="button" value="'+ this.billTypeList[i].text +'">')
      let btnbox = $('#btnbox');
      btnbox.append(input)
    }
    this.detailShow(this.data);
  }

  //明细
  detailShow(data) {
    const that = this;
    let url = 'api/v1/pay-mgr/admin/bill/details?pageSize=' + this.pageSize + '&startPage=' + this.startPage2
    let y = data.split('-')[0];
    let m = data.split('-')[1];
    this.mGetDate(y,m)
    const startTime = this.startdate;
    const endTime = this.enddate;
    let channelCode = $('#channelcode').select2('val');
    if(channelCode){
      url += '&channelCode=' + channelCode;
    }
    let storeCode = $('#storecode').select2('val').split(':')[0];
    if(storeCode){
      url += '&storeCode=' + storeCode;
    }
    let outTradeNo = $('#outtradeno').val();
    if(outTradeNo){
      url += '&outTradeNo=' + outTradeNo;
    }
    let brandNo = $('#brandno').select2('val');
    if(brandNo){
      url += '&brandNo=' + brandNo;
    }
    let startSuccessTime = $('#month-successtime').val() ?  $('#month-successtime').val().split("--")[0] + ' 00:00:00' : '';
    if(startSuccessTime){
      url += '&startSuccessTime=' + startSuccessTime;
    }else if(!startSuccessTime) {
      url += '&startSuccessTime=' + startTime;
    }
    let endSuccessTime =$('#month-successtime').val() ? $('#month-successtime').val().split("--")[1] + ' 23:59:59' : '';
    if(endSuccessTime){
      url += '&endSuccessTime=' + endSuccessTime;
    }else if(!endSuccessTime) {
      url += '&endSuccessTime=' + endTime;
    }
    let isSettlement = $('#issettlement').val();
    if(isSettlement){
      url += '&isSettlement=' + isSettlement;
    }
    let isVerify = $('#isverify').val();
    if(isVerify){
      url += '&isVerify=' + isVerify;
    }
    this.httpClient.get(url).subscribe({
        next: ignored => {
          this.detailList = ignored['data']['list']
          if(this.detailList.length){
            this.noData = false;
          }else{
            this.noData = true;
          }
          for(let i=0;i<that.detailList.length;i++){
            let channelCode = that.detailList[i].channelCode;
            let brandNo = that.detailList[i].brandNo;
            $.each(that.sourceList,function(){
              let cCode = this.channelCode;
              let cName = this.channelName;
              if(channelCode == cCode){
                that.detailList[i].channelName = cName
              }
            })
            $.each(that.brandlist,function(){
              let bNo = this.brandSid;
              let bName = this.brandName;
              if(brandNo == bNo){
                that.detailList[i].brandName = bName
              }
            })
          }
          that.pageCount2 = ignored['data'].pages;
          that.startPage2 = ignored['data'].currentPage;
          $('#pagination1').pagination({
              currentPage:that.startPage2,
              totalPage: that.pageCount2,
              callback: function(current) {
                  that.startPage2 = current;
                  that.detailShow(that.data)
              }
          });
        },
        complete: () => {
        }
    });
    $('#detail').modal('show');
  }

  detailLoadAgain() {
    $('#otype').val() == 5 || $('#otype').val() == 6 ? this.conditionshow() : null;
    $('#otype').val('');
    // $('#channelcode').val('');
    // $('#storecode').val('');
    $('#outtradeno').val('');
    // $('#brandno').val('');
    $('#month-successtime').val('');
    $('#issettlement').val('');
    $('#isverify').val('');
    $('#channelcode').select2("val","");
    $('#storecode').select2("val","");
    $('#brandno').select2("val","");
    // $('.store_name').select2("val","");
    
    this.detailShow(this.data)
  }

  mGetDate(year, month){
    let d = new Date(year, month, 0);
    d.getDate();
    let date = d.toString().split(' ')[2];
    this.startdate = year+"-"+month+"-"+ 1 + ' ' + '00:00:00';
    this.enddate = year+"-"+month+"-"+ date + ' ' + '23:59:59';
    $('.beginDate').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      startDate : this.startdate,
      endDate : this.enddate,
    });
    $('.endDate').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      startDate : this.startdate,
      endDate : this.enddate,
    });
  }

  detailclose() {
      $('#detail').modal('hide');
  }

  getType() {
    let url = '/api/v1/pay-mgr/admin/bill/query-types'
    this.httpClient.get(url).subscribe({
      next: ignered => {
        let newObject = ignered['data'];
        let left = newObject.split('{')[1];
        let right = left.split('}')[0];
        let newArr = new Array();
        newArr = right.split(',')
        this.typeList = [];
        for(let i=0;i<newArr.length;i++){
          let val = newArr[i].split('"')[1]
          let text = newArr[i].split('"')[3]
          let obj = new Object();
          obj = {
            value : val,
            text : text
          }
          this.typeList.push(obj) 
        }
      }
    })
  }

  ordertype() {
    let url = '/api/v1/pay-mgr/admin/bill/types'
    this.httpClient.get(url).subscribe({
      next: ignored => {
        let newObject = ignored['data'];
        let left = newObject.split('{')[1];
        let right = left.split('}')[0];
        let newArr = new Array();
        newArr = right.split(',')
        this.billTypeList = [];
        for(let i=0;i<newArr.length;i++){
          let val = newArr[i].split('"')[1]
          let text = newArr[i].split('"')[3]
          let obj = new Object();
          obj = {
            value : val,
            text : text
          }
          this.billTypeList.push(obj) 
        }
      }
    })
  }

  billType(type) {
    const that = this;
    this.type = type;
    $.each($('input:checkbox:checked'),function(){
       !that.primarySaleItemNo ? that.primarySaleItemNo +=  $(this).val() : that.primarySaleItemNo += ',' + $(this).val()
    });
    console.log(that.primarySaleItemNo)
    if(!that.primarySaleItemNo){
      that.noCheck = true;
      return false;
    }else{
      that.noCheck = false;
    }
    $('#update-oeder-type').show();
  }

  updateTypeClose() {
    $('#update-oeder-type').hide();
  }

  updateOrder() {
    $('#update-oeder-type').hide();
    const that = this;
    let url = '/api/v1/pay-mgr/admin/bill/bill-types?primarySaleItemNos=' + this.primarySaleItemNo + '&type=' + this.type;
    console.log(url)
    this.httpClient.post(url,{}).subscribe({
      next: ignored => {
        if(ignored['code']==200){
          that.primarySaleItemNo = '';
          that.detailShow(that.data)
          // that.hintMsg = '修改成功';
          // that.warning = false;
          // that.isHint = true;
          // setTimeout(function(){
          //   that.isHint = false;
          // },1500)
        }else{
          console.log(ignored['desc'])
        }
      }
    })
  }

  choosebranch() {
    let that = this;
    var brandurl = '/pcm-inner/brands'
    this.httpClient.get(brandurl).subscribe({
      next: ignored => {
        that.brandlist = ignored['data'];
      }
    })
  }

  updateMonthShow(item) {
    this.updateMonthList = item;
    $('#month-update').show();
  }

  updateMonth() {
    this.updateMonthing(this.updateMonthList)
  }

  updateMonthClose() {
    $('#month-update').hide();
  }

  //重算
  updateMonthing(item) {
    const brandNo = item.brandNo;
    const channelCode = item.channelCode;
    const month = item.month;
    const storeCode = item.storeCode;
    let that = this;
    var brandurl = '/api/v1/pay-mgr/admin/bill/recount-month-report';
    this.httpClient.post(brandurl,{
      brandNo : brandNo,
      channelCode : channelCode,
      month : month,
      storeCode : storeCode,
      startPage : that.startPage,
      pageSize : that.pageSize
    }).subscribe({
      next: ignored => {
        $('#month-update').hide();
        that.monthstatement();
        that.updateErr = false;
      },
      error: err => {
        that.updateErr = true;
        console.log(err)
      }
    })
  }

  loadSourceList() {
    let url = '/pcm-inner/channels';
    this.httpClient.get(url).subscribe({
      next: ignored => {
        this.sourceList = ignored['data'];
      }
    })
  }

  commShow(item) {
    this.monthStoreCode = item.monthStoreCode;
    $('#add-month').val(item.month);
    $('#commcontent').val('');
    $('#addcomm').modal('show');
  }
  
  //备注
  addComm() {
    let monthStoreCode = this.monthStoreCode;
    let comm = $('#commcontent').val();
    let url = '/api/v1/pay-mgr/admin/bill/summary/comm?monthStoreCode=' + monthStoreCode + '&comm=' + comm;
    this.httpClient.post(url,{}).subscribe({
      next: ignored => {
        $('#addcomm').modal('hide');
        this.monthstatement();
      }
    })
  }



}
