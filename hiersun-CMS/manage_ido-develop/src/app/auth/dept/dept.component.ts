import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-dept',
  templateUrl: './dept.component.html',
  styleUrls: ['./dept.component.css']
})
export class DeptComponent implements OnInit {
  public ztree;
  setting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.ztreeClick
    }
  };
  public pId: any; // pId
  public addId: any;
  public list1 = []; // 部门组织信息列表
  public id: any; // id
  public pageNo = 1;
  public pageNo2 = 1;
  public cList = []; // 部门子类信息列表
  public editList = []; // 修改列表
  pageCount: any;
  pageCount2: any;
  isload: false;
  isHint = false;
  hintMsg: any;
  public editsavenum: any;
  public editId: any;
  public message: any;
  public status = "";
  public cancelnum = 0;
  public treeid: boolean;

  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) { }
  ngOnInit() {
    this.ztreeLoadLeft();
  }

  // 加载树
  ztreeLoadLeft() {
    let that = this;
    $('.partload').show()
    let ztreeUrl = `/api/v1/auth-manager/auth/dept/tree-list`
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          setTimeout(function () {
            $('.partload').hide();
          }, 200);
          that.ztree = data['data'];
          for (let i = 0; i < that.ztree.length; i++) {
            if (!that.ztree[i].pId) {
              that.ztree[i].open = true;
              that.addId = data['data'][i].pId;
              that.chidlList(data['data'][i].id);
              $("#pagination1").pagination({
                currentPage: that.pageNo,
                totalPage: that.pageCount,
                callback: function (current) {
                  that.pageNo = current;
                  that.pagenumber(that.pageNo, data['data'][i].id);
                }
              });
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting, that.ztree);
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }

      }
    );
  }


  // 加载树
  ztreeLeft() {
    let that = this;
    $('.partload').show()
    let ztreeUrl = `/api/v1/auth-manager/auth/dept/tree-list`
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          setTimeout(function () {
            $('.partload').hide();
          }, 200);
          that.ztree = data['data'];
          for (let i = 0; i < that.ztree.length; i++) {
            if (!that.ztree[i].pId) {
              that.ztree[i].open = true;
              that.addId = data['data'][i].pId;
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting, that.ztree);
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }

      }
    );
  }
  reloadPage() {
    let that = this;
    $('.partload').show()
    setTimeout(function () {
      that.ztreeLoadLeft()
      $('.partload').hide()
      that.isHint = true
      that.hintMsg = '加载完毕'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 800);
    }, 1000);
  }
  // 对树操作的本地事件
  public Id: any;
  myclick() {
    let that = this;
    let obj = JSON.parse($('input[name=mymsg]').val());
    that.deptDesc(obj.id);
    that.chidlList(obj.id);
    this.Id = obj.id;
    if (obj.pId == null) {
      that.treeid = false;
    } else {
      that.treeid = true;
    }


  }
  // 部门详情
  deptDesc(id) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/dept/desc/` + id;
    this.http.get(url).subscribe(
      data => {
        if (data['code'] == 200) {
          that.list1 = [data['data']]
          console.log(data)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }
      }, function (err) {
        console.log(err);
      }
    );
  }

  chidlList(pId) {
    let that = this;
    let cUrl = `/api/v1/auth-manager/auth/dept/child-list?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&pId=' + pId;
    this.http.get(cUrl).subscribe(
      function (data) {
        that.isload = false;
        if (data['code'] == 200) {
          that.cList = data['data'].list;
          that.pageNo = data['data'].pageNo;
          that.pageCount = data['data'].pageCount;
          $("#pagination1").pagination({
            currentPage: that.pageNo,
            totalPage: that.pageCount,
            callback: function (current) {
              that.pageNo = current;
              that.pagenumber(that.pageNo, pId);
            }
          });
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

  pagenumber(pagenumber, pId) {
    let that = this;
    let cUrl = `/api/v1/auth-manager/auth/dept/child-list?pageNo=` + pagenumber + '&pageSize=' + 10 + '&pId=' + pId;
    this.http.get(cUrl).subscribe(
      function (data) {
        that.cList = data['data'].list;
      }, function (err) {
        console.log(err);
      });
  }
  // 树的点击事件
  ztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('.myclick').click();
  }
  // 修改
  editsave() {
    $('input[name=name]').removeAttr("readonly");
    $('input[name=comm]').removeAttr("readonly");
    this.editsavenum = 1
    this.cancelnum = 1;
  }
  // 退出编辑

  cancel() {
    $('input[name=name]').attr("readonly", "readonly");
    $('input[name=comm]').attr("readonly", "readonly");
    this.editsavenum = 0;
    this.cancelnum = 0;
  }
  // 保存
  save(id) {
    let that = this;
    if ($('#key').val == '' || $('#name').val() == '') {
      that.isHint = true;
      that.hintMsg = "请输入所有必填项";
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
    } else {
      let url = `/api/v1/auth-manager/auth/dept/save-or-update`;
      let obj = {
        "comm": $('#comm').val(),
        "name": $('#name').val(),
        "id": id
      }
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = "修改部门信息成功！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.deptDesc(that.Id);
            }, 1500)

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
      this.cancel()
    }
  }

  // 操作弹框
  operation(id, pId, status) {
    this.message = "";
    this.status = "";
    this.id = "";
    this.pId = "";
    $("#myModal").modal('show');
    if (status == 'true') {
      this.message = "确定启用该部门"
    } else if (status == 'false') {
      this.message = "确定禁用该部门"
    } else if (status == 'del') {
      this.message = '确定删除该部门'
    }
    this.status = status;
    this.id = id;
    this.pId = pId;
  }

  // 修改弹框、获取id
  edit(id, pId) {
    let that = this;
    this.editId = id
    that.pId = pId;
    $("#myModal1").modal('show');
    let url = `/api/v1/auth-manager/auth/dept/desc/` + id
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.editList = [data['data']]
          console.log(data['data'])
          if (data['data'].noDelete == false) {
            // $('input[name="Eenabled"]').attr('disabled')
          }
        }
      }
    )
  }
  // 确定修改
  editSure() {
    let that = this;
    if ($('#ekey').val() == '' || $('#ename').val() == '') {
      that.isHint = true;
      that.hintMsg = "请输入所有必填项";
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
    } else {
      console.log($('input[name="Eenabled"]:checked').val())
      let url = `/api/v1/auth-manager/auth/dept/update-dept`;
      let obj = {
        "comm": $('#ecomm').val(),
        "id": that.editId,
        "name": $('#ename').val(),
        "enabled": $('input[name="Eenabled"]:checked').val()
      }
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = "修改部门信息成功！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
            that.deptDesc(that.Id);
            that.chidlList(that.pId);
            $("#myModal1").modal('hide');
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

  }
  // 确定是否操作该操作
  subStatus() {
    let that = this;
    let url = '';
    // 如果状态为禁用
    if (that.status == 'true') {
      let obj = {
        "enabled": true,
        "id": that.id
      }
      url = `/api/v1/auth-manager/auth/dept/operation`
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              // that.deptDesc(that.Id);
              that.chidlList(that.pId);
              $("#myModal").modal('hide');
              that.ztreeLeft();
            }, 1100)
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
      // 如果状态为启用
    } else if (that.status == 'false') {
      let obj = {
        "enabled": false,
        "id": that.id
      }
      url = `/api/v1/auth-manager/auth/dept/operation`
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              // that.deptDesc(that.Id);
              that.chidlList(that.pId);
              $("#myModal").modal('hide');
              that.ztreeLeft();
            }, 1000)
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
    } else if (that.status == 'del') {
      let delUrl = `/api/v1/auth-manager/auth/dept/del-dept?deptId=${that.id}`
      this.http.post(delUrl,that.id).subscribe(function (data) {
        if (data['code'] == 200) {
          that.hintMsg = '删除成功';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $("#myModal").modal('hide');
            that.chidlList(that.pId);
            // that.treeid = false;
          }, 1000)
        }
      })
    }
  }
  // 添加部门子类
  add(id) {
    let that = this;
    that.pId = "";
    $("#myModal2").modal('show');
    that.pId = id;
  }
  adddept() {
    $('#adddept').modal('show')
  }

  //添加部门
  addsure() {
    let that = this;
    if ($('#aname').val() == '') {
      that.hintMsg = '请输入所有的必填项！'
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/dept/save-or-update`;
      let obj = {
        "comm": $('#acomm').val(),
        "enabled": $("input[name='enabled']:checked").val(),
        // "key": 'DEPT_' + $('#akey').val(),
        "name": $('#aname').val(),
        "pId": that.pId
      }
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = '添加部门信息成功！';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              // that.deptDesc(that.pId);
              that.chidlList(that.pId);
              $('#myModal2').modal('hide');
            }, 1500);

          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500);
          }
          // $('#akey').attr('value', '')
          $('#aname').attr('value', '')
          $('#acomm').attr('value', '');
        }, function (err) {
          console.log(err);
        }
      );
    }
  }
  adddeptsure() {
    let that = this;
    if ($('#deptaname').val() == '') {
      that.hintMsg = '请输入所有的必填项！';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/dept/save-or-update`;
      let obj = {
        "comm": $('#deptacomm').val(),
        "enabled": $("input[name='deptenabled']:checked").val(),
        "name": $('#deptaname').val(),
        "pId": 0
      }
      this.http.post(url, obj).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.hintMsg = '添加部门成功！';
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            $('#adddept').modal('hide');
            that.ztreeLoadLeft()
            that.chidlList(0)
          }, 1000)

        } else {
          that.hintMsg = data['desc']
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
          }, 1000)
        }
      })
    }
  }
  
  // addsure() {
  //   let that = this;
  //   if ($('#akey').val() == '' || $("#aname").val() == '') {
  //     that.isHint = true;
  //     that.hintMsg = "请填入所有必填项"
  //     setTimeout(function () {
  //       that.isHint = false;
  //       that.hintMsg = ''
  //     }, 1500)
  //   } else {
  //     let keyUrl = `/api/v1/auth-manager/auth/dept/check-key?key=` + 'DEPT_' + $('#akey').val()
  //     this.http.get(keyUrl).subscribe(
  //       function (data) {
  //         if (data['code'] == 200) {
  //           if (data['data'] == true) {
  //             that.isHint = true;
  //             that.hintMsg = "编号不能重复！";
  //             setTimeout(function () {
  //               that.isHint = false;
  //               that.hintMsg = '';
  //             }, 1500)
  //           } else {
  //             that.addSure();
  //           }
  //         } else {
  //           that.isHint = true;
  //           that.hintMsg = data['desc'];
  //           setTimeout(function () {
  //             that.isHint = false;
  //             that.hintMsg = '';
  //           }, 1500);
  //         }
  //       }
  //     );
  //   }
  // }
  public userList : any; // 解除用户关系列表
  public deptId :any;
  remove(id){
    $('#remove').modal('show');
   this.removeList(id)
   this.deptId=id
  }
  removeList(id){
    let that = this;
    let url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=`+this.pageNo+'&pageSize='+10+'&deptId='+id
    this.http.get(url).subscribe(function(data){
      console.log(data['data'].list)
      that.userList=data['data'].list
      that.pageNo2 = data['data'].pageNo;
      that.pageCount2 = data['data'].pageCount;
      $("#pagination2").pagination({
        currentPage: that.pageNo2,
        totalPage: that.pageCount2,
        callback: function (current) {
          that.pageNo2 = current;
          that.pagenumber2(that.pageNo2);
        }
      });
    })
  }
  public userUid:any;
  removeUser(uid) {
    this.userUid = uid;
    $('#myModal5').modal('show')
  }
  subStatus2(){
    let that = this;
    let url = `/api/v1/auth-manager/auth/dept/del-user-dept?deptId=`+that.deptId+'&uid='+that.userUid
    this.http.delete(url).subscribe(function(data){
      if(data['code']==200){
        that.hintMsg=data['desc'];
        that.isHint=true;
        setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
          $('#myModal5').modal('hide');
          that.removeList(that.deptId)
        },1000)
      }
    }),err=>{}
  }
  pagenumber2(pagenumber){
    let that = this;
    let url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=`+pagenumber+'&pageSize='+10+'&deptId='+that.deptId
    this.http.get(url).subscribe(function(data){
      that.userList=data['data'].list
    })
  }
  search(){
    let that = this;
    let url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=`+1+'&pageSize='+10+'&deptId='+that.deptId+'&username='+$('#searchname').val()
    this.http.get(url).subscribe(function(data){
      that.userList=data['data'].list
      that.pageNo2 = data['data'].pageNo;
      that.pageCount2 = data['data'].pageCount;
      $("#pagination2").pagination({
        currentPage: that.pageNo2,
        totalPage: that.pageCount2,
        callback: function (current) {
          that.pageNo2 = current;
          that.pagenumber2(that.pageNo2);
        }
      });
    })
  }

}
