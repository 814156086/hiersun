import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-paymediumdetail',
  templateUrl: './paymediumdetail.component.html',
  styleUrls: ['./paymediumdetail.component.css']
})
export class PaymediumdetailComponent implements OnInit {
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
  paytype=[];                //支付类型编码列表
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
    this.route.queryParams.subscribe(function (data) {
      that.code = data.id;//介质code
      that.pCode=data.pid;
      that.btntype = data.type;
      if (that.btntype == 1) {//查看
        that.btnshowhide = false;
        that.timeshowhide = true;
        $(".form-control").attr("disabled","disabled")
      } else if (that.btntype == 2) {//编辑
        that.btnshowhide = true;
      } else {//添加的时候
        that.btnshowhide = true;
        that.timeshowhide = false;
      }
    })
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
    if (that.code) {//查看和编辑
      let businesdetail = '/api/v1/pay-mgr/payMedium/queryPayMediumByCode/'+that.code;
      this.http.get(businesdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.code=data['data'].code;                  //介质code    
            if(data['data'].clientType==0){               //限制客户端类型
              $(".clientType").val("0")
            }else if(data['data'].clientType==1){
              $(".clientType").val("1")
            }else if(data['data'].clientType==2){
              $(".clientType").val("2")
            }
            //that.comm=data['data'].comm;                  //备注
            if(data['data'].comm==""){
              that.comm="--"
            }else{
              that.comm=data['data'].comm;
            }
            that.createTime=data['data'].createTime;      //创建时间         
            if(data['data'].invoice=="true"){              //是否开发发票
              $(".invoice").val("0")
            }else{
              $(".invoice").val("1")
            }
            that.name=data['data'].name;                  //介质名称
            that.pCode=data['data'].pCode;                //父级编号
            that.typeCode=data['data'].typeCode;          //支付类型编号
            $(".typeCode").val(that.typeCode);
            console.log($(".typeCode").val())
            that.updateTime=data['data'].updateTime;      //更新时间
            that.version=data['data'].version;            //版本号
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
    window.history.go(-1)
  }
  onSubmit(){
    let that = this;
    if($(".invoice").val()==0){
      that.invoice=true;
    }else{
      that.invoice=false;
    }
    if($(".comm").val()=="--"){
      $(".comm").val("")
    }
    if (this.formModel.valid) {
      that.isload = true;
      let payMedium={};
      if(that.pCode){
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
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['pay/paymedium']);
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
