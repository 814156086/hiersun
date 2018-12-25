import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-totalscore',
  templateUrl: './totalscore.component.html',
  styleUrls: ['./totalscore.component.css']
})
export class TotalscoreComponent implements OnInit {
  opreation:any;
  totalscore:any;
  questionlist:any;
  jiluid:any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage:any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  nodata=true;
  shop
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      that.jiluid=data.id;
    })
    that.shopscore()
  }
  shopscore(){
    let that = this;
    let listurl = '/oms-admin/reserveorder/visit/getdetail?reserveVisitId='+that.jiluid;
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['response'].code== 200) {
          that.totalscore=data['response']['data']['reserveVisitDto'].appraisemark;
          that.questionlist=data['response']['data'].reserveVisitItems;
          that.opreation=data['response']['data'].reserveSignins;
          if(data['response']['data'].reserveSignins.length==0){
              that.nodata=false
          }
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
