import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})

export class RuleComponent implements OnInit {

  public loading: boolean;
  private page = 1;
  public noData = true;
  private loadingActivity: boolean;
  pageSize=10;
  pageCount:any;   //总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nodata=false;
  ruleList=[];
  activityList=[];
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }
  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    });
    this.getRuleList();
    this.loadActivity();
  }
  getRuleList(){
    let that=this;
    let ruleurl='/api/v1/activity-mgr/activityRule/queryActivityRule?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&activitySid='+$(".activitySid").val()+'&type='+$(".type").val()+'&discountType='+$(".discountType").val();
    console.log(ruleurl);
    this.http.get(ruleurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
            that.nodata=true;
            this.ruleList=[];
          }else{
            that.ruleList = data['data'].list;
            history.replaceState(null, null, '/activity/freebie?page='+that.pageNo);
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.getRuleList()
              }
            });
          }

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
  reset(){
    $(".form-control").val("");
    this.getRuleList()
  }

  private loadActivity() {
    this.loadingActivity = true;
    let that=this;
    const url ='/api/v1/activity-mgr/activityRule/queryActivityIdAndName';
    console.log(url);
    this.http.get(url).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.activityList = data['data'];
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
