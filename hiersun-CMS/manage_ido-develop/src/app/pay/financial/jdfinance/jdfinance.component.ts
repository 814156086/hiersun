import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-jdfinance',
  templateUrl: './jdfinance.component.html',
  styleUrls: ['./jdfinance.component.css']
})
export class JdfinanceComponent implements OnInit {
  public jdfinanceList = [];
  public pageSize = 10;
  public pageNo = 1;
  public nodata = true;

constructor(private httpClient: HttpClient) {
}

  ngOnInit() {
    $('#startPayTime').daterangepicker({
      timePicker: false,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
  }

  search() {
    const that = this;
    let url = ''
    const aaa = $("#aaa").val();
    if(aaa){
      url += '&aaa=' + aaa;
    }
    const starttime = $("#startPayTime").val().split('--')[0];
    if(starttime){
      url += '&startPayTime=' + starttime;
    }
    const endtime =  $("#startPayTime").val().split('--')[1];
    if(endtime){
      url += '&startPayTime=' + endtime;
    }
    console.log(starttime)
    console.log(endtime)
    // this.httpClient.get(url).subscribe({
    //   next: ignored => {
    //     console.log(ignored)
    //     that.jdfinanceList = ignored['data']
    //     if(that.jdfinanceList.length != 0){
    //       that.nodata = false;
    //     }
    //   }
    // })
  }

  loadAgain() {
    $('#startPayTime').val('');
    this.search()
  }

}
