import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
declare var $: any;

@Component({
  selector: 'app-fragmenttmp',
  templateUrl: './fragmenttmp.component.html',
  styleUrls: ['./fragmenttmp.component.css']
})
export class FragmenttmpComponent implements OnInit {
  isshow=false;
  setting: any;
  allList = [];//树的集合
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  pageNo = 1;
  tplList = [];
  delId: any;
  pageList = [1];
  siteType = 1;
  list: any;
  pageid: any;
  pageCount: any;
  nodata = false;
  siteId:any;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private common: CommonService, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    let sitelist = '/api/cms/segmentTmpl/site-list';
    this.http.get(sitelist).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['header'].code == 200) {
          that.allList = data['body'];
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
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
  fragmentdetail(siteId,id) {
    console.log(id)
    var that = this;
    that.siteId=siteId;
    that.pageid = id;
    that.pageNo=1;
    that.isshow=true;
    that.templist()
  }
  templist() {
    let that = this;
    var url = '/api/cms/segmentTmpl/page-list?pageNo=' + this.pageNo + '&pageSize=' + 10 + "&pageTmplId=" + that.pageid;
    this.http.get(url).subscribe(
      function (data) {
        console.log(data)
        that.isload = false;
        if (data['header'].code == 200) {
          if (data['body'].list.length == 0) {
            that.nodata = false;
            that.tplList=[];

          } else {
            that.nodata = true;
            that.tplList = data['body'].list;
            
          }
          that.pageNo = data['body'].pageNo;
            that.pageCount = data['body'].pageCount;
            $("#pagination1").pagination({
              currentPage: that.pageNo,
              totalPage: that.pageCount,
              callback: function (current) {
                that.pageNo = current;
                that.templist()
              }
            });
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      }
    )
  }
  newTpl(id){
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id':id,'siteType': this.siteType,'pageid': this.pageid,'siteId':this.siteId},
      fragment: 'anchor'
    };
    this.router.navigate(['/cms/addtemplate'],navigationExtras);
  }
}
