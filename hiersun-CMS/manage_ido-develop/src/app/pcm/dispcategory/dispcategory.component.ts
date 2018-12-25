import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { ProductService, TabNo } from '../../services/product.service';

declare var $: any;

@Component({
  selector: 'app-dispcategory',
  templateUrl: './dispcategory.component.html',
  styleUrls: ['./dispcategory.component.css']
})
export class DispcategoryComponent implements OnInit {
  public setting: any; //ztree
  public allList = [];//所有的集合
  public tabId = 0; //选中tab页id
  public itemId: any; //选中的元素id
  public itemName: any; //选中的元素名称
  public itemStatus: any; //选中的元素状态
  public itemObj: any;//右侧的列表 测试 删除
  public generalList = [];//右侧的列表 一般属性
  public gendetList = [];//右侧的列表 一般属性
  public priceList = [];//右侧的列表 价格控制
  public priceInit = [];//价格控制项初始化数据
  public isHint = true;//提示弹窗
  public hintMsg = '';//提示内容
  public mtcateName: any;//分类名称（维护）
  public mtcateCode: any;//分类编码（维护）
  public mtlevel: any;//编辑提交的level
  public mtsid: any;//编辑提交的sid
  public leftList = [];//维护左侧列表
  public leftListSearchBak = [];//维护左侧搜索框备份列表
  // public newList = [];//维护列表(添加过渡)
  public rightList = [];//维护右侧列表
  public rgList = [];//右侧列表初始

  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  //是否显示维护窗体
  public isShowWeiHuModel = false;

  public isload = false;//是否加载
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
  //全局类目操作类型,1
  public globalCategoryType = 1;
  public TabNo;

  constructor(private httpclient: HttpClient, private router: Router, private common: ProductService) {
  }

  /**
   * 初始化加载tree
   */
  ngOnInit() {
    var that = this;
    this.setting = {
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
        beforeDrag: this.beforeDrag,
        beforeDrop: this.beforeDrop,
        onClick: this.onClick
      }
    };
    let nowPageurl = '/pcm-admin/categories/' + this.globalCategoryType;
    // var myobj;
    var disTreeList = [];
    this.httpclient.get(nowPageurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          var myobj = res['data'];
          // console.table(myobj);
          myobj.forEach((value, index) => {
            value['pId'] = value['pid'];
          })
          let result = myobj.reduce(function (prev, item) {
            // console.log(prev,item);
            prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
            return prev;
          }, {});
          for (let prop in result) {
            result[prop].forEach(function (item, i) {
              result[item.id] ? item.children = result[item.id] : ''
            });
          }
          disTreeList = result[0];

          $.fn.zTree.init($('#treeDemo'), that.setting, disTreeList);
          var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
          treeObj.expandAll(true);
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  beforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }

  beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }


  // 树的点击事件
  myclick() {
    let obj = JSON.parse($('input[name="mymsg"]').val());
    //console.log(obj);
    var that = this;
    //  一般属性 post
    //console.log('一般属性id为：' + obj.id);
    // if (this.tabId == 0) {
    //   that.tabGeneral(0);
    // }
    // if (this.tabId == 1) {
    //   that.tabPrice(1);
    // }
    this.tabGeneral(0);
  }

  onClick(event, treeId, treeNode, clickFlag) {
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    // console.log(obj);
    $('.myclick').click();
  }

  addItem() {
    $('.cateName').val('');
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.isShowWarnWin = true;
      this.warnMsg = "请选择分类信息";
      this.btn_type_css = "warning";
      return;
    }
    //显示增加窗体
    $("#add").modal("show");
  }

  subAdd() {
    var that = this;
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    // isParent = treeNode.isParent;
    //console.log(treeNode);
    var a = $('.cateName').val();
    var params = {
      categoryName: $('.cateName').val(),
      categoryType: this.globalCategoryType,
      isDisplay: $('input[name="cateStatus"]:checked').attr('title'),
      parentSid: treeNode.id
    };
    console.log(params);
    var addurl = '/pcm-admin/category/save';
    this.httpclient.post(addurl, params, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          if (treeNode) {
            treeNode = zTree.addNodes(treeNode, { name: res["data"]["categoryName"], id: res["data"]["sid"], isParent: res["data"]["isParent"] });
            if (nodes.length > 0) {
              zTree.updateNode(nodes[0]);
            }
          } else {
            //root阶段
            treeNode = zTree.addNodes(null, { pId: 0, name: res["data"]["categoryName"], id: res["data"]["sid"], isParent: res["data"]["isParent"] });
          }
        } else {
          that.showWarnWindow(true, "操作失败[" + res['code'] + "]", "danger");
        };
        //关闭窗口
        $("#add").modal('hide');
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
    // if (treeNode) {
    //   zTree.editName(treeNode[0]);
    // } else {
    //   alert("叶子节点被锁定，无法增加子节点");
    // }
  }

  editItem() {
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.isShowWarnWin = true;
      this.warnMsg = "请选择分类信息";
      this.btn_type_css = "warning";
      return;
    }
    //显示编辑窗体
    $("#edit").modal("show");
    this.itemName = treeNode.categoryName;
    this.itemStatus = treeNode.isDisplay;
    $(`input[name='ecateStatus'][title=${this.itemStatus}]`).attr('checked', true);//类型
  }

  subEdit() {
    var that = this;
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    if (nodes.length == 0) {
      that.showWarnWindow(true, "请选择节点信息", "warning");
      return;
    }
    var eparams = {
      categoryName: $('.ecateName').val(),
      categoryType: this.globalCategoryType,
      isDisplay: $('input[name="ecateStatus"]:checked').attr('title'),
      parentSid: treeNode.pid,
      sid: treeNode.id
    };
    console.log(eparams);
    var editurl = '/pcm-admin/category/modify';
    this.httpclient.post(editurl, eparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          zTree.editName(nodes[0]);
          zTree.cancelEditName($('.ecateName').val());
          //关闭窗口
          $("#edit").modal('hide');
        } else {
          this.showWarnWindow(true, "操作失败", "danger");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  /**
   * 停用分类信息
   */
  stopItem() {
    var that = this;
    //获取当前选择的节点信息
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    console.log(treeNode);

    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      that.showWarnWindow(true, "请选择节点信息", "warning");
      return;
    } else if (treeNode["isLeaf"] == "N") {
      that.showWarnWindow(true, "请选择子级节点信息", "warning");
      return;
    }
    //调用接口
    var editurl = '/pcm-admin/category_stop/' + treeNode["id"];
    this.httpclient.get(editurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          //停用
          this.showWarnWindow(true, "操作成功", "success");
          return;
        } else {
          this.showWarnWindow(true, "操作失败", "danger");
          return;
        }
      },
      (err: HttpErrorResponse) => {
        this.showWarnWindow(true, "操作失败", "danger");
        console.log(err.error);
        return;
      }
    );
  }

  /**
   * 删除节点信息
   */
  delItem() {
    var that = this;
    //获取当前选择的节点信息
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      that.showWarnWindow(true, "请选择节点信息", "warning");
      return;
    } else if (treeNode["isLeaf"] == "N") {
      that.showWarnWindow(true, "请选择子级节点信息", "warning");
      return;
    }
    //调用接口
    var editurl = '/pcm-admin/category_del/' + treeNode["id"];
    this.httpclient.get(editurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          //停用
          this.showWarnWindow(true, "操作成功", "success");
          //删除tree节点
          var callbackFlag = $('#callbackTrigger').attr('checked');
          zTree.removeNode(treeNode, callbackFlag);
        } else {
          this.showWarnWindow(true, "操作失败:" + res["desc"], "danger");
          return;
        }
      },
      (err: HttpErrorResponse) => {
        this.showWarnWindow(true, "操作失败;", "danger");
        console.log(err.error);
        return;
      }
    );
  }

  // 切换一般属性
  tabGeneral(gt) {
    this.isload = false;
    let obj = JSON.parse($('input[name="mymsg"]').val());
    this.tabId = gt;
    var gparams = {
      'categorySid': obj.id,
      'currentPage': 1,
      'level': gt,
      'pageSize': 1000
    };
    var gurl = '/pcm-admin/propsdict/get_category_relateprops';
    this.httpclient.post(gurl, gparams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          //清除生成的属性值项
          $(".detshow").remove();
          $(".detshow_tr").remove();
          this.generalList = res['data']['content'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning')
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  //是否展开
  /*public isOpened = false;*/
  // 查看一般属性 详情
  detailGeneral(id, index, psid, event) {
    var that = this;
    var deturl = "/pcm-admin/propsdict/get_propsdict/" + psid;
    this.httpclient.get(deturl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (!res['data']['categoryValueSaveVos']) {
          return;
        }
        this.gendetList = res['data']['categoryValueSaveVos'];
        var con;
        this.gendetList.forEach(function (v, i) {
          return con += `<tr role="row" class="detshow_tr"><td style="text-align: center">${v.sid}</td><td style="text-align: center">${v.valuesSid}</td><td style="text-align: center">${v.valuesDesc}</td>`;
        });
        con = con.substring(9);
        //父级元素
        const trObj = $(event.target).parent().parent("tr");
        //添加前先清空添加的内容:
        trObj.nextUntil(".odd").remove();
        //获取按钮文本,判断展开还是关闭
        let isOpened = event.target.innerHTML == "-";
        if (isOpened) {
          event.target.innerHTML = "+";
        } else {
          var tbleHtml = `<tr class="detshow_tr"><td></td><td colspan="5"><table class="table table-striped table-bordered table-hover dataTable" id="sample_6" role="grid" aria-describedby="sample_6_info"><thead><tr class="detshow_tr"><th style="text-align: center">属性值ID</th><th style="text-align: center">属性值编号</th><th style="text-align: center">属性值名称</th></tr></thead><tbody><tr>${con}</tr></tbody></table></td></tr>`;
          $(`.det${index}`).after(tbleHtml);
          event.target.innerHTML = "-";
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    )
    // console.log($('.detshow').is(':hidden'));
    // if ($('.detshow').is(':hidden')) {//如果当前显示
    //   $('.detshow').show();//就显示div
    // } else {//否则
    //   $('.detshow').hide();//隐藏div
    // }
  }

  //保存所有的数据数组
  public allDataList = [];
  // 维护
  Maintain() {
    //初始化数据
    this.leftList = [];
    this.rgList = [];
    this.allDataList = [];
    $("#wh_propName").val("");

    var that = this;
    // $('.tabGenList').css({ "display": "none" })
    let obj = JSON.parse($('input[name="mymsg"]').val());
    this.mtcateName = obj.name;
    this.mtcateCode = obj.id;
    this.mtlevel = obj.level;
    this.mtsid = obj.id;
    this.rgList = [];
    if (this.generalList != null && this.generalList.length > 0) {
      this.generalList.map(function (v, i) {
        console.log('generalList_v', v);
        that.rgList.push({
          level: v.level,
          propName: v.propsName,
          propSid: v.propsSid,
          notNull: v.notNull
        });
      });
    }
    this.rightList = that.rgList;
    const mturl = '/pcm-admin/propsdict/get_propsdicts';
    const mtrams = {
      'channelCode': '0',
      'isKeyProp': '0,2,3'
    };
    this.httpclient.post(mturl, mtrams, this.httpOptions).subscribe(
      res => {
        //备份
        this.allDataList = res['data'];
        //过滤掉已经持有的属性信息
        res['data'].forEach(function (v, i) {
          let isFind = false;
          that.rgList.forEach(function (r, ri) {
            if (v.sid == r.propSid) {
              isFind = true;
            }
          });
          //添加 不存在的元素到列表中
          if (!isFind) {
            that.leftList.push(v);
          }          
        });
        //备份左侧列表
        this.leftListSearchBak = this.leftList.slice(0);
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  newArr(aid) {
    const that = this;
    var notNull;
    $(`#check${aid}`).prop('checked') == true ? notNull = 1 : notNull = 0;
    this.rightList.push({
      level: $(`#level${aid}`).val(),
      propName: $(`.name${aid}`).text(),
      propSid: aid,
      notNull: notNull
    });
    //删除左侧列表对应的数据
    this.leftList.map(function (v, i) {
      if (v.sid == aid) {
        that.leftList.splice(i, 1);
      }
    });
    //删除备份中的数据
    this.leftListSearchBak.map(function (v, i) {
      if (v.sid == aid) {
        that.leftListSearchBak.splice(i, 1);
      }
    });
  }

  // toRight() {
  //   this.rightList.push({
  //     // valuesDesc: $('.valdesc').val(),
  //     // valuesName: $('.valname').val()
  //   })
  //   this.rightList = this.newList;
  //   this.newList.map(function (v, i) {
  //     console.log(v, i);
  //     $(`.isdis${v.propSid}`).css({ display: "none" })
  //   })
  //   console.log(this.rightList);
  //   this.newList = this.rightList
  // }
  back(bid) {
    var that = this;
    this.rightList.forEach(function (v, i) {
      if (v.propSid == bid) {
        //删除右侧
        that.rightList.splice(i, 1);
        //添加到左侧列表中
        that.allDataList.forEach(function (v, i) {
          //找到匹配的项
          if (v.sid == bid) {
            that.leftList.push(v);
            that.leftListSearchBak.push(v);
          }
        });
      }
    });
    //重新搜索
    this.searchPropsByName();
  }
  subMaintain() {
    var that = this;
    var mtParams = {
      'actType': 0,
      'categoryPropInfos': this.rightList,
      'categorySid': this.mtsid,
      'categoryType': this.globalCategoryType
    };
    var smturl = `/pcm-admin/category_prop/save`;
    this.httpclient.post(smturl, mtParams, this.httpOptions).subscribe(
      res => {
        // that.tabPrice(1)
        if (res["code"] == 200) {
          //隐藏窗口
          $("#maintain").modal("hide");
          //刷新右侧属性列表
          this.tabGeneral(0);
        } else {
          this.showWarnWindow(true, "操作失败;", "danger");
          return;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }

  showWeiHuModel() {
    //获取当前选择的节点信息
    var zTree = $.fn.zTree.getZTreeObj('treeDemo'),
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
    //如果没有选择节点,则返回信息
    if (nodes.length == 0) {
      this.showWarnWindow(true, "请选择分类信息;", "warning");
      return;
    }
    //显示维护窗体
    $("#maintain").modal("show");
  }

  /**
   * 维护框通过属性名字搜索属性
   */
  searchPropsByName() {
    const refThis = this;
    const propName = $.trim($("#wh_propName").val());
    if (propName == '' || propName.length == 0) {
      this.leftList = this.leftListSearchBak.slice(0);
      return;
    }
    //遍历左侧列表
    refThis.leftList.splice(0, refThis.leftList.length);
    this.leftListSearchBak.map(function (v, i) {
      const pNameExp = new RegExp(propName);
      if (pNameExp.test(v.propsName)) {
        refThis.leftList.push(v);
      }
    });
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
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }
}
