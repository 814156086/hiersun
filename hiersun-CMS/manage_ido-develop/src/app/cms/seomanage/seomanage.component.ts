import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';
declare var $: any;

@Component({
  selector: 'app-seomanage',
  templateUrl: './seomanage.component.html',
  styleUrls: ['./seomanage.component.css']
})
export class SeomanageComponent implements OnInit {
  isload = true;
  isHint = false;
  hintMsg: any;
  siteid: any;
  warning = false;
  currentname: any;
  currentadress: any;
  currenttype=0;
  list: any;
  altername = '';
  alteradress = '';
  altertype=0;
  currentalterid: any;
  currentcanonicalid: any;
  seoId:any;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private common: CommonService) { }
  ngOnInit() {
    var that = this;
    this.route.queryParams.subscribe(function (data) {
      that.siteid = data.siteid
    })
    that.sitedefault();
  }
  sitelist(index) {
    $(".defautid").val(index);
    var url = '/api/cms/site/list';
    var that = this;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          that.list = data['body'];
        } else {
          that.isHint = true;
          that.warning = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        that.isHint = true;
          that.warning = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      })
  }
  choose() {
    this.isload = true;
    console.log(this.isload)
    if ($(".defautid").val() == 1) { //canonical
      var that = this;
      let siteid = $('input[name="opeType"]:checked').attr('title');
      that.currentcanonicalid = siteid;
      if(that.currentcanonicalid==that.currentalterid){
        that.isHint = true;
        that.warning = true;
        that.hintMsg = '和alternate最好不是同一站点';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
      that.siterepc();
    } else {//alternate
      var that = this;
      let siteid = $('input[name="opeType"]:checked').attr('title');
      that.currentalterid = siteid;
      //判断是不是重复
      let repeaturl = '/api/cms/site/check-alternate?alternateId=' + siteid + '&siteId=' + that.siteid;
      this.http.get(repeaturl).subscribe(
        function (data) {
          if (data['header'].code == 200) {
            if (data['body'] == false) {
              if (siteid == that.siteid) {
                that.isHint = true;
                that.warning = true;
                that.hintMsg = '和canonical最好不是同一站点';
                setTimeout(function () {
                  that.isHint = false;
                  that.hintMsg = '';
                }, 1500)
              }
              //反写
              that.siterep()

            } else {
              that.isHint = true;
              that.warning = true;
              that.hintMsg = data['header'].desc;
              setTimeout(function () {
                that.isHint = false;
                that.hintMsg = '';
              }, 1500)
            }

          }

        }, function (err) {
          that.isHint = true;
              that.warning = true;
              that.hintMsg = '系统异常，请重新再试';
              setTimeout(function () {
                that.isHint = false;
                that.hintMsg = '';
              }, 1500)
        })
    }

  }
  sitedefault() {
    let that = this;
    let url = '/api/cms/site/seo-desc/' + that.siteid;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          if(data['body']['canonical']!=null){
            that.currentname = data['body']['canonical'].name;
            that.currentadress = data['body']['canonical'].baseUrl;
            that.currenttype = data['body']['canonical'].siteType;
            that.currentcanonicalid = data['body']['canonical'].id;
          }
          if(data['body']['alternate']!=null){
            that.altername = data['body']['alternate'].name;
            that.alteradress = data['body']['alternate'].baseUrl;
            that.altertype = data['body']['alternate'].siteType;
            that.currentalterid = data['body']['alternate'].id;
          }
          
          that.seoId=data['body'].seoId;
        } else {
          that.isHint = true;
          that.warning = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        that.isHint = true;
          that.warning = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      })
  }
  siterep() {
    let that = this;
    let siteid = $('input[name="opeType"]:checked').attr('title')
    var url = '/api/cms/site/desc/' + siteid;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          that.altername = data['body'].name
          that.alteradress = data['body'].baseUrl
          that.altertype = data['body'].siteType
        } else {
          that.isHint = true;
          that.warning = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        that.isHint = true;
          that.warning = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      })
  }
  siterepc() {
    let that = this;
    let siteid = $('input[name="opeType"]:checked').attr('title');
    console.log(siteid)
    var url = '/api/cms/site/desc/' + siteid;
    this.http.get(url).subscribe(
      function (data) {
        that.isload = false;
        if (data['header'].code == 200) {
          console.log(data)
          that.currentname = data['body'].name
          that.currentadress = data['body'].baseUrl
          that.currenttype = data['body'].siteType
        } else {
          that.isHint = true;
          that.warning = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        that.isHint = true;
          that.warning = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      })
  }
  goback() {
    this.common.goback()
  }
  reset(i) {
    if (i == 1) {
      $(".canonical").val("");
      this.currentcanonicalid="";
      this.currentname ="";
      this.currentadress = "";
      this.currenttype = 0
    } else {
      $(".alternate").val("");
      this.currentalterid="";
    }
  }
  save() {
    let that = this;
    let url = '/api/cms/site/add-seo';
    let siteSeo = {
      'alternateId': that.currentalterid,//当前选择的站点id
      'canonicalId': that.currentcanonicalid, //当前选择的站点id
      'id':that.seoId,
      'seoSiteId':that.siteid  //站点的id
    }
    console.log(siteSeo)
    this.http.post(url, siteSeo).subscribe(function (data) {
      if(data['header'].code==200){
        that.isHint = true;
        that.warning = false;
        that.hintMsg = data['header'].desc;
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
          that.router.navigate(['/cms/cmsmanage'])
        }, 1500) 
      }else{
        that.isHint = true;
        that.warning = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    }, function (err) {
      that.isHint = true;
        that.warning = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
    })
  }
}
