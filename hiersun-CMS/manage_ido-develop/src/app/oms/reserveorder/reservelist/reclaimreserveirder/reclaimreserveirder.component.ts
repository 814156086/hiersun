import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-reclaimreserveirder',
  templateUrl: './reclaimreserveirder.component.html',
  styleUrls: ['./reclaimreserveirder.component.css']
})
export class ReclaimreserveirderComponent implements OnInit {
  reservelists: any;   //回收预约单列表
  status = 0;         //状态
  status2=2;
  kefulist: any; //客服集合
  activelist: any;//预约活动
  ordernos:any;    //选择的预约单集合
  kefulistonline:any;  //客服列表
  reservestatelist: any;
  pageSize = 10;
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
    if ($().select2) {
      $('#orderstates').select2({
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
    that.datalist()
    that.reservelist();
  }
  reservelist() {
    let that = this;
    let listurl = '/oms-admin/allotreserve/queryNoAllotReserveOrder';
    const params = new HttpParams()
      .set('currentPage', `${that.pageNo}`)
      .set('pageSize', `${that.pageSize}`)
      .set('allot', `${that.status}`)                 //此预约单是否已分配
      .set('autoAllot', `${that.status2}`)      ///* 表示系统自动分配：0－没有自动分配的（未处理的），1－系统自动分配的，2－回收的预约单，3－手动分配的。 */ 
      .set('storeCode', 'kefu')                          //需权限判断
      .set('origin', $(".origin").val())
      .set('orderno', $(".searchorderno").val())
      .set('telephone', $(".telephone").val())
      .set('reservedate', $(".reservedata").val())
      .set('orderstatesequence', $(".orderstates").select2('val'))
      .set('operatorid', $(".operatorid").select2('val'))
      .set('code', $('.shopcode').val())
      .set('orderType', $(".ordertype").val())
      .set('orderXu', $(".orderxu").val())
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
            //history.replaceState(null, null, '/oms/reservelist?page=' + that.pageNo)
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
  sitechoose(index,index2) {
    let that = this;
    that.status = index;
    that.status2=index2;
    that.reservelist()
  }
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }
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
    }
  }
  kefulists() {
    let that = this;
    let listurl = '/oms-admin/queryRecycle/queryKefuReserveOrder?storeCode=kefu';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.kefulistonline = data['data']

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
  allocation(){
    let that = this;
    var orderlistno='';
    $("input[name='orderids']:checked").each(function (i, item) {
      if(orderlistno==''){
        orderlistno += $(this).val();
      }else{
        orderlistno += "," + $(this).val();
      }
    })
    console.log(orderlistno)
    that.ordernos=orderlistno;
    if (orderlistno == "") {
      that.isHint = true;
      that.hintMsg = '请选择要分配的预约单！';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    $("#modal_order").modal('show');
    that.kefulists()
  }
  editreserve() {
    let that = this;
    var reserveIds = $("input[name=orderIds]:checked").val();
    if (reserveIds != undefined && that.ordernos != "") {
      var array = reserveIds.split(",");
      var logoTag = array[0];
      var shopcode = array[1] + "," + array[2];
      if (logoTag == "0") {
        alert("此人已挂起，不充许再分配预约单！");
      } else {
        var recycleReserveDto = {
          "orderno": that.ordernos,
          "shopCode": shopcode
        }
        console.log(recycleReserveDto)
        var editerurl = '/oms-admin/queryRecycle/saveAllotReserveOrder';
        this.http.post(editerurl, recycleReserveDto).subscribe(function (data) {
          console.log(data)
          if (data['code'] == 200) {
            that.isload = false;
            that.isHint = true;
            that.hintMsg = '保存成功';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $("#modal_order").modal('hide');
              that.reservelist();
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
    }else{
      that.isHint = true;
      that.hintMsg ='没有可分配的客服';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
    }
  }
}
