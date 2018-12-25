import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params ,NavigationExtras} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
declare var $: any;
// import { HttpModule, JsonpModule } from '@angular/http';
// import { Http } from '@angular/http';
@Component({
  selector: 'app-articlemanagement',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.css']
  
})
export class ArtComponent implements OnInit {
  formModel: FormGroup;
  public list=[]; 
  public pageNo=1;//默认第一页
  public siteType=1;
  public pageList=[1];
  public message = "";
  // 操作部分需要的值
  artContentId : any;
  status = ""
  isload=true;
  isHint=false;
  hintMsg:any;
  id: any;
  cname:any;
  code1:any;
  cserialNumber:any;
  list1=[];
  id2:any;
  pageCount:any;
  csubCode:any;

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder,private router:Router) {
    this.formModel = fb.group({
      cserialNumber: ['', [Validators.required]],
      cname: ['', [Validators.required]],
      csubCode: ['', [Validators.required]]
    })
   }

  ngOnInit() {
    var url = '/api/article/artClassify/list';
    var that = this;
     this.http.get(url).subscribe(
        function(data){
          if(data['header'].code == 200){
            that.list1 = data['body']
            that.list1.map((item,index)=>{
              item['expand']=false;
            })
           
            // console.log(data)
          }
          // console.log(data)
        },function(err){
          console.log(err)
        }
     )
  }
// 删除操作
operation(id,status){
  this.message = "";
  this.status = "";
  this.artContentId = "";
  // $('#myModalo').model('show');
  if(status == 'del'){
    this.message = "确定删除此大类";
  }else if(status == 'delc'){
    this.message = "确定删除此子类";
  }
  this.status = status;
  this.artContentId = id;
}
// 确定
subStatus(){
  let that = this;
  let url = "";
  if (that.status == 'del'){
    url = `/api/article/artClassify/del/${that.artContentId}`;
    this.http.delete(url).subscribe(
      function(res){
        if(res['header'].code == 200){
          that.ngOnInit()
          $("#myModalo").modal('hide')
        }
      }
    )
  }else if(that.status == 'delc'){
    url = `/api/article/artSubClassify/del/${that.artContentId}`
    this.http.delete(url).subscribe(
      function(res){
        if(res['header'].code == 200){
          $("#myModalo").modal('hide')
          that.ngOnInit()
        }
      }
    )
  }
}


// 删除
//   del(index){
//     let that = this;
//     let url = `/api/article/artClassify/del/${index}`
//     this.http.delete(url).subscribe(
//       function(res){
//         if(res['header'].code == 200){
//           that.ngOnInit()
//         }
//       }
//     )
//   }
// delc(index){
//   let that = this
//   let url = `/api/article/artSubClassify/del/${index}`
//   this.http.delete(url).subscribe(
//     function(res){
//       if(res['header'].code == 200){
//         that.ngOnInit()
//       }
//     }
//   )
// }



  sub_form(){
    let that = this;
    let cname=$('#cname').val()
    let cserialNumber=$('#cserialNumber').val()
    let csubCode=$('#csubCode').val()
    let ctit=$('#ctit').val()
    let ckey=$('#ckey').val()
    let cdp=$('#cdp').val()
    let url1=`/api/article/artSubClassify/check-subCode?code=`+that.code1+'&subCode='+csubCode;
    this.http.get(url1).subscribe(
      function(data) {
        if (data['header'].code == 200) {
          if (data['body'] == true) {
            that.isHint = true;
            that.hintMsg = "子分类编码不能重复！";
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else {
            let obj = {
              "code": that.code1,
              "description": cdp,
              "keywords": ckey,
              "name": cname,
              "serialNumber": cserialNumber,
              "subCode": csubCode,
              "title": ctit
            }
            that.addSubClassfiy(obj);
          }
        }
      }
    )
  }
  addSubClassfiy(obj){
    let that=this;
    let url = `/api/article/artSubClassify/save-or-update`
    this.http.post(url,obj).subscribe(
      function(data){
        // console.log(data);
        if(data['header']['code']==200){
          $("#myModal").modal('hide');
          that.ngOnInit();
        }
      }
    )
    $('input').val('')
    $("textarea").val('')

  }
  back(){
    $("#myModal").modal('hide');
  }
  cadd(id,code){
    $('#myModal').modal('show');
    this.id2=id;
    this.code1=code
    
  }
 
}
