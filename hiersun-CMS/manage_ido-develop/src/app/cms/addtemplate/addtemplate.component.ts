import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import * as $ from 'jquery';
import { HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import { ActivatedRoute  } from "@angular/router";

@Component({
  selector: 'app-addtemplate',
  templateUrl: './addtemplate.component.html',
  styleUrls: ['./addtemplate.component.css']
})
export class AddtemplateComponent implements OnInit {
  pageTmplId:any;
  setname:any;
  setContent:any;
  imgUrl;
  sanitizerUrl;
  siteType:any;
  id='';
  textcontets:any;
  textnames:any;
  imgChange = false;
  isload=false;
  isHint=false;
  hintMsg:any;
  siteId:any;
  public formData;
  public headers = new Headers({'Content-Type': 'application/json'});
  formModel: FormGroup;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder) {
    this.formModel = fb.group({
      textname: ['', [Validators.required]],
      textcontet:['', [Validators.required]]
    })
  }
  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(3)').addClass('active')
    var that = this;
    this.route.queryParams.subscribe(function(data){
      // console.log(data)
      that.siteType = data.siteType;
      that.pageTmplId = data.pageid;
      that.siteId=data.siteId;
      if(data.id){
        that.id = data.id;
      }
    })
    if(this.id){
      var url = '/api/cms/segmentTmpl/desc/'+this.id;
      this.http.get(url).subscribe(
        function (data) {
          // console.log(data)
          if(data['header'].code == 200){
           that.textcontets = data['body'].content;
           that.textnames =data['body'].name; 
            that.imgUrl = data['body'].thumbnail;
            if(data['body'].thumbnail!=""){
              $(".imgbox").show();
              $('.setimg').attr('src',data['body'].thumbnail).show()
            }
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
        }
      )
    }
  }
  goback(){
    this.common.goback()
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
  //重置
  resetform(){
    $('.templatecon')[0].reset();
  }
  onSubmit(){
    var that= this;
    let isValidname:boolean = this.formModel.get("textname").valid;
    let isValidcontent:boolean = this.formModel.get("textcontet").valid;
    if(!isValidname){
      return false;
    }
    if(!isValidcontent){
      return false;
    }
    
    var suburl = '/api/cms/segmentTmpl/save-or-update'      
    var url = '/api/cms/picture/thumb-upload?siteId='+that.siteId;
    
    if(this.imgChange){
      that.isload = true;  
      this.http.post(url,this.formData).subscribe(function(data){
          // console.log(data)
          that.isload = false;
          if(data['header'].code == 200){
            that.imgUrl = data['body'];
            var obj = {
                  content: that.textcontets ,
                  id: that.id ,
                  name: that.textnames,
                  siteType: that.siteType ,
                  thumbnail:that.imgUrl
                }
            that.http.post(suburl,obj).subscribe(
              function(data){
                // console.log(data)
                if(data['header'].code == 200){
                  that.common.goback()
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
      var obj = {
            content: that.textcontets,
            id: that.id ,
            name:that.textnames,
            siteType: that.siteType ,
            thumbnail:this.imgUrl,
            pageTmplId:that.pageTmplId
          }
      this.http.post(suburl,obj).subscribe(
        function(data){
          // console.log(data)
          if(data['header'].code == 200){
            that.common.goback()
          }
        },function(err){
          console.log(err)
        })
    } 
    
    
    
  }
}
