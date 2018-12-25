import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})
export class AddcustomerComponent implements OnInit {
  public isHint = false;
  public warning = false;
  public hintMsg = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
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
    let url = '/customer/auth/keFuGroup/save-or-update';
    console.log(url)
    this.httpClient.post(url,{
      type: type,
      key: name
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
