import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-paymethod',
  templateUrl: './paymethod.component.html',
  styleUrls: ['./paymethod.component.css']
})
export class PaymethodComponent implements OnInit {
  mchId: any; //商户id
  businessidlist: any;
  qudaolist: any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public businessstaus = true;
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    that.route.queryParams.subscribe(function (data) {
      console.log("111")
      console.log(data)
      that.mchId = data.mchId;
      if (data.page) {
        that.pageNo = data.page;
      } else {
        that.pageNo = 1;
      }
    })
    if(that.mchId){
      if ($().select2) {
        $('#businessid').select2({
          placeholder: that.mchId,
          allowClear: true
        })
      }
    }else{
      if ($().select2) {
        $('#businessid').select2({
          placeholder: '请输入商家ID',
          allowClear: true
        })
      }
    }
    
    //可用的商户id
    let businesurl = '/api/v1/pay-mgr/mchInfo/queryMchIds';
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.businessidlist = data['data'];
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
    if (that.mchId) {
      let that = this;
      that.isload = true;
      let qudaourl = '/api/v1/pay-mgr/mchPayChannel/queryMchPayChannel?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&mchId=' + that.mchId;
      this.http.get(qudaourl).subscribe(
        data => {
          console.log(data);
          if (data['code'] == 200) {
            that.isload = false;
            if (data['data'].list.length == 0) {
              that.nodata = true;
              this.qudaolist = [];
            } else {
              that.qudaolist = data['data'].list;
              history.replaceState(null, null, '/pay/paymethod?page=' + that.pageNo)
              that.nodata = false;
              that.pageNo = data['data'].currentPage; //当前页
              that.pageCount = data['data'].pages; //总页数
              $("#pagination1").pagination({
                currentPage: that.pageNo,
                totalPage: that.pageCount,
                callback: function (current) {
                  that.pageNo = current;
                  that.payqudaolist()
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
    } else {
      that.payqudaolist()
    }

  }
  payqudaolist() {
    let that = this;
    that.isload = true;
    let qudaourl = '/api/v1/pay-mgr/mchPayChannel/queryMchPayChannel?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize + '&channelId=' + $(".pageeng").val() + '&mchId=' + $('#businessid').select2('val');
    this.http.get(qudaourl).subscribe(
      data => {
        console.log(data);
        if (data['code'] == 200) {
          that.isload = false;
          if (data['data'].list.length == 0) {
            that.nodata = true;
            this.qudaolist = [];
          } else {
            that.qudaolist = data['data'].list;
            history.replaceState(null, null, '/pay/paymethod?page=' + that.pageNo)
            that.nodata = false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.payqudaolist()
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
  reset() {
    $(".pageeng").val("");
    $("#businessid").select2("data", null);
    if ($().select2) {
      $('#businessid').select2({
        placeholder: '请输入商家ID',
        allowClear: true
      })
    }
    this.payqudaolist()
  }
}
