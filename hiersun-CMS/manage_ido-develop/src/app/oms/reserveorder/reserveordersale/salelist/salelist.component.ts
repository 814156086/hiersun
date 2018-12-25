import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-salelist',
  templateUrl: './salelist.component.html',
  styleUrls: ['./salelist.component.css']
})
export class SalelistComponent implements OnInit {
  reserveIds:any;
  exportType:any;
  shoptypename: any;
  html = '';
  reserveorderlist: any;
  shops: any;
  citys: any;
  area: any;
  pageSize = 20;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
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
    that.reservesalelist()
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
    /* $("#shops").change(function () {
      $(".shopcode").val($('#shops').select2('val'))
    }) */
  }
  reservesalelist() {
    $(".linncla").hide()
    let that = this;
    let listurl = '/oms-admin/reserveorder/sale/list';
    var reserveOrderSaleDto = {}
    if (that.shoptypename == 0) { //预约门店
      reserveOrderSaleDto = {
        "currentPage": that.pageNo,
        "pageSize": that.pageSize,
        "orderno": $(".searchorderno").val(),
        "commodityname": $(".productname").val(),
        "commoditycode": $(".productcode").val(),
        "verifydate": $(".reservedata").val(),
        "posorderno": $(".salecode").val(),
        "reservecode": $(".reserveshopcode").val(),
        "code": $(".saleshopcode").val(),
        "paymenttime": $("#validatedata").val(),
        "registername": $(".daogou").val(),
        "origin": $(".origin").val(),
        "reserveAddress": $('#shops').select2('val')
      }
    } else if (that.shoptypename == 1) { //销售门店
      reserveOrderSaleDto = {
        "currentPage": that.pageNo,
        "pageSize": that.pageSize,
        "orderno": $(".searchorderno").val(),
        "commodityname": $(".productname").val(),
        "commoditycode": $(".productcode").val(),
        "verifydate": $(".reservedata").val(),
        "posorderno": $(".salecode").val(),
        "reservecode": $(".reserveshopcode").val(),
        "code": $(".saleshopcode").val(),
        "paymenttime": $("#validatedata").val(),
        "registername": $(".daogou").val(),
        "origin": $(".origin").val(),
        "address": $('#shops').select2('val')
      }
    } else {
      reserveOrderSaleDto = {
        "currentPage": that.pageNo,
        "pageSize": that.pageSize,
        "orderno": $(".searchorderno").val(),
        "commodityname": $(".productname").val(),
        "commoditycode": $(".productcode").val(),
        "verifydate": $(".reservedata").val(),
        "posorderno": $(".salecode").val(),
        "reservecode": $(".reserveshopcode").val(),
        "code": $(".saleshopcode").val(),
        "paymenttime": $("#validatedata").val(),
        "registername": $(".daogou").val(),
        "origin": $(".origin").val()
      }
    }
    console.log(reserveOrderSaleDto)
    this.http.post(listurl, reserveOrderSaleDto).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          if (data['response']['data'].list.length == 0) {
            that.nodata = true;
            this.reserveorderlist = [];
          } else {
            that.nodata = false;
            that.reserveorderlist = data['response']['data'].list;
            that.pageNo = data['response']['data'].currentPage; //当前页
            that.pageCount = data['response']['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.reservesalelist()
              }
            });
          }
        } else {
          that.isHint = true;
          that.hintMsg = data['response']['desc'];
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
  detailItem(e, index) {
    if (!$(e).hasClass("glyphicon-plus")) {
      $(e).addClass("glyphicon-plus");
      $(e).removeClass("glyphicon-minus");
      $(`.line${index}`).remove();
    } else {
      $(e).removeClass("glyphicon-plus");
      $(e).addClass("glyphicon-minus");
      this.queryorderdetail(e, index);
    }
  }
  queryorderdetail(e, index) {
    console.log(index);
    let that = this;
    let listurl = '/oms-admin/reserveorder/sale/getoredershare/' + index;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          if (data['response']['data'].length == 0) {
            that.nodata = true;
          } else {
            var opList;
            opList = data['response']['data'];
            console.log(opList)
            var opta = '';
            opList.map((opitem, opindex) => {
              if (opitem.verifydate == null) {
                var verifydate = "--"
              } else {
                var verifydate = that.formatDate(opitem.verifydate, '-')
              }
              if (opitem.paymenttime == null) {
                var paymenttime = "--"
              } else {
                var paymenttime = that.formatDate(opitem.paymenttime, '-')
              }
              return opta += `
            <tr>
              <td>${opitem.posorderno?opitem.posorderno:'--'}</td>
              <td>${opitem.region?opitem.region:'--'}</td>
              <td>${opitem.reservecode?opitem.reservecode:'--'}-${opitem.reserveaddress?opitem.reserveaddress:'--'}</td>
              <td>${opitem.code?opitem.code:'--'}-${opitem.address?opitem.address:'--'}</td>
              <td>${verifydate}</td>
              <td>${opitem.commodityname?opitem.commodityname:'--'}</td>
              <td>${opitem.reservename?opitem.reservename:'--'}</td>
              <td>${opitem.registername?opitem.registername:'--'}</td>
              <td>${paymenttime}</td>
              <td>${opitem.commoditycode?opitem.commoditycode:'--'}</td>
              <td>￥${opitem.money?opitem.money:'--'}</td>
            </tr>`
            })
            var opHtml = `
          <tr class="line${index} linncla">
            <td></td>
            <td colspan="11">
              <table class="table table-bordered">
                <thead>
                  <tr>
                  <th>销售单号</th>
                  <th>大区(销售)</th>
                  <th>预约门店</th>
                  <th>销售门店</th>
                  <th>预约验证时间</th>
                  <th>商品名称</th>
                  <th>预约导购</th>
                  <th>销售导购</th>
                  <th>成交时间</th>
                  <th>商品条码</th>
                  <th>成交金额</th>
                  </tr>
                </thead>
                <tbody>
                  ${opta}
                </tbody>
              </table>
            </td>
          </tr>`;
            $(e).parent().parent().after(opHtml);
            that.nodata = false;
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
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }

  }
  shoptype() {
    let that = this;
    that.shoptypename = $('input[name="opeType"]:checked').attr('title'); //0预约门店1销售门店
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
  //导出
  export(){
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
    that.reserveIds = reserveIds;
    that.exportType = 1;
    console.log(that.reserveIds)
    console.log(that.exportType)
    window.location.href = '/oms-admin/reserveorder/sale/doExport?id=' + that.reserveIds + '&exportType=' + that.exportType;
  }
  exportall(){
    let that = this;
    that.exportType = 2;
    if (that.shoptypename == 0) { //预约门店
      window.location.href = '/oms-admin/reserveorder/sale/doExport?&exportType=' + that.exportType+'&orderno='+$(".searchorderno").val()+'&commodityname='+$(".productname").val()+'&commoditycode='+$(".productcode").val()+'&verifydate='+$(".reservedata").val()+'&posorderno='+$(".salecode").val()+'&reservecode='+$(".reserveshopcode").val()+'&code='+$(".saleshopcode").val()+'&paymenttime='+$("#validatedata").val()+'&registername='+$(".daogou").val()+'&origin='+$(".origin").val()+'&reserveAddress='+$('#shops').select2('val')
    }else if(that.shoptypename == 1){
      window.location.href = '/oms-admin/reserveorder/sale/doExport?&exportType=' + that.exportType+'&orderno='+$(".searchorderno").val()+'&commodityname='+$(".productname").val()+'&commoditycode='+$(".productcode").val()+'&verifydate='+$(".reservedata").val()+'&posorderno='+$(".salecode").val()+'&reservecode='+$(".reserveshopcode").val()+'&code='+$(".saleshopcode").val()+'&paymenttime='+$("#validatedata").val()+'&registername='+$(".daogou").val()+'&origin='+$(".origin").val()+'&address='+$('#shops').select2('val')
    }else{
      window.location.href = '/oms-admin/reserveorder/sale/doExport?&exportType=' + that.exportType+'&orderno='+$(".searchorderno").val()+'&commodityname='+$(".productname").val()+'&commoditycode='+$(".productcode").val()+'&verifydate='+$(".reservedata").val()+'&posorderno='+$(".salecode").val()+'&reservecode='+$(".reserveshopcode").val()+'&code='+$(".saleshopcode").val()+'&paymenttime='+$("#validatedata").val()+'&registername='+$(".daogou").val()+'&origin='+$(".origin").val()
    }
    
    
  }
  reset() {
    $(".form-control").val("");
    $(".select2me").select2("data", null);
    this.reservesalelist()
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
}
