import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addreserveorder',
  templateUrl: './addreserveorder.component.html',
  styleUrls: ['./addreserveorder.component.css']
})
export class AddreserveorderComponent implements OnInit {
  dayHour:any;  //当前日期
  dayDate:any;  //当前时间
  area: any;  //大区集合
  citys: any;//大区下的城市集合
  shops: any;//城市下的门店集合
  chooseshop = ''; //所选门店
  chooseshopcode=''; //所选门店code
  reservename = '';//预约姓名
  reservetel = '';  //预约电话
  reservebz = '';   //预约标志
  orderno: any;   //订单号
  cusromorigin:any;  //客户来源
  url:any;//渠道url
  statename:any; //订单状态
  orderstatesequence=1;  //订单状态码
  verifyremind:any; //提醒次数
  signinaddress:any; //门店地址
  signincode:any; //门店code
  signinshopname:any; //操作人
  signinshopcode:any;  //操作人编号
  cancelreason:any;  //取消原因
  id: any;
  classifytype: any;       //购买意向品类
  tabprice: any;           //预算
  materianame: any;        //材质
  mainstoneinfo: any;      //钻重
  affixcontent1: any;       //问题
  affixcontent2: any;       //问题
  affixcontent3: any;       //问题
  affixcontent4: any;       //问题
  affixcontent5: any;       //问题
  remark: any;
  activelist: any;
  ordertimestart:any; //预约日期
  isedit=false;   //是否是修改预约单
  nextpage: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nodata = false;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      that.orderno = data.orderno;//订单号
      if(data.orderno){
          that.isedit=true; //修改
      }else{
        that.isedit=false; //新增
      }
    })
    if(that.isedit){
      $(".reservename").attr("disabled","disabled");
      $(".reservetel").attr("disabled","disabled")
      $(".reservebz").attr("disabled","disabled")
      let listurl = '/oms-admin/reserveorder/queryReserveoOrder/' + that.orderno;
      this.http.get(listurl).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            //that.orderno = data['data'].orderno;
            that.ordertimestart = data['data'].reservedate.substring(0,10);
            $(".reservetime").val(data['data'].reservetime).show();
            that.chooseshop = data['data'].address;
            $(".reservecontent").val(data['data'].content);
            that.reservename = data['data'].name;
            that.reservetel = data['data'].telephone;
            $(".origin").val(data['data'].origin);
            $('#activityid').select2({
              placeholder: data['data'].activityname,
              allowClear: true
            });
            that.reservebz = data['data'].reserveid;
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
            //that.personalinfo = data['data'].personalinfo;
            //that.reserveSignins = data['data'].reserveSignins;
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
            /* that.notpurchasereason = data['data'].notpurchasereason;
            that.appraiseMark1 = data['data'].appraiseMark1;
            that.appraiseMark2 = data['data'].appraiseMark2;
            that.appraiseMark3 = data['data'].appraiseMark3;
            that.appraiseMark4 = data['data'].appraiseMark4;
            that.appraiseMarkAVG = data['data'].appraiseMarkAVG;
            that.returnreason = data['data'].reserveDetailShopping.returnreason;
            that.reasoncontent = data['data'].reserveDetailShopping.reasoncontent;
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
            } */
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
    that.currentdata();
    laydate.render({
      elem: '#ordertimestart',
      type: 'date',
      min: $(".currentdata").val(),
      max:30,
      done: function (value) {
        that.ordertimestart = value;
        $(".reservetime").show();
        $(".reservetime").val("");
      },
    });
    that.datalist();
    if ($().select2) {
      $('#activityid').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
  }
  //判断活动
  isactive(){
    let that=this;
    let businesurl='/oms-admin/reserveorder/getReserveActivityList?reserveDate='+that.ordertimestart+'&reserveTime='+$(".reservetime").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
       that.activelist=data['data']
      },
      err=>{
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  currentdata(){
    let that=this;
    let businesurl='/oms-admin/reserveorder/createReserveOrder';
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(that.isedit){
            
          }else{
            that.orderno=data['data'].orderno;
          }
          that.dayHour=data['data'].dayHour;
          that.dayDate=data['data'].dayDate;
          $(".currentdata").val(that.dayHour)
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  searchshoplist(){
    if ($().select2) {
      $('#area').select2({
        placeholder: '请选择',
        allowClear: true
      });
      $('#city').select2({
        placeholder: '请选择',
        allowClear: true
      });
      $('#shops').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    let that=this;
    that.arealist();
    $("#area").change(function () {
      $("#city").select2("data", null);
      $("#shops").select2("data", null);
      that.citylist()
    })
    $("#city").change(function () {
      $("#shops").select2("data", null);
      that.shoplist()
    })
    $("#shops").change(function () {
      $("#shopcode").val($('#shops').select2('val'))
      $("#shopname").val($('#shops').select2('data').text)
    })
  }
  datalist() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/queryReserveStateManageList';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          //that.kefulist = data['data'].manageRegisters; //客服集合
          that.activelist = data['data'].reserveActivitys;//预约活动
          //that.reservestatelist = data['data'].reserveStates;//预约状态

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
  //大区
  arealist() {
    let that = this;
    let listurl = '/pcm-inner/org/findAreas';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            that.nodata = true;
            this.area = [];
          } else {
            that.area = data['data'];
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

  //city
  citylist() {
    console.log($('#area').select2('val'));
    let that = this;
    let listurl = '/pcm-inner/org/findAreaCitys?area=' + $('#area').select2('val');
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            that.nodata = true;
            this.citys = [];
          } else {
            that.citys = data['data'];
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
  //shop
  shoplist() {
    let that = this;
    let listurl = '/pcm-inner/org/findstorelist?addrAreaName=' + $('#city').select2('val');
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            that.nodata = true;
            this.shops = [];
          } else {
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
  sureshop() {
    this.chooseshop = $("#shopname").val();
    this.chooseshopcode = $("#shopcode").val();
    $('#myModal').hide();
    $(".modal-backdrop").hide()
  }
  clearshopname() {
    this.chooseshop = ""
    this.chooseshopcode = "";
    $("#area").select2("data",null);
    $("#city").select2("data",null);
    $("#shops").select2("data",null)
  }
  blacktel(){
    let that=this;
    let businesurl='/oms-admin/reserveorder/checkBlackList/'+that.reservetel;
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data']==true){ //是黑名单
            that.isHint= true;
            that.hintMsg = '此手机号是黑名单';
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
          }
          
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
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
    that.router.navigateByUrl('oms/reservelist?page=1');
  }
  addreserve() {
    let that=this;
    if(that.ordertimestart==null || that.ordertimestart==""){
      that.isHint = true;
      that.hintMsg ='预约日期必填';
      $("#ordertimestart").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    if($(".reservetime").val()==""){
      that.isHint = true;
      that.hintMsg ='预约时间必选';
      $(".reservetime").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }
    if(that.chooseshop==null || that.chooseshop==""){
      that.isHint = true;
      that.hintMsg ='预约门店必选';
      $(".chooseshop").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }

    if(that.reservename==null || that.reservename==""){
      that.isHint = true;
      that.hintMsg ='预约姓名必填';
      $(".reservename").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }
    if(that.reservetel==null || that.reservetel==""){
      that.isHint = true;
      that.hintMsg ='联系方式必填';
      $(".reservetel").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }
    if(that.reservebz==null || that.reservebz==""){
      that.isHint = true;
      that.hintMsg ='用户标志必填';
      $(".reservebz").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }
    if($(".origin").val()==""){
      that.isHint = true;
      that.hintMsg ='订单来源必选';
      $(".origin").css("border-color","red")
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500);
      return false;
    }
    var editerurl = '/oms-admin/reserveorder/saveReserveOrder';
    var shopcode='';
    var para={};
    console.log(that.signincode)
    if(that.isedit){//修改预约单
      shopcode=that.signincode;
      para={
        "orderno":that.orderno,
        "activityid": $(".activityid").select2('val'),
        "address": that.chooseshop,
        "content": $(".reservecontent").val(),
        "reservedate": that.ordertimestart,
        "reservetime": $(".reservetime").val(),
        "telephone":that.reservetel,
        "name": that.reservename,
        "origin":$(".origin").val(),
        "code":shopcode,
        "reserveid":that.reservebz,
        "classifytype": that.classifytype,
        "tabprice":that.tabprice,
        "materianame": that.materianame,
        "mainstoneinfo":that.mainstoneinfo,
        "affixcontent1": that.affixcontent1,
        "affixcontent2": that.affixcontent2,
        "affixcontent3": that.affixcontent3,
        "affixcontent4": that.affixcontent4,
        "affixcontent5": that.affixcontent5,
        "cusromorigin":that.cusromorigin,
        "url":that.url,
        "id":that.id,
        "storeCode":'kefu',
        "shopCode":'011'
      }
    }else{
      shopcode=that.chooseshopcode;
      para={
        "orderno":that.orderno,
        "activityid": $(".activityid").select2('val'),
        "address": that.chooseshop,
        "content": $(".reservecontent").val(),
        "reservedate": that.ordertimestart,
        "reservetime": $(".reservetime").val(),
        "telephone":that.reservetel,
        "name": that.reservename,
        "origin":$(".origin").val(),
        "code":shopcode,
        "reserveid":that.reservebz,
        "classifytype": that.classifytype,
        "tabprice":that.tabprice,
        "materianame": that.materianame,
        "mainstoneinfo":that.mainstoneinfo,
        "affixcontent1": that.affixcontent1,
        "affixcontent2": that.affixcontent2,
        "affixcontent3": that.affixcontent3,
        "affixcontent4": that.affixcontent4,
        "affixcontent5": that.affixcontent5,
        "cusromorigin":that.cusromorigin,
        "url":that.url
      }
    }
    
    console.log(para)
      this.http.post(editerurl, para).subscribe(function (data) {
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
