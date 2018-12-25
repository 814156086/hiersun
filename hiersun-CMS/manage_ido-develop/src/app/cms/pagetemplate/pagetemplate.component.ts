import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-pagetemplate',
  templateUrl: './pagetemplate.component.html',
  styleUrls: ['./pagetemplate.component.css']
})
export class PagetemplateComponent implements OnInit {
  pagelist:any;
  siteid:any;
  list:any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router) { }
  ngOnInit() {
    var that=this;
    var url = '/api/cms/site/list';
    var that = this;
    this.http.get(url).subscribe(
      function(data){
        that.isload = false;
        if(data['header'].code == 200){
          that.list=data['body'];
          that.siteid=that.list[0].id;
          that.sitechoose(that.list[0].id);
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
  sitechoose(id){
    console.log(id)
    let that=this;
    that.siteid=id;
    var url = '/api/cms/pageTmpl/list?siteId=' +id;
    this.http.get(url).subscribe(
      data => {
        console.log(data)
        that.isload = false;
        if(data['header'].code==200){
          that.pagelist=data['body'];
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
  newTpl(){
    let that=this;
    console.log(that.siteid)
    that.router.navigateByUrl('cms/addpagetpl?siteid='+that.siteid);
  }
  isenabled(id,siteid,enabled){
    let url = '/api/cms/pageTmpl/save-or-update';
    let that = this;
    that.isload=true;
    let pageTmpl = {
      id:id,
      siteId:siteid,
      enabled:!enabled
    }
    this.http.post(url, pageTmpl).subscribe(function (data) {
        console.log(data);
        that.isload=false;
        if(data['header'].code == 200 ){
          that.isload = false;
          that.ngOnInit()
        }else{
          this.isHint= true;
          this.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }
  deletepage(id){
    $(".pageid").val(id)
    console.log(id)
  }
  datadel(){
    var that= this;
    var suburl = '/api/cms/pageTmpl/del/'+$(".pageid").val();
    this.http.delete(suburl).subscribe(
      function(data){
        console.log(data)
        if(data['header'].code == 200){
          $("#myModal3").modal('hide');
          that.ngOnInit();
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
