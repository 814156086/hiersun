import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  formModel: FormGroup;
  public ztree;
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
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) {
    this.formModel = fb.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
      name1: ['', [Validators.required]],
      aname: ['', [Validators.required]]
    });
  }
  public ztreeId: any; // 树的id
  public pageNo = 1; // 默认分页
  public pId: any; // pId
  public addId: any; // 添加的id
  public list1 = []; // 应用组织信息列表
  public id: any; // id
  public cList = []; // 应用子类信息列表
  public editList = []; // 修改列表
  public iconName3: any;
  public iconName4: any;
  public cn: any;
  pageCount: any;
  isload: any;
  isHint = false;
  hintMsg: any;
  names: any;
  name1: any;
  public key: any;
  public appid: any;
  public selectList = []; // 新增的数组
  public linkList = [];
  public linkKey: any;
  public linkId: any;
  public editId: any;
  public message: any;
  public status = '';
  public cancelnum = 0;
  public editsavenum = 0;
  public treetype: any;
  public list2 = [];
  public ptype=0;
  public roleList = [];
  public listOfSelectedValue = [];
  public xqtype: any;
  public childResourceList = [];
  public childList: any;
  public appPid: any;
  public resourcelist: any;
  public name: any;
  public authList = [];
  public addauthList = [];
  public resourceList = []
  public capp = []
  public appkey: any;
  public aname: any;
  public pswType: boolean;
  public edittype: any;
  public itemMesg: ItemInfo;

  isDisabled=false;//资源详情权限
  ngOnInit() {
    this.isload = false;
    this.ztreeLeft();
    this.pswType = false;
    this.treePid = null;
    this.itemMesg = new ItemInfo('', '','','',true,'','');

  }
  // 加载树
  ztreeLeft() {
    let that = this;
    let ztreeUrl = `/api/v1/auth-manager/auth/app/tree-list`;
    this.http.get(ztreeUrl).subscribe(
      function (data) {
        $('.partload').show();
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
            }
          }
          $.fn.zTree.init($('#ztree'), that.setting, that.ztree);
          that.getcapp()
        }
      }
    );
  }

  getcapp() {
    let that = this;
    var treeObj = $.fn.zTree.getZTreeObj("ztree");
    var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true);
    let url = `/api/v1/auth-manager/auth/app/child-list?pageNo=` + that.pageNo + '&pageSize=' + 10
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        that.capp = data['data'].list;
      }
    }), err => { }
  }
  // 局部刷新左侧树
  reloadPage() {
    let that = this;
    $('.partload').show()
    setTimeout(function () {
      that.ztreeLeft()
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
  public treeid: any;
  public treePid: any;
  public isPapp=true;
  public appId:any;
  public addKey : any;
  myclick() {
    let that = this;
    that.resourceList = []

    let obj = JSON.parse($('input[name=mymsg]').val());
    if(obj.pId==null){
      that.isPapp=true;
    }else{
      that.isPapp=false;
    }
    that.addKey=obj.app;
    console.log(obj.id)
    that.editsavenum = 0;
    that.cancelnum = 0;
    that.treeid = obj.id;
    that.treePid = obj.pId;
    that.appPid=obj.pId;
    console.log(obj)
    if (obj.noApp) {
      that.deptDesc2(obj.id);
      that.appId= obj.id;
      that.appkey=$('#app').val();
      console.log($('#app').val());
    } else {
      that.deptDesc(obj.id);
      console.log(obj.id)
      that.appId=null;
    }
    that.chidlList(obj.id);
    that.treetype = obj.noApp;
  }
  // 应用详情
  public resourcekey: any;

  deptDesc(id) {
    let that = this;
    let url1 = `/api/v1/auth-manager/auth/app/desc/` + id;
    this.http.get(url1).subscribe(
      data => {
        $('.partload').show()
        if (data['code'] == 200) {
          that.list1 = [data['data']];
          console.log(data['data'])
          that.addId = data['data'].pId;
          that.appkey = data['data'].key;
          that.resourcekey = data['data'].key;
          setTimeout(function () {
            $('.partload').hide();
          }, 100);
          that.resourceDept(data['data'].key)
        }
      }, function (err) {
        console.log(err);
      }
    )

  }
  public pnoevent :any;
  resourceDept(appkey) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/resource/resource-list?app=` + appkey + '&pageSize=' + 10 + '&pageNo=' + that.pageNo;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.resourceList = data['data'];
          that.resourcekey = data['data'].key
          // console.log(data)
          // that.pageNo = data['data'].pageNo;
          // that.pageCount = data['data'].pageCount;
          // that.pagenumber(that.pageNo,that.treeid)
          // $("#pagination1").pagination({
          //   currentPage: that.pageNo,
          //   totalPage: that.pageCount,
          //   callback: function (current) {
          //     that.pageNo = current;
          //     that.pagenumber(that.pageNo,that.treeid)
          //   }
          // });
          if (data['data'] == false) {
            that.resourcelist = false;
          } else {
            that.resourcelist = true;
          }
        }
      }
    )
  }
  public noEvent :any;

  resouceChildList(id){
    let that=this;
    let curl = `/api/v1/auth-manager/auth/resource/child-list?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&pId=' + id;
    this.http.get(curl).subscribe(
      function (data) {
        that.childResourceList = data['data'].list;
        if (data['data'].list == false) {
          that.childList = false
        } else {
          that.childList = true
        }
      }
    )
  }

  deptDesc2(id) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/resource/desc/${id}`;
    this.http.get(url).subscribe(function (data) {
      that.list2 = [data['data']];
      that.noEvent=data['data'].noEvent;
        console.log(data['data'].noEvent);
        console.log(that.noEvent)
      that.xqtype = data['data'].type;
      that.appkey=data['data'].app;
      let list = [];
      data['data'].roleList.map((item, index) => {
        list.push(
          item.key
        )
      });
      that.listOfSelectedValue = list;
      let url1 = `/api/v1/auth-manager/auth/role/valid-list?app=`+data['data'].app;
      that.http.get(url1).subscribe(function (data) {
        that.authList = data['data']
      });
    });
    that.resouceChildList(id);

  }


  chidlList(pId) {
    let that = this;
    let cUrl = `/api/v1/auth-manager/auth/resource/child-list?pageNo=` + this.pageNo + '&pageSize=' + 10 + '&pId=' + pId;
    this.http.get(cUrl).subscribe(
      function (data) {
        that.isload = false;
        if (data['code'] == 200) {
          that.cList = data['data'].list;
          that.pageNo = data['data'].pageNo;
          that.pageCount = data['data'].pageCount;
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1000);
        }
      }, function (err) {
        console.log(err);
      }
    );
  }
  // 树的点击事件
  ztreeClick(event, treeId, treeNode) {
    let obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('.myclick').click();
  }
  // 修改
  editsave() {
    $('input[name=name]').removeAttr('readonly');
    $('input[name=comm]').removeAttr('readonly');
    $('input[name=xq-shortCode]').removeAttr('readonly');
    $('input[name=xq-email]').removeAttr('readonly');
    $('input[name=xq-noticeUrl]').removeAttr('readonly');
    this.editsavenum = 1
    this.cancelnum = 1;
    $('#create').removeAttr('disabled');
    $('#pwdtxt').removeAttr('disabled');
  }
  // 退出编辑

  cancel() {
    $('input[name=name]').attr('readonly', 'readonly');
    $('input[name=comm]').attr('readonly', 'readonly');
    this.editsavenum = 0;
    this.cancelnum = 0;
    this.pswType = false;
    $('#create').attr('disabled', 'true');
    $('#pwdtxt').attr('disabled', 'true');
    this.deptDesc(this.treeid);

  }
  canceladd() {
    $('#akey').attr('value', '');
    $('#aname').attr('value', '');
    $('#acomm').attr('value', '');
  }
  // 保存
  save(id) {
    let that = this;
    if ($('#name').val() == '') {
      that.hintMsg = '请输入必填项';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
      return;
    }
    if ($('#xq-shortCode').val() == '') {
      that.hintMsg = '请输入短码'
      that.isHint = true;
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    if ($("#xq-shortCode").val()!='') {
      //let reg =  /^[0-9]+.?[0-9]*$/;
      let reg = /^\d{3}$/;
      if(!reg.test($("#xq-shortCode").val())) {
        that.isHint = true;
        that.hintMsg = '请输入三位数字';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($("#xq-email").val()!='') {
      let myreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if(!myreg.test($("#xq-email").val())) {
        that.isHint = true;
        that.hintMsg = '请输入正确的邮箱地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($("#xq-noticeUrl").val()!='') {
      let strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
      let re = new RegExp(strRegex);
      if(!re.test($("#xq-noticeUrl").val())) {
        that.isHint = true;
        that.hintMsg = '请输入正确的通知地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if($("#pwdtxtt").length>0){
      if ($('#pwdtxtt').val().length != 128) {

        that.hintMsg = '请输入128位的密钥';
        that.isHint = true;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = ''
        }, 1000)
        return;
      }
    }
      let url = `/api/v1/auth-manager/auth/app/save-or-update`;
      let obj = {
        'comm': $('#comm').val(),
        'name': $('#name').val(),
        'id': id,
        'shortCode': $('#xq-shortCode').val(),
        'email' :$('#xq-email').val(),
        'noticeUrl': $('#xq-noticeUrl').val(),
        'appSecret': $('#pwdtxtt').val()
      }
      if($('#pwdtxtt').length>0){
        obj.appSecret=$('#pwdtxtt').val()
      }else if($('#pwdtxtt').length<1){
        obj.appSecret=$('#pwdtxt').val()
      }

      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = '修改应用信息成功！';
             that.cancel();
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $('#create').attr('disabled', 'true');
              $('#pwdtxt').attr('disabled', 'true');
              that.pswType = false;
              that.deptDesc(that.treeid);
            }, 1000)

          }else{
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
            return;
          }
        }, function (err) {
          console.log(err);
        }
      )

  }
  // 操作弹框
  operation(id, pId, status) {
    this.message = '';
    this.status = '';
    this.id = '';
    this.pId = '';
    $('#myModal').modal('show');
    if (status == 'true') {
      this.message = '确定启用该系统';
    } else if (status == 'false') {
      this.message = '确定禁用该系统';
    } else if (status == 'del') {
      this.message = '确定删除该系统';
    }
    this.status = status;
    this.id = id;
    this.pId = pId;
  }
  reoperation(id, pId, status) {
    this.message = '';
    this.status = '';
    this.id = '';
    this.pId = '';
    $('#myreModal').modal('show');
    if (status == 'true') {
      this.message = '确定启用该资源';
    } else if (status == 'false') {
      this.message = '确定禁用该资源';
    } else if (status == 'del') {
      this.message = '确定删除该资源';
    }
    this.status = status;
    this.delid = id;
    this.pId = pId;
    console.log(this.status)
  }
  // 修改弹框、获取id
  edit(id, pId) {
    let that = this;
    this.editId = id;
    that.pId = pId;
    that.pswType=false;
    $('#myModal1').modal('show');
    let url = `/api/v1/auth-manager/auth/app/desc/` + id;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.editList = [data['data']]
          that.names = data['data'].name;
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1000);
        }
      }
    )
  }
  // 确定修改
  editSure() {
    let that = this;

    if ($('#ename').val() == '') {
      that.hintMsg = '请输入名称';
      that.isHint = true;
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    if ($('#item-shortCode').val() == '') {
      that.hintMsg = '请输入短码';
      that.isHint = true;
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    if ($("#item-shortCode").val()!='') {
      //let reg =  /^[0-9]+.?[0-9]*$/;
      let reg = /^\d{3}$/;
      if(!reg.test($("#item-shortCode").val())) {
        that.isHint = true;
        that.hintMsg = '请输入三位数字';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($("#item-email").val()!='') {
      let myreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if(!myreg.test($("#item-email").val())) {
        that.isHint = true;
        that.hintMsg = '请输入正确的邮箱地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if($("#pwdtxtt2").length>0){
      if ($('#pwdtxtt2').val().length != 128) {
        that.hintMsg = '请输入128位的密钥';
        that.isHint = true;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = ''
        }, 1000)
        return;
      }
    }
    if ($("#item-noticeUrl").val()!='') {
      let strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
      let re = new RegExp(strRegex);
      if(!re.test($("#item-noticeUrl").val())) {
        that.isHint = true;
        that.hintMsg = '请输入正确的通知地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }

      let url = `/api/v1/auth-manager/auth/app/save-or-update`;
      let obj = {
        'comm': $('#ecomm').val(),
        'id': that.editId,
        'name': $('#ename').val(),
        'shortCode': $('#item-shortCode').val(),
        'email' :$('#item-email').val(),
        'noticeUrl': $('#item-noticeUrl').val(),
        'enabled': $('input[name="eenabled"]:checked').val(),
        'appSecret': ''
      };
       if($('#pwdtxtt2').length>0){
        obj.appSecret=$('#pwdtxtt2').val()
      }else if($('#pwdtxtt2').length<1){
        obj.appSecret=$('#pwdtxt2').val()
      }
      console.log(obj);
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = '修改应用信息成功！';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.pswType2=false;
            }, 1000)
            that.ztreeLeft();
            that.chidlList(that.pId);
            $('#myModal1').modal('hide');
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );

  }
  editcancel(){
    this.pswType2=false;
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
      };
      url = `/api/v1/auth-manager/auth/app/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              that.deptDesc(that.treePid);
              $("#myModal").modal('hide');
            }, 1000);
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
      // 如果状态为启用
    } else if (that.status == 'false') {
      let obj = {
        'enabled': false,
        'id': that.id
      };
      url = `/api/v1/auth-manager/auth/app/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $('#myModal').modal('hide');
              that.ztreeLeft()
            }, 1000);
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
    } else if (that.status == 'del') {
      let url = `/api/v1/auth-manager/auth/app/del/${that.id}`
      this.http.post(url,that.id).subscribe(function(data){
        if(data['code']==200){
          that.hintMsg=data['desc'];
          that.isHint=true;
          setTimeout(function(){
            that.isHint=false;
            that.hintMsg=data['desc'];
            that.ztreeLeft()
            $('#myModal').modal('hide');
            that.deptDesc(that.id)
          },1000)
        }
      })

    }
  }

  subreStatus() {
    let that = this;
    let url = '';
    // 如果状态为禁用
    if (that.status == 'true') {
      let obj = {
        "enabled": true,
        "id": that.delid
      };
      url = `/api/v1/auth-manager/auth/resource/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;

              $("#myreModal").modal('hide');
              that.ztreeLeft();
              if(!that.treetype){   //app
                that.resourceDept(that.appkey);
              }else{                //资源
                that.resouceChildList(that.appId);
              }

              // that.resourceDept(that.appkey)
            }, 1000)

          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
      // 如果状态为启用
    } else if (that.status == 'false') {
      let obj = {
        'enabled': false,
        'id': that.delid
      };
      url = `/api/v1/auth-manager/auth/resource/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.hintMsg = data['desc'];
            that.isHint = true;
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              $("#myreModal").modal('hide');
              that.ztreeLeft();
              if(!that.treetype){   //app
                that.resourceDept(that.appkey);
              }else{                //资源
                that.resouceChildList(that.appId);
              }

            }, 1000)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
    } else if (that.status == 'del') {
      let url = `/api/v1/auth-manager/auth/resource/del/${that.delid}`;
      this.http.post(url,that.delid).subscribe(function(data){
        if (data['code'] == 200) {
          that.hintMsg = data['desc'];
          that.isHint = true;
          setTimeout(function () {
            that.hintMsg = '';
            that.isHint = false;
            that.resourceDept(that.resourcekey);
            $("#myreModal").modal('hide');
          }, 1000)

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
  // 添加应用子类
  public shortCode: any;
  add() {
    let that = this;
    $('#akey').attr('value', '');
    $("#shortCode").attr('value','');
    $("#email").attr('value','');
    $("#noticeUrl").attr('value','');
    $('#aname').attr('value', '');
    $('#acomm').attr('value', '');
    $('#addpwdtxt').val('');
    that.key='';
    that.shortCode='';
    that.pId = '';

    let url = `/api/v1/auth-manager/auth/app/desc/null`;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          $('#myModal2').modal('show');
          console.log(data['data']['shortCode']);
          that.addKey = data['data'].key;
          that.shortCode = data['data'].shortCode;
        }
      }, err => { }
    )
  }


  public email: any;
  public noticeUrl: any;
  // 添加应用
  addSure() {
    let that = this;
    if ($('#akey').val() == '' || $('#aname').val() == '' || $('#shortCode').val() == '') {
      that.isHint = true;
      that.hintMsg = '请填入所有必填项';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    if ($("#shortCode").val()!='') {
      let reg = /^\d{3}$/;
      if(!reg.test($("#shortCode").val())) {
        that.isHint = true;
        that.hintMsg = '请输入三位数字';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($("#email").val()!='') {
      let myreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if(!myreg.test($("#email").val())) {
        console.log($("#email").val());
        that.isHint = true;
        that.hintMsg = '请输入正确的邮箱地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($("#noticeUrl").val()!='') {
      let strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
      let re = new RegExp(strRegex);
      if(!re.test($("#noticeUrl").val())) {
        console.log($("#email").val());
        that.isHint = true;
        that.hintMsg = '请输入正确的通知地址';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
        return;
      }
    }
    if ($('#addpwdtxt').val().length != 128) {
      that.isHint = true;
      that.hintMsg = '请输入128位的密钥';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    let url = `/api/v1/auth-manager/auth/app/save-or-update`;
      let obj = {
        'key': that.addKey,
        'comm': $('#acomm').val(),
        'enabled': $('input[name="enabled"]:checked').val(),
        'name': $('#aname').val(),
        'pId': that.treeid,
        'shortCode': $('#shortCode').val(),
        'email' :$('#email').val(),
        'noticeUrl': $('#noticeUrl').val(),
        "appSecret": $('#addpwdtxt').val()
      };
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = '添加应用信息成功！';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              that.chidlList(that.pId);
              $('#myModal2').modal('hide');
            }, 1000)

          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      )

  }
  addsure() {
    let that = this;
    let keyUrl = `/api/v1/auth-manager/auth/app/check-key?key=` + 'APP_' + $('#akey').val();
    this.http.get(keyUrl).subscribe(
      function (data) {
        if (data['code'] == 200) {
          if (data['data'] == true) {
            that.isHint = true;
            that.hintMsg = '编号不能重复！';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $('#aname').attr('value', '');
              $('#akey').attr('value', '');
              $('#acomm').attr('value', '');
              that.ztreeLeft();
              that.chidlList(that.pId);
            }, 1000);

          } else {
            that.addSure();
          }
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1000);
        }
      }
    );
  }
  // 关联角色
  link(key, id) {
    let that = this;
    that.linkKey = key;
    that.linkId = id;
    let url = `/api/v1/auth-manager/auth/role/valid-list`;
    this.http.get(url).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.linkList = data['data'];
        }
      }, err => { }
    );
  }
  // 新增角色
  newadd() {
    let that = this;
    if ($('#selectTag option:selected ').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择用户';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
      return;
    }
    this.selectList.push(
      {
        key: $('#selectTag option:selected ').val(),
        name: $('#selectTag option:selected').text(),
      }
    )
  }
  // 取消关联
  cancelLink(key) {
    let that = this;
    $('#tbody tr .btn').on('click', function () {
      $(this).parent().parent().remove()
    })
    this.selectList.map((item, index) => {
      if (item.key == key) {
        that.selectList.splice(index, 1)
      }
    });
  }
  // 确定添加关联角色
  linkadd() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/app/add-app-role`;
    let obj = {
      'id': that.linkId,
      'key': that.linkKey,
      'roleList': []
    };
    that.selectList.map((item, index) => {
      obj.roleList.push(
        item.key
      );
    });
    this.http.post(url, obj).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            $('#link').modal('hide');
          }, 1000);
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1000);
        }
      }
    );
  }
  del(id) {
    this.appid = id;
  }
  iconsure() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/app/del/${this.appid}`;
    this.http.post(url,that.appid).subscribe(function(data){
      if (data['code'] == 200) {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.ztreeLeft();
        }, 1000);
      } else {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1000);
      }
    })
  }
  public pwd: any;
  create() {
    let that = this;
    that.pswType = true;
    let len = 128;
    let str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let i;
    let pwd = '';
    let maxPos = str.length;
    for (i = 0; i < len; i++) {
      pwd += str.charAt(Math.floor(Math.random() * maxPos));
    }
    console.log(pwd.length);
    // that.pwd = pwd;
    setTimeout(function () {
      $('#pwdtxtt').attr('value', pwd);
    }, 100);
    return pwd;
  }
  public pswType2=false;
  createP() {
    let that = this;
    that.pswType2 = true;
    let len = 128;
    let str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let i;
    let pwd = '';
    let maxPos = str.length;
    for (i = 0; i < len; i++) {
      pwd += str.charAt(Math.floor(Math.random() * maxPos));
    }
    setTimeout(function () {
      $('#pwdtxtt2').attr('value', pwd);
    }, 100);
    return pwd;
  }
  updateCreate() {
    let that = this;
    that.pswType = true;
    let len = 128;
    let str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let i;
    let pwd = '';
    let maxPos = str.length;
    for (i = 0; i < len; i++) {
      pwd += str.charAt(Math.floor(Math.random() * maxPos));
    }
    console.log(pwd.length);
    // that.pwd = pwd;
    setTimeout(function () {
      $('#item-pwdtxtt').attr('value', pwd);
    }, 100);
    return pwd;
  }

  addcreate() {
    let that = this;
    let len = 128;
    let str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let i;
    let pwd = ''
    let maxPos = str.length
    for (i = 0; i < len; i++) {
      pwd += str.charAt(Math.floor(Math.random() * maxPos));
    }
    console.log(pwd.length);
    $('#addpwdtxt').attr('value', pwd);
    return pwd;
  }
  // 返回
  rcancel() {
    $('#rname').attr("readonly", 'true');
    $('#rcomm').attr("readonly", 'true');
    $('#orderby').attr("readonly", 'true');
    $('#ricon').attr("readonly", 'true');
    this.editsavenum = 0
    this.cancelnum = 0;
    $('.input input').attr("disabled", 'true');
    $('#ricon').removeAttr('contenteditable');
    this.isDisabled=false;
  }
  // 编辑
  reditsave() {
    $('#rname').removeAttr("readonly");
    $('#rcomm').removeAttr("readonly");
    $('#orderby').removeAttr("readonly");
    this.editsavenum = 1;
    this.cancelnum = 1;
    $('.input input').removeAttr("disabled");
    $('#ricon').removeAttr("readonly");
    $('#xqevent').removeAttr('disabled');
    $('#ricon').attr('contenteditable', 'true');
    // $('#auth').removeAttr('disabled')
    this.isDisabled=true;
  }
  rsave(id) {
    let that = this;
    if ($('#rname').val() == '' || $('#resource').val() == '') {
      that.isHint = true;
      that.hintMsg = '请输入必填项';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1000);
    } else {
      let url = `/api/v1/auth-manager/auth/resource/save-or-update`;
      // let xqradio = $('input [name="xqtype"]:checked').val();
      // if(xqtype==2){
      //   xqtype = $('#xqevent option:selected').val()
      // }
      var type=this.xqtype!=2?this.xqtype:$('#xqevent option:selected').val();
      let obj = {
        "comm": $('#rcomm').val(),
        "id": id,
        "type": type,
        "name": $('#rname').val(),
        "resource": $('#resource').val(),
        "orderBy": $('#orderby').val(),
        "icon": $('#ricon').text(),
        "roleList": that.listOfSelectedValue
      };
     console.log(obj)
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = "修改资源信息成功！";
            console.log(obj.icon)
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              that.chidlList(that.pId);
              $("#myModal1").modal('hide');
              that.rcancel();
              $('#xqevent').attr('disabled',true);
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
    }
  }
  // 操作弹框
  roperation(id, pId, status) {
    this.message = '';
    this.status = '';
    this.id = '';
    this.pId = '';
    $('#rmyModal').modal('show');
    if (status == 'true') {
      this.message = '确定启用该资源 ';
    } else if (status == 'false') {
      this.message = '确定禁用该资源';
    } else if (status == 'del') {
      this.message = '确定删除该资源';
    }
    this.status = status;
    this.id = id;
    this.pId = pId;
  }
  rsubStatus() {
    let that = this;
    let url = '';
    // 如果状态为禁用
    if (that.status == 'true') {
      let obj = {
        "enabled": true,
        "id": that.id
      };
      url = `/api/v1/auth-manager/auth/resource/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              that.chidlList(that.pId);
              $("#rmyModal").modal('hide');
            }, 1000);

          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
      // 如果状态为启用
    } else if (that.status == 'false') {
      let obj = {
        'enabled': false,
        'id': that.id
      };
      url = `/api/v1/auth-manager/auth/resource/operation`;
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              that.ztreeLeft();
              that.deptDesc(that.id);
              that.chidlList(that.pId);
              $("#rmyModal").modal('hide');
            }, 1000);

          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1000);
          }
        }, function (err) {
          console.log(err);
        }
      );
    }
  }
  public className: any;
  public iconName: any;
  newIcon(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className.split(' ')[1];
    let current = event.path[0];
    $(current).addClass('click');
    $(current).siblings().removeClass('click');
    $('.appIcon').children('div').removeClass('click');
    $('.typeIcon').children('div').removeClass('click');
    $('.spinnerIcon').children('div').removeClass('click');
    $('.brand').children('div').removeClass('click');
    $('.lineIcon').children('div').removeClass('click')
  }
  appIcon(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className.split(' ')[1];
    let current = event.path[0];
    $(current).addClass('click');
    $(current).siblings().removeClass('click');
    $('.newIcon').children('div').removeClass('click');
    $('.typeIcon').children('div').removeClass('click');
    $('.spinnerIcon').children('div').removeClass('click');
    $('.brand').children('div').removeClass('click');
    $('.lineIcon').children('div').removeClass('click')
  }
  typeIcon(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className.split(' ')[1];
    let current = event.path[0];
    $(current).addClass('click')
    $(current).siblings().removeClass('click')
    $('.newIcon').children('div').removeClass('click')
    $('.appIcon').children('div').removeClass('click')
    $('.spinnerIcon').children('div').removeClass('click')
    $('.brand').children('div').removeClass('click')
    $('.lineIcon').children('div').removeClass('click')
  }
  spinnerIcon(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className.split(' ')[1];
    let current = event.path[0]
    $(current).addClass('click')
    $(current).siblings().removeClass('click')
    $('.newIcon').children('div').removeClass('click')
    $('.typeIcon').children('div').removeClass('click')
    $('.appIcon').children('div').removeClass('click')
    $('.brand').children('div').removeClass('click')
    $('.lineIcon').children('div').removeClass('click')
  }
  brand(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className.split(' ')[1];
    let current = event.path[0];
    $(current).addClass('click')
    $(current).siblings().removeClass('click')
    $('.newIcon').children('div').removeClass('click')
    $('.typeIcon').children('div').removeClass('click')
    $('.spinnerIcon').children('div').removeClass('click')
    $('.appIcon').children('div').removeClass('click')
    $('.lineIcon').children('div').removeClass('click')
  }
  lineIcon(event) {
    this.className = event.toElement.children[0].className;
    this.iconName = event.toElement.children[0].className;
    let current = event.path[0];
    $(current).addClass('click')
    $(current).siblings().removeClass('click')
    $('.newIcon').children('div').removeClass('click')
    $('.typeIcon').children('div').removeClass('click')
    $('.spinnerIcon').children('div').removeClass('click')
    $('.brand').children('div').removeClass('click')
    $('.appIcon').children('div').removeClass('click')
  }
  public iconName2: any;
  public className2: any;
  public test = 0;
  sure() {
    $('#icon').empty();
    $('#ricon').empty();
    $('#addicon').empty();
    $('#editicon').empty();
    $('#addcicon').empty();
    $('#creicon').empty();
    $('#Caddicon').empty();
    this.iconName2 = this.iconName;
    this.className2 = this.className;
    console.log(this.test)
    if (this.test == 1) {
      $('#addicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      setTimeout(function () {
        this.test = 1
      }, 100)
    } else if (this.test == 0) {
      $('#icon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      $('#ricon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )

      $('#creicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      $('#addcicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      $('#Caddicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      $('#addicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
    } else if (this.test == 3) {
      $('#addcicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )

    } else if (this.test == 4) {
      $('#editicon').append(
        '<i style="margin-right: 5px;" class="' + this.className2 + '"></i>' + this.iconName2 + ''
      )
      setTimeout(function () {
        this.test = 4
      }, 100)
    }
    $('#chooseModal').modal('hide')
  }
  public editdept = {
  }
  public ceditdept = []
  public editid: any;
  public ctypea: any;
  public listOfSelectedValue2 = []
  redit(id) {
    let appkey:any;
    $('.scieen').show();
    $('#editresource').modal('show');
    $('.modal-backdrop').hide();
    let that = this;
    that.editdept={};
    let rolelist = [];
    that.editid = id;
    let url = `/api/v1/auth-manager/auth/resource/desc/` + id;
    this.http.get(url).subscribe(
      function (data) {
        that.editdept = data['data'];
        that.pnoevent=data['data'].noEvent;
        console.log(data['data']);
        console.log($('#editresource').length);
        // that.xqtype = data['data'].type;
        that.iconName4 = data['data'].icon;
        that.edittype=   data['data'].type;
        that.itemMesg=data['data'];
        data['data'].roleList.map((item, index) => {
          rolelist.push(
            item.key
          )
        });
        that.listOfSelectedValue = rolelist
      }
    );

  }

  scieen() {
    $('.scieen').modal('hide')
  }
  reditsure() {
    let that = this;
    if ($('#rename').val() == '' || $('#reresource').val() == '') {
      that.hintMsg = '请输入必填项';
      that.isHint = true;
      setTimeout(function () {
        that.hintMsg = '';
        that.isHint = false;
      }, 1000)
    } else {
      let url = `/api/v1/auth-manager/auth/resource/save-or-update`;
      let edittype = $('input[name="edittype"]:checked').val();
      if (edittype == 2) {
        edittype = $('#editevent').val();
      }
      let obj = {
        'id': that.editid,
        'name': $('#rename').val(),
        'orderBy': $('#reorderby').val(),
        'type': edittype,
        'resource': $('#reresource').val(),
        'icon': $('#icon').text(),
        'roleList': that.listOfSelectedValue,
        'comm': $('#recomm').val(),
        'enabled': $('input[name="tenabled"]:checked').val()
      };
      this.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
              if(!that.treetype){   //app
                that.resourceDept(that.appkey);
              }else{                //资源
                that.resouceChildList(that.appId);
              }
              that.ztreeLeft();
              that.recancel();
            }, 1000)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.hintMsg = '';
              that.isHint = false;
            }, 1000)
          }
        }, err => { }
      )
    }
  }

  recancel() {
    $('.scieen').hide();
    $('#editresource').modal('hide');
    $('#ceditresource').modal('hide');
  }

  delresource(id) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/resource/del/${id}`
    this.http.post(url,id).subscribe(function(data){
      if (data['code'] == 200) {
        that.isHint = true;
        that.hintMsg = "删除成功"
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = ""
        }, 1000)
      } else {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1000)
      }
    })
    // this.http.delete(url).subscribe(
    //   function (data) {
    //     if (data['code'] == 200) {
    //       that.isHint = true;
    //       that.hintMsg = "删除成功"
    //       setTimeout(function () {
    //         that.isHint = false;
    //         that.hintMsg = ""
    //       }, 1000)
    //     } else {
    //       that.isHint = true;
    //       that.hintMsg = data['desc'];
    //       setTimeout(function () {
    //         that.hintMsg = '';
    //         that.isHint = false;
    //       }, 1000)
    //     }
    //   }
    // )
  }
  public raddid: any;
  public addresourceid: any;
  public authType=false;
  radd(id) {
    this.raddid = id
    $("#myModal4").modal('show');
    $('.modal-backdrop').hide();
    $('.scieen').show();
  }
  addresource(id) {
    this.addresourceid = id
    let that = this;
    $('#myModal4').modal('show');
    $('.modal-backdrop').hide();
    $('.scieen').show();
    $(".add_resourcce").val('');

    that.listOfSelectedValue2 = []
    let url = `/api/v1/auth-manager/auth/role/valid-list`
    this.http.get(url).subscribe(function (data) {
      if (data['code'] == 200) {
        console.log(data);
        that.addauthList = data['data'];
        setTimeout(function () {
          that.hintMsg = '';
          that.isHint = false;
        }, 1000)
      }
    });
    if(that.xqtype==2|| that.xqtype==3||that.xqtype==4||that.xqtype==5){
      console.log('事件');
      that.authType=true;
      that.ptype=2;
    }else{
      that.authType=false;
    }
  }

  addPsure() {
    let that = this;
    let url = `/api/v1/auth-manager/auth/resource/save-or-update`;
    let rolelist2 = [];
    that.listOfSelectedValue2.map((item, index) => {
      rolelist2.push(
        {
          'key': item
        }
      )
    })
    let className: any;
    if (that.test == 6) {
      className = that.className2
    } else {
      className = $('#addicon').text()
    }
    let ptype = $('input[name="ptype"]:checked').val();
    if (ptype == 2) {
      ptype = $('#ptevent').val();
    }
    let obj = {
      "comm": $('#Pcomm').val(),
      "enabled": $("input[name='penabled']:checked").val(),
      "app": that.appkey,
      "name": $('#Pname').val(),
      "type": ptype,
      "resource": $('#aresource').val(),
      "orderBy": $('#addOrderby').val(),
      "roleList": rolelist2,
      "icon": className,
      "pId": that.appId
    }
    console.log(obj)
    if ($('#Pname').val() == '' || $('#aresource').val() == '') {
      that.isHint = true;
      that.hintMsg = '请输入必填项';
      $('.hintMsg').addClass('color');
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
        $('.hintMsg').removeClass('color')
      }, 1500);
      this.test = 0
    } else {
      that.http.post(url, obj).subscribe(
        function (data) {
          if (data['code'] == 200) {
            that.isHint = true;
            that.hintMsg = "添加资源信息成功！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
              $('.scieen').hide()
              $("#myModal4").modal('hide');
              that.listOfSelectedValue = [];
              $('#addOrderby').attr('value', '');
              $('#addicon').empty();
              $('#aresource').attr('value', '');
              if(!that.treetype){   //app
                that.resourceDept(that.appkey);
              }else{                //资源
                that.resouceChildList(that.appId);
              }

              that.ztreeLeft();
            }, 1500)
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
          $('#Pname').attr('value', '')
          $('#Pcomm').attr('value', '')
        }, function (err) {
          console.log(err)
        }
      )
    }
  }

  cancel2() {
    $('.scieen').hide();
    this.test = 0;
    this.listOfSelectedValue2 = []
    $('#addOrderby').attr('value', '');
    $('#addicon').empty()
    $('#aresource').attr('value', '');
    $("#myModal4").modal('hide');
  }
  delapp(id) {
    let that = this;
    let url = `/api/v1/auth-manager/auth/app/del/${id}`;
    this.http.post(url,id).subscribe(function(data){
      if (data['code'] == 200) {
        that.isHint = true;
        that.hintMsg = "删除成功";
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = ""
          that.list1 = []
        }, 1000)
      } else {
        that.isHint = true;
        that.hintMsg = data['desc'];
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = "";
        }, 1000)
      }
    })
    // this.http.delete(url).subscribe(
    //   function (data) {
    //     if (data['code'] == 200) {
    //       that.isHint = true;
    //       that.hintMsg = "删除成功"
    //       setTimeout(function () {
    //         that.isHint = false;
    //         that.hintMsg = ""
    //         that.list1 = []
    //       }, 1000)
    //     } else {
    //       that.isHint = true;
    //       that.hintMsg = data['desc']
    //       setTimeout(function () {
    //         that.isHint = false;
    //         that.hintMsg = "";
    //       }, 1000)
    //     }
    //   }
    // )
  }
  public delid: any;
  rdel(id) {
    let that = this;
    that.delid = id;
    let url = `/api/v1/auth-manager/auth/resource/del/${id}`
    this.http.post(url,id).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.isHint = true;
          that.hintMsg = "删除成功";
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = ""
          }, 1000)
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = "";
            that.list1 = []
          }, 1000)
        }
      }
    )
  }
  typeClick(type){
    this.xqtype=type;
  }
  editClick(type){
    this.edittype=type;
  }
  ptypeClick(type){
    this.ptype=type;
  }
}
export class ItemInfo {
  constructor(
    public app: String,
    public name: String,
    public comm:String,
    public icon : String,
    public enabled : Boolean,
    public resource : String,
    public orderBy : String
  ) {
  }
}
