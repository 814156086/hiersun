import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-kefureservedetail',
  templateUrl: './kefureservedetail.component.html',
  styleUrls: ['./kefureservedetail.component.css']
})
export class KefureservedetailComponent implements OnInit {
  kefureservedetails: any;
  reservedetaillist: any;
  shopcode: any;
  code: any;
  kefustatus: any;
  detailstatus = 1;
  registerName: any;   //客服名称
  reserveOrderNum: any;   //接单量
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
      console.log(data)
      that.shopcode = data.shopcode;
      that.code = data.code;
      that.kefustatus = data.kefustatus;
    })
    that.kefureservedetail()

  }
  kefureservedetail() {
    let that = this;
    let listurl = '/oms-admin/queryRecycle/queryShopReserveOrders?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&shopCode=' + that.shopcode + '&code=' + that.code + '&kefuState=' + that.kefustatus + '&detailState=' + that.detailstatus;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            that.nodata = true;
            this.kefureservedetails = [];
          } else {
            //that.kefureservedetails = data['data'];
            that.registerName = data['data'].registerName;
            that.reserveOrderNum = data['data'].reserveOrderNum;
            that.reservedetaillist = data['data'].reserveOrdersDto;
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.kefureservedetail()
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
  detailstate(e, index) {
    let that = this;
    that.detailstatus = index;
    $(e).addClass("bg-primary").removeClass("bg-info");
    $(e).siblings().removeClass("bg-primary").addClass("bg-info");
    that.kefureservedetail();
    $("#parentcheckBox").removeAttr("checked")
  }
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }
  }
  goback() {
    let that = this;
    that.router.navigateByUrl('oms/kefureservemanage');
  }
  reserverecly(orderno) {
    $(".orderno").val(orderno)
  }
  surerecly() {
    let that = this;
    let listurl = '/oms-admin/queryRecycle/allotReserveOrder?orderno=' + $(".orderno").val() + '&shopCode=' + that.shopcode + '&code=' + that.code + '&kefuState=' + that.kefustatus + '&detailState=' + that.detailstatus + '&storeCode=kefu' + '&returnName=queryShopReserveOrders';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.kefureservedetail()

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
  //批量回收
  surereclyall() {
    var reserveIds = "";
    $("input[name='orderids']:checked").each(function (i, item) {
      reserveIds += "," + $(this).val();
    })
    console.log(reserveIds)
    if (reserveIds != "" || reserveIds != undefined) {
      let that = this;
      let listurl = '/oms-admin/queryRecycle/allotReserveOrder?orderno=' + reserveIds + '&shopCode=' + that.shopcode + '&code=' + that.code + '&kefuState=' + that.kefustatus + '&detailState=' + that.detailstatus + '&storeCode=kefu' + '&returnName=queryShopReserveOrders';
      this.http.get(listurl).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.kefureservedetail()

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
