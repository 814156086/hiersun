import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {logWarnings} from 'protractor/built/driverProviders';
declare var $: any;
@Component({
  selector: 'app-comment',
  templateUrl: './artlists.component.html',
  styleUrls: ['./artlists.component.css']
})
export class ArtClassifyComponent implements OnInit {
  public tplList=[];
  public code : number;
  public pageNo=1;
  public searchValue = '';
  public message=""
  status=""
  artContentId:any;
  index : any;
  pageCount:any;
  isload=true;
  isHint=false;
  hintMsg:any;
  public subCode:any;

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder,private router:Router) {
    let that = this;
    this.route.queryParams.subscribe(function(data){
      that.code=data.code;
      if(data.subCode!=null){
        that.subCode=data.subCode;
      }else{
        that.subCode="";
      }
    })
   }

  pagenumber(pagenumber){
    let that = this
    let heading = $('#heading').val()
    let verify=$("#verify").val()
    let recommend=$("#recommend").val()
    let publish= $("#publish").val()
    let publishDate=$("#publishDate").val()
    let url = '/api/article/artContent/list?code='+this.code+'&pageNo='+pagenumber+'&pageSize='+10+'&subCode='+that.subCode+
      '&heading='+heading+'&verify='+verify+'&recommend='+recommend+'&publish='+publish+'&publishDate='+publishDate;
    this.http.get(url).subscribe(function(data){
      that.tplList = data['body'].list;
    },function(err){
      console.log(err)
    })
  }


  ngOnInit() {

    $('#publishDate').datetimepicker({
      format: "yyyy-MM-dd ",
      minView:2,
      showMeridian: false,
      autoclose: true,
      todayBtn: true,
    });
    let that = this;
    let url = '/api/article/artContent/list?code='+this.code+'&pageSize='+10+'&pageNo='+this.pageNo+'&subCode='+that.subCode;
    this.http.get(url).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          that.tplList = data['body'].list;
          that.pageNo = data['body'].pageNo;
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
          // console.log(data['body']);
          
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
//  返回上一级
  goback(){
    window.history.go(-1)
  }
  // 清空搜索条件
  request(){
    $('#heading').val("")
    $("#verify").val("")
    $("#recommend").val("")
    $("#publish").val("")
    $("#publishDate").val("")
  }


  //操作
  operation(id,status){
    this.message="";
    this.status="";
    this.artContentId="";
    $("#myModal").modal('show');
    if(status=='verify'){
      this.message="确定审核该文章";
    }else if(status=='del'){
      this.message="确定删除该文章";
    }else if(status=='unPublish'){
      this.message="确定下架该文章";
    }else if(status=='publish'){
      this.message="确定发布该文章";
    }else if(status=='recommend'){
      this.message="确定推荐该文章";
    }else if(status=='unRecommend'){
      this.message="确定取消推荐该文章";
    }
    this.status=status;
    this.artContentId=id;
  }
  //确定
  subStatus(){
    let that=this;
    let url='';
    if(that.status=='del'){
      url = `/api/article/artContent/del/${that.artContentId}`;
      this.http.delete(url).subscribe(
        function(data){
          if(data['header'].code == 200){
            console.log(data)
            that.isHint = true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
            $("#myModal").modal('hide')
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
    }else {
        url=`/api/article/artContent/operation?status=${that.status}&id=${that.artContentId}`;
        this.http.post(url,'').subscribe(
          function(data){
            if(data['header'].code == 200){
              that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)

              $("#myModal").modal('hide')
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
  go_back(){
    this.common.goback();
  }
  search(){
    let that = this;
    let heading = $('#heading').val()
    let verify=$("#verify").val()
    let recommend=$("#recommend").val()
    let publish= $("#publish").val()
    let publishDate=$("#publishDate").val()
    that.pageNo=1;
    let url =  '/api/article/artContent/list?code='+this.code+'&pageNo='+that.pageNo+'&pageSize='+10+'&subCode='+that.subCode
    +'&heading='+heading+'&verify='+verify+'&recommend='+recommend+'&publish='+publish+'&publishDate='+publishDate;
    this.http.get(url).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          that.tplList = data['body'].list;
          that.pageNo = data['body'].pageNo;
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
  edit(eid){
    let ecode=this.code;
    this.router.navigate(['article/artd'], {
      queryParams: {
        eid,ecode
      }
    });
  }
}
