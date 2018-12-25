import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-wavalist',
  templateUrl: './wavalist.component.html',
  styleUrls: ['./wavalist.component.css']
})
export class WavalistComponent implements OnInit {
  @ViewChild('printshiporder') printshiporder
  @ViewChild('printwavalist') printwavalist
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public pageNum = 1;//页码
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  wavalists:any; //波次单列表
  waveOrderNo='';//波次单号
  waveOrderStatus=''; //波次状态
  createTime=''; //创建时间
  createUser=''; //创建人
  orderNum='';   //订单数
  skuNum='';     //sku数
  proNum='';
  sortingTime='';   //拣货时间
  sortingUserName=''; //拣货人
  storeName='';       //门店名称
  storeCode='';       //门店编码
  deliverOrderItems:any;  //波次单商品
  deliverOrders:any;      //拣货单
  sourceList:any;     //订单来源
  wavadetails:any;   //波次单详情
  orderstatus:any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    $('#pickTime').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    if ($().select2) {
      $('#delivetyStatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.loadorderstatus()
    this.loadSourceList()
    this.wavalist()
  }
   // 加载订单来源
   loadSourceList() {
    this.isload = false;
    var sourceUrl = "/pcm-inner/channels";
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        this.sourceList = res['data'];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //列表
  wavalist(){
    let that=this;
    this.isload = false;
    var saleTimeStart = '';
    var saleTimeEnd = '';
    if($("#pickTime").val()==""){
      saleTimeStart = '';
      saleTimeEnd = '';
    }else{
      saleTimeStart = $('#pickTime').val().split('--')[0];
      saleTimeEnd = $('#pickTime').val().split('--')[1];
    }
    var expUrl = "/tms-admin/waveOrder/selectByPage?currentPage="+that.pageNum+'&pageSize=10'+'&waveOrderNo='+$("#orderNo").val()+'&startTime='+saleTimeStart+'&endTime='+saleTimeEnd+'&waveOrderStatus='+$("#delivetyStatus").select2('val');
    this.httpclient.get(expUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          that.isload=true;
          if(res['data'].content.length>0){
            that.recordTotal=1;
            that.wavalists=res['data'].content;
            $('#pagination1').pagination({
              currentPage: this.currentpage,
              totalPage: this.pagetotal,
              callback: function (current) {
                that.pageNum = current;
                that.wavalist();
              }
            });
          }else{
            that.recordTotal=0;
            that.wavalists=[];
          }
        }else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 发货单状态
  loadorderstatus(){
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=wave_status';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.orderstatus=res['data'].wave_status
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 详情
  wavadetail(waveorderno){
    let that=this;
    $("#myModal").modal('show');
    var expUrl = '/tms-admin/waveOrder/select-wave-order-item?waveOrderNo='+waveorderno
    this.httpclient.get(expUrl).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          that.isload=true;
          that.wavadetails=res['data'];
          /* that.waveOrderNo=res['data'].waveOrderNo;      //波次单号
          that.waveOrderStatus=res['data'].waveOrderStatus; //波次状态
          that.createTime=res['data'].createTime;//创建时间
          that.createUser=res['data'].createUser; //创建人
          that.orderNum=res['data'].orderNum;   //订单数
          that.skuNum=res['data'].skuNum;     //sku数
          that.proNum=res['data'].proNum;
          that.sortingTime=res['data'].sortingTime;   //拣货时间
          that.sortingUserName=res['data'].sortingUserName; //拣货人
          that.storeName=res['data'].storeName;      //门店名称
          that.storeCode=res['data'].storeCode;       //门店编码
          that.deliverOrderItems=res['data'].deliverOrderItems;   //pro
          that.deliverOrders=res['data'].deliverOrders    //order*/
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //全选
  allchoose(){
    let that=this;
    if($("#parentcheckBox").attr("checked")){
      $("input[name='orderIds']").attr("checked","checked");
    }else{
      $("input[name='orderIds']").attr("checked",false)
    }

  }
  //打印
  printwava(){
    var checkoutlength=$("input[name='orderIds']:checked").length;
    if(checkoutlength<1){
      this.showWarnWindow(true,'请至少选择一个订单哦!',"warning")
    }else{
      var orderarry=[];
      $("input[name='orderIds']:checked").each(function(i){
        orderarry[i] = $(this).val();
      });
      this.printwavalist.printorder(orderarry);
    }
  }
  //打印拣货单
  printshiporders(){
    var checkoutlength=$("input[name='orderIds']:checked").length;
    if(checkoutlength<1){
      this.showWarnWindow(true,'请至少选择一个订单哦!',"warning")
    }else{
      var orderarry=[];
      $("input[name='orderIds']:checked").each(function(i){
        orderarry[i] = $(this).val();
      });
      this.printshiporder.printorder(orderarry);
    }
  }
  //重置
  reset(){
    $(".form-control").val("");
    this.wavalist()
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
