import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient} from '@angular/common/http';
import { filter } from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-imggallery',
  templateUrl: './imggallery.component.html',
  styleUrls: ['./imggallery.component.css']
})
export class ImggalleryComponent implements OnInit {
  // siteList=['PC','M','wechat','qiake'];
  imgList = [];
  upParams=[];
  subfile=[];
  imgTypeList = [];
  imgTypeName = [];
  groupList = [];
  chooseGroup = [];
  saveGroup = [];
  imgMain = [];
  pageNo = 1;
  isUpimg = false;
  imgGroup = '';//空代表全部
  pagenumList = [1];
  imgUrl = '';
  setMsg=[];
  isset=false;
  isload=true;
  isHint=false;
  fileList:any;
  hintMsg:any;
  pageSize:any;
  pageCount:any;//总页数
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(private sanitizer: DomSanitizer,private http:HttpClient,private msg: NzMessageService) { }

  ngOnInit() {
    // $('#myTab li').eq(2).addClass('active')
    let width = parseInt($('.contenttab').css('width'))
    this.pageSize = Math.floor(width/220) * 3
    var that = this;
    let imgTypeUrl = '/api/cms/pictureTag/list'
    let groupUrl = '/api/cms/site/list'
    // 所有标签
    this.http.get(imgTypeUrl).subscribe(
      data=>{
        that.imgTypeList = data['body'];
        for (var i = 0; i < data['body'].length; i++) {
          that.imgTypeName.push(data['body'][i].name)
        }
      },
      err=>{console.log(err)}
    )
    //所有组
    this.http.get(groupUrl).subscribe(
      data=>{
        console.log(data)
        that.groupList = data['body'];
        that.chooseid=that.groupList[0].id;
        that.choose(that.chooseid);
      },
      err=>{console.log(err)}
    )
  }
  // 图片库分类 点击事件OK 添加请求 渲染图片列表
  public chooseid:any;
  choose(id){
    // console.log(id)
    this.imgGroup = id?id:'';
    this.saveGroup.push(this.imgGroup);
    this.pageNo = 1;
    this.pagenumList = [1];
    this.isload = true;
    this.chooseid=id;
    var that = this;
    let imgurl = '/api/cms/picture/page-list?pageNo=' + that.pageNo + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
    this.http.get(imgurl).subscribe(
      data=>{
        that.isload = false;
        if(data['header'].code == 200){
          that.imgMain = data['body'].list;
          that.pageNo = data['body'].pageNo;
          that.pageNo = data['body'].pageNo;
          that.pageCount = data['body'].pageCount;
          $("#pagination1").pagination({
            currentPage:that.pageNo,
            totalPage: that.pageCount,
            callback: function(current) {
              that.pageNo = current;
              that.pagenumber(that.pageNo)
            }
          });
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        console.log(err)
      }
    )
  }
  // 多选文件 OK
  selectImg(e){
    let that = this;
    if((this.imgList.length + e.target.files.length) >10){
      this.isHint = true;
      this.hintMsg = '分组必填';
      setTimeout(function () {
        that.isHint= false;
        that.hintMsg = '';
      },1500);
      return false;
    }
    let newImglist = []
    for (var i = 0; i < e.target.files.length; i++) {
      newImglist.push({file:e.target.files[i]})
      newImglist[i].imgType = [];
      newImglist[i].typeName = [];
      newImglist[i].saveMsg ='';
      let url = window.URL.createObjectURL(e.target.files[i]);
      newImglist[i].url = this.sanitizer.bypassSecurityTrustUrl(url);
    }
    this.imgList = this.imgList.concat(newImglist);
    $('.allUp').attr('disabled',false);
  }
  // 单张上传 Ok
  oneUp(key){
    let url = '/api/cms/picture/picture-upload'
    let formData = new FormData()
    var that = this;
    if(this.saveGroup.length == 0){
      this.isHint = true;
      this.hintMsg = '分组必填';
      setTimeout(function () {
        that.isHint= false;
        that.hintMsg = '';
      },1500);
      return false;
    }
    if(this.imgList[key].imgType.length == 0){
      this.isHint = true;
      this.hintMsg = '关联标签必填';
      setTimeout(function () {
        that.isHint= false;
        that.hintMsg = '';
      },1500);
      return false;
    }
    $('.everyone:nth-child('+(key+1)+')').find('.upOneimg').attr('disabled','disabled');
    formData.append('file',this.imgList[key].file)
    // console.log(this.imgList[key])
    this.http.post(url,formData).subscribe(
      data=>{
        console.log(data)
        if(data['header'].code == 200){
          // that.imgList[key].saveMsg = data['body'][0];
          var obj = [];
          var saveUrl = '/api/cms/picture/save';
          data['body'][0].tagIds = that.imgList[key].imgType;
          data['body'][0].tagNames = that.imgList[key].typeName;
          data['body'][0].groupsId = that.saveGroup;
          console.log(data)
          obj.push(data['body'][0]);
          that.http.post(saveUrl,obj).subscribe(
            result=>{
              // console.log(result);
              if(result['header'].code == 200){
                $('.everyone:nth-child('+(key+1)+')').find('.progress').animate({width:150},200,'linear',function () {
                  // console.log('第'+key+'个上传成功')
                  $('.everyone:nth-child('+(key+1)+')').find('.oneBtn').hide();
                  $('.everyone:nth-child('+(key+1)+')').find('.up_success').show();
                  that.isUpimg = true;
                })
                that.upParams.push(key);
              }else{
                that.isHint= true;
                that.hintMsg = result['header'].desc;
                setTimeout(function () {
                  that.isHint= false;
                  that.hintMsg = '';
                },1500)
              }
            },
            err=>{console.log(err)}
          )
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
          $('.everyone:nth-child('+(key+1)+')').find('.upOneimg').removeAttr('disabled');
        }
      },
      err=>{
        console.log(err)
      }
    )
  }
  // 上传列表单个删除 OK
  delOne(key){
    $('.everyone:nth-child('+(key+1)+')').find('.delOneimg').attr('disabled','disabled');
    this.imgList.splice(key,1);
  }
  // 一键上传 OK
  allUp(){
    let url = '/api/cms/picture/picture-upload'
    let that = this;
    if(this.saveGroup.length == 0){
      this.isHint = true;
      this.hintMsg = '分组必填';
      setTimeout(function () {
        that.isHint= false;
        that.hintMsg = '';
      },1500);
      return false;
    }
    $('.allUp').attr('disabled','disabled')
    for (var i = 0; i < this.imgList.length; i++) {
      (function (i) {
        if(that.upParams.indexOf(i) == -1){//表示列表中没进行单张上传的
          if(that.imgList[i].imgType.length == 0){
            that.isHint = true;
            that.hintMsg = '图片关联标签必填';
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500);
            return false;
          }
          let formData = new FormData();
          formData.append('file',that.imgList[i].file)
          that.http.post(url,formData).subscribe(
            data=>{
              // console.log(data)
              if(data['header'].code == 200){
                // that.imgList[i].saveMsg = data['body'][0];
                var obj = [];
                var saveUrl = '/api/cms/picture/save';
                data['body'][0].tagIds = that.imgList[i].imgType;
                data['body'][0].tagNames = that.imgList[i].typeName;
                data['body'][0].groupsId = that.saveGroup;
                obj.push(data['body'][0]);
                that.http.post(saveUrl,obj).subscribe(
                  result=>{
                    // console.log(result);
                    if(result['header'].code == 200){
                      $('.everyone:nth-child('+ (i+1) +')').find('.progress').animate({
                        width:150},
                        200,
                        'linear',
                        function () {
                        // console.log('第'+i+'个上传成功')
                        $('.everyone:nth-child('+ (i+1) +')').find('.oneBtn').hide();
                        $('.everyone:nth-child('+ (i+1) +')').find('.up_success').show();
                        that.isUpimg = true;  
                      })
                      that.upParams.push(i);
                    }else{
                      that.isHint= true;
                      that.hintMsg = result['header'].desc;
                      setTimeout(function () {
                        that.isHint= false;
                        that.hintMsg = '';
                      },1500)
                      $('.allUp').attr('disabled',false) 
                    }
                  },
                  err=>{console.log(err)}
                )
              }
            },
            err=>{
              console.log(err)
            }
          )
        }
      })(i)
    }
  }
  //选择分组
  //  celectZU(e,id){
  //   if($(e).hasClass('chooseZU')){
  //     $(e).removeClass('chooseZU');
  //     this.saveGroup.splice(this.saveGroup.indexOf(id),1);
  //   }else{
  //     $(e).addClass('chooseZU');
  //     this.saveGroup.push(id);
  //   }
  //   // console.log(this.saveGroup)
  // }
  // 选择标签 
  selectType(key){
    $('.everyone:nth-child('+(key+1)+')').siblings('.everyone').find('ul').removeClass('show')    
    $('.everyone:nth-child('+(key+1)+')').find('.selectType').toggleClass('show')
  }
  // 选择关联标签
  chooseLi(key,typeKey){
    let imgtype = $('.everyone:nth-child('+(key+1)+') .selectType li:nth-child('+ (typeKey+1) +')').attr('type');
    let typename = $('.everyone:nth-child('+(key+1)+') .selectType li:nth-child('+ (typeKey+1) +')').text();

    $('.everyone:nth-child('+(key+1)+')').find('ul').removeClass('show') ;
    $('.everyone:nth-child('+(key+1)+')').find('.imgTypeId').val(typename) ;
    if(this.imgList[key].imgType.indexOf(imgtype) == -1){
      this.imgList[key].imgType.push(imgtype);
      this.imgList[key].typeName.push(typename);
    }
  }
  // 手动输入标签
  everyTag(event,key){
    let imgtype = $('.everyone:nth-child('+(key+1)+')').find('.imgTypeId').val() ;
    if((event.code == 'Enter' && imgtype !='' &&  this.imgList[key].typeName.indexOf(imgtype)) || (event.code == 'NumpadEnter' && imgtype !='' && this.imgList[key].typeName.indexOf(imgtype))){
      this.imgList[key].imgType.push('');
      this.imgList[key].typeName.push(imgtype);
      $('.everyone:nth-child('+(key+1)+')').find('.imgTypeId').val('');
    }else{
      $('.everyone:nth-child('+(key+1)+')').find('.selectType').removeClass('show')
    }
  }
  // 删除关联标签
  delImgtype(key,every){
    this.imgList[key].imgType.splice(every,1);
    this.imgList[key].typeName.splice(every,1);
  }
  closeUp(){
    this.fileList = [];
    this.imgList=[];
    this.saveGroup = [];
    this.chooseGroup = [];
    $('#imgFile').val('');
  }
  // 保存页面
  allSave(){
    this.isload = true;
    // console.log(this.imgList)
    if(this.saveGroup.length == 0){
      // console.log('分组必填')
      return false
    }
    let that = this;
    if(this.isUpimg){//如果上传过图片才能保存
      let obj = [];
      for (var i = 0; i < this.imgList.length; i++) {
        if(this.imgList[i].saveMsg !=''){
          this.imgList[i].saveMsg.tagIds = this.imgList[i].imgType;
          this.imgList[i].saveMsg.tagNames = this.imgList[i].typeName;
          this.imgList[i].saveMsg.groupsId = this.saveGroup;
          obj.push(this.imgList[i].saveMsg)
        }else{
          (function (i) {
            that.isHint= true;
            that.hintMsg = '第'+ i +'张未上传,上传的图片才能保存;' ;
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
            return false;
          })(i)
        }
        
      }
      // console.log(obj)
      let saveUrl = '/api/cms/picture/save';
      
    }else{
      // console.log('请先上传图片!')
    }
  } 
  /* goPage(item){
    $('.next').removeClass('disabled')
    $('.previous').removeClass('disabled')
    if(this.pageNo == (item+ 1)  ){
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
    let that = this;
    that.isload = true;
    let imgurl = '/api/cms/picture/page-list?pageNo=' + that.pageNo + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
    this.http.get(imgurl).subscribe(function(data){
      // console.log(data)
      that.isload = false;
      if(data['header'].code == 200){
        that.imgMain = data['body'].list;
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
  pagenumber(pagenumber){
    let that = this;
    that.isload = true;
    let imgurl = '/api/cms/picture/page-list?pageNo=' + pagenumber + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
    this.http.get(imgurl).subscribe(function(data){
      // console.log(data)
      that.isload = false;
      if(data['header'].code == 200){
        that.imgMain = data['body'].list;
        that.pageNo = data['body'].pageNo;
        that.pageCount = data['body'].pageCount;
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
  }
  pagefuction(){
    let that = this;
    that.isload = true;
    let imgurl = '/api/cms/picture/page-list?pageNo=' + that.pageNo + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
    this.http.get(imgurl).subscribe(function(data){
      // console.log(data)
      that.isload = false;
      if(data['header'].code == 200){
        that.imgMain = data['body'].list;
        that.pageNo = data['body'].pageNo;
        that.pageCount = data['body'].pageCount;
        $("#pagination1").pagination({
          currentPage: that.pageNo,
          totalPage: that.pageCount,
          callback: function(current) {
            that.pageNo = current;
           that.pagenumber(that.pageNo)
          }
        });
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
  } 
  
  // 删除图片
  imgvalue(val){
    $(".imgid").val(val)
  }
  delevImg(){
    let delimgUrl = '/api/cms/picture/del-picture?picId=' +$(".imgid").val() +'&enabled=0';
    let params = {
      pageNo:this.pageNo,
      pageSize:this.pageSize,
      groupId:this.imgGroup
    }
    let that = this;
    that.isload = true;
    this.http.post(delimgUrl,{header:this.headers}).subscribe(
      data=>{
        // console.log(data);
        that.isload = false;
        if(data['header'].code == 200){
          let imgurl = '/api/cms/picture/page-list?pageNo=' + that.pageNo + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
          that.http.get(imgurl).subscribe(
            function(data){
            // console.log(data)
            that.imgMain = data['body'].list;
            that.pageNo = data['body'].pageNo;
            that.pageCount = data['body'].pageCount;
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.pagenumber(that.pageNo)
              }
            });
          },function(err){
            console.log(err)
          })
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
        
      },
      err=>{
        console.log(err)
      }
    )
  }
  // 编辑图片
  setEvimg(id){
    let setimgUrl = '/api/cms/picture/desc/'+id;
    let that = this;
    this.setMsg = []
    this.http.get(setimgUrl).subscribe(
      data=>{
        // console.log(data)
        /* data['body'].picSize = (data['body'].picSize /1024).toFixed(2); */
        data['body'].groupName = [];
        data['body'].tagNames = [];
        if(data['body'].tagIds){
          for (var i = 0; i < data['body'].tagIds.length; i++) {
            for (var j = 0; j < that.imgTypeList.length; j++) {
              if(data['body'].tagIds[i] == that.imgTypeList[j].id){
                data['body'].tagNames.push(that.imgTypeList[j].name)
              }
            }
          }
        }
        for (var i = 0; i < data['body'].groupsId.length; i++) {
          for (var j = 0; j < that.groupList.length; j++) {
            if(data['body'].groupsId[i] == that.imgTypeList[j].id){
              data['body'].groupName.push(that.groupList[j].name)
            }
          } 
        }
        that.setMsg.push(data['body']);
        that.isset = true;
      },
      err=>{console.log(err)}
    )
    
  }
  // 编辑图片的时候选择分组
  setImgChoose(){
    let arr = $('#setImgSel').val().split('_');
    if($('#setImgSel').val()!= '' && this.setMsg[0].groupsId.indexOf(arr[0]) == -1 ){
      this.setMsg[0].groupsId.push(arr[0]);
      this.setMsg[0].groupName.push(arr[1]);
    }
  }
  // 编辑图片的时候删除分组
  setImgDelGroup(key){
    this.setMsg[0].groupsId.splice(key,1);
    this.setMsg[0].groupName.splice(key,1);
  }
  // 编辑图片选择标签
  setImgSelTag(){
    $('.setImgInput').toggleClass('show')
  }
  // 手动输入标签
  setImgOver(event){
    $('.setImgInput').removeClass('show');
    let overMsg = $('.setImgOverInput').val()
    if( (event.code == 'Enter' || event.code == 'NumpadEnter' ) && overMsg != '' && this.setMsg[0].tagNames.indexOf(overMsg) == -1 ){
      $('.setImgOverInput').val('')
      this.setMsg[0].tagNames.push(overMsg)
      this.setMsg[0].tagIds.push('')
    }
  }
  // 编辑的时候选标签
  setSelTag(key){
    $('.setImgInput').removeClass('show');
    let typeId = this.imgTypeList[key].id;
    let typeName = this.imgTypeList[key].name; 
    $('.setImgOverInput').val(typeName)
    if(this.setMsg[0].tagIds.indexOf(typeId) == -1){
      this.setMsg[0].tagIds.push(typeId);
      this.setMsg[0].tagNames.push(typeName);
    }
  }
  // 编辑的时候删除标签
  setImgDelTag(key){
    this.setMsg[0].tagNames.splice(key,1)
    this.setMsg[0].tagIds.splice(key,1)
  }
  // 关闭编辑
  closeSet(){
    this.isset = false;
    this.setMsg = [];
  }
  // 编辑保存
  setSave(){
    // console.log(this.setMsg[0])
    this.isload = true;
    if(this.setMsg[0].groupsId.length == 0){
      // console.log('分组必填')
      return false
    }
    let saveUrl = '/api/cms/picture/save';
    let that = this;
    this.http.post(saveUrl,this.setMsg).subscribe(
      data=>{
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          let obj = {
            pageNo:that.pageNo,
            pageSize:that.pageSize,
            groupId:that.imgGroup
          }
          let imgurl = '/api/cms/picture/page-list?pageNo=' + that.pageNo + '&pageSize='+that.pageSize+'&groupId=' +that.imgGroup ;
          that.http.get(imgurl).subscribe(
            data=>{
              that.imgMain = data['body'].list;
              /* that.isset = false; */
              console.log("保存成功")
              $(".modal-backdrop").hide();
              $("#myModalpic").hide();
              that.pageNo = data['body'].pageNo;
                that.pageCount = data['body'].pageCount;
                $("#pagination1").pagination({
                  currentPage:that.pageNo,
                  totalPage: that.pageCount,
                  callback: function(current) {
                    that.pageNo = current;
                    that.pagenumber(that.pageNo)
                  }
                });
            },
            err=>{console.log(err)}
          )
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }
  //图片预览
   yulan(e){
    if(e.offsetHeight >= e.offsetWidth){
      $('.yulan_box').addClass('height');
    }
    $('.yulan_box').show();
    $('.yulan_box>div>img').attr('src',$(e).attr('src'));
  } 
  gbyl(){
    $('.yulan_box').removeClass('height').hide();
    $('.yulan_box>div>img').attr('src','');
  }

  mychange(e){
    this.subfile = [];
    if(e.type == 'success'){
      for (var i = 0; i < e.fileList.length; i++) {
        const firstName = 
        (e.fileList[i]
          && e.fileList[i].response
          && e.fileList[i].response['body']
          && e.fileList[i].response['body'][0]

        ) || 'default';
        console.log(firstName)
        // firstName.siteId=this.chooseid
        this.subfile.push(firstName);
      }
    }
  }
  saveimgList(){
    let that = this;
    if(this.subfile.length == 0){
      this.isHint=true;
      this.hintMsg='图片上传成功才可保存';
      setTimeout(function(){
        that.isHint = false;
        that.hintMsg='';
      },1500)
      return false;
    }
    for (var i = 0; i < this.subfile.length; i++) {
      this.subfile[i]['groupsId']=this.saveGroup
    }

    let saveUrl = '/api/cms/picture/save';
    this.http.post(saveUrl,this.subfile).subscribe(
      data=>{
        // console.log(data);
        if(data['header']['code'] == 200){
          that.closeUp();
          $('#large').hide();
				  $(".modal-backdrop").hide()
          // that.goPage(0)
        }

      },
      err=>{console.log(err)}
    )
  }

  beforeUpload = (file: File) => {
    let that = this;
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      this.isHint=true;
      this.hintMsg='图片大小必须小于10MB!';
      setTimeout(function(){
        that.isHint = false;
        that.hintMsg='';
      },1500)
      return false;
    }
    return isLt2M;
  }
  upload(){
    console.log(this.chooseid)
  }
}
