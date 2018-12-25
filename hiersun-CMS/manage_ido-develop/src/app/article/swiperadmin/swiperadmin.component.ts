import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import {CommonService} from '../../services/common.service';
declare var $: any;

@Component({
  selector: 'app-swiperadmin',
  templateUrl: './swiperadmin.component.html',
  styleUrls: ['./swiperadmin.component.css']
})
export class SwiperadminComponent implements OnInit {
public list : any;
  isload=true;
  isHint=false;
  hintMsg:any;
  id:any;
  stickNum:any;
  public message="";
  public status:any;
  public headers = new Headers({'Content-Type': 'application/json'});
  formModel: FormGroup;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,fb: FormBuilder) {
    this.formModel = fb.group({
      stickNum: ['', [Validators.required]],
    })
  }

  //修改
  edit(id){
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id':id},
      fragment: 'anchor'
    };
    this.router.navigate(['/article/addswiper'],navigationExtras);
  }

  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')

    var url = '/api/article/artPicPath/list';
    var that = this;
     this.http.get(url).subscribe(
        function(data){
          that.isload = false;
          // console.log(data['body'])
          // console.log(data['header'])
          if(data['header'].code == 200){
            that.list = data['body']
          }else {
            that.isHint= true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
          }
        },function(err){
          console.log(err)
        }
     )
  }

  //删除
  del(id){
    let that=this;
    let url='/api/article/artPicPath/del/'+id;
    this.http.delete(url).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          $("#myModal").modal('hide');
          that.refresh();
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
      }
    )
  }
  //设置置顶值
  zhiding(id){
    this.id=id;
    $("#stickNum").val('');
    $('#zhiding_model').modal('show');
  }

  //刷新
  refresh(){
    var that= this;
    var url = '/api/article/artPicPath/list';
    this.http.get(url).subscribe(function(data){
      that.list = data['body'];
    },function(err){
      console.log(err)
    })
  }
  //保存置顶值
  onSubmit(){
    let that=this;
    let stickNum:boolean = this.formModel.get("stickNum").valid;
    if(!stickNum){
      return false;
    }
    let url='/api/article/artPicPath/save-or-update';
    let obj={
      'id':that.id,
      'stickNum':$("#stickNum").val(),
    }
    this.http.post(url,obj).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          $('#zhiding_model').modal('hide');
          that.refresh();
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
      }
    )
  }
  //操作 禁用或启用或删除
  operator(id,status){
    $("#myModal").modal('show');
    let that=this;
    that.message='';
    that.id='';
    that.status='';
    if(status==true){
      that.message='确定启用该图片';
    }else if(status==false){
      that.message='确定禁用该图片';
    }else if(status=='del'){
      that.message='确定删除该图片';
    }
    that.id=id;
    that.status=status;

  }
  subStatus(){
    let that=this;
    if(that.status=='del'){//删除
      that.del(that.id);
    }else{
      let url='/api/article/artPicPath/save-or-update';
      let obj={
        'id':that.id,
        'picStatus':that.status
      }
      this.http.post(url,obj).subscribe(
        function(data){
          that.isload = false;
          if(data['header'].code == 200){
            $("#myModal").modal('hide');
            that.refresh();
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
        }
      )
    }
  }
}
