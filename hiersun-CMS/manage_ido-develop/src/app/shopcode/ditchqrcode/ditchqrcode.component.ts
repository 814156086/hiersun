import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Router } from '@angular/router'
declare var $: any;
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-ditchqrcode',
  templateUrl: './ditchqrcode.component.html',
  styleUrls: ['./ditchqrcode.component.css']
})
export class DitchqrcodeComponent implements OnInit {

  public ditchList = [];//渠道活动查询
  public brandlist:any;
  public img = "";
  public index = "";
  public isHint = false;
	public hintMsg: any;
	public warning = false;
  public pageNo = 1;//页码
  public pageSize = 10;//每页显示数量
  public totalPage = '';//总页数
  public currentPage = '';//当前页码
  public beginDt:any;
  public edt:any;
  public createstare:any;
  public createend:any;
  public findbeginDt:any;
  public findendDt:any;
  public applysection:any;
  public activename:any;
  public shopname:any;
  public applypeople:any;
  public inspectnum:any;
  formModel: FormGroup;
  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, fb: FormBuilder,private route: Router) { 
    this.formModel = fb.group({
      activename: ['', [Validators.required]],
      beginDt: ['', [Validators.required]],
      inspectnum: ['', [Validators.required]],
      applypeople: ['', [Validators.required]],
      applysection: ['', [Validators.required]],
      edt: ['', [Validators.required]],
      shopname: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    var that = this;
    laydate.render({
      elem: '#startdata',
      type: 'datetime',
      done: function(value, date, endDate){
        that.beginDt=value;
      }
    });
    laydate.render({
      elem: '#enddata',
      type: 'datetime',
      min: $("#startdata").val(),
      done: function(value, date, endDate){
        console.log($("#startdata").val())
        that.edt=value;
      }
    });
    laydate.render({
      elem: '#createstare',
      type: 'datetime',
      done: function(value, date, endDate){
        that.createstare=value;
      }
    });
    laydate.render({
      elem: '#createend',
      type: 'datetime',
      min: $('#createstare').val(),
      done: function(value, date, endDate){
        that.createend=value;
      }
    });
    laydate.render({
      elem: '#beginDt',
      type: 'datetime',
      done: function(value, date, endDate){
        that.findbeginDt=value;
      }
    });
    laydate.render({
      elem: '#endDt',
      type: 'datetime',
      min: $('#beginDt').val(),
      done: function(value, date, endDate){
        that.findendDt=value;
      }
    });
    this.ditchcode()
    this.choosebranch()
  }
  //查询渠道二维码
  ditchcode(){
    var that = this
    var startTime = $('#beginDt').val();
    var endTime = $('#endDt').val();
    var state = $('#state').val();
    var brandCode = $("#brand").val();
    var name = $(".brandId").val();
    var pageNo = that.pageNo;
    var pageSize = that.pageSize;
    var storeUrl = `/barcode/manager/dynamic/qr-code/channel-qr-codes?start=${pageNo}&pageSize=${pageSize}&name=${name}&brandCode=${brandCode}&endTime=${endTime}&startTime=${startTime}&state=${state}`;
    this.httpclient.get(storeUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.ditchList = res['data']['result']
          that.totalPage = res['data']['totalPage']
          that.currentPage = res['data']['currentPage']
          that.ditchList.forEach((value,index)=>{
            value.extra_new=JSON.parse(value.extra)
          })
          $('#pagination1').pagination({
            currentPage: that.pageNo,
            totalPage: that.totalPage,
            callback: function (current) {
              that.pageNo = current;
              that.ditchcode();
            }
          });
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.warning = false;
          },1500)
        }
      },
      (err: HttpErrorResponse) => {
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
        },1500)
      }
    )
  }
  clear(){
    $('#beginDt').val("");
    $('#endDt').val("");
    $('.brandId').val("");
    $("#brand").val("")
    $("#state").val("")
    this.ditchcode()
  }
  //导出二维码
  dereve(index){
    var id = this.ditchList[index].id
        var storeUrl = `/barcode/manager/dynamic/qr-code/excel?id=${id}`;
        window.location.href = storeUrl
  }
  //启用门店二维码
  start(){
    var that = this
    // var id = this.ditchList[this.index].id
    var id = this.ditchList[this.index]['id']
    var expireEndTime = new Date($('.activeend').val())
    var expireStartTime = new Date($('.activestart').val())
    var data = {
      "expireEndTime":expireEndTime,
      "expireStartTime":expireStartTime,
      "id":id
    }
    var storeUrl = "/barcode/manager/dynamic/qr-code/channel/enable";
    
    // console.log(storeUrl)
    this.httpclient.post(storeUrl,data, this.httpOptions).subscribe(
        res => {
            if (res['code'] == 200) {
              that.ditchcode()
              that.warning = false;
              that.isHint = true;
              that.hintMsg = '该门店二维码已启用';
              setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                  that.warning = false;
              }, 1500)
              // this.ditchList = res['data']['result']
              $('.activeend').val("")
              $('.activestart').val("")
              return false;
            }else{
              that.warning = true;
              that.isHint = true;
              that.hintMsg = res['desc'];;
              setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                  that.warning = false;
              },1500)
              return false;
            }
        },
        (err: HttpErrorResponse) => {
          that.warning = true;
          that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.warning = false;
          },1500)
          return false;
        }

    )
    $(document).unbind('mousewheel');
  }
  //禁用门店二维码
  forbidden(){
    var that = this
    var id = this.ditchList[this.index].id
    var storeUrl = `/barcode/manager/dynamic/qr-code/disable?id=` + id;
    // console.log(storeUrl)
    this.httpclient.post(storeUrl, this.httpOptions).subscribe(
        res => {
            // console.log(res)
            if (res['code'] == 200) {
              that.ditchcode()
              that.warning = false;
              that.isHint = true;
              that.hintMsg = '该门店二维码已禁用';
              setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                  that.warning = false;
              }, 1500)
              // this.ditchList = res['data']['result']
            } else {
                that.warning = true;
                that.isHint = true;
                that.hintMsg = res['desc'];;
                setTimeout(function () {
                    that.isHint = false;
                    that.hintMsg = '';
                    that.warning = false;
                },1500)
            }
        },
        (err: HttpErrorResponse) => {
          that.warning = true;
          that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.warning = false;
          },1500)
        }
    )
  }
  //新建渠道二维码校验时间
    // submit(){
    //   var that = this;
    //   var beginDate = new Date($('.stadt').val()).getTime();
    //   var endDate = new Date($('.edt').val()).getTime();
    //   if(beginDate>endDate){
    //     that.warning = true;
    //     that.isHint = true;
    //     that.hintMsg = "结束时间不能早于开始时间";
    //     setTimeout(function () {
    //         that.isHint = false;
    //         that.hintMsg = '';
    //         that.warning = false;
    //     },1500)
    //     return false;
    //   }
    //   this.addqrcode()
  // }
  //启用二维码校验
  makesure(){
    var that = this;
    var beginDate = new Date($('.kssj').val()).getTime();
    var endDate = new Date($('.jssj').val()).getTime();
    console.log(beginDate)
    console.log(endDate)
    if(beginDate>endDate){
      $(".tips1").text('')
      $(".tips2").text('结束时间不能早于开始时间')
      return false;
    }
    else if(!beginDate){
      $(".tips1").text('开始时间不能为空')
      $(".tips2").text('')
      return false;
    }else if(!endDate){
      $(".tips1").text('')      
      $(".tips2").text('结束时间不能为空')
      return false;
    }
    this.start()
    $("#createactive").hide()
    $("#createstare").val('')
    $("#createend").val('')
  }
  //新建渠道活动二维码
  addqrcode(){
    var that = this;
    var applyNo = $(".inspectnum").val();
    var applicant = $(".applypeople").val();
    var applyBranch = $(".applysection").val();
    var brand = $('.shopname').val();
    var expireEndTime =  new Date($('.edt').val());
    var expireStartTime = new Date($('.stadt').val());
    var name = $('.actname').val();
    var extra = JSON.stringify({
        "applyNo":applyNo,
        "applicant":applicant,
        "applyBranch":applyBranch,
      })
    
    var data = {
      "brand":brand,
      "appid":"wx7409f0aa6ba330e8",
      "brandCode":"10",
      "name":name,
      "expireEndTime":expireEndTime,
      "expireStartTime":expireStartTime,
      "extra":extra
    }
    // console.log(data)

    var storeUrl = `/barcode/manager/dynamic/qr-code/channel-make`;
    this.httpclient.post(storeUrl, data, this.httpOptions).subscribe(
      res => {
        console.log(data)
        if(res['code'] == 200){
          $('#addactive').hide()
          $(document).unbind('mousewheel');
          that.ditchcode()
          that.warning = false;
          that.isHint = true;
          that.hintMsg = '活动二维码新建成功';
          setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.warning = false;
          }, 1500)
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.warning = false;
          },1500)
        }
      },
      (err: HttpErrorResponse) =>{
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
        },1500)
      }
    )
    this.addhide()
  }
  //选择品牌
  choosebranch(){
    let that=this;
    var brandurl = '/pcm-inner/brands'
    this.httpclient.get(brandurl, this.httpOptions).subscribe(
      res => {
          that.brandlist=res['data'];
          // console.log(res)
          // console.log(that.brandlist)
      },
      (err: HttpErrorResponse) => {
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.warning = false;
        },1500)
      }
    )
  }
  img_none() {
      $('.pop_up').hide()
  }
  bigimg(index) {
      $('.pop_up').show()
      $('.large_img').show()
      this.img = this.ditchList[index].qrcodeImg
      $('.large_img').attr('src', this.img)
  }
  //启用二维码
  startindex(index){
    $('#createactive').show()
    $(document).bind('mousewheel', function(event, delta) {return false;});
    this.index = index
  }
  endindex(index){
    $('#deleteactive').modal('show')
    this.index = index
    // console.log(this.index)
  }
  createhide(){
    $("#createstare").val('')
    $("#createend").val('')
    $("#createactive").hide()
    $(document).unbind('mousewheel');
  }
  deletehide(){
    $('#deleteactive').hide()
  }
  addhide(){
    $('#addactive').hide()
    $(".modal-backdrop").hide()
    $(document).unbind('mousewheel');
  }
  addactive(){
    $("#addactive").modal('show')
    $(document).bind('mousewheel', function(event, delta) {return false;});
  }
  valid(index){
    if(index==1){
      if($("#createstare").val()==undefined || $("#createstare").val()==""){
        $(".tips1").text("开始时间不能为空")
      }else{
        $('.tips1').text(' ')
      }
    }
    if(index==2){
      if($("#createend").val()==undefined || $("#createend").val()==""){
        $(".tips2").text("结束时间不能为空")
      }else{
        $('.tips2').text(' ')
      }
    }
  }
}
