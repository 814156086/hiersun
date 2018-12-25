import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  // public isShowDelWin = false;    //显示删除弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
  public setting: any; //ztree
  public parsetting: any; //上级ztree
  treeList = [];//初始化数据
  public stoId: any; //选中的元素id
  className = "dark";
  public extId: any;//扩展信息字段
  public stoName: any;//编辑的门店名称
  public stoCode: any;//编辑的门店编码
  public provList = [];//市列表
  public optwayList = [];//经营类型
  public cityList = [];//区列表
  public areaList = [];//省市区列表
  // public parentList = [];//所属上级列表
  public pcaCode: any;//省市区code
  public provMuster: any;//省
  public cityMuster: any;//市
  public areaMuster: any;//区
  public parentId: any;//所属上级
  public parentOrgName: any;//所属上级名称
  public stoType: any;//门店类型
  public franName: any;//编辑的加盟商名称
  public franCode: any;//编辑的加盟商编码
  public channels: any;//编辑的渠道
  public tel: any;//编辑的联系方式
  public fax: any;//编辑的传真
  public sOwer: any;//编辑的负责人
  public sAddress: any;//编辑的联系地址
  public channelList = []//渠道列表
  public isShow = true;//加盟店显示
  /* 添加 */
  public addisShow = true;//加盟店显示
  public isAddBtn = false;// 判断增加按钮是否点击
  public addpOrgName: any;//所属上级名称
  public addparentId: any;//所属上级
  public partreeList = [];//所属上级列表
  constructor(private httpclient: HttpClient, private route: Router) {

  }

  ngOnInit() {
    this.loadParentsList()// 所属上级
    this.loadProList();//省
    this.loadOptwayList();// 经营类型
    this.loadChanList();// 可售渠道
    this.loadOrganTree();//加载左侧树
  }
  // 所属上级
  loadParentsList() {
    var that = this;
    /* a=1 添加 2 编辑 */
    // var addSetting={
    //   view: {
    //     showLine: false,
    //     fontCss: this.setFontCss_ztree
    //   },
    //   edit: {
    //     enable: true,
    //     showRemoveBtn: false,
    //     showRenameBtn: false
    //   },
    //   data: {
    //     simpleData: {
    //       enable: true
    //     }
    //   },
    //   callback: {
    //     onClick: this.onAddClick
    //   }
    // };
    // var editSetting={
    //   view: {
    //     showLine: false,
    //     fontCss: this.setFontCss_ztree
    //   },
    //   edit: {
    //     enable: true,
    //     showRemoveBtn: false,
    //     showRenameBtn: false
    //   },
    //   data: {
    //     simpleData: {
    //       enable: true
    //     }
    //   },
    //   callback: {
    //     onClick: this.onEditClick
    //   }
    // };
    // var tDom = a == 1 ? 'addtreeDemo' : 'edittreeDemo';
    let Pageurl = '/pcm-admin/organization/childs?orgType=0';
    this.httpclient.get(Pageurl, this.httpOptions).subscribe(
      res => {
        that.isload = true;
        if (res['code'] == 200) {
          var atreeList = res['data'];
          atreeList.forEach((value, index) => {
            value['id'] = value['sid'];
            value['name'] = `${value['name']}(${value['organizationCode']})`;
          })
          let presult = atreeList.reduce(function (prev, item) {
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in presult) {
            presult[prop].forEach(function (item, i) {
              presult[item.id] ? item.children = presult[item.id] : ''
            });
          }
          this.partreeList = presult[0];
          // this.partreeList = atreeList;
          // $.fn.zTree.init($(`#${tDom}`), this.parsetting, this.partreeList);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 省
  loadProList() {
    var prourl = '/pcm-admin/regions?parentId=1&levelType=1';
    this.httpclient.get(prourl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.provList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 可售渠道
  loadChanList() {
    var chanurl = '/pcm-admin/channels';
    this.httpclient.get(chanurl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.channelList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 经营类型
  loadOptwayList() {
    var opturl = '/pcm-admin/dict/finddicts';
    var optParams = {
      "code": "optway"
    }
    this.httpclient.post(opturl, optParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.optwayList = res['data']['dictList'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 加载树
  loadOrganTree() {
    this.treeList = [];
    var that = this;
    this.setting = {
      view: {
        showLine: false,
        fontCss: this.setFontCss_ztree
      },
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
        // beforeDrag: this.beforeDrag,
        // beforeDrop: this.beforeDrop,
        onClick: this.onClick
      }
    };
    let nowPageurl = '/pcm-admin/organization/childs';
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        that.isload = true;
        if (res['code'] == 200) {
          var treeList = res['data'];
          treeList.forEach((value, index) => {
            value['id'] = value['sid'];
            value['name'] = `${value['name']}(${value['organizationCode']})`;
          })
          let result = treeList.reduce(function (prev, item) {
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in result) {
            result[prop].forEach(function (item, i) {
              result[item.id] ? item.children = result[item.id] : ''
            });
          }
          this.treeList = result[0];
          $.fn.zTree.init($('#treeDemo'), this.setting, this.treeList);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  // beforeDrag(treeId, treeNodes) {
  //   for (var i = 0, l = treeNodes.length; i < l; i++) {
  //     if (treeNodes[i].drag === false) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // beforeDrop(treeId, treeNodes, targetNode, moveType) {
  //   return targetNode ? targetNode.drop !== false : true;
  // }

  // 点击事件获取右侧信息
  myclick() {
    let obj = JSON.parse($('input[name="mymsg"]').val());
    // console.log(obj);
    this.stoId = obj.sid;
    //加载右侧信息
    this.loadStoreInfo(obj.sid)
  }
  addclick() {
    let obj2 = JSON.parse($('input[name="onadd"]').val());
    this.addpOrgName = obj2['name'];
    this.addparentId = obj2['sid'];
    console.log(obj2);
    $('#add_Tree').hide();
  }
  editclick() {
    let obj3 = JSON.parse($('input[name="onedit"]').val());
    this.parentOrgName = obj3['name'];
    this.parentId = obj3['sid'];
    $('#edit_Tree').hide();

  }
  loadAddTree(sText, tDom, pDom) {
    $(`#${pDom}`).toggle();
    this.searchItem(sText, tDom);
  }
  // 加载右侧信息
  loadStoreInfo(sid) {
    let that = this;
    this.channels = '';
    this.isShow = true;
    let orUrl = `/pcm-admin/store/ ${sid}`;
    this.httpclient.get(orUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200 && res['data']) {
          // console.log(res['data'],"loadStoreInfo");
          this.extId = res['data']['extSid'];
          this.stoName = res['data']['organizationName'];
          this.stoCode = res['data']['organizationCode'];
          this.parentId = res['data']['parentSid'];
          this.parentOrgName = res['data']['parentOrgName'];
          this.pcaCode = res['data']['areaCode'];
          this.stoType = res['data']['storeType'];
          this.franName = res['data']['parternerName'];
          this.franCode = res['data']['parternerCode'];
          this.channels = res['data']['saleChannelSids'];
          this.tel = res['data']['telephone'];
          this.fax = res['data']['faxNo'];
          this.sOwer = res['data']['shopOwner'];
          this.sAddress = res['data']['shopAddress'];
          // $('#parent').val(this.parentId);//所属上级(编辑)
          // $('#dtlparent').val(this.parentId);//所属上级(详情)
          // console.log(this.parentId,"loadparentId");
          this.stoType = this.stoType == null ? 0 : this.stoType;
          $(`input[name='opeType'][title=${this.stoType}]`).attr("checked", true)//类型(编辑)
          $(`input[name='dtlopeType'][title=${this.stoType}]`).attr("checked", true)//类型（详情）
          // var stype = this.stoType == 1 ? 0 : 1;
          // $(`input[name='opeType'][title=${stype}]`).attr("disabled", true)//类型(编辑)
          // $(`input[name='dtlopeType']`).attr("disabled", true)//类型（详情）
          $("input[name='channel']").removeAttr("checked");//渠道清空(编辑)
          $(`input[name='dtlchannel']`).removeAttr("checked");//渠道清空(详情)
          if (this.channels) {
            var chans = this.channels.split(',');
            // console.log(chans);
            for (var c in chans) {
              $(`input[name='channel'][title=${chans[c]}]`).attr("checked", true);//渠道(编辑)
              $(`input[name='dtlchannel'][title=${chans[c]}]`).attr("checked", true);//渠道(详情)
            }
          } 
          // else {
          //   $(`input[name='channel']`).removeAttr("checked");//渠道(编辑)
          //   $(`input[name='dtlchannel']`).removeAttr("checked");//渠道(详情)
          // }
          var allChanCode = 1;
          $(`input[name='channel'][title=${allChanCode}]`).attr("checked", true);//全渠道(编辑)
          $(`input[name='dtlchannel'][title=${allChanCode}]`).attr("checked", true);//全渠道(详情)
          if (this.pcaCode) {
            // 门店所在省市区
            var pcaurl = `/pcm-admin/region/superiors/${that.pcaCode}`;
            this.httpclient.get(pcaurl, this.httpOptions).subscribe(
              res => {
                this.provMuster = res['data'][1]['id'];
                this.cityMuster = res['data'][2]['id'];
                this.areaMuster = res['data'][3]['id'];
                $('#province').val(that.provMuster);//编辑
                $('#dtlprovince').val(that.provMuster);//详情
                var cityurl = `/pcm-admin/regions?parentId=${this.provMuster}&levelType=2`;
                that.httpclient.get(cityurl, this.httpOptions).subscribe(
                  res => {
                    that.cityList = res['data'];
                    var areaurl = `/pcm-admin/regions?parentId=${that.cityMuster}&levelType=3`;
                    that.httpclient.get(areaurl, this.httpOptions).subscribe(
                      res => {
                        $('#city').val(`${that.cityMuster}`);//编辑
                        $('#dtlcity').val(`${that.cityMuster}`);//详情
                        that.areaList = res['data'];
                        setTimeout(() => {
                          $('#area').val(`${that.areaMuster}`);//编辑
                          $('#dtlarea').val(`${that.areaMuster}`);//详情
                        }, 100);
                      },
                      (err: HttpErrorResponse) => {
                        console.log(err.error);
                      });
                  },
                  (err: HttpErrorResponse) => {
                    console.log(err.error);
                  });
              },
              (err: HttpErrorResponse) => {
                console.log(err.error);
              });
          }
          if (that.stoType) {
            that.isShow = false;
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 左侧树点击
  onClick(event, treeId, treeNode, clickFlag) {
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    // console.log(obj);
    $('.myclick').click();
  }
  onAddClick(event, treeId, treeNode, clickFlag) {
    var obj2 = JSON.stringify(treeNode);
    $('input[name="onadd"]').val(obj2);
    $('.addclick').click();
  }
  onEditClick(event, treeId, treeNode, clickFlag) {
    var obj3 = JSON.stringify(treeNode);
    $('input[name="onedit"]').val(obj3);
    // console.log(obj);
    $('.editclick').click();
  }
  disCity() {
    var proId = !this.isAddBtn ? $('#province').find("option:selected").val() : $('#addprovince').find("option:selected").val();
    if (proId) {
      var cityurl = `/pcm-admin/regions?parentId=${proId}&levelType=2`;
      this.httpclient.get(cityurl, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.cityList = res['data'];
          } else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    }
  }

  disArea() {
    var cityId = !this.isAddBtn ? $('#city').find("option:selected").val() : $('#addcity').find("option:selected").val();
    if (cityId) {

      var areaurl = `/pcm-admin/regions?parentId=${cityId}&levelType=3`;
      this.httpclient.get(areaurl, this.httpOptions).subscribe(
        res => {
          if (res['code'] == 200) {
            this.areaList = res['data'];
          } else {
            this.showWarnWindow(true, res['desc'], 'warning');
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    }
  }
  editItem() {
    this.isAddBtn = false;
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.isShowWarnWin = true;
      this.warnMsg = "请选择要编辑的信息";
      this.btn_type_css = "warning";
      return;
    } else {
      // $('input').val('');
      // $('select').val('');
      var sid = treeNode['sid'];
      this.loadStoreInfo(sid);
      var editSetting = {
        view: {
          showLine: false,
          fontCss: this.setFontCss_ztree
        },
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
          onClick: this.onEditClick
        }
      };
      $.fn.zTree.init($('#edittreeDemo'), editSetting, this.partreeList);
      $("#edit_store").modal("show");
    }
  }
  // 编辑保存
  subStore() {
    var issub = true;
    var that = this;
    if ($('.stoName').val() == '') {
      this.showWarnWindow(true, "门店名称不能为空", "warning");
      return;
    }
    if ($('.stoCode').val() == '') {
      this.showWarnWindow(true, "门店编码不能为空", "warning");
      return;
    }
    if ($("#province").val() == '' || $("#city").val() == '' || $("#area").val() == '') {
      this.showWarnWindow(true, "请选择省市区", "warning");
      return;
    }
    // if ($(".parId").val() == '') {
    //   this.showWarnWindow(true, "请选择所属上级", "warning");
    //   return;
    // }
    // if ($('.franCode').val() == '') {
    //   this.showWarnWindow(true, "加盟商编码不能为空", "warning");
    //   return;
    // }
    // if ($('.franName').val() == '') {
    //   this.showWarnWindow(true, "加盟商名称不能为空", "warning");
    //   return;
    // }
    var chansids = '';
    $('input[name="channel"]:checked').each(function (cindex, citem) {
      // console.log($(citem).attr('title'));
      chansids += $(citem).attr('title') + ","
    })
    var cid = chansids.slice(0, chansids.length - 1);
    if (cid == '') {
      this.showWarnWindow(true, "可售渠道不能为空", "warning");
      return;
    }
    console.log(cid, "cid");

    var params = {
      extSid: that.extId,
      sid: this.stoId,
      organizationName: $(".stoName").val(),//名称
      organizationCode: $(".stoCode").val(),//编码
      parentSid: this.parentId,//所属上级
      areaCode: $('#area').find("option:selected").val(),//省市区
      storeType: $('input[name="opeType"]:checked').attr('title'),//直营or加盟
      parternerCode: $('.franCode').val(),//加盟商编码
      parternerName: $('.franName').val(),//加盟商名称加盟商名称
      saleChannelSids: cid,//可售渠道
      telephone: $(".tel").val(),//联系方式
      faxNo: $(".fax").val(),//传真
      shopOwner: $(".sOwer").val(),//负责人
      shopAddress: $(".sAddress").val()//地址
    }
    var subchurl = "/pcm-admin/store/modify";
    if (issub) {
      this.httpclient.post(subchurl, params, this.httpOptions).subscribe(
        res => {
          // console.log(data);
          if (res['code'] == 200) {
            $("#edit_store").modal("hide");
            this.loadStoreInfo(this.stoId)
            this.showWarnWindow(true, "操作成功!", "success");
          } else {
            this.showWarnWindow(true, res['desc'], "warning");
          }
        }, (err: HttpErrorResponse) => {
          console.log(err.error);
        });
    }
  }
  // showRegular() {
  //   this.addisShow = true;
  // }
  // showFranchise() {
  //   this.addisShow = false;
  //   $('.addfranCode').val();
  //   $('.addfranName').val();
  // }
  cleanArea(obj) {
    if (!obj.checked) {
      $.fn.zTree.destroy();
    }
  }
  addItem() {
    this.isAddBtn = true;
    var addSetting = {
      view: {
        showLine: false,
        fontCss: this.setFontCss_ztree
      },
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
        onClick: this.onAddClick
      }
    };
    $.fn.zTree.init($('#addtreeDemo'), addSetting, this.partreeList);
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      // this.isShowWarnWin = true;
      // this.warnMsg = "请选择业务信息";
      // this.btn_type_css = "warning";
      // return;
      this.addparentId = 0;
      this.addpOrgName = "";
      // $('#addparent').val('').removeAttr('disabled')
    } else {
      // var pId = treeNode['pId'];
      // console.log(treeNode);
      this.addpOrgName = treeNode['name'];
      this.addparentId = treeNode['sid'];
      // pId ? $('#addparent').val(pId).attr('disabled', 'disabled') : $('#addparent').val('').removeAttr('disabled')
    }
    //清除数据
    this.addisShow = true;
    $('.addstoName').val('');
    $('.addstoCode').val('');
    $("#addprovince").val('');
    $("#addcity").val('');
    $("#addarea").val('');
    // $(".addparId").val('');
    $('.addfranCode').val('');
    $('.addfranName').val('');
    $(".addtel").val('');
    $(".addfax").val('');
    $(".addsOwer").val('');
    $(".addsAddress").val('');
    $('input[name="addopeType"][title="0"]').attr('checked', true);
    //显示增加窗体
    $("#add").modal("show");
    // console.log(this.addparentId,"addparentId");
  }
  addStore() {
    if ($('.addstoName').val() == '') {
      this.showWarnWindow(true, "门店名称不能为空", "warning");
      return;
    }
    if ($('.addstoCode').val() == '') {
      this.showWarnWindow(true, "门店编码不能为空", "warning");
      return;
    }
    if ($("#addprovince").val() == '' || $("#addcity").val() == '' || $("#addarea").val() == '') {
      this.showWarnWindow(true, "请选择省市区", "warning");
      return;
    }
    // if ($(".addparId").val() == '') {
    //   this.showWarnWindow(true, "请选择所属上级", "warning");
    //   return;
    // }
    // if ($('.addfranCode').val() == '') {
    //   this.showWarnWindow(true, "加盟商编码不能为空", "warning");
    //   return;
    // }
    // if ($('.addfranName').val() == '') {
    //   this.showWarnWindow(true, "加盟商名称不能为空", "warning");
    //   return;
    // }
    var chansids = ''
    $('input[name="addchannel"]:checked').each(function (cindex, citem) {
      console.log($(citem).attr('title'));
      chansids += $(citem).attr('title') + ","
    })
    var cid = chansids.slice(0, chansids.length - 1)
    if (cid == '') {
      this.showWarnWindow(true, "可售渠道不能为空", "warning");
      return;
    }
    this.isload = false;
    var params = {
      organizationName: $(".addstoName").val(),//名称
      organizationCode: $(".addstoCode").val(),//编码
      parentSid: this.addparentId,//所属上级
      areaCode: $('#addarea').find("option:selected").val(),//省市区
      storeType: $('input[name="addopeType"]:checked').attr('title'),//直营or加盟
      // parternerCode: $('.addfranCode').val(),//加盟商编码
      // parternerName: $('.addfranName').val(),//加盟商名称
      saleChannelSids: cid,//可售渠道
      telephone: $(".addtel").val(),//联系方式
      faxNo: $(".addfax").val(),//传真
      shopOwner: $(".addsOwer").val(),//负责人
      shopAddress: $(".addsAddress").val()//地址
    }
    console.log(params);
    var subchurl = "/pcm-admin/store/save";
    this.httpclient.post(subchurl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "添加成功", "success");
          this.isAddBtn == false;
          $("#add").modal("hide");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  normalInputChange(event) {
    const reg = new RegExp("^[0-9]*$", "g");
    event.target.value = !reg.test(event.target.value) ? "" : event.target.value;
  }
  // 删除
  // showDelWindow(status, warnMsg, btnType) {
  //   this.isShowDelWin = status;
  //   this.warnMsg = warnMsg;
  //   this.btn_type_css = btnType;
  // }
  // 全局弹窗
  showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  // 关闭窗口
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    // this.isShowDelWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      this.loadOrganTree();
    }
  }


  expand_ztree(treeId) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.expandAll(true);
  }

  close_ztree(treeId) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.transformToArray(treeObj.getNodes());
    var nodeLength = nodes.length;
    for (var i = 0; i < nodeLength; i++) {
      if (nodes[i].id == '0') {
        treeObj.expandNode(nodes[i], true, true, false);
      } else {
        treeObj.expandNode(nodes[i], false, true, false);
      }
    }
  }

  searchItem(sText, tDom) {
    var searchCondition = $(`.${sText}`).val();
    var highlightNodes = new Array();
    if (searchCondition != "") {
      var treeObj = $.fn.zTree.getZTreeObj(`${tDom}`);
      highlightNodes = treeObj.getNodesByParamFuzzy("name", searchCondition, null);
    }
    this.highlightAndExpand_ztree(`${tDom}`, highlightNodes, "");
  }

  highlightAndExpand_ztree(treeId, highlightNodes, flag) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var treeNodes = treeObj.transformToArray(treeObj.getNodes());
    for (var i = 0; i < treeNodes.length; i++) {
      treeNodes[i].highlight = false;
      treeObj.updateNode(treeNodes[i]);
    }
    this.close_ztree(treeId);
    if (highlightNodes != null) {
      for (var i = 0; i < highlightNodes.length; i++) {
        if (flag != null && flag != "") {
          if (highlightNodes[i].flag == flag) {
            highlightNodes[i].highlight = true;
            treeObj.updateNode(highlightNodes[i]);
            var parentNode = highlightNodes[i].getParentNode();
            var parentNodes = this.getParentNodes_ztree(treeId, parentNode);
            treeObj.expandNode(parentNodes, true, false, true);
            treeObj.expandNode(parentNode, true, false, true);
          }
        } else {
          highlightNodes[i].highlight = true;
          treeObj.updateNode(highlightNodes[i]);
          var parentNode = highlightNodes[i].getParentNode();
          var parentNodes = this.getParentNodes_ztree(treeId, parentNode);
          treeObj.expandNode(parentNodes, true, false, true);
          treeObj.expandNode(parentNode, true, false, true);
        }
      }
    }
  }


  getParentNodes_ztree(treeId, node) {
    if (node != null) {
      var treeObj = $.fn.zTree.getZTreeObj(treeId);
      var parentNode = node.getParentNode();
      return this.getParentNodes_ztree(treeId, parentNode);
    } else {
      return node;
    }
  }


  setFontCss_ztree(treeId, treeNode) {
    if (treeNode.id == 0) {
      return { color: "#333", "font-weight": "bold" };
    } else if (treeNode.isParent == false) {
      return (!!treeNode.highlight) ? { color: "#ff0000", "font-weight": "bold" } : { color: "#660099", "font-weight": "normal" };
    } else {
      return (!!treeNode.highlight) ? { color: "#ff0000", "font-weight": "bold" } : { color: "#333", "font-weight": "normal" };
    }
  }

}
