import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-deliverydetail',
  templateUrl: './deliverydetail.component.html',
  styleUrls: ['./deliverydetail.component.css']
})
export class DeliverydetailComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public flag = 1;//判断编辑、添加
  expComList: Array<any> = [];//快递公司
  expressList=[];    //运单详情
  expressLists=[];   //运单集合
  expressNo: any;
  deliveryname:any;   //交接单名称
  wuliucode:any;      //物流公司
  remark:any;         //备注
  wuliuorder:any;      //物流单号
  handoverNo:any;      //编辑的交接单号
  list=[];     //交接单下运单条数
  sid:any;    //编辑时获取当前的sid
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
     this.flag=queryParams.flag
     this.handoverNo=queryParams.handoverNo;
    });
  }
  ngOnInit() {
    this.loadExpCompanyList();
    var that=this;
    if(this.flag==1){//添加
      $(".orderdetail").on("click",".deleteorder",function(){
        var index=$(this).parents("tr").index();
        $(this).parents("tr").remove();
        that.expressLists.splice(index,1); 
     })
    }
    this.handerorderdetail()
  }
  //交接单详情
  handerorderdetail(){
    let that = this;
    this.isload = false;
    var storeUrl = "/tms-admin/handoverOrder/getHandoverOrderNo/"+this.handoverNo;
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['code'] == 200) {
            that.deliveryname=res['data'].name;   //交接单名称
            that.wuliucode=res['data'].logisticsNo;   //物流公司编码
            that.remark=res['data'].remark;   //备注
            $("#expCompany").val(that.wuliucode);
            that.list=res['data'].list;
            that.sid=res['data'].sid;
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //运单号
  onEnter(event) {
    var patternId = $.trim($(event.target).val());
    this.wuliuorder = patternId;
    patternId ? this.loadorder(patternId) : this.showWarnWindow(true, "请输入运单号", 'warning');
  }
  //运单详情
  loadorder(orderno) {
    let that = this;
    this.isload = false;
    this.expressNo = orderno;
    var storeUrl = "/tms-admin/deliverOrder/print-deliver-order?expressNo=" + this.expressNo;
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        var str='';
        if (res['code'] == 200) {
          for(var i=0;i<res['data'].length;i++){
            res['data'][i].sid='';
          }
          this.expressList = res['data'];
          if(res['data'].length>0){
            this.expressLists.push(res['data'][0]);
          }
          for(var i=0;i<this.expressList.length;i++){
            str+='<tr>'
            str+='<td>';
            str+=this.expressList[i].expressNo;
            str+='</td><td>';
            str+=this.expressList[i].orderNo;
            str+='</td><td>';
            str+='<a class="btn btn-xs btn-info deleteorder"><i class="fa fa-file-pdf-o"></i> 删除</a>';
            str+='</td></tr>';
          }
          $(".orderdetail").append(str);
          $(".wiliuorderno").val("");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  //编辑时删除运单号数据
  deletehanadorder(event,id){
    console.log(id);
    var storeUrl = "/tms-admin/handoverOrder/deleteHandoverOrderItem/"+id;
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res)
        this.isload = true;
        if (res['code'] == 200) {

          $(event.target).parents("tr").remove();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 加载快递公司
  loadExpCompanyList() {
    this.isload = false;
    var expUrl = "/tms-admin/tms/logisticsCompany/list";
    var exParams = {
      "unlimit": 1
    }
    this.httpclient.post(expUrl, exParams, this.httpOptions).subscribe(
      res => {
        console.log(res)
        if (res['code'] == 200) {
          this.isload = true;
          this.expComList = res['data']['content'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  //save
  save(){
    let that=this;
    var falgerror=0;
    if($(".deliveryname").val()==""){
      this.showWarnWindow(true, '交接单名称必填', "warning");
      $(".deliveryname").focus();
      falgerror=1;
    }
    if($("#expCompany").val()==""){
      this.showWarnWindow(true, '物流公司必选', "warning");
      falgerror=1;
    }
    if(that.expressLists.length==0){
      this.showWarnWindow(true, '请输入运单号', "warning");
      falgerror=1;
    }
    if(falgerror==0){  //验证完毕
      var handoverOrderVo={};
      if(this.flag==1){  //添加
        handoverOrderVo={
          "name":$(".deliveryname").val(),
          "logistics":$("#expCompany").find("option:selected").text(),
          "logisticsNo":$("#expCompany").val(),
          "remark":$(".remark").val(),
          "list":this.expressLists
        }
      }else{
        handoverOrderVo={
          "name":$(".deliveryname").val(),
          "logistics":$("#expCompany").find("option:selected").text(),
          "logisticsNo":$("#expCompany").val(),
          "remark":$(".remark").val(),
          "list":this.expressLists,
          "handoverNo":that.handoverNo,
          "sid":that.sid
        }
      }
      
      console.log(handoverOrderVo);
      var pgUrl='/tms-admin/handoverOrder/saveHandover';
      this.httpclient.post(pgUrl, handoverOrderVo, this.httpOptions).subscribe(
        res => {
          console.log(res)
          this.isload = true;
          if (res['code'] == 200) {
            this.showWarnWindow(true, "操作成功,返回列表页", "success");
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }
  goBack() {
    window.history.go(-1)
  }
  reset(){
    $(".form-control").val("");
    $("#expCompany").val("");
    $(".orderdetail").html("")
  }
  /**
  * 全局弹窗
  */
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  /**
   * 关闭窗口
   */
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/tms/deliveryreceitp'])
    }
  }
}
