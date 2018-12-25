import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-paymedium',
  templateUrl: './paymedium.component.html',
  styleUrls: ['./paymedium.component.css']
})
export class PaymediumComponent implements OnInit {
  paytype:any;
  firstnode=[];
  qudaolist:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  public businessstaus=true;
  nodata=false;
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
    this.paymediumlist()
    this.paytypees()
  }
  paymediumlist(){
    let that=this;
    let qudaourl='/api/v1/pay-mgr/payMedium/queryPayMedium?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&code='+$(".code").val()+'&isUser=seconed';
    this.http.get(qudaourl).subscribe(
      data=>{
        console.log(data);
        if(data['code'] == 200){
          that.isload = false;
          that.pageNo=data['data'].currentPage;
          if(data['data'].list.length==0){
            that.nodata=true;
            this.qudaolist=[];
          }else{
            that.qudaolist = data['data'].list;
            history.replaceState(null, null, '/pay/paymedium?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.paymediumlist()
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
  //查找可用的支付类别
  paytypees(){
    let that=this;
    let businesurl = '/api/v1/pay-mgr/payDic/queryPayDicIds';
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.paytype = data['data'];
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
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
    this.paymediumlist()
  }
}
