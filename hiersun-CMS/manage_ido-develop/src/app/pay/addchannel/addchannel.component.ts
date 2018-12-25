import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-addchannel',
  templateUrl: './addchannel.component.html',
  styleUrls: ['./addchannel.component.css']
})
export class AddchannelComponent implements OnInit {
  channel:any;
  mchid: any;
  mchchannel: any;
  applyArray = [];   //支付宝参数组合
  ptname: any;
  shops: any;
  balance = true;  //是否开启对账功能
  pid: any;
  businessid: any;     //商户id
  channelid: any;      //渠道id
  channelname: any;    //渠道名称
  channellists = [];
  chanelbussid=''; //渠道商户id
  isstaus: any;         //是否启用
  alipayPublicKey: '';  //支付宝公钥
  appid: '';
  certLocalPath: '';   //微信支付证书路径
  key: '';       //微信密钥
  mchId: '';       //微信商户id
  privateKey: '';   //支付宝商户私钥
  publicKey: '';    //支付宝商户公钥
  remark: any;             //备注
  creattime: any;          //创建时间
  updatetime: any;         //更新时间
  iptname = true;            //启用状态
  isapply = true;       //渠道名称，默认支付宝
  type=2;   //1普通，2店铺
  pidptbh=1;
  businessidlist: any;
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage: any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) {
    this.formModel = fb.group({
      /* businessid: ['', [Validators.required]], */
    })
  }
  ngOnInit() {
    let that = this;
    $('.switch input#businessenabled').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.iptname = false
        } else {
          that.iptname = true
        }
      }
    });
    $('.switch input#balance').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.balance = false
        } else {
          that.balance = true
        }
      }
    });
    if ($().select2) {
      $('#shops').select2({
        placeholder: 'Select',
        allowClear: true
      });
      /* $('#channle').select2({
        placeholder: 'Select',
        allowClear: true
      }); */
    }
    //that.shoplist();
    $("#shops").change(function () {
      if ($(this).select2('val') == null || $(this).select2('val') == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide()
        that.channellist()
        if($(this).select2('val').length>4){
          that.type=1;
        }else{
          that.type=2;
        }
      }
    })
    $("#channel").change(function () {
      if ($(this).val() == null || $(this).val() == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide();
      }
    })

    this.route.queryParams.subscribe(function (data) {
      that.mchid = data.mchid;
      that.mchchannel = data.mchchannel;
      that.pid = data.pid;
      that.btntype = data.type;
      that.nextpage = data.page;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled", "disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    //可用的商户id
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
    //查询接口
    if (that.btntype == 1 || that.btntype == 2) {
      that.isload = true;
      let qudaourl = '/api/v1/pay-mgr/mchPayChannel/queryMchPayChannelByMchId/' + that.mchid + '/' + that.mchchannel + '/' + that.pid;
      this.http.get(qudaourl).subscribe(
        data => {
          if (data['code'] == 200) {
            that.isload = false;
            $(".bussshow").val(data['data'].mchId);        //商户id
            $(".channelname").val(data['data'].channel);        //支付名称
            that.channel=data['data'].channel
            that.chanelbussid = data['data'].pid; //频道编号
            that.ptname = data['data'].name;      //平台名称
            that.type=data['data'].type;           //店铺类型
            $(".feeRate").val(data['data'].feeRate);
            that.iptname = data['data'].enabled;                  //是否启用
            that.balance = data['data'].checked;                  //是否开启对账
            if (that.iptname == true) { //是否启用,0停用，1启用
              $('.switch input#businessenabled').bootstrapSwitch('state', true);
            } else {
              $('.switch input#businessenabled').bootstrapSwitch('state', false);
            }
            if (that.balance == true) { //是否启用,0停用，1启用
              $('.switch input#balance').bootstrapSwitch('state', true);
            } else {
              $('.switch input#balance').bootstrapSwitch('state', false);
            }
            //备注
            if (data['data'].comm == null) {
              that.remark = "--"
            } else {
              that.remark = data['data'].comm;
            }
            that.creattime = data['data'].createTime;   //创建时间
            that.updatetime = data['data'].updateTime;   //更新时间
            let listurl = '/pcm-inner/org/findstorelist?organizationCode=' + data['data'].mchId;
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
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
          $(".qudaosale").val(data['data'].mchChannel);  //销售渠道
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
    } else {
      that.isload = false;
    }

  }
  validnum(e){ 
    var reg=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if(!reg.test($(e).val())){
      $(e).next(".formtips").show();
      return false
    }else{
      $(e).next(".formtips").hide()
    }
    /* const reg = new RegExp("^[0-9]+([.]{1}[0-9]+){0,1}$", "g");
    e.value = !reg.test(e.value)?"":e.value; */
    if(parseInt($(e).val())<0 || parseInt($(e).val())>100){
      $(e).next(".formtips").show()
      return false;
    }else{
      $(e).next(".formtips").hide()
    }
  }
  shoplist() {
    let that = this;
    let listurl = '/pcm-inner/org/findstorelist';
    this.http.get(listurl).subscribe(
      data => {
        //console.log(data);
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
  channellist() {
    let that = this;
    let listurl = '/pcm-inner/org/findstorelist?organizationCode=' + $("#shops").select2("val");
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
  ptbh(){
    let that=this;
    if($(".channelname").val()=="WXPAY"){
      that.pidptbh=2
    }else{
      that.pidptbh=1;
    }
  }
  goback() {
    let that = this;
    that.router.navigateByUrl('pay/paymethod?page=' + that.nextpage);
  }

  onSubmit() {
    let that = this;
    if(that.btntype!=2){
      if ($("#shops").select2('val') == "" || $("#shops").select2('val') == null) {
        $("#shops").next(".formtips").show();
        return false;
      }
      if ($("#channle").select2('val') == "" || $("#channle").select2('val') == null) {
        $("#channle").next(".formtips").show();
        return false;
      }
    } 
    if(that.pidptbh==1){
      var reg = /^[a-zA-Z0-9]+$/
      if (!reg.test($(".pindaonum").val())) {
        $(".pindaonum").next(".formtips").show();
        return false;
      }
    }
    if ($(".ptname").val() == "") {
      $(".ptname").next(".formtips").show();
      return false;
    }
    var reg=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if(!reg.test($(".feeRate").val())){
      $(".feeRate").next(".formtips").show();
      return false
    }else{
      $(".feeRate").next(".formtips").hide()
    }
    if(parseInt($(".feeRate").val())<0 || parseInt($(".feeRate").val())>100){
      $(".feeRate").next(".formtips").show()
      return false;
    }else{
      $(".feeRate").next(".formtips").hide()
    }
    that.isload = true;
    var mchPayChannel={};
    if(that.btntype==2){//编辑
      mchPayChannel = {
        "mchId": that.mchid,//商户id
        "mchChannel":that.mchchannel, //销售渠道code
        "channel": that.channel,//支付渠道
        "pid": that.chanelbussid,
        "enabled": that.iptname,  //是否启用
        "name": that.ptname,
        "checked": that.balance,
        "comm": $(".remark").val(),  //备注
        "feeRate":$(".feeRate").val()
      }
      //console.log(mchPayChannel)
      var editerurl = '/api/v1/pay-mgr/mchPayChannel/updateMchPayChannel';
      this.http.post(editerurl, mchPayChannel).subscribe(function (data) {
        //console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/paymethod']);
          }, 1500)
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
    }else{
      var mchchanel='C';
      if(that.type==2){
        mchchanel=$("#channle").val()
      }else{
        mchchanel='C';
      }
      mchPayChannel = {
        "mchId": $("#shops").select2("val"),//商户id
        "mchChannel":mchchanel, //销售渠道code
        "channel": $(".channelname").val(),//支付渠道
        "pid": that.chanelbussid,
        "enabled": that.iptname,  //是否启用
        "name": that.ptname,
        "checked": that.balance,
        "comm": $(".remark").val(),  //备注
        "feeRate":$(".feeRate").val()
      }
      //console.log(mchPayChannel)
      var editerurl = '/api/v1/pay-mgr/mchPayChannel/saveMchPayChannel';
      this.http.post(editerurl, mchPayChannel).subscribe(function (data) {
        //console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/paymethod']);
          }, 1500)
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
      
  }
}
