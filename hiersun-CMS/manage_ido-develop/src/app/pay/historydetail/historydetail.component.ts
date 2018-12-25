import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-historydetail',
  templateUrl: './historydetail.component.html',
  styleUrls: ['./historydetail.component.css']
})
export class HistorydetailComponent implements OnInit {
  businessidlist:any;
  orderslist:any;
  mchOrderNo:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  nodata=false;
  nextpage:any;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.mchOrderNo=data.id;
      that.nextpage=data.page;
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    })
    if ($().select2) {
      $('#businessid').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    //可用的商户id
   let businesurl='/api/v1/pay-mgr/mchInfo/queryMchIds';
   this.http.get(businesurl).subscribe(
     data=>{
       console.log(data);
       that.isload = false;
       if(data['code'] == 200){
         that.businessidlist=data['data'];
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
       console.log(err)
     }
   )
    that.orderlist();
  }
  orderlist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/payOrderHistory/queryPayOrderHistory?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&mchOrderNo='+that.mchOrderNo+'&payOrderNo='+$(".orderno").val()+'&mchId='+$('#businessid').select2('val')+'&status='+$(".orderstatus").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              that.orderslist=[];
          }else{
            that.orderslist = data['data'].list;
            history.replaceState(null, null, '/pay/paymanage?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.orderlist()
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
    $("#businessid").select2("data", null); 
    this.orderlist()
  }
  goback() {
    let that=this;
    that.router.navigateByUrl('pay/paymanage?page='+that.nextpage);
  }
}
