import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import 'rxjs/Rx';

declare var $: any;

@Component({
  selector: 'app-actBizModelComponent',
  templateUrl: './act-biz-model.component.html',
  styleUrls: ['./act-biz-model.component.css']
})
export class ActBizModelComponent implements OnInit {
  public setting: any; //ztree
  public allList = [];//所有的集合
  public tabId = 0; //选中tab页id
  public itemId: any; //选中的元素id
  public itemName: any; //选中的元素名称
  public itemStatus: any; //选中的元素状态
  public attrList = [];//添加编辑 关联分类的 下拉列表
  public esaList = [];//编辑 关联分类 回显下拉列表
  public itemObj: any;//右侧的列表 测试 删除
  public generalList = [];//右侧的列表 一般属性
  public gendetList = [];//右侧的列表 一般属性
  public priceList = [];//右侧的列表 价格控制
  public priceInit = [];//价格控制项初始化数据
  public isHint = true;//提示弹窗
  public hintMsg = '';//提示内容
  public mtcateName: any;//分类名称（维护）
  public mtcateCode: any;//分类编码（维护）
  public mtlevel: any;//编辑提交的level
  public mtsid: any;//编辑提交的sid
  public leftList = [];//维护左侧列表
  public leftListSearchBak = [];//维护左侧搜索框备份列表
  // public newList = [];//维护列表(添加过渡)
  public rightList = [];//维护右侧列表
  public rgList = [];//右侧列表初始
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
  //全局类目操作类型,1
  public globalCategoryType = 0;
  // 价格控制项动态列表
  public pconList = [];
  public conid: any;
  //字典表
  public codeList = [];
  public isload = false;//是否加载
  //显示删除弹窗
  public isShowDelWin = false;
  constructor(private httpclient: HttpClient, private router: Router) {
  }

