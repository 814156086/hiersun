import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { OmsService } from '../../services/oms.service';
import { Router } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-activiti-editor',
  templateUrl: './activiti_editor.component.html',
  styleUrls: ['./activiti_editor.component.css']
})
export class ActivitiEditorComponent implements OnInit {
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = 1;//总页数
  public currentpage = 1;//当前页码
  public recordTotal = 0;//总记录数
  public isShowWarnWin = false;  //确认弹窗
  public isShowDelWin = false;  //删除弹窗
  public isShowDeployWin = false;  //部署弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = true;//是否加载
  public ifreamIsload = true;//是否加载
  public viewIfreamIsload = true;//预览窗口是否加载
  tempProcessId: number;//临时记录流程模板的id
  public tempModelId:string;//临时id
  public processorList:Array<ActivitiProcessItem> = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  private tempNoticeNo: String;

  constructor(private httpclient: HttpClient, private route: Router,private omsService:OmsService) { }

  ngOnInit() {
    //document.documentElement.style.overflowY = 'hidden';
    $('#createTime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
      minView: 2
    });
    this.initProcessorList();
  }

  editProcess(id: string) {
    this.route.navigate(['oms/activiti_editor/edit-model-info'], {
      queryParams: {
        id:id
      }
    });
  }

  addProcessModel(){
    this.route.navigate(['oms/add_model_info/add-model-info'], {
      queryParams: {

      }
    });
  }

  newProcess(){

  }


  editProcessModel(id: string) {
    $("#editProcessIframe").remove();
    let $ifream = $("<iframe id='editProcessIframe' style=\"\" width=\"100%\" height=\"720px\" frameborder=\"0\" scrolling=\"none\" align=\"center\"></iframe>")
    this.ifreamIsload = false;
    $("#editIfremContainer").append($ifream);
    let refThis = this;
    $("#modal_edit").modal("show");
    window.setTimeout(function(){
      window.frames["editProcessIframe"].src = refThis.omsService.getifreamUrl("editor")+id;
      setTimeout(function () {
        refThis.ifreamIsload = true;
      },500);
    },1000);
  }

  editProcessPoint(sid: Number) {
    this.route.navigate(['oms/add_model_info/edit-model-info'], {
      queryParams: {

      }
    });
  }

  showProcessInfo(sid: Number) {
    $("#viewProcessIframe").remove();
    let $ifream = $("<iframe id='viewProcessIframe' style=\"\" width=\"100%\" height=\"720px\" frameborder=\"0\" scrolling=\"none\" align=\"center\"></iframe>")
    this.viewIfreamIsload = false;
    $("#viewIfremContainer").append($ifream);
    let refThis = this;
    $("#modal_view").modal("show");
    window.setTimeout(function(){
      window.frames["viewProcessIframe"].src = refThis.omsService.getifreamUrl("view")+sid;
      setTimeout(function () {
        refThis.viewIfreamIsload = true;
      },500);
    },1000);
  }

  deployProcess(id: string) {
    this.showDeployWindow(true, "确认部署该流程模板?", "warning");
    this.tempModelId = id;
  }

  delProcess(id:string) {
    this.showDelWindow(true, "确认删除该流程模板?", "warning");
    this.tempModelId = id;
  }
  restProcessorList(){
    $("#modelName").val("");
    $("#bussName").val("");
    $("#deployStatus").val("");
    $("#createTime").val("");
    this.pageNum=1;
    this.initProcessorList();
  }
  closeWin(){
    this.showWarnWindow(false, "", "warning");
    this.showDelWindow(false, "", "warning");
    this.showDeployWindow(false,"","warning");
  }
  delOk(){
    this.isload = false;
    let params = {
      id:this.tempModelId
    };
    let subcurl = "/oms-workflow/bus-model/del";
    this.httpclient.post(subcurl, params, this.httpOptions).subscribe(
      res=>{
        this.isload = true;
        if (res['code'] == 200) {
          this.showDelWindow(false, "", "warning");
          this.initProcessorList();
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  deployOk(){
    this.isload = false;
    let params = {
      id:this.tempModelId
    };
    let subcurl = "/oms-workflow/bus-model/deploy";
    this.httpclient.post(subcurl, params, this.httpOptions).subscribe(
      res=>{
        this.isload = true;
        if (res['code'] == 200) {
          this.showDeployWindow(false,"","warning");
          this.initProcessorList();
        } else {
          this.showDeployWindow(false,"","warning");
          this.showWarnWindow(true, "错误:"+res['desc'], "danger");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  initProcessorList(){
    this.processorList = [];
    let that = this;
    let name = $("#modelName").val();
    let key = $("#bussName").val();
    let deployStatus = $("#deployStatus").val();
    let createTime = $("#createTime").val();
    let subcurl = "/oms-workflow/bus-model/list?name="+name+"&beginTime="+createTime+"&key="+key+"&deployStatus="+deployStatus+"&pageSize="+this.pageSize+"&currentPage="+this.pageNum;
    this.httpclient.get(subcurl, this.httpOptions).subscribe(
      res=>{
        this.isload = true;
        if (res['code'] == 200) {
          let resultList = res['data']['list'];
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pages'];
          this.recordTotal =  res['data']['count'];
          if(resultList.length>0){
              resultList.forEach(item=>{
                let listItem = new ActivitiProcessItem(item.id,item.name,item.key,item.deployStatus,item.created,"",item.version);
                this.processorList.push(listItem);
              });
          }
          $('#pagination1').pagination({
            currentPage: this.currentpage,
            totalPage: this.pagetotal,
            callback: function (current) {
              that.pageNum = current;
              that.initProcessorList();
            }
          });
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  /**
   * 全局弹窗
   */
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  public showDelWindow(status, warnMsg, btnType) {
    this.isShowDelWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  public showDeployWindow(status, warnMsg, btnType) {
    this.isShowDeployWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
}
function closeWin() {

}
window.addEventListener('message', function(event){
  if(event.data!=''){
    try {
      let reciveObj = JSON.parse(event.data);
      if(reciveObj.type=='closeEditor'){
       console.log('子页面成功关闭了父窗口');
        $("#modal_edit").modal("hide");
      }else if(reciveObj.type=='closeEditorView'){
        console.log('子页面成功关闭了父窗口');
        $("#modal_view").modal("hide");
      }
    }catch (e) {
      /*console.log("json转换时出现异常");*/
    }
  }
  /*console.log(event);*/
}, false);


var ACTIVITI = ACTIVITI || {};

ACTIVITI.CONFIG = {
  'onPremise' : true,
  'contextRoot' : '/activiti-app',
  'webContextRoot' : '/activiti-app'
};

export class ActivitiProcessItem {
  constructor(
    public id:string,
    public name:string,
    public businessKey:string,
    public deployStatus:number,
    public createTime:string,
    public desc:string,
    public version:string
  ){}
}
