import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params,NavigationExtras } from '@angular/router';
import { HttpClient} from '@angular/common/http';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-channelmanage',
  templateUrl: './channelmanage.component.html',
  styleUrls: ['./channelmanage.component.css']
})
export class ChannelmanageComponent implements OnInit {
  list:any;
  siteId:any;//站点ID
  delId:any;//站点ID
  isHint=false;// 提示语
  hintMsg:any;// 提示语
  msgIndex:any; // 右侧显示信息的排序
  formData:any; // 上传logo参数
  // mymsgCn:any; // 有自身页面时的中文名称
  // mymsgEn:any; // 有自身页面时的英文名称
  msgEnglish:any;// 右侧显示信息英文名
  msgId:any; // 右侧显示信息id
  msgTitle:any; //右侧信息中文名
  showmsgTitle:any;//右侧显示的名称，可手动修改
  channeldesc:any;
  msgUrl:any; // 右侧信息链接
  pId:any; //右侧显示信息父级id
  msgType = 1 ; //默认新增频道type=1
  pageId = '' ; //编辑页面信息时记录ID
  pageNo = 1 ; //默认第一页
  istype = 1 ;// 右侧显示信息按钮的type
  newproductid=false; //区分单戒对戒
  // isTwotree=false; 
  addnewChild=false; // 新增页面的显示隐藏
  isAddnew=false; // 选择系列和商品时区分显示的input框
  newchildType:any; // 区分页面和子页面的type
  isnewPage=true; // 判断右侧显示信息有没有自身页面
  ischild=false; //是否有子集,显示删除按钮
  imgchange=false; //编辑过程中是否改变logo
  isNourl=false; // 是否有外链
  isload = true; // 是否加载
  canyulan = false; // 是否可以预览
  addnewchannel:any; // 区分新增频道和编辑
  // ispageid:any; // 区分新增页面和编辑页面
  isSetmsg= false;//初始不显示,点击编辑显示
  haveChild= false;//有子集
  islook=false; // 是否可以查看
  index:any;//表示请求的第一级首页
  allList=[];//所有频道的集合
  twoList=[];//二级目录的集合
  threeList=[];//三级目录的集合
  fourList=[];//四级目录的集合
  fiveList=[];//五级目录的集合
  btnlist=[];//显示按钮的集合
  serieslists:any;// 系列选择集合
  prolists:any;// 产品选择集合
  msgList=[]; // 右侧信息展示按钮的集合
  childList=[];// 右侧子页面信息列表
  pagenumList=[1];// 分页页码
  isCandel = false;// 可以删除的频道
  delType:any;// 区分删除的操作;
  setornew:any;//区分新增频道和编辑频道
  isTDK=false;
  TDKhint:any;
  tdklist=[];
  TDKsuelist:any;
  setting:any;
  channel:any;
  public eventx:any;//获取鼠标的x
  public eventy:any;//获取鼠标的y
  public headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,private sanitizer: DomSanitizer) { }
  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(4)').addClass('active');
    $("body").bind(//鼠标点击事件不在节点上时隐藏右键菜单  
      "mousedown",  
      function(event) {  
          if (!(event.target.id == "rMenu" || $(event.target)  
                  .parents("#rMenu").length > 0)) {  
              $("#rMenu").hide();  
          }  
      });  
    var that = this;
    //请求站点
    var url = '/api/cms/site/list';
    this.http.get(url).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          that.list=data['body'];
          that.sitechoose(that.list[0].id)
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
    },function(err) {
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
        onClick:this.ztreeClick,
        onDrop: this.zTreeOnDrop,
        onRightClick: this.zTreeOnRightClick
      }
    };
  }
  zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    /* console.log(treeNodes);
    console.log(targetNode);
    console.log(moveType); */
    $('input[name="movetype"]').val(moveType);//移动状态
    $('input[name="movepageid"]').val(targetNode.id);//目标id
    $('input[name="movepagepid"]').val(targetNode.pId);//目标id
    $('input[name="mypageid"]').val(treeNodes[0].id); //自身id
    $(".moveclick").click();
  }
  moveclick(){
    var that=this;
    var url="/api/cms/channel/move-channel";
    that.channel={
      moveType:$('input[name="movetype"]').val(),
      movePageId:$('input[name="movepageid"]').val(),
      pId:$('input[name="movepagepid"]').val(),
      id:$('input[name="mypageid"]').val()
    }
    console.log(that.channel)
    that.http.post(url, this.channel).subscribe(
      data=>{
        console.log(data);
        
      },
      err=>{console.log(err)}
    )
  }
  //右键  
  zTreeOnRightClick(event, treeId, treeNode) {
    var that=this;
    that.eventx=event.clientX-280;
    that.eventy=event.clientY-194;
    //console.log(that.eventx)
    var obj = JSON.stringify(treeNode);
    $('input[name="rightmsg"]').val(obj);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (!treeNode) {  
        zTree.cancelSelectedNode(); 
        $(".rightclick").click();
       $("#rMenu").show();
       $("#rMenu").css({"top":that.eventy+"px", "left":that.eventx+"px", "display":"block"}); 
    } else if (treeNode && !treeNode.noR) { //noR属性为true表示禁止右键菜单  
        if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {  
            zTree.cancelSelectedNode(); 
            $(".rightclick").click();
            $("#rMenu").show();
            $("#rMenu").css({"top":that.eventy+"px", "left":that.eventx+"px", "display":"block"});
        } else {  
            zTree.selectNode(treeNode); 
            $(".rightclick").click();
            $("#rMenu").show();
            $("#rMenu").css({"top":that.eventy+"px", "left":that.eventx+"px", "display":"block"});
        }  
    }  

  };
  rightclick(){
    let obj = JSON.parse($('input[name="rightmsg"]').val());
    console.log(obj);
    var that = this ;
    this.btnlist = [];
    this.pagenumList=[1];
    var myobj ;
    let nowPageurl = '/api/cms/channel/desc/'+ obj.id;
    this.http.get(nowPageurl).subscribe(
      data=>{
        console.log('频道详情',data);
        if(data['header'].code == 200){
          myobj = data['body'];
          if(myobj.pId==0){
            $("#add-chanel").show();
            $("#edit-chanel").hide();
            $("#look-chanel").hide();
            $("#delete-chanel").hide();
          }else{
            let childUrl = '/api/cms/page/page-list?pageNo='+1+'&pageSize='+ 2 + '&channelId='+ obj.id+'&siteId='+$("#choosesite").val();
            this.http.get(childUrl).subscribe(
              data=>{
                //是否有子页面
                if(data['header'].code == 200 && data['body'].totalCount > 0){
                  $("#delete-chanel").hide();
                }else{
                  that.haveChild = false;
                  //没有子页面且没有子频道且自身没有页面
                  if(!obj.children && (!myobj.pageId || myobj.pageId == 0) ){
                    $("#delete-chanel").show();
                  }
                }
              },
              err=>{console.log(err)}
            )
            if(myobj.type == 1){
              $("#add-chanel").show();
              $("#edit-chanel").show();
              $("#look-chanel").hide();
            }else{
              this.msgUrl = myobj.url;
              $("#add-chanel").show();
              $("#edit-chanel").show();
              $("#look-chanel").show();
            }
          } 
        }
      },
      err=>{console.log(err)}
    )
      
    
    
  }
  sitechoose(id){
    $("#choosesite").val(id);
    $(".sitetips").hide();
    $(".row").show();
    var that = this;
    var serieslist="/api/cms/page/series-list?siteId="+ $("#choosesite").val();
    this.http.get(serieslist).subscribe(function(data){
      console.log("1111")
      console.log(data)
        that.serieslists=data['body'];
    },function(err) {
      console.log(err)
    })
    // 商品管理
    var prolist="/api/cms/page/product-list?siteId="+ $("#choosesite").val();
    this.http.get(prolist).subscribe(function(data){
        that.prolists=data['body'];
    },function(err) {
      console.log(err)
    })
    this.index = '首页'
    var oneUrl = '/api/cms/channel/list-channel?siteId=' + $("#choosesite").val();
    this.http.get(oneUrl).subscribe(
      data=>{
        console.log(data);
        if(data['header'].code == 200){
          let oneMsgid = '';
          that.allList = data['body'];
          for (var i = 0; i < data['body'].length; i++) {
            if(data['body'][i].pId == 0){
              data['body'][i].open = true;
              $('input[name="mymsg"]').val(JSON.stringify(data['body'][i]))
              oneMsgid = data['body'][i].pageId;
              that.msgTitle = data['body'][i].name;
              that.msgIndex = data['body'][i].orders;
              that.msgId = data['body'][i].id;
              that.msgEnglish = data['body'][i].fileName;
              that.channeldesc = data['body'][i].comm;
              that.showmsgTitle = data['body'][i].showName;
              $('.haveUrl').hide();
              $('.noUrl').show();
              $('.msg_box input').attr('readonly','readonly')
              $('.channelLogo img').attr('src',data['body'][i].icon)
            }
          } 
          $.fn.zTree.init($("#treeDemo"), that.setting, that.allList);
          this.common.setCheck();
          
        } 
      },
      err=>{console.log(err)}
    )
  }
  // 树状图所有点击事件
  myclick(){
    $(".msg_box").show();
    $(".changeUrles").show();
    let obj = JSON.parse($('input[name="mymsg"]').val());
    console.log(obj);
    var that = this ;
    this.isload = true;
    this.btnlist = [];
    this.pagenumList=[1];
    $('.changeUrl').hide();
    $('.addChannel').show();
    $('.setMsg').show();
    $('.allset').show();
    var myobj ;
    let nowPageurl = '/api/cms/channel/desc/'+ obj.id;
    this.http.get(nowPageurl).subscribe(
      data=>{
        console.log('频道详情',data);
        if(data['header'].code == 200){
          myobj = data['body'];
          that.isload = false;
          this.msgTitle = myobj.name;
          this.showmsgTitle=myobj.showName;
          this.channeldesc=myobj.comm;
          this.msgIndex = myobj.orders;
          this.msgId = myobj.id;
          this.msgEnglish = myobj.fileName;
          this.msgType = myobj.type;
          this.pId = myobj.pId;
          this.isSetmsg = false;
          this.isCandel = false;
          if(!myobj.pId){
            this.istype = 1;
            this.pId = 0;
          }else if(myobj.type == 2){
            this.istype = 2;
            this.islook = true;
            this.msgUrl = myobj.url;
            $('.haveUrl').show();
            $('.noUrl').hide();
            $('.msg_box input').attr('readonly','readonly')
          }else{
            this.istype = 3;
          }
          if(this.istype != 2){
            this.islook = false;
            $('.haveUrl').hide();
            $('.noUrl').show();
            $('.msg_box input').attr('readonly','readonly')
            $('.channelLogo img').attr('src',obj.icon)
          }
          let childUrl = '/api/cms/page/page-list?pageNo='+1+'&pageSize='+ 2 + '&channelId='+ obj.id+'&siteId='+$("#choosesite").val();
          this.http.get(childUrl).subscribe(
            data=>{
              console.log(data);
              that.isload = false;
              if(data['header'].code == 200 && data['body'].totalCount > 0){
                that.haveChild = true;
                that.childList = data['body'].list;
                that.pageNo = data['body'].pageNo;
                $('.pagination>li:nth-child(2)').addClass('active');
                for (var i = 0; i < data['body'].pageCount-1; i++) {
                  that.pagenumList.push(1)
                }
              }else{
                that.haveChild = false;
                if(!obj.children && (!myobj.pageId || myobj.pageId == 0) ){
                  that.isCandel = true;
                }
              }
            },
            err=>{console.log(err)}
          )
        }else{
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }
  ztreeClick(event, treeId, treeNode){
    var obj = JSON.stringify(treeNode);
    $('input[name="mymsg"]').val(obj);
    $('.myclick').click();
    console.log(treeNode)
  }
  //局部刷新频道
  channelreload(){
    $('.jubuload').show()
    var that = this ;
    this.btnlist = [];
    this.pagenumList=[1];
    $('.changeUrl').hide();
    $('.addChannel').show();
    $('.setMsg').show();
    $('.allset').show();
    let obj = this.common.myJSONparse($('input[name="mymsg"]').val());
    // console.log($('input[name="mymsg"]').val());
    var myobj ;
    let nowPageurl = '/api/cms/channel/desc/'+ obj.id;
    this.http.get(nowPageurl).subscribe(
      data=>{
        $('.jubuload').hide()
        if(data['header'].code == 200){
          myobj = data['body'];
          this.msgTitle = myobj.desc;
          this.showmsgTitle=myobj.showName;
          this.channeldesc=myobj.comm;
          this.msgIndex = myobj.orders;
          this.msgId = myobj.id;
          this.msgEnglish = myobj.fileName;
          this.msgType = myobj.type;
          this.pId = myobj.pId;
          this.isSetmsg = false;
          this.isCandel = false;
          if(!myobj.pId){
            this.istype = 1;
            this.pId = 0;
          }else if(myobj.type == 2){
            this.istype = 2;
            this.msgUrl = myobj.url;
            $('.haveUrl').show();
            $('.noUrl').hide();
            $('.msg_box input').attr('readonly','readonly')
          }else{
            this.istype = 3;
          }
          if(this.istype != 2){
            $('.haveUrl').hide();
            $('.noUrl').show();
            $('.msg_box input').attr('readonly','readonly')
            $('.channelLogo img').attr('src',obj.icon)
            if(myobj.pageId && myobj.pageId != 0 ){
              this.isnewPage=false;
              let onrUrl = '/api/cms/page/desc/'+ myobj.pageId;
              that.http.get(onrUrl).subscribe(
                data=>{
                  console.log(data);
                  if(data['header'].code == 200){
                    that.btnlist.push(data['body'])
                    if(that.istype == 1){
                      if(data['body'].state == 2 || data['body'].state == 3 || data['body'].state == 4){
                        that.islook = true;
                      }else{
                        that.islook = false;
                      }
                      if(data['body'].state == 2 || data['body'].state == 4){
                        that.canyulan = true;
                      }else{
                        that.canyulan = false
                      }
                    }
                  }
                },
                err=>{console.log(err)}
              )
            }else{
              this.isnewPage = true;
            }
          }
        }else{
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }
  //删除频道
  delchannel(){
    $("#rMenu").hide();
    this.delType = 1;
  }
  // 查看页面
  lookHref(){
    $("#rMenu").hide();
    window.open(this.msgUrl)
  }
  // 编辑频道
  setMsg(){
    this.setornew = false;
    this.addnewchannel = false;
    this.isCandel = false;
    $("#rMenu").hide();
    $('.addChannel').hide();
    $('.allset').hide();
    $('.setMsg').hide();
    $('.addPage').hide();
    $('.addChildpage').hide();
    this.isSetmsg=true;
    this.islook=false;
    $('.setMsg').hide();
    $('.addChannel').hide()
    $('.msg_box input').removeAttr('readonly');
  }
  setMsg2(){
    $(".msg_box").show();
    $(".changeUrles").show();
    let obj = JSON.parse($('input[name="rightmsg"]').val());
    console.log(obj);
    var that = this ;
    this.isload = true;
    this.btnlist = [];
    this.pagenumList=[1];
    $('.changeUrl').hide();
    $('.addChannel').show();
    $('.setMsg').show();
    $('.allset').show();
    var myobj ;
    let nowPageurl = '/api/cms/channel/desc/'+ obj.id;
    this.http.get(nowPageurl).subscribe(
      data=>{
        console.log('频道详情',data);
        if(data['header'].code == 200){
          myobj = data['body'];
          that.isload = false;
          this.msgTitle = myobj.name;
          this.showmsgTitle=myobj.showName;
          this.channeldesc=myobj.comm;
          this.msgIndex = myobj.orders;
          this.msgId = myobj.id;
          this.msgEnglish = myobj.fileName;
          this.msgType = myobj.type;
          this.pId = myobj.pId;
          this.isSetmsg = false;
          this.isCandel = false;
          this.setornew = false;
          this.addnewchannel = false;
          this.isCandel = false;
          $("#rMenu").hide();
          $('.addChannel').hide();
          $('.allset').hide();
          $('.setMsg').hide();
          $('.addPage').hide();
          $('.addChildpage').hide();
          this.isSetmsg=true;
          this.islook=false;
          $('.setMsg').hide();
          $('.addChannel').hide()
          $('.msg_box input').removeAttr('readonly');
        }else{
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
    
  }
  // 改变频道type
  changeUrl(){
    let that = this;
    if($('.kg_btnbox').hasClass('left')){
      $('.kg_btnbox').removeClass('left');
      $('.kg_btn').animate({'left':'-80px'},400,'linear',function() {
        that.msgType = 2;
        that.msgUrl = '';
        that.msgEnglish = '';
        $('.haveUrl').show();
        $('.noUrl').hide();
      })
    }else{
      $('.kg_btnbox').addClass('left');
      $('.kg_btn').animate({'left':'0'},400,'linear',function () {
        that.msgType = 1;
        that.msgUrl = '';
        that.msgEnglish = '';
        $('.haveUrl').hide();
        $('.noUrl').show();
      })
    }
  }
  // 新增频道
  addChannel(){
    $(".changeUrles").hide();
    this.setornew = true;
    this.addnewchannel = true;
    this.isCandel = false;
    $("#rMenu").hide();
    $('.addChannel').hide();
    $('.setMsg').hide();
    this.msgTitle = '';
    this.showmsgTitle = '';
    this.channeldesc='';
    this.msgIndex = '';
    this.msgUrl = '';
    this.msgEnglish = '';
    this.isSetmsg=true;
    this.islook=false;
    $('.channelLogo img').attr('src','')
    $('.changeUrl').show();
    $('.msg_box input').removeAttr('readonly');
    if($('.noUrl').css('display') == 'none' ){
      $('.kg_btnbox').removeClass('left');
      $('.kg_btn').css('left','-80px')
    }else{
      $('.kg_btnbox').addClass('left');
      $('.kg_btn').css('left','0px')
    }
  }
   //选择系列
  seriesmanage(){
    var seriescode = $("input[name='series']:checked").parents("td").siblings(".seriescode").text()
    var seriesdesc = $("input[name='series']:checked").parents("td").siblings(".seriesdesc").text()
   /*  if(this.isAddnew){
      $('input[name="newChildEn"]').val('series-'+ seriescode);
      $('input[name="newChildCn"]').val(seriesdesc);
    }else{ */
      this.msgEnglish= 'series-' +seriescode;
      this.msgTitle = seriesdesc;
      this.showmsgTitle='series-' +seriescode;
    /* } */
    $('#myModal').hide();
    $(".modal-backdrop").hide()
  }
  //选择商品
  productmanage(){
    var kuanshicode = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find("span").text();
    var kuanshidouble = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find(".double").val();
    
   /*  if(this.isAddnew){
      if(kuanshidouble=="true"){
        this.newproductid = true;
        $('input[name="newChildEn"]').val('lastCommodityDouble-'+kuanshicode)
      }else{
        this.newproductid = false;
        $('input[name="newChildEn"]').val('lastCommodity-'+kuanshicode);
      }
    }else{ */
      if(kuanshidouble=="true"){//对戒
        this.msgEnglish= 'lastCommodityDouble-' +kuanshicode;
        this.showmsgTitle='lastCommodityDouble-' +kuanshicode;
      }else{
        this.msgEnglish= 'lastCommodity-' +kuanshicode;
        this.showmsgTitle='lastCommodity-' +kuanshicode;
      }
    /* } */
    $('#proModal').hide();
    $(".modal-backdrop").hide()
  }
  // 上传logo
  logofile(event){
    console.log(event.target.files)
    this.imgchange = true;
    let file = event.target.files[0];
    let filename = event.target.files[0].name;
    let imgUrl = window.URL.createObjectURL(file); 
    $('.channelLogo img').attr('src',imgUrl);
    this.formData = new FormData();
    this.formData.append('file',file)
    this.formData.append('fileName',filename)
  }
  // 保存频道信息
  saveMsg(){
    let that=this;
    let chanelsiteid=$("#choosesite").val();
    if(!this.msgTitle){
      $('.channelTitle').addClass('has-error');
      $('.channelTitle .help-block').text('频道名称不能为空')
      setTimeout(function () {
        $('.channelTitle').removeClass('has-error');
        $('.channelTitle .help-block').text('')
      },2500)
      return false;
    }
    if(!this.showmsgTitle){
      console.log("ssss")
      $('.showmsgTitle').addClass('has-error');
      $('.showmsgTitle .help-block').text('显示名称不能为空')
      setTimeout(function () {
        $('.showmsgTitle').removeClass('has-error');
        $('.showmsgTitle .help-block').text('')
      },2500)
      return false;
    }
    if(this.msgType == 1 && this.msgEnglish == '' ){
      $('.channelEng').addClass('has-error');
      $('.channelEng .help-block').text('英文名称不能为空')
      setTimeout(function () {
        $('.channelEng').removeClass('has-error');
        $('.channelEng .help-block').text('')
      },2500)
      return false;
    }
    if(this.msgType == 2 && this.msgUrl == '' ){
      $('.channelUrl').addClass('has-error');
      $('.channelUrl .help-block').text('频道链接不能为空')
      setTimeout(function () {
        $('.channelUrl').removeClass('has-error');
        $('.channelUrl .help-block').text('')
      },2500)
      return false;
    }
    $('.jubuload').show()
    let upimgUrl = '/api/cms/picture/thumb-upload';
    let msgsaveUrl = '/api/cms/channel/save-or-update';
    let obj = {
      name: this.msgTitle ,
      showName:this.showmsgTitle,
      comm:this.channeldesc,
      fileName: this.msgEnglish ,
      id: this.msgId,
      orders: this.msgIndex,
      pId: this.pId ,
      siteId:  $("#choosesite").val() ,
      url: this.msgUrl ,
      type:this.msgType,
      icon: ''
    }
    if(this.addnewchannel){//新增频道
      obj.pId = this.msgId;
      obj.id = '' ;
    }
    if(this.msgEnglish){
      let chongfu = '/api/cms/channel/repeat-name?channelId='+ this.msgId +'&siteId='+ $("#choosesite").val()+'&fileName=' + this.msgEnglish;
      this.http.get(chongfu).subscribe(
        data=>{
          console.log(data);
          if(data['body']){
            $('.jubuload').hide()
            $('.channelEng').addClass('has-error');
            $('.channelEng .help-block').text('英文名称不能重复')
            setTimeout(function () {
              $('.channelEng').removeClass('has-error');
              $('.channelEng .help-block').text('')
            },2500)
          }else{
            if(that.imgchange){//更换logo
              that.http.post(upimgUrl,that.formData).subscribe(
                data1=>{
                  console.log(data1)
                  if(data1['header'].code == 200){
                    obj.icon = data1['body'];
                    that.http.post(msgsaveUrl,obj).subscribe(
                      data2=>{
                        console.log(data2);
                        if(data2['header'].code == 200){
                          if(that.setornew){
                            that.common.addnode(data2['body']);
                            that.msgTitle = data2['body'].desc;
                            that.showmsgTitle = data2['body'].showName;
                            that.channeldesc=data2['body'].comm;
                            that.msgIndex = data2['body'].orders;
                            that.msgId = data2['body'].id;
                            that.msgEnglish = data2['body'].fileName;
                            $('.channelLogo img').attr('src',data2['body'].icon);
                            $('.changeUrl').hide();
                            that.isSetmsg = false;
                            $('.msg_box input').attr('readonly','readonly')
                            that.isCandel = true;
                            $('.addChannel').show();
                            $('.setMsg').show();
                            $('.jubuload').hide();
                          }else{
                            $('.jubuload').hide()
                            that.common.updateNode(data2['body'].desc);
                            that.myclick();
                          }
                        }
                      },
                      err=>{console.log(err)}
                    )
                  }else{
                    $('.jubuload').hide();
                    that.isHint= true;
                    that.hintMsg = data1['header'].desc ;
                    setTimeout(function () {
                      that.isHint= false;
                      that.hintMsg = '';
                    },1500)
                  }
                },
                err=>{console.log(err)}
              )
            }else{
              obj.icon = $('.channelLogo img').attr('src')
              that.http.post(msgsaveUrl,obj).subscribe(
                data2=>{
                  console.log(data2)
                  if(data2['header'].code == 200){
                    if(that.setornew){
                      that.common.addnode(data2['body']);
                      that.msgTitle = data2['body'].desc;
                      that.showmsgTitle=data2['body'].showName;
                      that.channeldesc=data2['body'].comm;
                      that.msgIndex = data2['body'].orders;
                      that.msgId = data2['body'].id;
                      that.msgEnglish = data2['body'].fileName;
                      $('.channelLogo img').attr('src',data2['body'].icon);
                      $('.changeUrl').hide();
                      that.isSetmsg = false;
                      $('.msg_box input').attr('readonly','readonly')
                      that.isCandel = true;
                      $('.addChannel').show();
                      $('.setMsg').show();
                      $('.jubuload').hide();
                    }else{
                      $('.jubuload').hide();
                      that.common.updateNode(data2['body'].desc);
                      that.myclick();
                    }
                  }
                },
                err=>{console.log(err)}
              )
            }
          }
        },
        err=>{console.log(err)}
      )
    }else{
      if(this.imgchange){//更换logo
        this.http.post(upimgUrl,this.formData).subscribe(
          data1=>{
            console.log(data1)
            if(data1['header'].code == 200){
              obj.icon = data1['body'];
              this.http.post(msgsaveUrl,obj).subscribe(
                data2=>{
                  console.log(data2);
                  if(data2['header'].code == 200){
                    if(that.setornew){
                      that.common.addnode(data2['body']);
                      that.msgTitle = data2['body'].desc;
                      that.showmsgTitle=data2['body'].showName;
                      that.channeldesc=data2['body'].comm;
                      that.msgIndex = data2['body'].orders;
                      that.msgId = data2['body'].id;
                      that.islook = true;
                      that.msgUrl = data2['body'].url;
                      $('.channelLogo img').attr('src',data2['body'].icon);
                      $('.changeUrl').hide();
                      that.isSetmsg = false;
                      $('.msg_box input').attr('readonly','readonly');
                      that.isCandel = true;
                      $('.addChannel').show();
                      $('.setMsg').show();
                      $('.jubuload').hide()
                    }else{
                      $('.jubuload').hide()
                      that.common.updateNode(data2['body'].desc);
                      that.myclick();
                    }
                  }else{
                    $('.jubuload').hide()
                    that.isHint= true;
                    that.hintMsg = data2['header'].desc ;
                    setTimeout(function () {
                      that.isHint= false;
                      that.hintMsg = '';
                    },1500)
                  }
                },
                err=>{console.log(err)}
              )
            }else{
              $('.jubuload').hide()
              that.isHint= true;
              that.hintMsg = data1['header'].desc ;
              setTimeout(function () {
                that.isHint= false;
                that.hintMsg = '';
              },1500)
            }
          },
          err=>{console.log(err)}
        )
      }else{
        obj.icon = $('.channelLogo img').attr('src')
        this.http.post(msgsaveUrl,obj).subscribe(
          data2=>{
            console.log(data2)
            if(data2['header'].code == 200){
              if(that.setornew){
                that.common.addnode(data2['body']);
                that.msgTitle = data2['body'].desc;
                that.showmsgTitle=data2['body'].showName;
                that.channeldesc=data2['body'].comm;
                that.msgIndex = data2['body'].orders;
                that.msgId = data2['body'].id;
                that.islook = true;
                that.msgUrl = data2['body'].url;
                $('.channelLogo img').attr('src',data2['body'].icon);
                $('.changeUrl').hide();
                that.isSetmsg = false;
                $('.msg_box input').attr('readonly','readonly');
                that.isCandel = true;
                $('.addChannel').show();
                $('.setMsg').show();
                $('.jubuload').hide()
              }else{
                $('.jubuload').hide()
                that.common.updateNode(data2['body'].desc);
                that.myclick();
              }
            }else{
              $('.jubuload').hide()
              that.isHint= true;
              that.hintMsg = data2['header'].desc ;
              setTimeout(function () {
                that.isHint= false;
                that.hintMsg = '';
              },1500)
            }
          },
          err=>{console.log(err)}
        )
      }
    } 
  }
  closechild(){
    $('#addnew_box').hide();
  }
  sure(){
    this.isload = true;
    var that = this;
    if(this.delType == 1){//删除频道
      var deleteUrl = '/api/cms/channel/del?channelId=' + this.msgId;
      this.http.post(deleteUrl,{headers:this.headers}).subscribe(
        data=>{
          console.log(data);
          if(data['header'].code == 200){
            that.isload = false;
            // $('.delsure').bind('click',that.common.remove)
            that.common.remove();
            $(".msg_box").hide();
          }
        },
        err=>{console.log(err)}
      )
    }else{//删除页面
      var url = '/api/cms/page/del-page?pageId=' + this.delId + '&channelId=' + this.msgId ;
      this.http.delete(url).subscribe(
        function  (data) {
          that.isload=false;
          if(data['header'].code == 200){
            that.isHint= true;
            that.hintMsg = '删除成功';
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
            if(that.delType == 'channel'){
              that.myclick();
            }
            if(that.delType == 'page'){
              let childUrl = '/api/cms/page/page-list?pageNo='+ that.pageNo +'&pageSize='+ 2 + '&channelId='+ that.msgId+'&siteId='+$("#choosesite").val();
              that.http.get(childUrl).subscribe(
                function (data) {
                  console.log(data)
                  if(data['header'].code == 200){
                    if(data['body'].totalCount > 0){
                      that.haveChild = true;
                      that.pagenumList = [1];
                      that.childList = data['body'].list;
                      that.pageNo = data['body'].pageNo;
                      for (var i = 0; i < data['body'].count-1; i++) {
                        that.pagenumList.push(1)
                      }
                    }else{
                      that.haveChild = false;
                    }
                  }
                },function  (err) {
                  console.log(err)
                }
              )
            }
          }else{
            that.isHint= true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
          }
        },function  (err) {
          console.log(err)
        }
      )
    }
    
  }
  searchimg(){
    var that=this;
    var prolist="/api/cms/page/product-list?siteId="+ $("#choosesite").val()+'&code='+$(".ksbm").val()+'&name='+$(".chinesaname").val()+'&seriesCodes='+$(".profl").val();
    this.http.get(prolist).subscribe(function(data){
        that.prolists=data['body'];
    },function(err) {
      console.log(err)
    })
  }
  justnumber(event){
    if( !/\d/.test(event.key) ){
      this.msgIndex = this.msgIndex.substr(0,this.msgIndex.length-1)
    }
  }
  
}
