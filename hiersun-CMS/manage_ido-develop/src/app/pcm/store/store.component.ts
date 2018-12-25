import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  public storesList = [];//门店列表
  public companyList = [];//集团列表
  public detailList: StoreInfo;//详情列表
  public channelList = []//渠道列表
  public areaName = '';//区
  public provName = '';//省
  public cityName = '';//市
  public parentName = '';//所属上级
  public pageNum = 1;//页码
  public pageSize = 10;//每页显示数量
  public pagetotal = "";//总页数
  public currentpage = ""//当前页码
  //确认弹窗
  public isShowWarnWin = false;
  //确认窗口提示消息
  public warnMsg: string;
  //按钮css类型
  public btn_type_css: string;
  public isload = false;//是否加载
  public optwayList = [];//经营类型
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };

  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    if ($().select2) {
      $('#companyCode').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.detailList = new StoreInfo('', '', 0, '', '', '', '');
    this.loadCompany();
    this.loadChanList();
    this.loadOptwayList();
    this.searchStore();
  }
  // 经营类型
  loadOptwayList() {
    var opturl = '/pcm-admin/dict/finddicts';
    var optParams = {
      "code": "optway"
    }
    this.httpclient.post(opturl, optParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.optwayList = res['data']['dictList'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  // 加载所属上级列表
  loadCompany() {
    this.isload = false;
    let parurl = '/pcm-admin/organization/childs?orgType=0';
    this.httpclient.get(parurl).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.companyList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  //   可售渠道
  loadChanList() {
    var chanurl = '/pcm-admin/channels';
    this.httpclient.get(chanurl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.channelList = res['data'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
  }
  editStore() {
    var size = $('td input[type="checkbox"]:checked').length;
    if (size != 1) {
      this.showWarnWindow(true, "请选择一个门店进行编辑", "warning");
      return;
    }
    var stoid = $('td input[type="checkbox"]:checked').attr('title');
    this.route.navigate(['pcm/store/editstore'], {
      queryParams: {
        stoid
      }
    });
  }
  // 查询
  searchStore() {
    this.isload = false;
    var that = this;
    var params = {
      "currentPage": this.pageNum,
      "pageSize": this.pageSize,
      "organizationCode": $('.stoCode').val(),
      'organizationName': $.trim($('.stoName').val()),
      'parentSid': $('#companyCode').select2('val')
    }
    var seaurl = '/pcm-admin/stores';
    this.httpclient.post(seaurl, params, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.storesList = res['data']['content'];
          this.pagetotal = res['data']['pageTotal'];
          this.currentpage = res['data']['currentPage'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        $("#pagination1").pagination({
          currentPage: this.currentpage,
          totalPage: this.pagetotal,
          callback: function (current) {
            that.pageNum = current;
            that.searchStore();
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }

  // 重置
  resetStore() {
    $('#companyCode').select2('val', '');
    $('.stoCode').val("");
    $('.stoName').val("");
    this.pageNum = 1;
    this.searchStore();
  }

  // 查看详情
  itemDetail(detailId) {
    this.parentName = "";
    this.provName = "";
    this.cityName = "";
    this.areaName = "";
    // this.chanList=[]
    var durl = `/pcm-admin/store/${detailId}`;
    this.httpclient.get(durl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.detailList = res['data'];
          $('#full').modal('show')
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
        var pca = res['data']['areaCode'];
        // var parid = res['data']['parentSid'];
        var storeType = res['data']['storeType'];
        var chanId = res['data']['saleChannelSids'];
        $(`input[name='dtlopeType'][title=${storeType}]`).attr("checked", true)//类型（详情）
        this.parentName = res['data']['parentOrgName'];
        if (pca) {
          this.getPcaInfo(pca);
        }
        // if (parid) {
        //   this.getParInfo(parid);
        // }
        $(`input[name='dtlchannel']`).removeAttr("checked");//渠道清空(详情)
        if (chanId) {
          var chans = chanId.split(',');
          console.log(chans);
          for (var c in chans) {
            $(`input[name='dtlchannel'][title=${chans[c]}]`).attr("checked", true);//渠道(详情)
          }
        }
        var allChanCode = 1;
        $(`input[name='dtlchannel'][title=${allChanCode}]`).attr("checked", true);//全渠道(详情)
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 获取省市区信息
  getPcaInfo(pca) {
    var pcaurl = `/pcm-admin//region/superiors/${pca}`;
    this.httpclient.get(pcaurl, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
          this.provName = res['data'][0]['name'];
          this.cityName = res['data'][1]['name'];
          this.areaName = res['data'][2]['name'];
        } else {
          this.showWarnWindow(true, res['desc'], 'warning');
        }
      }, (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 所属上级
  // getParInfo(parid) {
  //   var parurl = `/pcm-admin/company/${parid}`;
  //   this.httpclient.post(parurl, this.httpOptions).subscribe(
  //     res => {
  //       if (res['code'] == 200) {
  //         this.parentName = res['data']['organizationName'];
  //       } else {
  //         this.showWarnWindow(true, res['desc'], 'warning');
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.error);
  //     })
  // }
  //可售渠道
  // getChannleInfo(chanId) {
  //   this.isload = false;
  //   this.chanList = [];
  //   var chans = chanId.split(',');
  //   for (var c in chans) {
  //     var parurl = `/pcm-admin/channel/${chans[c]}`;
  //     this.httpclient.post(parurl, this.httpOptions).subscribe(
  //       res => {
  //         this.isload = true;
  //         if (res['code'] == 200) {
  //           this.chanList.push(res['data']['channelName']);
  //         } else {
  //           this.showWarnWindow(true, res['desc'], 'warning');
  //         }
  //       },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       })
  //   }
  // }
  /**
* 全局弹窗
*/
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }
  /**
   * 关闭窗口
   */
  closeWin() {
    var that = this;
    this.isShowWarnWin = false;
    this.warnMsg = "";
  }

}
export class StoreInfo {
  constructor(
    public organizationName: String,
    public organizationCode: String,
    public storeType: Number,
    public telephone: String,
    public faxNo: String,
    public shopOwner: String,
    public shopAddress: String
  ) {
  }
}
