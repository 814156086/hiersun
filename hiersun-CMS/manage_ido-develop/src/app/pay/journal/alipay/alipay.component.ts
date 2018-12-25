import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-alipay',
  templateUrl: './alipay.component.html',
  styleUrls: ['./alipay.component.css']
})
export class AlipayComponent implements OnInit {
  buyerLogonId:any;           //买家支付宝账号
  buyerPayAmount:any;         //付款金额
  buyerUserId:any;            //买家支付宝用户号
  discountGoodsDetail:any;    //本次交易支付所使用的单品券优惠的商品优惠信息
  fundBillList:any;           //交易支付使用的资金单据列表
  cardBalance:any;            //支付宝卡余额
  gmtPayment:any;             //交易付款时间
  invoiceAmount:any;          //开票金额
  notifyType:any;             //通知类型
  orderTradeNo:any;           //订单号
  sid:any;                    //
  pointAmount:any;            //集分宝金额
  receiptAmount:any;          //实收金额
  totalAmount:any;            //订单金额，交易金额
  storeName:any;              //发生支付交易的商户门店名称
  tradeNo:any;                //支付宝交易号
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  jornallist=[];
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
    this.alipylist();
  }
  alipylist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/alipayNotifyLog/queryAlipayNotifyLog?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&orderTradeNo='+$(".orderno").val();
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.jornallist=[];
          }else{
            that.jornallist = data['data'].list;
            history.replaceState(null, null, '/pay/alipay?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.alipylist()
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
    this.alipylist()
  }
}
