import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  public isload: any;
  public list: any;
  public isHint: any;
  public hintMsg: any;
  public headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // this.initMenu();
    $('.page-sidebar-menu li').click(function () {
      $(this).parents('li').addClass('open');
      $(this).addClass('open');
      $(this).parents('li').siblings('li').removeClass('active open');
      $(this).siblings('li').find("li").removeClass('active open');
      $(this).siblings('li').find(".sub-menu").hide();
      $(this).siblings('li').removeClass('active open');
    });
  }

  initMenu() {
    // this.menuClass();
    const that = this;
    this.http.get('/auth/userInfo/user-resources').subscribe(
      function (data) {
        if (data['code'] === 200) {
          that.menuSegmentList(data['data'], $('.page-sidebar-menu'));
        } else {
          that.isHint = true;
          that.hintMsg = data['desc'];
          setTimeout(function () {
            that.isHint = false;
            that.hintMsg = '';
          }, 1500);
        }
      }
    );
  }
  menuSegmentList(children: Array<object>, parent: object) {
    if (children && children.length > 0) {
      children.forEach(node => {
        this.menuSegment(node, parent);
      });
    }
  }

  menuSegment(node: object, parent: object) {
    if (node) {
      const resource = node['resource'];
      const liE = $('<li class="start"></li>');
      const aE = $('<a href="' + (resource ? resource : 'javascript:;') + '"></a>');
      aE.append($('<i class="' + node['icon'] + '"></i>'));
      aE.append($('<span class="title">' + node['name'] + '</span>'));
      liE.append(aE);
      if (node['children'] && node['children'].length > 0) {
        aE.append('<span class="arrow"></span>');
        const subMenuUl = $('<ul class="sub-menu"></ul>');
        this.menuSegmentList(node['children'], subMenuUl);
        liE.append(subMenuUl);
      }
      $(parent).append(liE);
    }
  }
}
