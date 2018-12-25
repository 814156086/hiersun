import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import {log} from 'util';
declare var $: any;

@Component({
  selector: 'app-addartag',
  templateUrl: './addartactivity.component.html',
  styleUrls: ['./addartactivity.component.css']
})
export class AddartactivityComponent implements OnInit {
  activityTitle: any;
  startDate: any;
  endDate:any;
  topValues: any;
  isLinkStatus=false;
  status:false;
  id:any;
  activityContent:String;
  linkPic:any;
  linkUrl:any;
  isHint = false;
  hintMsg: any;
  isload = false;
  formModel: FormGroup;
  imgUrl:any;
  imgChange=false;
  public formData;
  repeatTagList:any;
  selTagList=[];
  name = 'ng2-ckeditor';
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,fb: FormBuilder) {
     this.activityContent="";
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      // console.log(data);
      that.id = data.id;
    })
    this.formModel = fb.group({
      activityTitle: ['', [Validators.required]],
      topValue: ['', [Validators.required]],
      isLinkStatus: ['', [Validators.required]]
    })
  }
  public headers = new Headers({ "Content-Type": 'application.json' });
  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')

    $('#startDate').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: "divarea,imagebrowser",
      forcePasteAsPlainText: true,
      filebrowserImageUploadUrl: "/api/ckeditor/upload-img",
      filebrowserUploadMethod: 'form',
      height: "450"
    };

    $('#endDate').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    let that = this;
    let tagUrl= '/api/article/artTag/repeat-list';
    this.http.get(tagUrl).subscribe(
      data =>{
        if (data['header'].code == 200) {
          that.repeatTagList = data['body'];
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


    if(that.id!=null){
      let url = '/api/article/artActivity/desc/' + that.id;
      this.http.get(url).subscribe(
        data => {
          if (data['header'].code == 200) {
            that.activityTitle = data['body'].activityTitle;
            that.startDate = data['body'].startDate;
            that.endDate=data['body'].endDate;
            that.topValues = data['body'].activitySort;
            that.isLinkStatus = data['body'].linkStatus;
            that.linkUrl=data['body'].linkUrl;
            that.linkPic=data['body'].linkPic;
            that.activityContent=data['body'].activityContent;
            that.selTagList=data['body'].artTags;
            // console.log(that.selTagList);
            that.status=data['body'].status;
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

  submit() {
    let that = this;
    if(that.isLinkStatus==false){
        that.save();
    }else{
      var url = '/api/article/artContent/upload-img';
      if(that.imgChange){
        that.isload = true;
        this.http.post(url,this.formData).subscribe(function(data){
          // console.log(data)
          that.isload = false;
          if(data['header'].code == 200) {
            that.linkPic = data['body'];
            that.save();
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
        that.save();
      }
    }
  }
  goback() {
    this.common.goback()
  }

  save(){
    let that = this;
    let saveUrl = '/api/article/artActivity/save-or-update';
    let saveParams;
    if(that.id==null){
      saveParams = {
        "linkStatus": that.isLinkStatus,
        "activityTitle": that.activityTitle,
        "startDate": new Date($("#startDate").val()),//
        "endDate":new Date($("#endDate").val()),
        "activitySort": that.topValues,//置顶值
        "linkPic":that.linkPic,
        "linkUrl":that.linkUrl,
        "artTags":that.selTagList,
        "activityContent":that.activityContent,
      }
    }else{
      saveParams = {
        "linkStatus": that.isLinkStatus,
        "activityTitle": that.activityTitle,
        "startDate": new Date($("#startDate").val()),//
        "endDate":new Date($("#endDate").val()),
        "activitySort": that.topValues,//置顶值
        "linkPic":that.linkPic,
        "linkUrl":that.linkUrl,
        "artTags":that.selTagList,
        "activityContent":that.activityContent,
        "status":that.status,
        "id":that.id,
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
  //选择是否链接类型
  select_link(){
    if($("#isLinkStatus").val()=='true'){
      $(".div_link").show();
      $(".div_activity").hide();
    }else if($("#isLinkStatus").val()=='false'){
      this.isLinkStatus=false;
      $(".div_link").hide();
      $(".div_activity").show();
    }else{
      console.log(3);
      $(".div_link").hide();
      $(".div_activity").hide();
    }
  }
  //选择标签
  subSelectTags(){
    var that=this;
    let html="";
    $('input[name="check_tags"]:checked').each(function(){
      that.selTagList.push({
        id:$(this).val(),
        tagName:$(this).attr("title"),
        tagStatus:true,
      })
    })
    // // console.log(that.selTagList);
    $('#myModal').modal('hide');
    $(".showTag").append(html);
  }
  //标签
  deltag(picid){
    var that=this;
    that.selTagList.map((item,index)=>{
      if(item.id==picid){
        that.selTagList.splice(index,1)
      }
    })
  }
  ngAfterViewInit() {
    this.ckeditor.instance.on('key', (event) => {

    });
  }

  onChange($event: any): void {
  }
}



