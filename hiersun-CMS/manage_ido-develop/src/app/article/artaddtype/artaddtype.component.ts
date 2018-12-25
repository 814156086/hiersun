import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import { log } from 'util';
declare var $: any;

@Component({
  selector: 'app-addf',
  templateUrl: './artaddtype.component.html',
  styleUrls: ['./artaddtype.component.css']
})

export class ArtaddtypeComponent implements OnInit {
  formModel: FormGroup;
  serialNumber: any;
  name: any;
  code: any;
  isHint = false;
  hintMsg: any;
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      serialNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    })
  }

  ngOnInit() {

  }

  edit() {
    let that = this;
    let url1 = `/api/article/artClassify/check-code?code=` + $('#code').val();
    this.http.get(url1).subscribe(
      function (data) {
        if (data['header'].code == 200) {
          console.log(data['body'])
          if (data['body'] == true) {
            that.isHint = true;
            that.hintMsg = data['header'].desc;
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          } else {
            that.addClassfiy();
          }
        }
      }, function (err) {
        console.log(err)
      }
    )
  }
  addClassfiy() {
    let that = this;
    let obj = {
      "code": $('#code').val(),
      // "id": this.id,
      "name": $('#name').val(),
      "serialNumber": $('#serialNumber').val(),
    }
    let url = `/api/article/artClassify/save-or-update`;
    this.http.post(url, obj).subscribe(
      function (data) {
        if (data['header'].code == 200) {
          that.isHint = true;
          that.hintMsg = "添加成功";
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.goback();
          }, 1500)
        } else {

        }
      }
    )
  }
  goback() {
    this.common.goback();
  }
}
