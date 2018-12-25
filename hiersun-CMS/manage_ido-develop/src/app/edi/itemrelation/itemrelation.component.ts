import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-itemrelation',
  templateUrl: './itemrelation.component.html',
  styleUrls: ['./itemrelation.component.css']
})
export class ItemrelationComponent implements OnInit {

  public topItemRelationList: any;

  public isHint = false;
  public hintMsg: any;
  public warning = false;
  public isShow = false;
  public isload = false; // 是否加载
  public nodata = false;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.listTopItemRelation();
  }

  listTopItemRelation() {
    const that = this;
    that.isload = true;
    const param = {
      // 'tmsCompanyCode': this.tmsCompanyCode,
      // 'tmsCompanyName': this.tmsCompanyName,
      // 'topCompanyCode': code,
      // 'topCompanyName': name,
    };

    const url = '/edi-admin/edi-top-server/edi/top/item-relation/list';
    this.httpclient.post(url, param, this.httpOptions).subscribe(
      res => {
        that.isload = false;
        that.topItemRelationList = res;
      },
      (err: HttpErrorResponse) => {
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统错误，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.warning = false;
        }, 1500);
      });
  }

  search() {

  }


  removeRelation(topItemId) {

}

}
