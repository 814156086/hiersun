import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class CommonService {

  public log:any;

  constructor() { }
  goback(){
     window.history.go(-1)
  }
  closewin(){
    window.close()
  }
  getRem(){
      var html = document.getElementById("mhere");
      var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
      html.style.fontSize = oWidth/750*100 + "px";
  }
  myJSONparse(obj){
    return JSON.parse(obj)
  }
  beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }
  beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }

  setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.setting.edit.drag.isCopy = false;
    zTree.setting.edit.drag.isMove = true;

    zTree.setting.edit.drag.prev = true;
    zTree.setting.edit.drag.inner = true;
    zTree.setting.edit.drag.next = true;
    zTree.setting.enable =true;
  }
  setCheck2() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.setting.edit.drag.isCopy = false;
    zTree.setting.edit.drag.isMove = false;

    zTree.setting.edit.drag.prev = true;
    zTree.setting.edit.drag.inner = true;
    zTree.setting.edit.drag.next = true;
    zTree.setting.enable =true;
  }
  remove() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    nodes = zTree.getSelectedNodes(),
    treeNode = nodes[0];
    // console.log(treeNode)
    if (nodes.length == 0) {
      alert("请先选择一个节点");
      return;
    }
    var callbackFlag = $("#callbackTrigger").attr("checked");
    zTree.removeNode(treeNode, callbackFlag);
  };
  addnode(newobj){
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    nodes = zTree.getSelectedNodes(),
    treeNode;
    if(nodes.length > 0){
      treeNode=nodes[0]
    }else{
      treeNode=null;
    }
    zTree.addNodes(treeNode,newobj);
    return false;
  }
  updateNode(name) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    nodes = zTree.getSelectedNodes();
    nodes[0].desc = name;
    zTree.updateNode(nodes[0]);
  }
  
}
