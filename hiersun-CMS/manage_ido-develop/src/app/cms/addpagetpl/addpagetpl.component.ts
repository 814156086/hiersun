import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addpagetpl',
  templateUrl: './addpagetpl.component.html',
  styleUrls: ['./addpagetpl.component.css']
})
export class AddpagetplComponent implements OnInit {
  siteId:any;
  pageTmplId="";
  enabled=true;
  pagename:any;
  pagenameadd:any;
  pagetemp:any;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      pagename: ['', [Validators.required]],
      pagenameadd: ['', [Validators.required]],
      pagetemp: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    let that=this;
    that.route.queryParams.subscribe(function (data) {
      that.siteId=data.siteid;
      that.pageTmplId=data.id;
      console.log(data)
    })
    $('.switch input').bootstrapSwitch({
      onSwitchChange: function (event, state) {
        if (state == false) {
          that.enabled = false
        } else {
          that.enabled = true
        }
      }
    });  
    if(that.pageTmplId){
      var url = '/api/cms/pageTmpl/desc/'+that.pageTmplId;
      this.http.get(url).subscribe(
        function(data){
          console.log(data)
          that.isload = true;
          if(data['header'].code == 200){
            that.isload = false;
            if (data['body'].enabled == false) { //是否启用,0停用，1启用
              $('.switch input').bootstrapSwitch('state', false);
            } else {
              $('.switch input').bootstrapSwitch('state', true);
            }
            that.pagename=data['body'].name;
            that.pagenameadd=data['body'].fileNameTmpl;
            that.pagetemp=data['body'].content;
          }else{
            that.isHint= true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint= false;
              that.hintMsg = '';
            },1500)
          }
      },function(err) {
        console.log(err)
      })
    }
  }
  onSubmit(){
    let url = '/api/cms/pageTmpl/save-or-update';
    let that = this;
    that.isload=true;
    let pageTmpl = {
      id:that.pageTmplId,
      siteId:that.siteId,
      enabled:that.enabled,
      name:$('input[name="pagename"]').val(),
      fileNameTmpl:$('input[name="pagenameadd"]').val(),
      content:$('textarea[name="pagetemp"]').val()
    }
    this.http.post(url, pageTmpl).subscribe(function (data) {
        console.log(data);
        that.isload=false;
        if(data['header'].code == 200 ){
          that.isload = false;
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['cms/pagetemplate']);
          }, 1500)
        }else{
          this.isHint= true;
          this.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint= false;
            that.hintMsg = '';
          },1500)
        }
      },
      err=>{console.log(err)}
    )
  }
  goback(){
    let that=this;
    that.router.navigateByUrl('/cms/pagetemplate');
  }
}
