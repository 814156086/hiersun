import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css']
})
export class ScopeComponent implements OnInit {

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
  scopeList=[];
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
    this.getScopeList();
    this.loadActivity();
  }
  getScopeList(){
    let that=this;
    let scopeurl='/api/v1/activity-mgr/activityScope/queryActivityScope?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&activitySid='+$(".activitySid").val()+'&type='+$(".type").val();
    console.log(scopeurl);
    this.http.get(scopeurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
            that.nodata=true;
            this.scopeList=[];
          }else{
            that.scopeList = data['data'].list;
            history.replaceState(null, null, '/activity/scope?page='+that.pageNo);
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.getScopeList()
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
    this.getScopeList()
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
