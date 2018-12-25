import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addpaytype',
  templateUrl: './addpaytype.component.html',
  styleUrls: ['./addpaytype.component.css']
})
export class AddpaytypeComponent implements OnInit {
  paytypeid:any;
  payname:any;
  creattime:any;
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      paytypeid: ['', [Validators.required]],
      payname:['', [Validators.required]]
    })
  }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.paytypeid=data.id;
      that.nextpage=data.page;
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled","disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
        $(".paytypeid").attr("disabled","disabled")
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
    if (that.btntype) {//查看和编辑
      let paytypedetail = '/api/v1/pay-mgr/payType/queryPayTypeByCode/' + that.paytypeid;
      this.http.get(paytypedetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.paytypeid=data['data'].code;
            that.payname=data['data'].name;
            that.creattime=data['data'].createTime;
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
    }else{//新添加
      that.isload = false;
    }
    
  }
  goback() {
    let that=this;
    that.router.navigateByUrl('pay/paytype?page='+that.nextpage);
  }
  onSubmit(){
    let that = this;
    if(this.formModel.valid){
      that.isload = true;
      var payType = {
        "code": that.paytypeid,//商户名称
        "name":that.payname,//商户id
      }
      //console.log(payType)
      var editerurl = '/api/v1/pay-mgr/payType/saveOrUpdatePayType';
      this.http.post(editerurl, payType).subscribe(function (data) {
        //console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/paytype']);
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
    
  }
}
