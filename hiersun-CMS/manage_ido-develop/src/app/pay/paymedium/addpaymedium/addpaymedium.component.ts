import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addpaymedium',
  templateUrl: './addpaymedium.component.html',
  styleUrls: ['./addpaymedium.component.css']
})
export class AddpaymediumComponent implements OnInit {
  paytype=[];                //支付类型编码列表
  code:any;                  //介质code
  clientType:any;            //限制客户端类型
  comm:any;                  //备注
  createTime:any;            //创建时间
  invoice:any;               //是否开发发票
  name:any;                  //介质名称
  pCode:any;                 //父级编号
  typeCode:any;              //支付类型编号
  updateTime:any;            //更新时间
  version:any;               //版本号
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      name: ['', [Validators.required]],
      code:['', [Validators.required]]
    })
  }

  ngOnInit() {
    let that=this;
    that.isload=false;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.pCode=data.id;
    })
    that.paytypees();
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
  onSubmit(){
    let that = this;
    if($(".invoice").val()==0){
      that.invoice=true;
    }else{
      that.invoice=false;
    }
    if (this.formModel.valid) {
      that.isload = true;
      let payMedium={};
      if(that.pCode!=""){ //erji
        payMedium  = {
          "clientType": $(".clientType").val(),
          "code":that.code,
          "comm": $(".comm").val(),
          "invoice": that.invoice,
          "name": that.name,
          "pCode": that.pCode,
          "typeCode": $(".typeCode").val(),
          "version": $(".version").val()
          }
      }else{
        payMedium  = {
          "clientType": $(".clientType").val(),
          "code":that.code,
          "comm": $(".comm").val(),
          "invoice": that.invoice,
          "name": that.name,
          "typeCode": $(".typeCode").val(),
          "version": $(".version").val()
          }
      }
      console.log(payMedium)
      var editerurl = '/api/v1/pay-mgr/payMedium/saveOrUpdatePayMedium';
      this.http.post(editerurl, payMedium).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            if(that.pCode!=""){ //erji
              that.router.navigate(['pay/seconedpaymedium']);
            }else{
              that.router.navigate(['pay/paymedium']);
            }
            
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
  goback() {
    window.history.go(-1)
  }
}
