import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-cmsmanage',
  templateUrl: './cmsmanage.component.html',
  styleUrls: ['./cmsmanage.component.css']
})
export class CmsmanageComponent implements OnInit {

  public list:any;
  isload=true;
  isHint=false;
  hintMsg:any;
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http:HttpClient) { 
  }
  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')
    var url = '/api/cms/site/list';
    var that = this;
    this.http.get(url).subscribe(
      function(data){
        // console.log(data['body']);
        that.isload = false;
        if(data['header'].code == 200){
          that.list=data['body'];
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
    })

    
  }
  issue(id){
    // console.log(id)
    let that = this;
    that.isload = true;
    let issueUrl = '/api/cms/site/publish-site?siteId=' + id;
    this.http.post(issueUrl,{headers:this.headers}).subscribe(
      data=>{
        // console.log(data)
        that.isload = false;
        that.isHint= true;
        that.hintMsg =  data['header'].desc;
        setTimeout(function () {
          that.isHint= false;
          that.hintMsg = '';
        },1500)
      },
      err=>{console.log(err)}
    )
  }
  copy(id){
    // console.log(id)
    let that = this;
    that.isload = true;
    let copyUrl = '/api/cms/site/copy-site?copySiteId=' +id;
    this.http.post(copyUrl,{headers:this.headers}).subscribe(
      data=>{
        // console.log(data);
        that.isload = false;
        if(data['header'].code == 200){
          window.location.reload()
        }else{
          that.isHint= true;
          that.hintMsg =  data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }

}
