import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-labeldetail',
  templateUrl: './labeldetail.component.html',
  styleUrls: ['./labeldetail.component.css']
})
export class LabeldetailComponent implements OnInit {

  sid:any;
  name:any;
  priority:any;
  enabled:any;       //订单类型
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

    let labelsmsg='/api/v1/activity-mgr/activityLabel/queryActivityLabelById/'+that.sid;
    this.http.get(labelsmsg).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.sid=data['data'].sid;
          that.name=data['data'].name;
          that.priority=data['data'].priority;
          if(data['data'].enabled==1){
            that.enabled="可用"
          }else if(data['data'].enabled==0){
            that.enabled="禁用"
          }else{
            that.enabled=""
          }
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
    that.router.navigateByUrl('activity/label?page='+that.nextpage);
  }

}
