
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: "app-editstore",
  templateUrl: "./editstore.component.html",
  styleUrls: ["./editstore.component.css"]
})
export class EditstoreComponent implements OnInit {
  public stoId: any; //编辑的id
  public extId: any; //扩展信息字段
  public stoName: any; //编辑的门店名称
  public stoCode: any; //编辑的门店编码
  public provList = []; //市列表
  public cityList = []; //区列表
  public areaList = []; //省市区列表
  public partreeList = []; //所属上级列表
  public editSetting: any; //上级ztree
  public pcaCode: any; //省市区code
  public provMuster: any; //省
  public cityMuster: any; //市
  public areaMuster: any; //区
  public parentId: any; //所属上级
  public parentOrgName: any;//所属上级名称
  public stoType: any; //门店类型
  public franName: any; //编辑的加盟商名称
  public franCode: any; //编辑的加盟商编码
  public channels: any; //编辑的渠道
  public tel: any; //编辑的联系方式
  public fax: any; //编辑的传真
  public sOwer: any; //编辑的负责人
  public sAddress: any; //编辑的联系地址
  public channelList = []; //渠道列表
  public isShow = true; //加盟店显示
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = true; // 改为true

  public optwayList = []; //经营类型
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf-8"
    })
  };

  constructor(
    private httpclient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.stoId = queryParams.stoid;
    });
  }

  ngOnInit() {
    this.loadParentsList();//所属上级
    this.loadOptwayList();// 经营类型
    this.loadRegionsList();//省
    this.loadChannelList();// 可售渠道
    this.loadStoreInfo();
  }
  // 所属上级
  loadParentsList() {
    var that = this;
    this.editSetting = {
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
          $.fn.zTree.init($('#edittreeDemo'), this.editSetting, this.partreeList);
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
    var opturl = "/pcm-admin/dict/finddicts";
    var optParams = {
      code: "optway"
    };
    this.httpclient.post(opturl, optParams, this.httpOptions).subscribe(
      res => {
        if (res["code"] == 200) {
          this.optwayList = res["data"]["dictList"];
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 加载省市区
  loadRegionsList() {
    var prourl = "/pcm-admin/regions?parentId=1&levelType=1";
    this.httpclient.get(prourl, this.httpOptions).subscribe(
      res => {
        if (res["code"] == 200) {
          this.provList = res["data"];
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // 加载渠道列表
  loadChannelList() {
    var chanurl = "/pcm-admin/channels";
    this.httpclient.get(chanurl, this.httpOptions).subscribe(
      res => {
        if (res["code"] == 200) {
          this.channelList = res["data"];
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }
      },
      function (err) {
        console.log(err);
      }
    );
  }
  onEditClick(event, treeId, treeNode, clickFlag) {
    var obj3 = JSON.stringify(treeNode);
    $('input[name="onedit"]').val(obj3);
    // console.log(obj);
    $('.editclick').click();
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
  /* 加载编辑信息 */
  loadStoreInfo() {
    let that = this;
    this.channels = "";
    this.isShow = true;
    // 编辑的门店信息
    var editsurl = `/pcm-admin/store/${this.stoId}`;
    this.httpclient.get(editsurl, this.httpOptions).subscribe(
      res => {
        if (res["code"] == 200) {
          this.extId = res["data"]["extSid"];
          this.stoName = res["data"]["organizationName"];
          this.stoCode = res["data"]["organizationCode"];
          this.parentId = res["data"]["parentSid"];
          this.parentOrgName = res['data']['parentOrgName'];
          this.pcaCode = res["data"]["areaCode"];
          var stoType = res["data"]["storeType"];
          this.franName = res["data"]["parternerName"];
          this.franCode = res["data"]["parternerCode"];
          this.channels = res["data"]["saleChannelSids"];
          this.tel = res["data"]["telephone"];
          this.fax = res["data"]["faxNo"];
          this.sOwer = res["data"]["shopOwner"];
          this.sAddress = res["data"]["shopAddress"];
          // $("#parent").val(this.parentId); //所属上级
          $(`input[name='opeType'][title=${stoType}]`).attr("checked", true); //类型
          $("input[name='channel']").removeAttr("checked"); //渠道清空(编辑)
          if (this.channels) {
            var chans = this.channels.split(",");
            // console.log(chans);
            for (var c in chans) {
              $(`input[name='channel'][title=${chans[c]}]`).attr(
                "checked",
                true
              ); //渠道
            }
          }
          var allChanCode = 1;
          $(`input[name='channel'][title=${allChanCode}]`).attr("checked", true);//全渠道(编辑)
          if (this.pcaCode) {
            // 门店所在省市区
            var pcaurl = `/pcm-admin/region/superiors/${that.pcaCode}`;
            this.httpclient.get(pcaurl, this.httpOptions).subscribe(
              res => {
                this.provMuster = res["data"][1]["id"];
                this.cityMuster = res["data"][2]["id"];
                this.areaMuster = res["data"][3]["id"];
                $("#province").val(that.provMuster);
                var cityurl = `/pcm-admin/regions?parentId=${
                  this.provMuster
                  }&levelType=2`;
                that.httpclient.get(cityurl, this.httpOptions).subscribe(
                  res => {
                    that.cityList = res["data"];
                    var areaurl = `/pcm-admin/regions?parentId=${
                      that.cityMuster
                      }&levelType=3`;
                    that.httpclient.get(areaurl, this.httpOptions).subscribe(
                      res => {
                        $("#city").val(`${that.cityMuster}`);
                        that.areaList = res["data"];
                        setTimeout(() => {
                          $("#area").val(`${that.areaMuster}`);
                        }, 100);
                      },
                      (err: HttpErrorResponse) => {
                        console.log(err.error);
                      }
                    );
                  },
                  (err: HttpErrorResponse) => {
                    console.log(err.error);
                  }
                );
              },
              (err: HttpErrorResponse) => {
                console.log(err.error);
              }
            );
          }
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }

        // if (that.stoType) {
        //   that.isShow = false;
        // }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  disCity() {
    var that = this;
    var proId = $("#province")
      .find("option:selected")
      .val();
    var cityurl = `/pcm-admin//regions?parentId=${proId}&levelType=2`;
    this.httpclient.get(cityurl, this.httpOptions).subscribe(
      res => {
        // console.log(data);
        this.cityList = res["data"];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  disArea() {
    var that = this;
    var cityId = $("#city")
      .find("option:selected")
      .val();
    var areaurl = `/pcm-admin/regions?parentId=${cityId}&levelType=3`;
    this.httpclient.get(areaurl, this.httpOptions).subscribe(
      res => {
        // console.log(data);
        if (res["code"] == 200) {
          this.areaList = res["data"];
        } else {
          this.showWarnWindow(true, res["desc"], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }
  // showRegular() {
  //   this.isShow = true;
  // }
  // showFranchise() {
  //   this.isShow = false;
  //   this.franName = '';
  //   this.franCode = '';
  // }
  subStore() {
    var issub = true;
    var that = this;
    if ($(".stoName").val() == "") {
      this.showWarnWindow(true, "门店名称不能为空", "warning");
      return;
    }
    if ($(".stoCode").val() == "") {
      this.showWarnWindow(true, "门店编码不能为空", "warning");
      return;
    }
    if (
      $("#province").val() == "" ||
      $("#city").val() == "" ||
      $("#area").val() == ""
    ) {
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
    var chansids = "";
    $('input[name="channel"]:checked').each(function (cindex, citem) {
      // console.log($(citem).attr('title'));
      chansids += $(citem).attr("title") + ",";
    });
    var cid = chansids.slice(0, chansids.length - 1);
    if (cid == "") {
      this.showWarnWindow(true, "可售渠道不能为空", "warning");
      return;
    }
    var params = {
      extSid: this.extId,
      sid: this.stoId,
      organizationName: $(".stoName").val(), //名称
      organizationCode: $(".stoCode").val(), //编码
      parentSid: $(".parId").val(), //所属上级
      areaCode: $("#area")
        .find("option:selected")
        .val(), //省市区
      storeType: $('input[name="opeType"]:checked').attr("title"), //直营or加盟
      // parternerCode: $('.franCode').val(),//加盟商编码
      // parternerName: $('.franName').val(),//加盟商名称加盟商名称
      saleChannelSids: cid, //可售渠道
      telephone: $(".tel").val(), //联系方式
      faxNo: $(".fax").val(), //传真
      shopOwner: $(".sOwer").val(), //负责人
      shopAddress: $(".sAddress").val() //地址
    };
    var subchurl = "/pcm-admin/store/modify";
    if (issub) {
      this.httpclient.post(subchurl, params, this.httpOptions).subscribe(
        res => {
          // console.log(data);
          if (res["code"] == 200) {
            this.showWarnWindow(true, "添加成功,返回列表页", "success");
          } else {
            this.showWarnWindow(true, res["desc"], "warning");
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }

  goBack() {
    this.route.navigate(["/pcm/store"]);
  }
  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  //  关闭窗口
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == "success") {
      that.route.navigate(["/pcm/store"]);
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
      if (nodes[i].id == "0") {
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
      highlightNodes = treeObj.getNodesByParamFuzzy(
        "name",
        searchCondition,
        null
      );
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
      return !!treeNode.highlight
        ? { color: "#ff0000", "font-weight": "bold" }
        : { color: "#660099", "font-weight": "normal" };
    } else {
      return !!treeNode.highlight
        ? { color: "#ff0000", "font-weight": "bold" }
        : { color: "#333", "font-weight": "normal" };
    }
  }
}
