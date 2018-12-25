import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from '../../../services/common.service';
declare var $: any;
@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.css']
})
export class AddgroupComponent implements OnInit {
  formModel: FormGroup;
  public id: any;
  isHint = false;
  hintMsg: any;
  public name: any;
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder, private router: Router) {
    this.formModel = fb.group({
      name: ['', [Validators.required]],
    })
  }
  ngOnInit() {
  }
  // 添加
  save() {
    let that = this;
    // 列表
    let url = `/api/v1/auth-manager/auth/group/save-or-update`
    let obj = {
      "comm": $('#comm').val(),
      "enabled": $('input[name="enabled"]:checked').val(),
      "name": $('#name').val()
    }
    this.http.post(url, obj).subscribe(
      function (data) {
        if (data['code'] == 200) {
          that.isHint = true;
          that.hintMsg = '保存小组成功！';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
          that.goback();
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }
      }, function (err) {
        console.log(err);
      }
    );
  }

  // 返回上一级
  goback() {
    this.common.goback();
  }
}
