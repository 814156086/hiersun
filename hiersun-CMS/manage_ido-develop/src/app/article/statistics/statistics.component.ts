import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {Router, ActivatedRoute, Params, NavigationExtras} from '@angular/router';
import {CommonService} from '../../services/common.service';
declare var $: any;
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  public list=[];
  isload=true;
  isHint=false;
  hintMsg:any;
  pageNo = 1 ; //默认第一页
  pageCount:any;
  artContentId:any;
  fabulouStatus:any;
  id:any;
  public formData;
  public headers = new Headers({'Content-Type': 'application/json'});
  formModel: FormGroup;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,private router:Router,fb: FormBuilder) {
    this.formModel = fb.group({
      fabulouSum: ['', [Validators.required]],
    })
  }

  pagenumber(pagenumber){
    let that = this;
    let heading=$("#heading").val();
    let url = '/api/article/artComment/statistics-list?pageNo='+pagenumber+'&pageSize='+10+'&heading='+heading;
    this.http.get(url).subscribe(function(data){
      that.list = data['body'].list;
    },function(err){
      console.log(err)
    })
  }

  seeComment(artContentId){
    let navigationExtras: NavigationExtras = {
      queryParams: { 'artContentId':artContentId},
      fragment: 'anchor'
    };
    this.router.navigate(['/article/comment'],navigationExtras);
  }
  //查询
  searhInfo(){
    let that = this;
    let heading=$("#heading").val();
    that.pageNo=1;
    let url = '/api/article/artComment/statistics-list?pageNo='+that.pageNo+'&pageSize='+10+'&heading='+heading;
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
    $('#heading').val('');
  }

  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')
    var url = '/api/article/artComment/statistics-list?pageNo='+1+'&pageSize='+10;
    var that = this;
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
  dianzan(id,artContentId,fabulouStatus){
    this.artContentId=artContentId;
    this.fabulouStatus=fabulouStatus;
    this.id=id;
    $("#fabulouSum").val('');
    $('#zanmodel').modal('show')
  }
  onSubmit(){
    let that= this;
    let isFabulouSum:boolean = this.formModel.get("fabulouSum").valid;
    if(!isFabulouSum){
      return false;
    }
    if(this.formModel.get("fabulouSum").value>100){
      that.isHint = true;
      that.hintMsg = "每次手动点赞不能超过100！";
      setTimeout(function () {
        that.isHint = false;
        that.hintMsg = '';
      }, 1500)
      return false;
    }


    let suburl = '/api/article/artComment/update-statistics';
    let obj = {
      artContentId: that.artContentId,
      fabulouStatus: that.fabulouStatus ,
      fabulouSum: this.formModel.get("fabulouSum").value,
      id:that.id,
    }
    this.http.post(suburl,obj).subscribe(
      function(data){
        if(data['header'].code == 200){
          that.pagenumber(that.pageNo);
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function(){
            that.isHint=false ;
            that.hintMsg = '';
          $('#zanmodel').modal('hide')

          },1500)
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
