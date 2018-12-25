import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import { TryCatchStmt } from '@angular/compiler';
import {ActivitiProcessItem} from '../activiti_editor.component';
declare var $: any;
@Component({
  selector: 'app-editModelInfo',
  templateUrl: './edit-model-info.component.html',
  styleUrls: ['./edit-model-info.component.css']
})
export class EditModelInfoComponent implements OnInit {
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = true;//是否加载
  public editInfo:ActivitiProcessItem;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  public setting: any; //ztree
  private detailModelId: string;

  constructor(private httpclient: HttpClient, private route: Router,private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.detailModelId = queryParams.id;
    });
  }

  ngOnInit() {
    this.isload = false;
    let subcurl = "/oms-workflow/bus-model/list?id="+this.detailModelId;
    this.httpclient.get(subcurl, this.httpOptions).subscribe(
      res=>{
        this.isload = true;
        if (res['code'] == 200) {
          let resultList = res['data']['list'];
          if(resultList.length>0){
            resultList.forEach(item=>{
              this.editInfo = new ActivitiProcessItem(item.id, item.name, item.key, item.deployStatus, item.created, item.description,item.version);
            });
          }
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
        this.isload = true;
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  subUpdateModelInfo() {
    this.isload = false;
    let modelName = $("._modelName").val();
    let modelKey = $("._modelKey").val();
    let modelDesc = $("._modelDesc").val();
    let modelType = $("#_modelType").val();
    let id = this.detailModelId;
    if(modelName==""){
      this.showWarnWindow(true, "模板名称不能为空", "warning");
      return;
    }
    if(modelKey==""){
      this.showWarnWindow(true, "模板业务key不能为空", "warning");
      return;
    }
    if(modelDesc==""){
      this.showWarnWindow(true, "模板描述不能为空", "warning");
      return;
    }
    if(modelType==""){
      this.showWarnWindow(true, "模板类型不能为空", "warning");
      return;
    }

    let params = {
      name: modelName,
      key: modelKey,
      modelType: modelType,
      description: modelDesc,
      id:id
    };
    let subcurl = "/oms-workflow/bus-model/update";
    this.httpclient.post(subcurl, params, this.httpOptions).subscribe(
     res=>{
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "更新成功，返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }


  goBack() {
    this.route.navigate(['oms/activiti_editor'])
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
      that.route.navigate(['oms/activiti_editor'])
    }
  }
  initBizTreeModal(){
    let that = this;
    this.setting = {
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        beforeDrag: this.beforeDrag,
        beforeDrop: this.beforeDrop,
        onClick: this.onClick
      }
    };
    let nowPageurl = '/oms-workflow/biz/list';
    let myobj;
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        that.isload = true;
        if (res['code'] == 200) {
          myobj = res['data'];
          $.fn.zTree.init($('#bizTree'), this.setting, myobj);
          let zTree = $.fn.zTree.getZTreeObj('bizTree');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    $("#bizTreeModal").modal("show");
  }

  /**
   * 业务tree点击事件
   */
  selectedBizInfo(){
    var zTree = $.fn.zTree.getZTreeObj('bizTree'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];

    //如果没有选择节点,则返回信息
    if (treeNode["check_Child_State"] == 0) {
      this.showWarnWindow(true, "请选择子级节点", "warning");
      return;
    }
    $("._modelKey").val(treeNode["bizKey"]);
    $("#bizTreeModal").modal("hide");
  }

  beforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }

  beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }

  onClick(event, treeId, treeNode, clickFlag) {
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    // console.log(obj);
    $('.myclick').click();
  }
}
