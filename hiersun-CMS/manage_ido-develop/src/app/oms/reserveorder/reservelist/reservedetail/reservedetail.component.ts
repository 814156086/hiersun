import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-reservedetail',
  templateUrl: './reservedetail.component.html',
  styleUrls: ['./reservedetail.component.css']
})
export class ReservedetailComponent implements OnInit {
  orderno: any;            //预约单号
  reservedate: any;        //预约日期
  reservetime: any;        //预约时间
  address: any;            //预约门店
  content: any;            //预约内容
  name: any;               //预约人姓名
  telephone: any;          //联系方式
  origin: any;             //来源
  activityname: any;       //活动名称
  reserveid: any;          //用户标志
  cusromorigin: any;       //客户来源
  url: any;                //渠道url
  id: any;
  statename: any;          //预约单状态   
  orderstatesequence: any;
  verifyremind: any;       //提醒次数   
  signincode: any;         //门店编码  
  signinaddress: any;      //门店地址
  signinshopname: any;     //操作人
  signinshopcode: any;     //操作人编码
  cancelreason: any;       //取消预约单原因
  personalinfo: any;
  classifytype='';       //购买意向品类
  tabprice='';           //预算
  materianame='';        //材质
  mainstoneinfo='';      //钻重
  affixcontent1: any;       //问题
  affixcontent2: any;       //问题
  affixcontent3: any;       //问题
  affixcontent4: any;       //问题
  affixcontent5: any;       //问题
  remark: any;
  zpflag = true;            //赠品详情是否为空
  zpname: any;              //赠品收货人
  zpage: any;               //赠品性别
  zptelephone: any;         //赠品联系方式
  zpaddress: any;           //赠品地址
  zpfilldate: any;          //填写时间
  salesize = true;            //是否有购买记录
  notpurchasereason: any;    //购买记录备注
  maplist = [];                  //销售单关联
  appraiseMark1: any;           //回访问题一答案
  appraiseMark2: any;           //回访问题一答案
  appraiseMark3: any;           //回访问题一答案
  appraiseMark4: any;           //回访问题一答案
  appraiseMarkAVG: any;         //平均分
  reserveSignins: any;          //操作记录
  returnreason: any;            //回访失败原因
  reasoncontent: any;           //回访失败说明
  reservesignins = true;          //是否有操作记录
  reserveopration: any;          //操作记录
  remind: any;                   //是否提醒门店
  messagenum=0;               //用户表示提醒短信
  backpage:any;               //从哪个页面进入的
  shopeType=1;
  nextpage: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  role:any;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.nextpage = data.page;
      that.orderno = data.id;//活动id
      that.backpage=data.laiyuan;
      that.role=data.role;
    })
    if (that.orderno) {
      let listurl = '/oms-admin/reserveorder/queryReserveoOrder/' + that.orderno;
      this.http.get(listurl).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            //that.orderno = data['data'].orderno;
            that.reservedate = data['data'].reservedate;
            that.reservetime = data['data'].reservetime;
            that.address = data['data'].address;
            that.content = data['data'].content;
            that.name = data['data'].name;
            that.telephone = data['data'].telephone;
            that.origin = data['data'].origin;
            that.activityname = data['data'].activityname;
            that.reserveid = data['data'].reserveid;
            that.cusromorigin = data['data'].cusromorigin;
            that.url = data['data'].url;
            that.id = data['data'].id;
            that.statename = data['data'].statename;
            that.orderstatesequence = data['data'].orderstatesequence;
            that.verifyremind = data['data'].verifyremind;
            that.signincode = data['data'].signincode;
            that.signinaddress = data['data'].signinaddress;
            that.signinshopname = data['data'].signinshopname;
            that.signinshopcode = data['data'].signinshopcode;
            that.cancelreason = data['data'].cancelreason;
            that.personalinfo = data['data'].personalinfo;
            that.reserveSignins = data['data'].reserveSignins;
            if (data['data'].reserveCommodity== null || data['data'].reserveCommodity== "") {
              that.classifytype='';
              that.tabprice ='';
              that.materianame ='';
              that.mainstoneinfo='';
            }else{
              that.classifytype = data['data'].reserveCommodity.classifytype;
              that.tabprice = data['data'].reserveCommodity.tabprice;
              that.materianame = data['data'].reserveCommodity.materianame;
              that.mainstoneinfo = data['data'].reserveCommodity.mainstoneinfo;
            }
          
            that.affixcontent1 = data['data'].affixcontent1;
            that.affixcontent2 = data['data'].affixcontent2;
            that.affixcontent3 = data['data'].affixcontent3;
            that.affixcontent4 = data['data'].affixcontent4;
            that.affixcontent5 = data['data'].affixcontent5;
            that.remark = data['data'].remark;
            that.notpurchasereason = data['data'].notpurchasereason;
            that.appraiseMark1 = parseInt(data['data'].appraiseMark1);
            that.appraiseMark2 = parseInt(data['data'].appraiseMark2);
            that.appraiseMark3 = parseInt(data['data'].appraiseMark3);
            that.appraiseMark4 = parseInt(data['data'].appraiseMark4);
            that.appraiseMarkAVG = data['data'].appraiseMarkAVG;
            if(data['data'].reserveDetailShopping==null || data['data'].reserveDetailShopping==""){
              that.returnreason = '';
            that.reasoncontent = '';
            }else{
              that.returnreason = data['data'].reserveDetailShopping.returnreason;
              that.reasoncontent = data['data'].reserveDetailShopping.reasoncontent;
            }
            
            that.remind = data['data'].remind;
            that.messagenum = data['data'].messagenum;
            if (data['data'].reserveDetail == null || data['data'].reserveDetail == "") {
              that.zpname = "";
              that.zpage = "";
              that.zptelephone = "";
              that.zpaddress = "";
              that.zpfilldate = "";
              that.zpflag = false;
            } else {
              that.zpname = data['data'].reserveDetail.name;
              that.zpage = data['data'].reserveDetail.age;
              that.zptelephone = data['data'].reserveDetail.telephone;
              that.zpaddress = data['data'].reserveDetail.address;
              that.zpfilldate = data['data'].reserveDetail.filldate;
              that.zpflag = true;
            }
            if (data['data'].map == null || data['data'].map == "") {
              that.salesize = false;
            } else {
              that.salesize = true;
              var dataMap = data['data'].map
              for (let item in dataMap) {
                that.maplist.push(dataMap[item]);
              }
            }
            if (data['data'].reserveSignins == null || data['data'].reserveSignins == "") {
              that.reservesignins = false;
            } else {
              that.reservesignins = true;
              that.reserveopration = data['data'].reserveSignins
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
      that.isload = false;
    }
  }
  //回访失败确定
  successhf() {
    let that = this;
    if ($("#explain_decsription").val().length == 0) {
      $(".hftips").text("请填写取消原因！");
      return false;
    } else {
      $(".hftips").text("");
      var returnReason = $("input[name=failreason]:checked").val();
      var reasonContent = $("#explain_decsription").val();
      console.log(returnReason + '--' + reasonContent)
      let listurl = '/oms-admin/reserveorder/returnReserveOrderFail/' + that.orderno + '?returnReason=' + returnReason + '?reasonContent=' + reasonContent;
      this.http.get(listurl).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = '保存成功';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
            $('#myModal').hide();
            $(".modal-backdrop").hide()
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
  //提醒门店
  tremind() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/remindTip/' + that.orderno;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.remind=1
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
  //发送提醒短信
  sendmessage(){
    let that = this;
    let listurl = '/oms-admin/reserveorder/messageTip/' + that.orderno;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
            that.messagenum=1;
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
  //取消点击其他出现说明
  qita(){
    $(".cancel_explain").show()
  }
  //取消预约单
  cancelreserve(){
    var cancelReason='';
    if($(".reason_cancel").css("display")=="block"){
      if($("#cancel_decsription").val().length==0){
        $(".canceltips").text("请填写取消原因！");
        return false;
       }else{
        cancelReason = $("#cancel_decsription").val();
       }
    }else{
      cancelReason = $("input[name=cancelreason]:checked").val();
      $(".reson_tips").text("");
    }
    let that = this;
    let listurl = '/oms-admin/reserveorder/cancelReserveOrder/' + that.orderno+'?cancelReason='+cancelReason;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          $('#myModal3').hide();
          $(".modal-backdrop").hide()
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
    if(that.backpage=='kefu'){
      window.history.go(-1)
    }else if(that.backpage=='recovery'){
      that.router.navigateByUrl('oms/recoveryreservelist?page=1');
    }else{
      that.router.navigateByUrl('oms/reservelist?page=' + that.nextpage);
    }  
  }
  editreserve(){
    let that = this;
    that.router.navigateByUrl('oms/addreserveorder?orderno=' + that.orderno);
    $('#myModal2').hide();
    $(".modal-backdrop").hide()
  }
  addreserve() {
    let that=this;
    var url="/oms-admin/reserveorder/saveReserveVisit";
    var ReserveVisitDto={
      "orderno":that.orderno,
      "appraiseMark1": that.appraiseMark1,
      "appraiseMark2": that.appraiseMark2,
      "appraiseMark3": that.appraiseMark3,
      "appraiseMark4": that.appraiseMark4,
      "notPurchaseReason":$(".noshop").val(),
    }
    console.log(ReserveVisitDto)
    this.http.post(url, ReserveVisitDto).subscribe(function (data) {
      console.log(data)
      if (data['code'] == 200) {
        that.isload = false;
        that.isHint = true;
        that.hintMsg = '保存成功';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
            that.router.navigateByUrl("oms/reservelist?role=kefu&page=1");
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
