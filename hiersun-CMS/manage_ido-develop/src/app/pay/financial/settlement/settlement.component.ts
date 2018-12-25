import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit {
  public settlementList = [];
  public pageSize = 10;
  public startPage = 1;
  public sourceList = [];
  public brandlist = [];
  public typeList = [];
  public storeList = [];
  public pageCount = '';
  public nodata = false;
  public isHint = false;
  public warning = false;
  public hintMsg = '';
constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    $('.beginDate').daterangepicker({
      timePicker: true,
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
    if ($().select2) {
      $('#channelCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#storeCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#brandNo').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadSourceList();
    this.loadStoreList();
    this.choosebranch();
    this.type();
    let that = this;
    $('#oType').on('change',function(){
      $('#oType').val() == 5 || $('#oType').val() == 6 ? that.conditionhide() : that.conditionshow();
    })
  }
  conditionhide() {
    $('#Settlementbox').hide();
    $('#Verifybox').hide();
  }
  conditionshow() {
    $('#Settlementbox').show();
    $('#Verifybox').show();
  }
  search() { 
    const that = this;
    let url = '/api/v1/pay-mgr/admin/bill/daily-knots?pageSize=' + this.pageSize + '&startPage=' + this.startPage;
    const operationTime = $('#operationtime').val();
    if(!operationTime) {
      that.isHint = true;
      that.warning = true;
      that.hintMsg = '操作时间不能为空';
      setTimeout(function(){
        that.isHint = false;
        that.warning = false;
        that.hintMsg = '';
      },2000)
      return false;
    }
    const startOperationTime = $('#operationtime').val().split("--")[0];
    if(startOperationTime){
      url += '&startOperationTime=' + startOperationTime
    }
    const endOperationTime = $('#operationtime').val().split("--")[1];
    if(endOperationTime){
      url += '&endOperationTime=' + endOperationTime
    }
    const channelCode = $('#channelCode').val();
    if(channelCode){
      url += '&channelCode=' + channelCode
    }
    const storeCode = $('#storeCode').val().split(':')[0];
    if(storeCode){
      url += '&storeCode=' + storeCode
    }
    const customNo = $('#customNo').val();
    if(customNo){
      url += '&customNo=' + customNo
    }
    const outTradeNo = $('#outTradeNo').val();
    if(outTradeNo){
      url += '&outTradeNo=' + outTradeNo
    }
    const saleNo = $('#saleNo').val();
    if(saleNo){
      url += '&saleNo=' + saleNo
    }
    const brandNo = $('#brandNo').val();
    if(brandNo){
      url += '&brandNo=' + brandNo
    }
    const type = $('#type').val();
    if(type){
      url += '&type=' + type
    }
    const payType = $('#payType').val();
    if(payType){
      url += '&payType=' + payType
    }
    const startPayTime =$('#startPayTime').val() ?  $('#startPayTime').val().split("--")[0] + ' 00:00:00' : '';
    if(startPayTime){
      url += '&startPayTime=' + startPayTime
    }
    const endPayTime = $('#startPayTime').val() ? $('#startPayTime').val().split("--")[1] + ' 23:59:59' : '';
    if(endPayTime){
      url += '&endPayTime=' + endPayTime
    }
    const startCrossTime = $('#startCrossTime').val() ? $('#startCrossTime').val().split("--")[0] + ' 00:00:00' : '';
    if(startCrossTime){
      url += '&startCrossTime=' + startCrossTime
    }
    const endCrossTime = $('#startCrossTime').val() ? $('#startCrossTime').val().split("--")[1] + ' 23:59:59' : '';
    if(endCrossTime){
      url += '&endCrossTime=' + endCrossTime
    }
    const startTradeTime = $('#startTradeTime').val() ? $('#startTradeTime').val().split("--")[0] + ' 00:00:00' : '';
    if(startTradeTime){
      url += '&startTradeTime=' + startTradeTime
    }
    const endTradeTime = $('#startTradeTime').val() ? $('#startTradeTime').val().split("--")[1] + ' 23:59:59' : '';
    if(endTradeTime){
      url += '&endTradeTime=' + endTradeTime
    }
    const startSuccessTime = $('#startSuccessTime').val() ? $('#startSuccessTime').val().split("--")[0] + ' 00:00:00' : '';
    if(startSuccessTime){
      url += '&startSuccessTime=' + startSuccessTime
    }
    const endSuccessTime = $('#startSuccessTime').val() ? $('#startSuccessTime').val().split("--")[1] + ' 23:59:59' : '';
    if(endSuccessTime){
      url += '&endSuccessTime=' + endSuccessTime
    }
    const isSettlement = $('#isSettlement').val();
    if(isSettlement){
      url += '&isSettlement=' + isSettlement
    }
    const isVerify = $('#isVerify').val();
    if(isVerify){
      url += '&isVerify=' + isVerify
    }
    const oType = $('#oType').val();
    if(oType){
      url += '&oType=' + oType
    }
    console.log(url)
    this.httpClient.get(url).subscribe({
      next: ignored => {
        that.settlementList = ignored['data']['list']
        console.log(that.settlementList)
        ignored['data']['list'].length>0 ? that.nodata = true : that.nodata = false;
        for(let i=0;i<that.settlementList.length;i++){
          let channelCode = that.settlementList[i].channelCode;
          let brandNo = that.settlementList[i].brandNo;
          $.each(that.sourceList,function(){
            let cCode = this.channelCode;
            let cName = this.channelName;
            if(channelCode == cCode){
              that.settlementList[i].channelName = cName
            }
          })
          $.each(that.brandlist,function(){
            let bNo = this.brandSid;
            let bName = this.brandName;
            if(brandNo == bNo){
              that.settlementList[i].brandName = bName
            }
          })
        }
        that.pageCount = ignored['data'].pages;
        that.startPage = ignored['data'].currentPage;
        $('#pagination1').pagination({
          currentPage:that.startPage,
          totalPage: that.pageCount,
          callback: function(current) {
            that.startPage = current;
            that.search()
          }
        });
      },
      complete: () => {
      }
    });
  }
  type() {
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
  choosebranch() {
    let that = this;
    var brandurl = '/pcm-inner/brands'
    this.httpClient.get(brandurl).subscribe({
      next: ignored => {
        that.brandlist = ignored['data'];
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
  loadAgain() {
    $('#oType').val() == 5 || $('#oType').val() == 6 ? this.conditionshow() : null;
    $('#channelCode').select2("val","");
    $('#brandNo').select2("val","");
    $('#storeCode').select2("val","");
    $('#customNo').val('');
    $('#outTradeNo').val('');
    $('#saleNo').val('');
    $('#startPayTime').val('');
    $('#endPayTime').val('');
    $('#startCrossTime').val('');
    $('#endCrossTime').val('');
    $('#startTradeTime').val('');
    $('#endTradeTime').val('');
    $('#startSuccessTime').val('');
    $('#endSuccessTime').val('');
    $('#type').val('');
    $('#payType').val('');
    $('#isSettlement').val('');
    $('#isVerify').val('');
    $('#oType').val('');
    $('#operationtime').val('');
  }
}
