import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-businessinfo',
  templateUrl: './businessinfo.component.html',
  styleUrls: ['./businessinfo.component.css']
})
export class BusinessinfoComponent implements OnInit {
  @ViewChild('mchmsg') mchmsg
  isadd=1;             //1新增
  shops:any;
  businessstaus=true;
  businessidlist:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  businesslist=[];
  nodata=false;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    })
    that.shoplist();
    if ($().select2) {
      $('#businessid').select2({
        placeholder: 'Select',
        allowClear: true
      });
    }

   //可用的商户id
   let businesurl='/api/v1/pay-mgr/mchInfo/queryMchIds';
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.businessidlist=data['data'];
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
          that.hintMsg = '系统异常，请稍后再试';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
      }
    )
    that.businlist();
  }
  //添加商户
  addbusinessnew(){
    $("#myModal").modal('show');
    this.isadd=1;
  }
  shoplist() {
    let that = this;
    let listurl = '/pcm-inner/org/findstorelist';
    this.http.get(listurl).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          if (data['data'].length != 0) {
            that.shops = data['data'];
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
  businlist(){
    let that=this;
    let businesurl='/api/v1/pay-mgr/mchInfo/queryMchInfo?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize+'&mchId='+$('#businessid').select2('val');
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.businesslist=[];
          }else{
            that.businesslist = data['data'].list;
            history.replaceState(null, null, '/pay/businessinfo?page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.businlist()
              }
            });
          }
          
        }else{
          that.isHint= true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  reset(){
    $(".form-control").val("");
    $("#businessid").select2("data", null); 
    this.businlist()
  }
}
