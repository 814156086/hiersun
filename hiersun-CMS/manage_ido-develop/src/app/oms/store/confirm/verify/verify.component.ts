import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  isSub = false;//验证提交
  orderCode: any;//预约码
  orderCode2: any;//预约码
  password: string;//导购密码
  signinSex: string;//性别
  signinNum: number;//签到人数
  signinNum2: number;//签到人数其他
  reOrderMesg: reOrderDto;//签到人数
  reOrderSignMesg: reserveSigninDto;//
  reOrderActiveMesg: reserveActivityDto;//
  isSubSucc = false;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  nodata = false;
  isactive = false;//是否有活动
  issign = false;//是否已签到
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  formModel2: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      orderCode: ['', [Validators.required]]
    })
    this.formModel2 = fb.group({
      orderCode2: ['', [Validators.required]],
      password: ['', [Validators.required]],
      signinSex: ['', [Validators.required]],
      signinNum: ['', [Validators.required]],
      signinNum2: ['', [Validators.min(3)]],
    })
  }
  ngOnInit() {
    this.isload = false;
    this.reOrderMesg = new reOrderDto("", "", "", "", "", "", "", "", "");
    this.reOrderSignMesg = new reserveSigninDto("", "", "", "");
    this.reOrderActiveMesg = new reserveActivityDto("", "");
  }
  switchType(type) {
    // $(`.${type}`).addClass('active');
    // $(`.${type}`).siblings().removeClass('active');
    this.router.navigate([`/oms/${type}`])
  }
  // 提交预约码
  subOrderNo() {
    var that = this;
    var odnurl = `/oms-admin/reserveorder/store/validate?orderCode=${this.orderCode}`;
    this.http.get(odnurl).subscribe(
      data => {
        var res = data['response']
        if (res['code'] == 200) {
          that.isload = false;
          var orderstatesequence = res['data'] && res['data']['orderstatesequence'] ? res['data']['orderstatesequence'] : '';
          if (orderstatesequence == "2") {
            this.isSub = true;
            this.orderCode2 = that.orderCode;
            this.isSubSucc = false;
            this.reOrderMesg = res['data'] ? res['data'] : new reOrderDto("", "", "", "", "", "", "", "", "");
            this.formModel.reset();
          } else if (orderstatesequence == "4" || orderstatesequence == "5" || orderstatesequence == "7") {
            that.isHint = true;
            that.hintMsg = "该预约码已验证！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else if (orderstatesequence == "99") {
            that.isHint = true;
            that.hintMsg = "该预约码已取消无需验证！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else {
            that.isHint = true;
            that.hintMsg = "无此预约码，请重新输入！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }

        } else {
          that.isHint = true;
          that.hintMsg = res['desc'];
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
  // 验证后提交
  subOrderInfo() {
    var that = this;
    if (!$(".othsNum").val() && this.signinNum == 4) {
      that.isHint = true;
      that.hintMsg = '请输入人数';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return
    }
    var odnurl = '/oms-admin/reserveorder/store/sign';
    this.signinNum == 4 ? this.signinNum = $(".othsNum").val() : this.signinNum
    var odnparams = {
      "storeCode": "DjU4sKIf",
      "orderCode": this.orderCode2,
      "password": this.password,
      "signinSex": this.signinSex,
      "signinNum": this.signinNum
    }
    this.http.post(odnurl, odnparams).subscribe(
      data => {
        var respon = data['response'];
        var result = respon['data']['result'];
        console.log(result, 1221)
        if (respon['code'] == 200 && result!='0') {
          that.isSubSucc = true;
          that.isload = false;
          this.reOrderSignMesg = respon['data']['reserveSigninDto'];
          console.log(this.reOrderSignMesg,2)
          if (!respon['data']['reserveActivityDto']) {
            this.isactive = true;
          } else {
            this.isactive = false;
            this.reOrderActiveMesg = respon['data']['reserveActivityDto'];
            var signinCount = respon['data']['reserveActivityDto']['signinCount'];
            var setCount = respon['data']['reserveActivityDto']['setCount'];
            var enable = respon['data']['reserveActivityDto']['enable'];
            if ((signinCount > setCount) && enable == true) {//判断
              this.issign = true;
            } else {
              this.issign = false;
            }
          }
          this.formModel2.reset();//表单重置
        } else if (respon['code'] == 200 && result=='0') {
          that.isHint = true;
          that.hintMsg = "导购密码错误，请重新输入";
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        } else {
          that.isHint = true;
          that.hintMsg = respon['desc'];
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
export class reOrderDto {
  constructor(
    public origin: string,
    public orderno: string,
    public address: string,
    public reserveDate: string,
    public signinaddress: string,
    public signindate: string,
    public name: string,
    public telephone: string,
    public stateName: string
  ) {

  }
}
export class reserveSigninDto {
  constructor(
    public statename: string,
    public address: string,
    public registername: string,
    public shopcode: string
  ) {

  }
}

export class reserveActivityDto {
  constructor(
    public name: string,
    public signinCount: string
  ) {

  }
}