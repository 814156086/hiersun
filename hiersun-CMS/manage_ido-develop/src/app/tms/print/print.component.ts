import { Component, OnInit,Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TmsprintService } from '../../services/tmsprint.service';
declare var $: any;

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  @Input() initShipInfo:any
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public printlist = [];  //打印
  printroderno: any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router,private common:TmsprintService) { }

  ngOnInit() {
  }
  preview() {
    let that = this;
    /* var newWin=window.open('about:blank', '', '');
    document.body.innerHTML=document.getElementById('print').innerHTML;
    newWin.document.write(document.body.innerHTML);
    window.print(); */
    //var oDiv2 = document.getElementById("print");
    this.common.publicprint()
    this.isload = false;
    var storeUrl = "/tms-admin/deliverOrder/print-deliver-order-modify?deliverNos=" + this.printroderno + "&operator=" + 'qqq';
    this.httpclient.post(storeUrl, null).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;

        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  refelist(){
    $("#modal_print").modal('hide');
    this.initShipInfo()
  }

  printorder(orderarry) {
    $("#modal_print").modal('show');
    this.isload = false;
    this.printroderno = orderarry;
    var orderstring=orderarry.join(',');
    var storeUrl = "/tms-admin/deliverOrder/print-deliver-order?delivetyNo=" + orderstring;
    this.httpclient.get(storeUrl,this.httpOptions).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.printlist = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

}
