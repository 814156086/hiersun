import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {
  oldappid:any;
  businessidlist:any;
  funclists:any;
  btntype:any;
  shaxiang=0;
  func:any;
  feerate:any;
  iptname:any;
  balance:any;
  checked=true;
  alipayPublicKey:any;
  privateKey:any;
  publicKey:any;
  mchchannel:any;
  enabled=true;
  mchid:any;
  pid:any;
  appid:any;
  applyArray=[];   //支付宝参数组合
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) { 
    this.formModel = fb.group({
      appid: ['', [Validators.required]],
      alipayPublicKey: ['', [Validators.required]],
      privateKey: ['', [Validators.required]],
      publicKey: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let that=this;
    that.funclist()
    $('.switch input#businessenabled').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.enabled = false
        } else {
          that.enabled = true
        }
      }
    });
    $('.switch input#balance').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.checked = false
        } else {
          that.checked = true
        }
      }
    });
    $('.switch input#shaxiang').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.shaxiang = 1
        } else {
          that.shaxiang = 0
        }
      }
    });
    $(window).scroll(function () {
      $(".md-checkbox").find("a").popover('hide')
    })
    //that.mchidlist();
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.mchchannel = data.mchchannel;
      that.mchid = data.mchid;
      that.pid = data.pid;
      that.appid=data.appid;
      that.oldappid=data.appid;
      that.btntype=data.btntype  //编辑是2，查看是1，添加是3
      $(".bussshow").val(that.mchid)
      that.applydetail();
    })
   
  }
  applydetail(){
    let that = this;
    that.isload = true;
    let businesurl='/api/v1/pay-mgr/mchPayApp/queryMchPayAppByPid/'+that.mchid+'/'+that.mchchannel+'/'+that.pid+'/'+that.appid;
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.alipayPublicKey=data['data'].alipayPublicKey;
          that.privateKey=data['data'].privateKey;
          that.publicKey=data['data'].publicKey;
          that.enabled=data['data'].enabled;
          $(".feeRate").val(data['data'].feeRate);
          $(".func").val(data['data'].func)
          that.enabled=data['data'].enabled;
          that.checked=data['data'].checked;
          that.shaxiang=data['data'].sandbox;
          $(".yyname").val(data['data'].name);
          if (that.enabled == true) {
            $('.switch input#businessenabled').bootstrapSwitch('state', true);
          } else {
            $('.switch input#businessenabled').bootstrapSwitch('state', false);
          }
          if (that.checked == true) {
            $('.switch input#balance').bootstrapSwitch('state', true);
          } else {
            $('.switch input#balance').bootstrapSwitch('state', false);
          }
          if (that.shaxiang == 0) { //0启用，1禁用
            $('.switch input#shaxiang').bootstrapSwitch('state', true);
          } else {
            $('.switch input#shaxiang').bootstrapSwitch('state', false);
          }
          var funclist=data['data'].func;
            for(var i in funclist){
              $(`input[name="funcl"][title=${funclist[i]}]`).attr("checked",true)
            }
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
   //功能列表
   funclist() {
    let that = this;
    let businesurl = '/api/v1/pay-mgr/payDic/queryPayDic?pid=ALIPAY'
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data']['list'].length > 0) {
            that.funclists = data['data']['list'];
          }
        } else {
          that.isHint = true;
          that.hintMsg = '没有应用,请添加';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  validnum(e) {
    let that = this;
    var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if (!reg.test($(e).val())) {
      $(e).next(".formtips").show();
      return false
    } else {
      $(e).next(".formtips").hide();
    }
    if (parseInt($(e).val()) < 0 || parseInt($(e).val()) > 100) {
      $(e).next(".formtips").show()
      return false;
    } else {
      $(e).next(".formtips").hide()
    }
  }

  detailshow(index,e,comm){
    $(`#${index}`).attr("data-content",comm)
    $(`#${index}`).popover('toggle')
    $(`#${index}`).parents(".md-checkbox").siblings().find("a").popover('hide')
  }
  onSubmit(){
    let that = this;
    that.isload = true;
    var businesurl='';
    var number = '';
    $('input:checkbox[name=funcl]:checked').each(function(k){
        if(k == 0){
            number = $(this).attr("title");
        }else{
            number += ','+$(this).attr("title");
        }
    })
    if(that.btntype!=3){//编辑
      businesurl = '/api/v1/pay-mgr/mchPayApp/updateMchPayApp';
    }else{//添加
      businesurl = '/api/v1/pay-mgr/mchPayApp/saveMchPayApp';
    }
    //let businesurl='/api/v1/pay-mgr//mchPayApp/saveOrUpdateMchPayApp';
    var mchPayAppPara ={
      "mchChannel" :that.mchchannel,
      "mchId" :that.mchid,
      "pid" :that.pid,
      "oldAppid":that.oldappid,
      "appid":that.appid,
      "alipayPublicKey":that.alipayPublicKey,
      "privateKey":that.privateKey,
      "publicKey":that.publicKey,
      "func":number,
      "feeRate":$(".feeRate").val(),
      "enabled": that.enabled,
      "checked":that.checked,
      "type":"1",               //1是支付宝，2是微信
      "sandbox":that.shaxiang,
      "name":$(".yyname").val()
    }
    console.log(number)
    console.log(mchPayAppPara)
    this.http.post(businesurl,mchPayAppPara).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {     
          $(".md-checkbox").find("a").popover('hide')
          that.isHint = true;
          that.hintMsg = '保存成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.goback()
          }, 1000)

        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  goback() {
    window.history.go(-1);
    $(".md-checkbox").find("a").popover('hide')
  }
}
