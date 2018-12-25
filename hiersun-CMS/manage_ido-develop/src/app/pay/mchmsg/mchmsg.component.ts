import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-mchmsg',
  templateUrl: './mchmsg.component.html',
  styleUrls: ['./mchmsg.component.css']
})
export class MchmsgComponent implements OnInit {
  @Input() isadd: string;
  @Output() businesslist = new EventEmitter();
  enabled = 1;                //是否启用 0停止，1使用
  shops = [];                 //店铺商户
  businesssy: any;           //请求私钥
  businessxysy: any;         //响应私钥
  chanel = 'C';   //销售渠道默认C
  optional = 2;     //默认选择，2选择，1手动填写新商户
  funclists = [];   //应用列表:
  appluyname = 1;   //支付平台默认支付宝，填写平台编号，微信没有平台编号
  shaxiang = 0;     //支付宝启用沙箱
  checked = true;      //默认开启对账
  mchId = '';            //商铺id
  name = '';      //商铺名称
  chanelbussid: any;   //平台编号
  yynames: '';     //应用平台
  feilv = '0.00'    //费率
  number: '';      //功能列表
  numbername:'';   //功能列表名字
  channellists: any;  //销售渠道
  mchPayChannelEnabled=1;  //渠道是否可用
  mchPayAppEnabled=1;      //应用是否可以
  appid: '';
  wxMchId:'';
  key: '';
  certLocalPath: '';
  alipayPublicKey: '';
  privateKey: '';
  publicKey: '';
  ptname: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let that = this;
    $('.switch input#businessenabled').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.enabled = 0
        } else {
          that.enabled = 1
        }
      }
    });
    if ($().select2) {
      $('#shops').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    $("#shops").change(function () {
      if ($(this).select2('val') == null || $(this).select2('val') == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide()
        that.mchId = $("#shops").select2('val');
        that.name = $("#shops").select2('data').text;
      }
    })
    $("#tab2 .form-control").on("blur", function () {
      if ($(this).val() == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide()
      }
    })
    that.shoplist();
    that.random();
    that.randomxy();
    $(window).scroll(function () {
      $(".md-checkbox").find("a").popover('hide')
    })
  }

  options() {
    if ($('input[name="opeType"]:checked').attr('title') == 1) { //添加新商户
      this.optional = 1;
      console.log(this.optional)
    } else {
      this.optional = 2;
      console.log(this.optional)
    }
  }
  //生成随机密钥
  random() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    this.businesssy = uuid
  }
  //生成相应密钥
  randomxy() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    this.businessxysy = uuid
  }
  //店铺商户
  shoplist() {
    let that = this;
    let listurl = '/pcm-inner/org/findstorelist';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length != 0) {
            that.shops = data['data'];
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
  channellist(objname) {
    let that = this;
    console.log(that.name)
    let listurl = '/pcm-inner/org/findstorelist?organizationName=' + objname;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length != 0) {
            that.channellists = data['data'][0].channels;
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
  funclist(obj) {
    let that = this;
    let businesurl = '/api/v1/pay-mgr/payDic/queryPayDic?pid=' + obj;
    this.http.get(businesurl).subscribe(
      data => {
        //console.log(data);
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
  yyname() {
    this.yynames = $(".yyname").val()
  }
  thisvalue() {
    this.chanel = $("#channle").val();
    console.log(this.chanel)
  }
  //支付平台
  applyname(e) {
    let that = this;
    if ($(e).val() == "WXPAY") {
      that.funclist('WXPAY')
      that.appluyname = 2;
      $("#tab2 input.form-control").val("");
      $(".feeRate").val("0.00")
    } else {
      that.appluyname = 1;
      that.initialization()
      $("#tab2 input.form-control").val("");
      $(".feeRate").val("0.00");
    }
  }
  //校验
  validinput(e) {
    let that = this;
    if ($(e).val() == "") {
      $(e).next().next(".formtips").show();
      return false;
    } else {
      $(e).next().next(".formtips").hide();
    }
    that.name = $(e).val();
  }
  validbh(e) {
/*     var reg = /^[a-zA-Z0-9]+$/
    if (!reg.test($(e).val())) {
      $(e).next(".formtips").show();
      return false;
    } else {
      $(e).next(".formtips").hide();
    } */
    const reg = new RegExp("^[a-zA-Z0-9]+$", "g");
   e.value = !reg.test(e.value)?"":e.value;

  }
  validnum(e) {
    let that = this;
    var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if (!reg.test($(e).val())) {
      $(e).next(".formtips").show();
      return false
    } else {
      $(e).next(".formtips").hide();
      that.feilv = $(e).val();
    }
    if (parseInt($(e).val()) < 0 || parseInt($(e).val()) > 100) {
      $(e).next(".formtips").show()
      return false;
    } else {
      that.feilv = $(e).val();
      $(e).next(".formtips").hide()
    }
  }
  detailshow(index, e, comm) {
    console.log(comm)
    $(`#${index}`).attr("data-content", comm)
    $(`#${index}`).popover('show');
    $(`#${index}`).parents(".md-checkbox").siblings().find("a").popover('hide')
  }
  changetab(index) {
    let that = this;
    if (index == 0) {
      $(".watestep").find("a").eq(0).hide();
      $(".watestep").find("a").eq(1).show();
      $(".watestep").find("a").eq(2).hide();
      $(".watestep").find("a").eq(3).hide();
      $(".progress-bar-success").css("width", "33%");
      $(".md-checkbox").find("a").popover('hide')
    } else if (index == 1) {
      that.initialization();
      $(".watestep").find("a").eq(0).show();
      $(".watestep").find("a").eq(1).hide();
      $(".watestep").find("a").eq(2).show();
      $(".watestep").find("a").eq(3).hide();
      $(".progress-bar-success").css("width", "66%");
      $(".md-checkbox").find("a").popover('hide');
      if (that.optional == 2) {  //选择
        var choosename = $("#shops").select2('data').text.split('-')
        that.channellist(choosename[1])
      }
    } else {
      $(".watestep").find("a").eq(0).show();
      $(".watestep").find("a").eq(1).hide();
      $(".watestep").find("a").eq(2).hide();
      $(".watestep").find("a").eq(3).show();
      $(".progress-bar-success").css("width", "100%");
      $(".md-checkbox").find("a").popover('hide')
    }
  }
  //上一步
  prestep() {
    let that = this;
    var $active = $('.form-wizard .nav li.active');
    var goto = $('.form-wizard .nav li.active').index();
    $active.prev().removeClass('disabled');
    $active.prev().find('a[data-toggle="tab"]').click();
    if (goto == 1) {//tab1
      $(".watestep").find("a").eq(0).hide();
      $(".watestep").find("a").eq(1).show();
      $(".watestep").find("a").eq(2).hide();
      $(".watestep").find("a").eq(3).hide();
      $(".progress-bar-success").css("width", "33%");
    } else if (goto == 2) {
      $(".watestep").find("a").eq(0).show();
      $(".watestep").find("a").eq(1).hide();
      $(".watestep").find("a").eq(2).show();
      $(".watestep").find("a").eq(3).hide();
      $(".progress-bar-success").css("width", "66%");
    }
    $(".tips").text("")
  }
  //下一步
  nextstep() {
    let that = this;
    var $active = $('.form-wizard .nav li.active');
    var goto = $('.form-wizard .nav li.active').index();
    $active.next().removeClass('disabled');
    $active.next().find('a[data-toggle="tab"]').click();
    $(".watestep").find("a").eq(0).show();
    $(".watestep").find("a").eq(1).hide();
    $(".watestep").find("a").eq(2).show();
    $(".watestep").find("a").eq(3).hide();
    $(".progress-bar-success").css("width", "66%");
    if (that.optional == 2) {  //选择
      var choosename = $("#shops").select2('data').text.split('-')
      that.channellist(choosename[1])
    }
    that.chanel = $("#channle").val();
  }
  nextstep2() {
    let that = this;
    var $active = $('.form-wizard .nav li.active');
    var goto = $('.form-wizard .nav li.active').index();
    $active.next().removeClass('disabled');
    $active.next().find('a[data-toggle="tab"]').click();
    $(".watestep").find("a").eq(0).show();
    $(".watestep").find("a").eq(1).hide();
    $(".watestep").find("a").eq(2).hide();
    $(".watestep").find("a").eq(3).show();
    $(".progress-bar-success").css("width", "66%");
    $(".md-checkbox").find("a").popover('hide');
    if (that.optional == 2) {  //选择
      that.chanel = $("#channle").val();
    } else {
      that.chanel = 'C';
    }
  }
  stepone1(e) {
    let that = this;
    if ($(".ptname").val() == "") {
      $(".ptname").next(".formtips").show();
      return false;
    } else {
      $(".ptname").next(".formtips").hide();
    }
    if ($(".appid").val() == "") {
      $(".appid").next(".formtips").show();
      return false;
    } else {
      $(".appid").next(".formtips").hide();
    }
    if (that.appluyname == 1) {
      //如果是支付宝
      var reg = /^[a-zA-Z0-9]+$/
      if (!reg.test($(".pindaonum").val())) {
        $(".pindaonum").next(".formtips").show();
        return false;
      } else {
        $(".pindaonum").next(".formtips").hide();
      }
      $(".alipayrequire").each(function (i) {
        if ($(this).val() == "") {
          $(this).next(".formtips").show();
          return false;
        } else {
          $(this).next(".formtips").hide();
        }
      })
    } else {
      //如果是微信
      $(".wxrequire").each(function (i) {
        if ($(this).val() == "") {
          $(this).next(".formtips").show();
          return false;
        } else {
          $(this).next(".formtips").hide();
        }
      })
    }
    that.nextstep2();
  }
  stepone(e) {
    let that = this;
    if (that.optional == 1) {  //普通商户
      if ($(".addbusines input").val() == "") {
        $(".addbusines input").next(".formtips").show();
        return false;
      }
    } else {
      if ($("#shops").select2("val") == "" || $("#shops").select2("val") == null) {
        $("#shops").next(".formtips").show();
        return false;
      }
    }
    that.nextstep();
    that.initialization();

  }
  shaxiangchange(){
    let that=this;
    if ($('input[name="shaxiang"]:checked').attr('title') == 1) { //不启用
      that.shaxiang = 1;
    } else {
      that.shaxiang = 0;
    }
  }
  initialization() {
    let that = this;
    /* $('.switch input#shaxiang').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.shaxiang = 1
        } else {
          that.shaxiang = 0
        }
      }
    }); */
    $('.switch input#balance').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.checked = false
        } else {
          that.checked = true
        }
      }
    });
    $('.switch input#chanenlname').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.mchPayChannelEnabled = 0;
        } else {
          that.mchPayChannelEnabled = 1;
        }
      }
    });
    $('.switch input#yongname').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.mchPayAppEnabled = 0;
        } else {
          that.mchPayAppEnabled = 1;
        }
      }
    });
    that.funclist('ALIPAY');
  }
  checkfunclist() {
    let that = this;
    $('input:checkbox[name=funcl]:checked').each(function (k) {
      if (k == 0) {
        that.number = $(this).attr("title");
        that.numbername=$(this).val();
      } else {
        that.number += ',' + $(this).attr("title");
        that.numbername += ',' + $(this).val();
      }
    })
  }
  //提交
  onsubmit() {
    let that = this;
    if (that.optional == 2) {  //选择
      that.chanel = $("#channle").val();
    } else {
      that.chanel = 'C';
    }
    if (that.name == "" || that.name == undefined) {
      $('.form-wizard .nav li').eq(0).find('a[data-toggle="tab"]').click();
    }
    if (that.ptname == "" || that.ptname == undefined) {
      $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
      that.initialization();
    }
    if (that.feilv == "" || that.feilv == undefined) {
      $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
      that.initialization();
    }
    if (that.appid == "" || that.appid == undefined) {
      $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
      that.initialization();
    }
    if (that.appluyname == 1) {//支付宝
      if (that.chanelbussid == "" || that.chanelbussid == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
      if (that.alipayPublicKey == "" || that.alipayPublicKey == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
      if (that.privateKey == "" || that.privateKey == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
      if (that.publicKey == "" || that.publicKey == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
    }
    if (that.appluyname == 2) {//微信
      if (that.wxMchId == "" || that.wxMchId == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
      if (that.key == "" || that.key == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
      if (that.certLocalPath == "" || that.certLocalPath == undefined) {
        $('.form-wizard .nav li').eq(1).find('a[data-toggle="tab"]').click();
        that.initialization();
      }
    }

    $('input:checkbox[name=funcl]:checked').each(function (k) {
      if (k == 0) {
        that.number = $(this).attr("title");
        that.numbername=$(this).val();
      } else {
        that.number += ',' + $(this).attr("title");
        that.numbername += ',' + $(this).val();
      }
    })
    let machmsg = '/api/v1/pay-mgr/mchInfoChannelApp/saveMchInfoChannelApp';
    var mchInfoChannelAppPara = {
      "type": that.optional,        //商户类型
      "mchId": that.mchId,          //商户id，如果是普通商户，id后台自动生成
      "name": that.name,            //商户名称
      "reqKey": that.businesssy,    //请求密钥
      "resKey": that.businessxysy,  //响应密钥
      "state": that.enabled,       //商户状态 0停止，1使用
      "mchInfoComm": $(".comm").val(),   //备注
      "channel": that.chanel,            //渠道编码默认为C,
      "mchChannel": '1212122',
      "mchPayChannel": $(".channelname").val(),   //支付平台名称
      "mchPayAppType": that.appluyname,     //1为支付宝，2为微信
      "pid": that.chanelbussid,           //平台编号,如果是支付宝的话，需要，如果是微信的话不需要
      "mchPayChannelName": that.ptname,   //平台名称
      "mchPayAppName": $(".yyname").val(),  //应用名称
      "appid": that.appid,
      "wxMchId":that.wxMchId,
      "key": that.key,
      "certLocalPath": that.certLocalPath,
      "alipayPublicKey": that.alipayPublicKey,
      "privateKey": that.privateKey,
      "publicKey": that.publicKey,
      "feeRate:": $(".feeRate").val(),     //费率
      "checked": that.checked,            //是否开启对账
      "sandbox": that.shaxiang,            //沙箱，0启用，1不启用
      "func": that.number,
      "mchPayChannelEnabled":that.mchPayChannelEnabled,
      "mchPayAppEnabled":that.mchPayAppEnabled
    }
    console.log(mchInfoChannelAppPara)
    this.http.post(machmsg, mchInfoChannelAppPara).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          $("#myModal").modal('hide');
          that.businesslist.emit()
        } else {
          $(".tips").text(data['desc'])
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
}
