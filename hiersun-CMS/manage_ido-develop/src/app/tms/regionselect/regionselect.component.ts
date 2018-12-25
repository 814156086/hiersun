import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;
@Component({
  selector: 'app-regionselect',
  templateUrl: './regionselect.component.html',
  styleUrls: ['./regionselect.component.css']
})
export class RegionselectComponent implements OnInit {
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public provList = [];//省列表
  public cityList = [];//市列表
  public districtList = [];//区列表
  public selectedList = [];//点击生成的列表
  public regList = [];//传递的list
  public regList2 = [];//传递的list
  public inx: any;
  public flag = 1;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {

  }
  initRegionList(flag, inx) {
    $("#modal_region").modal("show");
    this.inx = inx;
    this.flag = flag;
    // list.length?this.selectedList = list:"undefined";

    if (flag == 1) {
      if (!this.regList[inx]) {
        this.selectedList = [];
      } else {
        this.selectedList = this.regList[inx]
      }
    } else {
      if (!this.regList2[inx]) {
        this.selectedList = [];
      } else {
        this.selectedList = this.regList2[inx]
      }
    }
    this.isload = false;
    var provurl = '/pcm-admin/regions?parentId=1&levelType=1';
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.provList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
    // var slist = [];
    // this.regList.forEach(element => {
    //   slist.push(...element)
    // });
    // slist.forEach(element => { 
    //   $(`.spro_${element.id}`).parent(".md-checkbox-inline").css({"display":"none"})
    //   })
  }

  initCityList(code) {
    this.isload = false;
    $('.allDistr').css({ "display": "none" })
    this.districtList = [];
    var provurl = `/pcm-admin/regions?parentId=${code}&levelType=2`;
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          $('.allCity').css({ "display": "block" });
          this.cityList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  initDistrict(code) {
    this.isload = false;
    var provurl = `/pcm-admin/regions?parentId=${code}&levelType=3`;
    this.httpclient.get(provurl, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          $('.allDistr').css({ "display": "block" })
          this.districtList = res['data'];
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
    if ($(`input[title=${code}]:checked`).length != 0) {
      $(`input[value=${code}]`).attr("checked", true);
    }
  }

  addRegion(event, item) {
    var that = this;
    let ltype2 = function () {
      var checkleng = $('.allCity input[type="checkbox"]:checked').length;
      if (checkleng == that.cityList.length) {
        $(`input[title=${item.parentid}]`).attr("checked", true);
        var prov = $(`input[title=${item.parentid}]`).val();
        $(`input[title=${prov}]`).attr("checked", false);
      } else {
        // $(`input[title=${item.parentid}]`).attr("checked", false);
      }
    }
    let ltype3 = function () {
      var checkleng = $('.allDistr input[type="checkbox"]:checked').length;
      if (checkleng == that.districtList.length) {
        $(`input[title=${item.parentid}]`).attr("checked", true);
      } else {
        // $(`input[title=${item.parentid}]`).attr("checked", false);
      }
      var cileng = $('.allCity input[type="checkbox"]:checked').length;
      if (cileng == that.cityList.length) {
        var prov = $(`input[title=${item.parentid}]`).val();
        $(`input[title=${prov}]`).attr("checked", true);
      }
    }
    var e = typeof ($(event.target).attr("checked"));
    if (e == "undefined") {
      $(`input[title=${item.parentid}]`).attr("checked", false);
      var prov = $(`input[title=${item.parentid}]`).val();
      $(`input[title=${prov}]`).attr("checked", false);
      item.leveltype == 1 ? $(`input[value=${item.id}]`).attr("checked", false) : "undefined";
      item.leveltype == 2 ? $(`input[value=${item.id}]`).attr("checked", false) : "undefined";
      this.selectedList.forEach((value, index) => {
        if (value.id == item.id) {
          this.selectedList.splice(index, 1)
        }
      })
    } else {
      if (item.leveltype == 1) {
        $(`input[value=${item.id}]`).attr("checked", true);
      } else if (item.leveltype == 2) {
        $(`input[value=${item.id}]`).attr("checked", true);
        ltype2();
      } else if (item.leveltype == 3) {
        $(`input[value=${item.id}]`).attr("checked", true);
        ltype3();
      }
      this.selectedList.push({
        "id": item.id,
        "parentid": item.parentid,
        "name": item.name
      });

    }
  }
  delRegion(sid) {
    this.selectedList.forEach((value, index) => {
      if (value.id == sid) {
        this.selectedList.splice(index, 1)
      }
    })
    $(`#checkbox${sid}`).attr('checked', false);
  }
  // 确定提交
  subRegion() {
    $("#modal_region").modal('hide');
    if (this.flag == 1) {
      this.regList.push(this.selectedList);
      var val = "";
      this.selectedList.forEach((element) => {
        val += element.name + "、"
      })
      var val = val.substring(0, val.length - 1)
      $(`.reg${this.inx}`).html(val);
    } else {
      this.regList2.push(this.selectedList);
      var val = "";
      this.selectedList.forEach((element) => {
        val += element.name + "、"
      })
      var val = val.substring(0, val.length - 1)
      $(`.reg2${this.inx}`).html(val);
    }
  }
  // 快递
  backList() {
    return this.regList;
  }
  // 指定条件
  backList2() {
    return this.regList2;
  }
  // 删除
  delSelectItem(sid) {
    this.regList.splice(sid, 1)
  }
  // 切换计价方式清空
  emptySelect() {
    this.regList = [];
    this.regList2 = [];
  }
  //  编辑赋值
  initList(reglist, reglist2) {
    this.regList = reglist;
    this.regList2 = reglist2;
    console.log(reglist, reglist2, 1)
  }
  // 编辑回显
  editList(flag, inx) {
    this.initRegionList(flag, inx);
  }
}
