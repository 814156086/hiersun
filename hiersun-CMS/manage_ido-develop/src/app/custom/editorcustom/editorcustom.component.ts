import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-editorcustom',
  templateUrl: './editorcustom.component.html',
  styleUrls: ['./editorcustom.component.css']
})
export class EditorcustomComponent implements OnInit {
  customclass: any;  //组类型
  customcode: any;   //组编码
  customid: any;
  pageSize = 10;
  pageCount: any;//总页数
  pageNo = 1;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  businesslist = [];
  nodata = false;
  nextpage: any;
  btntype: any;
  formModel: FormGroup;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      customclass: ['', [Validators.required]],
      customcode: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      that.customid = data.id;
      that.nextpage = data.page;
      that.btntype = data.type;
    })
    if (that.customid) {
      let customlist = '/oms-admin/kefugroup/getKefuGroup/' + that.customid;
      this.http.get(customlist).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.customclass=data['data'].kefutype
            that.customcode=data['data'].code
          } else {
            that.isHint = true;
            that.hintMsg = data['desc'];
            setTimeout(function () {
              that.isHint = false;
              that.hintMsg = '';
            }, 1500)
          }
        },
        err => {
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
  onSubmit() {
    let that = this;
    var kefuGroupDto = {};
    console.log(that.btntype)
    if (that.btntype==2) {  //编辑
      kefuGroupDto = {
        "kefutype": that.customclass,
        "code": that.customcode,
        "id": that.customid
      }
    } else { //添加
      kefuGroupDto = {
        "kefutype": that.customclass,
        "code": that.customcode
      }
    }
    console.log(kefuGroupDto)
    let customlist = '/oms-admin/kefugroup/saveOrUpdateKefuGroup';
    this.http.post(customlist, kefuGroupDto).subscribe(
      data => {
        console.log(data);
        that.isload = false;
        if (data['code'] == 200) {
          that.isHint = true;
          that.hintMsg = '保存成功!';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['custom/customlist']);
          }, 1500)

        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      },
      err => {
        that.isHint = true;
        that.hintMsg = '系统异常，请稍后再试';
        setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
        }, 1500)
      }
    )
  }
  goback() {
    let that = this;
    that.router.navigateByUrl('custom/customlist?page=' + that.nextpage);
  }
}
