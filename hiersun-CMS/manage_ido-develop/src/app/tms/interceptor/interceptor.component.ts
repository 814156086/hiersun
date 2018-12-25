import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-interceptor',
  templateUrl: './interceptor.component.html',
  styleUrls: ['./interceptor.component.css']
})
export class InterceptorComponent implements OnInit {

  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  interceptorlists:any;   //拦截单列表
  interceptorstate:any;   //拦截状态表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if ($().select2) {
      $('#interceptorstatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.interceptorstatus()
    this.interceptorlist()
  }
  interceptorlist() {
    let that=this;
    that.isload = false;
    var sourceUrl = "/tms-admin/deliverIntercept/list?currentPage=" + that.pageNum + '&pageSize=10'+'&interceptStatus='+$("#interceptorstatus").select2('val');
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        that.isload = true;
        if(res['data'].content!=null){
          this.interceptorlists = res['data'].content;
          this.recordTotal=1;
        }else{
          this.interceptorlists=[];
          this.recordTotal=0;
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //查询拦截单状态
  interceptorstatus(){
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=deliver_intercept';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.interceptorstate=res['data'].deliver_intercept
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //确认拦截
  sureinterceptor(interceptNo){
    let that=this;
    that.isload = false;
    var sourceUrl = "/tms-admin/deliverIntercept/confirmIntercept/"+interceptNo;
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        that.isload = true;
        that.interceptorlist();
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //拦截失败
  failinterceptor(interceptNo){
    let that=this;
    that.isload = false;
    var sourceUrl = "/tms-admin/deliverIntercept/interceptFailure/"+interceptNo;
    this.httpclient.get(sourceUrl).subscribe(
      res => {
        console.log(res)
        that.isload = true;
        that.interceptorlist();
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //重置
  reset(){
    $("#interceptorstatus").select2("val",null);
    this.interceptorlist()
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
