import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FormBuilder} from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-arttag',
  templateUrl: './artactivity.component.html',
  styleUrls: ['./artactivity.component.css']
})
export class ArtactivityComponent implements OnInit {

  public list: any;
  isload = true;
  isHint = false;
  hintMsg: any;
  public message="";
  public status:any;
  id:any;
  public headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,fb: FormBuilder) {

  }

  ngOnInit() {
    this.loadAtagList();
  }
  // 加载活动列表
  loadAtagList() {
    var url = '/api/article/artActivity/list';
    var that = this;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          that.list = data['body'];
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      })
  }

  // 编辑按钮
  edit(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id':id},
      fragment: 'anchor'
    };
    this.router.navigate(['/article/artactivity/addartactivity'],navigationExtras);
  }

  //刷新
  refresh(){
    var that= this;
    var url = '/api/article/artActivity/list';
    this.http.get(url).subscribe(function(data){
      that.list = data['body'];
    },function(err){
      console.log(err)
    })
  }
  //删除
  del(id){
    var that= this;
    var suburl = '/api/article/artActivity/del/'+id;
    this.http.delete(suburl).subscribe(
      function(data){
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
      })
  }
  //操作
  operation(id,status){
    $("#myModal").modal('show');
    let that=this;
    that.message='';
    that.id='';
    that.status='';
    if(status=='status'){
      that.message='确定启用该活动';
    }else if(status=='unStatus'){
      that.message='确定禁用该活动';
    }else if(status=='del'){
      that.message='确定删除该活动';
    }
    that.id=id;
    that.status=status;

  }
  subStatus(){
    let that=this;
    if(that.status=='del'){//删除
      that.del(that.id);
    }else{
      let url='/api/article/artActivity/operation?id='+that.id+'&status='+that.status;
      this.http.post(url,null).subscribe(
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
