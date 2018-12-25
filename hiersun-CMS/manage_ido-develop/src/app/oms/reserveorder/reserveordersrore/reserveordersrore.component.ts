import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-reserveordersrore',
  templateUrl: './reserveordersrore.component.html',
  styleUrls: ['./reserveordersrore.component.css']
})
export class ReserveordersroreComponent implements OnInit {
  scorelist: any;
  area: any;  //大区集合
  citys: any;//大区下的城市集合
  shops: any;//城市下的门店集合
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
      $(".shopcode").val($('#shops').select2('val'))
    })
    that.shopscore()
  }
  shopscore() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/visit/listscore';
    var reserveVisitStoreParam = {
      "currentPage": that.pageNo,
      "pageSize": that.pageSize,
      "mobile": $(".telephone").val(),
      "orderNo": $(".searchorderno").val(),
      "reserveTime": $("#reservedata").val(),
      "storeCode": $('#shops').select2('val'),
      "sort":$(".ordertype").val(),
      "order":$(".orderxu").val()
    }
    this.http.post(listurl,reserveVisitStoreParam).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          if (data['response']['data']['list'].length == 0) {
            that.nodata = true;
            this.scorelist = [];
          } else {
            that.scorelist = data['response']['data']['list'];
            that.nodata = false;
            that.pageNo = data['response']['data'].currentPage; //当前页
            that.pageCount = data['response']['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.shopscore()
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
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }
  }
  reset(){
      $(".form-control").val("");
      $(".select2me").select2("data", null);
      this.shopscore()
  }
  reservetimepx(index) {
    let that = this;
    if (index == 1) {  //评分
      if ($(".reservetimepx").hasClass("fa-sort-numeric-desc")) {
        $(".reservetimepx").removeClass("fa-sort-numeric-desc").addClass("fa-sort-numeric-asc")
        $(".orderxu").val("2") //升
      } else {
        $(".reservetimepx").removeClass("fa-sort-numeric-asc").addClass("fa-sort-numeric-desc")
        $(".orderxu").val("1")
      }
      $(".ordertype").val("2")
      that.shopscore()
    } else if (index == 2) {//接单人数
      $(".ordertype").val("3")
      if ($(".validetime").hasClass("fa-sort-numeric-desc")) {
        $(".validetime").removeClass("fa-sort-numeric-desc").addClass("fa-sort-numeric-asc")
        $(".orderxu").val("2")
      } else {
        $(".validetime").removeClass("fa-sort-numeric-asc").addClass("fa-sort-numeric-desc")
        $(".orderxu").val("1")
      }
      that.shopscore()
    } else {
      $(".orderxu").val("");
      $(".ordertype").val("1")
      that.shopscore()
    }
  }
}
