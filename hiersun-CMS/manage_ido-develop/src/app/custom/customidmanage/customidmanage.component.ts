import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-customidmanage',
  templateUrl: './customidmanage.component.html',
  styleUrls: ['./customidmanage.component.css']
})
export class CustomidmanageComponent implements OnInit {
  public customerList = [];
  public customerListRight = [];
  public isHint = false;
  public hintMsg = '';
  public warning = false;
  public currentShowType : any;
  // public currentShowType = 1;
  public grouplList = [];
  public grouprList = [];
  public noGroupLeaderl = false;
  public noGroupLeaderr = false;
  public ri: any;
  public li: any;
  public group = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    const that = this;
    this.customLoad();
    $('#promote').on('hidden.bs.modal', function () {
      $('#groupl').val('');
      $('#groupr').val('');
      that.grouplList = [];
      that.grouprList = [];
      that.noGroupLeaderl = false;
      that.noGroupLeaderr = false;
      that.customLoad()
    });
    $('#adjust').on('hidden.bs.modal', function () {
      $('#adjust_groupl').val('');
      $('#adjust_groupr').val('');
      that.grouplList = [];
      that.grouprList = [];
      that.noGroupLeaderl = false;
      that.noGroupLeaderr = false;
      that.customLoad()
    });
    $("#list_right").bind('DOMNodeInserted', function(e) {
      let btn = $('#list_right').children('span').length-1;
      // if(that.billTypeList.length == $('#btnbox').children('input').length){
        $('#list_right span').each(function(i){
          $(this).bind('click',function(){
            that.group = true;
            let i = $(this).index();
            that.ri = i;
            // $('#list_right span').removeClass('active');
            // $('#list_right').find('span').eq($(this).index).addClass()
            $('#list_right span').removeClass('active');
            $('#list_right').find("span").eq(i).addClass('active');
            if($('#list_right').find('input').eq(i).val().split(':')[0]==11){
              that.noGroupLeaderr = false;
            }else{
              that.noGroupLeaderr = true;
            }
          })
        })
      // }
    });
    $("#list_left").bind('DOMNodeInserted', function(e) {
      let btn = $('#list_left').children('span').length-1;
      // if(that.billTypeList.length == $('#btnbox').children('input').length){
        $('#list_left span').each(function(i){
          $(this).bind('click',function(){
            that.group = true;
            let i = $(this).index();
            that.li = i;
            // $('#list_left span').removeClass('active');
            // $('#list_left').find('span').eq($(this).index).addClass()
            $('#list_left span').removeClass('active');
            $('#list_left').find("span").eq(i).addClass('active');
            if($('#list_left').find('input').eq(i).val().split(':')[0]==11){
              that.noGroupLeaderl = false;
            }else{
              that.noGroupLeaderl = true;
            }
          })
        })
      // }
    });
    $("#adjust_list_right").bind('DOMNodeInserted', function(e) {
      let btn = $('#adjust_list_right').children('span').length-1;
      $('#adjust_list_right span').each(function(i){
        $(this).bind('click',function(){
          that.group = true;
          let i = $(this).index();
          that.ri = i;
          $('#adjust_list_right span').removeClass('active');
          $('#adjust_list_right').find("span").eq(i).addClass('active');
          if($('#adjust_list_right').find('input').eq(i).val().split(':')[0]==11){
            that.noGroupLeaderr = false;
          }else{
            that.noGroupLeaderr = true;
          }
        })
      })
    });
    $("#adjust_list_left").bind('DOMNodeInserted', function(e) {
      let btn = $('#adjust_list_left').children('span').length-1;
      $('#adjust_list_left span').each(function(i){
        $(this).bind('click',function(){
          that.group = true;
          let i = $(this).index();
          that.li = i;
          $('#adjust_list_left span').removeClass('active');
          $('#adjust_list_left').find("span").eq(i).addClass('active');
          if($('#adjust_list_left').find('input').eq(i).val().split(':')[0]==11){
            that.noGroupLeaderl = false;
          }else{
            that.noGroupLeaderl = true;
          }
        })
      })
    });
  }

  customLoad() {
    const that = this;
    let url = '/customer/auth/keFu/group-list'
    this.httpClient.get(url).subscribe({
      next: ignored=>{
        that.customerList = ignored['data']['groupList'];
        console.log(that.customerList)
        that.customerListRight = ignored['data']['groupList'];
        that.currentShowType = ignored['data'].currentShowType
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getKeFulList(group) {
    const that = this;
    let url = '/customer/auth/keFu/keFu-list?group=' + group + '&showType=' + '';
    this.httpClient.get(url).subscribe({
      next: ignored => {
        console.log(ignored)
        that.grouplList = ignored['data']
      }
    })
  }
  getKeFulrList(group) {
    const that = this;
    let url = '/customer/auth/keFu/keFu-list?group=' + group + '&showType=' + '';
    this.httpClient.get(url).subscribe({
      next: ignored => {
        console.log(ignored)
        that.grouprList = ignored['data']
      }
    })
  }

  promoteShow() {
    const that = this;
    $('#promote').modal('show');
    $('#groupl').on('change',function(){
      // that.customLoad();
      that.customerListRight = [];
      // that.grouplList = [];
      that.grouprList = [];
      let groupl = $('#groupl').val();
      that.getKeFulList(groupl)
      for(let i=0;i<that.customerList.length;i++){
        if(groupl == that.customerList[i]['group']){
        // that.grouplList = that.customerList[i]['keFuList'];
        //   console.log(that.grouplList)
        //   console.log(that.customerList[i]['keFuList'])
        //   console.log(that.customerList[i].keFuLeader)
        //   that.grouplList.push(that.customerList[i].keFuLeader)
          // that.customerListRight = that.customerList.splice(i,1)
        }else 
        if(!groupl){
          that.grouplList = [];
        }else {
          that.customerListRight.push(that.customerList[i])
        }
      }
    })
    $('#groupr').on('change',function(){
      // that.customLoad();
      // that.grouprList = [];
      let groupr = $('#groupr').val();
      that.getKeFulrList(groupr)
      // for(let i=0;i<that.customerListRight.length;i++){
      //   if(groupr == that.customerListRight[i]['group']){
      //     that.grouprList = that.customerListRight[i]['keFuList'];
      //     that.grouprList.push(that.customerListRight[i].keFuLeader)
      //     // that.customerListRight = that.customerList.splice(i,1)
      //   }else 
      if(!groupr){
          that.grouprList = [];
        }
      // }
    })
  }

  changeGroup(num) {
    const that = this;
    if(that.group == false){
      return false;
    }
    let number = num;
    if(number == 1){
      let left_name = $('#list_left').find('span').eq(that.li).text();
      for(let i=0;i<that.grouplList.length;i++){
        if(left_name == that.grouplList[i].name){
          if(that.grouplList[i].shopType = 11){
            for(let j=0;j<that.grouprList.length;j++){
              if(that.grouprList[j].shopType == 11){
                that.grouprList[j].shopType = 111;
                that.grouprList.push(that.grouplList[i]);
                that.grouplList.splice(i,1);
                return false;
              }else{
                that.grouprList.push(that.grouplList[i]);
                that.grouplList.splice(i,1);
                return false;
              }
            }
          }else{
            that.grouprList.push(that.grouplList[i]);
            that.grouplList.splice(i,1);
            return false;
          }
        }
      }
    }
    if(number == 2){
      let right_name = $('#list_right').find('span').eq(that.ri).text();
      for(let i=0;i<that.grouprList.length;i++){
        if(right_name == that.grouprList[i].name){
          if(that.grouprList[i].shopType = 11){
            for(let j=0;j<that.grouplList.length;j++){
              if(that.grouplList[j].shopType == 11){
                that.grouplList[j].shopType = 111;
                that.grouplList.push(that.grouprList[i]);
                that.grouprList.splice(i,1);
                return false;
              }else{
                that.grouplList.push(that.grouprList[i]);
                that.grouprList.splice(i,1);
                return false;
              }
            }
          }else{
            that.grouplList.push(that.grouprList[i]);
            that.grouprList.splice(i,1);
            return false;
          }
        }
      }
    }



    // let l = $('#list_left .active').text();
    // let r = $('#list_right .active').text();
    // let il = $('#list_left').find('input').eq(this.i).val();
    // let ir = $('#list_right').find('input').eq(this.i).val();
    // let spanl = $('<span style="width: 100%;display: block;height: 30px;line-height: 30px;text-align: center">' + l + '</span>')
    // let spanr = $('<span style="width: 100%;display: block;height: 30px;line-height: 30px;text-align: center">' + r + '</span>')
    // let inputl = $('<input type="hidden" value="'+ il +'">')
    // let inputr = $('<input type="hidden" value="'+ ir +'">')
    // if(number == 1){
    //   $('#list_left .active').remove()
    //   $('#list_left').find('input').eq(this.i).remove();
    //   $('#list_right').prepend(spanl);
    //   $('#list_right').append(inputl);
    // }else if(number == 2) {
    //   $('#list_right .active').remove()
    //   $('#list_right').find('input').eq(this.i).remove();
    //   $('#list_left').append(spanr)
    //   $('#list_left').append(inputr);
    // }
    that.group = false;
  }

  // changeColor(n,i) {
    //   const that = this;
    //   that.i = i;
    //   if(n==1){
    //     $('#list_left span').removeClass('active');
    //     $('#list_left').find("span").eq(i).addClass('active');
    //     if($('#list_left').find('input').eq(i).val().split(':')[0]==11){
    //       that.noGroupLeader = false;
    //     }else{
    //       that.noGroupLeader = true;
    //     }
    //   }else{
    //     $('#list_right span').removeClass('active');
    //     $('#list_right').find("span").eq(i).addClass('active');
    //     if($('#list_right').find('input').eq(i).val().split(':')[0]==11){
    //       that.noGroupLeader = false;
    //     }else{
    //       that.noGroupLeader = true;
    //     }
    //   }
  // }

  makesure() {
    let url = '/customer/auth/keFu/keFu-promotion';
    let group1 = $('#groupl').val();
    let group2 = $('#groupr').val();
    let keFuList1 = [];
    let keFuList2 = [];
    let lenLeft = $('#list_left').find('span').length;
    let lenRight = $('#list_right').find('span').length;
    for(let i=0;i<lenLeft;i++){
      let Obj = new Object();
      let shopType = $('#list_left').find('input').eq(i).val().split(':')[0];
      let uid = $('#list_left').find('input').eq(i).val().split(':')[1];
      Obj['shopType'] = shopType,
      Obj['uid'] = uid,
      keFuList1.push(Obj)
    }
    for(let i=0;i<lenRight;i++){
      let Obj = new Object();
      let shopType = $('#list_right').find('input').eq(i).val().split(':')[0];
      let uid = $('#list_right').find('input').eq(i).val().split(':')[1];
      Obj['shopType'] = shopType,
      Obj['uid'] = uid,
      keFuList2.push(Obj)
    }
    let keFuView  = {
      group1: group1,
      group2: group2,
      keFuList1: keFuList1,
      keFuList2: keFuList2
    }
    console.log(keFuView)
    // this.httpClient.post(url, keFuView).subscribe({
    //   next: ignored => {
    //     console.log(ignored)
    //   },
    //   error: err => {
    //     console.log(err)
    //   }
    // })
  }

  adjustshow() {
    const that = this;
    $('#adjust').modal('show');
    $('#adjust_groupl').on('change',function(){
      // that.customLoad();
      that.customerListRight = [];
      that.grouprList = [];
      let groupl = $('#adjust_groupl').val();
      that.getKeFulList(groupl)
      for(let i=0;i<that.customerList.length;i++){
        if(groupl == that.customerList[i]['group']){
        }else 
        if(!groupl){
          that.grouplList = [];
        }else {
          that.customerListRight.push(that.customerList[i])
        }
      }
    })
    $('#adjust_groupr').on('change',function(){
      // that.customLoad();
      // that.grouprList = [];
      let groupr = $('#adjust_groupr').val();
      that.getKeFulrList(groupr)
      // for(let i=0;i<that.customerListRight.length;i++){
      //   if(groupr == that.customerListRight[i]['group']){
      //     that.grouprList = that.customerListRight[i]['keFuList'];
      //     that.grouprList.push(that.customerListRight[i].keFuLeader)
      //     // that.customerListRight = that.customerList.splice(i,1)
      //   }else 
      if(!groupr){
          that.grouprList = [];
        }
      // }
    })
  }

  adjust(num) {
    const that = this;
    if(that.group == false){
      return false;
    }
    let number = num;
    if(number == 1){
      let left_name = $('#adjust_list_left').find('span').eq(that.li).text();
      for(let i=0;i<that.grouplList.length;i++){
        if(left_name == that.grouplList[i].name){
          if(that.grouplList[i].shopType = 11){
            for(let j=0;j<that.grouprList.length;j++){
              if(that.grouprList[j].shopType == 11){
                that.grouprList[j].shopType = 111;
                that.grouprList.push(that.grouplList[i]);
                that.grouplList.splice(i,1);
                return false;
              }else{
                that.grouprList.push(that.grouplList[i]);
                that.grouplList.splice(i,1);
                return false;
              }
            }
          }else{
            that.grouprList.push(that.grouplList[i]);
            that.grouplList.splice(i,1);
            return false;
          }
        }
      }
    }
    if(number == 2){
      let right_name = $('#adjust_list_right').find('span').eq(that.ri).text();
      for(let i=0;i<that.grouprList.length;i++){
        if(right_name == that.grouprList[i].name){
          if(that.grouprList[i].shopType = 11){
            for(let j=0;j<that.grouplList.length;j++){
              if(that.grouplList[j].shopType == 11){
                that.grouplList[j].shopType = 111;
                that.grouplList.push(that.grouprList[i]);
                that.grouprList.splice(i,1);
                return false;
              }else{
                that.grouplList.push(that.grouprList[i]);
                that.grouprList.splice(i,1);
                return false;
              }
            }
          }else{
            that.grouplList.push(that.grouprList[i]);
            that.grouprList.splice(i,1);
            return false;
          }
        }
      }
    }
    that.group = false;
  }

  adjustsure() {
    let url = '/customer/auth/keFu/keFu-trim';
    let group1 = $('#adjust_groupl').val();
    let group2 = $('#adjust_groupr').val();
    let keFuList1 = [];
    let keFuList2 = [];
    let lenLeft = $('#adjust_list_left').find('span').length;
    let lenRight = $('#adjust_list_right').find('span').length;
    for(let i=0;i<lenLeft;i++){
      let Obj = new Object();
      let shopType = $('#adjust_list_left').find('input').eq(i).val().split(':')[0];
      let uid = $('#adjust_list_left').find('input').eq(i).val().split(':')[1];
      Obj['shopType'] = shopType,
      Obj['uid'] = uid,
      keFuList1.push(Obj)
    }
    for(let i=0;i<lenRight;i++){
      let Obj = new Object();
      let shopType = $('#adjust_list_right').find('input').eq(i).val().split(':')[0];
      let uid = $('#adjust_list_right').find('input').eq(i).val().split(':')[1];
      Obj['shopType'] = shopType,
      Obj['uid'] = uid,
      keFuList2.push(Obj)
    }
    let keFuView  = {
      group1: group1,
      group2: group2,
      keFuList1: keFuList1,
      keFuList2: keFuList2
    }
    console.log(keFuView)
    this.httpClient.post(url, keFuView).subscribe({
      next: ignored => {
        console.log(ignored)
      },
      error: err => {
        console.log(err)
      }
    })
  }
  submit() {
    
  }
  variation(uid) {
    const that = this;
    for(let i=0;i<that.grouplList.length;i++) {
      if(uid == that.grouplList[i].uid && that.grouplList[i].shopType != 11) {
        for(let j=0;j<that.grouplList.length;j++){
          that.grouplList[j].shopType == 11 ? that.grouplList[j].shopType = 111 : null;
        }
        that.grouplList[i].shopType = 11;
      }else if(uid == that.grouplList[i].uid && that.grouplList[i].shopType == 11){
        that.grouplList[i].shopType = 111;
      }
    }
  }

  toChange(uid){
    const that = this;
    for(let i=0;i<that.grouprList.length;i++) {
      if(uid == that.grouprList[i].uid && that.grouprList[i].shopType != 11) {
        for(let j=0;j<that.grouprList.length;j++){
          that.grouprList[j].shopType == 11 ? that.grouprList[j].shopType = 111 : null;
        }
        that.grouprList[i].shopType = 11;
      }else if(uid == that.grouprList[i].uid && that.grouprList[i].shopType == 11){
        that.grouprList[i].shopType = 111;
      }
    }
  }

}
