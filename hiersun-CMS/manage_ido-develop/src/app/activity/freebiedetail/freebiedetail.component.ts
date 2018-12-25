import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-freebiedetail',
  templateUrl: './freebiedetail.component.html',
  styleUrls: ['./freebiedetail.component.css']
})
export class FreebiedetailComponent implements OnInit {

  sid:any;
  activityRuleSid:any;
  skuCode:any;
  skuName:any;
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

    let freebiemsg='/api/v1/activity-mgr/activityFreebie/queryActivityFreebieById/'+that.sid;
    this.http.get(freebiemsg).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.sid=data['data'].sid;
          that.activityRuleSid=data['data'].activityRuleSid;
          that.skuCode=data['data'].skuCode;
          that.skuName = data['data'].skuName;
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
    that.router.navigateByUrl('activity/freebie?page='+that.nextpage);
  }
}
