import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-seconedpaymedium',
  templateUrl: './seconedpaymedium.component.html',
  styleUrls: ['./seconedpaymedium.component.css']
})
export class SeconedpaymediumComponent implements OnInit {
  paytype:any;
  pcode: any;
  qudaolist: any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public businessstaus = true;
  nextpage:any;
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.pcode = data.id;
      that.nextpage=data.page;
    })
    that.seconedpaymediumlist();
    that.paytypees();

  }
  seconedpaymediumlist() {
    let that = this;
    if (that.pcode) {//查看二级
      let businesdetail = '/api/v1/pay-mgr/payMedium/queryPayMedium?currentPage=' + that.pageNo + '&pageSize=' + that.pageSize+'&pCode='+ that.pcode+'&code='+$(".code").val();
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.isload = false;
            if (data['data'].list.length == 0) {
              that.nodata = true;
              this.qudaolist = [];
            } else {
              that.qudaolist = data['data'].list;
              that.nodata = false;
              that.pageNo = data['data'].currentPage; //当前页
              that.pageCount = data['data'].pages; //总页数
              $("#pagination1").pagination({
                currentPage: that.pageNo,
                totalPage: that.pageCount,
                callback: function (current) {
                  that.pageNo = current;
                  that.seconedpaymediumlist()
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
    } else {//新添加
      that.isload = false;
    }
  }
  //查找可用的支付类别
  paytypees(){
    let that=this;
    let businesurl = '/api/v1/pay-mgr/payDic/queryPayDicIds';
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.paytype = data['data'];
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
  add(){
    let that=this;
    that.router.navigateByUrl('pay/addpaymedium?id='+that.pcode+'&page=1');
  }
  reset(){
    $(".form-control").val("");
    this.seconedpaymediumlist()
  }
  goback(){
    let that=this;
    that.router.navigateByUrl('pay/paymedium?page='+that.nextpage);
  }
}
