import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import {logWarnings} from 'protractor/built/driverProviders';
declare var $: any;

@Component({
  selector: 'app-addartag',
  templateUrl: './addartag.component.html',
  styleUrls: ['./addartag.component.css']
})
export class AddartagComponent implements OnInit {
  tagCodes: any;
  tagNames: any;
  topValues: any;
  isActives: any;
  tagStatus=false;
  isHint = false;
  hintMsg: any;
  isload = false;
  formModel: FormGroup;
  id: any;
  repeatPicList; any;
  selPicsList=[];
  public headers = new Headers({ 'Content-Type': 'application.json' });
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, private router: Router, fb: FormBuilder) {
    const that = this;
    this.route.queryParams.subscribe(function (data) {
      that.id = data.id;
    })
    this.formModel = fb.group({
      tagCode: ['', [Validators.required]],
      tagName: ['', [Validators.required]],
      topValue: ['', [Validators.required]],
      isActives: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active');

    const that = this;

    const picUrl= '/api/article/artPicPath/repeat-list';

    this.http.get(picUrl).subscribe(
      data =>{
        // console.log(data);
        if (data['header'].code == 200) {
          that.repeatPicList = data['body'];
        } else{
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }
      },
      err => {
        console.log(err);
      }
    )

    if(that.id!= null){
      const url = '/api/article/artTag/desc/' + that.id;
      this.http.get(url).subscribe(
        data => {
          // console.log(data)
          if (data['header'].code == 200) {

            that.tagCodes = data['body'].tagCode;
            that.tagNames = data['body'].tagName;
            that.topValues = data['body'].tagSort;
            that.isActives = data['body'].activity;
            that.selPicsList=data['body'].picList;
            that.tagStatus=data['body'].tagStatus;
            // console.log(that.tagStatus);
            if (data['body'].activity) {
              $('select[name="isActives"]').val(1);
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
        err => {
          console.log(err)
        }
      )
    }

  }
  select_activity(){
    if($("#isActives").val()== 'true'){
      $("#select_swiper").show();
      $("#select_img").show();
    }else {
      $("#select_swiper").hide();
      $("#select_img").hide();
    }
  }

  submit() {
    // 验证标签标识
    var that = this;
    let chekurl;
    if(that.id==null){
      chekurl = `/api/article/artTag/check-code?tagCode=${this.tagCodes}`;
    }else{
      chekurl = `/api/article/artTag/check-code?tagCode=${this.tagCodes}&id=`+that.id;
    }
    this.http.get(chekurl).subscribe(
      data => {
        if (data['header'].code == 200) {
          if (data['body']) {
            that.isHint = true;
            that.hintMsg = "标签标识重复！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else {
            that.save();
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
    );

  }
  
  //选择轮播图
  subSelectPics(){
    var that=this;
    let html="";
    $('input[name="uplpic"]:checked').each(function(){
      // html+='<div _ngcontent-c4 class="item_pic">' +
      //   '<div _ngcontent-c4 class="img_close" (click)="delimg($event.target,'+$(this).val()+')">x</div>'+
      //   '<img src="'+$(this).attr("title")+'" alt="" style="width: 195px;height: 150px;">' +
      //   '<input type="hidden" value="'+$(this).val()+'">'+
      //   '<span>'+$(this).siblings(".in_picTitle").text()+'</span>'+
      //   '</div>';
      that.selPicsList.push({
        id:$(this).val(),
        picPath:$(this).attr("title"),
        picTitle:$(this).siblings(".in_picTitle").text(),
        picStatus:true,
      })
    })
    $('#myModal').modal('hide');
    $(".showPic").append(html);
    }
    //删除图片
  delimg(picid){
    var that=this;
    this.selPicsList.map((item,index)=>{
      if(item.id==picid){
        that.selPicsList.splice(index,1)
      }
    })
  }
  
  
  // 提交保存
  save() {
    var that = this;
    let saveUrl = '/api/article/artTag/save-or-update';
    let saveParams;
    if(that.id==null){
      saveParams = {
        'activity': this.isActives,
        "tagCode": this.tagCodes,//标识
        "tagName": this.tagNames,//名称
        "tagSort": this.topValues,//置顶值
        "picList":this.selPicsList,
      }
    }else{
      saveParams = {
        "activity": this.isActives,
        "tagCode": this.tagCodes,//标识
        "tagName": this.tagNames,//名称
        "tagSort": this.topValues,//置顶值
        "id":that.id,
        "tagStatus": that.tagStatus,
        "picList":this.selPicsList,
      }
    }
    this.http.post(saveUrl, saveParams).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
          that.goback()
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
  goback() {
    this.common.goback()
  }
}
