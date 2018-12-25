import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-storeaccount',
  templateUrl: './storeaccount.component.html',
  styleUrls: ['./storeaccount.component.css']
})
export class StoreaccountComponent implements OnInit {
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  //manageRegMesg: manageRegInfo;//公共管理员账户
  manageRegList: Array<any>;//导购人员账户列表
  nodata = true;
  storeCode: any;     //店铺编号
  address: any;       //店铺店址
  telephone: any;     //联系方式
  registername: any;  //店长
  manageRegisterId: any;   //当前选中的导购id
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.guidelist();
  }
  //导购列表
  guidelist() {
    let that = this;
    let listurl = '/oms-admin/reserveorder/store/list';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          that.storeCode = data['response']['data'].storeCode;     //店铺编号
          that.address = data['response']['data'].address;       //店铺店址
          that.telephone = data['response']['data'].telephone;     //联系方式
          that.registername = data['response']['data'].registername;  //店长
          that.manageRegList = data['response']['data'].manageRegisterList; //导购列表
          that.nodata = false;
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
  //全选
  parentcheckBox() {
    if ($("#parentcheckBox").attr("checked")) {
      $("input[name='nameid']").attr("checked", "checked")
    } else {
      $("input[name='nameid']").removeAttr("checked")
    }
  }
  // 删除联系人
  delContact() {
    let that = this;
    var deletesid = $('input:checkbox[name="nameid"]:checked');
    if (deletesid.length != 0) {
      var chk_value = [];
      $('input[name="nameid"]:checked').each(function () {
        chk_value.push($(this).val());
      });
      that.manageRegisterId = chk_value.join(",")
      $("#myModal").modal('show');

    } else {
      that.isHint = true;
      that.hintMsg = '请选择要删除的导购';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
    }
  }
  // 确认删除
  sure() {
    let that=this;
    let listurl = '/oms-admin/reserveorder/store/delete/' + that.manageRegisterId;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          that.guidelist();
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