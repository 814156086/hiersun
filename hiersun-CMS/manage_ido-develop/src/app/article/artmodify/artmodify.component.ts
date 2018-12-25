import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import {log} from 'util';
declare var $: any;
@Component({
  selector: 'app-artd',
  templateUrl: './artmodify.component.html',
  styleUrls: ['./artmodify.component.css']
})
export class ArtmodifyComponent implements OnInit {
  formModel: FormGroup;
ckeConfig: any;
mycontent: string;
subCode: any;
imgUrl;
imgChange = false;
public formData;
eid:any;//编辑传值id
ecode:any;//编辑传值code
newList = [];
taglist=[];
isload=false;
isHint=false;
hintMsg:any;
heading:any;
publishDate:any;
name = 'ng2-ckeditor';
log: string = '';
@ViewChild("myckeditor") ckeditor: any;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,fb: FormBuilder) {
    this.mycontent = ``;
    route.queryParams.subscribe(queryParams => {
      this.eid = queryParams.eid;
      this.ecode = queryParams.ecode;
    });
    this.formModel = fb.group({
      heading: ['', [Validators.required]]
    })
   }
  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: "divarea,imagebrowser",
      forcePasteAsPlainText: true,
      filebrowserImageUploadUrl: "/api/ckeditor/upload-img",
      filebrowserUploadMethod: 'form',
      height: "450"
    };
    let that = this;
    let url2 = `/api/article/artContent/desc/${that.eid}`
    this.http.get(url2).subscribe(
      function(data){
        that.mycontent=data['body']['content'];
        that.newList.push( data['body']);
        that.heading=data['body']['heading'];
        that.publishDate = data['body']['publishDate'];
      }
    )
    let url3 = `/api/article/artTag/tag-list`;
    this.http.get(url3).subscribe(
      function (data) {
        that.taglist = data['body']
      }
    )
  }

  imgadd(event){
    if(event.target.files.length > 0){
      $(".imgbox").show();
      let file = event.target.files[0];
      let filename = event.target.files[0].name;
      this.imgUrl = window.URL.createObjectURL(file);
      $('.imgbox img').attr('src',this.imgUrl).show();
      this.imgChange=true;
      this.formData = new FormData();
      this.formData.append('file',file)
      this.formData.append('fileName',filename);
    }
  }
  // 提交修改
  edit(){
    let that=this;
    var url = '/api/article/artContent/upload-img';
    if(that.imgChange){
      that.isload = true;
      this.http.post(url,this.formData).subscribe(function(data){
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          that.imgUrl = data['body'];
          that.subarticle();
        }else{
          that.isHint= true;
          that.hintMsg = '图片上传失败';
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },function(err){
        console.log(err)
      })
    }else{
      that.subarticle();
    }
  }
  subarticle(){
    let that=this;
    let obj = {
      "heading": $('#heading').val(),
      "subHeading": $('#subHeading').val(),
      "synopsis": $('#synopsis').val(),
      "code": that.ecode,
      "subCode": $('#subCode').val(),
      "tagCode": $("#selectTag").val(),
      "artNum": $('#artNum').val(),
      "photoPath": that.imgUrl,
      "content" : that.mycontent,
      "publishDate":new Date(that.publishDate),
      "id":that.eid,
      "memberId":$("#memberId").val(),
    }
    let suburl = `/api/article/artContent/save-or-update`
    this.http.post(suburl, obj).subscribe(
      function(data){
        if(data['header'].code == 200){
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.common.goback();
        }, 1500)
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
  onChangetime(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date): void {
    this.publishDate =result
    console.log(this.publishDate);
  }
  // 返回上一级
  back(){
   this.common.goback()
  }

  /**
   * 当内容发生改变时
   * @param $event
   */
  onChange($event: any): void {
  }


}
