import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Router } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-addstore',
  templateUrl: './addstore.component.html',
  styleUrls: ['./addstore.component.css']
})
export class AddstoreComponent implements OnInit {
  public isShow = true;//加盟店显示
  public provList = [];//省的列表显示
  public cityList = [];//市列表显示
  public areaList = [];//区列表显示
  public channelList = []//渠道列表
  public parentList = []//所属上级列表
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public optwayList = [];//经营类型
  /* 添加 */
  public addisShow = true;//加盟店显示
  public isAddBtn = false;// 判断增加按钮是否点击
  public addpOrgName: any;//所属上级名称
  public addparentId='';//所属上级
  public partreeList = [];//所属上级列表
  public parsetting: any; //上级ztree
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };


  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = false;
    this.loadProv();
    this.loadParentsList();
    this.loadChannel();
    this.loadOptwayList();// 经营类型
    this.isload = true;
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
  // 加载省市区
  loadProv() {
    var prourl = '/pcm-admin//regions?parentId=1&levelType=1';
    this.httpclient.get(prourl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.provList = res['data']
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  // 所属上级
  loadParentsList() {
    var that = this;
    this.parsetting = {
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
          console.log(this.partreeList);
          
          $.fn.zTree.init($('#addtreeDemo'), this.parsetting, this.partreeList);
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 所属上级
  // loadParent() {
  //   var parurl = '/pcm-admin//companies/all';
  //   this.httpclient.get(parurl, this.httpOptions).subscribe(
  //     res => {
  //       if (res['code'] == 200) {
  //         this.parentList = res['data'];
  //       }
  //     }, (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     }
  //   )
  // }
  // 可售渠道
  loadChannel() {
    this.isload = false;
    var chanurl = '/pcm-admin//channels';
    this.httpclient.get(chanurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.channelList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }
  disCity() {
    var proId = $('#province').find("option:selected").val();
    var cityurl = `/pcm-admin//regions?parentId=${proId}&levelType=2`;
    this.httpclient.get(cityurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.cityList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  disArea() {
    var cityId = $('#city').find("option:selected").val();
    var areaurl = `/pcm-admin//regions?parentId=${cityId}&levelType=3`;
    this.httpclient.get(areaurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.areaList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
  }

  // showRegular() {
  //   this.isShow = true;
  // }
  // showFranchise() {
  //   this.isShow = false;
  //   $('.franCode').val();
  //   $('.franName').val();
  // }

  onAddClick(event, treeId, treeNode, clickFlag) {
    var obj2 = JSON.stringify(treeNode);
    $('input[name="onadd"]').val(obj2);
    $('.addclick').click();
  }
  addclick() {
    let obj2 = JSON.parse($('input[name="onadd"]').val());
    this.addpOrgName = obj2['name'];
    this.addparentId = obj2['sid'];
    console.log(obj2);
    $('#add_Tree').hide();
  }
  loadAddTree(sText, tDom, pDom) {
    $(`#${pDom}`).toggle();
    this.searchItem(sText, tDom);
  }
  subStore() {
    this.isload = false;
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
    if (!this.addparentId) {
      this.showWarnWindow(true, "请选择所属上级", "warning");
      return;
    }
/*     if ($('.franCode').val() == '') {
      this.showWarnWindow(true, "加盟商编码不能为空", "warning");
      return;
    }
    if ($('.franName').val() == '') {
      this.showWarnWindow(true, "加盟商名称不能为空", "warning");
      return;
    } */
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
    // console.log('添加成功');
    var params = {
      organizationName: $(".stoName").val(),//名称
      organizationCode: $(".stoCode").val(),//编码
      parentSid: this.addparentId,//所属上级
      areaCode: $('#area').find("option:selected").val(),//省市区
      storeType: $('input[name="addopeType"]:checked').attr('title'),//直营or加盟
      // parternerCode: $('.franCode').val(),//加盟商编码
      // parternerName: $('.franName').val(),//加盟商名称
      saleChannelSids: cid,//可售渠道
      telephone: $(".tel").val(),//联系方式
      faxNo: $(".fax").val(),//传真
      shopOwner: $(".sOwer").val(),//负责人
      shopAddress: $(".sAddress").val()//地址
    }
    console.log(params);
    var subchurl = "/pcm-admin//store/save";
    this.httpclient.post(subchurl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "添加成功,返回列表页", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }

  goBack() {
    this.route.navigate(['/pcm/store'])
  }
  /**
* 全局弹窗
*/
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  /**
   * 关闭窗口
   */
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/pcm/store'])
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
