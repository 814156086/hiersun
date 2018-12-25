import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Router } from '@angular/router';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-ditchmanage',
  templateUrl: './ditchmanage.component.html',
  styleUrls: ['./ditchmanage.component.css']
})
export class DitchmanageComponent implements OnInit {
  public expandKeys = [ '100', '1001' ];
  public value: string;
  public detailList = [];
  public childList = [];
  public tree = {};
  public treeId = '';
  public listUrl= '';
  public isHint= false;
  public hintMsg= '';
  public warning= false;
  public eventx = '';
  public eventy = '';
  public Nodes = [];
  public brandlist = [];
  public proGroupCode = '';
  public shopcodeList = [];
  public brandName = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }
  ngOnInit() {
    var that = this;
    this.createTree()
    this.choosebranch()
    $("body").bind(//鼠标点击事件不在节点上时隐藏右键菜单  
      "mousedown",
      function(event) {
        if (!(event.target.id == "rMenu" || $(event.target)
          .parents("#rMenu").length > 0)) {
          $("#rMenu").hide();
        }
      });
  }
  //创建树
  createTree(){
    var zTreeObj;
    var setting = {
      edit: {
        enable: true,
        showRenameBtn: false,
        showRemoveBtn: false,
        drag : {
          isMove: true,
          inner: true,
        }
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      view: {
        // addHoverDom: addHoverDom,
        showLine: false,
        // removeHoverDom: removeHoverDom,
      },
      callback: {
        onClick: zTreeOnClick,
        beforeDrop: zTreeBeforeDrop,
        beforeDragOpen: true,
        onDrop: onDrop,
        onRightClick: zTreeOnRightClick
      }
    };
    var zNodes = []
    function zTreeOnRightClick(event, treeId, treeNode) {
      var that=this;
      that.eventx=event.clientX-280;
      that.eventy=event.clientY-194;
      var obj = JSON.stringify(treeNode);
      var rootid = treeNode.rootId
      var id = treeNode.id
      $('input[name="rightclickinfo"]').val(obj);
      $('input[name="rootidinfo"]').val(rootid);
      $('input[name="idinfo"]').val(id);
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      $('.rMenuShow').click()
      $("#rMenu").css({"top":that.eventy+"px", "left":that.eventx+"px", "display":"block"});
      // $('.addbtn').click()
    };
    function onDrop(event, treeId, treeNodes, targetNode, moveType){
      var that = this;
      var sid = treeNodes[0].sid;//获得被拖拽的节点id
      var pId = targetNode.id;//获得目标id
      $('input[name="amendsid"]').val(sid);
      $('input[name="amendpid"]').val(pId);
      $('.addparent').click()
    }
    function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
      return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId));
    };
    function zTreeOnClick(event, treeId, treeNode) {
      let that = this;
      this.treeId = treeNode.id
      this.tree = treeNode;
      // var obj = JSON.stringify(treeNode);
      var obj = JSON.stringify(treeNode);
      $('input[name="mymsg"]').val(obj);
      $('.myclick').click();
    };
    var ditchUrl = `api/v1/member-admin/manager/member/sources`;
    // var ditchUrl = `/channel/api/v1/member-admin/manager/member/sources`;
    this.httpclient.get(ditchUrl, this.httpOptions).subscribe(
      res => {
        zNodes = res['data']
        this.Nodes = res['data']
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试");
      }
    )
  }
  //节点click事件
  myclick(){
    var that = this;
    let obj = JSON.parse($('input[name="mymsg"]').val());
    var id = obj.id;
    var sid = obj.sid;
    // var domain = obj.domain;   
    var listUrl = 'api/v1/member-admin/manager/member/subset/' + id;
    // var listUrl = '/channel/api/v1/member-admin/manager/member/subset/' + id;
    this.httpclient.get(listUrl, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          this.childList = res['data']
          var detailUrl = 'api/v1/member-admin/manager/member/detail/' + sid;
          // var detailUrl = '/channel/api/v1/member-admin/manager/member/detail/' + sid;
          this.httpclient.get(detailUrl, this.httpOptions).subscribe(
            res => {
              if(res['code']==200){
                this.detailList = [res['data']]
              }else{
                console.log(res)
              }
            },
            (err: HttpErrorResponse) => {
              console.log("系统操作异常,请重新再试");
            }
          )
        }else{
          console.log(res)
        }
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试");
      }
    )
  }
  //启用(禁用)
  state(state,sid){
    var that = this
    var stateUrl = '';
    var channelSid = sid
    // 启用or禁用
    if(state==0){
      stateUrl = 'api/v1/member-admin/manager/member/enable?sid=' + channelSid
      // stateUrl = '/channel/api/v1/member-admin/manager/member/enable?sid=' + channelSid
    }else if(state==1){
      stateUrl = 'api/v1/member-admin/manager/member/disable?sid=' + channelSid
      // stateUrl = '/channel/api/v1/member-admin/manager/member/disable?sid=' + channelSid
    }

    this.httpclient.post(stateUrl, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          that.createTree()
          that.myclick()
          that.isHint = true;
          that.hintMsg = '启用(禁用)成功!';
          that.warning = false;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }else{
          that.isHint = true;
          that.hintMsg = res['desc'];
          that.warning = true;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },3000)
        }
      },
      (err: HttpErrorResponse) => {
        that.isHint = true;
        that.hintMsg = "系统操作异常,请重新再试";
        that.warning = true;
        setTimeout(function(){
          that.isHint = false;
          that.hintMsg = '';
        },3000)
      }
    )
  }
  //修改
  amend(sid){
    this.clear()
    $('.desc').text('')
    var sid = sid
    $('#amend').modal('show')
    var detailUrl = 'api/v1/member-admin/manager/member/detail/' + sid;
    // var detailUrl = '/channel/api/v1/member-admin/manager/member/detail/' + sid;
    this.httpclient.get(detailUrl, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          var obj = res['data']
          // console.log(res['data'])
          $('.comm').val(obj.comm)
          $('.name').val(obj.name)
          $('.platformName').val(obj.platformId)
          // $('.platformName').val(obj.platformName)
          $('.source').val(obj.source)
          $('.sid').val(obj.sid)
          $('.domain').val(obj.domain)
          $('.crmSource').val(obj.crmSource)
        }
      },
      (err: HttpErrorResponse) => {
        console.log("系统操作异常,请重新再试");
      }
    )
  }
  //确认修改
  amendsure(){
    var that = this
    var data  = {
      comm : $('.comm').val(),
      name : $('.name').val(),
      platformId : $('.platformName').val(),
      platformName : $('.platformName').find('option:checked').text(),
      sid : $('.sid').val(),
      source : $('.source').val(),
      domain : $('.domain').val(),
      crmSource : $('.crmSource').val()
    }
    console.log(data)
    var amendUrl = 'api/v1/member-admin/manager/member/modify';
    // var amendUrl = '/channel/api/v1/member-admin/manager/member/modify';
    this.httpclient.post(amendUrl, data, this.httpOptions).subscribe(
      res => {
        this.createTree()
        this.myclick()
        if(res['code']==200){
          $('#amend').modal('hide')
          // this.clear()
          that.isHint = true;
          that.hintMsg = res['desc'];
          that.warning = false;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }else{
          $('.desc').text(res['desc'])
        }
      },
      (err: HttpErrorResponse) => {
        $('.desc').text("系统操作异常,请重新再试")
      }
    )
  }
  //新增
  addEventListener(i){
    this.addclear()
    $('.adddesc').text('')
    // this.choosebranchname()  
    var rootid = $('input[name="rootidinfo"]').val();
    var id = $('input[name="idinfo"]').val();
    this.addclear()
    if(i==0){//添加子节点
      if(!rootid){
        $('.addrootId').val(id).attr('disabled','true')
      }else{
        $('.addrootId').val(rootid).attr('disabled','true')
      }
      $('.addpId').val(id).attr('disabled','true')
    }else{//添加根节点
      $('.addrootId').val('').attr('disabled','true')
      $('.addpId').val('').attr('disabled','true')
    }
    $('#rMenu').hide()
    $('#add').modal('show')

  }
  //右击事件
  rMenuShow(){
    $('#rMenu').show()
  }
  //确认新增
  addsure(){
    var that = this;
    var brandId = $('.addbrandId').val()
    for(var i=0;i<that.brandlist.length;i++){
      if(that.brandlist[i].brandSid == brandId){
        that.brandName = that.brandlist[i].brandName
      }
    }
    var data = {
      brandId : $('.addbrandId').val(),
      brandName : that.brandName,
      comm : $('.addcomm').val(),
      id : $('.addid').val(),
      name : $('.addname').val(),
      pId : $('.addpId').val(),
      platformId : $('.addplatformId').val(),
      platformName : $('.addplatformId').find('option:checked').text(),
      rootId : $('.addrootId').val(),
      sid : $('.addsid').val(),
      source : $('.addsource').val(),
      state : $('.addstate').val(),
      domain : $('.adddomain').val(),
      crmSource : $('.addcrmSource').val()
    };
    var addUrl = 'api/v1/member-admin/manager/member/add';
    // var addUrl = '/channel/api/v1/member-admin/manager/member/add';
    this.httpclient.post(addUrl, data, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          that.createTree()
          $('#add').modal('hide')
          that.isHint = true;
          that.hintMsg = res['desc'];
          that.warning = false;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }else{
          $('.adddesc').text(res['desc'])
        }
      },
      (err: HttpErrorResponse) => {
        $('.adddesc').text("系统操作异常,请重新再试")
        // this.createTree()
      }
    )
  }
  //修改渠道父级
  amendprev(){
    var that = this;
    var sid = $('input[name="amendsid"]').val()
    var pId = $('input[name="amendpid"]').val();
    var addparentUrl = 'api/v1/member-admin/manager/member/modify/father/' + sid + '/' + pId;
    // var addparentUrl = '/channel/api/v1/member-admin/manager/member/modify/father/' + sid + '/' + pId;
    this.httpclient.post(addparentUrl, this.httpOptions).subscribe(
      res => {
        if(res['code']==200){
          that.isHint = true;
          that.hintMsg = res['desc'];
          that.warning = false;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }else{
          that.createTree()
          that.warning = true;
          that.isHint = true;
          that.hintMsg = res['desc'];
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
          },3000)
        }
      },
      (err: HttpErrorResponse) => {
        that.createTree()
        that.warning = true;
        that.isHint = true;
        that.hintMsg = '系统操作失败,请重新再试';
        setTimeout(function(){
          that.isHint = false;
          that.hintMsg = '';
          that.warning = false;
        },1500)
      }
    )
  }
  // 清空修改数据
  clear(){
    $('.comm').val('')
    $('.name').val('')
    $('.platformId').val('')
    $('.platformName').val('')
    $('.sid').val('')
    $('.source').val('')
    $('.desc').text('')
    $('.crmSource').val('')
  }
  // 清空新增数据
  addclear(){
    $('.addbrandId').val('')
    $('.addbrandName').val('')
    $('.addcomm').val('')
    $('.addid').val('')
    $('.addname').val('')
    $('.addpId').val('')
    $('.addplatformId').val('')
    $('.addplatformName').val('')
    $('.addrootId').val('')
    $('.addsid').val('')
    $('.addsource').val('')
    $('.addstate').val('')
    $('.addcrmSource').val('')
  }
  //选择品牌
  choosebranch() {
    let that = this;
    var brandurl = '/pcm-inner/brands'
    this.httpclient.get(brandurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          that.brandlist = res['data'];
        }else{
          console.log(res)
        }
      },
      (err: HttpErrorResponse) => {
        console.log('系统异常，请稍后再试')
      }
    )
  }

}
