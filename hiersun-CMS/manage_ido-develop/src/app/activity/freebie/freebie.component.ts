import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-freebie',
  templateUrl: './freebie.component.html',
  styleUrls: ['./freebie.component.css']
})
export class FreebieComponent implements OnInit {

  public loading: boolean;
  private page = 1;
  public noData = true;

  pageSize=10;
  pageCount:any;   //总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nodata=false;
  freebieList=[];
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
    this.getFreebieList();
  }
  getFreebieList(){
    let that=this;
    let freebieurl='/api/v1/activity-mgr/activityFreebie/selectActivityFreebie?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&activityRuleSid='+$(".activityRuleSid").val()+'&skuCode='+$(".skuCode").val()+'&skuName='+$(".skuName").val();
    console.log(freebieurl);
    this.http.get(freebieurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
            that.nodata=true;
            this.freebieList=[];
          }else{
            that.freebieList = data['data'].list;
            history.replaceState(null, null, '/activity/freebie?page='+that.pageNo);
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.getFreebieList()
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
    this.getFreebieList()
  }

}
