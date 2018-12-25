import { Component, OnInit,Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TmsprintService } from '../../../services/tmsprint.service';
declare var $: any;

@Component({
  selector: 'app-printwavalist',
  templateUrl: './printwavalist.component.html',
  styleUrls: ['./printwavalist.component.css']
})
export class PrintwavalistComponent implements OnInit {
  @Input() wavalist:any
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public printlist = [];  //打印
  deliverOrderItems: any;
  orderarry: any;
  pageNum=1;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router,private common:TmsprintService) { }


  ngOnInit() {
  }
  preview() {
    let that = this;
    this.common.publicprint()
    this.isload = false;
    var storeUrl = "/tms-admin/waveOrder/print-wave-order-modify?waveOrderNos=" + that.orderarry + "&operator=" + 'qqq';
    this.httpclient.post(storeUrl, null).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          //that.route.navigateByUrl('tms/shipsale');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  printorder(orderarry) {
    let that = this;
    $("#wavalist").modal('show');
    console.log(orderarry)
    this.isload = false;
    that.orderarry = orderarry;
    var expUrl = "/tms-admin/waveOrder/select-wave-order-item?waveOrderNo=" + orderarry
    this.httpclient.get(expUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          that.isload = true;
          that.deliverOrderItems = res['data'];   //pro
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  refelist(){
    $("#wavalist").modal('hide');
    this.wavalist()
  }
}
