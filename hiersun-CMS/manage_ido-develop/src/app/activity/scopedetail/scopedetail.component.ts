import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-scopedetail',
  templateUrl: './scopedetail.component.html',
  styleUrls: ['./scopedetail.component.css']
})
export class ScopedetailComponent implements OnInit {

  sid:any;
  activitySid:any;
  type:any;
  scopeName:any;
  scopeCode:any;
  createTime:any;       //创建时间
  updateTime:any;      //更新时间
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nextpage:any;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data);
      that.nextpage=data.page;
      that.sid=data.sid;
    });

    let scopemsg='/api/v1/activity-mgr/activityScope/queryActivityScopeById/'+that.sid;
    this.http.get(scopemsg).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.sid=data['data'].sid;
          that.activitySid=data['data'].activitySid;
          if(data['data'].type==1){
            that.type="品牌"
          }else if(data['data'].type==2) {
            that.type = "渠道"
          }else if(data['data'].type==3) {
            that.type = '门店';
          }else if(data['data'].type==4){
            that.type = '商品';
          }else{
            that.type=""
          }
          that.scopeCode=data['data'].scopeCode;
          that.scopeName = data['data'].scopeName;
          that.createTime=data['data'].createTime;       //创建时间
          that.updateTime=data['data'].updateTime;      //更新时间
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  goback(){
    let that=this;
    that.router.navigateByUrl('activity/scope?page='+that.nextpage);
  }
}
