import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';
declare var $: any;
@Component({
  selector: 'app-videodetail',
  templateUrl: './videodetail.component.html',
  styleUrls: ['./videodetail.component.css']
})
export class VideodetailComponent implements OnInit {
  public nodata = true;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  public videoname: any;
  public videoimg: any;
  public videocq: any;
  public videogq: any;
  public videobq: any;
  public videolc: any;
  public videosize: any;
  public isHint = false;
  public hintMsg: any;
  public subfile=[];
  public videodt:any;
  public isshow=true;
  public chooseid:any;
  constructor(private common: CommonService, private sanitizer: DomSanitizer, private http: HttpClient, private msg: NzMessageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.videodetail();

  }
  videodetail(){
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      if (data.viedoid == '' || data.viedoid == undefined) {//添加数据
        that.nodata = false
      } else {
        let imgUrl = '/api/cms/video/desc/' + data.viedoid;
        that.http.get(imgUrl).subscribe(
          data => {
            that.videodt=data['body'];
            // console.log(data['body'])
            // console.log(that.videodt)
            that.videoname = data['body'].videoName;
            that.videoimg = data['body'].coverUrl;
            that.videocq = data['body'].hdUrl; //超清
            that.videogq = data['body'].sdUrl; //高清
            that.videobq = data['body'].ldUrl;  //标情
            that.videolc = data['body'].fdUrl;  //流畅
            that.videobq = data['body'].odUrl;  //没有转码的原始地址
            that.videosize = data['body'].size;  //视频的原始大小
            that.chooseid=data['body'].groupsId[0]
          },
          err => {
            console.log(err)
          }
        )
      }
    })
  }
  goback() {
    this.common.goback()
  }
  beforeUpload = (file: File) => {
    let that = this;
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      this.isHint = true;
      this.hintMsg = '图片大小必须小于10MB!';
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }
    return isLt2M;
  }
 /*  mychange(e) {
    let that = this;
    if (e.type == 'success') {
      if (e.fileList[0].response['header'].code == 200) {
        $('#large').hide();
        $(".modal-backdrop").hide()
      } else {
        that.isHint = true;
        that.hintMsg = '缩略图上传失败';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
        return false;
      }
    }
  } */
  mychange(e){
    // console.log(e)
    let that=this;
    if(e.type == 'success'){
      for (var i = 0; i < e.fileList.length; i++) {
        that.videoimg=e.fileList[i].response['body']
      }
      that.isshow=false;//不显示上传按钮
      // console.log(that.isshow)
    }else{
      that.isshow=true;
    }
  }
  saveimgList(){
    // console.log(this.videoimg);
    let that=this;
    that.videodetail();
    let saveUrl = '/api/cms/video/save-or-update';
    that.videodt.coverUrl=that.videoimg;
    // console.log("2222")
    // console.log(that.videodt)
    that.http.post(saveUrl,that.videodt).subscribe(
      data=>{
        // console.log(data);
        if(data['header']['code'] == 200){
          $('#large').hide();
				  $(".modal-backdrop").hide()
          that.videodetail();
        }

      },
      err=>{console.log(err)}
    )
  }
  closeUp(){
    $('#large').hide();
		$(".modal-backdrop").hide()
  }
  copypageadd(i){
    let that=this;
    let Url2=i;
    let oInput = document.createElement('input');
    oInput.value = Url2;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    this.isHint = true;
    this.hintMsg = '复制成功';
    setTimeout(function () {
      that.isHint = false;
      that.hintMsg = '';
    }, 1500)
  }
}
