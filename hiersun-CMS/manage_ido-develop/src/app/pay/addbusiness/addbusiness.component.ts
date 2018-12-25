import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-addbusiness',
  templateUrl: './addbusiness.component.html',
  styleUrls: ['./addbusiness.component.css']
})
export class AddbusinessComponent implements OnInit {
  chanel = 'C';   //销售渠道默认C
  optional=2;     //默认选择，2选择，1手动填写新商户
  channellists: any;
  shops: any;
  mchId='';
  businessname: any;
  businessid: any;
  businesstype: any;
  businesssy: any;
  businessxysy: any;
  creattime: any;
  updatetime: any;
  iptname = 1;
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
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
  }
  ngOnInit() {
    let that = this;
    $('.switch input').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.iptname = 0
        } else {
          that.iptname = 1
        }
      }
    });
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.nextpage = data.page;
      that.mchId = data.mchId;//商户id
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled", "disabled")
      } else if (that.btntype == 2) {//编辑
        that.random()
        that.randomxy()
        that.btnshowhide = true;
      } else {//添加的时候
        that.random()
        that.randomxy()
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    if ($().select2) {
      $('#shops').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    that.shoplist();
    $("#shops").change(function () {
      if ($(this).select2('val') == null || $(this).select2('val') == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide()
        that.channellist()
      }
    })
    $("#channel").change(function () {
      if ($(this).val() == null || $(this).val() == "") {
        $(this).next(".formtips").show()
      } else {
        $(this).next(".formtips").hide()
      }
    })
    if (that.mchId) {//查看和编辑
      that.isload = true;
      let businesdetail = '/api/v1/pay-mgr/mchInfo/queryMchInfoByMchId/' + that.mchId;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            if(data['data'].type=="1"){ //2选择，1手动填写新商户
              $("#franchise").attr("checked","checked");
              $("#regular").attr("disabled","disabled");
              that.optional=1;
            }else{
              $("#franchise").attr("disabled","disabled");
              $("#regular").attr("checked","checked");
              that.optional=2;
            }
            $("#channel").attr("disabled", "disabled")
            that.businessname = data['data'].name;//商户名称
            that.businessid = data['data'].mchId;//商户名称
            that.chanel = data['data'].channel;
            $("#shops").select2('val', 'that.businessid')
            that.businesssy = data['data'].reqKey;//请求私钥
            that.businessxysy = data['data'].resKey;//响应私钥
            that.creattime = data['data'].createTime;//创建时间
            that.updatetime = data['data'].updateTime;//更新时间
            $(".comm").val(data['data'].comm)
            $(".businesstype").val(data['data'].type)
            if (data['data'].state == 0) { //是否启用,0停用，1启用
              $('.switch input').bootstrapSwitch('state', false);
            } else {
              $('.switch input').bootstrapSwitch('state', true);
            }
            console.log(that.mchId)
            let listurl = '/pcm-inner/org/findstorelist?organizationCode=' + that.mchId;
            this.http.get(listurl).subscribe(
              data => {
                console.log(data);
                that.isload = false;
                if (data['code'] == 200) {
                  if (data['data'].length != 0) {
                    that.channellists = data['data'][0].channels;
                    console.log(that.chanel)
                    // $("#channel").val(that.chanel);//销售渠道
                    console.log($("#channel").val())
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
    } else {//新添加
      that.isload = false;
    }
    
  }
  //
  options(){
    if($('input[name="opeType"]:checked').attr('title')==1){ //添加新商户
      this.optional=1;
      this.btntype=3
    }else{
      this.btntype=3
      this.optional=2;
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
  //生成随机密钥
  randomxy() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    this.businessxysy = uuid
  }
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
  goback() {
    //window.history.go(-1)
    let that = this;
    that.router.navigateByUrl('pay/businessinfo?page=' + that.nextpage);
  }
  onSubmit() {
    let that = this;
    that.isload = true;
    var mchInfoPara = {}
    if (that.btntype == 2) {//编辑
      mchInfoPara = {
        "mchId": that.mchId,//商户id
        "name": that.businessname,
        "type": that.optional,//商户类型
        "state": that.iptname, //是否启用
        "reqKey": that.businesssy,  //请求私钥
        "resKey": that.businessxysy, //响应私钥
        "comm": $(".comm").val()
      }
      console.log(mchInfoPara)
      var editerurl = '/api/v1/pay-mgr/mchInfo/updateMchInfo';
      this.http.post(editerurl, mchInfoPara).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/businessinfo']);
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

    } else {
      if(that.optional==1){
        if(that.businessname=="" || that.businessname==null){
            $(".txname").next(".formtips").show();
            return false;
        }
      }else{
        if ($("#shops").select2("val") == "" || $("#shops").select2("val") == null) {
          $("#shops").next(".formtips").show();
          return false;
        }else{
          that.mchId=$("#shops").select2('val');
          that.businessname=$("#shops").select2('data').text
        }
      }
      
      mchInfoPara = {
        "mchId": that.mchId,//商户id
        "name": that.businessname,
        "type": that.optional,//商户类型
        "state": that.iptname, //是否启用
        "reqKey": that.businesssy,  //请求私钥
        "resKey": that.businessxysy, //响应私钥
        "comm": $(".comm").val()
      }
      console.log(mchInfoPara)
      var editerurl = '/api/v1/pay-mgr/mchInfo/saveMchInfo';
      this.http.post(editerurl, mchInfoPara).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/businessinfo']);
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
