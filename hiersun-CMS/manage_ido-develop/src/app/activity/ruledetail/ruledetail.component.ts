import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-ruledetail',
  templateUrl: './ruledetail.component.html',
  styleUrls: ['./ruledetail.component.css']
})
export class RuledetailComponent implements OnInit {

  sid:any;
  activitySid:any;
  type:any;
  step:any;
  threshold:any;
  discountType:any;
  discountNum:any;
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

    let freebiemsg='/api/v1/activity-mgr/activityRule/queryActivityRuleById/'+that.sid;
    this.http.get(freebiemsg).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.sid=data['data'].sid;
          that.activitySid=data['data'].activitySid;
          if(data['data'].type==1){
            that.type="买赠"
          }else if(data['data'].type==0){
            that.type="满减"
          }else{
            that.type=""
          }
          that.step=data['data'].step;
          that.threshold = data['data'].threshold;
          if(data['data'].discountType==1){
            that.discountType="固定折扣"
          }else if(data['data'].discountType==2){
            that.discountType="固定金额"
          }else{
            that.discountType=""
          }
          that.discountNum = data['data'].discountNum;
          that.createTime=data['data'].createTime;
          that.updateTime=data['data'].updateTime;
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
    that.router.navigateByUrl('activity/rule?page='+that.nextpage);
  }
}
