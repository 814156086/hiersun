import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-addcmt',
  templateUrl: './artadd.component.html',
  styleUrls: ['./artadd.component.css']
})
export class ArtaddComponent implements OnInit {
  formModel: FormGroup;
  heading: any;
  subCode: any;
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;
  code: any;
  cname: any;
  ccode: any;
  list = [];
  imgUrl;
  imgChange = false;
  isload = false;
  isHint = false;
  hintMsg: any;
  public formData;
  taglist = [];
  publishDate: any;
  constructor(private common: CommonService, private http: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.mycontent = ``;
    var that = this;
    this.route.queryParams.subscribe(function (data) {
      that.code = data.code;
      if (data.subCode != null) {
        that.subCode = data.subCode;
      } else {
        that.subCode = "";
      }
    })
    this.formModel = fb.group({
      heading: ['', [Validators.required]],
      subCode: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: "divarea,imagebrowser",
      forcePasteAsPlainText: true,
      filebrowserImageUploadUrl: "/api/ckeditor/upload-img",
      filebrowserUploadMethod: 'form',
      height: "450"
    };


    var that = this;
    let url = `/api/article/artClassify/desc-code?code=${that.code}`
    // console.log(url)
    this.http.get(url).subscribe(
      function (data) {
        console.log(data)
        that.cname = data['body']['name'];
        that.ccode = data['body']['code'];
      }
    )


    let url2 = `/api/article/artSubClassify/list?code=${that.code}`
    this.http.get(url2).subscribe(
      function (data) {
        that.list = data['body']

      }
    )
    let url3 = `/api/article/artTag/tag-list`;
    this.http.get(url3).subscribe(
      function (data) {
        that.taglist = data['body']
      }
    )
    if (that.subCode != null && that.subCode != '') {
      $("#subCode").attr("disabled", true);
    }
  }


  imgadd(event) {
    if (event.target.files.length > 0) {
      $(".imgbox").show();
      let file = event.target.files[0];
      let filename = event.target.files[0].name;
      this.imgUrl = window.URL.createObjectURL(file);
      $('.imgbox img').attr('src', this.imgUrl).show();
      this.imgChange = true;
      this.formData = new FormData();
      this.formData.append('file', file)
      this.formData.append('fileName', filename);
    }
  }
  add() {
    let that = this;
    var url = '/api/article/artContent/upload-img';
    if (that.imgChange) {
      that.isload = true;
      this.http.post(url, this.formData).subscribe(function (data) {
        //console.log(data)
        that.isload = false;
        if (data['header'].code == 200) {
          that.imgUrl = data['body'];
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.goback();
          }, 1500)
        } else {
          that.isHint = true;
          that.hintMsg = '图片上传失败';
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      })
    } else {
      that.subarticle();
    }
  }
  subarticle() {
    let that = this;
    let obj = {
      "heading": $('#heading').val(),
      "subHeading": $('#subHeading').val(),
      "synopsis": $('#synopsis').val(),
      "code": that.code,
      "subCode": $('#subCode').val(),
      "tagCode": $("#selectTag").val(),
      "artNum": $('#artNum').val(),
      "photoPath": that.imgUrl,
      "content": that.mycontent,
      "publishDate": new Date(that.publishDate),
    }

    let suburl = `/api/article/artContent/save-or-update`
    this.http.post(suburl, obj).subscribe(
      function (data) {
        // console.log(data)
        if (data['header'].code == 200) {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
            that.common.goback();
          }, 1500)
        } else {
          that.isHint = true;
          that.hintMsg = data['header'].desc;
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500)
        }
      }, function (err) {
        console.log(err)
      })
  }
  goback() {
    this.common.goback();
  }
  ngAfterViewInit() {
    this.ckeditor.instance.on('key', (event) => {

    });
  }

  /**
   * 当内容发生改变时 富文本
   * @param $event
   */
  onChange($event: any): void {
  }

  onChangetime(result: Date): void {
    // console.log('Selected Time: ', result);


  }

  onOk(result: Date): void {
    // console.log('onOk', result);
    this.publishDate = result
    //console.log(this.publishDate);

  }


}
