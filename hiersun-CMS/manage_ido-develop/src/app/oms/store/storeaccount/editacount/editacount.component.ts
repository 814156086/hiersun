import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import { mobileValidator, equalValidator, mobileAsyncValidator } from '../../../../validator/validators';
declare var $: any;

@Component({
  selector: 'app-editacount',
  templateUrl: './editacount.component.html',
  styleUrls: ['./editacount.component.css']
})
export class EditacountComponent implements OnInit {
  accountype: any;//账号类型
  userNo: any;//用户编号
  userName: any;//用户名
  gender = 1;//性别,默认为=男
  mobile: any;//联系方式
  password: any;//密码
  conpassword: any;//确认密码
  isload = false;
  isHint = false;
  hintMsg: any;
  warning = false;
  id: any;
  type=1;
  newtype:any;
  show=1;   //默认密码显示
  public formData;
  passwordsGroup:FormGroup;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,private fb: FormBuilder) {
    this.formModel = fb.group({
      userNo: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      mobile: ['', mobileValidator, mobileAsyncValidator]
    })
  }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.id = data.id;
      that.type = data.type;
      console.log(that.type)
      if(that.type==2){ //编辑
        that.editguide();
        that.show=2;
      }
    })
  }
  //重置密码
  reserpwd(e){
    let that=this;
    $(e).hide()
    this.password='';
    this.show=1;
  }
  // 查询详情
  editguide(){
    let that = this;
    let listurl = '/oms-admin/reserveorder/store/updateManageRegister/'+that.id;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response']['code'] == 200) {
          that.newtype=data['response']['data'].type;
          that.userNo=data['response']['data'].shopcode;
          that.userName=data['response']['data'].registername;
         // that.gender=data['response']['data'].sex;
            if (data['response']['data'].sex=="男") {
              $("#regular").attr("checked","checked")
            } else {          
              $("#franchise").attr("checked","checked")
            }
            that.mobile=data['response']['data'].telephone;
            that.password=data['response']['data'].password;
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
  goback() {
    window.history.go(-1)
  }
  onSubmit() {
    let that = this;
     console.log(that.userNo)
    if($(".userNo").val()==""){
      that.isHint = true;
      that.hintMsg = '请填写用户编号';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false
    }
    if($(".userName").val()==""){
      that.isHint = true;
      that.hintMsg = '请填写用户名';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false
    }

    var myreg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if(!myreg.test($.trim($(".mobile").val()))){
      that.isHint = true;
      that.hintMsg = '请填写正确的联系方式';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false
    }
    
    if(that.show==1){
      if(that.password=="" || $(".pwd").val().length<6){
        that.isHint = true;
        that.hintMsg = '请填写至少6位的密码';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
        return false
      }
      if(that.password!=$(".conformopwd").val()){
        that.isHint = true;
        that.hintMsg = '密码不一致';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
        return false
      }
    }
   
    var manageRegisterDto={};
    if(that.id){
      manageRegisterDto = {
        "type": $(".accountype").val(),
        "shopcode": this.userNo,
        "registername": this.userName,
        "sex": $('input[name="opeType"]:checked').attr('title'),
        "telephone": this.mobile,
        "password": this.password,
        "id":that.id
      }
    }else{
      manageRegisterDto = {
        "type": $(".accountype").val(),
        "shopcode": this.userNo,
        "registername": this.userName,
        "sex": $('input[name="opeType"]:checked').attr('title'),
        "telephone": this.mobile,
        "password": this.password,
      }
    }
    console.log(manageRegisterDto)
    var editerurl = '/oms-admin/reserveorder/store/judgeManageRegisterPassword';
    this.http.post(editerurl, manageRegisterDto).subscribe(function (data) {
      console.log(data)
      if (data['response']['code'] == 200) {
        var saveurl = '/oms-admin/reserveorder/store/add';
        that.http.post(saveurl, manageRegisterDto).subscribe(function (data) {
          console.log(data)
          if (data['response']['code'] == 200) {
            that.isload = false;
            that.isHint = true;
            that.hintMsg = '保存成功';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.router.navigate(['oms/storeaccount']);
            }, 1500)
          } else {
            that.isHint = true;
            that.hintMsg = data['response']['desc'];
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
        that.isHint = true;
        that.hintMsg = data['response']['desc'];
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