  /**
   * 初始化加载tree
   */
  ngOnInit() {
    // console.log("tab:" + $(".active a").attr("title"));
    var that = this;
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
          // console.table(myobj);
          $.fn.zTree.init($('#treeDemo'), this.setting, myobj);
          let zTree = $.fn.zTree.getZTreeObj('treeDemo');
          /*this.itemId = "";
          $("#bizName").val("");
          $("#bizProcessKey").val("");
          $("#bizDesc").val("");*/
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
   /* //初始化工单类型列表
    this.initCodeList();
*/
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


  // 树的点击事件
  myclick() {
    let obj = JSON.parse($('input[name="mymsg"]').val());
    let that = this;
    this.itemId = obj.id;
    //加载右侧信息
    let reqUrl = '/oms-workflow/biz/list?sid='+obj.id;
    let resultObj;
    this.httpclient.get(reqUrl, this.httpOptions).subscribe(
      res => {
        that.isload = true;
        if (res['code'] == 200) {
          resultObj = res['data'][0];
          console.log(resultObj);
          $("#bizName").val(resultObj.name);
          $("#bizProcessKey").val(resultObj.bizKey);
          $("#bizDesc").val(resultObj.bizDesc);
          /*$("#bizType").val(resultObj.bizType);*/
          $("#isOpen").val(resultObj.isOpen);
          $("#url").val(resultObj.url);
          $("#editUrl").val(resultObj.editUrl);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }

  onClick(event, treeId, treeNode, clickFlag) {
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    // console.log(obj);
    $('.myclick').click();
  }

  addItem() {
    $('.cateName').val('');
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.isShowWarnWin = true;
      this.warnMsg = "请选择业务信息";
      this.btn_type_css = "warning";
      return;
    }
    //清除数据
    $("#_bizName").val("");
    $("#_bizKey").val("");
    $("#_bizDesc").val("");
    /*$("#bizType").val("");*/
    $("#isOpen").val("");
    $("#_url").val("");
    $("#_editUrl").val("");
    //显示增加窗体
    $("#add").modal("show");
   /* var that = this;
    let dictsurl = '/oms-workflow/biz/list';
    this.httpclient.get(dictsurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.attrList = res['data'];
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );*/
  }

  subAdd() {
    let that = this;
    let pid = this.itemId;
    let bizName = $("#_bizName").val();
    let bizKey = $("#_bizKey").val();
    let bizDesc = $("#_bizDesc").val();
    let url = $("#_url").val();
    let editUrl = $("#_editUrl").val();
    let zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0&&typeof(pid)=='undefined') {
      this.showWarnWindow(true,"请选择节点信息", "warning");
      return;
    }
    if(bizName == ""){
      this.showWarnWindow(true,"请输入业务名称", "warning");
      return;
    }
    if(bizKey == ""){
      this.showWarnWindow(true,"请输入业务流程Key", "warning");
      return;
    }
    if(!/^[\da-zA-Z]+$/i.test(bizKey)){
      this.showWarnWindow(true,"业务Key仅支持字母或数字", "warning");
      return;
    }
    if(bizDesc.length>100){
      this.showWarnWindow(true,"业务描述超过字数限制", "warning");
      return;
    }
    this.isload = false;
    let params = {
      pid: pid,
      bizName: bizName,
      bizKey: bizKey,
      bizDesc: bizDesc,
      url:url,
      editUrl:editUrl
    };
    let refThis = this;
    let reqUrl = '/oms-workflow/biz/save';
    this.httpclient.post(reqUrl, params, this.httpOptions).subscribe(
      res => {
        refThis.isload = true;
        if (res['code'] == 200) {
         /* this.showWarnWindow(true,"业务操作成功", "success");*/
          this.ngOnInit();
          $("#add").modal('hide');
        } else {
          this.showWarnWindow(true,"操作失败[" + res['desc'] + "]", "danger");
        }
      }, function (err) {
        console.log(err);
      }
    );
  }

  updateBizInfo(){
    let id = this.itemId;
    let bizName = $("#bizName").val();
    let bizKey = $("#bizProcessKey").val();
    let bizDesc = $("#bizDesc").val();
    /*let bizType = $("#bizType").val();*/
    let isOpen = $("#isOpen").val();
    let url = $("#url").val();
    let editUrl = $("#editUrl").val();
    let match = /^\/[\w\/\d-_.]+$/;
    let zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0&&typeof(id)=='undefined') {
      this.showWarnWindow(true,"请选择节点信息", "warning");
      return;
    }
    if(bizName == ""){
      this.showWarnWindow(true,"请输入业务名称", "warning");
      return;
    }
    if(bizKey == ""){
      this.showWarnWindow(true,"请输入业务流程Key", "warning");
      return;
    }
   /* if (treeNode["isLeaf"] == "Y") {
      if(!/^[\da-zA-Z]+$/i.test(bizType)){
        this.showWarnWindow(true,"业务类型编码仅支持字母或数字", "warning");
        return;
      }
    }*/
    if(!/^[\da-zA-Z]+$/i.test(bizKey)){
      this.showWarnWindow(true,"业务Key仅支持字母或数字", "warning");
      return;
    }
    if(bizDesc.length>100){
      this.showWarnWindow(true,"业务描述超过字数限制", "warning");
      return;
    }
    if(url!=""){
      if(!match.test(url)){
        this.showWarnWindow(true,"请输入正确的详情路由URL", "warning");
        return;
      }
    }
    if(editUrl!=""){
      if(!match.test(editUrl)){
        this.showWarnWindow(true,"请输入正确的编辑路由URL", "warning");
        return;
      }
    }
    let params = {
      sid: id,
      bizName: bizName,
      bizKey: bizKey,
      bizDesc: bizDesc,
      url:url,
      editUrl:editUrl,
      /*bizType:bizType,*/
      isOpen:isOpen
    };
    console.log(params);
    let reqUrl = '/oms-workflow/biz/update';
    this.httpclient.post(reqUrl, params, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.showWarnWindow(true,"业务操作成功", "success");
          this.ngOnInit();
        } else {
          this.showWarnWindow(true,"操作失败[" + res['desc'] + "]", "success");
        }
      }, function (err) {
        console.log(err);
      }
    );
  }

  /**
   * 删除节点信息
   */
  delItem() {
    //获取当前选择的节点信息
    let zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.showWarnWindow(true,"请选择节点信息", "warning");
      return;
    }
    if (treeNode["check_Child_State"] == 0) {
      this.showWarnWindow(true, "请选择子级节点", "warning");
      return;
    }
    //弹窗
    this.showDelWindow(true,"是否删除该节点信息?","warning");
  }
  //确认删除
  delOk(){
    let that = this;
    this.showDelWindow(false,"","success");
    let params = {
      sid:this.itemId
    };
    //调用接口
    let editurl = '/oms-workflow/biz/del';
    this.httpclient.post(editurl,params, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.showWarnWindow(true,"操作成功", "success");
          //删除tree节点
          /* var callbackFlag = $('#callbackTrigger').attr('checked');
           zTree.removeNode(treeNode, callbackFlag);*/
          that.ngOnInit();
          that.itemId="";
        } else {
          this.showWarnWindow(true, res['desc'], "danger");
        }
      },
      function (err) {
        that.isShowWarnWin = true;
        that.warnMsg = "操作失败";
        that.btn_type_css = "danger";
        console.log(err);
        return;
      }
    );
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  //删除弹窗
  public showDelWindow(status, warnMsg, btnType) {
    this.isShowDelWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  /**
   * 关闭窗口
   */
  closeWin() {
    this.isShowWarnWin = false;
    this.isShowDelWin = false;
    this.warnMsg = "";
  }

}
