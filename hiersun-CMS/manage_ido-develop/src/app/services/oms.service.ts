import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OmsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' })
  };
  constructor(private httpclient: HttpClient) { }
get(){
  return 123
}
  getCodeInfo(typeValue){
    var postdata;
    var codeUrl = "/oms-admin/dict/selectCodelist";
    var codeParams = {
      "typeValue": typeValue
    }
    this.httpclient.post(codeUrl, codeParams, this.httpOptions).subscribe(
      res => {
        if (res['code'] == 200) {
           postdata=res['data'];
          console.log(postdata,2);
          // return postdata;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      });
      return postdata
  }

  getifreamUrl(type){
    var url = "http://192.168.4.117:8300/editor_source/editor/index.html#";
    //var url = "http://192.168.30.36:8300/editor_source/editor/index.html#";
    return type =="editor" ? url+"/editor/" :url+"/processes/";
  }
}
