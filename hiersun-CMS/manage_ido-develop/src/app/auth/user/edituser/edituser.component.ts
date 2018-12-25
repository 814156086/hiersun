import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';

declare var $: any;
@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})

export class EdituserComponent implements OnInit {
  isload = false;
  isHint = false;
  hintMsg: any;
  pageNo = 1;
  pagetype = 0;        //0添加1编辑
  id: any;          //编辑时传
  uid: any;          //编辑时传
  username: any;     //用户名
  name: any;         //姓名
  mobile: any;       //手机号
  email: any;        //邮箱
  employeeId: any;   //员工编号
  deptName: any;     //部门名称
  deptid: any;       //部门id
  dutyName: any;     //默认职位
  dutyList = [];      //所有部门
  startTime = '';    //起始时间
  startTimes:any;
  endTime = '';      //起始时间
  endTimes:any;
  enabled = 1;      //状态
  pwd = '';          //密码
  confirmpwd = '';    //确认密码
  roles = [];        //编辑时获取的相关用户
  groups = [];       //编辑时关联用户组的复现
  storeList = [];    //编辑时门店的复现
  brandList = [];    //编辑时品牌的复现
  channelList = [];   //编辑时渠道的复现
  industryList = [];   //编辑时分类的复现
  Nodes: any;        //部门树
  value: any;        //部门选中的值
  dutyvalue: any;
  dutyNodes: any;    //职位
  dutyid = '';       //选中的职位
  appztree: any;     //系统信息树
  appsetting: any;   //系统信息树设置
  roleList: any;     //系统信息树的点击事件
  selectList = [];    //关联角色
  selectListshow: any;  //选中的角色展示
  selectListcz: any;     //选中的角色传值
  groupList: any;    //关联用户组
  groupselect = [];   //关联用户组
  groupselectshow: any;  //选中的用户组展示
  groupselectcz: any;  //选中的用户组传值
  addstoreList = [];    //门店
  storeselect = [];     //所选门店
  storeselectshow: any;  //选中的门店展示
  storeselectcz: any;  //选中的门店传值
  addbrandList = [];    //品牌
  brandselect = [];     //所选品牌
  brandselectshow: any;   //所选品牌展示
  brandselectcz: any;   //所选品牌传值
  addchannelList = [];   //渠道
  channelselect = [];    //所选渠道
  channelselectshow: any;  //所选渠道展示
  channelselectcz: any;  //所选渠道传值
  classlistes = [];         //分类
  classlistchoose = [];     //选择分类
  classlistchooseshow: any;   //分类展示
  classlistchoosecz: any;   //分类传值
  choosedepatname: any;     //部门展示
  choosedutyname: any;      //职位展示
  expandKeys = ['100', '1001'];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  formModel: FormGroup;
  constructor(private router: Router, private common: CommonService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      that.id = data.id;
      if (that.id) {
        that.pagetype = 1;
        that.userdetailmanage();
      } else {
        that.pagetype = 0
      }
    })
    that.createTree();    //加载部门树
    that.appsetting = {
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        onClick: this.appClick
      }
    };
    $('#beginDt').datetimepicker({
      minView: "month",
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    $('#endDt').datetimepicker({
      minView: "month",
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
  }
/*   starttime() {
    let that = this;
    laydate.render({
      elem: '#beginDt',
      type: 'date',
      done: function (value) {
        that.startTime = value;
      },
    });
  }
  endtime() {
    let that = this;
    laydate.render({
      elem: '#endDt',
      type: 'date',
      done: function (value) {
        that.endTime = value;
      },
    });
  } */
  //查询详情
  userdetailmanage() {
    let that = this;
    let url = '/api/v1/auth-manager/auth/user/desc/' + that.id;
    this.http.get(url).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.username = data['data'].username;
          that.uid = data['data'].uid;
          that.name = data['data'].name;
          that.mobile = data['data'].mobile;
          that.email = data['data'].email;
          that.employeeId = data['data'].employeeId;
          that.deptName = data['data'].deptName;
          //$("#department").val(that.deptName);
          that.deptid = data['data'].deptId;
          that.dutyName = data['data'].dutyName;
          that.dutyid = data['data'].dutyId;
          //$("#dutyname").val(that.dutyName)
          that.startTime = that.formatDate(data['data'].startTime, '-');
          that.endTime = that.formatDate(data['data'].endTime, '-');
          $("#beginDt").val(that.startTime);
          $("#endDt").val(that.endTime);
          that.enabled = data['data'].enabled;
          if (that.enabled == 0) {    //禁用
            $("#status2").attr("checked", "checked")
          } else if (that.enabled == 1) {  //启用
            $("#status1").attr("checked", "checked")
          } else {//锁定
            $("#status3").attr("checked", "checked")
          }
          that.roles = data['data'].roleList;
          that.selectList= data['data'].roleList;
          that.groups = data['data'].groups;
          that.groupselect= data['data'].groups;
          that.storeList = data['data'].storeList;
          that.storeselect=data['data'].storeList;
          that.brandList = data['data'].brandList;
          that.brandselect= data['data'].brandList;
          that.channelList = data['data'].channelList;
          that.channelselect= data['data'].channelList;
          that.industryList = data['data'].industryList;
          that.classlistchoose = data['data'].industryList;
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  //部门
  createTree() {
    let that = this;
    let zNodes = []
    let url = '/api/v1/auth-manager/auth/dept/tree-list';
    this.http.get(url, this.httpOptions).subscribe(function (data) {
      console.log(data)
      zNodes = data['data'];
      zNodes.forEach((value, index) => {
        value['title'] = value.name;
        value['key'] = value.id;
      })
      let result = zNodes.reduce(function (prev, item) {
        prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
        return prev;
      }, {});
      for (let prop in result) {
        result[prop].forEach(function (item, i) {
          result[item.id] ? item.children = result[item.id] : ''
        });
        that.Nodes = result[prop]
      }
      result = result[0];
    }), err => { }
  }
  departchange($event: string): void {
    console.log($event)
    let that = this;
    that.deptid = $event;
    that.dutyName = ''
    that.creatdutytree();
  }
  //职位
  creatdutytree() {
    let that = this;
    let dutyNodeslist = [];
    let url = '/api/v1/auth-manager/auth/duty/vaild-tree-list?deptId=' + that.deptid
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        if (data['data'].length > 0) {
          dutyNodeslist = data['data'];
          dutyNodeslist.forEach((dutyvalue, index) => {
            dutyvalue['title'] = dutyvalue.name;
            dutyvalue['key'] = dutyvalue.id;
          })
          let resultduty = dutyNodeslist.reduce(function (prev, item) {
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in resultduty) {
            resultduty[prop].forEach(function (item, i) {
              resultduty[item.id] ? item.children = resultduty[item.id] : ''
            });
            that.dutyNodes = resultduty[prop]
          }
          resultduty = resultduty[0];
        }
      }
    })
  }
  onDutyChange($event: string): void {
    let that = this;
    that.dutyid = $event;
    console.log(that.dutyid)
  }
  //goback
  goback() {
    window.history.go(-1)
  }
  //系统信息
  appClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="appmsg"]').val(obj);
    $('.appclick').click();
  }
  appclick() {
    let that = this;
    let obj = JSON.parse($('input[name=appmsg]').val());
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=` + that.pageNo + '&pageSize=' + 10 + '&app=' + obj.key
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.roleList = data['data'].list
        if (that.id) {  //编辑
          for (let i = 0; i < that.roles.length; i++) {
            for (let j = 0; j < that.roleList.length; j++) {
              if (that.roles[i].key == that.roleList[j].key) {
                // key
                var hasRepeat = that.selectList.some((i, v) => i.key == that.roleList[j].key);
                if (!hasRepeat) {
                  that.selectList.push(that.roleList[j]);
                }
                
              }
            }
          }
        }
      }
    })
  }
  //tab1下一页
  tab2() {
    let that = this;
    if (that.username == "" || that.username == undefined) {
      $(".username").next(".formtips").show();
      return false;
    } else {
      $(".username").next(".formtips").hide()
    }
    if (that.name == "" || that.name == undefined) {
      $(".name").next(".formtips").show();
      return false;
    } else {
      $(".name").next(".formtips").hide()
    }
    if (!that.id) {
      if (that.pwd == "" || that.pwd == undefined) {
        $(".pwd").next(".formtips").show();
        return false;
      } else {
        if (that.pwd.length < 6) {
          $(".pwd").next(".formtips").show();
          return false;
        } else {
          $(".pwd").next(".formtips").hide()
        }
      }
      if (that.pwd != that.confirmpwd) {
        $(".confirmpwd").next(".formtips").show();
      } else {
        $(".confirmpwd").next(".formtips").hide();
      }
      if (that.value == "" || that.value == undefined) {
        $(".deptName").show();
        return false;
      } else {
        $(".deptName").hide()
      }
    }else{
      if (that.deptName == "" || that.deptName == undefined) {
        $(".deptName").show();
        return false;
      } else {
        $(".deptName").hide()
      }
    }
    var mobileReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (!mobileReg.test(that.mobile)) {
      $(".mobile").next(".formtips").show();
      return false;
    } else {
      $(".mobile").next(".formtips").hide()
    }
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!emailReg.test(that.email)) {
      $(".email").next(".formtips").show();
      return false;
    } else {
      $(".email").next(".formtips").hide()
    }
    if (that.employeeId == "" || that.employeeId == undefined) {
      $(".employeeId").next(".formtips").show();
      return false;
    } else {
      $(".employeeId").next(".formtips").hide();
    }
    
    that.startTime=$("#beginDt").val();
    that.endTime=$("#endDt").val();
    var sttime= new Date(Date.parse(that.startTime.replace(/-/g, "/")));
    that.startTimes = sttime.getTime();
    var endtime= new Date(Date.parse(that.endTime.replace(/-/g, "/")));
    that.endTimes = endtime.getTime();
    if (that.id) {  //如果是编辑
      $('.stepone').attr('href', '#tab2').click();
      $('#tab2').addClass('active').siblings().removeClass('active')
      $('.progress-bar-success').css('width', '50%');
      let apptreeUrl = '/api/v1/auth-manager/auth/app/valid-list';
      that.http.get(apptreeUrl).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.appztree = data['data'];
          for (let i = 0; i < that.appztree.length; i++) {
            if (!that.appztree[i].pId) {
              that.appztree[i].open = true
            }
          }
          $.fn.zTree.init($('#appztree'), that.appsetting, that.appztree)
        }
      })
    } else {   //新添加
      let url = '/api/v1/auth-manager/auth/user/save-user1?username=' + that.username + '&mobile=' + that.mobile + '&email=' + that.email + '&employeeId=' + that.employeeId
      that.http.get(url).subscribe(function (data) {
        if (data['code'] == 200) {
          $('.stepone').attr('href', '#tab2').click()
          $('#tab2').addClass('active').siblings().removeClass('active')
          $('.progress-bar-success').css('width', '50%');
          let apptreeUrl = '/api/v1/auth-manager/auth/app/valid-list';
          that.http.get(apptreeUrl).subscribe(function (data) {
            console.log(data)
            if (data['code'] == 200) {
              that.appztree = data['data'];
              for (let i = 0; i < that.appztree.length; i++) {
                if (!that.appztree[i].pId) {
                  that.appztree[i].open = true
                }
              }
              $.fn.zTree.init($('#appztree'), that.appsetting, that.appztree)
            }
          })
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
  }
  tab1(){
    $('#tab1').addClass('active').siblings().removeClass('active')
    $('.progress-bar-success').css('width', '25%');
  }
  tab22(){
    $('#tab2').addClass('active').siblings().removeClass('active')
    $('.progress-bar-success').css('width', '50%');
  }
  tab3() {
    let that = this;
    let roles = [];
    if (that.selectList != []) {
      that.selectList.map((item, index) => {
        roles.push( item.key)
      })
      let url = '/api/v1/auth-manager/auth/user/save-user2?roleKeys=' + roles
      this.http.get(url).subscribe(function (data) {
        if (data['code'] == 200) {
          $('#tab3').addClass('active').siblings().removeClass('active')
          $('.progress-bar-success').css('width', '75%');
          that.shoplist();
          let listnameuser = [];
          let listnamegrounp = [];
          console.log(that.selectList)
          for (let i = 0; i < that.selectList.length; i++) {
            listnameuser.push(that.selectList[i].name)
          }
          that.selectListshow = listnameuser.join();
          for (let i = 0; i < that.groupselect.length; i++) {
            listnamegrounp.push(that.groupselect[i].name)
          }
          that.groupselectshow = listnamegrounp.join()
          console.log(that.selectListshow)
          console.log(that.groupselectshow)
        } else {
          $('#tab2').addClass('active').siblings().removeClass('active')
          $('.progress-bar-success').css('width', '50%');
          that.shoplist();
          let listnameuser = [];
          let listnamegrounp = [];
          for (let i = 0; i < that.selectList.length; i++) {
            listnameuser.push(that.selectList[i].name)
          }
          that.selectListshow = listnameuser.join();
          for (let i = 0; i < that.groupselect.length; i++) {
            listnamegrounp.push(that.groupselect[i].name)
          }
          that.groupselectshow = listnamegrounp.join()
          console.log(that.selectListshow)
          console.log(that.groupselectshow)
          that.hintMsg = data['desc'];
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
          }, 1500)
        }
      }), err => { console.log('系统操作失败') }
    } else {
      $('#tab3').addClass('active').siblings().removeClass('active')
      $('.progress-bar-success').css('width', '50%');
    }
  }
  tab4() {
    let that=this;
    $('#tab4').addClass('active').siblings().removeClass('active')
    $('.progress-bar-success').css('width', '100%');
    this.choosedepatname = $("#department").text();
    this.choosedutyname = $("#dutyname").text();
    let listnamemd = [];
    for (let i = 0; i < that.storeselect.length; i++) {
      listnamemd.push(that.storeselect[i].dataName)
    }
    that.storeselectshow = listnamemd.join()
    let listnamepp = [];
    for (let i = 0; i < that.brandselect.length; i++) {
      listnamepp.push(that.brandselect[i].dataName);
    }
    that.brandselectshow = listnamepp.join()
    let listnamechannel = [];
    for (let i = 0; i < that.channelselect.length; i++) {
      listnamechannel.push(that.channelselect[i].dataName)
    }
    that.channelselectshow = listnamechannel.join()
    let listnameclass = [];
    for (let i = 0; i < that.classlistchoose.length; i++) {
      listnameclass.push(that.classlistchoose[i].dataName)
    }
    that.classlistchooseshow = listnameclass.join()
  }
  //状态
  changestatus() {
    let that = this;
    var isDisplayInput = $('input[name="isdislpay"]:checked').attr('title');
    if (isDisplayInput = 0) {
      that.enabled = 1;    //启用
    } else if (isDisplayInput = 1) {
      that.enabled = 0;    //禁用
    } else {
      that.enabled = -1;   //锁定
    }
  }
  //添加关联角色
  addlink() {
    let that = this;
    if ($('#selectTag option:selected ').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择角色'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000)
      return;
    }
    var hasRepeat = that.selectList.some((i, v) => i.key == $('#selectTag option:selected ').val());
    if (!hasRepeat) {
      that.selectList.push(
        {
          key: $('#selectTag option:selected ').val(),
          name: $('#selectTag option:selected').text(),
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.selectList.length; i++) {
      listname.push(that.selectList[i].name)
      listkey.push(that.selectList[i].key)
    }
    that.selectListshow = listname.join();
    that.selectListcz = listkey;

  }
  //取消关联
  dellink(key) {
    this.selectList.splice(key, 1);
  }
  //数据组
  loadGroupList() {
    var that = this;
    //有效用户组
    let groupUrl = `/api/v1/auth-manager/auth/group/valid-list`
    this.http.get(groupUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.groupList = data['data'];
          if (that.id) {  //编辑
            for (let i = 0; i < that.groups.length; i++) {
              for (let j = 0; j < that.groupList.length; j++) {
                if (that.groups[i] == that.groupList[j].key) {
                  var hasRepeat = that.groupselect.some((i, v) => i.key == that.groupList[j].key);
                  if (!hasRepeat) {
                    that.groupselect.push(that.groupList[j]);
                    let listname = [];
                    let listkey = [];
                    for (let i = 0; i < that.groupselect.length; i++) {
                      listname.push(that.groupselect[i].name)
                      listkey.push(that.groupselect[i].key)
                    }
                    that.groupselectshow = listname.join()
                    that.groupselectcz = listkey
                  }
                }
              }
            }
          }
        }
      }
    )
  }
  addgroupList() {
    let that = this;
    if ($('#selectTag2 option:selected').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择用户组'
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return;
    }
    var hasRepeat = that.groupselect.some((i, v) => i.key == $('#selectTag2 option:selected ').val());
    if (!hasRepeat) {
      this.groupselect.push(
        {
          key: $('#selectTag2 option:selected').val(),
          name: $('#selectTag2 option:selected').text()
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.groupselect.length; i++) {
      listname.push(that.groupselect[i].name)
      listkey.push(that.groupselect[i].key)
    }
    that.groupselectshow = listname.join()
    that.groupselectcz = listkey
  }
  delgrouplink(key) {
    this.groupselect.splice(key, 1);
  }
  //门店
  shoplist() {
    let that = this;
    let storeUrl = '/pcm-admin/stores/all';
    let obj = {}
    this.http.post(storeUrl, obj, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        console.log(data)
        let code = JSON.parse(JSON.stringify(data['data']).replace(/organizationCode/g, "key"))
        let dataName = JSON.parse(JSON.stringify(code).replace(/organizationName/g, "name"))
        that.addstoreList = dataName;
        if (that.id) {  //编辑
          for (let i = 0; i < that.storeList.length; i++) {
            for (let j = 0; j < that.addstoreList.length; j++) {
              if (that.storeList[i].code == that.addstoreList[j].code) {
                var hasRepeat = that.storeselect.some((i, v) => i.code == that.addstoreList[j].code);
                if (!hasRepeat) {
                  that.storeselect.push(that.addstoreList[j]);
                  let listname = [];
                  let listkey = [];
                  for (let i = 0; i < that.storeselect.length; i++) {
                    listname.push(that.storeselect[i].dataName)
                    listkey.push(that.storeselect[i].code)
                  }
                  that.storeselectshow = listname.join()
                  that.storeselectcz = listkey
                }
              }
            }
          }
        }
      }
    }), err => { }
  }
  addstorelink() {
    let that = this;
    if ($('#selectTag3 option:selected').val() == '') {
      that.hintMsg = '请选择门店';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
      return;
    }
    var hasRepeat = that.storeselect.some((i, v) => i.code == $('#selectTag3 option:selected ').val());
    if (!hasRepeat) {
      this.storeselect.push(
        {
          code: $('#selectTag3 option:selected').val(),
          dataName: $('#selectTag3 option:selected').text()
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.storeselect.length; i++) {
      listname.push(that.storeselect[i].dataName)
      listkey.push(that.storeselect[i].code)
    }
    that.storeselectshow = listname.join()
    that.storeselectcz = listkey
  }
  delstorelink(key) {
    this.storeselect.splice(key, 1);
  }
  //品牌
  brandlist() {
    let that = this;
    let brandUrl = `/pcm-inner/brands`
    this.http.get(brandUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        let code = JSON.parse(JSON.stringify(data['data']).replace(/brandSid/g, "key"))
        let dataName = JSON.parse(JSON.stringify(code).replace(/brandName/g, "name"))
        that.addbrandList = dataName;
        if (that.id) {  //编辑
          for (let i = 0; i < that.brandList.length; i++) {
            for (let j = 0; j < that.addbrandList.length; j++) {
              if (that.brandList[i].code == that.addbrandList[j].key) {
                var hasRepeat = that.brandselect.some((i, v) => i.code == that.addbrandList[j].code);
                if (!hasRepeat) {
                  that.brandselect.push(that.addbrandList[j]);
                  let listname = [];
                  let listkey = [];
                  for (let i = 0; i < that.brandselect.length; i++) {
                    listname.push(that.brandselect[i].dataName);
                    listkey.push(that.brandselect[i].code)
                  }
                  that.brandselectshow = listname.join()
                  that.brandselectcz = listkey
                }
              }
            }
          }
        }

      }
    }), err => { }
  }
  addbrandlink() {
    let that = this;
    if ($('#selectTag4 option:selected').val() == '') {
      that.hintMsg = '请选择品牌';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
      return;
    }
    var hasRepeat = that.brandselect.some((i, v) => i.code == $('#selectTag4 option:selected ').val());
    if (!hasRepeat) {
      this.brandselect.push(
        {
          code: $('#selectTag4 option:selected').val(),
          dataName: $('#selectTag4 option:selected').text()
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.brandselect.length; i++) {
      listname.push(that.brandselect[i].dataName);
      listkey.push(that.brandselect[i].code)
    }
    that.brandselectshow = listname.join()
    that.brandselectcz = listkey
  }
  delbrandlink(key) {
    this.brandselect.splice(key, 1);
  }
  //渠道
  channellist() {
    let that = this;
    let channeUrl = `/pcm-inner/channels`
    this.http.get(channeUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        let code = JSON.parse(JSON.stringify(data['data']).replace(/channelCode/g, "key"))
        let dataName = JSON.parse(JSON.stringify(code).replace(/channelName/g, "name"))
        that.addchannelList = dataName;
        if (that.id) {  //编辑
          for (let i = 0; i < that.channelList.length; i++) {
            for (let j = 0; j < that.addchannelList.length; j++) {
              if (that.channelList[i].code == that.addchannelList[j].code) {
                var hasRepeat = that.channelselect.some((i, v) => i.code == that.addchannelList[j].code);
                if (!hasRepeat) {
                  that.channelselect.push(that.addchannelList[j]);
                  let listname = [];
                  let listkey = [];
                  for (let i = 0; i < that.channelselect.length; i++) {
                    listname.push(that.channelselect[i].dataName)
                    listkey.push(that.channelselect[i].code)
                  }
                  that.channelselectshow = listname.join()
                  that.channelselectcz = listkey
                }
              }
            }
          }
        }

      }
    }), err => { }
  }
  addchannellink() {
    let that = this;
    if ($('#selectTag5 option:selected').val() == '') {
      that.hintMsg = '请选择渠道';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
      return;
    }
    var hasRepeat = that.channelselect.some((i, v) => i.code == $('#selectTag5 option:selected ').val());
    if (!hasRepeat) {
      this.channelselect.push(
        {
          code: $('#selectTag5 option:selected').val(),
          dataName: $('#selectTag5 option:selected').text()
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.channelselect.length; i++) {
      listname.push(that.channelselect[i].dataName)
      listkey.push(that.channelselect[i].code)
    }
    that.channelselectshow = listname.join()
    that.channelselectcz = listkey
  }
  delchannellink(key) {
    this.channelselect.splice(key, 1);
  }
  //分类
  classlist() {
    let that = this;
    let channeUrl = '/pcm-admin/dict/dicts/ZCATEGORY';
    this.http.get(channeUrl, this.httpOptions).subscribe(function (data) {
      if (data['code'] == 200) {
        that.classlistes = data['data'];
        if (that.id) {  //编辑
          for (let i = 0; i < that.industryList.length; i++) {
            for (let j = 0; j < that.classlistes.length; j++) {
              if (that.industryList[i].code == that.classlistes[j].code) {
                var hasRepeat = that.classlistchoose.some((i, v) => i.code == that.classlistes[j].code);
                if (!hasRepeat) {
                  that.classlistchoose.push(that.classlistes[j]);
                  let listname = [];
                  let listkey = [];
                  for (let i = 0; i < that.classlistchoose.length; i++) {
                    listname.push(that.classlistchoose[i].dataName)
                    listkey.push(that.classlistchoose[i].code)
                  }
                  that.classlistchooseshow = listname.join()
                  that.classlistchoosecz = listkey
                }
              }
            }
          }
        }

      }
    }), err => { }
  }
  addclasslink() {
    let that = this;
    if ($('#selectTag6 option:selected').val() == '') {
      that.hintMsg = '请选择分类';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
      return;
    }
    var hasRepeat = that.classlistchoose.some((i, v) => i.code == $('#selectTag6 option:selected ').val());
    if (!hasRepeat) {
      this.classlistchoose.push(
        {
          code: $('#selectTag6 option:selected').val(),
          dataName: $('#selectTag6 option:selected').text()
        }
      )
    }else{
      that.hintMsg = '数据重复';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    }
    let listname = [];
    let listkey = [];
    for (let i = 0; i < that.classlistchoose.length; i++) {
      listname.push(that.classlistchoose[i].dataName)
      listkey.push(that.classlistchoose[i].code)
    }
    that.classlistchooseshow = listname.join()
    that.classlistchoosecz = listkey
  }
  delclasslink(key) {
    this.classlistchoose.splice(key, 1);
  }
  formatDate(time, Delimiter) {
    Delimiter = Delimiter || '-';
    var now = new Date(time);

    var year = now.getFullYear() + '';
    var month = now.getMonth() + 1 + '';
    var date = now.getDate() + '';
    var hour = now.getHours() + '';
    var minute = now.getMinutes() + '';
    var second = now.getSeconds() + '';

    // 补0
    month = month.length < 2 ? '0' + month : month;
    date = date.length < 2 ? '0' + date : date;
    hour = hour.length < 2 ? '0' + hour : hour;
    minute = minute.length < 2 ? '0' + minute : minute;
    second = second.length < 2 ? '0' + second : second;

    return year + Delimiter + month + Delimiter + date + " " + hour + ":" + minute + ":" + second;
  }
  addSure() {
    let that = this;
    let url = '/api/v1/auth-manager/auth/user/save-or-update';
    var authUserView = {}
    if (that.id) {//编辑
      authUserView = {
        "id": that.id,
        "uid": that.uid,
        "username": that.username,
        "name": that.name,
        "mobile": that.mobile,
        "email": that.email,
        "employeeId": that.employeeId,
        "deptId": that.deptid,
        "dutyId": that.dutyid,
        "startTime": that.startTimes,
        "endTime": that.endTimes,
        "enabled": that.enabled,
        "password": that.pwd,
        "roleList": that.selectList,
        "groups": that.groupselect,
        "storeList": that.storeselect,
        "brandList": that.brandselect,
        "channelList": that.channelselect,
        "industryList": that.classlistchoose,
      }
    } else {//添加
      authUserView = {
        "username": that.username,
        "name": that.name,
        "mobile": that.mobile,
        "email": that.email,
        "employeeId": that.employeeId,
        "deptId": that.deptid,
        "dutyId": that.dutyid,
        "startTime": that.startTimes,
        "endTime": that.endTimes,
        "enabled": that.enabled,
        "password": that.pwd,
        "roleList": that.selectList,
        "groups": that.groupselect,
        "storeList": that.storeselect,
        "brandList": that.brandselect,
        "channelList": that.channelselect,
        "industryList": that.classlistchoose,
      }
    }
    console.log(authUserView)
    that.http.post(url, authUserView).subscribe(function (data) {
      console.log(data)
      if (data['code'] == 200) {
        that.hintMsg = data['desc'];
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
          that.router.navigateByUrl('auth/user');
        }, 1500)
      } else {
        that.hintMsg = data['desc'];
        that.isHint = true;
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1500)
      }
    })
  }
}
