import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-reservestatus',
  templateUrl: './reservestatus.component.html',
  styleUrls: ['./reservestatus.component.css']
})
export class ReservestatusComponent implements OnInit {
  reservestatuslist:any;//预约单列表
  isload=true;
  isHint=false;
  hintMsg:any;
  warning=false;
  businesslist=[];
  nodata=false;
  public headers = new Headers({'Content-Type': 'application/json'});
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.statuslist();
  }
  statuslist(){
    let that=this;
    let statusurl='/oms-admin/reservestate/queryReserveStateList';
    this.http.get(statusurl).subscribe(
      data=>{
        console.log(data);
        that.isload = false;
        if(data['code'] == 200){
          if(data['data'].length==0){
              that.nodata=true;
              this.reservestatuslist=[];
          }else{
            that.reservestatuslist = data['data'];
            that.nodata=false;
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
  deletestatus(index){
    $(".deleteid").val(index)
  }
  sure(){
    let that=this;
    let statusurl='/oms-admin/reservestate/delReserveState/'+$(".deleteid").val();
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
            that.statuslist();
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
