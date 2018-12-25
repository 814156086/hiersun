import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addreserveactive',
  templateUrl: './addreserveactive.component.html',
  styleUrls: ['./addreserveactive.component.css']
})
export class AddreserveactiveComponent implements OnInit {
  activitychannel: any;         // 活动渠道
  createdate: any;              //创建时间
  enable: any;                  //启用无赠品短信通知
  enddate: any;                 //下单终止日期  
  gifttype: any;                //赠品类别
  id: any;                      //预约单赠品id
  name: any;                    //活动名称         
  receivedcount: any;           //已领取赠送的人数
  remark: any;                  //remark
  reservecount: any;            //预约人数
  setcount: any;                //设定赠送礼品人数
  signincount: any;             //到店签到人数        
  startdate: any;               //下单起始日期
  validity: any;                //活动状态
  verifyenddate: any;           //验证终止日期
  verifystartdate: any;         //验证起始日期
  reserveActivityId: any;
  ordertimestart:any;
  ordertimeend: any; //下单起始时间
  validetimestart: any;
  validetimeend: any;//验证起始时间
  message = 1;
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
    this.formModel = fb.group({
      name: ['', [Validators.required]],
      activitychannel: ['', [Validators.required]],
      ordertimestart: ['', [Validators.required]],
      ordertimeend: ['', [Validators.required]],
      validetimestart: ['', [Validators.required]],
      validetimeend: ['', [Validators.required]],
      setcount: ['', [Validators.required]],
      gifttype: ['', [Validators.required]],
      remark: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let that = this;
    laydate.render({
      elem: '#ordertimestart',
      type: 'datetime',
      done: function (value) {
        that.ordertimestart = value
      },
    });
    laydate.render({
      elem: '#ordertimeend',
      type: 'datetime',
      done: function (value) {
        that.ordertimeend = value
      },
    });
    laydate.render({
      elem: '#validetimestart',
      type: 'datetime',
      done: function (value) {
        that.validetimestart = value
      },
    });
    laydate.render({
      elem: '#validetimeend',
      type: 'datetime',
      done: function (value) {
        that.validetimeend = value
      },
    });
    $('.activestatus input').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.iptname = 0
        } else {
          that.iptname = 1
        }
      }
    });
    $('.message input').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.message = 0
        } else {
          that.message = 1
        }
      }
    });
    this.route.queryParams.subscribe(function (data) {
      that.nextpage = data.page;
      that.reserveActivityId = data.id;//活动id
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        $(".form-control").attr("disabled", "disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    if (that.reserveActivityId) {//查看和编辑
      let businesdetail = '/oms-admin/reserveactivity/queryReserveActivity/' + that.reserveActivityId;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.activitychannel = data['data'].activitychannel;         // 活动渠道
            that.createdate = data['data'].createdate;         //创建时间
            //that.enable = data['data'].enable;                //启用无赠品短信通知
            if (data['data'].enable == false) { //是否启用,0停用，1启用
              $('.message input').bootstrapSwitch('state', false);
            } else {
              $('.message input').bootstrapSwitch('state', true);
            }
            that.gifttype = data['data'].gifttype;            //赠品类别
            //that.id=data['data'].                         //预约单赠品id
            that.name = data['data'].name;                   //活动名称         
            that.receivedcount = data['data'].receivedcount;  //已领取赠送的人数
            that.remark = data['data'].remark;                //remark
            that.reservecount = data['data'].reservecount;    //预约人数
            that.setcount = data['data'].setcount;            //设定赠送礼品人数
            that.signincount = data['data'].signincount;      //到店签到人数        
            that.ordertimestart =that.formatDate(data['data'].startdate, '-');          //下单起始日期
            that.ordertimeend = that.formatDate(data['data'].enddate, '-');              //下单终止日期 
            //that.validity = data['data'].validity;                //活动状态0截止，1正在进行中
            if (data['data'].validity == 0) {
              $('.activestatus input').bootstrapSwitch('state', false);
            } else {
              $('.activestatus input').bootstrapSwitch('state', true);
            }
            that.validetimeend = that.formatDate(data['data'].verifyenddate, '-');     //验证终止日期
            that.validetimestart = that.formatDate(data['data'].verifystartdate, '-'); //验证起始日期
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
  formatDate(time, Delimiter) {
    Delimiter = Delimiter || '-';
    var now = new Date(time);

    var year = now.getFullYear() + '';
    var month = now.getMonth() + 1 + '';
    var date = now.getDate() + '';
    var hour = now.getHours() + '';
    var minute = now.getMinutes() + '';
    var second = now.getSeconds() + '';

    // 补0
    month = month.length < 2 ? '0' + month : month;
    date = date.length < 2 ? '0' + date : date;
    hour = hour.length < 2 ? '0' + hour : hour;
    minute = minute.length < 2 ? '0' + minute : minute;
    second = second.length < 2 ? '0' + second : second;

    return year + Delimiter + month + Delimiter + date + " " + hour + ":" + minute + ":" + second;
  }
  goback() {
    //window.history.go(-1)
    let that = this;
    that.router.navigateByUrl('oms/reserveactive?page=' + that.nextpage);
  }
  onSubmit() {
    let that = this;
    if (this.formModel.valid) {
      that.isload = true;
      var para={};
      if (that.reserveActivityId) {
        console.log(that.reserveActivityId)
        para = {
          "id":that.reserveActivityId,
          "validity": that.iptname,
          "name": that.name,
          "activitychannel": that.activitychannel,
          "startdate": that.ordertimestart,
          "enddate": that.ordertimeend,
          "verifyenddate": that.validetimeend,
          "verifystartdate": that.validetimestart,
          "gifttype": that.gifttype,
          "setcount": that.setcount,
          "enable": that.message,
          "remark": that.remark
        }
      }else{
        para = {
          "validity": that.iptname,
          "name": that.name,
          "activitychannel": that.activitychannel,
          "startdate": that.ordertimestart,
          "enddate": that.ordertimeend,
          "verifyenddate": that.validetimeend,
          "verifystartdate": that.validetimestart,
          "gifttype": that.gifttype,
          "setcount": that.setcount,
          "enable": that.message,
          "remark": that.remark
        }
      }
      console.log(para)
      var editerurl = '/oms-admin/reserveactivity/createReserveActivity';
      this.http.post(editerurl, para).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = '保存成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['oms/reserveactive']);
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
