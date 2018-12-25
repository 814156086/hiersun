import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  nodata = false;
  reservestatelist: any;//预约单状态
  reservelists: any;//预约单列表
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }
  ngOnInit() {
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
    this.datalist();//获取预约单状态
    this.reservelist();//获取预约单列表
  }
  switchType(type) {
    this.router.navigate([`/oms/${type}`])
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
          // that.kefulist=data['data'].manageRegisters; //客服集合
          // that.activelist=data['data'].reserveActivitys;//预约活动
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
  // 查询
  reservelist() {
    this.isload = true
    let that = this;
    var origin = $(".origin").val() ? $('.origin').val() : "",
      orderno = $(".searchorderno").val() ? $('.searchorderno').val() : "",
      telephone = $(".telephone").val() ? $('.telephone').val() : "",
      reservedate = $(".reservedate").val() ? $('.reservedate').val() : "",
      orderstates = $("#orderstates").select2('val') ? $("#orderstates").select2('val') : "";
    let listurl = '/oms-admin/reserveorder/queryReserveOrderList';
    const params = new HttpParams()
      .set('currentPage', `${that.pageNo}`)
      .set('pageSize', `${that.pageSize}`)
      .set('origin', origin)
      .set('orderno', orderno)
      .set('telephone', telephone)
      .set('reservedate', reservedate)
      .set('orderstates', orderstates)
      .set('storeCode', '2082')//获取权限
    // .set('registerNum', "1050")
    this.http.get(listurl, { params }).subscribe(
      data => {
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].list.length == 0) {
            that.nodata = true;
            this.reservelists = [];
          } else {
            that.reservelists = data['data'].list;
            // history.replaceState(null, null, '/oms/reservelist?page=' + that.pageNo)
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
  // 全选
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }

  }
  //导出
  export() {
    let that = this;
    var reserveIds = "";
    if ($("input[name='orderids']:checked").length == 0) {
      that.isHint = true;
      that.hintMsg = '请至少选择一条数据';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    $("input[name='orderids']:checked").each(function (i, item) {
      if (reserveIds == "") {
        reserveIds += $(this).val();
      } else {
        reserveIds += "," + $(this).val();
      }
    })
    // that.reserveIds = reserveIds;
    // that.exportType = 1;
    window.location.href = `/oms-admin/reserveorder/doExport?reserveIds=${reserveIds}&exportType=1`;
  }
  // 重置
  reset() {
    $(".form-control").val("");
    // $(".select2me").select2("data", null);
    this.reservelist()
  }
}
