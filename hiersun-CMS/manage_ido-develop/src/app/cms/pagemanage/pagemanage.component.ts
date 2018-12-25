import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-pagemanage',
  templateUrl: './pagemanage.component.html',
  styleUrls: ['./pagemanage.component.css']
})
export class PagemanageComponent implements OnInit {
  list: any;
  siteId: any;//站点ID
  delId: any;//站点ID
  isHint = false;// 提示语
  hintMsg: any;// 提示语
  msgIndex: any; // 右侧显示信息的排序
  formData: any; // 上传logo参数
  // mymsgCn:any; // 有自身页面时的中文名称
  // mymsgEn:any; // 有自身页面时的英文名称
  msgEnglish: any;// 右侧显示信息英文名
  msgId: any; // 右侧显示信息id
  msgTitle: any; //右侧信息中文名
  msgUrl: any; // 右侧信息链接
  pId: any; //右侧显示信息父级id
  msgType = 1; //默认新增频道type=1
  pageId = ''; //编辑页面信息时记录ID
  pageNo = 1; //默认第一页
  istype = 1;// 右侧显示信息按钮的type
  newproductid = false; //区分单戒对戒
  // isTwotree=false; 
  addnewChild = false; // 新增页面的显示隐藏
  isAddnew = false; // 选择系列和商品时区分显示的input框
  newchildType: any; // 区分页面和子页面的type
  isnewPage = true; // 判断右侧显示信息有没有自身页面
  ischild = false; //是否有子集,显示删除按钮
  imgchange = false; //编辑过程中是否改变logo
  isNourl = false; // 是否有外链
  isload = true; // 是否加载
  canyulan = false; // 是否可以预览
  addnewchannel: any; // 区分新增频道和编辑
  // ispageid:any; // 区分新增页面和编辑页面
  isSetmsg = false;//初始不显示,点击编辑显示
  haveChild = false;//有子集
  islook = false; // 是否可以查看
  index: any;//表示请求的第一级首页
  allList = [];//所有频道的集合
  twoList = [];//二级目录的集合
  threeList = [];//三级目录的集合
  fourList = [];//四级目录的集合
  fiveList = [];//五级目录的集合
  btnlist = [];//显示按钮的集合
  serieslists: any;// 系列选择集合
  prolists: any;// 产品选择集合
  msgList = []; // 右侧信息展示按钮的集合
  childList = [];// 右侧子页面信息列表
  extchildList = [];//已有页面
  pagenumList = [1];// 分页页码
  isCandel = false;// 可以删除的频道
  delType: any;// 区分删除的操作;
  setornew: any;//区分新增频道和编辑频道
  isTDK = false;
  TDKhint: any;
  tdklist = [];
  TDKsuelist: any;
  setting: any;
  siteType: any;
  channelid: any;
  copyPageId: any;//所要复制的页面id
  removePageId: any;//所要移动的页面id
  pageCount: any;//总页码
  public eventx: any;//获取鼠标的x
  public eventy: any;//获取鼠标的y
  public headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.existingpage()
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(5)').addClass('active');
    $("body").bind(//鼠标点击事件不在节点上时隐藏右键菜单  
      "mousedown",
      function (event) {
        if (!(event.target.id == "rMenu" || $(event.target)
          .parents("#rMenu").length > 0)) {
          $("#rMenu").hide();
        }
      });
    var that = this;
    //请求站点
    var url = '/api/cms/site/list';
    this.http.get(url).subscribe(
      function (data) {
        console.log(data['body']);
        that.isload = false;
        if (data['header'].code == 200) {
          that.list = data['body'];
          /* that.pagefuction() */
          that.sitechoose(that.list[0].id);
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      })
    this.setting = {
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true
        },
        key:{
          name:'showName'
        }
      },
      callback: {
        beforeDrag: this.common.beforeDrag,
        beforeDrop: this.common.beforeDrop,
        onClick: this.ztreeClick,
        onRightClick: this.zTreeOnRightClick
      }
    };
  }
  //右键  
  zTreeOnRightClick(event, treeId, treeNode) {
    /* console.log(treeId);
    console.log(treeNode); */
    var that = this;
    that.eventx = event.clientX - 280;
    that.eventy = event.clientY - 194;
    //console.log(that.eventx)
    var obj = JSON.stringify(treeNode);
    $('input[name="rightmsg"]').val(obj);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (!treeNode) {
      zTree.cancelSelectedNode();
      $(".rightclick").click();
      $("#rMenu").show();
      $("#rMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
    } else if (treeNode && !treeNode.noR) { //noR属性为true表示禁止右键菜单  
      if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {
        zTree.cancelSelectedNode();
        $(".rightclick").click();
        $("#rMenu").show();
        $("#rMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
      } else {
        zTree.selectNode(treeNode);
        $(".rightclick").click();
        $("#rMenu").show();
        $("#rMenu").css({ "top": that.eventy + "px", "left": that.eventx + "px", "display": "block" });
      }
    }

  };
  rightclick() {
    $("#rMenu li").show();
    let obj = JSON.parse($('input[name="rightmsg"]').val());
    //console.log(obj);
    var that = this;
    var myobj;
    let nowPageurl = '/api/cms/channel/desc/' + obj.id;
    this.http.get(nowPageurl).subscribe(
      data => {
        //console.log('频道详情',data);
        if (data['header'].code == 200) {
          myobj = data['body'];
          this.channelid = myobj.id;
          if (myobj.siteType == 1) {
            $("#pcground").show();
            $("#mground").hide();
          } else {
            $("#pcground").hide();
            $("#mground").show();
          }
        }
      },
      err => { console.log(err) }
    )
  }
  clickme() {
    $("#rMenu").hide();
  }
  sitechoose(id) {
    $("#choosesite").val(id);
    $(".sitetips").hide();
    $(".row").show();
    this.channelid="";
    this.siteId = $("#choosesite").val();
    var that = this;
    var serieslist = "/api/cms/page/series-list?siteId=" + $("#choosesite").val();
    this.http.get(serieslist).subscribe(function (data) {
      that.serieslists = data['body'];
    }, function (err) {
      console.log(err)
    })
    // 商品管理
    var prolist = "/api/cms/page/product-list?siteId=" + $("#choosesite").val();
    this.http.get(prolist).subscribe(function (data) {
      that.prolists = data['body'];
    }, function (err) {
      console.log(err)
    })
    this.index = '首页'
    var oneUrl = '/api/cms/channel/list-channel?siteId=' + $("#choosesite").val();
    this.http.get(oneUrl).subscribe(
      data => {
        console.log(data);
        if (data['header'].code == 200) {
          let oneMsgid = '';
          that.allList = data['body'];
          for (var i = 0; i < data['body'].length; i++) {
            if (data['body'][i].pId == 0) {
              data['body'][i].open = true;
              that.msgTitle = data['body'][i].name;
              that.msgIndex = data['body'][i].orders;
              that.msgId = data['body'][i].id;
              that.msgEnglish = data['body'][i].fileName;
              $('.haveUrl').hide();
              $('.noUrl').show();
              $('.msg_box input').attr('readonly', 'readonly')
              $('.channelLogo img').attr('src', data['body'][i].icon);
              let nowPageurl = '/api/cms/channel/desc/' + that.msgId;
              this.http.get(nowPageurl).subscribe(
                data => {
                  //console.log('频道详情', data);
                  if (data['header'].code == 200) {
                    let childUrl = '/api/cms/page/page-list?pageNo=' + 1 + '&pageSize=' + 10 + '&channelId=' + data['body'].id + '&siteId=' + $("#choosesite").val();
                    this.http.get(childUrl).subscribe(
                      data => {
                        //console.log(data);
                        that.isload = false;
                        if (data['header'].code == 200 && data['body'].totalCount > 0) {
                          that.haveChild = true;
                          that.childList = data['body'].list;
                          that.pageNo = data['body'].pageNo;
                          /* $('.pagination>li:nth-child(2)').addClass('active');
                          for (var i = 0; i < data['body'].pageCount-1; i++) {
                            that.pagenumList.push(1)
                          } */
                          that.pageCount = data['body'].pageCount;
                          $("#pagination1").pagination({
                            currentPage: that.pageNo,
                            totalPage: that.pageCount,
                            callback: function (current) {
                              that.pageNo = current;
                              that.pagenumber(that.pageNo)
                            }
                          });

                        } else {
                          that.haveChild = false;
                        }
                      },
                      err => { console.log(err) }
                    )
                  }
                },
                err => { console.log(err) }
              )
            }
          }
          $.fn.zTree.init($("#treeDemo"), that.setting, that.allList);
          this.common.setCheck2();
        }
      },
      err => { console.log(err) }
    )
  }
  // 树状图所有点击事件

  myclick() {
    let obj = JSON.parse($('input[name="mymsg"]').val());
    //console.log("555555")
    //console.log(obj);
    var that = this;
    this.isload = true;
    this.btnlist = [];
    this.pagenumList = [1];
    $('.changeUrl').hide();
    $('.addChannel').show();
    $('.setMsg').show();
    $('.allset').show();
    var myobj;
    let nowPageurl = '/api/cms/channel/desc/' + obj.id;
    this.http.get(nowPageurl).subscribe(
      data => {
        //console.log('频道详情',data);
        if (data['header'].code == 200) {
          myobj = data['body'];
          this.msgTitle = myobj.name;
          this.msgIndex = myobj.orders;
          this.msgId = myobj.id;
          this.msgEnglish = myobj.fileName;
          this.msgType = myobj.type;
          this.pId = myobj.pId;
          this.isSetmsg = false;
          this.isCandel = false;
          this.siteType = myobj.siteType;
          this.channelid = myobj.id;
          if (!myobj.pId) {
            this.istype = 1;
            this.pId = 0;
          } else if (myobj.type == 2) {
            this.istype = 2;
            this.msgUrl = myobj.url;
            $('.haveUrl').show();
            $('.noUrl').hide();
            $('.msg_box input').attr('readonly', 'readonly');
          } else {
            this.istype = 3;
          }
          if (this.istype != 2) {
            $('.haveUrl').hide();
            $('.noUrl').show();
            $('.msg_box input').attr('readonly', 'readonly')
            $('.channelLogo img').attr('src', obj.icon)
            if (myobj.pageId && myobj.pageId != 0) {
              this.isnewPage = false;
              let onrUrl = '/api/cms/page/desc/' + myobj.pageId;
              that.http.get(onrUrl).subscribe(
                data => {
                  //console.log(data);
                  if (data['header'].code == 200) {
                    that.btnlist.push(data['body'])
                    if (that.istype == 1) {
                      if (data['body'].state == 2 || data['body'].state == 3 || data['body'].state == 4) {
                        that.islook = true;
                      } else {
                        that.islook = false;
                      }
                      if (data['body'].state == 2 || data['body'].state == 4) {
                        that.canyulan = true;
                      } else {
                        that.canyulan = false
                      }
                    }
                  }
                },
                err => { console.log(err) }
              )
            } else {
              this.isnewPage = true;
            }
          }
          let childUrl = '/api/cms/page/page-list?pageNo=' + 1 + '&pageSize=' + 10 + '&channelId=' + obj.id + '&siteId=' + $("#choosesite").val();
          this.http.get(childUrl).subscribe(
            data => {
              //console.log(data);
              that.isload = false;
              if (data['header'].code == 200 && data['body'].totalCount > 0) {
                that.haveChild = true;
                that.childList = data['body'].list;
                that.pageNo = data['body'].pageNo;
                that.pageCount = data['body'].pageCount;
                $("#pagination1").pagination({
                  currentPage: that.pageNo,
                  totalPage: that.pageCount,
                  callback: function (current) {
                    that.pageNo = current;
                    that.pagenumber(that.pageNo)
                  }
                });
              } else {
                that.haveChild = false;
              }
            },
            err => { console.log(err) }
          )
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  ztreeClick(event, treeId, treeNode) {
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('.myclick').click();
  }
  //复制页面
  ztreeClick1(event, treeId, treeNode) {
    $(".currentp").val(treeNode.id)
  }
  //移动页面
  ztreeClick2(event, treeId, treeNode) {
    //console.log(treeNode)
    $(".removect").val(treeNode.id)
  }

  //局部刷新频道
  channelreload() {
    var that = this;
    this.btnlist = [];
    this.pagenumList = [1];
    $('.changeUrl').hide();
    $('.addChannel').show();
    $('.setMsg').show();
    $('.allset').show();
    let obj = JSON.parse($('input[name="mymsg"]').val());
    console.log(obj);
    var myobj;
    let nowPageurl = '/api/cms/channel/desc/' + obj.id;
    this.http.get(nowPageurl).subscribe(
      data => {
        console.log('频道详情', data);
        if (data['header'].code == 200) {
          myobj = data['body'];
          this.msgTitle = myobj.desc;
          this.msgIndex = myobj.orders;
          this.msgId = myobj.id;
          this.msgEnglish = myobj.fileName;
          this.msgType = myobj.type;
          this.pId = myobj.pId;
          this.isSetmsg = false;
          this.isCandel = false;
          if (!myobj.pId) {
            this.istype = 1;
            this.pId = 0;
          } else if (myobj.type == 2) {
            this.istype = 2;
            this.msgUrl = myobj.url;
            $('.haveUrl').show();
            $('.noUrl').hide();
            $('.msg_box input').attr('readonly', 'readonly')
          } else {
            this.istype = 3;
          }
          if (this.istype != 2) {
            $('.haveUrl').hide();
            $('.noUrl').show();
            $('.msg_box input').attr('readonly', 'readonly')
            $('.channelLogo img').attr('src', obj.icon)
            if (myobj.pageId && myobj.pageId != 0) {
              this.isnewPage = false;
              let onrUrl = '/api/cms/page/desc/' + myobj.pageId;
              that.http.get(onrUrl).subscribe(
                data => {
                  console.log(data);
                  if (data['header'].code == 200) {
                    that.btnlist.push(data['body'])
                    if (that.istype == 1) {
                      if (data['body'].state == 2 || data['body'].state == 3 || data['body'].state == 4) {
                        that.islook = true;
                      } else {
                        that.islook = false;
                      }
                      if (data['body'].state == 2 || data['body'].state == 4) {
                        that.canyulan = true;
                      } else {
                        that.canyulan = false
                      }
                    }
                  }
                },
                err => { console.log(err) }
              )
            } else {
              this.isnewPage = true;
            }
          }
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  // 查看页面
  lookHref() {
    window.open(this.msgUrl)
  }
  // 编辑频道
  setMsg() {
    this.setornew = false;
    this.addnewchannel = false;
    this.isCandel = false;
    $('.addChannel').hide();
    $('.allset').hide();
    $('.setMsg').hide();
    $('.addPage').hide();
    $('.addChildpage').hide();
    this.isSetmsg = true;
    this.islook = false;
    $('.setMsg').hide();
    $('.addChannel').hide()
    $('.msg_box input').removeAttr('readonly');
  }
  // 改变频道type
  changeUrl() {
    let that = this;
    if ($('.kg_btnbox').hasClass('left')) {
      $('.kg_btnbox').removeClass('left');
      $('.kg_btn').animate({ 'left': '-80px' }, 400, 'linear', function () {
        that.msgType = 2;
        that.msgUrl = '';
        that.msgEnglish = '';
        $('.haveUrl').show();
        $('.noUrl').hide();
      })
    } else {
      $('.kg_btnbox').addClass('left');
      $('.kg_btn').animate({ 'left': '0' }, 400, 'linear', function () {
        that.msgType = 1;
        that.msgUrl = '';
        that.msgEnglish = '';
        $('.haveUrl').hide();
        $('.noUrl').show();
      })
    }
  }
  // 新增频道
  addChannel() {
    this.setornew = true;
    this.addnewchannel = true;
    this.isCandel = false;
    $('.addChannel').hide();
    $('.allset').hide();
    $('.setMsg').hide();
    $('.addPage').hide();
    $('.index_btn').hide();
    $('.addChildpage').hide();
    this.msgTitle = '';
    this.msgIndex = '';
    this.msgUrl = '';
    this.msgEnglish = '';
    this.isSetmsg = true;
    this.islook = false;
    $('.channelLogo img').attr('src', '')
    $('.changeUrl').show();
    $('.msg_box input').removeAttr('readonly');
    if ($('.noUrl').css('display') == 'none') {
      $('.kg_btnbox').removeClass('left');
      $('.kg_btn').css('left', '-80px')
    } else {
      // $('.changeUrl').val('外链频道');
    }
  }
  //选择系列
  seriesmanage() {
    var seriescode = $("input[name='series']:checked").parents("td").siblings(".seriescode").text()
    var seriesdesc = $("input[name='series']:checked").parents("td").siblings(".seriesdesc").text()
    if (this.isAddnew) {
      $('input[name="newChildEn"]').val('series-' + seriescode);
      $('input[name="newChildCn"]').val(seriesdesc);
    } else {
      this.msgEnglish = 'series-' + seriescode;
      this.msgTitle = seriesdesc;
    }
    $('#myModal').hide();
    $(".modal-backdrop").hide()
  }
  //选择商品
  productmanage() {
    var kuanshicode = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find("span").text();
    var kuanshidouble = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find(".double").val();

    if (this.isAddnew) {
      if (kuanshidouble == "true") {
        this.newproductid = true;
        $('input[name="newChildEn"]').val('lastCommodityDouble-' + kuanshicode)
      } else {
        this.newproductid = false;
        $('input[name="newChildEn"]').val('lastCommodity-' + kuanshicode);
      }
    } else {
      if (kuanshidouble == "true") {
        this.msgEnglish = 'lastCommodityDouble-' + kuanshicode;
      } else {
        this.msgEnglish = 'lastCommodity-' + kuanshicode;
      }
    }
    $('#proModal').hide();
    $(".modal-backdrop").hide()
  }
  // 上传logo
  logofile(event) {
    console.log(event.target.files)
    this.imgchange = true;
    let file = event.target.files[0];
    let filename = event.target.files[0].name;
    let imgUrl = window.URL.createObjectURL(file);
    $('.channelLogo img').attr('src', imgUrl);
    this.formData = new FormData();
    this.formData.append('file', file)
    this.formData.append('fileName', filename)
  }
  // 保存频道信息
  saveMsg() {
    let that = this;
    let chanelsiteid = $("#choosesite").val();
    if (this.msgType == 1 && this.msgEnglish == '') {
      this.isHint = true;
      this.hintMsg = '非外链频道英文名称必填';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    if (this.msgType == 2 && this.msgUrl == '') {
      this.isHint = true;
      this.hintMsg = '外链频道链接必填';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    let upimgUrl = '/api/cms/picture/thumb-upload';
    let msgsaveUrl = '/api/cms/channel/save-or-update';
    let obj = {
      name: this.msgTitle,
      fileName: this.msgEnglish,
      id: this.msgId,
      orders: this.msgIndex,
      pId: this.pId,
      siteId: $("#choosesite").val(),
      url: this.msgUrl,
      type: this.msgType,
      icon: ''
    }
    if (this.addnewchannel) {//新增频道
      obj.pId = this.msgId;
      obj.id = '';
    }
    if (this.msgEnglish) {
      let chongfu = '/api/cms/channel/repeat-name?channelId=' + this.msgId + '&siteId=' + $("#choosesite").val() + '&fileName=' + this.msgEnglish;
      this.http.get(chongfu).subscribe(
        data => {
          console.log(data);
          if (data['body']) {
            that.isHint = true;
            that.hintMsg = '英文名称已存在';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else {
            if (that.imgchange) {//更换logo
              that.http.post(upimgUrl, that.formData).subscribe(
                data => {
                  console.log(data)
                  if (data['header'].code == 200) {
                    obj.icon = data['body'];
                    that.http.post(msgsaveUrl, obj).subscribe(
                      data => {
                        console.log(data);
                        if (data['header'].code == 200) {
                          if (that.setornew) {
                            window.location.reload();

                          } else {
                            that.myclick();
                          }
                        }
                      },
                      err => { console.log(err) }
                    )
                  }
                },
                err => { console.log(err) }
              )
            } else {
              obj.icon = $('.channelLogo img').attr('src')
              that.http.post(msgsaveUrl, obj).subscribe(
                data => {
                  console.log(data)
                  if (data['header'].code == 200) {
                    if (that.setornew) {
                      window.location.reload();
                    } else {
                      that.myclick();
                    }
                  }
                },
                err => { console.log(err) }
              )
            }
          }
        },
        err => { console.log(err) }
      )
    } else {
      if (this.imgchange) {//更换logo
        this.http.post(upimgUrl, this.formData).subscribe(
          data => {
            console.log(data)
            if (data['header'].code == 200) {
              obj.icon = data['body'];
              this.http.post(msgsaveUrl, obj).subscribe(
                data => {
                  console.log(data);
                  if (data['header'].code == 200) {
                    if (that.setornew) {
                      window.location.reload();
                    } else {
                      that.myclick();
                    }
                  }
                },
                err => { console.log(err) }
              )
            }
          },
          err => { console.log(err) }
        )
      } else {
        obj.icon = $('.channelLogo img').attr('src')
        this.http.post(msgsaveUrl, obj).subscribe(
          data => {
            console.log(data)
            if (data['header'].code == 200) {
              if (that.setornew) {
                window.location.reload();
              } else {
                that.myclick();
              }
            }
          },
          err => { console.log(err) }
        )
      }
    }
  }
  // 添加子页面和自身页面信息
  addnewchild(cn, code) {
    $('#addnew_box').show();
    this.isAddnew = true;
    this.newchildType = cn;
    if (code == 'new') {
      $('input[name="newChildCn"]').val(this.msgTitle).attr("readonly", "readonly");
      $('input[name="newChildEn"]').val(this.msgEnglish).attr("readonly", "readonly");
      $('.childpage').hide()
    } else if (code == 'null') {
      $('input[name="newChildCn"]').val('').removeAttr('readonly');
      $('input[name="newChildEn"]').val('').removeAttr('readonly');
      $('.childpage').show()
    } else {
      $('input[name="newChildCn"]').val(this.childList[code].comm).removeAttr('readonly');
      $('input[name="newChildEn"]').val(this.childList[code].fileName).removeAttr('readonly');
      this.pageId = this.childList[code].id;
      $('.childpage').show()
    }

  }
  closechild() {
    $('#addnew_box').hide();
  }
  //编辑新增页面信息保存
  saveChild() {
    var code = $('input[name="newChildEn"]').val().split('-')[1]
    if (this.newproductid) {
      code = $.trim(code).replace(" ", "%20")
    }
    let obj = {
      channelId: this.msgId,
      siteId: $("#choosesite").val(),
      channelPage: this.newchildType,
      comm: $('input[name="newChildCn"]').val(),
      fileName: $('input[name="newChildEn"]').val(),
      productCode: code
    }
    let that = this;
    let repeatUrl = '/api/cms/page/repeat-name?siteId=' + $("#choosesite").val() + '&pageId=' + this.pageId + '&fileName=' + $('input[name="newChildEn"]').val();
    this.http.get(repeatUrl).subscribe(
      data => {
        console.log(data);
        if (data['body']) {
          that.isHint = true;
          that.hintMsg = '英文名称已存在';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        } else {
          let url = '/api/cms/page/save-or-update';
          this.http.post(url, obj).subscribe(
            data => {
              console.log(data)
              if (data['header'].code == 200) {
                $('#addnew_box').hide();
                that.myclick();
              } else {
                that.isHint = true;
                that.hintMsg = data['header'].desc;
                setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                }, 1500)
              }
            },
            err => { console.log(err) }
          )
        }
      },
      err => { console.log(err) }
    )


  }
  //分页
  /* goPage(item){
    $('.next').removeClass('disabled')
    $('.previous').removeClass('disabled')
    if(this.pageNo == (item+ 1)){
      return
    }
    if(item == 9999){
      this.pageNo -= 1
    }else if(item == -1){
      this.pageNo += 1
    }else{
      this.pageNo = item + 1
    }
    if(this.pageNo < 1 ){
      $('.previous').addClass('disabled')
      this.pageNo=1
      return
    }
    if(this.pageNo > this.pagenumList.length ){
      $('.next').addClass('disabled')
      this.pageNo= this.pagenumList.length
      return      
    }
    $('.pagination>li').removeClass('active');
    $('.pagination>li:nth-child(' + (this.pageNo+1) + ')').addClass('active')
    let that = this;
    let childUrl = '/api/cms/page/page-list?pageNo='+ this.pageNo +'&pageSize='+ 10 + '&channelId='+ this.msgId+'&siteId='+$("#choosesite").val();;
    this.http.get(childUrl).subscribe(function(data){
      if(data['header'].code == 200){
        that.childList = data['body'].list;
        that.pageNo = data['body'].pageNo;
      }else{
        that.isHint= true;
        that.hintMsg = data['header'].desc;
        setTimeout(function () {
          that.isHint= false;
          that.hintMsg = '';
        },1500)
      }
    },function(err){
      console.log(err)
    })
  } */
  pagenumber(pagenumber) {
    let that = this;
    let childUrl = '/api/cms/page/page-list?pageNo=' + pagenumber + '&pageSize=' + 10 + '&channelId=' + this.msgId + '&siteId=' + $("#choosesite").val();;
    this.http.get(childUrl).subscribe(function (data) {
      if (data['header'].code == 200) {
        console.log(data)
        that.childList = data['body'].list;
      } else {
        that.isHint = true;
        that.hintMsg = data['header'].desc;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    }, function (err) {
      console.log(err)
    })
  }
  pagefuction() {
    let that = this;
    if (this.msgId == "" || this.msgId == undefined) {
      this.msgId = 1;
    }
    let childUrl = '/api/cms/page/page-list?pageNo=' + this.pageNo + '&pageSize=' + 10 + '&channelId=' + this.msgId + '&siteId=' + $("#choosesite").val();;
    this.http.get(childUrl).subscribe(function (data) {
      if (data['header'].code == 200) {
        console.log(data)
        that.childList = data['body'].list;
        that.pageNo = data['body'].pageNo;
        that.pageCount = data['body'].pageCount;
        console.log(that.pageNo + "------------")
        console.log(that.pageCount)
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
        that.hintMsg = data['header'].desc;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    }, function (err) {
      console.log(err)
    })
  }
  //局部刷新子页面
  reloadPage() {
    this.pagefuction()
  }
  //下线
  downUrl(id, type) {
    this.isload = true;
    let that = this;
    let publishUrl = '/api/cms/page/off-publish?pageId=' + id;
    this.http.post(publishUrl, { headers: this.headers }).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
          let childUrl = '/api/cms/page/page-list?pageNo=' + that.pageNo + '&pageSize=' + 10 + '&channelId=' + that.msgId + '&siteId=' + $("#choosesite").val();;
          that.http.get(childUrl).subscribe(
            function (data) {
              // console.log(data)
              if (data['header'].code == 200) {
                if (type == 'page') {
                  if (data['body'].totalCount > 0) {
                    that.haveChild = true;
                    that.pagenumList = [1];
                    that.childList = data['body'].list;
                    that.pageNo = data['body'].pageNo;
                    that.pageCount = data['body'].pageCount;
                    /*  for (var i = 0; i < data['body'].count-1; i++) {
                       that.pagenumList.push(1)
                     } */
                    $("#pagination1").pagination({
                      currentPage: that.pageNo,
                      totalPage: that.pageCount,
                      callback: function (current) {
                        that.pageNo = current;
                        that.pagenumber(that.pageNo)
                      }
                    });
                  } else {
                    that.haveChild = false;
                  }
                } else {
                  that.myclick();
                }
              }
            }, function (err) {
              console.log(err)
            }
          )
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  //删除页面
  delMsg(id) {
    this.delId = id;
  }
  sure() {
    this.isload = true;
    var that = this;
    that.pagenumList = [1];
    var url = '/api/cms/page/del-page?pageId=' + this.delId + '&channelId=' + this.msgId;
    this.http.delete(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          that.isHint = true;
          that.hintMsg = '删除成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          let childUrl = '/api/cms/page/page-list?pageNo=' + that.pageNo + '&pageSize=' + 10 + '&channelId=' + that.msgId + '&siteId=' + $("#choosesite").val();;
          that.http.get(childUrl).subscribe(
            function (data) {
              //console.log(data)
              if (data['header'].code == 200) {
                if (data['body'].totalCount > 0) {
                  that.haveChild = true;
                  that.pagenumList = [1];
                  that.childList = data['body'].list;
                  that.pageNo = data['body'].pageNo;
                  that.pageCount = data['body'].pageCount;
                  $("#pagination1").pagination({
                    currentPage: that.pageNo,
                    totalPage: that.pageCount,
                    callback: function (current) {
                      that.pageNo = current;
                      that.pagenumber(that.pageNo)
                    }
                  });
                  /*  for (var i = 0; i < data['body'].pageCount-1; i++) {
                     that.pagenumList.push(1)
                   } */
                } else {
                  that.haveChild = false;
                }
              }
            }, function (err) {
              console.log(err)
            }
          )
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
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
  //发布
  publishOne(id, type) {
    this.isload = true;
    let that = this;
    let publishUrl = '/api/cms/page/publish-page?pageId=' + id;
    this.http.post(publishUrl, { headers: this.headers }).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
          let childUrl = '/api/cms/page/page-list?pageNo=' + that.pageNo + '&pageSize=' + 10 + '&channelId=' + that.msgId + '&siteId=' + $("#choosesite").val();;
          that.http.get(childUrl).subscribe(
            function (data) {
              //console.log(data)
              if (data['header'].code == 200) {
                if (type == 'page') {
                  if (data['body'].totalCount > 0) {
                    that.haveChild = true;
                    that.pagenumList = [1];
                    that.childList = data['body'].list;
                    that.pageNo = data['body'].pageNo;
                    /* for (var i = 0; i < data['body'].count-1; i++) {
                      that.pagenumList.push(1)
                    } */
                    that.pageCount = data['body'].pageCount;
                    $("#pagination1").pagination({
                      currentPage: that.pageNo,
                      totalPage: that.pageCount,
                      callback: function (current) {
                        that.pageNo = current;
                        that.pagenumber(that.pageNo)
                      }
                    });
                  } else {
                    that.haveChild = false;
                  }
                } else {
                  that.myclick();
                }
              }
            }, function (err) {
              console.log(err)
            }
          )
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  //预览
  yulan(href) {
    window.open(href)
  }
  //批量上传TDK
  selectTDK(event) {
    let fileUrl = '/api/cms/page/import-excel';
    let formData = new FormData();
    let that = this;
    formData.append('file', event.target.files[0]);
    formData.append('siteId', $("#choosesite").val());
    this.http.post(fileUrl, formData).subscribe(
      data => {
        if (data['body'].excelList.length == 0) {
          that.isHint = true;
          that.hintMsg = '上传成功,所上传的页面没有页面内容';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        } else {
          that.isTDK = true;
          that.TDKsuelist = data['body'].excelList;
          if (data['body'].noPage) {
            that.TDKhint = '不存在的页面共' + data['body'].noNum + '个,如下:';
            that.tdklist = data['body'].noPage.split(',')
          } else {

          }
        }
      },
      err => { console.log(err) }
    )
  }
  tdkSue() {
    this.isTDK = false;
    this.isload = true;
    let that = this;
    let excelUrl = '/api/cms/page/publish-excel';
    let obj = {
      list: this.TDKsuelist,
      siteId: $("#choosesite").val()
    }
    this.http.post(excelUrl, obj).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
          that.isHint = true;
          that.hintMsg = '发布成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  closeTDK() {
    this.isTDK = false;
  }
  searchimg() {
    var that = this;
    var prolist = "/api/cms/page/product-list?siteId=" + $("#choosesite").val() + '&code=' + $(".ksbm").val() + '&name=' + $(".chinesaname").val() + '&seriesCodes=' + $(".profl").val();
    this.http.get(prolist).subscribe(function (data) {
      that.prolists = data['body'];
    }, function (err) {
      console.log(err)
    })
  }
  //copytree
  copytrees(channellist) {
    let setting = {
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true
        },
        key:{
          name:'showName'
        }
      },
      callback: {
        beforeDrop: this.common.beforeDrop,
        onClick: this.ztreeClick1
      }
    };
    $.fn.zTree.init($("#treeDemo1"), setting, channellist);
    this.common.setCheck2();
  }
  //复制页面
  copyId(id, siteid) {
    //console.log(id+"----"+siteid)
    $(".copytips").val("");
    this.copyPageId = id;
    this.copytrees(this.allList);
    $(".copysiteid").val(siteid)

  }
  copySave() {
    //console.log(this.copyPageId,$('.copysiteid').val(),$(".currentp").val());
    var url = '/api/cms/page/copy-page?copyPageId=' + this.copyPageId + "&siteId=" + $('.copysiteid').val() + "&channelId=" + $(".currentp").val();
    this.http.post(url, { headers: this.headers }).subscribe(
      data => {
        //console.log(data)
        if (data['header'].code == 200) {
          $('#copymodel').hide();
          $(".modal-backdrop").hide()
        } else if (data['header'].code == 500) {
          $(".copytips").text(data['header'].desc);
          return false;
        }

      },
      err => { console.log(err) }
    )
  }
  //选择所要复制的站点
  copysiteid() {
    var that = this;
    var copysiteid = $('.copysiteid').val()
    var oneUrl = '/api/cms/channel/list-channel?siteId=' + copysiteid;
    this.http.get(oneUrl).subscribe(
      data => {
        // console.log(data);
        if (data['header'].code == 200) {
          var copypage = data['body'];
          for (var i = 0; i < copypage.length; i++) {
            if (copypage[i].pId == 0) {
              copypage[i].open = true;
            }
          }
          this.copytrees(copypage);
        }
      },
      err => { console.log(err) }
    )
  }
  removetrees(channellist) {
    let setting = {
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true
        },
        key:{
          name:'showName'
        }
      },
      callback: {
        beforeDrop: this.common.beforeDrop,
        onClick: this.ztreeClick2
      }
    };
    $.fn.zTree.init($("#treeDemo2"), setting, channellist);
    this.common.setCheck2();
  }
  //移动页面
  removeId(id, siteid) {
    $(".removepagetips").val("");
    this.removePageId = id;
    this.removetrees(this.allList);
    $(".removesiteid").val(siteid)
  }
  //选择所要移动的站点
  removesiteid() {
    var that = this;
    var removesiteid = $('.removesiteid').val()
    var oneUrl = '/api/cms/channel/list-channel?siteId=' + removesiteid;
    this.http.get(oneUrl).subscribe(
      data => {
        console.log("11111")
        console.log(data);
        if (data['header'].code == 200) {
          var removepage = data['body'];
          for (var i = 0; i < removepage.length; i++) {
            if (removepage[i].pId == 0) {
              removepage[i].open = true;
            }
          }
          this.removetrees(removepage);
        }
      },
      err => { console.log(err) }
    )
  }
  //保存移动的站点
  removepageSave() {
    console.log(this.removePageId, $('.removesiteid').val(), $(".removect").val());
    var url = '/api/cms/page/move-page?movePageId=' + this.removePageId + "&siteId=" + $('.removesiteid').val() + "&channelId=" + $(".removect").val();
    this.http.post(url, { headers: this.headers }).subscribe(
      data => {
        //console.log(data)
        if (data['header'].code == 200) {
          $('#removemodel').hide();
          $(".modal-backdrop").hide()
        } else if (data['header'].code == 500) {
          $(".removepagetips").text(data['header'].desc);
          return false;
        }

      },
      err => { console.log(err) }
    )
  }
  //添加已有页面
  existingpage() {
    let that = this;
    let childUrl = '/api/cms/page/page-list?pageNo=' + that.pageNo + '&pageSize=' + 10+ '&channelId=0&siteId=0';
    this.http.get(childUrl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['header'].code == 200 && data['body'].totalCount > 0) {
          that.haveChild = true;
          that.extchildList = data['body'].list;
          console.log("已有页面")
          console.log(that.extchildList)
          that.pageNo = data['body'].pageNo;
          that.pageCount = data['body'].pageCount;
          $("#pagination2").pagination({
            currentPage: that.pageNo,
            totalPage: that.pageCount,
            callback: function (current) {
              that.pageNo = current;
              that.existingpage()
            }
          });

        } else {
          that.haveChild = false;
        }
      },
      err => { console.log(err) }
    )
  }
  showRegular() {
    let pagenames = $('input[name="opeType"]:checked').attr('title');
    console.log(pagenames)
  }
  addexitpage() {
    let that = this;
    console.log(that.channelid);
    console.log(that.siteId)
    let pagenames = $('input[name="opeType"]:checked').attr('title');
    if (that.channelid == undefined || that.channelid == "") {
      $(".exitpagetips").text("请选择要添加到的频道");
      return false;
    }
    if (that.siteId == undefined || that.siteId == "") {
      $(".exitpagetips").text("请选择站点");
      return false;
    }
    if (pagenames == undefined) {
      $(".exitpagetips").text("请选择要添加的页面");
      return false;
    }
    var url = '/api/cms/page/copy-page?copyPageId=' + pagenames + "&siteId=" + that.siteId + "&channelId=" + that.channelid;
    this.http.post(url, { headers: this.headers }).subscribe(
      data => {
        if (data['header'].code == 200) {
          $('#exsitingpage').hide();
          $(".modal-backdrop").hide();
          that.isHint = true;
          that.hintMsg = '添加成功，请刷新当前树进行查看';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        } else if (data['header'].code == 500) {
          $(".exitpagetips").text(data['header'].desc);
          return false;
        }

      },
      err => { console.log(err) }
    )

  }
}
