import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-wxapply',
  templateUrl: './wxapply.component.html',
  styleUrls: ['./wxapply.component.css']
})
export class WxapplyComponent implements OnInit {
  savetype=1;    //判断是添加还是修改，1为添加，2为修改
  oldappid:any;
  businessidlist:any;
  funclists: any;
  enabled = true;
  checked = true;
  shaxiang = 0;
  appid: any;
  key: any;
  wxmchid: any;
  certLocalPath: any;
  wxlist: any;
  mchchannel: any;
  wxMchId:any;
  mchid: any;
  pid: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public businessstaus = true;
  nodata = false;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) {
    this.formModel = fb.group({
      wxMchId: ['', [Validators.required]],
      appid: ['', [Validators.required]],
      key: ['', [Validators.required]],
      certLocalPath: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let that = this;
    that.funclist();
    $("[data-toggle='popover']").popover();
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
    /* $('.switch input#shaxiang').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.shaxiang = 1
        } else {
          that.shaxiang = 0
        }
      }
    }); */
    $(window).scroll(function () {
      $(".md-checkbox").find("a").popover('hide')
    })
    that.mchidlist()
    this.route.queryParams.subscribe(function (data) {
      //console.log(data);
      that.mchchannel = data.mchchannel;
      that.mchid = data.mchid;
      that.pid = data.pid;
      $(".bussshow").val(that.mchid)
      that.apply()
    })
    
  }
  mchidlist(){
    //可用的商户id
    let that=this;
    let businesurl = '/api/v1/pay-mgr/mchInfo/queryMchIds';
    this.http.get(businesurl).subscribe(
      data => {
        that.isload = false;
        if (data['code'] == 200) {
          that.businessidlist = data['data'];
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
    let businesurl = '/api/v1/pay-mgr/payDic/queryPayDic?pid=WXPAY';
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
  detailshow(index,e,comm){
    $(`#${index}`).attr("data-content",comm)
    $(`#${index}`).popover('toggle')
    $(`#${index}`).parents(".md-checkbox").siblings().find("a").popover('hide')
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
  apply() {
    let that = this;
    that.isload = true;
    let businesurl = '/api/v1/pay-mgr/mchPayApp/queryMchPayApp?mchId=' + that.mchid + '&mchChannel=' + that.mchchannel + '&pid=' + that.pid + '&currentPage=1&pageSize=10';
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data']['list'].length > 0) {
            that.savetype=2;
            that.wxlist = data['data']['list'][0];
            that.wxMchId=that.wxlist.wxMchId;
            that.oldappid=that.wxlist.appid;
            that.appid = that.wxlist.appid;
            that.key = that.wxlist.key;
            that.wxmchid = that.wxlist.mchId;
            that.certLocalPath = that.wxlist.certLocalPath;
            that.enabled = that.wxlist.enabled;
            $(".feeRate").val(that.wxlist.feeRate);
            //$(".func").val(that.wxlist.func)
            that.enabled = that.wxlist.enabled;
            that.checked = that.wxlist.checked;
            // that.shaxiang=that.wxlist.sandbox;
            $(".yyname").val(that.wxlist.name);
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
            /* if (that.shaxiang == 0) { //0启用，1禁用
              $('.switch input#shaxiang').bootstrapSwitch('state', true);
            } else {
              $('.switch input#shaxiang').bootstrapSwitch('state', false);
            } */
            var funclist=data['data']['list'][0].func.split(',');
            for(var i in funclist){
              $(`input[name="funcl"][title=${funclist[i]}]`).attr("checked",true)
            }
          } else {
            that.savetype=1;
            that.isHint = true;
            that.hintMsg = '请添加应用';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
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
  onSubmit() {
    let that = this;
    let businesurl = '';
    that.isload = true;
    if(that.savetype==2){//编辑
      businesurl = '/api/v1/pay-mgr/mchPayApp/updateMchPayApp';
    }else{//添加
      businesurl = '/api/v1/pay-mgr/mchPayApp/saveMchPayApp';
    }
    var number = '';
    $('input:checkbox[name=funcl]:checked').each(function(k){
        if(k == 0){
            number = $(this).attr("title");
        }else{
            number += ','+$(this).attr("title");
        }
    })
    var mchPayAppPara = {
      "wxMchId":that.wxMchId,
      "mchChannel": that.mchchannel,
      "mchId": that.mchid,
      "pid": that.pid,
      "oldAppid":that.oldappid,
      "appid": that.appid,
      "key": that.key,
      "certLocalPath": that.certLocalPath,
      "feeRate": $(".feeRate").val(),
      "enabled": that.enabled,
      "checked": that.checked,
      "type": "2",
      "name": $(".yyname").val(),
      "func":number
    }
    console.log(mchPayAppPara)
    this.http.post(businesurl, mchPayAppPara).subscribe(
      data => {
        //console.log(data);
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
    let that = this;
    that.router.navigateByUrl('pay/paymethod?page=1');
    $(".md-checkbox").find("a").popover('hide')
  }
}
