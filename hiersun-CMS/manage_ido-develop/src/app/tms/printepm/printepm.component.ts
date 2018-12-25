import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any;


@Component({
  selector: 'app-printepm',
  templateUrl: './printepm.component.html',
  styleUrls: ['./printepm.component.css']
})
export class PrintepmComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // let bdhtml = window.document.body.innerHTML;
    // let sprnstr = "<!--startprint-->";
    // let eprnstr = "<!--endprint-->";
    // let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
    // let prnhtml1 = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
    // window.document.body.innerHTML = prnhtml1;
    // window.print();
  }

}
