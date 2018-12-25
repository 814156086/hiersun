import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-storagepro',
  templateUrl: './storagepro.component.html',
  styleUrls: ['./storagepro.component.css']
})
export class StorageproComponent implements OnInit {
  @Input() storename:string;
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = true;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = 1//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  storehouses=[];   //仓库信息
  storagelistes=[];   //库位列表
  choosestrorage='';  //默认库位
  choosestroragecode:any;   //选择的库位
  choosestroragetype:any;   //选择的库位类型
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if ($().select2) {
      $('#instoragestatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
      $('#storage').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
  }
  cancelstorage() {
    $("#productstorage").modal('hide');
  }

  //库位信息列表
  storagelist(){
    console.log(this.storename)
    let that=this;
    this.isload = false;
    var sourceUrl = "/tms-admin/local/tms-store-local?currentPage"+that.currentpage+'&pageSize=10'+'&unlimit=0'+'&localName='+$(".localName").val()+'&localNum='+$(".localNum").val()+'&storageNum='+this.storename;
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if(res['data'].content!=null){
          that.storagelistes=res['data'].content;
          that.recordTotal = 1;
          $('#paginationstorage').pagination({
            currentPage: res['data'].currentPage,
            totalPage: res['data'].pageTotal,
            callback: function (current) {
              that.pageNum = current;
              that.storagelist();
            }
          });
        }else{
          that.storagelistes=[];
          that.recordTotal = 0;
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //选中
  mystorage(key){
    this.choosestrorage=$(".datalist tr").eq(key).find(".storagenames").text();
    this.choosestroragecode=$(".datalist tr").eq(key).find(".storagenum").text();
    this.choosestroragetype=$(".datalist tr").eq(key).find(".localtype").text();
    $(".datalist tr").eq(key).find(".myradio").attr('checked', 'checked');
  }
  //搜索
  searchstorage() {
    let that=this;
    if(that.choosestrorage!=""){
        $(".storagemy").val(that.choosestrorage);
        $(".storagecode").val(that.choosestroragecode);
        $(".localtype").val(that.choosestroragetype);
        $("#productstorage").modal('hide');
    }else{
      this.showWarnWindow(true,'请选择库位',"warning")
    }
  }
  //重置
  resetstoragepro(){
    $(".stopro .form-control").val("")
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
