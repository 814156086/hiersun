import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import {CommonService} from '../../services/common.service';
declare var $: any;


@Component({
  selector: 'app-addswiper',
  templateUrl: './addswiper.component.html',
  styleUrls: ['./addswiper.component.css']
})
export class AddswiperComponent implements OnInit {
  public formData;
  public headers = new Headers({'Content-Type': 'application/json'});
  formModel: FormGroup;
  id:any;
  picTitle:any;
  stickNum:any;
  picPath:any;
  picStatus=true;
  imgChange=false;
  isload=false;
  isHint=false;
  hintMsg:any;
  imgUrl:any;
  constructor(private common:CommonService,private http: HttpClient,private route: ActivatedRoute,fb: FormBuilder) {

    let that = this;
    this.route.queryParams.subscribe(function (data) {
      // console.log(data);
      that.id = data.id;
    })
    this.formModel = fb.group({
      picTitle: ['', [Validators.required]],
      stickNum: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let that = this;
    if(that.id!=null){
      let url = '/api/article/artPicPath/desc/'+that.id;

      this.http.get(url).subscribe(
        function(data){
          // console.log(data['body'])
          // console.log(data['header'])
          if(data['header'].code == 200){
            that.picTitle = data['body'].picTitle;
            that.stickNum = data['body'].stickNum;
            that.picPath = data['body'].picPath;
            that.picStatus=data['body'].picStatus;
            $(".imgbox").show();
            $('.imgbox img').attr("src",that.picPath).show();
          }
        },function(err){
          console.log(err)
        }
      )
    }

  }

  goback(){
    this.common.goback();
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


  submit(){
    let that= this;
    let isPicTitle:boolean = this.formModel.get("picTitle").valid;
    let isStickNum:boolean = this.formModel.get("stickNum").valid;
    if(!isPicTitle){
      return false;
    }
    if(!isStickNum){
      return false;
    }
    var suburl = '/api/article/artPicPath/save-or-update'
    var url = '/api/article/artContent/upload-img';


    if(that.imgChange){
      that.isload = true;
      this.http.post(url,this.formData).subscribe(function(data){
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          that.picPath = data['body'];
          var obj = {
            picTitle: that.picTitle,
            id: that.id ,
            stickNum:that.stickNum,
            picPath:that.picPath,
            picStatus:that.picStatus
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
        picTitle: that.picTitle,
        id: that.id ,
        stickNum:that.stickNum,
        picPath:that.picPath,
        picStatus:that.picStatus
      }
      this.http.post(suburl,obj).subscribe(
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
    }
  }





}
