import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-codemanage',
  templateUrl: './codemanage.component.html',
  styleUrls: ['./codemanage.component.css']
})
export class CodemanageComponent implements OnInit {
  public list = [];
  public img = [];
  public currentpage = 1;
  public brandlist: any;//品牌列表
  public brandid: any;  //所选中的品牌
  public publiccodelist: any; //公众号列表
  public pcappid: any;//所选中的公众号的appid
  public districtlist: any; //大区列表
  public districtid: any;  //所选中的大区的id
  public citylist: any; //城市列表
  public cityid: any;  //所选中的城市的id
  public shopslist: any; //门店列表
  public shopid: any;  //所选中的门店的id
  public shopname:any;//获取所选门店的名称
  public isHint = false; //弹框消息遮罩层变量
  public hintMsg: any; //弹框消息
  public warning = false; //弹框图标
  public codeid:any;  //二维码id
  pageSize=10;  //每页的条数
  pageCount:any;//总页数
  pageNo = 1; //默认第一页
  public currentPage = '';//当前页码
  public currentcodeid:any; //启用禁用当前的二维码id
  public currentstatus:any; //启用禁用状态
  public updatemethod=1; //修改默认为门店换新码
  public coderep=1; //选择已有码还是新建码
  public unbindcodelist:any;//未绑定的二维码id
  public currentmsg:any; //当前要修改的信息
  public defaultchoose=1;//点击修改默认选中第一个
  public nodata=true; //默认列表有数据
  public codeList = [];//获取门店编码
  public codeall = [];
  public type :any;
  public prevent = 0;
  public num = 0;
  public addrAreaName = "";
  public addrRegion = "";
  public trademarkid = '10';
  public idobrandCode : any;
  public accountsappid = "wx7409f0aa6ba330e8";
  public proGroupCode = '';
  public newnum = 0;
  public newcitylist = [];
  public number = 0;
  public journalData = [];
  public journalpageNo = 0;
  public journalpageSize = 10;
  public journalId : any;
  public journalpageCount = 0;
  public removebindid : any;
  public removebindcode : any;

