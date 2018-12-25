import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute} from '@angular/router';
import {FormBuilder} from "@angular/forms";

declare var $: any;
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  listOfOption = [];
  size = 'default';
  tagValue = [];
  grouplist = [];
  public list = [];
  public userList = [];
  public pageNo = 1;
  public pageNo2 = 1;
  public pageNo3 = 1;
  public message = "";
  status = "";
  groupId: any;
  pageCount: any;
  pageCount2: any;
  pageCount3: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  resultList = [];//关联用户保存
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
  public appZtree;
  appSetting = {
    data: {
      simpleData: {
        enable: true,
        open: true
      }
    },
    callback: {
      onClick: this.appClick
    }
  };
  public ztree: any;

  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) { }
  pagenumber(pagenumber) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/group/group-list?pageNo=` + pagenumber + '&pageSize=' + 10
    this.http.get(url).subscribe(function (data) {
      that.list = data['data'].list;
    }, function (err) {
      console.log(err)
    })
  }
  pagenumber2(pagenumber) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/group/dept-user-list?pageNo=` + pagenumber + '&pageSize=' + 10 + '&deptId=' + that.treeId + '&group=' + that.key
    this.http.get(url).subscribe(function (data) {
      that.list1 = data['data'].list;
    }, function (err) {
      console.log(err)
    })
  }

  pagenumber3(pagenumber) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/role/list-role-byApp?pageNo=`+ pagenumber+'&pageSize='+10+'&app='+that.appKey+'&group='+that.userKey
    this.http.get(url).subscribe(function (data) {
      that.rolelist = data['data'].list;
    }, function (err) {
      console.log(err)
    })
  }

  ngOnInit() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/group/group-list?pageNo=` + that.pageNo + '&pageSize=' + 10
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['code'] == 200) {
          that.list = data['data'].list;
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
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
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

  select(ret: {}): void {
  }

  change(ret): void {
    ret.list.forEach(element => {
      if (ret.to === "right") {
        element['direction'] = 'right';
      } else {
        element['direction'] = 'left';
      }
    });
    const left = this.list1.filter(e => e.direction === 'left');
    this.right = this.list1.filter(e => e.direction === 'right');
    // console.log('left', left);
    // console.log('right1', this.right);
  }
  key: any;
  public rightlist = []
  public tagValue2 = []
  // 点击关联用户弹框
  link(key) {
    let that = this;
    $('#myModal1').modal('show')
    this.grouplist = [];
    this.key = key;
    let ztreeurl = `/api/v1/auth-manager/auth/user/user-dept`
    this.http.get(ztreeurl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.ztree = data['data'].list;
          for (let i = 0; i < that.ztree.length; i++) {
            if (!that.ztree[i].pId) {
              that.treeId=that.ztree[i].id;
              that.ztree[i].open = true;
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting, that.ztree); // zNodes  ztree
          // that.tagValue=[]

          that.userDept();
        }
      }, function (err) {
        console.log(err)
      }
    )
    // --------------渲染.uid

    // 获取穿梭框右侧的数据
    // let linkUer = `/api/v1/auth-manager/auth/group/list-user-byKey?key=` + key;
    // this.http.get(linkUer).subscribe(
    //   function (data) {
    //     if (data['code'] == 200) {
    //       that.userList = data['data']
    //       // console.log('穿梭框的数据', data['data'])
    //       // console.log('关联用户', that.userList)
    //       let tagValue = []
    //       let tagValue2 = [];
    //       let resultList = [];
    //       this.resultList = [];
    //       that.userList.forEach((idx: any) => {
    //         // console.log('idx', idx)
    //         // that.resu/
    //         tagValue.push(
    //           idx.name
    //         )
    //         tagValue2.push(
    //           idx.uid
    //         )
    //         resultList.push(
    //           idx.uid
    //         )
    //       })
    //       that.tagValue = tagValue
    //       that.tagValue2 = tagValue2
    //       that.resultList = resultList
    //       // console.log(that.tagValue2, 'tagvalue2')
    //       // console.log(that.tagValue, 'tagvalue')
    //     }
    //
    //   }
    // )
  }
  id: any;
  ztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('.myclick').click()
    // console.log(treeNode.id)
    this.id = treeNode.id
  }
  appClick(e,id,treeNode){
    let obj = JSON.stringify(treeNode);
    $('input[name="appmsg"]').val(obj)
    $('.appclick').click()
  }

  list1: any[] = [];
  uid: any;
  public right = []
  public treeId: any;
  // 左侧树的点击
  myclick() {
    let that = this;
    that.list1=[]
    let obj = JSON.parse($('input[name=mymsg]').val());
    that.treeId = obj.id;
    // 根据树的id获取穿梭框左侧的数据
    this.userDept();
  }
  userDept(){
    let that = this;
    that.pageNo2=1;
    let url = `/api/v1/auth-manager/auth/group/dept-user-list?pageNo=` + that.pageNo2 + '&pageSize=' + 10 + '&deptId=' + that.treeId + '&group=' +that.key
    this.http.get(url).subscribe(
      function (data) {
        that.list1 = data['data'].list
        that.pageNo2 = data['data'].pageNo;
        that.pageCount2 = data['data'].pageCount;
        $("#pagination2").pagination({
          currentPage: that.pageNo2,
          totalPage: that.pageCount2,
          callback: function (current) {
            that.pageNo2 = current;
            that.pagenumber2(that.pageNo2)
          }
        });
      }, function (err) {
        console.log(err);
      }
    );
  }
  public appkey: any;
  appclick(){
    let that = this;
    let obj = JSON.parse($('input[name=appmsg]').val())
    // console.log(obj.id)
    let url = `/api/v1/auth-manager/auth/app/desc/${obj.id}`
    this.http.get(url).subscribe(function(data){
      if(data['code']==200){
        that.appkey = data['data'].key
        that.appDesc(that.appkey)
      }
    }),err=>{}
  }
  public rolelist = []
  public test:any;
  public appKey:any;
  appDesc(app){
    let that = this;
    that.appKey = app
    let url = `/api/v1/auth-manager/auth/role/list-role-byApp?pageNo=`+that.pageNo3+'&pageSize='+10+'&app='+app+'&group='+that.userKey
    this.http.get(url).subscribe(function(data){
      if(data['code']==200){
        that.rolelist=data['data'].list;
        that.pageNo3 = data['data'].pageNo;
        that.pageCount3 = data['data'].pageCount;
        $("#pagination3").pagination({
          currentPage: that.pageNo3,
          totalPage: that.pageCount3,
          callback: function (current) {
            that.pageNo3 = current;
            that.pagenumber3(that.pageNo3);
          }
        });
      }
    })
    // let allotUrl = `/api/v1/auth-manager/auth/app/valid-list?app=`+app
    // this.http.get(allotUrl).subscribe(function(data){
    //   console.log(data)
    // })

  }
  // test1(){
  //   let that = this;
  //   console.log(that.lists)
  //   console.log(that.rolelist)
  //   for(let i=0;i<that.lists.length;i++){
  //     for(let j=0;j<that.rolelist.length;j++){
  //       if(that.lists[i].key==that.rolelist[j].key){
  //         that.test=true;
  //       }else{
  //         that.test=false;
  //       }
  //     }
  //   }
  //   console.log(that.test)
  // }

  // 选择下拉数据是获取id
  public optionId: any;
  public optionUsername: any;

  public optionUsername1



  // 操作弹框
  operation(id, status) {
    this.message = "";
    this.status = "";
    this.groupId = "";
    $("#myModal").modal('show');
    if (status == 'true') {
      this.message = "确定启用该用户分组"
    } else if (status == 'false') {
      this.message = "确定禁用该用户分组"
    } else if(status == 'del'){
      this.message = "确定删除该用户分组"
    }
    this.status = status;
    this.groupId = id;
  }
  public groupKey:any;
  public status2:any;
  public message2:any;

  operation2(key,uid,status){
    console.log(this.userKey)
    $("#myModal5").modal('show');
    if(status == 'addrole'){
      this.message2 = '确定关联该角色';
    }else if (status == 'delrole'){
      this.message2 = '确定移除该角色'
    }else if (status == 'adduser'){
      this.message2 = '确定关联该用户'
    }else if(status == 'deluser'){
      this.message2 = '确定移除该用户'
    }
    this.groupKey = key;
    this.status2 = status;
    this.uid = uid
  }
  // 确定是否操作该操作
  subStatus() {
    let that = this;
    let url = '';
    if (that.status == 'true') {
      let obj = {
        "enabled": true,
        "id": that.groupId
      }
      url = `/api/v1/auth-manager/auth/group/save-or-update`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg=data['desc'];
            that.isHint=true;
            setTimeout(function(){
              $("#myModal").modal('hide');
              that.pagenumber(that.pageNo);
              that.hintMsg='';
              that.isHint=false;
            },1000)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000)

          }
        }, function (err) {
          console.log(err)
        }
      )
    } else if (that.status == 'false') {
      let obj = {
        "enabled": false,
        "id": that.groupId
      }
      url = `/api/v1/auth-manager/auth/group/save-or-update`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg=data['desc'];
            that.isHint=true;
            setTimeout(function(){
              $("#myModal").modal('hide');
              that.pagenumber(that.pageNo);
              that.hintMsg='';
              that.isHint=false;
            },1000)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000)
          }
        }, function (err) {
          console.log(err)
        }
      )
    }else if(that.status == 'del'){
      let url = `/api/v1/auth-manager/auth/group/del-group?groupId=`+that.groupId

      this.http.delete(url).subscribe(function(data){
        if (data['code'] == 200) {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            $("#myModal").modal('hide');
            that.pagenumber(that.pageNo);
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }else{
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }

      }),err=>{}
    }
  }
  subStatus2(){
    let that = this;

    if(that.status2 == 'addrole'){
      // 添加分配角色
      let url = '/api/v1/auth-manager/auth/group/add-group-role'
      let obj = {
        'group':that.userKey,
        'roles':[
          that.groupKey
        ]
      }
      this.http.post(url,obj).subscribe(function(data){

        if(data['code']==200){
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;
            $('#myModal5').modal('hide')
            that.appDesc(that.appkey)
          },1000)
        }else{
          $('#myModal5').modal('hide');
          $("#myModal4").modal('show');
          that.message = data['desc'];
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;
          },1500)
        }
      })
    }else if (that.status2 == 'delrole'){
      // 删除分配角色
      let url = '/api/v1/auth-manager/auth/group/del-group-role?group='+that.userKey+'&role='+that.groupKey

      this.http.delete(url).subscribe(function(data){
        if(data['code']==200){

          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg=data['desc'];
            that.isHint=false;
            $('#myModal5').modal('hide')
            that.appDesc(that.appkey)
          },1000)
        }else{
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg=data['desc'];
            that.isHint=false;
          },1500)
        }
      })
    }else if(that.status2 == 'adduser'){
      let url = `/api/v1/auth-manager/auth/group/add-user-group`
      let obj = {
        key : that.key,
        uids : [
          that.uid
        ]
      }
      this.http.post(url,obj).subscribe(function(data){
        if(data['code']==200){
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;
            that.userDept();
            $('#myModal5').modal('hide')
          },1000)
        }else{
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;
          },1000)
        }
      })
    }else if(that.status2 == 'deluser'){
      let url = `/api/v1/auth-manager/auth/group/del-user-group?uid=`+that.uid+'&group='+that.key
      this.http.delete(url).subscribe(function(data){
        if(data['code']==200){
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;
            $('#myModal5').modal('hide');
            that.userDept();
          },1000)
        }else{
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.hintMsg='';
            that.isHint=false;

          },1000)
        }
      })
    }
  }
  public linklist = {}
  sure() {
    var list = {}
    let that = this;
    if (!this.grouplist.length) {
      this.resultList = [];
      this.tagValue.forEach(item => {
        this.userList.forEach((v, i) => {
          if (v.name == item) {
            that.resultList.push(v.uid)
          }
        })
      })
    } else {
      this.tagValue.forEach(item => {
        this.grouplist.forEach((v, i) => {
          if (v.username == item) {
            that.resultList.push(v.uid)
          }
        })
      })
    }
    // console.log(this.resultList,3)
    list = {
      "key": that.key,
      "uids": []
    }
    list['uids'] = that.resultList;
    that.linklist = list
    let url = '/api/v1/auth-manager/auth/group/add-user-group'
    this.http.post(url, that.linklist).subscribe(
      function (data) {
        if (data['code'] == 200) {
          // this.resultList = [];
          // console.log(data)
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            $('.scieen').hide()
          }, 1000)

          // console.log(this.resultList,5)
        } else {
          $('.scieen').hide()
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            $('.scieen').hide()

          }, 1500)
        }
      }, function (err) {
        console.log(err)
      }
    )

  }

  toRight() {
    if (!$("#select-left option").is(":selected")) {
      alert("请选择移动的选项");
    } else {
      $("#select-left option:selected").appendTo("#select-right");
    }
  }
  toLeft() {
    if (this.treeId == null || this.treeId == 1) {
      alert("请选择部门")
    } else {
      if (!$("#select-right option").is(":selected")) {
        alert("请选择移动的选项");
      } else {
        $("#select-right option:selected").appendTo("#select-left");
      }
    }
  }
  cancel() {
    $('.scieen').hide()
  }
  scieen(){
    this.cancel();
  }
  public lists=[]
  public selectList=[]
  public userKey:any;
  allot(key){
    let that=this;
    that.userKey=key
    // let url = `/api/v1/auth-manager/auth/group/list-role-byGroup?group=${key}`
    // this.http.get(url).subscribe(
    //   function(data){
    //     that.lists=data['data']
    //   }
    // )
    // let selectUrl = `/api/v1/auth-manager/auth/role/valid-list`
    // this.http.get(selectUrl).subscribe(
    //   function(data){
    //     that.selectList=data['data']
    //   }
    // )
    let treeUrl = `/api/v1/auth-manager/auth/app/valid-list`
    this.http.get(treeUrl).subscribe(function(data){
      if(data['code']==200){
        that.appZtree=data['data']
        for (let i = 0; i < that.appZtree.length; i++) {
          if (!that.appZtree[i].pId) {
            that.appZtree[i].open = true;
          }
        }
        $.fn.zTree.init($('#appZtree'), that.appSetting, that.appZtree);
        that.appDesc(0);
      }else{
        that.hintMsg=data['desc'];
        that.isHint=true;
        setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
        })
      }
    })

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
    else{
      this.lists.push(
        {
          key: $('#selectTag option:selected ').val(),
          name: $('#selectTag option:selected').text(),
        }
      )
    }
  }
  cancel1(key) {
    let that = this;
    $('#tbody tr .btn').on('click', function () {
      $(this).parent().parent().remove()
    })
    this.lists.map((item, index) => {
      if (item.key == key) {
        that.lists.splice(index, 1)
      }
    })
  }

  add() {
    let that = this;
    let key = [];
    $.each($('input[name="unallot"]:checked'),function(){
      // console.log($(this).val())
      key.push(
        $(this).val()
      )
    })
    let url = `/api/v1/auth-manager/auth/group/add-group-role`
    let obj = {
      groupRoles:key,
      key: that.userKey
    }
    this.http.post(url,obj).subscribe(function(data){
      console.log(data)
    })
    // let that = this;
    // let groupRoles=[]
    // let url = `/api/v1/auth-manager/auth/group/add-group-role`
    // let arry = new Array();
    // that.lists.map((item, index) => {
    //   arry.push(
    //     item.key,
    //   )
    // })
    // groupRoles.push(
    //   that.userKey
    // )

    // var addList = {
    //   groupRoles:arry,
    //   key: that.userKey
    // }

    // this.http.post(url, addList).subscribe(
    //   function (data) {
    //     if(data['code']==200){
    //       that.isHint=true;
    //       that.hintMsg=data['desc'];

    //       setTimeout(function(){
    //         that.isHint=false;
    //         that.hintMsg='';
    //         $("#myModal2").modal('hide');
    //       },1500)
    //     }else{
    //       $("#myModal4").modal('show');
    //       that.message=data['desc'];
    //     }
    //   },function(err){
    //     console.log(err)
    //   }
    // )
  }
}
