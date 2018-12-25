import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-addtemp',
  templateUrl: './addtemp.component.html',
  styleUrls: ['./addtemp.component.css']
})
export class AddtempComponent implements OnInit {
  @ViewChild('regionselect') regionselect
  public isShowWarnWin = false;  //确认弹窗
  public warnMsg: string;   //确认窗口提示消息
  public btn_type_css: string;  //按钮css类型
  public isload = false;//是否加载
  public titleMesg: string;//提示信息
  public priceMethod = 1;//计价方式
  public methodStatus = 1;//计价方式
  public shippingMethods = [];;//运送方式
  public deliveryList = [];;//快递方式
  public conditionList = [];//指定条款方式
  public regionList = [];//行政区域列表
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient, private route: Router) { }

  ngOnInit() {
    this.isload = true;
  }
  isShip(a) {
    // a == 1 ? this.showWarnWindow(true, "确定自定义运费？", "warning") : this.showWarnWindow(true, "确定卖家承担运费？", "warning");
    a == 1 ? this.titleMesg = "确定自定义运费？" : this.titleMesg = "确定卖家承担运费？";
    $("#switchModal").modal('show')
  }
  switchMethod(status) {
    this.methodStatus = status;
    this.titleMesg = "确定要切换计价方式吗？"
    $("#switchModal").modal('show')
  }
  sureSwitch() {
    if (this.titleMesg == "确定要切换计价方式吗？") {
      this.priceMethod = this.methodStatus;
      $(".increaseSum").val("")
      $(".increaseFreight").val("")
      $("#delivery").attr("checked", false);
      $("#condition").attr("checked", false);
      this.deliveryList = [];
      this.conditionList = [];
      this.regionselect.emptySelect();
    } else if (this.titleMesg == "确定卖家承担运费？") {
      $('.customCon').css({ "display": "none" })
    } else if (this.titleMesg == "确定自定义运费？") {
      $('.customCon').css({ "display": "block" })
    }
  }
  addItem(smethod, e) {
    if (smethod == 1) {
      $("#delivery").attr("checked", true)
      this.deliveryList.push({
      })
    } else if (smethod == 3) {
      $("#condition").attr("checked", true)
      this.conditionList.push({
      })
    }
  }
  delItem(smethod, delikey) {
    if (smethod == 1) {
      this.deliveryList.splice(delikey, 1);
      this.deliveryList.length == 0 ? $("#delivery").attr("checked", false) : $("#delivery").attr("checked", true)
    } else if (smethod == 3) {
      this.conditionList.splice(delikey, 1);
      this.conditionList.length == 0 ? $("#condition").attr("checked", false) : $("#condition").attr("checked", true)
    }
    this.regionselect.delSelectItem(delikey);
  }
  subTemplate() {
    this.isload = false;
    var templateName = $('.templateName').val();
    var isShipping = $('input[name="isShip"]:checked').attr('title');
    var teParams = {};
    if (isShipping == 1) {
      var priceType = $('input[name="isPrice"]:checked').attr('title');
      var firstSum = $('.firstSum').val();
      var firstFreight = $('.firstFreight').val();
      var increaseSum = $('.increaseSum').val();
      var increaseFreight = $('.increaseFreight').val();
      if (firstSum && firstFreight && increaseSum && increaseFreight) {
        this.shippingMethods.push({
          "firstSum": firstSum,
          "firstFreight": firstFreight,
          "increaseSum": increaseSum,
          "increaseFreight": increaseFreight,
          "isDefalut": "1",
          "shippingMethod": "1",
        })
      }
      var subList = this.regionselect.backList();
      var subList2 = this.regionselect.backList2();
      var trList = $(".alldeli").find('.deliItem');
      trList.each((trindex, tritem) => {
        var tdArr = trList.eq(trindex).find("td");
        var deliverRegionCode = [];
        var deliverRegion = subList[trindex];
        deliverRegion.forEach(element => {
          deliverRegionCode.push({
            "id": element.id
          })
        });
        var firstSum = tdArr.eq(1).find('input').val();
        var firstFreight = tdArr.eq(2).find('input').val();
        var increaseSum = tdArr.eq(3).find('input').val();
        var increaseFreight = tdArr.eq(4).find('input').val();
        this.shippingMethods.push({
          "deliverRegionCode": JSON.stringify(deliverRegionCode),
          "deliverRegion": JSON.stringify(deliverRegion),
          "firstSum": firstSum,
          "firstFreight": firstFreight,
          "increaseSum": increaseSum,
          "increaseFreight": increaseFreight,
          "isDefalut": "0",
          "shippingMethod": "1",
        })
      })
      var contrList = $(".allcond").find('.condItem');
      contrList.each((ctrindex, ctritem) => {
        var ctdArr = contrList.eq(ctrindex).find("td");
        var deliverRegionCode = [];
        var deliverRegion = subList2[ctrindex];
        deliverRegion.forEach(element => {
          deliverRegionCode.push({
            "id": element.id
          })
        });
        var saleNoPrice = ctdArr.eq(1).find('.saleNoPrice').val();
        var saleFreight = ctdArr.eq(1).find('.saleFreight').val();
        this.shippingMethods.push({
          "deliverRegionCode": JSON.stringify(deliverRegionCode),
          "deliverRegion": JSON.stringify(deliverRegion),
          "saleNoPrice": saleNoPrice,
          "saleFreight": saleFreight,
          "shippingMethod": "3",
        })
      })
      var cash = typeof ($("#cash").attr("checked"));
      if (cash != "undefined") {
        this.shippingMethods.push({
          "shippingMethod": "2",
        })
      }
      teParams = {
        "templateName": templateName,
        "isShipping": isShipping,
        "priceType": priceType,
        "shippingMethods": this.shippingMethods
      }
    } else if (isShipping == 2) {
      teParams = {
        "templateName": templateName,
        "isShipping": isShipping,
      }
    }
    var teUrl = '/tms-admin/shipping/saveShipping';
    this.httpclient.post(teUrl, teParams, this.httpOptions).subscribe(
      res => {
        this.isload = true;
        if (res['code'] == 200) {
          this.showWarnWindow(true, "保存成功！", "success");
        } else {
          this.showWarnWindow(true, res['desc'], "warning");
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      })
  }
  // 选择省市
  editRegion(flag, inx) {
    this.regionselect.initRegionList(flag, inx);
  }
  goBack() {
    window.history.go(-1);
  }
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
    if (this.btn_type_css == 'success') {
      that.route.navigate(['/tms/faretemplate'])
    }
  }
}
