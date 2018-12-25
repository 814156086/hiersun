import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {st} from '@angular/core/src/render3';
declare var $: any;
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})


export class CommentComponent implements OnInit {
  public list=[];
  isload=true;
  isHint=false;
  hintMsg:any;
  pageNo = 1 ; //默认第一页
  pageCount:any;
  artContentId:any;
  public message="";
  status="";
  commentId='';

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder) { }
  public headers=new Headers({"Content-Type":'application.json'});


  pagenumber(pagenumber){
    let that = this;
    let comment=$("#comment").val();
    let status=$("#status").val();
    let wordStatus=$("#wordStatus").val();
    let beginDt=$("#beginDt").val();
    let endDt=$("#endDt").val();
    let url = '/api/article/artComment/artComment-list?artContentId='+that.artContentId+'&pageNo='+pagenumber+'&pageSize='+10+'&comment='+comment+'&status='+status+'&wordStatus='+wordStatus+'&beginDt='+beginDt+'&endDt='+endDt;
    this.http.get(url).subscribe(function(data){
      that.list = data['body'].list;
    },function(err){
      console.log(err)
    })
  }

  go_back(){
    this.common.goback();
  }

  //查询
  searhInfo(){
    let that = this;
    let comment=$("#comment").val();
    let status=$("#status").val();
    let wordStatus=$("#wordStatus").val();
    let beginDt=$("#beginDt").val();
    let endDt=$("#endDt").val();
    that.pageNo=1;
    let url = '/api/article/artComment/artComment-list?artContentId='
      +that.artContentId+'&pageNo='+that.pageNo+'&pageSize='+10+'&comment='+comment+'&status='+status+'&wordStatus='+wordStatus+'&beginDt='+beginDt+'&endDt='+endDt;
    this.http.get(url).subscribe(
      function (data) {
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          that.list = data['body'].list;
          that.pageNo = data['body'].pageNo;
          that.pageCount=data['body'].pageCount;
          $("#pagination1").pagination({
            currentPage: that.pageNo,
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
      },function (err) {
        console.log(err)
      }
    )
  }


  // 重置
  request() {
    $('#comment').val('');
    $('#status').val('');
    $('#wordStatus').val('');
    $('#beginDt').val('');
    $('#endDt').val('');
  }

  changeSelect(){
    $("input[name='check_no']").each(function() {
      if ($(this).attr("checked")) {
        $(this).removeAttr("checked");
      }
      else {
        $(this).attr("checked", "true");
      }
    })
  }


  ngOnInit() {
    $('#beginDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });

    $('#endDt').datetimepicker({
      format: "yyyy-MM-dd hh:ii:ss",
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });



    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')

    let that = this;
    this.route.queryParams.subscribe(function(data){
      // console.log(data)
      that.artContentId = data.artContentId;
    })
    let url = '/api/article/artComment/artComment-list?artContentId='+that.artContentId+'&pageNo='+1+'&pageSize='+10;
    this.http.get(url).subscribe(
      function (data) {
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          that.list = data['body'].list;
          that.pageNo = data['body'].pageNo;
          that.pageCount=data['body'].pageCount;
          $("#pagination1").pagination({
            currentPage: that.pageNo,
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
      },function (err) {
        console.log(err)
      }
    )
  }
  operation(id,status){
    $("#myModal").modal('show');
    let that= this;
    that.message="";
    that.commentId="";
    that.status="";
    if(status=='del'){
      that.message='确定删除该评论';
    }else if(status=='recovery'){
      that.message='确定恢复该评论';
    }else if(status=='read'){
      that.message='确定已读该评论';
    }
    that.commentId=id;
    that.status=status;

  }
  subStatus(){
    let that=this;
    let ids=new Array();
    if(that.commentId==''){
      $("input[name='check_no']").each(function() {
        if ($(this).attr("checked")) {
          ids.push($(this).val());
        }
      })
      if(ids.length==0){
        that.isHint = true;
        that.hintMsg = "请选择评论！";
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
        return false;
      }
    }else{
      ids.push(that.commentId);
    }
    let suburl = '/api/article/artComment/update-comment?ids='+ids+'&artContentId='+that.artContentId+'&status='+that.status;
    this.http.post(suburl,null).subscribe(
      function(data){
        if(data['header'].code == 200){
          $("#myModal").modal('hide');
          $("#checkbox_all").removeAttr("checked");
          that.pagenumber(that.pageNo);
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
