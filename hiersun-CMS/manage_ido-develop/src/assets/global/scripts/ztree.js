$(function(){
  var setting = {
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
      beforeDrag: beforeDrag,
      beforeDrop: beforeDrop,
      onClick:myclick,
      onDrag: myDrag
    }
  };

  function myclick(event, treeId, treeNode) {
    var obj = JSON.stringify(treeNode)
    $('input[name="mymsg"]').val(obj)
    $('.myclick').click()
  }
  function myDrag(event, treeId, treeNode) {
    console.log(treeNode)
  }

  function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }
  function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }

  function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.setting.edit.drag.isCopy = false;
    zTree.setting.edit.drag.isMove = true;

    zTree.setting.edit.drag.prev = true;
    zTree.setting.edit.drag.inner = true;
    zTree.setting.edit.drag.next = true;
  }

  $(document).ready(function(){
    var zNodes =[];
    $.ajax({
      type:'get',
      url:'/api/cms/channel/list-channel?siteId=1',
      success:function (data) {
        console.log(data)
        if(data.header.code == 200){
          zNodes = data.body;
          for (var i = 0; i < zNodes.length; i++) {
            if(zNodes[i].pId == 0){
              zNodes[i].open = true;
              $('input[name="mymsg"]').val(zNodes[i]);
            }
          }
          if(document.getElementById('treeDemo')){
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            setCheck();
          }
        }
      },
      error:function (error) {
        console.log(error)
      }
    })

  });
})
