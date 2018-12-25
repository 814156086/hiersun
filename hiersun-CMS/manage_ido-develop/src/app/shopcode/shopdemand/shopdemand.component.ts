import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-shopdemand',
  templateUrl: './shopdemand.component.html',
  styleUrls: ['./shopdemand.component.css']
})
export class ShopdemandComponent implements OnInit {

  public demandList = []

  public pageNo = 1;//页码
  public pageSize = 10;//每页显示数量
  public totalPage = '';//总页数
  public currentPage = '';//当前页码
  public shopcodeList = [];
  public brandlist = [];
  public proGroupCode = '';

  httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
       $('select.shopcode').select2({
            placeholder: 'Select',
            allowClear: true
        });
    this.chooseshopcode()        
    this.loadStoreList()
  }

    loadStoreList() {
        var that = this;
        var bind = $('#bind').val();
        var store_code = $('.shopcode').select2("val")
        var name = $('.shopname').val().trim();
        var pageNo = that.pageNo;
        var pageSize = that.pageSize;
        var proGroupCode = $('#brandname').val()
        // if($('.shopname').val().trim()||$('#bind').val()||$('.shopcode').select2("val")){
        //     that.pageNo = 1
        // }
        var storeUrl = `/pcm-inner/org/findstorelist_page?currentPage=${pageNo}&pageSize=${pageSize}&organizationCode=${store_code}&isBind=${bind}&organizationName=${name}&proGroupCode=${proGroupCode}`;
        this.httpclient.get(storeUrl, this.httpOptions).subscribe(
            res => {
                if(res['code']==200){
                    if(res['data']['currentPage']>res['data']['pageTotal']){
                        that.pageNo = 1
                    }
                    that.demandList = res['data']['content']
                    that.totalPage = res['data']['pageTotal']
                    that.currentPage = res['data']['currentPage']
                    $('#pagination1').pagination({
                        currentPage: that.pageNo,
                        totalPage: that.totalPage,
                        callback: function (current) {
                            that.pageNo = current;
                            that.loadStoreList();
                        }
                    });
                }else{
                    console.log(res)
                }
            },
            (err: HttpErrorResponse) => {
                console.log("系统操作异常,请重新再试");
            }
        )
    }
    chooseshopcode(){
        var that=this;
        that.proGroupCode = $('.brandname').val()
        var shopcodeurl = '/pcm-inner/org/findstorelist?proGroupCode='+that.proGroupCode+'&'+'organizationStatus'+'='+'1'
        console.log(shopcodeurl)
        this.httpclient.get(shopcodeurl, this.httpOptions).subscribe(
        res => {
            $('select.shopcode').select2({
                placeholder: 'Select',
                allowClear: true
            });
            that.shopcodeList=res['data'];
        },
        (err: HttpErrorResponse) => {
        }
        )
    }
    //选择品牌
     choosebranch() {
        let that = this;
        
        var brandurl = '/pcm-inner/brands'
        this.httpclient.get(brandurl, this.httpOptions).subscribe(
            res => {
                if (res['code'] == 200) {
                    that.brandlist = res['data'];
                }else{
                    // that.warning = true;
                    // that.isHint = true;
                    // that.hintMsg = res['desc'];;
                    // setTimeout(function () {
                    //     that.isHint = false;
                    //     that.hintMsg = '';
                    //     that.warning = false;
                    // }, 1500)
                }
               
            },
            (err: HttpErrorResponse) => {
                // that.warning = true;
                // that.isHint = true;
                // that.hintMsg = '系统异常，请稍后再试';
                // setTimeout(function () {
                //     that.isHint = false;
                //     that.hintMsg = '';
                //     that.warning = false;
                // }, 1500)
            }
        )
    }
    clear(){
        this.pageNo = 1
        var bind = $('#bind').val("")
        $('.shopcode').val("")
        $('.shopname').val("")
        $('.shopcode').select2('val','')
        this.loadStoreList();
    }
}
