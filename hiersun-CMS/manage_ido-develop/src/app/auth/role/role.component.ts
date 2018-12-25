import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder } from "@angular/forms";
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
declare var $: any;
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})

export class RoleComponent implements OnInit {
  public resourceIds: any;
  public resourceIds2: any;
  public ztree;
  public list = [];
  public rolelist = [];
  public treeidlist = [];
  public pageNo = 1;
  public message = "";
  status = "";
  roleId: any;
  selectList: any;
  selectMutexList = [];
  checkRoleList = [];
  pageCount: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  roleKey: any;
  appKey: any;
  value: string[] = [];
  nodes = [];
  authRole: any;
  public treenodes = []
  public checkedvals = []
  defaultCheckedKeys = []; // 指定选中复选框的节点
  defaultSelectedKeys = []; // 指定选中的节点
  defaultExpandedKeys = []; // 展开指定的节点
  //首页
  setting1 = {
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    },
    callback: {
      onClick: this.ztreeClick1,
    }
  };

  setting = {
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    },
    callback: {
      onClick: this.ztreeClick
    }
  };

  resourcesetting = {
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    },
    check: {
      enable: true,
      chkboxType: { "Y": "ps", "N": "ps" }
    },
    callback: {
      onClick: this.resourceztreeClick,
      beforeCheck: true,
      onCheck: this.onCheck
    }
  }

  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) {
  }

  pagenumber(pagenumber) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=` + pagenumber + '&pageSize=' + 10 + "&app=" + that.appKey;
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.list = data['data'].list;
      } else {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    }, function (err) {
      console.log(err)
    })
  }

  onChange($event: string[]): void {
    var list = [];
    let that = this;
    // console.log($event);
    // this.pIdList=$event
    $event.map((item, index) => {
      // console.log(item)
      list.push(
        {
          id: item
        }
      )
      // console.log(list)


    })
    that.pIdList = list
    // console.log(that.pIdList)

  }


  ngOnInit() {
    let that = this;
    let treeUrl = '/api/v1/auth-manager/auth/app/valid-list';
    this.http.get(treeUrl).subscribe(
      function (data) {
        that.isload = false;
        if (data['code'] == 200) {
          setTimeout(function () {
            $('.partload').hide()
          }, 200)
          that.ztree = data['data'];
          for (let i = 0; i < that.ztree.length; i++) {
            if (!that.ztree[i].pId) {
              that.ztree[i].open = true
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting1, that.ztree)
          that.appKey = 0;
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }
    )

  }
  public treeId: any;
  myclick() {
    let that = this;
    that.rolelist = [];
    let obj = JSON.parse($('input[name=mymsg]').val());
    that.treeId = obj.id
    if (obj.pId != null) {
      that.appKey = obj.key;
      that.dept(obj.id)
    } else {
      that.appKey = 0;
    }
  }
  dept(id) {
    let that = this;
    that.rolelist = []
    let rolelist = []
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&app=' + that.appKey;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['code'] == 200) {
          rolelist = data['data'].list;
          that.pageNo = data['data'].pageNo;
          that.pageCount = data['data'].pageCount;
          $("#pagination1").pagination({
            currentPage: that.pageNo,
            totalPage: that.pageCount,
            callback: function (current) {
              that.pageNo = current;
              that.pagenumber(that.pageNo)
            }
          });
          that.rolelist = rolelist
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      }
    )
  }

  // 树的点击事件
  ztreeClick1(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('input[name="cmymsg"]').val(obj);
    $('.myclick').click();
    $('.cmyclick').click();
  }

  // 树的点击事件
  ztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="appmymsg"]').val(obj);
    $('.appmyclick').click();
  }

  resourceztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="resourcemymsg"]').val(obj);
    $('.resourcemyclick').click();
  }

  public resourceztree

  appmyclick() {
    let that = this;
    let obj = JSON.parse($('input[name=appmymsg]').val());
    that.resource()

  }

  resourcemyclick() {
    let that = this;
    let obj = JSON.parse($('input[name=resourcemymsg]').val());
  }

  onCheck(e, treeId, treeNode) {
    let that = this;
    let treeObj = $.fn.zTree.getZTreeObj("reztree")
    let nodes = treeObj.getCheckedNodes(true)
    let treeidlist2 = []
    for (var i = 0; i < nodes.length; i++) {
      treeidlist2.push(
        nodes[i].id
      )
    }
    that.treeidlist = treeidlist2
    console.log(that.treeidlist)
  }
  resourceadd() {
    let that = this;
    console.log(this.checkedvals)
    $('.scieen').hide();
    let list = []
    that.checkedvals.map((item, index) => {
      list.push(
        {
          'id': item
        }
      )
    })
    let obj = {
      "key": that.rolekey,
      "resources": list
    }
    let url = `/api/v1/auth-manager/auth/role/add-resource-role`
    this.http.post(url, obj).subscribe(
      function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.hintMsg = data['desc'];
          that.isHint = true;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1000)
        }
      }
    )
  }

  reloadPage() {
    let that = this;
    $('.partload').show()
    setTimeout(function () {
      that.ngOnInit()
      that.rolelist = []
      $('.partload').hide()
      that.isHint = true
      that.hintMsg = '加载完毕'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = ''
      }, 800)
    }, 1000)
  }

  // 操作弹框
  public listkey: any;
  operation(id, status) {
    let that = this;
    this.message = "";
    this.status = "";
    this.roleId = "";
    $("#myModal").modal('show');
    if (status == 'true') {
      this.message = "确定启用该角色"
    } else if (status == 'false') {
      this.message = "确定禁用该角色"
    } else if (status == 'del') {
      this.message = '确定删除该角色'
    }
    this.status = status;
    this.roleId = id;
    let url = `/api/v1/auth-manager/auth/role/desc/${id}`
    this.http.get(url).subscribe(function (data) {
      that.listkey = data['data'].key
    })
  }

  // 确定是否操作该操作
  subStatus() {
    let that = this;
    let url = '';
    if (that.status == 'true') {
      let obj = {
        "enabled": true,
        "id": that.roleId
      }
      url = `/api/v1/auth-manager/auth/role/save-or-update`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              $("#myModal").modal('hide');
              that.dept(that.treeId);
            }, 1500)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        }
      )
    } else if (that.status == 'false') {
      let obj = {
        "enabled": false,
        "id": that.roleId
      };
      url = `/api/v1/auth-manager/auth/role/save-or-update`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              $("#myModal").modal('hide');
              that.dept(that.treeId);
            }, 1000)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        }
      )
    } else if (that.status == 'del') {
      // let key = $('');
      let url = `/api/v1/auth-manager/auth/role/del-role?roleId=${that.roleId}`;
      this.http.post(url,that.roleId).subscribe(function (data) {
        console.log(data);
        if (data['code'] == 200) {
          that.hintMsg = data['desc'];
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $("#myModal").modal('hide');
            that.dept(that.treeId);
          }, 1000)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      })
    }
  }

  // 关联用户
  public linkname: any;
  public checkList: any;

  link(key) {
    this.roleKey = key;
    let that = this;
    $("#myModal1").modal('show');

    let selectUrl = `/api/v1/auth-manager/auth/group/valid-list`
    this.http.get(selectUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.checkList = data['data']
        }
      }
    )
    let listurl = `/api/v1/auth-manager/auth/role/list-group-byRole?role=` + key;
    that.http.get(listurl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.linkname = [data['data'][0]];
          that.selectList = data['data']
          // console.log(that.selectList)

        }
      }
    )
  }

  mutex(id, key) {
    let that = this;
    that.roleKey = key;
    $("#myModal3").modal('show');
    let selectUrl = `/api/v1/auth-manager/auth/role/valid-list?roleId=` + id+'&app='+that.appKey;
    this.http.get(selectUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.checkRoleList = data['data']
        }
      }
    )
    let listurl = `/api/v1/auth-manager/auth/role/list-mutex-byRole?role=` + key;
    that.http.get(listurl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.selectMutexList = data['data'];
          // console.log(that.selectList)

        }
      }
    )


  }


  public appztree;
  public rolekey: any;
  public reztree;
  allot(key) {
    let that = this;
    that.rolekey = key;
    let url = `/api/v1/auth-manager/auth/resource/valid-list?app=${that.appKey}`
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.treenodes = data['data']
          console.log(data)
        }
      }, err => { }
    )
    let roleUrl = `/api/v1/auth-manager/auth/role/list-resoure-ByRole?key=` + key + '&app=' + that.appKey
    this.http.get(roleUrl).subscribe(
      function (data) {
        console.log(data['data'])
        if (data['code'] == 200) {
          setTimeout(function () {
            let val = data['data'];
            that.defaultCheckedKeys = val;
            console.log(data)
            // that.defaultExpandedKeys = val;
            that.defaultSelectedKeys = val;
          }, 500)

        }

      }
    )
    $("#allot").modal('show');
  }

  tree() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/app/tree-list`
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.appztree = data['data']
          $.fn.zTree.init($('#appztree'), that.setting, that.appztree)
        }
        // console.log(data)
      }
    )
  }

  public idList = []//获取的id的集合
  public repetIds = []//找出重复的id
  public keyList = []//key
  public pIdList = []//pid

  resource() {
    let that = this;
    that.value = [];
    let obj = JSON.parse($('input[name=appmymsg]').val());
    let url = `/api/v1/auth-manager/auth/role/list-resoure-ByRole?key=` + that.rolekey + '&app=' + obj.key
    this.http.get(url).subscribe(
      function (data) {
        that.idList = data['data']
        that.idList.map((item, index) => {
          that.repetIds.push(
            item
          )
        })

      }
    )

    let resourceUrl = `/api/v1/auth-manager/auth/resource/valid-list/?app=` + obj.key
    this.http.get(resourceUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.nodes = data['data']
          that.value = that.repetIds

        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }

      }
    )
  }

  // resourceadd() {
  //   let that = this;
  //   // $('.scieen').hide()
  //   let obj = {
  //     "key": that.rolekey,
  //   "resources": that.pIdList
  // }
  //   let url = `/api/v1/auth-manager/auth/role/add-resource-role`
  //   this.http.post(url, obj).subscribe(
  //     function (data) {
  //       if (data['code'] == 200) {
  //         that.isHint = true;
  //         that.hintMsg = data['desc'];
  //         setTimeout(function () {
  //           that.isHint = false;
  //           that.hintMsg = '';
  //           that.back()
  //           history.go(0)
  //         }, 1500)
  //       } else {
  //         that.isHint = true;
  //         that.hintMsg = data['desc'];
  //         setTimeout(function () {
  //           that.isHint = false;
  //           that.hintMsg = '';
  //         }, 1500)
  //       }
  //     }
  //   )
  // }

  back() {
    $('.scieen').hide()
    this.value = []
  }


  add() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/role/add-group-role`
    let arry = new Array();
    that.selectList.map((item, index) => {
      arry.push(
        item.key,
      )
    })
    var addList = {
      key: that.roleKey,
      groups: arry
    }
    this.http.post(url, addList).subscribe(
      function (data) {
        if (data['code'] == 200) {
          console.log(data)
          that.isHint = true;
          that.hintMsg = data['desc'];
          $("#myModal1").modal('hide');
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = ''
          }, 1500)
        } else {
          $("#myModal4").modal('show');
          that.message = data['desc'];
          // that.isHint = true;
          // that.hintMsg = data['desc'];
          // setTimeout(function () {
          //   that.isHint = false;
          //   that.hintMsg = ''
          // }, 1500)
        }
      }, function (err) {
        console.log(err)
      }
    )


  }
  addMutex() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/role/add-mutex-role`
    let arry = new Array();
    that.selectMutexList.map((item, index) => {
      arry.push(
        item.key,
      )
    })
    let addList = {
      key: that.roleKey,
      mutexRoles: arry
    }
    this.http.post(url, addList).subscribe(
      function (data) {
        if (data['code'] == 200) {
          console.log(data)
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = ''
          }, 1500)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = ''
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      }
    )
  }

  newadd() {
    let that = this;
    if ($('#selectTag option:selected ').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择小组'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000)
      return;
    }
    this.selectList.push(
      {
        key: $('#selectTag option:selected ').val(),
        name: $('#selectTag option:selected').text(),
      }
    )
  }

  newMutex() {
    let that = this;
    if ($('#selectRole option:selected ').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择角色'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000)
      return;
    }
    this.selectMutexList.push(
      {
        key: $('#selectRole option:selected ').val(),
        name: $('#selectRole option:selected').text(),
      }
    )
  }


  cancel(key) {
    let that = this;
    $('#tbody tr .btn').on('click', function () {
      $(this).parent().parent().remove()
    })
    this.selectList.map((item, index) => {
      if (item.key == key) {
        that.selectList.splice(index, 1)
      }
    })
  }

  cancelMutex(key) {
    let that = this;
    $('#tbody1 tr .btn').on('click', function () {
      $(this).parent().parent().remove()
    })
    this.selectMutexList.map((item, index) => {
      if (item.key == key) {
        that.selectMutexList.splice(index, 1)
      }
    })
  }


  zcancel() {
    $('.scieen').hide();
  }

  scieen() {
    this.zcancel()
    $('#addModal').hide()
    $('.modal-backdrop').hide();
  }

  addRole() {
    $('.add_role').val('');
    $("#addModel").modal('show');
  }
  public etype: any;
  public escope: any;
  public eenabled: any;
  editRole(roleId) {
    let that = this;
    that.roleId = roleId;
    let url = `/api/v1/auth-manager/auth/role/desc/` + roleId;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.authRole = [data['data']];
          that.etype = data['data'].type;
          that.escope = data['data'].scope;
          that.eenabled = data['data'].enabled;
          console.log(that.authRole);
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }
    )
    $("#editModal").modal('show');
  }
  editSure() {
    let that = this;
    if ($('#ename').val() == '') {
      that.hintMsg = '请输入必填项'
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/role/save-or-update/?authRole=${that.roleId}`
      let obj = {
        // "app":"",
        "comm": $('#ecomm').val(),
        "enabled": $('input[name="eenabled"]:checked').val(),
        "id": that.roleId,
        "key": $('#ekey').val(),
        "name": $('#ename').val(),
        "scope": $('input[name="escope"]:checked').val(),
        "type": $('input[name="etype"]:checked').val()
      }
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {

            that.isHint = true;
            that.hintMsg = "修改角色信息成功！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.dept(that.treeId)
              $("#editModal").modal('hide');
            }, 1500)


          }
          else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        }, function (err) {
          console.log(err)
        }
      )
    }

  }

  addSure() {
    let that = this;
    if ($('#name').val() == '') {
      that.hintMsg = '请输入必填项';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/role/save-or-update`
      let obj = {
        "comm": $('#comm').val(),
        "enabled": $("input[name='enabled']:checked").val(),
        "type": $("input[name='type']:checked").val(),
        "scope": $("input[name='scope']:checked").val(),
        "name": $('#name').val(),
        "app": that.appKey,
      }
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            $("#addModel").modal('hide');
            that.isHint = true;
            that.hintMsg = "添加角色信息成功！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.dept(that.treeId)
            }, 1500)
            that.pagenumber(that.pageNo);

          }
          else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        }, function (err) {
          console.log(err)
        }
      )
    }

  }
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event.keys);
    this.checkedvals = event.keys;
  }

}
