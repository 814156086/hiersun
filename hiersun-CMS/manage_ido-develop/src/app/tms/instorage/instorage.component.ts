import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {copyStyles} from '@angular/animations/browser/src/util';

declare var $: any;

@Component({
  selector: 'app-instorage',
  templateUrl: './instorage.component.html',
  styleUrls: ['./instorage.component.css']
})
export class InstorageComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;  //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = true;//是否加载
  public pageNum = 1;//页码
  public pagetotal = '';//总页数
  public currentpage = 1;//当前页码
  public pageSize = 10;
  public recordTotal = 0;//记录总数
  instoragelists = [];     //入库单列表
  sid: any;     //当前所选的条
  orderNum: any;     //当前所选的条
  inStorageType: any;     //入库单类型(审核用的)
  storehouses = [];   //仓库列表
  storagetypes = [];  //入库类型
  storagedesc = [];   //库位
  instoragedetail = [];  //查看详情
  maininstorage: any;   //查看公共信息
  ordernum: any;    //入库单号
  inType: any;      //入库单类型：
  statusDesc: any;//状态：
  supNum: any; //供应商编号：
  supName: any;//供应商名称：
  contactName: any; //联系人：
  createUser: any;   //制单人：
  createTime: any;//制单日期：
  remark: any;   //备注：
  reason: any;   //审核原因
  varierystatus: any;  //审核还是查看
  id: any;    //点击查看的sid
  orderstate = [];   //订单状态表
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };

  constructor(private httpclient: HttpClient, private route: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    $('#pickTime').daterangepicker({
      timePicker: true,
      timePicker12Hour: false,
      timePickerIncrement: 1,
      separator: '--',
      format: 'YYYY-MM-DD HH:mm:ss',
      locale: {
        applyLabel: '确定',
        cancelLabel: '取消',
        fromLabel: '开始时间',
        toLabel: '截止时间',
      }
    });
    if ($().select2) {
      $('#instoragestatus').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }
    this.instoragelist();
    this.storehouse();
    this.orderstatus();
    this.storagetype();
    this.storagelist();

  }

  instoragelist() {
    let that = this;
    this.isload = false;
    var saleTimeStart = '';
    var saleTimeEnd = '';
    if ($('#pickTime').val() == '') {
      saleTimeStart = '';
      saleTimeEnd = '';
    } else {
      saleTimeStart = $('#pickTime').val().split('--')[0];
      saleTimeEnd = $('#pickTime').val().split('--')[1];
    }
    var sourceUrl = '/tms-admin/InStorage/in-storages?currentPage=' + that.pageNum + '&pageSize=10&orderNum=' + $('#instorageorder').val() + '&inType=' + $('#instoragestatus').select2('val') + '&supNum=' + $('#suppliercode').val() + '&supName=' + $('#suppliername').val() + '&contractOrder=' + $('#linkedorder').val() + '&startTime=' + saleTimeStart + '&endTime=' + saleTimeEnd + '&status=' + $('.orderstate').val();
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['data'].content.length > 0) {
          that.instoragelists = res['data'].content;
          this.currentpage = res['data']['currentPage'];
          this.pagetotal = res['data']['pageTotal'];
          that.recordTotal = 1;
          $('#pagination1').pagination({
            currentPage: this.currentpage,
            totalPage: this.pagetotal,
            callback: function (current) {
              that.pageNum = current;
              that.instoragelist();
            }
          });
        } else {
          that.instoragelists = [];
          that.recordTotal = 0;
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //入库类型
  storagetype() {
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=in_storage_type';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          this.storagetypes = res['data'].in_storage_type;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //仓库列表
  storehouse() {
    let that = this;
    this.isload = false;
    var param = {};
    var storeUrl = '/tms-admin/tms/stores';
    this.httpclient.post(storeUrl, param).subscribe(
      res => {
        if (res['code'] == 200) {
          this.isload = true;
          that.storehouses = res['data'].content;
        } else {
          this.showWarnWindow(true, '仓库查询异常', 'warning');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //订单状态
  orderstatus() {
    this.isload = false;
    var storeUrl = '/tms-admin/dict/dict-codes?codeListStr=review_status';
    this.httpclient.get(storeUrl).subscribe(
      res => {
        console.log(res);
        if (res['code'] == 200) {
          this.isload = true;
          this.orderstate = res['data'].review_status;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //库位信息列表
  storagelist() {
    let that = this;
    this.isload = false;
    var sourceUrl = '/tms-admin/local/tms-store-local?unlimit=1';
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        that.storagedesc = res['data'].content;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //查看
  lookdetail(id, sid, orderNum, status) {
    $('#lookModal').modal('show');
    let that = this;
    this.isload = false;
    that.varierystatus = status;
    that.sid = sid;
    that.id = id;
    that.orderNum = orderNum;
    var sourceUrl = '/tms-admin/InStorage/in-storage?sid=' + sid;
    this.httpclient.get(sourceUrl, this.httpOptions).subscribe(
      res => {
        console.log(res);
        this.isload = true;
        that.maininstorage = res['data'];
        that.instoragedetail = res['data'].inStorageDetailList;

        that.ordernum = that.maininstorage.orderNum;    // 入库单号
        // that.inType=that.maininstorage.inType;      // 入库单类型
        for (var i = 0; i < that.storagetypes.length; i++) {
          if (that.storagetypes[i].code == that.maininstorage.inType) {
            that.inStorageType = that.maininstorage.inType;
            that.inType = that.storagetypes[i].name;
            break;
          }
        }
        that.statusDesc = that.maininstorage.statusDesc;//状态：
        that.supNum = that.maininstorage.supNum; //供应商编号：
        that.supName = that.maininstorage.supName;//供应商名称：
        that.contactName = that.maininstorage.contactName; //联系人：
        that.createUser = that.maininstorage.createUser;   //制单人：
        that.createTime = that.formatDate(that.maininstorage.createTime, '-');
        //制单日期：
        that.reason = that.maininstorage.reason;
        that.remark = that.maininstorage.remark;   //备注：
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //删除
  deleteinstorage(sid) {
    $('#myModal').modal('show');
    this.sid = sid;
  }

  updelete() {
    let that = this;
    var deletesid = $('input:radio[name="listradio"]:checked').length;
    if (deletesid != 0) {
      $('#myModal').modal('show');
      that.sid = $('input:radio[name="listradio"]:checked').val();
    } else {
      this.showWarnWindow(true, '请选择要删除的项', 'warning');
      return false;
    }
  }

  suredelete() {
    let that = this;
    this.isload = false;
    var sourceUrl = '/tms-admin/InStorage/edit-in-storage?sid=' + that.sid;
    this.httpclient.delete(sourceUrl, this.httpOptions).subscribe(
      res => {
        console.log(res);
        this.isload = true;
        $('#myModal').modal('hide');
        that.instoragelist();
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  //编辑
  editorinstorage() {
    let that = this;
    var deletesid = $('input:radio[name="listradio"]:checked').length;
    that.sid = $('input:radio[name="listradio"]:checked').val();
    var status = $('input:radio[name="listradio"]:checked').attr('title');
    if (deletesid != 0) {
      if (status != 1) {
        this.showWarnWindow(true, '该订单不能编辑', 'warning');
        return false;
      } else {
        that.route.navigateByUrl('/tms/addinstorage?flag=2&sid=' + that.sid);
      }
    } else {
      this.showWarnWindow(true, '请选择要编辑的项', 'warning');
      return false;
    }

  }

  //审核通过/不通过保存,缺少审核人呢
  savesh(status) {
    let that = this;
    if (status == 2 && $('.reasonyy').val() == '') {
      this.showWarnWindow(true, '请填写审核原因', 'warning');
    }else if (status == 3 && $('.reasonyy').val() == '') {
      this.showWarnWindow(true, '请填写审核原因', 'warning');
    } else {
      var inStoragePara = {
        id: that.id,
        sid: that.sid,
        reason: $('.reasonyy').val(),
        status: status,
        auditUser: 'qqq'
      };
      var instoragerul = '/tms-admin/InStorage/edit-in-storage';
      this.httpclient.post(instoragerul, inStoragePara).subscribe(
        res => {
          console.log(res);
          if (res['code'] == 200) {
            this.isload = true;
            $('#lookModal').modal('hide');
            that.instoragelist();
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    }
  }

  // 重置
  reset() {
    $('.form-control').val('');
    $('#instoragestatus').select2('val', null);
    this.instoragelist();
  }

  // 全局弹窗
  public showWarnWindow(status, warnMsg, btnType) {
    this.isShowWarnWin = status;
    this.warnMsg = warnMsg;
    this.btn_type_css = btnType;
  }

  // 关闭窗口
  closeWin() {
    this.isShowWarnWin = false;
    this.warnMsg = '';
  }

  formatDate(time, Delimiter) {
    Delimiter = Delimiter || '-';
    var now = new Date(time);

    var year = now.getFullYear() + '';
    var month = now.getMonth() + 1 + '';
    var date = now.getDate() + '';
    var hour = now.getHours() + '';
    var minute = now.getMinutes() + '';
    var second = now.getSeconds() + '';

    // 补0
    month = month.length < 2 ? '0' + month : month;
    date = date.length < 2 ? '0' + date : date;
    hour = hour.length < 2 ? '0' + hour : hour;
    minute = minute.length < 2 ? '0' + minute : minute;
    second = second.length < 2 ? '0' + second : second;

    return year + Delimiter + month + Delimiter + date + ' ' + hour + ':' + minute + ':' + second;
  }
}
