import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-art',
  templateUrl: './artsmodify.component.html',
  styleUrls: ['./artsmodify.component.css']
})
export class ArtsnodifyComponent implements OnInit {
  formModel: FormGroup;
public ftpArray = [];//文章详情
id:any;
list:any;
code:any;
codes:any;
name:any;
names:any;
serialNumber:any;
serialNumbers:any;
isHint = false;
hintMsg: any;

  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder) { 
    this.formModel = fb.group({
      serialNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    })
  }
  public headers=new Headers({"Content-Type":'application/json'});

  ngOnInit() {
    var that=this;
    this.route.params.subscribe(function(data){
      that.id=data.id;
    })
    
    this.loadItemInfo(that.id)
  }
  loadItemInfo(id){
  var that=this;
        //  编辑详情
        var url=`/api/article/artClassify/desc/${id}`;    
        this.http.get(url).subscribe(
          function(data){
            if(data['header'].code == 200){
              that.ftpArray.push(data['body'])
              that.serialNumbers = data['body']['serialNumber']
              that.names = data['body']['name']
              that.codes = data['body']['code']
             
            }
            
          },function(err){
            console.log(err)
          }
       )
  }
  edit(){

    var that = this
    var id = this.id
    
    let obj = {
      "code": $('#code').val(),
      "id": this.id,
      "name": $('#name').val(),
      "serialNumber": $('#serialnumer').val(),
      "subClassifyList": [
        {
          "code": $('#code').val(),
          "id": this.id,
          "name": $('#name').val(),
          "serialNumber": $('#serialnumer').val()
        }
      ]
    }
    // console.log(obj);
    
    
    let url = '/api/article/artClassify/save-or-update';
    this.http.post(url,obj).subscribe(
      function(data){
        if(data['header'].code==200){
          that.ftpArray=this.obj;

          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.goback();
          }, 1500)
        }
      }
    )
  }
  goback(){
    // window.history.go(-1);
    this.common.goback();
  }
}
