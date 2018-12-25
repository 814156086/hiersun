import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { HttpHeaders } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  formModel: FormGroup;
  public ztree;//用户列表左侧树
  public ztree2; //添加用户的部门树状图
  public ztree3; //编辑用户的部门树状图
  public editUserId: any;//修改用户的    id
  public password: any;//密码非空的校验
  public name: any;//name非空的校验
  public treenum = 0;//选择部门的状态
  public publicUrl = `/api/v1/auth-manager/auth/user/user-dept-list`//公共URL地址
  public authGroupList1 = [];//提交修改时用于存储key值的数组
  public authRoleList1 = [];//提交修改时用于存储key值的数组
  public tree: any;//树状图的状态
  public dutyList = [];//有效职位列表
  public groupList = [];//有效用户组列表
  public groupList2 = [];//有效用户组列表
  public message: any;//提示语
  public status = "";//判断状态是启用还是禁用
  public artContentId: any;//操作id
  public uid: any;//用户uid
  public authGroupList = [];//获取的key
  public authRoleList = [];
  public dutyId: any;//部门id
  public dutyname: any;//部门名称
  public counter = 0;
  public groupnumber = 0;
  public dept2Id: any;//第三个数的id
  public add2Id: any;//第二个数的id
  public deptList = [];//根据树的id获取的列表
  public ztreename = [];
  public dutylist = [];
  public addztreename = [];
  public userid: any;//用户id
  public pageCount: any;
  public scope: any;//根据scope值判断是否需要添加用户字段
  public pId: any;//pId
  public list1 = [];//部门组织信息列表
  public id: any;//id
  public pageNo = 1;
  public cList = [];//部门子类信息列表
  public editList = [];//修改列表
  public addId: any;
  public addid: any;
  public ztreeType = 1;
  public resetId: any;// 重置密码的列表id
  public deptId = '';//部门id
  public roleList: any;
  public roleList2: any;
  isHint = false;
  public mobile: any;
  public email: any;
  public appztree: any;
  public appztree2: any;
  public date: any;
  hintMsg: any;
  public editztree: any;
  public dutyztree: any;
  public linkztree: any;

  // 添加门店
  public listOfAddStoreValue: any;
  public addstoreList: any;

  // 添加渠道
  public listOfAddChannelValue: any;
  public addchannelList: any;

  // 添加品牌
  public listOfAddBrandValue: any;
  public addbrandList: any;


  // 修改门店
  public listOfEditStoreValue: any;
  public listOfEditStoreValue1: any;
  public editstoreList: any;

  // 修改渠道
  public listOfEditChannelValue: any;
  public listOfEditChannelValue1: any;
  public editchannelList

  // 修改品牌
  public listOfEditBrandValue: any;
  public listOfEditBrandValue1: any;
  public editbrandList: any;


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  //首页
  setting1 = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.ztreeClick
    }
  };
  // 添加
  setting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.ztreeClick2
    }
  };
  // 编辑
  setting3 = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.ztreeClick3
    }
  };



  appsetting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.appClick
    }
  };
  appsetting2={
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.appClick2
    }
  }

  editsetting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.editClick
    }
  }
  dutySetting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      onClick: this.dutyClick
    }
  }
  linksetting = {
    data:{
      simpleData:{
        enable:true
      }
    },
    callback:{
      onClick : this.linkClick
    }
  }

  public listOfSelectedValue = [];
  public listOfSelectedValue2 = [];
  public editRoleValue = [];
  editRoleValue1 = [];
  editGroupValue = [];
  username = '';
  enames: any;
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) {

    this.formModel = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      uid: ['', [Validators.required]],
      ename: ['', [Validators.required]],
      mobile: ['', this.mobileValidator],
      email: ['', this.emailValidator],
      passwordsGroup: fb.group({
        password: ['', Validators.minLength(6)],
        pconfirm: ['']
      }, { validator: this.equalValidator })
    })
  }
  // 手机号校验
  mobileValidator(control: FormControl): any {
    const mobileReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    const result = mobileReg.test(control.value);
    return result ? null : { mobile: { info: '请输入正确的手机号' } };
  }
  // 邮箱校验
  emailValidator(control: FormControl): any {
    const emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;;
    const result = emailReg.test(control.value);
    return result ? null : { email: { info: '请输入正确的邮箱' } };
  }
  equalValidator(group: FormGroup): any {
    let password: FormControl = group.get("password") as FormControl;
    let pconfirm: FormControl = group.get("pconfirm") as FormControl;
    let valid: boolean = false;
    if (password && pconfirm) {
      valid = (password.value === pconfirm.value);
    }
    return valid ? null : { equal: { descxxx: "密码和确认密码不匹配" } };
  }
  ngOnInit() {
    $('.partload').show()
    let that = this;
    let ztreeUrl = `/api/v1/auth-manager/auth/user/user-dept`;
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        console.log(data)
        if (data['code'] == 200) {
          setTimeout(function () {
            $('.partload').hide()
          }, 200)
          that.scope = data['data'].scope
          data['data'].scope = 1
          if (data['data'].scope == 1) {
            that.userid = 1
          } else if (data['data'].scope == 2) {
            that.userid = 1
          }
          else if (data['data'].scope == 3) {
            that.userid = 1
          }
          else if (data['data'].scope == 4) {
            that.userid = 0
          }
          that.ztree = data['data'].list;
          for (let i = 0; i < that.ztree.length; i++) {
            if (!that.ztree[i].pId) {
              that.ztree[i].open = true
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting1, that.ztree)
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
    this.chidlList(this.pId)
  }
  pagenumber(pagenumber) {
    let that = this;
    let url = that.publicUrl + `?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&deptId=' + this.deptId + '&scope=' + this.scope;
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.cList = data['data'].list;
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
  reloadPage() {
    let that = this;
    $('.partload').show()
    setTimeout(function () {
      that.ngOnInit()
      $('.partload').hide()
      that.isHint = true
      that.hintMsg = '加载完毕'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = ''
      }, 800)
    }, 1000)
  }
  chidlList(pId) {
    let that = this;
    that.cList = []
    let cUrl = that.publicUrl + `?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&deptId=' + this.deptId + '&scope=' + that.scope;
    this.http.get(cUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.cList = data['data'].list
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
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }
    )
  }
  // 对树操作的本地事件
  myclick() {
    let that = this;
    let obj = JSON.parse($('input[name=mymsg]').val());
    // 当选中根节点时，不显示添加用户按钮
    if (obj.id == 0) {
      that.userid = 0
    } else {
      that.userid = that.scope
    }
    this.deptId = obj.id
    that.chidlList(obj.id)
    that.treenum = 1
    that.addId = obj.id
    $.fn.zTree.init($("#treeDemo"), that.setting3, that.deptList);
    that.ztree.map((item, index) => {
      if (obj.id == item.id) {
        that.ztreename = ([{
          id: item.id,
          name: item.name
        }])
        that.addztreename = (
          [
            {
              id: item.id,
              name: item.name
            }
          ]
        )
      }
    })
    let url = that.publicUrl + `?pageNo=` + that.pageNo + '&pageSize=' + 10 + '&deptId=' + obj.id + '&scope=' + that.scope;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
        } else {
          that.isHint = true;
          that.hintMsg = data['desc']
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "5"
          }, 1000)
        }
      }, function (err) {
        console.log(err)
      }
    )
  }
  // myclick3() {
  //   this.dutylist=(
  //     [
  //       {
  //         name: '请选择职位'
  //       }
  //     ]
  //   )
  //   let that = this;
  //   let obj3 = JSON.parse($('input[name=mymsg3]').val());
  //   that.dept2Id = obj3.id
  //   that.add2Id = obj3.id
  //   let cUrl = that.publicUrl + `?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&deptId=' + obj3.id + '&scope=' + that.scope;
  //   this.http.get(cUrl).subscribe(
  //     function (data) {
  //       if (data['code'] == 200) {
  //         that.deptList = data['data'].list
  //         $('#deptTree').hide()
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
  //   // that.ztree3.map((item, index) => {
  //   //   if (item.id == obj3.id) {
  //   //     that.ztreename = (
  //   //       [
  //   //         {
  //   //           id: item.id,
  //   //           name: item.name
  //   //         }
  //   //       ]
  //   //     )
  //   //   }
  //   // })
  //   // let url = `/api/v1/auth-manager/auth/duty/tree-list?deptId=` + obj3.id
  //   // this.http.get(url).subscribe(function (data) {
  //   //   if (data['code'] == 200) {
  //   //     that.dutyList = data['data']
  //   //   }
  //   // })
  //   this.dutytree(obj3.id)
   
  // }
  linkGroup() {
    let that = this;
    this.counter++ % 2 ?
      (function () {
        that.groupnumber = 0;
      }()) :
      (function () {
        that.groupnumber = 1;
      }());
  }
  cmyclick() {
    let that = this;
    let obj = JSON.parse($('input[name=cmymsg]').val());
    let cUrl = that.publicUrl + `?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&deptId=' + obj.id + '&scope=' + that.scope;
    this.http.get(cUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.cList = data['data'].list
          that.addId = data['data'].list.id
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
  // 树的点击事件
  ztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('input[name="cmymsg"]').val(obj);
    $('.myclick').click();
    $('.cmyclick').click();
  }
  ztreeClick2(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg2"]').val(obj);
    $('.myclick2').click();
  }
  ztreeClick3(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg3"]').val(obj);
    $('.myclick3').click();
  }
  editId: any;
  loadGroupList() {
    var that = this;
    //有效用户组
    let groupUrl = `/api/v1/auth-manager/auth/group/valid-list`
    this.http.get(groupUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.groupList = data['data']
          that.groupList2 = data['data']
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
  public enabled: any;
  public synStatus: any;
  public editstart: any;
  public editend: any;
  public groupKey:any;
  edit(id, dutyname,key) {
    this.groupKey=key;
    this.loadGroupList();
    this.editGroupValue = [];
    this.treenum = 0;
    let that = this;
    $('.scieen').show();
    $("#myModal1").modal('show');
    $('.modal-backdrop').hide();
    var editGroupValue = [];
    var editRoleValue = [];
    this.editId = id
    let url = `/api/v1/auth-manager/auth/user/desc/${id}`;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.editdeptId = data['data'].deptId;
          that.ztreename = (
            [
              {
                id: data['data'].deptId,
                name: data['data'].deptName
              }
            ]
          )
          that.dutylist = (
            [
              {
                id: data['data'].dutyId,
                name: data['data'].dutyName
              }
            ]
          )
          that.editList = [data['data']]
          that.editUserId = data['data'].id
          that.uid = data['data'].uid
          that.dutyId = data['data'].dutyId
          that.enames = data['data'].name
          that.dutyname = data['data'].dutyname
          that.enabled = data['data'].enabled
          that.synStatus = data['data'].synStatus
          that.mobile = data['data'].mobile
          that.email = data['data'].email
          let authGroupList = data['data'].authGroupList
          let authRoleList = data['data'].authRoleList
          that.authRoleList1 = data['data'].authRoleList
          that.startDate = data['data'].startTime
          that.endDate = data['data'].endTime
          that.dutytree(data['data'].deptId)
          authGroupList.forEach(item => {
            editGroupValue.push(
              item.key
            )
          });
          that.editGroupValue = editGroupValue

          authRoleList.forEach(item => {
            editRoleValue.push(
              item.key
            )
          });
          that.editRoleValue = editRoleValue
          that.dutyList.map((item, i) => {
            if (item.id == that.dutyId) {
            }
          })
          that.authGroupList1 = []
          // 修改门店回显
          let store = []
          data['data'].storeList.map((item, index) => {
            store.push(
              item
            )
          })
          that.listOfEditStoreValue = store;

          // 修改品牌回显
          let brand = []
          data['data'].brandList.map((item, index) => {
            brand.push(
              item
            )
          })
          that.listOfEditBrandValue = brand
          // 修改渠道回显
          let channel = []
          data['data'].channelList.map((item, index) => {
            channel.push(
              item
            )
          })
          that.listOfEditChannelValue = channel
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
        if (data['data'].dutyname == '' || data['data'].dutyname == null) {
          $('#Eduty').attr('value', '0 ')
        }
      }
    )
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.groupList2 = children;
    let ztreeUrl = `/api/v1/auth-manager/auth/user/user-dept`
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.ztree3 = data['data'].list
          for (let i = 0; i < that.ztree3.length; i++) {
            if (!that.ztree3[i].pId) {
              that.ztree3[i].open = true;
            }
          }
          $.fn.zTree.init($('#ztree3'), that.setting3, that.ztree3);
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
    let brandUrl = `/pcm-inner/brands`
    this.http.get(brandUrl, this.httpOptions).subscribe(function (data) {

      if (data['code'] == 200) {
        // that.addbrandList=data['data']
        let key = JSON.parse(JSON.stringify(data['data']).replace(/brandSid/g, "key"))
        let name = JSON.parse(JSON.stringify(key).replace(/brandName/g, "name"))
        that.editbrandList = name
      }
    }), err => { }
    let storeUrl = '/pcm-admin/stores/all';
    let obj = {}
    this.http.post(storeUrl, obj, this.httpOptions).subscribe(function (data) {

      if (data['code'] == 200) {
        let key = JSON.parse(JSON.stringify(data['data']).replace(/organizationCode/g, "key"))
        let name = JSON.parse(JSON.stringify(key).replace(/organizationName/g, "name"))
        that.editstoreList = name
      }
    }), err => { }
    let channeUrl = `/pcm-inner/channels`
    this.http.get(channeUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        let key = JSON.parse(JSON.stringify(data['data']).replace(/channelCode/g, "key"))
        let name = JSON.parse(JSON.stringify(key).replace(/channelName/g, "name"))
        that.editchannelList = name
      }
    }),err=>{}
    let treeUrl = '/api/v1/auth-manager/auth/app/valid-list';
    this.http.get(treeUrl).subscribe(function(data){
      if (data['code'] == 200) {
        setTimeout(function () {
          $('.partload').hide()
        }, 200)
        that.appztree2 = data['data'];
        console.log(that.appztree2)
        for (let i = 0; i < that.appztree2.length; i++) {
          if (!that.appztree2[i].pId) {
            that.appztree2[i].open = true
          }
        }
        $.fn.zTree.init($('#appztree2'), that.appsetting2, that.appztree2)
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
  operation(id, status) {
    this.message = "";
    this.status = "";
    this.artContentId = "";
    $('#myModal').modal('show');
    if (status == 'true') {
      this.message = "确定启用该用户分组";
    } else if (status == 'false') {
      this.message = "确定禁用该用户分组"
    }
    this.status = status;
    this.artContentId = id;
  }
  reset(id) {
    // 给重置密码列表的id赋值
    this.resetId = id
  }
  myclick2() {
    let that = this;
    that.treenum = 1
    let obj2 = JSON.parse($('input[name=mymsg2]').val());
    that.dept2Id = obj2.id
    that.add2Id = obj2.id
    let cUrl = that.publicUrl + `?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&deptId=' + obj2.id + '&scope=' + that.scope;
    this.http.get(cUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.deptList = data['data'].list
          $('#deptTree2').hide()
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
    that.ztree2.map((item, index) => {
      if (item.id == obj2.id) {
        that.ztreename = (
          [
            {
              id: item.id,
              name: item.name
            }
          ]
        )
        that.addztreename = (
          [
            {
              id: item.id,
              name: item.name
            }
          ]
        )
      }
    })
    that.editdeptId = obj2.id
  }
  public editdeptId: any;
  dutytree(id) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/duty/tree-list?deptId=` + id
    this.http.get(url).subscribe(function (data) {
      that.dutyztree=data['data']
      $.fn.zTree.init($('#dutyztree'), that.dutySetting, that.dutyztree);
    })
  }
  add() {
    let that = this;
    that.ztreename = []
    that.clearValue()
    $("#addModal").modal('show');
    $('.modal-backdrop').hide();
    $('.scieen').show();
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.groupList = children;
    //有效用户组
    that.loadGroupList()
    this.listOfSelectedValue = []
    this.listOfSelectedValue2 = []
    let treeUrl = '/api/v1/auth-manager/auth/app/valid-list';
    this.http.get(treeUrl).subscribe(function (data) {
      if (data['code'] == 200) {
        setTimeout(function () {
          $('.partload').hide()
        }, 200)
        that.appztree = data['data'];
        for (let i = 0; i < that.appztree.length; i++) {
          if (!that.appztree[i].pId) {
            that.appztree[i].open = true
          }
        }
        $.fn.zTree.init($('#appztree'), that.appsetting, that.appztree)
      } else {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    })
    let brandUrl = `/pcm-inner/brands`
    this.http.get(brandUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        that.addbrandList = data['data']
      }
    }), err => { }
    let storeUrl = '/pcm-admin/stores/all';
    let obj = {}
    this.http.post(storeUrl, obj, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        that.addstoreList = data['data']
      }
    }), err => { }
    let channeUrl = `/pcm-inner/channels`
    this.http.get(channeUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        that.addchannelList = data['data']
      }
    }), err => { }
  }
  cancel() {
    $('.scieen').hide()
    $('#myModal1').modal('hide')
    this.listOfSelectedValue = []
    this.listOfSelectedValue2 = []
    this.clearValue()
  }
  choose() {
    this.tree = true;
  }
  chooses() {
    this.tree = false;
  }
  //  重置密码确定
  subStatus() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/user/repeat-password`
    let obj = {
      "id": that.resetId,
      'password': $('#reset').val()
    }
    this.http.post(url, obj).subscribe(
      function (data) {
        if (data['code'] == 200) {
          $('#resetModal').modal('hide')
          $('#reset').attr('value', '')
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
  sure() {
    let that = this;
    let url = '';
    // 如果状态为禁用
    if (that.status == 'true') {
      let obj = {
        "enabled": 1,
        "id": that.artContentId
      }
      url = `/api/v1/auth-manager/auth/user/operation`
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = "";
              that.chidlList(that.deptId)
              $("#myModal").modal('hide');
            }, 1000)
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
      // 如果状态为启用
    } else if (that.status == 'false') {
      let obj = {
        "enabled": 0,
        "id": that.artContentId
      }
      url = `/api/v1/auth-manager/auth/user/operation`
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $("#myModal").modal('hide');
              that.chidlList(that.deptId)
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
    }
  }
  // addsure() {
  //   let that = this;
  //   if ($('#username').val() == '' || $('#password').val() == '' || $('#name').val() == '' || $('#deptID2').text() == '') {
  //     that.isHint = true;
  //     that.hintMsg = "请输入必填项"
  //     setTimeout(function () {
  //       that.isHint = false;
  //       that.hintMsg = '';
  //     }, 1500)
  //   } else {
  //     let url1 = `/api/v1/auth-manager/auth/user/check-username?username=` + $('#username').val();
  //     this.http.get(url1).subscribe(
  //       function (data) {
  //         if (data['code'] == 200) {
  //           if (data['data']) {
  //             that.isHint = true;
  //             that.hintMsg = "用户名不能重复！";
  //             setTimeout(function () {
  //               that.isHint = false;
  //               that.hintMsg = '';
  //             }, 1500)
  //           } else {
  //             let url = `/api/v1/auth-manager/auth/user/save-or-update`;
  //             that.listOfSelectedValue.map((item, index) => {
  //               that.authGroupList.push(
  //                 {
  //                   'key': item
  //                 }
  //               )
  //             })
  //             that.listOfSelectedValue2.map((item, index) => {
  //               that.authRoleList.push(
  //                 item
  //               )
  //             })
  //             // 数据权限数据
  //             let stroelist = [];
  //             let brandlist = [];
  //             let channellist = [];
  //             that.listOfAddStoreValue.map((item, index) => {
  //               stroelist.push(
  //                 item
  //               )
  //             });
  //             that.listOfAddBrandValue.map((item, index) => {
  //               brandlist.push(
  //                 item
  //               )
  //             });
  //             that.listOfAddChannelValue.map((item, index) => {
  //               channellist.push(
  //                 item
  //               )
  //             });
  //             let obj = {
  //               "authGroupList": that.authGroupList,
  //               "roles": that.authRoleList,
  //               "deptId": that.dept2Id, // 调接口  树状图  部门id  默认显示选中
  //               "dutyId": $('#duty option:selected').val(),
  //               "email": $('#email').val(),
  //               "enabled": $("input[name='enabled']:checked").val(),
  //               "mobile": $('#mobile').val(),
  //               "name": $('#name').val(),
  //               "password": $('#password').val(),
  //               "username": $('#username').val(),
  //               "storeList": stroelist,
  //               "brandList": brandlist,
  //               "channelList": channellist,
  //               "employeeId": $('#employee').val(),
  //               "startTime": $('#startdate input').val(),
  //               "endTime": $('#enddate input').val()
  //             }
  //             that.http.post(url, obj).subscribe(
  //               function (data) {
  //                 if (data['code'] == 200) {
  //                   that.isHint = true;
  //                   that.hintMsg = "修改用户信息成功！";
  //                   setTimeout(function () {
  //                     that.isHint = false;
  //                     that.hintMsg = '';
  //                     $('#addModal').modal('hide');
  //                     $('.scieen').hide();
  //                     $('input').empty();
  //                     that.clearValue();
  //                     that.tabs = 1;
  //                   }, 1500)
  //                 } else {
  //                   $("#myModal4").modal('show');
  //                   that.message = data['desc'];
  //                 }
  //               }
  //             )
  //           }
  //         } else {
  //           that.isHint = true;
  //           that.hintMsg = data['desc']
  //           setTimeout(function () {
  //             that.isHint = false;
  //             that.hintMsg = "";
  //           }, 1000)
  //         }
  //       }
  //     )
  //   }
  // }
  scieen() {
    this.cancel()
    $('#addModal').hide()
    $('.modal-backdrop').hide();
  }
  tab(id) {
    $('#deptTree').toggle()
  }
  chooseduty() {
    $('#dutyTree').toggle()
  }
  tab2(id) {
    let that = this;
    $('#deptTree2').toggle()
    let ztreeUrl = `/api/v1/auth-manager/auth/user/user-dept`
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.ztree2 = data['data'].list
          for (let i = 0; i < that.ztree2.length; i++) {
            if (!that.ztree2[i].pId) {
              that.ztree2[i].open = true
            }
          }
          $.fn.zTree.init($('#ztree2'), that.setting, that.ztree2)
        }
      }, err => { }
    )
  }
  editSure() {
    let that = this;
    if ($('#Ename').val() == '') {
      that.isHint = true;
      that.hintMsg = '请输入必填项'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
    } else {
      let url1 = `/api/v1/auth-manager/auth/user/check-username?username=` + $('#username').val() + `&userId=` + that.editId;
      this.http.get(url1).subscribe(
        function (data) {
          if (data['code'] == 200) {
            if (data['data']) {
              that.isHint = true;
              that.hintMsg = "用户名不能重复！";
              setTimeout(function () {
                that.isHint = false;
                that.hintMsg = '';
                $('#addModal').modal('hide')
                $('.scieen').hide()
                $('input').empty()
              }, 1500)
            } else {
              let editUrl = `/api/v1/auth-manager/auth/user/save-or-update`;
              let authGroupList1 = []
              let authRoleList1 = []
              that.editGroupValue.map((item, index) => {
                authGroupList1.push(
                  {
                    'key': item
                  }
                )
                that.authGroupList1 = authGroupList1
              })
              that.editRoleValue.map((item, index) => {
                authRoleList1.push(
                  item
                )
                that.authRoleList1 = authRoleList1
              })
              // 门店
              let listOfEditStoreValue =[]
              that.listOfEditStoreValue.map((item,index)=>{
                listOfEditStoreValue.push(
                  item
                )
                that.listOfEditStoreValue1=listOfEditStoreValue
              })
              // 品牌
              let listOfEditBrandValue = [];
              that.listOfEditBrandValue.map((item,index)=>{
                listOfEditBrandValue.push(
                  item
                )
                that.listOfEditBrandValue1=listOfEditBrandValue
              })
              // 渠道
              let listOfEditChannelValue = [];
              that.listOfEditChannelValue.map((item,index)=>{
                listOfEditChannelValue.push(
                  item
                )
                that.listOfEditChannelValue1=listOfEditChannelValue
              })
              let obj = {
                "authGroupList": that.authGroupList1,
                "authRoleList": that.authRoleList1,
                "deptId": $('#EId').val(),//调接口  树状图  部门id  默认显示选中
                "dutyId": $('#Eduty option:selected').val(),
                "email": $('#Eemail').val(),
                "enabled": $("input[name='Eenabled']:checked").val(),
                "mobile": $('#Emobile').val(),
                "name": $('#Ename').val(),
                "username": $('#Eusername').val(),
                "uid": that.uid,
                "id": that.editUserId,
                'employeeId': $("#editemployee").val(),
                "endTime": $("#editenddate input").val(),
                "startTime": $("#editstartdate input").val(),
                "storeList":that.listOfEditStoreValue1,
                "brandList":that.listOfEditBrandValue1,
                "channelList":that.listOfEditChannelValue1
              }
              console.log(obj)
              that.http.post(editUrl, obj).subscribe(
                function (data) {
                  if (data['code'] == 200) {
                    $('.scieen').hide()
                    $('#myModal1').modal('hide')
                    that.isHint = true;
                    that.hintMsg = "修改用户信息成功！";
                    that.chidlList(that.pId)
                    setTimeout(function () {
                      that.isHint = false;
                      that.hintMsg = '';
                      that.tabb = 1
                    }, 1500)
                  } else {
                    $("#myModal4").modal('show');
                    that.message = data['desc'];
                  }
                }
              )
            }
          } else {
            that.isHint = true;
            that.hintMsg = data['desc']
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = "";
            }, 1000)
          }
        }
      )
    }
  }
  search() {
    let that = this;
    let username = $('#searchname').val()
    let url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=` + 1 + '&pageSize=' + 10 + '&username=' + username
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.cList = data['data'].list
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
          that.hintMsg = "";
        }, 1000)
      }
    })
  }
  search2() {
    let that = this;
    let username = $('#searchname').val()
    let url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=` + 1 + '&pageSize=' + 10 + '&username=' + username + '&deptId=' + that.deptId
    if (that.deptId == '') {
      that.hintMsg = '请选择部门后查询';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      this.http.get(url).subscribe(function (data) {
        if (data['code'] == 200) {
          that.cList = data['data'].list;
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
            that.hintMsg = "";
          }, 1000)
        }
      })
    }
  }
  request() {
    $('#searchname').attr('value', '');
  }
  request2() {
    $('#searchname2').attr('value', '');
  }
  pagenumber1(pagenumber) {
    let that = this;
    let username = $('#searchname').val()
    let url = ''
    if (that.deptId == '' || that.deptId == null) {
      url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=` + pagenumber + '&pageSize=' + 10 + '&username=' + username
    } else {
      url = `/api/v1/auth-manager/auth/user/user-dept-list?pageNo=` + pagenumber + '&pageSize=' + 10 + '&username=' + username + '&deptId=' + that.deptId
    }
    this.http.get(url).subscribe(function (data) {
      that.cList = data['data'].list
    })
  }
  appClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="appmsg"]').val(obj);
    $('.appclick').click();
  }
  appClick2(event, treeId, treeNode){
    let obj = JSON.stringify(treeNode);
    $('input[name="appmsg2"]').val(obj);
    $('.appclick2').click();
  }

  editClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="editmsg"]').val(obj);
    $('.editclick').click();
  }
  dutyClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="dutymsg"]').val(obj);
    $('.dutyclick').click();
   
  }
  linkClick(event,treeId,treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="linkmsg"]').val(obj);
    $('.linkclick').click()
  }
  appclick() {
    let that = this;
    let obj = JSON.parse($('input[name=appmsg]').val());
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=` + that.pageNo + '&pageSize=' + 100 + '&app=' + obj.key
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.roleList = data['data'].list
      } else {
        that.hintMsg = data['desc'];
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1000)
      }
    })
  }
  appclick2(){
    let that = this;
    let obj = JSON.parse($('input[name=appmsg]').val());
    // roleList
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=`+that.pageNo+'&pageSize='+100+'&app='+obj.key
    this.http.get(url).subscribe(function(data){
      if(data['code']==200){
        that.roleList2=data['data'].list
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

  public tabs = 1;
  tabs1() {
    this.tabs = 1;
    $('#tab1').addClass('active')
    $('#tab2').removeClass('active')
    $('#tab3').removeClass('active')
  }
  public addusername: any;
  public code: any;
  public duty: any;
  public startdate: any;
  public enddate: any;
  tabs2() {
    this.tabs = 2;
    $('#tab1').removeClass('active')
    $('#tab2').addClass('active')
    $('#tab3').removeClass('active')
    console.log($('#username').val())
    this.addusername = $('#username').val();
    this.code = $('#employee').val()
    this.duty = $('#duty option:selected').val()
    this.startdate = $('#startdate input').val()
    this.enddate = $('#enddate input').val()
  }
  tabs3() {
    this.tabs = 3;
    $('#tab1').removeClass('active')
    $('#tab2').removeClass('active')
    $('#tab3').addClass('active')
  }
  public tabb = 1
  tabs4() {
    let that = this;
    this.tabb = 1

    $('#tab4').addClass('active')
    $('#tab5').removeClass('active')
    $('#tab6').removeClass('active')
    let ztreeUrl = `/api/v1/auth-manager/auth/user/user-dept`
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.ztree3 = data['data'].list
          for (let i = 0; i < that.ztree3.length; i++) {
            if (!that.ztree3[i].pId) {
              that.ztree3[i].open = true;
            }
          }
          $.fn.zTree.init($('#ztree3'), that.setting3, that.ztree3);
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
  tabs5() {
    this.tabb = 2
    $('#tab4').removeClass('active')
    $('#tab5').addClass('active')
    $('#tab6').removeClass('active')
  }
  tabs6() {
    this.tabb = 3
    $('#tab4').removeClass('active')
    $('#tab5').removeClass('active')
    $('#tab6').addClass('active')
  }
  clearValue() {
    $('#username').attr('value', '');
    $('#name').attr('value', '');
    $('#mobile').attr('value', '');
    $('#email').attr('value', '');
    $('#employee').attr('value', '');
  }
  public startDate: any;
  onOk(result: Date): void {
    this.startDate = result
    console.log(this.startDate);
  }
  public endDate: any;
  OnOk(result: Date): void {
    this.endDate = result
    console.log(this.endDate);
  }
  dutyclick() {
    let that = this;
    let obj = JSON.parse($('input[name=dutymsg]').val());
    console.log(obj)
    that.dutylist=([{
      id: obj.id,
      name: obj.name
    }])
    $('#dutyTree').hide()
  }
  linkclick(){
    let that = this;
    let obj = JSON.parse($('input[name=linkmsg]').val());
    let url = `/api/v1/auth-manager/auth/role/list-role-byApp?pageNo=`+this.pageNo+'&pageSize='+100+'&app='+obj.key+'&group='+this.groupKey;
    this.http.get(url).subscribe(function(data){
      if(data['code']==200){
        that.roleList2=data['data'].list
      }else{
        that.hintMsg=data['desc'];
        that.isHint=true;
        setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
        },1500)
      }
    })
  }
  auth(){
    let that  = this;
    let treeUrl = '/api/v1/auth-manager/auth/app/valid-list';
    this.http.get(treeUrl).subscribe(function (data) {
      if (data['code'] == 200) {
        that.linkztree = data['data'];
        for (let i = 0; i < that.linkztree.length; i++) {
          if (!that.linkztree[i].pId) {
            that.linkztree[i].open = true
          }
        }
        $.fn.zTree.init($('#linkztree'), that.linksetting, that.linkztree)
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

