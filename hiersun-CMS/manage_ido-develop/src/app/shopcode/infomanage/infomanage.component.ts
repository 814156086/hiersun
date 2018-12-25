import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Router } from '@angular/router';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-infomanage',
  templateUrl: './infomanage.component.html',
  styleUrls: ['./infomanage.component.css']
})
export class InfomanageComponent implements OnInit {
  expandKeys = ['100', '1001'];
  value: string;
  public list = [];
  public Nodes = [];
  public brandlist = [];
  public totalPage = '';
  public currentPage = '';
  public pageNo = 1;
  public pageSize = 10;
  public id = '';
  public rootId = '';
  public new = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    var that = this;
    $('#beginDt').datetimepicker({
        format: "yyyy-MM-dd hh:ii:ss",
        showMeridian: false,
        autoclose: true,
        todayBtn: true,
    });
    $('#endDt').datetimepicker({
        format: "yyyy-MM-dd hh:ii:ss",
        showMeridian: false,
        autoclose: true,
        todayBtn: true,
    });
    this.createTree()
    setTimeout(() => {
      this.value = '1001';
    }, 1000);
    that.load()
  }
  //树值改变
  onChange($event: string): void {
    var that = this;
    that.rootId = ''
    if($event==null){
      that.id = ''
    }else{
      this.id = $event
    }
     var ditchUrl = `/api/v1/member-admin/manager/member/sources`;
    this.httpclient.get(ditchUrl, this.httpOptions).subscribe(
      res => {
        var a = res['data']
        for(var i=0;i<a.length;i++){
          // console.log(a[i].id)
          if(a[i].id == this.id){
            that.rootId = a[i].rootId
            // return false;
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试");
      }
    )

  }
  // 创建树
  createTree() {
    var zNodes = []
    var ditchUrl = `/api/v1/member-admin/manager/member/sources`;
    this.httpclient.get(ditchUrl, this.httpOptions).subscribe(
      res => {
        zNodes = res['data']
        this.new = res['data']
        zNodes.forEach((value, index) => {
          value['title'] = value.name;
          value['key'] = value.id;
        })
        let result = zNodes.reduce(function (prev, item) {
          prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
          return prev;
        }, {});
        for (let prop in result) {
          result[prop].forEach(function (item, i) {
            result[item.id] ? item.children = result[item.id] : ''
          });
          this.Nodes = result[prop]
        }
        result = result[0];
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试");
      }
    )
  }
  //查找
  load(){
    var that = this;
    var source = that.rootId;
    var subSource = that.id;
    var mobile = $('.mobile').val();
    var startTime = $('.start_time').val();
    var endTime = $('.end_time').val();
    var pageSize = that.pageSize;
    var start = that.pageNo;
    var loadUrl = `/api/v1/member-admin/admin/member-info?source=${source}&subSource=${subSource}&mobile=${mobile}&startTime=${startTime}&endTime=${endTime}&pageSize=${pageSize}&start=${start}`;
    this.httpclient.get(loadUrl, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          // this.clear()
          // console.log(res['data']['result'])
          that.brandlist = res['data']['result']
          that.totalPage = res['data']['pages']
          that.currentPage = res['data']['currentPage']
          $('#pagination1').pagination({
              currentPage: that.pageNo,
              totalPage: that.totalPage,
              callback: function (current) {
                  that.pageNo = current;
                  that.load();
              }
          });
          that.brandlist.forEach((value,index)=>{
            that.new.forEach((ele,inx)=>{
            if( value.source==ele.id){
               value['newName']=ele.name
            }
            })
          })
          that.brandlist.forEach((value,index)=>{
            that.new.forEach((ele,inx)=>{
            if( value.subSource==ele.id){
               value['channel']=ele.name
            }
            })
          })

        }else{
          console.log(res)
        }
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试")
      }
    )
  }
  //清空参数
  clear(){
    var that = this
    that.id = ''
    that.rootId = ''
    $('.mobile').val('')
    $('.start_time').val('')
    $('.end_time').val('')
    this.createTree()
    this.load()
  }
}
