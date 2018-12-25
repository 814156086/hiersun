import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FormBuilder} from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-arttag',
  templateUrl: './arttag.component.html',
  styleUrls: ['./arttag.component.css']
})
export class ArttagComponent implements OnInit {

  public artaglist: any;
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
  // 加载标签列表
  loadAtagList() {
    var url = '/api/article/artTag/list';
    var that = this;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          that.artaglist = data['body'];
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
  // 查询标签信息
  searArtagInfo() {
    var that=this;
    var tagName=$('#tagName').val();
    var activity=$('#activity').val();
    var tagStatus=$('#tagStatus').val();
    var url = '/api/article/artTag/list?tagName='+tagName+'&activity='+activity+'&tagStatus='+tagStatus;
    this.http.get(url).subscribe(
      function (data) {
        if(data['header'].code == 200){
          that.artaglist = data['body'];
        }else{
          that.isHint= true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },function (err) {
        console.log(err)
      }
    )
  }
  // 重置
  request() {
    $('#tagName').val('');
    $('#activity').val('');
    $('#tagStatus').val('');
  }
  // 编辑按钮
  editArtag(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id':id},
      fragment: 'anchor'
    };
    this.router.navigate(['/article/arttag/addartag'],navigationExtras);
  }

  //刷新
  refresh(){
    var that= this;
    var url = '/api/article/artTag/list';
    this.http.get(url).subscribe(function(data){
      that.artaglist = data['body'];
    },function(err){
      console.log(err)
    })
  }
  //删除
  del(id){
    var that= this;
    var suburl = '/api/article/artTag/del/'+id;
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
      that.message='确定启用该标签';
    }else if(status=='unStatus'){
      that.message='确定禁用该标签';
    }else if(status=='del'){
      that.message='确定删除该标签';
    }
    that.id=id;
    that.status=status;

  }
  subStatus(){
    let that=this;
    if(that.status=='del'){//删除
      that.del(that.id);
    }else{
      var suburl = '/api/article/artTag/operation?id='+that.id+'&status='+that.status;
      this.http.post(suburl,null).subscribe(
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
  }
}