  // public storeInfoVo = {};
  // public idappid= wx9ceb85b810bf384c; //ido的公众号appid
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }
  ngOnInit() {
    let that = this;
    $('#beginDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#endDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('select.store_code').select2({
      placeholder: 'Select',
      allowClear: true
    });
    $('select.regionsearch').select2({
      placeholder: 'Select',
      allowClear: true
    });
    $('select.citysearch').select2({
      placeholder: 'Select',
      allowClear: true
    });
    $('select.store_name').select2({
      placeholder: 'Select',
      allowClear: true
    });
    $(document).mousedown(function(){
      if($('#editshopcode').css('display')=='none' && $('#bindshop').css('display')=='none'){
        that.num = 0
      }
    });
    that.choosebranch();
    that.loadStoreList();
    that.chooseshopcode();
    that.publiccode();
  }
  //选择门店编码
  chooseshopcode(){
    var that=this;
    that.proGroupCode = $('.brandname').val()
    var shopcodeurl = '/pcm-inner/org/findstorelist?proGroupCode=' + that.proGroupCode
    this.httpclient.get(shopcodeurl, this.httpOptions).subscribe(
      res => {
        $('select.store_code').select2({
          placeholder: 'Select',
          allowClear: true
        });
        that.codeList=res['data'];
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
  //查询
  loadStoreList() {
    var that = this
    var bind = $('#bind').val();
    var state = $('#state').val();;
    var store_code = $('.store_name').select2('val').split(':')[0];
    // var name=$(".store_name").select2('data').text.split(":")[1];
    var name = "";
    // var name=$(".store_name").select2('data');
    var start_time = $('.start_time').val();
    var end_time = $('.end_time').val();
    var brandname = $('.brandname').val();
    that.brandid = $('.brandname').val();
    // var appid = 'wx7409f0aa6ba330e8';
    var appid = $('.accountslist').val()
    var region = $('.regionsearch').select2('val')
    var city = $('.citysearch').select2('val')
    var storeStatus = $('.statussearch').val()
    if($(".store_name").select2('val')){
      name=$(".store_name").select2('data').text.split(":")[1];
    }
    if($('.accountslist').val()==null||!$('.accountslist').val()){
      that.publiccode()
      return false;
    }

    if(that.number==0){
      that.district()
      that.cityslist()
      that.shoplist()
    }
    $(".regionsearch").change(function () {
      $('.citysearch').select2('data',null)
      $('.store_name').select2('data',null)
      that.addrRegion = $(".regionsearch").select2('val');
      that.cityslist()
      that.shoplist()
      $('.loading').css('display','block')
      setTimeout(function(){
        $('.loading').css('display','none')
      },1000)
    })
    $(".citysearch").change(function () {
      $('.store_name').select2('data',null)
      that.addrAreaName = $('.citysearch').select2('val');
      that.shoplist()
      $('.loading').css('display','block')
      setTimeout(function(){
        $('.loading').css('display','none')
      },1000)
    })
    $(".store_name").change(function () {
      var chengshi = $('.store_name').select2('val').split(':')[1]
      var daqu = $('.store_name').select2('val').split(':')[2]
      // that.addrRegion = $(".regionsearch").select2('val');
      $('.regionsearch').select2('val',daqu)
      that.cityslist()
      $('.citysearch').select2('val',chengshi)
    })
    that.number = 1;
    var storeUrl = '/barcode/manager/dynamic/qr-code/shop-qr-codes?start='+that.pageNo+'&pageSize='+that.pageSize+`&code=${store_code}&mark=${bind}&name=${name}&startTime=${start_time}&endTime=${end_time}&state=${state}&brandName=${brandname}&appid=${appid}&region=${region}&city=${city}&storeStatus=${storeStatus}`;
    this.httpclient.get(storeUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          if(that.newnum != 0){
            that.list = res['data']['result'];
          }
          if(that.list.length==0){
            that.nodata=false;
          }else{
            that.nodata =true;
          }
          that.pageCount = res['data'].pages;
          that.pageNo = res['data'].currentPage;
          $('#pagination1').pagination({
            currentPage:that.pageNo,
            totalPage: that.pageCount,
            callback: function(current) {
              that.pageNo = current;

              that.loadStoreList()
            }
          });
          for(let i=0;i<that.list.length;i++){
            // that.codeall.push(that.list[i].code)
            var organizationCode=that.list[i].code
            var type=0;
            let typeindex = i;
            if(that.list[i].code!=""&&that.list[i].code!=null){
              var storeUrl = `/pcm-inner/org/findstorelist?organizationCode=${organizationCode}`;
              this.httpclient.get(storeUrl, this.httpOptions).subscribe(
                res => {
                  if(res['data'].length!=0){
                    that.list[i]['newcode']=res['data']['0'].salesChannelDesc
                    that.list[i]['addrRegion']=res['data']['0'].addrRegion
                    that.list[i]['addrAreaName']=res['data']['0'].addrAreaName
                    that.list[i]['organizationStatus']=res['data']['0'].organizationStatus
                  }
                },
                (err: HttpErrorResponse) => {
                  console.log("系统操作异常,请重新再试");
                }
              )
            }
            //   that.list[typeindex].newcode=type
          }
          that.newnum = 1
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  resetTag() {
    this.pageNo = 1
    $('#state').val('');
    $('#beginDt').val('');
    $('#endDt').val('');
    $('#bind').val('');
    $('.store_name').select2("val","");
    $('.store_code').select2("val","")
    $('.regionsearch').select2("val","")
    $('.citysearch').select2("val","")
    $('.statussearch').val('')
    this.loadStoreList();
  }
  //点击图片放大
  bigimg(index) {
    $('.pop_up').show()
    $('.large_img').show()
    $(".large_img").attr("src",index)
  }
  start(index1,index2) {
    let that=this;
    that.currentcodeid=index1;
    that.currentstatus=index2;
  }
  //启用禁用状态改变
  starting(){
    var that = this;
    if(that.currentstatus==1){  //禁用
      var storeUrl = '/barcode/manager/dynamic/qr-code/disable?id='+that.currentcodeid;
    }else{
      var storeUrl = '/barcode/manager/dynamic/qr-code/enable?id='+that.currentcodeid;
    }
    this.httpclient.post(storeUrl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.loadStoreList()
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //批量导出二维码
  derive() {
    var mark = $('#bind').val()
    var state = $('#state').val()
    var code = $('.store_code').val()
    var name = $('.store_name').val()
    var startTime = $('#beginDt').val()
    var endTime = $('#endDt').val()
    var brandName = $('.brandname').val();
    var appid = $('.accountslist').val();
    // var appid = 'wx7409f0aa6ba330e8';
    var fnType = 1
    var storeUrl = `/barcode/manager/dynamic/qr-code/excel?code=${code}&state=${state}&mark=${mark}&startTime=${startTime}&name=${name}&endTime=${endTime}&fnType=${fnType}&brandName=${brandName}&appid=${appid}`;
    window.location.href = storeUrl
  }
  //单个导出二维码
  dereve(index) {
    var id = this.list[index].id
    var storeUrl = `/barcode/manager/dynamic/qr-code/excel?id=${id}`;
    window.location.href = storeUrl
  }
  //生成门店二维码
  markcode(){
    let that = this;
    var shopQrCodeVo  = {
      // "appid": 'wx9ceb85b810bf384c',//正式
      "appid":'wx7409f0aa6ba330e8',
      "brand": 'I Do',
      "brandCode":'10'
    };
    if(that.prevent == 0){
      that.prevent = 1
    }else{
      return false;
    }
    var markcodeurl = '/barcode/manager/dynamic/qr-code/shop-make';
    this.httpclient.post(markcodeurl, shopQrCodeVo , this.httpOptions).subscribe(
      res => {
        that.prevent = 0;
        if (res['code'] == 200) {
          $("#stack1").modal('hide');
          that.warning = false;
          that.isHint = true;
          that.hintMsg = '门店二维码生成成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
          that.loadStoreList();
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
        }

      },
      (err: HttpErrorResponse) => {
        that.prevent = 0;
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.warning = false;
        }, 1500)
      }
    )
  }
  //绑定弹窗，默认执行的事件
  selectshow(id,brandcode) {
    $('#bindshop').modal('show')
    let that = this;
    $('#state').val('');
    $('#beginDt').val('');
    $('#endDt').val('');
    $('#bind').val('');
    $('.store_name').select2("val","");
    $('.store_code').select2("val","")
    $('.regionsearch').select2("val","")
    $('.citysearch').select2("val","")
    $('.statussearch').val('')
    that.num = 1;
    that.codeid=id;
    that.brandid=brandcode;
    $(".cateId").val("");
    $(".publiccode").select2("val", "");
    $(".district").select2("val", "");
    $(".citys").select2("val", "");
    $(".shops").select2("val", "");
    if ($().select2) {
      $('select.publiccode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    if ($().select2) {
      $('select.district').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    if ($().select2) {
      $('select.citys').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    if ($().select2) {
      $('select.shops').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    that.district();
    that.cityslist();
    that.shoplist()
    that.choosebranch();
    that.publiccode()
    $('.publiccode').change(function () {
      that.pcappid = $(".publiccode").select2('val');
      that.district()
    })
    $(".district").change(function () {
      $('.citys').select2('data',null)
      $('.shops').select2('data',null)
      that.districtid = $(".district").select2('val');
      that.cityslist()
      that.shoplist()
      $('.desc').text('');
    })
    $(".citys").change(function () {
      $('.shops').select2('data',null)
      that.cityid = $(".citys").select2('val');
      that.shoplist()
      $('.desc').text('');
    })
    $(".shops").change(function () {
      var chengshi = $('.shops').select2('val').split(':')[1]
      var daqu = $('.shops').select2('val').split(':')[2]
      that.shopid = $('.shops').select2('val').split(':')[0];
      that.shopname=$(".shops").select2('data').text.split(":")[1];
      $('.district').select2('val',daqu)
      that.cityslist()
      $('.citys').select2('val',chengshi)
      $('.desc').text('');
    })
  }
  //选择品牌
  choosebranch() {
    let that = this;
    var brandurl = '/pcm-inner/brands'
    this.httpclient.get(brandurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.brandlist = res['data'];
          that.publiccode();
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //选中公众号
  publiccode() {
    let that = this;
    var brandurl = '/barcode/manager/wx/profile/brand?brandCode=' + that.brandid + '&state=';
    this.httpclient.get(brandurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.publiccodelist = res['data'];
          if($('#bindshop').is(":hidden") && $('#editshopcode').is(":hidden")){
            that.loadStoreList()
          }
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //选择大区
  district() {
    let that = this;
    var districturl = '/pcm-inner/org/findAreas?brandCode=' + that.brandid;
    this.httpclient.get(districturl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.districtlist = res['data'];
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //选择城市
  cityslist() {
    let that = this;
    var brandCode = "";
    var cityturl ='';
    if(that.num==0){
      that.addrRegion = $('.regionsearch').select2('val');
      if(!that.addrRegion){
        brandCode = $('.brandname').val();
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode;
      }else{
        // that.addrRegion=that.addrRegion;
        brandCode= $('.brandname').val();
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode + '&area=' + that.addrRegion;
      }
    }else if(that.num==1){
      // that.addrAreaName = $('.citys').select2('val');
      that.addrRegion = $('.district').select2('val');
      if(!that.addrRegion){
        brandCode = that.brandid;
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode;
      }else{
        // that.addrRegion=that.addrRegion;
        brandCode=that.brandid;
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode + '&area=' + that.addrRegion;
      }
    }else if(that.num==2){
      that.addrRegion = $('.district2').select2('val');
      if(!that.addrRegion){
        brandCode = that.idobrandCode;
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode;
      }else{
        // that.addrRegion=that.addrRegion;
        brandCode=that.idobrandCode;
        cityturl = '/pcm-inner/org/findAreaCitys?brandCode=' + brandCode + '&area=' + that.addrRegion;
      }
    }
    this.httpclient.get(cityturl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.citylist = res['data'];
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //选择门店
  shoplist() {
    let that = this;
    var addrAreaName= ''
    var addrRegion= ''
    var proGroupCode= ''
    if(that.num==0){
      that.addrRegion = $('.regionsearch').select2('val');
      that.addrAreaName = $('.citysearch').select2('val');
      if(!that.addrAreaName&&!that.addrRegion){
        proGroupCode= that.brandid
        var cityturl = `/pcm-inner/org/findstorelist?proGroupCode=${proGroupCode}`;
      }else if(!that.addrAreaName){
        addrRegion= that.addrRegion
        var cityturl = `/pcm-inner/org/findstorelist?addrRegion=${addrRegion}`;
      }else if(!that.addrRegion){
        addrAreaName= that.addrAreaName
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}`;
      }else{
        addrAreaName= that.addrAreaName
        addrRegion= that.addrRegion
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&addrRegion=${addrRegion}`;
      }
    }else if(that.num==1){
      that.addrAreaName = $('.citys').select2('val');
      that.addrRegion = $('.district').select2('val');
      if(!that.addrAreaName&&!that.addrRegion){
        proGroupCode= that.brandid
        var cityturl = `/pcm-inner/org/findstorelist?proGroupCode=${proGroupCode}`;
      }else if(!that.addrAreaName){
        addrRegion= that.addrRegion
        proGroupCode= that.brandid
        var cityturl = `/pcm-inner/org/findstorelist?addrRegion=${addrRegion}&proGroupCode=${proGroupCode}`;
      }else if(!that.addrRegion){
        addrAreaName= that.addrAreaName
        proGroupCode= that.brandid
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&proGroupCode=${proGroupCode}`;
      }else{
        addrAreaName= that.addrAreaName
        addrRegion= that.addrRegion
        proGroupCode= that.brandid
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&addrRegion=${addrRegion}&proGroupCode=${proGroupCode}`;
      }
    }else if(that.num==2){
      that.addrAreaName = $('.citys2').select2('val');
      that.addrRegion = $('.district2').select2('val');
      if(!that.addrAreaName&&!that.addrRegion){
        proGroupCode= that.idobrandCode
        var cityturl = `/pcm-inner/org/findstorelist?proGroupCode=${proGroupCode}`;
      }else if(!that.addrAreaName){
        addrRegion= that.addrRegion
        proGroupCode= that.idobrandCode
        var cityturl = `/pcm-inner/org/findstorelist?addrRegion=${addrRegion}&proGroupCode=${proGroupCode}`;
      }else if(!that.addrRegion){
        addrAreaName= that.addrAreaName
        proGroupCode= that.idobrandCode
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&proGroupCode=${proGroupCode}`;
      }else{
        addrAreaName= that.addrAreaName
        addrRegion= that.addrRegion
        proGroupCode= that.idobrandCode
        var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&addrRegion=${addrRegion}&proGroupCode=${proGroupCode}`;
      }
    }
    // var cityturl = `/pcm-inner/org/findstorelist?addrAreaName=${addrAreaName}&addrRegion=${addrRegion}&proGroupCode=${proGroupCode}`;
    this.httpclient.get(cityturl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          if(that.num==0){
            that.newcitylist = res['data']
          }
          that.shopslist = res['data'];
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  //二维码绑定门店
  shopsure() {
    let that = this;
    if(!$('.shops').select2("data")){
      $('.desc').text('*请选中门店');
      return false;
    }
    if(!that.shopid||!that.shopname){
      $('.desc').text('*数据异常,请重新选择');
      return false;
    }
    var bindShopQrCodeVo  = {
      "code": that.shopid, //门店编码
      "id": that.codeid, //二维码id
      "name":that.shopname,    //门店名称
      "region":$('.district').select2("val"),
      "city":$('.citys').select2("val")
    };
    if(that.prevent == 0){
      that.prevent = 1
    }else{
      return false;
    }
    var codeshops = '/barcode/manager/dynamic/qr-code/bind-shop';
    this.httpclient.post(codeshops, bindShopQrCodeVo , this.httpOptions).subscribe(
      res => {
        that.prevent = 0
        if (res['code'] == 200) {
          $('#bindshop').modal("hide")
          $('.modal-backdrop').hide()
          that.warning = false;
          that.isHint = true;
          that.hintMsg = '绑定成功'
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500);
          that.loadStoreList()
          that.qrcodehint()
        }else{
          $('.desc').text('*' + res['desc'])
        }
      },
      (err: HttpErrorResponse) => {
        that.prevent = 0
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.warning = false;
        }, 1500)
      }
    )
  }
  //是否解除绑定弹窗
  removebindshow(id,code){
    this.removebindid = id 
    this.removebindcode = parseInt(code)
    $('#removebind').modal('show')
  }
  //解除绑定
  removebind(){
    var that = this;
    var id = that.removebindid
    var code = that.removebindcode
    var removebindUrl = "/barcode/manager/dynamic/qr-code/unbind-shop?" + "id="+ id + "&code=" + code
    this.httpclient.post(removebindUrl, this.httpOptions).subscribe(
        res => {
            if (res['code'] == 200) {
              that.warning = false;
              that.isHint = true;
              that.hintMsg = '解除绑定成功'
              setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                  that.warning = false;
              }, 1500);
              that.loadStoreList()
            }else{
                console.log(res)
            }
        },
        (err: HttpErrorResponse) => {
            that.prevent = 0
            that.warning = true;
            that.isHint = true;
            that.hintMsg = '系统异常，请稍后再试';
            setTimeout(function () {
                that.isHint = false;
                that.hintMsg = '';
                that.warning = false;
            }, 1500)
        }
    )
  }
  //解除绑定
  // removebind(id,code) {
    //   var that = this;
    //   var id = id;
    //   var newcode = parseInt(code);
    //   var data = {
    //       'id' : id,
    //       'code' : newcode
    //   }
    //   // var iiii=0
    //   // if(iiii==0){
    //   //     return false
    //   // }
    //   var removebindUrl = "/barcode/manager/dynamic/qr-code/unbind-shop?" + "id="+ id + "&code=" + code
    //   this.httpclient.post(removebindUrl, this.httpOptions).subscribe(
    //       res => {
    //           if (res['code'] == 200) {
    //               that.warning = false;
    //               that.isHint = true;
    //               that.hintMsg = '解除绑定成功'
    //               setTimeout(function () {
    //                   that.isHint = false;
    //                   that.hintMsg = '';
    //                   that.warning = false;
    //               }, 1500);
    //               that.loadStoreList()
    //           }else{
    //               console.log(res)
    //           }
              
    //       },
    //       (err: HttpErrorResponse) => {
    //           that.prevent = 0
    //           that.warning = true;
    //           that.isHint = true;
    //           that.hintMsg = '系统异常，请稍后再试';
    //           setTimeout(function () {
    //               that.isHint = false;
    //               that.hintMsg = '';
    //               that.warning = false;
    //           }, 1500)
    //       }
    //   )
  // }
  //获取日志
  journal(id){
    var that = this;
    that.journalData = []
    that.journalId = id
    var id = that.journalId;
    var start = that.journalpageNo;
    var pageSize  = that.journalpageSize;
    $('#journal').show()
    var journalUrl = "/barcode/manager/dynamic/qr-code/qr-code-histories?" + "id="+ id + "&start=" + start + "&pageSize=" + pageSize
    this.httpclient.get(journalUrl, this.httpOptions).subscribe(
        res => {
            if (res['code'] == 200) {
                that.journalData = res['data']['result']

                that.journalpageCount = res['data'].pages;
                that.journalpageNo = res['data'].currentPage;
                $('#pagination2').pagination({
                    currentPage:that.journalpageNo,
                    totalPage: that.journalpageCount,
                    callback: function(current) {
                    that.journalpageNo = current;

                    that.journal(that.journalId)
                    }
                });
            }else{
                console.log(res)
            }
            
        },
        (err: HttpErrorResponse) => {
            that.prevent = 0
            that.warning = true;
            that.isHint = true;
            that.hintMsg = '系统异常，请稍后再试';
            setTimeout(function () {
                that.isHint = false;
                that.hintMsg = '';
                that.warning = false;
            }, 1500)
        }
    )
  }
  //关闭日志列表
  close(){
      $('#journal').hide()
      this.journalpageNo = 0
  }
  //修改
  editshopcode(index,idobrandCode){
    $('#editshopcode').modal("show")
    $('#state').val('');
    $('#beginDt').val('');
    $('#endDt').val('');
    $('#bind').val('');
    $('.store_name').select2("val","");
    $('.store_code').select2("val","")
    $('.regionsearch').select2("val","")
    $('.citysearch').select2("val","")
    $('.statussearch').val('')
    // $('.modal-backdrop').show()
    this.updatecode(1);
    this.num = 2
    this.idobrandCode = idobrandCode
    $("#ishow").attr("checked","checked");
    $(".numbershop").hide();
    $(".mynewcode").val("");
    this.updatemethod=1;
    this.coderep=1;
    let that = this;
    that.currentmsg=index;
    that.brandid=that.currentmsg.brandCode;
    $('.oldtrademark').text(that.currentmsg.brand)
    $(".oldshopname").text(that.currentmsg.name)
    $(".oldshopnum").text(that.currentmsg.code)
    that.district();
    if ($().select2) {
      $('select.district2').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('select.citys2').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('select.shops2').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    that.choosebranch();
    that.district()
    that.cityslist()
    that.shoplist()
    $(".trademark2").change(function () {
      that.trademarkid = $(".trademark2").select2('val');
      that.district()
      that.cityslist()
      that.shoplist()
      if(!that.districtid){
        that.citylist=[];
        that.shopslist=[];
        $(".citys2").select2("val","")
        $(".shops2").select2("val","")
      }
      $('.desc').text('')
    })
    $(".district2").change(function () {
      $('.citys2').select2('data',null)
      $('.shops2').select2('data',null)
      that.addrRegion = $(".district2").select2('val');
      that.cityslist()
      that.shoplist()
      if(!that.addrRegion){
        that.citylist=[];
        that.shopslist=[];
        $(".citys2").select2("val","")
        $(".shops2").select2("val","")
      }
      $('.desc').text('')
    })
    $(".citys2").change(function () {
      $('.shops2').select2('data',null)
      that.cityid = $(".citys2").select2('val');
      that.shoplist()
      if(!that.cityid){
        that.shopslist=[];
        $(".citys2").select2("val","")
        $(".shops2").select2("val","")
      }
      $('.desc').text('')
    })
    $(".shops2").change(function () {
      var chengshi = $('.shops2').select2('val').split(':')[1]
      var daqu = $('.shops2').select2('val').split(':')[2]
      that.shopid = $('.shops2').select2('val').split(':')[0];
      // that.shopid = $(".shops2").select2('val');
      that.shopname=$(".shops2").select2('data').text.split(":")[1];
      $('.district2').select2('val',daqu)
      that.cityslist()
      $('.citys2').select2('val',chengshi)
      $('.desc').text('')
    })
    //查询未绑定的二维码列表
    var unbindcode = '/barcode/manager/dynamic/qr-code/unbound-list';
    this.httpclient.get(unbindcode, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.unbindcodelist=res['data']
        }else{
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
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
        }, 1500)
      }
    )
  }
  updatecode(index){
    let that=this;
    //let updatemethod=$('input[name="isdislpay"]:checked').attr('title');
    if(index==1){ //门店换新码
      that.updatemethod=1;
      that.coderep=1;
      $(".numbershop").hide()
    }else{//更改门店号
      $(".numbershop").show()
      that.updatemethod=2;
      that.coderep=0;
      $(".oldshopname").text(that.currentmsg.name)
      $(".oldshopnum").text(that.currentmsg.code)

    }
  }
  //选择已有码还是新建码
  oldnewcode(){
    let that=this;
    $('.desc').text('')
    let newoldcode=$('input[name="replacecode"]:checked').attr('title');
    if(newoldcode==0){ //已创建未绑定的二维码替换
      that.coderep=1;
    }else{//建新码替换
      that.coderep=2;
      that.publiccode();
    }
  }
  //更换
  replaceshopcode(){
    //  $('#editshopcode').show()
    // $('.modal-backdrop').show()
    let method1=$('input[name="isdislpay"]:checked').attr('title'); //是门店新换码还是更改门店
    let method2=$('input[name="replacecode"]:checked').attr('title');//如果是换新码，判断是选择新建码还是选未绑定的码
    let ercode=$(".mynewcode").val();//如果选未绑定的码，获取值
    let brandappid=$(".gznumber").val();//如果是新建码的公众号appid
    let newshopcode=$(".replacecodes").val();//如果是更改门店，获取新的门店号
    let that = this;
    let cutstatus=0;
    if(method1==0 && method2==0){//已创建未绑定的二维码替换
      cutstatus=1;
      if($('.mynewcode').val()==""){
        $('.desc').text('*请选中二维码编码');
        return false;
      }
    }
    if(method1==0 && method2==1){//建新码替换
      cutstatus=2
    }
    if(method1==1){//更换门店号
      cutstatus=3;
      if($('.shops2').select2("val")==""){
        $('.desc').text('*请选中门店');
        return false;
      }
    }
    var replaceQrCodeVo  = {
      'appid':brandappid,
      'brand':that.currentmsg.brand,//修改的门店的品牌名
      'brandCode':that.currentmsg.brandCode, //修改的门店的品牌code
      'code':that.currentmsg.code, //旧的门店code
      'id':ercode,  //未绑定选择的二维码id
      'name':that.shopname,//新的门店名称
      'newCode':that.shopid,  //更换的新的门店号
      'oldId':that.currentmsg.id, //旧的二维码id
      'replaceType':cutstatus,
      "region":$('.district2').select2("val"),
      "city":$('.citys2').select2("val")
    };
    if(that.prevent == 0){
      that.prevent = 1
    }else{
      return false;
    }
    var replaceurl = '/barcode/manager/dynamic/qr-code/replace';
    if($('.desc').text()==""){
      this.httpclient.post(replaceurl, replaceQrCodeVo , this.httpOptions).subscribe(
        res => {
          that.prevent = 0
          if (res['code'] == 200) {
            $('#editshopcode').modal("hide")
            that.shopname = ""
            this.cleardata()
            this.loadStoreList()
          }else{
            $('.desc').text(res['desc'])
          }

        },
        (err: HttpErrorResponse) => {
          that.prevent = 0
          this.cleardata()
          that.warning = true;
          that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          }, 1500)
        }
      )
    }
  }
  qrcodehint(){
    $(".desc").text('')
    this.cityslist();
    this.shoplist();
  }
  cleardata(){
    $('#unbind').attr('checked',true)
    $('#newcode').attr('checked',false)
    $(".desc").text('')
    $('.mynewcode').val('')
    $(".district2").val('')
    $(".citys2").val('')
    $(".shops2").val('')
  }
  //点击任意位置图片弹窗隐藏
  img_none() {
    $('.pop_up').hide()
  }

}
