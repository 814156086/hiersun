import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-kefureservelist',
  templateUrl: './kefureservelist.component.html',
  styleUrls: ['./kefureservelist.component.css']
})
export class KefureservelistComponent implements OnInit {
  reserveIds: any;
  ordernos = "";
  kefulistonline: any;
  reservelist: any;
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
    that.reservelists();
  }
  reservelists() {
    let that = this;
    let listurl = '/oms-admin/queryRecycle/queryUntreatedROrder?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            that.nodata = true;
            this.reservelist = [];
          } else {
            that.reservelist = data['data'].list;
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.reservelists()
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
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='orderids']").attr("checked", "checked")
    } else {
      $("input[name='orderids']").removeAttr("checked")
    }
  }
  allotReserveOrder() {
    let that = this;
    var orderlistno='';
    $("input[name='orderids']:checked").each(function (i, item) {
      if(orderlistno==''){
        orderlistno += $(this).val();
      }else{
        orderlistno += "," + $(this).val();
      }
    })
    console.log(that.ordernos)
    that.ordernos=orderlistno;
    if (that.ordernos == "") {
      that.isHint = true;
      that.hintMsg = '请选择要分配的预约单！';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    $("#modal_order").modal('show');
    that.kefulist()
  }
  kefulist() {
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
  editreserve() {
    let that = this;
    var reserveIds = $("input[name=orderIds]:checked").val();
    console.log(reserveIds);
    console.log("aaa")
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
              that.reservelists();
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
