import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../services/common.service';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-artc',
  templateUrl: './artmodifysubclasses.component.html',
  styleUrls: ['./artmodifysubclasses.component.css']
})
export class ArtmodifysubclassesComponent implements OnInit {
  formModel: FormGroup;

public ftpArray = [];
  id: any;
  cname:any;
  csubCode:any;
  constructor(private common:CommonService,private http:HttpClient,private route: ActivatedRoute,fb: FormBuilder) {
    this.formModel = fb.group({
      csubCode: ['', [Validators.required]],
      cname: ['', [Validators.required]]
    })
   }
  public headers=new Headers({"Content-Type":'application/json'});

  ngOnInit() {
    var that=this;
    this.route.params.subscribe(function(data){
      that.id=data.id
    })
    
    this.loadInfo(this.id)
  }


  loadInfo(id){
    var that=this;


    var url=`/api/article/artSubClassify/desc/${id}`;    
        this.http.get(url).subscribe(
          function(data){
            if(data['header'].code == 200){
              // console.log(data['body']);
              that.ftpArray.push(data['body'])
              that.cname = data['body']['name']
              that.csubCode = data['body']['subCode']
              // console.log(that.ftpArray)
            }
            
          },function(err){
            console.log(err)
          }
       )
  }


  sub_form(){
    var that = this;
    var id = this.id;
    var obj ={
      "description": $('#cdp').val(),
      "id": this.id,
      "keywords": $('#ckey').val(),
      "name": $('#cname').val(),
      "serialNumber": $('#cserialNumber').val(),
      "subCode": $('#csubCode').val(),
      "title":  $('#ctit').val()
    }
    // console.log(obj)
    let url = '/api//article/artSubClassify/save-or-update'
    this.http.post(url,obj).subscribe(
      function(data){
        // console.log(that.ftpArray)
        that.back()
        that.ngOnInit()
      }
    )
  }


  back(){
    window.history.go(-1)
  }

}
