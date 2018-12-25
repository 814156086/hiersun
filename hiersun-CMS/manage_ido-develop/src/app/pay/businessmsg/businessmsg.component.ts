import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-businessmsg',
  templateUrl: './businessmsg.component.html',
  styleUrls: ['./businessmsg.component.css']
})
export class BusinessmsgComponent implements OnInit {
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nodata=false;
  msglist=[];
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }
  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    })
    this.mesglist()
  }
  mesglist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/mchNotify/queryMchNotify?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&orderId='+$(".pageeng").val()+'&mchOrderNo='+$(".businessnum").val()+'&status='+$(".businesslx").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.msglist=[];
          }else{
            that.msglist = data['data'].list;
            history.replaceState(null, null, '/pay/businessmsg?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.mesglist()
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
  reset(){
    $(".form-control").val("");
    this.mesglist()
  }
}
