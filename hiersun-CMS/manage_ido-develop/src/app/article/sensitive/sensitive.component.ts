import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-sensitive',
  templateUrl: './sensitive.component.html',
  styleUrls: ['./sensitive.component.css']
})
export class SensitiveComponent implements OnInit {
  public list=[];
  isload=true;
  isHint=false;
  hintMsg:any;
  pageNo = 1 ; //默认第一页
  pageCount:any;
  public formData;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http:HttpClient) {
  }

  pagenumber(pagenumber){
    var that = this
    var url = '/api/article/shieldWord/list?pageNo='+pagenumber+'&pageSize='+10;
    this.http.get(url).subscribe(function(data){
      that.list = data['body'].list;
    },function(err){
      console.log(err)
    })
  }

  exceladd(event){
    // console.log(event.target.files)
    if(event.target.files.length > 0){
      let file = event.target.files[0];
      this.formData = new FormData();
      this.formData.append('file',file)
      var that= this;
      var url = '/api/article/shieldWord/save-or-update';
      that.isload = true;
      this.http.post(url,this.formData).subscribe(function(data){
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          location.reload();
        }else{
          that.isHint= true;
          that.hintMsg = '文件上传失败';
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

  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')
    var url = '/api/article/shieldWord/list?pageNo='+1+'&pageSize='+10;
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


}
