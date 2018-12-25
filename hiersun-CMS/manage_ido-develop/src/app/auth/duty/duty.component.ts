import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-duty',
  templateUrl: './duty.component.html',
  styleUrls: ['./duty.component.css']
})
export class DutyComponent implements OnInit {
  public pageNo = 1;
  public message = '';
  pageCount: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  operation: any;
  public ztree;
  public rztree;
  public showztree;
  public eventx: any; // 获取鼠标的x
  public eventy: any; // 获取鼠标的y
  public deptList = [];
  public dutyId: any;
  public editenabled: any;
  public detprightId: any;
  public targetid: any;
  public usedutyid: any;
  public operationtype: any;
  public dutypid: any;
  public dutyPid: any;
  public noDelete: any;
  public deptId: any;
  // 部门配置
  setting1 = {
    data: {
      simpleData: {
        enable: true,
        open: true
      },
      keep: {
        parent: true
      }
    },
    callback: {
      onClick: this.ztreeClick1,
      onRightClick: this.OnRightClick1
    }
  };
  // 职位配置
  setting2 = {
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false
    },
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    },
    callback: {
      onClick: this.ztreeClick2,
      onRightClick: this.OnRightClick2,
      beforeDrag: this.common.beforeDrag,
      beforeDrop: this.common.beforeDrop,
      onDrop: this.zTreeOnDrop
    }
  };
  showsetting = {
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    }
  };
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) { }
  ngOnInit() {
    let that = this;
    let url = '/api/v1/auth-manager/auth/dept/tree-list'
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.ztree = data['data'];
        for (let i = 0; i < that.ztree.length; i++) {
          if (!that.ztree[i].pId) {
            that.ztree[i].open = true
          }
        }
        $.fn.zTree.init($('#ztree'), that.setting1, that.ztree)
        that.isload = false;
      } else {
        that.isHint = true;
        that.hintMsg = data['desc']
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = "";
        }, 1000)
      }
    })
    $("body").bind(//鼠标点击事件不在节点上时隐藏右键菜单
      "mousedown",
      function (event) {
        if (!(event.target.id == "deptMenu" || $(event.target)
          .parents("#deptMenu").length > 0)) {
          $("#deptMenu").hide();
        }
      }
    );
    $("html").bind(//鼠标点击事件不在节点上时隐藏右键菜单
      "mousedown",
      function (event) {
        if (!(event.target.id == "dutyMenu" || $(event.target)
          .parents("#dutyMenu").length > 0)) {
          $("#dutyMenu").hide();
        }
      }
    );
  }
  // 树的点击事件
  ztreeClick1(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg1"]').val(obj);
    $('.deptmyclick1').click();
  }
  ztreeClick2(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg2"]').val(obj)
    $('.dutymyclick2').click();
  }
  // 部门树

  deptmyclick1() {
    let that = this;
    let obj = JSON.parse($('input[name="mymsg1"]').val());
    that.dutyTree(obj.id)
    this.deptId = obj.id;
    this.rztree = []
  }
  dutymyclick2() {
    let that = this;
    let obj = JSON.parse($('input[name="mymsg2"]').val());
  }
  // 职位树

  dutyTree(id) {
    this.detprightId = id
    let that = this;
    that.rztree = [];
    let url = `/api/v1/auth-manager/auth/duty/tree-list?deptId=${id}`
    that.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.rztree = data['data'];
        $.fn.zTree.init($('#rztree'), that.setting2, that.rztree);
      } else {
        that.isHint = true;
        that.hintMsg = data['desc']
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = "";
        }, 1000)
      }
    }), err => { }
  }
  // 刷新相关职位信息树
  reloadPage() {
    let that = this;
    this.isload = true;
    this.dutyTree(this.deptId);
    setTimeout(function () {
      that.isload = false;
      that.isHint = true;
      that.hintMsg = '加载完毕'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = ''
      }, 500)
    }, 1000)
  }
  OnRightClick1(event, treeId, treeNode) {
    let that = this;
    that.eventx = event.clientX - 280;
    that.eventy = event.clientY - 194;
    var zTree = $.fn.zTree.getZTreeObj("ztree");
    var obj = JSON.stringify(treeNode);
    $('input[name="deptmymsg1"]').val(obj);
    if (!treeNode) {
      zTree.cancelSelectedNode();
      $(".myclick1").click();
      $("#deptMenu").show();
      $("#deptMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
    } else if (treeNode && !treeNode.noR) {
      if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {
        zTree.cancelSelectedNode();
        $(".myclick1").click();
        $("#deptMenu").show();
        $("#deptMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
      } else {
        zTree.selectNode(treeNode);
        if (treeNode.pId != null) {
          $(".myclick1").click();
          $("#deptMenu").show();
          $("#deptMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
        }
      }
    }
  }

  OnRightClick2(event, treeId, treeNode) {
    let that = this;
    that.eventx = event.clientX - 600;
    that.eventy = event.clientY - 155;
    var zTree = $.fn.zTree.getZTreeObj("rztree");
    var obj = JSON.stringify(treeNode);
    this.dutyPid = treeNode.pId
    $('input[name="dutymymsg2"]').val(obj);
    if (!treeNode) {
      zTree.cancelSelectedNode();
      $(".myclick2").click();
      $("#dutyMenu").show();
      $("#dutyMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
    } else if (treeNode && !treeNode.noR) {
      if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {
        zTree.cancelSelectedNode();
        $(".myclick2").click();
        $("#dutyMenu").show();
        $("#dutyMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
      } else {
        zTree.selectNode(treeNode);
        $(".myclick2").click();
        $("#dutyMenu").show();
        $("#dutyMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
      }
    }

  }

  // 部门
  myclick1() {
    let obj = JSON.parse($('input[name="deptmymsg1"]').val());
    let that = this;
    let url = `/api/v1/auth-manager/auth/dept/desc/${obj.id}`
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.detprightId = data['data'].id;
        console.log(data)
      } else {
        that.hintMsg = data['desc'];
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        })
      }
    })
  }

  myclick2() {
    let that = this;
    let obj = JSON.parse($('input[name="dutymymsg2"]').val());
    that.dutyId = obj.id
    that.dutypid = obj.pId
    let url = `/api/v1/auth-manager/auth/duty/desc/${obj.id}`
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.editenabled = data['data'].enabled;
        that.noDelete = data['data'].noDelete;
      } else {
        that.isHint = true;
        that.hintMsg = data['desc']
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
      }

    })
  }
  // 使用默认职位模板

  useduty() {
    let that = this;
    $('#deptMenu').hide();
    $('#operation').modal('show');
    let obj = JSON.parse($('input[name="deptmymsg1"]').val());
    that.usedutyid = obj.id;
    that.operation = "请确认是否使用默认职位模板";
    that.operationtype = 1;
    let url = `/api/v1/auth-manager/auth/duty/default-list`
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.showztree = data['data'];
        for (let i = 0; i < that.showztree.length; i++) {
          if (!that.showztree[i].pId) {
            that.showztree[i].open = true
          }
        }
        $.fn.zTree.init($('#showztree'), that.showsetting, that.showztree)
      } else {
        that.isHint = true;
        that.hintMsg = data['desc']
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = "";
        }, 1000)
      }

    })
  }
  // 禁用
  disable() {
    $('#dutyMenu').hide();
    $('#operation').modal('show');
    this.operation = "确认要禁用该职位吗？";
    this.operationtype = 2;
  }
  // 启用
  enable() {
    $('#dutyMenu').hide();
    $('#operation').modal('show');
    this.operation = "确认要启用该职位吗？";
    this.operationtype = 3;
  }
  operationSure() {
    let that = this;
    if (that.operationtype == 1) {
      let url = `/api/v1/auth-manager/auth/duty/use-default-duty`
      let obj2 = {
        id: that.usedutyid
      }
      this.http.post(url, obj2).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = "设置成功"
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              that.operation = ''
              $('#operation').modal('hide');
              that.dutyTree(that.deptId)
            }, 1500)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc']
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = "";
            }, 1000)
          }
        }, err => { }
      )
    } else if (that.operationtype == 2) {
      let url = `/api/v1/auth-manager/auth/duty/save-or-update`
      let obj = {
        "id": that.dutyId,
        'enabled': false,
        'deptId': that.deptId,
        'pId': that.dutypid
      };
      this.http.post(url, obj).subscribe(function (data) {
        if (data['code'] == 200) {
          that.hintMsg = '禁用成功';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $('#operation').modal('hide');
            that.dutyTree(that.deptId)
          }, 1000)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "";
          }, 1000)
        }
      }), err => { }
    } else if (that.operationtype == 3) {
      let url = `/api/v1/auth-manager/auth/duty/save-or-update`
      let obj = {
        "id": that.dutyId,
        'enabled': true,
        'pId': that.dutypid,
        'deptId': that.deptId
      };
      this.http.post(url, obj).subscribe(function (data) {
        if (data['code'] == 200) {
          that.hintMsg = '启用成功';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $('#operation').modal('hide');
            that.dutyTree(that.deptId)
          }, 1000)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "";
          }, 1000)
        }
      })
    } else if (that.operationtype == 4) {
      let dutyId = that.dutyId
      let url = `/api/v1/auth-manager/auth/duty/del-duty?dutyId=${dutyId}`
      this.http.post(url,dutyId).subscribe(function (data) {
        if (data['code'] == 200) {
          that.hintMsg = '删除成功';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $('#dutyMenu').hide();
            $('#operation').modal('hide');
            that.dutyTree(that.deptId);
          }, 1000);
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "";
          }, 1000)
        }
      }), err => { }
    }
  }
  // 添加职位
  addduty() {
    $('#deptMenu').hide();
    $('#addduty').modal('show');
  }
  // 在部门添加职位
  adddutysure() {
    let that = this;
    let nameUrl = `/api/v1/auth-manager/auth/duty/check-name?name=` + $('#addname').val() + '&deptId=' + this.deptId;
    this.http.get(nameUrl).subscribe(function (data) {
      if (data['data'] == true) {
        that.hintMsg = '用户名不能重复'
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1500)
      } else {
        let name = $('#addname').val()
        if (name == '') {
          that.isHint = true;
          that.hintMsg = '请输入必填项！'
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = ''
          }, 1000)
        } else {
          let url = `/api/v1/auth-manager/auth/duty/save-or-update`
          let obj = {
            "comm": $('#addcomm').val(),
            "deptId": that.detprightId,
            "enabled": $('input[name="enabled"]:checked').val(),
            "name": $('#addname').val()
          }
          that.http.post(url, obj).subscribe(function (data) {
            if (data['code'] == 200) {
              that.hintMsg = '添加成功';
              that.isHint = true;
              setTimeout(function () {
                that.hintMsg = '';
                that.isHint = false;
                $('#addduty').modal('hide')
                $('#addname').attr('value', '')
                $('#addcomm').attr('value', '')
                $('input[name="enabled"]').attr('checked', false)
                that.dutyTree(that.deptId);
              }, 1000)
            } else {
              that.hintMsg = '添加失败';
              that.isHint = true;
              setTimeout(function () {
                that.hintMsg = ''
                that.isHint = false
              }, 1000)
            }
          })
        }
      }
    })

  }
  addduty2() {
    $('#addduty2').modal('show')
    $('#dutyMenu').hide()
  }
  addsure() {
    let that = this;
    let nameUrl = `/api/v1/auth-manager/auth/duty/check-name?name=` + $('#addname2').val() + '&deptId=' + this.deptId;
    this.http.get(nameUrl).subscribe(function (data) {
      if (data['data'] == true) {
        that.hintMsg = '用户名不能重复'
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1500)
      } else {
        let name = $('#addname2').val()
        if (name == '') {
          that.hintMsg = '请输入必填项！'
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
          }, 1000)
        } else {
          let url = `/api/v1/auth-manager/auth/duty/save-or-update`
          let obj = {
            "comm": $('#addcomm2').val(),
            "deptId": that.detprightId,
            "enabled": $('input[name="enabled2"]:checked').val(),
            "name": $('#addname2').val(),
            'pId': that.dutyId
          }
          that.http.post(url, obj).subscribe(function (data) {
            if (data['code'] == 200) {
              that.hintMsg = '添加职位成功';
              that.isHint = true;
              setTimeout(function () {
                that.hintMsg = '';
                that.isHint = false;
                $('#addduty2').modal('hide');
                $('#addcomm2').attr('value', '');
                $('#addname2').attr('value', '');
                $('input[name="enabled2"]').attr('checked', false);
                that.dutyTree(that.deptId);
              }, 1000)
            } else {
              that.isHint = true;
              that.hintMsg = data['desc']
              setTimeout(function () {
                that.isHint = false;
                that.hintMsg = "";
              }, 1000)
            }
          })
        }
      }
    })


  }

  editduty() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/duty/desc/${this.dutyId}`
    this.http.get(url).subscribe(function (data) {
      that.deptList = [data['data']];
    })
    $('#dutyMenu').hide();
  }
  editsure() {
    let that = this;
    let name = $('#ename').val();
    if (name == '') {
      that.hintMsg = '请输入必填项！';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/duty/save-or-update`
      let obj = {
        "comm": $('#ecomm').val(),
        "deptId": that.detprightId,
        "enabled": $('input[name="eenabled"]:checked').val(),
        "name": $('#ename').val(),
        'id': that.dutyId,
        'pId': that.dutypid
      }
      this.http.post(url, obj).subscribe(function (data) {
        if (data['code'] == 200) {
          that.hintMsg = '修改成功';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $('#editduty').modal('hide');
            that.dutyTree(that.deptId)
          }, 1000)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "";
          }, 1000)
        }
      })
    }

  }

  zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    let id = targetNode.id;
    this.targetid = id;
    if (id == null) {
      $('input[name="mypageid"]').val(treeNodes[0].id);
    } else {
      $('input[name="mypageid"]').val(treeNodes[0].id);
      $('input[name="movepageid"]').val(targetNode.id);
    }
    // $('input[name="movetype"]').val(moveType);//移动状态
    // $('input[name="movepageid"]').val(targetNode.id);//目标id
    // $('input[name="movepagepid"]').val(targetNode.pId);//目标id
    // $('input[name="mypageid"]').val(treeNodes[0].id); //自身id
    $(".moveclick").click();
  }
  moveclick() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/duty/save-or-update`
    let channel = {

    };
    let targetid = $('input[name="mypageid"]').val()
    if (targetid == null) {
      channel = {
        'id': $('input[name="mypageid"]').val(),
        'deptId': that.deptId
      }
    } else {
      channel = {
        'pId': $('input[name="movepageid"]').val(),
        'id': $('input[name="mypageid"]').val(),
        'deptId': that.deptId
      }
    }

    this.http.post(url, channel).subscribe(function (data) {
      if (data['code'] == 200) {
        that.hintMsg = '移动成功';
        that.isHint = true;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000)
      }
    }), err => { }
  }
  // 自定义上传
  dutyup() {

  }
  // 删除职位
  delduty() {
    this.operationtype = 4
    $('#dutyMenu').hide();
    $('#operation').modal('show');
    this.operation = "确认要删除该职位吗？";
  }
}
