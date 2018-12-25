import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params,NavigationExtras } from '@angular/router';
import { HttpClient} from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-listtemplate',
  templateUrl: './listtemplate.component.html',
  styleUrls: ['./listtemplate.component.css']
})
export class ListtemplateComponent implements OnInit {

  public pageNo=1;
  public tplList=[];
  public delId:any;
  public pageList=[1];
  public siteType=1;
  isload=true;
  isHint=false;
  hintMsg:any;
  list:any;
  pageCount:any;
  constructor(private http:HttpClient,private route: ActivatedRoute,private router:Router) {}

  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(3)').addClass('active')
    /* var url = '/api/cms/site/list';
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
    }) */
    var that = this;
    var url = '/api/cms/segmentTmpl/page-list?pageNo='+ this.pageNo  +'&pageSize=' + 10 +"&siteType=" + this.siteType;
    this.http.get(url).subscribe(
      function (data) {
        // console.log('111'+data)
        that.isload = false;
        if(data['header'].code == 200){
          that.tplList = data['body'].list;
          that.pageNo = data['body'].pageNo;
          that.pageCount=data['body'].pageCount;
          // console.log( that.pageNo)
          // console.log(that.pageCount)
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
  newTpl(){
    // console.log(this.siteType)
    let navigationExtras: NavigationExtras = {
      queryParams: { 'siteType': this.siteType },
      fragment: 'anchor'
    };
    this.router.navigate(['/cms/addtemplate'],navigationExtras);
  }
  setTpl(id){
    // console.log(this.siteType,id)
    let navigationExtras: NavigationExtras = {
      queryParams: { 'siteType': this.siteType,'id':id },
      fragment: 'anchor'
    };
    this.router.navigate(['/cms/addtemplate'],navigationExtras);
  }
  chooseType(type){
    this.siteType = type;
    this.pageList = [1];
    var url = '/api/cms/segmentTmpl/page-list?pageNo='+ this.pageNo  +'&pageSize=' + 10 +"&siteType=" + this.siteType;
    let that = this;
    this.http.get(url).subscribe(
      function (data) {
        // console.log(data)
        that.isload = false;
        if(data['header'].code == 200){
          that.tplList = data['body'].list;
          that.pageNo = data['body'].pageNo;
          /* for (var i = 0; i < data['body'].pageCount-1; i++) {
            that.pageList.push(1)
          } */
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
  delTpl(id){
    // console.log(id)
    this.delId = id;
  }
  sure(){
    // console.log(this.delId)
    var that = this;
  }
  /* goPage(item){
    $('.next').removeClass('disabled')
    $('.previous').removeClass('disabled')
    if(this.pageNo == item + 1  ){
      return
    }
    if(item == 9999){
      this.pageNo -= 1
    }else if(item == -1){
      this.pageNo+=1
    }else{
      this.pageNo = item + 1
    }
    if(this.pageNo < 1 ){
      $('.previous').addClass('disabled')
      this.pageNo=1
      return
    }
    if(this.pageNo > this.pageList.length ){
      $('.next').addClass('disabled')
      this.pageNo= this.pageList.length
      return      
    }
    $('.pagination>li').removeClass('active');
    $('.pagination>li:nth-child(' + (this.pageNo+1) + ')').addClass('active')
    var that = this
    var url = '/api/cms/segmentTmpl/page-list?pageNo='+ this.pageNo  +'&pageSize=' + 10 +"&siteType=" + this.siteType ;
    this.http.get(url).subscribe(function(data){
      that.tplList = data['body'].list;
      that.pageNo = data['body'].pageNo;
    },function(err){
      console.log(err)
    })
  } */
  pagenumber(pagenumber){
    var that = this
    var url = '/api/cms/segmentTmpl/page-list?pageNo='+ pagenumber +'&pageSize=' + 10 +"&siteType=" + this.siteType ;
    this.http.get(url).subscribe(function(data){
      that.tplList = data['body'].list;
    },function(err){
      console.log(err)
    })
  }
  pagefuction(){
    var that = this
    var url = '/api/cms/segmentTmpl/page-list?pageNo='+ this.pageNo  +'&pageSize=' + 10 +"&siteType=" + this.siteType ;
    this.http.get(url).subscribe(function(data){
      that.tplList = data['body'].list;
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
    },function(err){
      console.log(err)
    })
    
  } 
}
