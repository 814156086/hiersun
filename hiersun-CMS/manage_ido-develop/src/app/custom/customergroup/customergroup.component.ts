import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-customergroup',
  templateUrl: './customergroup.component.html',
  styleUrls: ['./customergroup.component.css']
})
export class CustomergroupComponent implements OnInit {
  // public customerList = [{"kefutype":1,"name":"我是假的客服","code":"098888"}];
  public customerList = [];
  public pageNo = 1;
  public pageSize = 10;
  public nodata = false;
  public isHint = false
  public warning = false
  public hintMsg = '';
  public pageCount = '';
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.customerLoad()
  }
  customerLoad() {
    const that = this;
    let url = '/customer/auth/keFuGroup/group-list?pageSize=' + that.pageSize + '&pageNo=' + that.pageNo;
    this.httpClient.get(url).subscribe({
      next: ignored =>{
        that.customerList = ignored['data']['list'];
        console.log(ignored)
        if(that.customerList){
          that.nodata = false;
        }else{
          that.nodata = true;
        }
        that.pageCount = ignored['data'].totalCount;
        that.pageNo = ignored['data'].pageNo;
        $('#pagination1').pagination({
          currentPage:that.pageNo,
          totalPage: that.pageCount,
          callback: function(current) {
            that.pageNo = current;
            that.customerLoad()
          }
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }

  state(item) {
    const that = this;
    console.log(item)
    let enabled;
    if(item.enabled == false){
      enabled = true
    }else if(item.enabled == true) {
      enabled = false;
    }
    let id = item.id;
    let url = '/customer/auth/keFuGroup/save-or-update'
    this.httpClient.post(url,{
      enabled: enabled,
      id: id
    }).subscribe({
      next: ignored =>{
        console.log(ignored)
        that.customerLoad()
      }
    })
  }

}
