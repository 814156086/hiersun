import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  scorelist:any;
  population:any;
  appraisemark:any;
  shoptype:any;
  address:any;
  code:any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  reservestatelist: any;//预约单状态
  reservelists: any;//预约单列表
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }
  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      that.nextpage=data.page;
      //that.code=data.code;
    })
    that.searchpf()
    that.searchlist()
  }
  switchType(type) {
    this.router.navigate([`/oms/${type}`])
  }
  searchpf(){
    let that = this;
    let listurl = '/oms-admin/reserveorder/visit/getscore?code=1020';  //此处权限判断
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response'].code== 200) {
          that.address=data['response']['data']['address']
          that.shoptype=data['response']['data']['shoptype']
          that.appraisemark=data['response']['data']['appraisemark']
          that.population=data['response']['data']['population']
        } else {
          that.isHint = true;
          that.hintMsg = data['response'].desc;
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
  searchlist(){
    let that = this;
    let listurl = '/oms-admin/reserveorder/visit/listvisit';
    var reserveVisitDto ={
      "code":that.code,
      "currentPage": that.pageNo,
      "pageSize": that.pageSize,
    }
    this.http.post(listurl,reserveVisitDto ).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response'].code== 200) {
          that.scorelist=data['response']['data']['list']
        } else {
          that.isHint = true;
          that.hintMsg = data['response'].desc;
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
  goback(){
    window.history.go(-1)
  }
}
