import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-kefureservemanage',
  templateUrl: './kefureservemanage.component.html',
  styleUrls: ['./kefureservemanage.component.css']
})
export class KefureservemanageComponent implements OnInit {
  status=1;
  kefulist:any;  //客服列表
  pageSize = 20;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  businesslist = [];
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    that.kefulists();
  }
  kefulists(){
    let that=this;
    let businesurl='/oms-admin/queryRecycle/queryRecycleReservation?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&kefuState='+that.status;
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.kefulist=[];
          }else{
            that.kefulist = data['data'].list;
            history.replaceState(null, null, '/oms/kefureservemanage?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.kefulists()
              }
            });
          }
          
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  choosethis(index){
    let that=this;
    that.status=index;
    console.log(that.status)
    that.kefulists();
  }
}
