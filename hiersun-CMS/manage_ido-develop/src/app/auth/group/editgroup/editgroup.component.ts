import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CommonService} from '../../../services/common.service';
declare var $: any;
@Component({
  selector: 'app-editgroup',
  templateUrl: './editgroup.component.html',
  styleUrls: ['./editgroup.component.css']
})
export class EditgroupComponent implements OnInit {

  formModel: FormGroup;
  isHint = false;
  hintMsg: any;
  public id : any;
  public list=[];
  public key:any;
  name:any;
  names:any;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder,private router:Router) {
    this.formModel = fb.group({
      name: ['', [Validators.required]]
    })
    this.id = this.route.params['value']['id'];
  }
  ngOnInit() {
    let that = this;
    let url = '/api/v1/auth-manager/auth/group/desc/'+this.id
    this.http.get(url).subscribe(
      function(data){
        if(data['code']==200){
          that.list.push( data['data'])
          that.names=data['data'].name
        }else{
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }
    )

  }
  // 保存
  save(){
    let that = this;
    let url = `/api/v1/auth-manager/auth/group/save-or-update`;
    let obj = {
      "comm": $('#textarea').val(),
      "id": that.id,
      "key": $('#key').val(),
      "name": $('#name').val(),
      "enabled":$('input[name="eenabled"]:checked').val()
    }
    this.http.post(url,obj).subscribe(
      function(data){
        if(data['code'] == 200){
          that.isHint = true;
          that.hintMsg = "修改小组成功！";
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.goback();
          }, 1500)
          
        }else{
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },function(err){
        console.log(err)
      }
    )
  }
  // 返回上一级
  goback(){
    this.common.goback();
  }

}
