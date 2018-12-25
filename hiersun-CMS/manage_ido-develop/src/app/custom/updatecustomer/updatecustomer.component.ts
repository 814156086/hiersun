import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";

declare var $: any;

@Component({
  selector: 'app-updatecustomer',
  templateUrl: './updatecustomer.component.html',
  styleUrls: ['./updatecustomer.component.css']
})
export class UpdatecustomerComponent implements OnInit {
  public formModel: FormGroup;
  public key = '';
  public enabled = '';
  public id = '';
  public isHint = false;
  public warning = false;
  public hintMsg = '';

  constructor(private router: Router, private httpClient: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      customclass: ['', [Validators.required]],
      customcode: ['', [Validators.required]]
    })
  }
  

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      $('#grouptype').val(data.type);
      $('#groupname').val(data.name);
      that.key = data.key;
      that.enabled = data.enabled;
      that.id = data.id;
      console.log(typeof(that.enabled))
      console.log(data)
    })
  }
  submit() {
    const that = this;
    let type = $('#grouptype').val();
    let name = $('#groupname').val();
    if(!type || !name){
      that.isHint = true;
      that.warning = true;
      that.hintMsg = '组类别与组名称不能为空';
      setTimeout(function(){
        that.isHint = false;
        that.warning = false;
        that.hintMsg = '';
      },2000)
      return false;
    }
    // let url = '/customer/auth/keFuGroup/save-or-update?name=' + that.name + '&enabled=' + that.enabled + '&id=' + that.id + '&type=' + type + '&code=' + code;
    let url = '/customer/auth/keFuGroup/save-or-update';
    console.log(url)
    this.httpClient.post(url,{
      name: name,
      enabled: that.enabled,
      id: that.id,
      type: type,
      key: that.key
    }).subscribe({
      next: ignored=> {
        console.log(ignored)
        window.location.href = '/#/custom/customergroup'
      },
      error: err => {
        console.error(err);
      }
    })
  }


}
