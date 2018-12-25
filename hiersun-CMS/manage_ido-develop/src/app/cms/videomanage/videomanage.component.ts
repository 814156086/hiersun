import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient} from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-videomanage',
  templateUrl: './videomanage.component.html',
  styleUrls: ['./videomanage.component.css']
})
export class VideomanageComponent implements OnInit {
  imgList = [];
  viewdetail:any;
  isHint=false;
  fileList:any;
  hintMsg:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  listview=[];
  ischoose=false;
  groupList=[]
  videoslt:any;
  chooseid:any;
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(private sanitizer: DomSanitizer,private http:HttpClient,private msg: NzMessageService) { }

  ngOnInit() {
    let that=this;
    
    let groupUrl = '/api/cms/site/list';
    this.http.get(groupUrl).subscribe(
      data=>{
        that.groupList = data['body'];
        that.choose(that.groupList[0].id);
      },
      err=>{console.log(err)}
    )
  }
  choose(id){
    let that=this;
    that.chooseid=id;
    let imgUrl = '/api/cms/video/page-list?pageNo=1&pageSize='+ this.pageSize+"&groupId="+id;
    let params = {//页面初加载请求第一个组的id
      pageNo:this.pageNo,
      pageSize:this.pageSize
    }
    this.http.get(imgUrl).subscribe(
      data=>{
        that.isload = false;
        if(data['header'].code == 200){
          that.listview = data['body'].list;
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


  resert(){
    $(".searchname").val("")
  }
  search(){
    let that=this;
    
    let imgUrl = '/api/cms/video/page-list?pageNo=1&pageSize='+ this.pageSize+'&videoName='+$(".searchname").val()+"&groupId="+that.chooseid;
    let params = {//页面初加载请求第一个组的id
      pageNo:this.pageNo,
      pageSize:this.pageSize
    }
    this.http.get(imgUrl).subscribe(
      data=>{
        that.isload = false;
        if(data['header'].code == 200){
          that.listview = data['body'].list;
         /*  for (var i = 0; i < data['body'].pageCount -1; i++) {
            that.pagenumList.push(1)
          } */
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
  deldata(key) {
    $(".dataid").val(key);
  }
  datadel(){
    let key= $(".dataid").val();
    let delimgUrl = '/api/cms/video/del-video?videoId=' +key +'&enabled=0';
    let that = this;
    that.isload = true;
    this.http.post(delimgUrl,{header:this.headers}).subscribe(
      data=>{
        that.isload = false;
        if(data['header'].code == 200){
          let imgUrl = '/api/cms/video/page-list?pageNo=1&pageSize='+ this.pageSize;
    let params = {//页面初加载请求第一个组的id
      pageNo:this.pageNo,
      pageSize:this.pageSize
    }
    this.http.get(imgUrl).subscribe(
      data=>{
        that.isload = false;
        if(data['header'].code == 200){
          that.listview = data['body'].list;
         /*  for (var i = 0; i < data['body'].pageCount -1; i++) {
            that.pagenumList.push(1)
          } */
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
  bigpic(i){
    this.videoslt=i
  }
  closeUp(){
    this.fileList = [];
    this.imgList=[];
    $('#imgFile').val('');
    this.choose(this.chooseid)
  }
  mychange(e){
    this.ischoose=true;
    if(e.type == 'success'){
      this.ischoose=false;
    }
  }
  pagenumber(pagenumber){
    let that = this;
    that.isload = true;
    let imgUrl = '/api/cms/video/page-list?pageNo='+pagenumber+'&pageSize='+ this.pageSize+"&groupId="+that.chooseid;
    this.http.get(imgUrl).subscribe(function(data){
      that.isload = false;
      if(data['header'].code == 200){
        that.listview = data['body'].list;
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
}
