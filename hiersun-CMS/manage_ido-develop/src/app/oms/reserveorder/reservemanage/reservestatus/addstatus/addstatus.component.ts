import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-addstatus',
  templateUrl: './addstatus.component.html',
  styleUrls: ['./addstatus.component.css']
})
export class AddstatusComponent implements OnInit {
  describing: any;       //状态描述
  name: any;             //状态名称
  nameone: any;          //其它渠道状态名称
  operatorid: any;       //
  sequence: any;         //状态须序号
  statusid: any;         //状态id
  btntype: any;
  btnshowhide = false;
  timeshowhide = false;
  isload = true;
  isHint = false;
  hintMsg: any;
  warning = false;
  nextpage: any;
  public formData;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  formModel: FormGroup;
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      name: ['', [Validators.required]],
      nameone: ['', [Validators.required]],
      describing: ['', [Validators.required]],
      sequence: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    let that = this;
    this.route.queryParams.subscribe(function (data) {
      console.log(data)
      that.statusid = data.id;
      that.btntype = data.type;
    })
    if (that.statusid) {//查看和编辑
      let statusdetail = '/oms-admin/reservestate/queryReserveState/' + that.statusid;
      this.http.get(statusdetail).subscribe(
        data => {
          console.log(data);
          that.isload = false;
          if (data['code'] == 200) {
            that.describing = data['data'].describing;       //状态描述
            that.name = data['data'].name;             //状态名称
            that.nameone = data['data'].nameone;          //其它渠道状态名称
            that.sequence = data['data'].sequence;         //状态须序号
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
    } else {//新添加
      that.isload = false;
    }
  }
  goback() {
    window.history.go(-1)
  }
  onSubmit() {
    let that = this;
    if (this.formModel.valid) {
      that.isload = true;
      var reserveState={};
      if(that.statusid){
        reserveState = {
          'id':that.statusid,
          'describing': that.describing,
          'name': that.name,
          'nameone': that.nameone,
          'sequence': that.sequence,
          'statusid': that.statusid
        }
      }else{
        reserveState = {
          'describing': that.describing,
          'name': that.name,
          'nameone': that.nameone,
          'sequence': that.sequence,
          'statusid': that.statusid
        }
      }
      console.log(reserveState)
      var editerurl = '/oms-admin/reservestate/createReserveState';
      this.http.post(editerurl, reserveState).subscribe(function (data) {
        console.log(data)
        if (data['code'] == 200) {
          that.isload = false;
          that.isHint = true;
          that.hintMsg = '保存成功';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.router.navigate(['oms/reservestatus']);
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
  }

}
