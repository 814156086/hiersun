import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var $: any;

const urlBase = '/edi-admin';

@Component({
  selector: 'app-tradesdetail',
  templateUrl: './tradesdetail.component.html',
  styleUrls: ['./tradesdetail.component.css']
})
export class TradesdetailComponent implements OnInit {
  public detailOrder = [];
  public tid = '';
  public topChildOrders = [];
  public discounts = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    const modal_order = $('#modal_order');
    modal_order.on('hidden.bs.modal', function () {
      $('.title li').removeClass('active');
      $('.title li:first').addClass('active');
    });
  }

  detailShow(tid) {
    // $('#ttab>div').removeClass('active');
    // $('#ttab>div:first').addClass('active');
    $('#tabs-nav').html('');
    $('#tabs-nav2').html('');
    $('#child-tabs-nav li').removeClass('active');
    $('#child-tabs-nav li:first').addClass('active');
    this.detailOrder = [];
    this.tid = tid;
    const url = urlBase + '/edi-top-server/edi/ops/top/trade/trade/' + tid;
    this.httpClient.get(url).subscribe({
      next: ignored => {
        this.detailOrder.push(ignored['data']);
        this.topChildOrders = ignored['data']['orders'];
        this.discounts = ignored['data']['topPromotions'];
        this.detailOrder[0]['checkPassed'] ? $("fieldset").css('border-color','red') : $("fieldset").css('border-color','red');
        this.discounts.length == 0 ? $('#discounts').hide() : $('#discounts').show()
        const ul = $('#tabs-nav');
        const ul2 = $('#tabs-nav2');
        for (let i = 0; i < this.topChildOrders.length; i++) {
          let number = i+1;
          const li = this.topChildOrders[0]['error'] ? $('<li><a style="color:#000" href = "#otab_' + i + '" class = "otab_ ' + i + '"  data-toggle="tab"><i class="fa glyphicon glyphicon-warning-sign" style="color:red"></i> 订单行 '+ number +'</a></li>') : $('<li><a style="color:#000" href = "#otab_' + i + '" class = "otab_ ' + i + '"  data-toggle="tab"> 订单行 '+ number +'  </a></li>');
          ul.append(li);
        }
        for (let i = 0; i < this.discounts.length; i++) {
          const li2 = !this.discounts[i].giftItemNum ?
            $('<li><a style="color:#000" href = "#tab_' + i + '" class = "tab_ ' + i + '"  data-toggle="tab"> 满减优惠 </a></li>') :
            $('<li><a style="color:#000" href = "#tab_' + i + '" class = "tab_ ' + i + '"  data-toggle="tab"> 满赠优惠 </a></li>');
          ul2.append(li2);
        }
        $('#tabs-nav li:first,#tabs-nav2 li:first').addClass('active');
      },
      complete: () => {
      }
    });
    $('#tab-content,#tab-content2').bind('DOMNodeInserted', function (e) {
      $(this).children('div:first').addClass('active');
    });
    $('#modal_order').modal('show');
  }

  // 显示更新子订单商家编码和sku弹框
  updateOrder(item) {
    // this.loadItemTypes(1, this.pageSize);
    $('#item-update-order-oid').val(item.oid);
    $('#item-update-order-outerIid').val(item.outerIid);
    $('#item-update-order-outerSkuId').val(item.outerSkuId);
    $('#item-update-order').modal('show');
  }

  // 更新子订单商家编码和sku
  updateOrdering() {
    const oid = $('#item-update-order-oid').val();
    const outerIid = $('#item-update-order-outerIid').val();
    const outerSkuId = $('#item-update-order-outerSkuId').val();
    const url = urlBase + '/edi-top-server/edi/ops/top/trade/update-order?oid=' + oid +
      '&outerIid=' + outerIid + '&outerSkuId=' + outerSkuId;
    this.httpClient.post(url, {})
      .subscribe({
        next: ignored => {
          $('#item-update-order').modal('hide');
          // this.childOrder(this.tid);
          // this.detailShow(this.tid);
          $('#modal_order').modal('hide');
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
        }
      });
  }
}
