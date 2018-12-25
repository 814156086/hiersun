import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";

declare var $: any;

@Component({
  selector: 'app-updatecustomid',
  templateUrl: './updatecustomid.component.html',
  styleUrls: ['./updatecustomid.component.css']
})
export class UpdatecustomidComponent implements OnInit {
  public formModel: FormGroup;
  public procedure = 0;
  public addlist = 0;
  public appztree : any;
  public selectList = [];
  public roleList = [];
  public storeselect = [];
  public addstoreList = [];
  public addbrandList = [];
  public brandselect = [];
  public addchannelList = [];
  public channelselect = [];
  public warning = true;
  public uid = '';
  public sex = '';
  public id = '';
  public group = '';
  public enabled = '';
  public synStatus = '';
  public industryList = [];
  public roleKeys = [];
  public newgroupList = [];
  appsetting = {
        data: {
        simpleData: {
            enable: true
        }
        },
        callback: {
        onClick: this.appClick
        }
    };

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, fb: FormBuilder) {
    this.formModel = fb.group({
      customclass: ['', [Validators.required]],
      customcode: ['', [Validators.required]]
    })
  }
  appClick(event, treeId, treeNode) {
      let obj = JSON.stringify(treeNode);
      $('input[name="appmsg"]').val(obj);
      $('.appclick').click();
  }

  ngOnInit() {
    const that =this;
    this.customLoad();
    this.apptree();
    this.loadSourceList();
    this.choosebranch();
    this.loadStoreList();
    this.route.queryParams.subscribe(params => {
      if(params.roal == 1){
        that.addlist = 1;
        that.industryList = params.industryList
        that.roleKeys = params.roleKeys
        console.log(that.industryList)
        that.uid = params.uid
        that.sex = params.sex
        that.id = params.id
        // that.group = params.group
        that.enabled = params.enabled
        that.synStatus = params.synStatus
        $('#username').val(params.username)
        $('#name').val(params.name)
        $('#password').val(params.password)
        $('#confirm_password').val(params.password)
        $('#phone_number').val(params.mobile)
        $('#email').val(params.email)
        $('#employeeid').val(params.id)
        // $('#state>input [value = synStatus]').attr('checked','true')
      }else if(params.roal == 2){
        
      }else {
        that.addlist = 0;
      }
      console.log(params)
    })

    // $('#time').daterangepicker({
    //   timePicker: false,
    //   timePicker12Hour: false,
    //   timePickerIncrement: 1,
    //   separator: '--',
    //   format: 'YYYY-MM-DD',
    //   locale: {
    //     applyLabel: '确定',
    //     cancelLabel: '取消',
    //     fromLabel: '开始时间',
    //     toLabel: '截止时间',
    //   }
    // });
    $('#starttime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true
    });
    
    $('#endtime').datetimepicker({
      format: "yyyy-MM-dd",
      showMeridian: false,
      autoclose: true,
      todayBtn: true
    });
  }

  customLoad() {
    const that = this;
    let url = '/customer/auth/keFu/group-list'
    this.httpClient.get(url).subscribe({
      next: ignored=>{
        that.newgroupList = ignored['data']['groupList'];
        console.log(that.newgroupList)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  //下一项
  next() {
    const that = this;
    let len = $('.tab-pane').length;
    let mail=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let phone=/^1[34578]\d{9}$/;
    if(that.procedure == 0){
      const username = $('#username').val();
      if(!username){
        $('.hint').text('用户名不能为空')
        return false;
      }
      const name = $('#name').val();
      if(!name){
        $('.hint').text('姓名不能为空')
        return false;
      }
      const password = $('#password').val();
      if(!password){
        $('.hint').text('密码不能为空')
        return false;
      }else if(password.length < 6){
        $('.hint').text('请输入大于6位数密码')
        return false;
      }
      const confirm_password = $('#confirm_password').val();
      if(!confirm_password){
        $('.hint').text('请确认您的密码')
        return false;
      }else if(confirm_password != password){
         $('.hint').text('两次密码输入不一致')
         return false;
      }
      const phone_number = $('#phone_number').val();
      // if(!phone_number){
      //   $('.hint').text('手机号码不能为空')
      //   return false;
      // }else 
      if(!phone_number && !phone.test(phone_number)){
        $('.hint').text('请输入正确的手机号')
        return false;
      }
      const email = $('#email').val();
      // if(!email){
      //   $('.hint').text('邮箱不能为空')
      //   return false;
      // }else 
      if(!email&&!mail.test(email)){
        $('.hint').text('请输入正确的邮箱')
        return false;
      }else{
        $('.hint').text('')
      }
    }else if(that.procedure == 1){
      const username = $('#username').val();
      const name = $('#name').val();
      const password = $('#password').val();
      const confirm_password = $('#confirm_password').val();
      const phone_number = $('#phone_number').val();
      const email = $('#email').val();
      const employeeid = $('#employeeid').val();
      const state = $('#state').find('input:checked').val();
      const start_time = $('#starttime').val();
      const end_time = $('#endtime').val();
      const group = $('#group').val();
      // const correlation_role = that.selectList;
      // console.log(correlation_role)
      let storeselect = '';
      let brandselect = '';
      let channelselect = '';
      let selectList = '';
      for(let i=0;i<that.selectList.length;i++){
        if(selectList){
          selectList += ',' + that.selectList[i].name
        }else{
          selectList += that.selectList[i].name
        }
      }
      for(let i=0;i<that.storeselect.length;i++){
        if(storeselect){
          storeselect += ',' + that.storeselect[i].name
        }else{
          storeselect += that.storeselect[i].name
        }
      }
      for(let i=0;i<that.brandselect.length;i++){
        if(brandselect){
          brandselect += ',' + that.brandselect[i].name
        }else{
          brandselect += that.brandselect[i].name
        }
      }
      for(let i=0;i<that.channelselect.length;i++){
        if(channelselect){
          channelselect += ',' + that.channelselect[i].name
        }else{
          channelselect += that.channelselect[i].name
        }
      }
      $('#start_time_info').text(start_time);
      $('#group_info').text(group);
      $('#end_time_info').text(end_time);
      $('#username_info').text(username);
      $('#name_info').text(name);
      $('#password_info').text(password);
      $('#confirm_password_info').text(confirm_password);
      $('#phone_number_info').text(phone_number);
      $('#email_info').text(email);
      $('#employeeid_info').text(employeeid);
      $('#state_info').text(state);
      $('#store').text(storeselect);
      $('#brand').text(brandselect);
      $('#channel').text(channelselect);
      $('#correlation_role').text(selectList);
      if($('#time').val()){
        const timestart = $('#time').val().split('--')[0];
        const timeend = $('#time').val().split('--')[1];
        $('#time_info').text(timestart + '至' + timeend);
      }
    }
    if(that.procedure < len-1){
      that.procedure += 1
    }else{

      return false;
    }
    let num = that.procedure + 1;
    let width = num * 25; 
    $('.progress-bar-success').css('width',width + '%')
    for(let i=0;i<len;i++){
      $('#xinzeng').find('li').eq(i).removeClass('active');
      $('#xinzeng').find('li').eq(that.procedure).addClass('active');
      $('#buzhou>.tab-pane').eq(i).removeClass('active');
      $('#buzhou>.tab-pane').eq(that.procedure).addClass('active');
      console.log(that.procedure)
    }
  }
  //返回上一项
  back() {
    const that = this;
    let len = $('.tab-pane').length;
    // if(that.procedure > 0){
      that.procedure -= 1;
    // }
    let num = that.procedure + 1;
    let width = num * 25; 
    $('.progress-bar-success').css('width',width + '%')
    for(let i=0;i<len;i++){
      $('#xinzeng').find('li').eq(i).removeClass('active');
      $('#xinzeng').find('li').eq(that.procedure).addClass('active');
      $('#buzhou>.tab-pane').eq(i).removeClass('active');
      $('#buzhou>.tab-pane').eq(that.procedure).addClass('active');
    }
  }

  contrast() {
    const that = this;
    let url = 'customer/auth/keFu/save-user1?'
    let id = that.id;
    if(id){
      url += 'id=' + id
    }
    let username = $('#username_info').text();
    if(username){
      url += '&username=' + username
    }
    let email = $('#email_info').text();
    if(email){
      url += '&email=' + email
    }
    let mobile = $('#phone_number_info').text();
    if(mobile){
      url += '&mobile=' + mobile
    }
    let employeeId = $('#employeeid_info').text();
    if(employeeId){
      url += '&employeeId=' + employeeId
    }
    // let state = $('#state_info').text();
    // if(state){
    //   url += '&state=' + state
    // }
    console.log(url)
    this.httpClient.get(url).subscribe({
      next: ignored => {
        console.log(ignored)
        if(ignored['code'] == 200){
          that.makesure();
        }else{
          that.isHint = true;
          that.hintMsg = ignored['desc'];
          that.warning = true;
          setTimeout(function(){
            that.isHint = false;
            that.hintMsg = '';
            that.warning = false;
          },1500)
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  submit() {
    this.contrast();
  }

  makesure() {
    const that = this;
    if(that.addlist == 0){
      let url = 'customer/auth/keFu/save-or-update'
      let username = $('#username_info').text();
      let name = $('#name_info').text();
      let password = $('#password_info').text();
      let mobile = $('#phone_number_info').text();
      let email = $('#email_info').text();
      let employeeId = $('#employeeid_info').text();
      let state = $('#state_info').text();
      let group = $('#group_info').text();
      let shopType = 11;
      let startTime = $('#start_time_info').text()  + ' 00:00:00';
      let endTime = $('#end_time_info').text() + ' 23:59:59';
      let start_time_news =new Date(startTime.substring(0,19).replace(/-/g,'/')).getTime()/1000;
      let end_time_news =new Date(endTime.substring(0,19).replace(/-/g,'/')).getTime()/1000;
      let data = {
        // startTime: startTime,
        // endTime: endTime,
        // roleKeys: that.roleKeys,
        industryList: that.industryList,
        uid: that.uid,
        sex: that.sex,
        group: group,
        id: that.id,
        enabled: state,
        // synStatus: that.synStatus,
        brandList: that.brandselect,
        channelList: that.channelselect,
        storeList: that.storeselect,
        // roleList: that.selectList,
        email: email,
        username: username,
        name: name,
        password: password,
        mobile: mobile,
        employeeId: employeeId,
        shopType: shopType,
      }
      console.log(data)
      this.httpClient.post(url,data).subscribe({
        next: ignored => {
          console.log(ignored)
          if(ignored['code']==200){
            window.location.href = 'custom/customidmanage'
          }
        },
        error: err => {
          console.log(err)
        }
      })
    }else{
      
    }
  }

  apptree() {
      let that = this;
      let url = `/api/v1/auth-manager/auth/app/valid-list`;
      this.httpClient.get(url).subscribe(function (data) {
      that.appztree = data['data']
      console.log(data)
      for (let i = 0; i < that.appztree.length; i++) {
          if (!that.appztree[i].pId) {
          that.appztree[i].open = true
          }
      }
      $.fn.zTree.init($('#appztree'), that.appsetting, that.appztree)
      })
  }
  public pageNo : any;
  appclick() {
    let that = this;
    let obj = JSON.parse($('input[name="appmsg"]').val());
    let url = `/api/v1/auth-manager/auth/role/role-list?pageNo=` + that.pageNo + '&pageSize=' + 10 + '&app=' + obj.key
    console.log(obj.key)
    this.httpClient.get(url).subscribe(function (data) {
    if (data['code'] == 200) {
        that.roleList = data['data'].list
    }
    })
  }

  public isHint = false;
  public hintMsg = '';
  addlink(){
      let that = this;
      if ($('#selectTag option:selected ').val() == '') {
      that.isHint = true;
      that.hintMsg = '请选择角色'
      setTimeout(function () {
          that.isHint = false;
          that.hintMsg = '';
      }, 1000)
      return;
      }
      this.selectList.push(
      {
          key: $('#selectTag option:selected ').val(),
          name: $('#selectTag option:selected').text(),
      }
      )
  }

  dellink(key){
    let that = this;
    $('#tbody tr .btn').on('click', function () {
    $(this).parent().parent().remove()
    })
    this.selectList.map((item, index) => {
    if (item.key == key) {
      that.selectList.splice(index, 1)
    }
    })
  }

  addstorelink(){
      let that = this;
      if($('#selectTag3 option:selected').val()==''){
      that.hintMsg='请选择门店';
      that.isHint=true;
      setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
      },1000)
      return;
      }
      this.storeselect.push(
      {
          key:$('#selectTag3 option:selected').val(),
          name:$('#selectTag3 option:selected').text()

      }
      )
  }
  delstorelink(key){
      let that = this;
      $('#tbody2 tr .btn').on('click', function(){
      $('this').parent().parent().remove()
      })
      this.storeselect.map((item,index)=>{
      if(item.key == key){
          that.storeselect.splice(index,1)
      }
      })
  }

  addbrandlink(){
      let that = this;
      if($('#selectTag4 option:selected').val()==''){
      that.hintMsg='请选择品牌';
      that.isHint=true;
      setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
      },1000)
      return;
      }
      this.brandselect.push(
      {
          key:$('#selectTag4 option:selected').val(),
          name:$('#selectTag4 option:selected').text()

      }
      )
  }
  delbrandlink(key){
      let that = this;
      $('#tbody3 tr .btn').on('click', function(){
      $('this').parent().parent().remove()
      })
      this.brandselect.map((item,index)=>{
      if(item.key == key){
          that.brandselect.splice(index,1)
      }
      })
  }

  addchannellink(){
      let that = this;
      if($('#selectTag5 option:selected').val()==''){
      that.hintMsg='请选择渠道';
      that.isHint=true;
      setTimeout(function(){
          that.hintMsg='';
          that.isHint=false;
      },1000)
      return;
      }
      this.channelselect.push(
      {
          key:$('#selectTag5 option:selected').val(),
          name:$('#selectTag5 option:selected').text()

      }
      )
  }
  delchannellink(key){
      let that = this;
      $('#tbody4 tr .btn').on('click', function(){
      $('this').parent().parent().remove()
      })
      this.channelselect.map((item,index)=>{
      if(item.key == key){
          that.channelselect.splice(index,1)
      }
      })
  }

  loadSourceList() {
    let that = this;
    let url = '/pcm-inner/channels';
    this.httpClient.get(url).subscribe({
      next: ignored => {
        that.addchannelList = ignored['data'];
      }
    })
  }

  choosebranch() {
    let that = this;
    var brandurl = '/pcm-inner/brands'
    this.httpClient.get(brandurl).subscribe({
      next: ignored => {
        that.addbrandList = ignored['data'];
      }
    })
  }

  loadStoreList() {
    const that = this;
    // const url = '/pcm-admin/stores/all?organizationCode=' + '' + '&storeType=1';
    const url = '/pcm-inner/org/findstorelist';
    this.httpClient.get(url).subscribe({
      next: ignored =>{
        that.addstoreList = ignored['data'];
      }
    })
  }










}

