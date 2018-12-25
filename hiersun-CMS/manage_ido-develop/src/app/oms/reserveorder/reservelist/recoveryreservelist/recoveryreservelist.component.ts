import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-recoveryreservelist',
  templateUrl: './recoveryreservelist.component.html',
  styleUrls: ['./recoveryreservelist.component.css']
})
export class RecoveryreservelistComponent implements OnInit {

  activityid: any;               //活动ID
  activityname: any;             //活动名称
  address: any;                  //预约店铺地址
  affixcontent1: any;            //问题一
  affixcontent2: any;            //问题2
  affixcontent3: any;            //问题3
  affixcontent4: any;            //问题4
  affixcontent5: any;            //问题5
  allot: any;                    //此预约单是否已分配
  appointfrom: any;             //区分来自洽客的预约单是否参加活动
  appraiseMark1: any;            //回访问题1
  appraiseMark2: any;            //回访问题2
  appraiseMark3: any;            //回访问题3
  appraiseMark4: any;            //回访问题4
  appraiseMarkAVG: any;          //回访问题平均分
  associatorregisterid: any;     //预约单用户id
  cityMap: any;                  //一个对象
  code: any;                     //预约店面编码
  content: any;                   //预约内容
  createdate: any;                //创建时间
  dayDate: any;                    //当天的日期
  dayHour: any;                    //当天时间
  fetchSize: any;
  flag: any;                       //查看编辑标识
  id: any;
  kefuname: any;                  //预约客服
  limit: any;
  listClassify: any;
  listMateria: any;                //一个对象，里面是材质的信息
  name: any;                       //预约人员姓名
  operatorid: any;                 //下单客服id
  orderStates: any;                //预约单状态
  orderType: any;                  //排序类型
  orderno: any;                    //订单号
  orderstatesequence: any;         //预约状态须序号
  ordertype: any;                  //排序类型
  origin: any;                     //预约单来源
  personalinfo: any;               //是否已填写个人收货详情
  provinces: any;                  //省集合
  purchase: any;                   //此预约单的客户是否已购买商品
  registername: any;               //分配客服
  remark: any;                     //预约人员备注
  reserveActivitys: any;            //一个对象
  reserveCommodity: any;             //一个对象
  reserveDetail: any;                //一个对象
  reserveDetailShopping: any;        //一个对象
  reserveOrderId: any;             //预约单id
  reserveOrderSaleDto: any;        //一个对象
  reserveSignins: any;             //一个对象
  reservedate: any;                //预约日期
  reservetime: any;                //预约时间
  shopMap: any;                    //一个对象
  signindate: any;                 //到店签到时间
  start: any;
  telephone: any;                  //预约人员电话
  reservelists: any;
  area: any;  //大区集合
  citys: any;//大区下的城市集合
  shops: any;//城市下的门店集合
  reserveIds: any;     //导出选中的数据集合
  exportType = 1;       //1导出选中的，2为导出全部
  storeCode='kefu';    
  kefulist: any;
  activelist: any;
  ordernos:any;
  reservestatelist: any;
  pageSize = 20;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  businesslist = [];
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }


  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      if (data.page) {
        that.pageNo = data.page;
      } else {
        that.pageNo = 1;
      }
    })
    $('#reservedata').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '-',
      format: 'YYYY/MM/DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    $('#orderdata').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '-',
      format: 'YYYY/MM/DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    $('#validatedata').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '-',
      format: 'YYYY/MM/DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    if ($().select2) {
      $('#area').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    if ($().select2) {
      $('#city').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    if ($().select2) {
      $('#shops').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    if ($().select2) {
      $('#operatorid').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    if ($().select2) {
      $('#orderstates').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    if ($().select2) {
      $('#activityid').select2({
        placeholder: '请选择',
        allowClear: true
      });
    }
    that.reservelist()
    that.arealist();
    that.datalist()
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
      $(".shopcode").val($('#shops').select2('val'))
    })

  }
reservelist() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/queryReserveOrderList';
    const params = new HttpParams()
      .set('currentPage', `${that.pageNo}`)
      .set('pageSize', `${that.pageSize}`)
      .set('origin', $(".origin").val())
      .set('orderno', $(".searchorderno").val())
      .set('telephone', $(".telephone").val())
      .set('code', $('#shops').select2('val'))
      .set('reservedate', $(".reservedata").val())
      .set('orderstates', $(".orderstates").select2('val'))
      .set('createdate', $("#orderdata").val())
      .set('signindate', $("#validatedata").val())
      .set('personalinfo', $(".personalinfo").val())
      .set('operatorid', $(".operatorid").select2('val'))
      .set('orderType', $(".ordertype").val())
      .set('registername', $("#fenpeikr").val())
      .set('orderXu', $(".orderxu").val())
      .set('allot', '1')
    this.http.get(listurl, { params }).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].list.length == 0) {
            that.nodata = true;
            this.reservelists = [];
          } else {
            that.reservelists = data['data'].list;
            history.replaceState(null, null, '/oms/recoveryreservelist?page=' + that.pageNo)
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.reservelist()
              }
            });
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
  //下单客服
  datalist() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/queryReserveStateManageList';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.kefulist = data['data'].manageRegisters; //客服集合
          that.activelist = data['data'].reserveActivitys;//预约活动
          that.reservestatelist = data['data'].reserveStates;//预约状态

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
  reset() {
    $(".form-control").val("");
    $(".select2me").select2("data", null);
    this.reservelist()
  }
  reservetimepx(index) {
    let that = this;
    if (index == 1) {
      if ($(".reservetimepx").hasClass("fa-sort-numeric-desc")) {
        $(".reservetimepx").removeClass("fa-sort-numeric-desc").addClass("fa-sort-numeric-asc")
        $(".orderxu").val("2")
      } else {
        $(".reservetimepx").removeClass("fa-sort-numeric-asc").addClass("fa-sort-numeric-desc")
        $(".orderxu").val("1")
      }
      $(".ordertype").val("reserve")
      that.reservelist()
    } else if (index == 2) {
      $(".ordertype").val("signindate")
      if ($(".validetime").hasClass("fa-sort-numeric-desc")) {
        $(".validetime").removeClass("fa-sort-numeric-desc").addClass("fa-sort-numeric-asc")
        $(".orderxu").val("2")
      } else {
        $(".validetime").removeClass("fa-sort-numeric-asc").addClass("fa-sort-numeric-desc")
        $(".orderxu").val("1")
      }
      that.reservelist()
    }else if (index == 3) {
      $(".ordertype").val("create")
      if ($(".createsuccess").hasClass("fa-sort-numeric-desc")) {
        $(".createsuccess").removeClass("fa-sort-numeric-desc").addClass("fa-sort-numeric-asc")
        $(".orderxu").val("2")
      } else {
        $(".createsuccess").removeClass("fa-sort-numeric-asc").addClass("fa-sort-numeric-desc")
        $(".orderxu").val("1")
      }
      that.reservelist()
    } else {
      $(".orderxu").val("");
      $(".ordertype").val("")
      that.reservelist()
    }
  }
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }
  }
  hsreserve(orderno){
    $(".orderno").val(orderno)
  }
  surerecy(){
    let that = this;
    let listurl = '/oms-admin/handreserve/allotReserveOrder';
    var recycleReserveDto={
      "orderno":$(".orderno").val(),
      "storeCode":that.storeCode,
      "shopCode":'123456'
    }
    this.http.post(listurl, recycleReserveDto).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.reservelist()
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
  issure(){
    let that = this;
    var orderlistno='';
    $("input[name='orderids']:checked").each(function (i, item) {
      if(orderlistno==''){
        orderlistno += $(this).val();
      }else{
        orderlistno += "," + $(this).val();
      }
    })
    that.ordernos=orderlistno;
    console.log(that.ordernos)
    if (that.ordernos == "") {
      that.isHint = true;
      that.hintMsg = '请选择要分配的预约单！';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    
    $("#myModal2").modal('show');
  }
  surerecyall(){
    let that = this;
    let listurl = '/oms-admin/handreserve/allotReserveOrder';
    var recycleReserveDto={
      "orderno":that.ordernos,
      "storeCode":that.storeCode,
      "shopCode":'123456'
    }
    this.http.post(listurl, recycleReserveDto).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.reservelist()
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
