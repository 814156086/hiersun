import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;


@Component({
  selector: 'app-zfbapplylist',
  templateUrl: './zfbapplylist.component.html',
  styleUrls: ['./zfbapplylist.component.css']
})
export class ZfbapplylistComponent implements OnInit {
  mchchannel: any;
  mchid: any;
  pid: any;
  zfblist = [];
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public businessstaus = true;
  nodata = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.mchchannel = data.mchchannel;
      that.mchid = data.mchid;
      that.pid = data.pid;
      that.apply()
    })
   
  }
  addnew(){
    this.router.navigateByUrl('pay/apply?mchid='+this.mchid+'&mchchannel='+this.mchchannel+'&pid='+this.pid+'&btntype=3');
  }
  apply() {
    let that = this;
    let businesurl='/api/v1/pay-mgr/mchPayApp/queryMchPayApp?mchId='+that.mchid+'&mchChannel='+that.mchchannel+'&pid='+that.pid+'&currentPage=1&pageSize=10';
    this.http.get(businesurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if(data['data']['list'].length>0){
            that.zfblist = data['data']['list'];
          }else{
            that.zfblist=[];
            that.nodata=true;
          }
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  //修改状态
  editstatus(mchchannel,mchid,pid,appid,enabled){
    let that = this;
    let businesurl='/api/v1/pay-mgr/mchPayApp/changeStatusMchPayApp/'+mchid+'/'+mchchannel+'/'+pid+'/'+appid+'/'+enabled;
    this.http.post(businesurl,null).subscribe(
      data => {
        that.isload = true;
        if (data['code'] == 200) {
          that.isload = true;
          that.apply()
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  goback(){
    let that = this;
    that.router.navigateByUrl('pay/paymethod?page=1');
  }
}
