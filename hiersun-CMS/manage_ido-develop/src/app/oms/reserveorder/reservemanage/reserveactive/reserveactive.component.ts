import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-reserveactive',
  templateUrl: './reserveactive.component.html',
  styleUrls: ['./reserveactive.component.css']
})
export class ReserveactiveComponent implements OnInit {
  activitychannel:any;         // 活动渠道
  createdate:any;              //创建时间
  enable:any;                  //启用无赠品短信通知
  enddate:any;                 //下单终止日期  
  gifttype:any;                //赠品类别
  id:any;                      //预约单赠品id
  name:any;                    //活动名称         
  receivedcount:any;           //已领取赠送的人数
  remark:any;                  //remark
  reservecount:any;            //预约人数
  setcount:any;                //设定赠送礼品人数
  signincount:any;             //到店签到人数        
  startdate:any;               //下单起始日期
  validity:any;                //活动状态
  verifyenddate:any;           //验证终止日期
  verifystartdate:any;         //验证起始日期
  deleteid:any;
  activelists:any;
  pageSize=10;
  pageCount:any;//总页数
  pageNo = 1;
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  businesslist=[];
  nodata=false;
  role:any;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    let that=this;
    this.route.queryParams.subscribe(function (data) {
      that.role=data.role;
      console.log(that.role)
      if(data.page){
        that.pageNo = data.page;
      }else{
        that.pageNo=1;
      }
    })
    this.activelist()
  }
  activelist(){
    let that=this;
    let businesurl='/oms-admin/reserveactivity/queryReserveActivityList?currentPage='+ that.pageNo+'&pageSize='+ that.pageSize;
    this.http.get(businesurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].list.length==0){
              that.nodata=true;
              this.activelists=[];
          }else{
            that.activelists = data['data'].list;
            history.replaceState(null, null, '/oms/reserveactive?role='+that.role+'&page='+that.pageNo)
            that.nodata=false;
            that.pageNo = data['data'].currentPage; //当前页
            that.pageCount = data['data'].pages; //总页数
            $("#pagination1").pagination({
              currentPage:that.pageNo,
              totalPage: that.pageCount,
              callback: function(current) {
                that.pageNo = current;
                that.activelist()
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
  deleteactive(index){
    this.deleteid=index
  }
  sure(){
    let that=this;
    let statusurl='/oms-admin/reserveactivity/delReserveActivity/'+that.deleteid;
    this.http.delete(statusurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          that.isHint= true;
          that.hintMsg = '删除成功';
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
            that.activelist();
          },1500)
          
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
}
