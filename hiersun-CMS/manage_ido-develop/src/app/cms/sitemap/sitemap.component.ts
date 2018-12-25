import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  ftpArray = []; //[{password: "", port: "", ip: "", username: ""}];
  ossArray = []; //[{password: "", port: "", ip: "", username: ""}];
  imgossArray=[];
  vdoossArray=[];
  domainUrlArray=[]
  basePaths: any;
  baseUrls: any;
  fileSuffixs: any;
  id: any;
  names: any;
  productUrls: any;
  seriesUrls: any;
  sitetypes: any;
  isHint = false;
  hintMsg: any;
  isload = false;
  isaddftp = true;
  isaddoss = true;
  isimgaddoss = true;
  isvdoaddoss = true;
  resourceType: any;
  resourceType1: any;
  resourceType2: any;
  resourceType3: any;
  ftpid='';
  ossid='';
  imgossid='';
  vdoossid=''
  ftpConfig = { ip: [], username: [], port: [], password: [], basePath: [] };
  ossConfigs = { accessKeyId: [], accessKeySecret: [], bucketName: [], endpoint: [], fileName: []};
  imgossConfigs = { accessKeyId: [], accessKeySecret: [], bucketName: [], endpoint: [], fileName: []};
  vdoossConfigs = { accessKeyId: [], accessKeySecret: [], regionId: [], formats: [], authTimeOut: []};
  domainUrlArrayossConfigs = [];
  formModel: FormGroup;
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      name: ['', [Validators.required]],
      baseUrl: ['', [Validators.required]],
      fileSuffix: ['', [Validators.required]],
      seriesUrl: ['', [Validators.required]],
      productUrl: ['', [Validators.required]],
      sitetype: ['', [Validators.required]]

    })
  }
  public headers = new Headers({ "Content-Type": 'application.json' });
  ngOnInit() {
    $('.sub-menu>li').removeClass('active')
    $('.sub-menu>li:nth-child(1)').addClass('active')
    let that = this;
    this.route.params.subscribe(function (data) {
      // console.log(data.id);
      that.id = data.id;
    })
    let url = '/api/cms/site/desc/' + this.id;
    if (this.id != 'all') {
      this.http.get(url).subscribe(
        data => {
          // console.log("xiangiqng")
          // console.log(data)
          if (data['header'].code == 200) {
            //that.basePaths=data['body'].basePath;
            that.baseUrls = data['body'].baseUrl;
            that.fileSuffixs = data['body'].fileSuffix;
            var configlist=data['body'].siteConfigList;
            for(var i=0;i<configlist.length;i++){
              if(configlist[i].resourceType==0){
                that.ftpArray= JSON.parse(configlist[i].resource);
                that.ftpid=configlist[i].id;
                that.isaddftp=true;
              }else if(configlist[i].resourceType==1){
                that.ossArray= JSON.parse(configlist[i].resource);
                that.ossid=configlist[i].id;
                that.isaddoss=true;
              }else if(configlist[i].resourceType==2){
                that.imgossArray= JSON.parse(configlist[i].resource);
                that.imgossid=configlist[i].id;
                that.isimgaddoss=true;
                that.domainUrlArray=JSON.parse(configlist[i].domainUrl)
              }else if(configlist[i].resourceType==3){
                that.vdoossArray= JSON.parse(configlist[i].resource);
                that.vdoossid=configlist[i].id;
                that.isvdoaddoss=true;
              }
             }
            that.names = data['body'].name;
            that.productUrls = data['body'].productUrl;
            that.seriesUrls = data['body'].seriesUrl;
            that.sitetypes = data['body'].siteType;
            if (data['body'].isFlat) {
              $('select[name="isFlat"]').val(1);
            }
          } else {
            that.isHint = true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        },
        err => { console.log(err) }
      )
    }
  }
  goback() {
    this.common.goback()
  }
  addwebsiteList() {
    this.ftpArray.push({ password: "", port: "", ip: "", username: "", basePath: "" })
    this.isaddftp = true;
  }
  delwebsiteList(key) {
    let that = this;
    that.ftpArray.splice(key, 1);
    if (that.ftpArray.length == 0) {
      that.resourceType=undefined;
    }
  }
  addoss() {
    this.ossArray.push({ accessKeyId: "", accessKeySecret: "", bucketName: "", endpoint: "", fileName: "", url: "" })
    this.isaddoss = true;
  }
  deladdoss(key) {
    let that = this;
    this.ossArray.splice(key, 1);
    if (that.ossArray.length == 0) {
      that.resourceType1=undefined;
    }
  }
  imgaddoss(){
    this.imgossArray.push({ accessKeyId: "", accessKeySecret: "", bucketName: "", endpoint: "", fileName: "", url: "" })
    this.isimgaddoss = true;
  }
  deladdimgoss(key){
    let that = this;
    this.imgossArray.splice(key, 1);
    if (that.imgossArray.length == 0) {
      that.resourceType2=undefined;
    }
  }
  addvdooss(){
    this.vdoossArray.push({ accessKeyId: "", accessKeySecret: "", regionId: "", formats: "", authTimeOut: "" })
    this.isvdoaddoss=true;
  }
  deladdvdooss(key){
    let that= this;
    this.vdoossArray.splice(key,1);
    if(that.vdoossArray.length == 0){
      that.resourceType3=undefined
    }
  }

  adddomainUrl(){
    this.domainUrlArray.push("")
  }
  deldomainUrl(key){
    let that = this;
    this.domainUrlArray.splice(key, 1);
    if (that.domainUrlArray.length == 0) {
      that.resourceType2=undefined;
    }
  }
  submit() {
    let url = '/api/cms/site/save-or-update';
    let that = this;
    if (that.isaddftp) {
      that.resourceType = 0;
      var flagone=0;
      $('.FTPbox').each(function (index, item) {
        if (!$(item).find('input[name="ip"]').val()) {
          that.isHint = true;
          that.hintMsg = 'FTP站点地址为必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flagone=1;
          return false;
        }
        if ($(item).find('input[name="port"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'FTP端口号为必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
          flagone=1;
          return false;
        }
        if ($(item).find('input[name="username"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'FTP用户名为必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
          flagone=1;
          return false;
        }
        if ($(item).find('input[name="password"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'FTP密码为必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
          flagone=1;
          return false;
        }
        if ($(item).find('input[name="basePath"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'FTP目录为必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
          flagone=1;
          return false;
        }
        that.ftpConfig.ip.push($(item).find('input[name="ip"]').val());
        that.ftpConfig.port.push($(item).find('input[name="port"]').val());
        that.ftpConfig.username.push($(item).find('input[name="username"]').val());
        that.ftpConfig.password.push($(item).find('input[name="password"]').val());
        that.ftpConfig.basePath.push($(item).find('input[name="basePath"]').val());
      })
      if(flagone==1){
        return false;
      }
    }

    if (that.isaddoss) {
      that.resourceType1 = 1;
      var flag=0;
      $('.ossbox').each(function (index, item) {
        if ($(item).find('input[name="accessKeyId"]').val()=="") {
          that.isHint = true;
          that.hintMsg = 'accessKeyId必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="accessKeySecret"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'accessKeySecret必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="bucketName"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'bucketName必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="endpoint"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'endpoint必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        that.ossConfigs.accessKeyId.push($(item).find('input[name="accessKeyId"]').val());
        that.ossConfigs.accessKeySecret.push($(item).find('input[name="accessKeySecret"]').val());
        that.ossConfigs.bucketName.push($(item).find('input[name="bucketName"]').val());
        that.ossConfigs.endpoint.push($(item).find('input[name="endpoint"]').val());
        that.ossConfigs.fileName.push($(item).find('input[name="fileName"]').val());
      })
      if(flag==1){
        return false;
      }
    }
    if (that.isimgaddoss) {
      that.resourceType2 = 2;
      var flag=0;
      $('.imgossbox').each(function (index, item) {
        if ($(item).find('input[name="imgaccessKeyId"]').val()=="") {
          that.isHint = true;
          that.hintMsg = 'accessKeyId必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="imgaccessKeySecret"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'accessKeySecret必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="imgbucketName"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'bucketName必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="imgendpoint"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'endpoint必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        that.imgossConfigs.accessKeyId.push($(item).find('input[name="imgaccessKeyId"]').val());
        that.imgossConfigs.accessKeySecret.push($(item).find('input[name="imgaccessKeySecret"]').val());
        that.imgossConfigs.bucketName.push($(item).find('input[name="imgbucketName"]').val());
        that.imgossConfigs.endpoint.push($(item).find('input[name="imgendpoint"]').val());
        that.imgossConfigs.fileName.push($(item).find('input[name="imgfileName"]').val());
      })
      $('.domainUrlbox').each(function(index,item){
        if ($(item).find('input[name="domainUrl"]').val()=="") {
          that.isHint = true;
          that.hintMsg = '域名必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        that.domainUrlArrayossConfigs.push(
          $(item).find('input[name="domainUrl"]').val()
        
        );  
      })
      if(flag==1){
        return false;
      }
    }
    if(that.isvdoaddoss){
      that.resourceType3 = 3;
      var flag=0;
      $('.vdoossbox').each(function (index, item) {
        if ($(item).find('input[name="vdoKeyId"]').val()=="") {
          that.isHint = true;
          that.hintMsg = 'accessKeyId必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="vdoKeySecret"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'regionId必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="vdoregionId"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'regionId必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="vdoformats"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'formats必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        if ($(item).find('input[name="vdoTimeOut"]').val() == '') {
          that.isHint = true;
          that.hintMsg = 'authTimeOut必填!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
          flag=1;
          return false;
        }
        that.vdoossConfigs.accessKeyId.push($(item).find('input[name="vdoKeyId"]').val());
        that.vdoossConfigs.accessKeySecret.push($(item).find('input[name="vdoKeySecret"]').val());
        that.vdoossConfigs.regionId.push($(item).find('input[name="vdoregionId"]').val());
        that.vdoossConfigs.formats.push($(item).find('input[name="vdoformats"]').val());
        that.vdoossConfigs.authTimeOut.push($(item).find('input[name="vdoTimeOut"]').val());
      })
    }
    that.isload = true;
    var isFlat = $('select[name="isFlat"]').val() == 0 ? false : true;
    var siteView={}
    if(that.resourceType!=undefined && that.resourceType1!=undefined&&that.resourceType2!=undefined&&that.resourceType3!=undefined){
      // console.log(JSON.stringify(that.domainUrlArrayossConfigs));
      // console.log(that.domainUrlArray)
      siteView = {
        baseUrl: this.baseUrls,
        fileSuffix: this.fileSuffixs,
        siteConfigList: [{
          "resource": JSON.stringify(that.ftpConfig),
          "resourceType": that.resourceType,
          "id":that.ftpid
        },
        {
          "resource": JSON.stringify(that.ossConfigs),
          "resourceType": that.resourceType1,
          "id":that.ossid
        },
        {
          "resource":JSON.stringify(that.imgossConfigs),
          "resourceType": that.resourceType2,
          "id":that.imgossid,
          "domainUrl":JSON.stringify(that.domainUrlArrayossConfigs)
        },
        {
          "resource": JSON.stringify(that.vdoossConfigs),
          "resourceType": that.resourceType3,
          "id":that.vdoossid
        }
        ],
        id: this.id == 'all' ? ' ' : this.id,
        isFlat: $('select[name="isFlat"]').val() == 0 ? false : true,
        name: this.names,
        productUrl: this.productUrls,
        seriesUrl: this.seriesUrls,
        siteType: this.sitetypes
      }
    }
    if(that.resourceType==undefined){
      siteView = {
        baseUrl: this.baseUrls,
        fileSuffix: this.fileSuffixs,
        siteConfigList: [{
          "resource": JSON.stringify(that.ossConfigs),
          "resourceType": that.resourceType1,
          "id":that.ossid
        }],
        id: this.id == 'all' ? ' ' : this.id,
        isFlat: $('select[name="isFlat"]').val() == 0 ? false : true,
        name: this.names,
        productUrl: this.productUrls,
        seriesUrl: this.seriesUrls,
        siteType: this.sitetypes
      }
    }
    if(that.resourceType1==undefined){
      siteView = {
        baseUrl: this.baseUrls,
        fileSuffix: this.fileSuffixs,
        siteConfigList: [{
          "resource": JSON.stringify(that.ftpConfig),
          "resourceType": that.resourceType,
          "id":that.ftpid
        }],
        id: this.id == 'all' ? ' ' : this.id,
        isFlat: $('select[name="isFlat"]').val() == 0 ? false : true,
        name: this.names,
        productUrl: this.productUrls,
        seriesUrl: this.seriesUrls,
        siteType: this.sitetypes
      }
    }
    if(that.resourceType2==undefined){
      siteView = {
        baseUrl: this.baseUrls,
        fileSuffix: this.fileSuffixs,
        siteConfigList: [{
          "resource": JSON.stringify(that.imgossConfigs),
          "resourceType": that.resourceType2,
          "id":that.imgossid
        }],
        id: this.id == 'all' ? ' ' : this.id,
        isFlat: $('select[name="isFlat"]').val() == 0 ? false : true,
        name: this.names,
        productUrl: this.productUrls,
        seriesUrl: this.seriesUrls,
        siteType: this.sitetypes
      }
    }
    if(that.resourceType3==undefined){
      siteView = {
        baseUrl: this.baseUrls,
        fileSuffix: this.fileSuffixs,
        siteConfigList: [{
          "resource": JSON.stringify(that.vdoossConfigs),
          "resourceType": that.resourceType3,
          "id":that.vdoossid
        }],
        id: this.id == 'all' ? ' ' : this.id,
        isFlat: $('select[name="isFlat"]').val() == 0 ? false : true,
        name: this.names,
        productUrl: this.productUrls,
        seriesUrl: this.seriesUrls,
        siteType: this.sitetypes
      }
    }
    this.http.post(url, siteView).subscribe(
      data => {
        // console.log(data);
        that.isload = false;
        if (data['header'].code == 200) {
          that.goback()
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  testfpt(key){
    let that=this;
    let ftpConfig={
      "basePath": $(".basePath").eq(key).val(),
      "ip": $(".ip").eq(key).val(),
      "password":$(".password").eq(key).val(),
      "port": $(".port").eq(key).val(),
      "username": $(".usernameftp").eq(key).val(),
    }
    let url = '/api/cms/config/test-ftp';
    this.http.post(url, ftpConfig).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
          if(data['body']==false){
            that.isHint = true;
            that.hintMsg = 'FTP测试失败';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
           }else{
            that.isHint = true;
            that.hintMsg = 'FTP测试成功';
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
           }
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  testoss(key){
    let that=this;
    let ossConfig={
      "accessKeyId": $(".accessKeyId").eq(key).val(),
      "accessKeySecret": $(".accessKeySecret").eq(key).val(),
      "bucketName":$(".bucketName").eq(key).val(),
      "endpoint": $(".endpoint").eq(key).val(),
      "fileName": $(".fileName").eq(key).val(),
      //"url": $(".url").eq(key).val(),
    }
    let url = '/api/cms/config/test-oss';
    this.http.post(url, ossConfig ).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
         if(data['body']==false){
          that.isHint = true;
          that.hintMsg = 'oss测试失败';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }else{
          that.isHint = true;
          that.hintMsg = 'oss测试成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  testimgoss(key){
    let that=this;
    let ossConfig={
      "accessKeyId": $(".imgaccessKeyId").eq(key).val(),
      "accessKeySecret": $(".imgaccessKeySecret").eq(key).val(),
      "bucketName":$(".imgbucketName").eq(key).val(),
      "endpoint": $(".imgendpoint").eq(key).val(),
      "fileName": $(".imgfileName").eq(key).val(),
      //"url": $(".url").eq(key).val(),
    }
    let url = '/api/cms/config/test-oss';
    this.http.post(url, ossConfig ).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
         if(data['body']==false){
          that.isHint = true;
          that.hintMsg = 'oss测试失败';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }else{
          that.isHint = true;
          that.hintMsg = 'oss测试成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
  testvdooss(key){
    let that=this;
    let ossConfig={
      "accessKeyId": $(".vdoaccessKeyId").eq(key).val(),
      "accessKeySecret": $(".vdoaccessKeySecret").eq(key).val(),
      "regionId":$(".vdoregionId").eq(key).val()
    }
    let url = '/api/cms/config/test-videoOss';
    this.http.post(url, ossConfig ).subscribe(
      data => {
        that.isload = false;
        if (data['header'].code == 200) {
         if(data['body']==false){
          that.isHint = true;
          that.hintMsg = 'oss测试失败';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }else{
          that.isHint = true;
          that.hintMsg = 'oss测试成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
         }
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => { console.log(err) }
    )
  }
}
