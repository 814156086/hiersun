	// var aa;
	// window.addEventListener('popstate', function () {
	//   var currentUrl010 = decodeURI(window.location.href); //获取当前链接
	//   var arr010 = currentUrl010.split("?");
	//   if (arr010[1] != parseInt($('#dang').text())) {
	//     $('#tiao').val(arr010[1]);
	//     setTimeout(function () {
	//       $("#zhuan").click()
	//     }, 10);
	//   }
	// });
	// (function ($) {
	//   var ms = {
	//     init: function (obj, args) {
	//       return (function () {
	//         ms.fillHtml(obj, args);
	//         ms.bindEvent(obj, args);
	//       })();
	//     },
	//     //填充html
	//     fillHtml: function (obj, args) {
	//       return (function () {
	//         obj.empty();
	//         if (args.current > 1) {
	//           obj.append('<a href="javascript:;" style="font-size: 12px"  class="prevPage0">首页</a>');
	//         } else {
	//           obj.append('<a href="javascript:;" style="font-size: 12px;display: none" class="prevPage0">首页</a>');
	//         }
	//         //上一页
	//         if (args.current > 1) {
	//           obj.append('<a href="javascript:;" style="font-size: 12px" class="prevPage">上一页</a>');
	//         } else {
	//           obj.remove('.prevPage');
	//           obj.append('<span class="disabled">上一页</span>');
	//         }
	//         //中间页码
	//         if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
	//           obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
	//         }
	//         if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
	//           obj.append('<span>...</span>');
	//         }
	//         var start = args.current - 2,
	//           end = args.current + 2;
	//         if ((start > 1 && args.current < 4) || args.current == 1) {
	//           end++;
	//         }
	//         if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
	//           start--;
	//         }
	//         for (; start <= end; start++) {
	//           if (start <= args.pageCount && start >= 1) {
	//             if (start != args.current) {
	//               obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
	//             } else {
	//               obj.append('<span class="current">' + start + '</span>');
	//             }
	//           }
	//         }
	//         if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
	//           obj.append('<span>...</span>');
	//         }
	//         if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
	//           obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
	//         }
	//         //下一页
	//         if (args.current < args.pageCount) {
	//           obj.append('<a href="javascript:;" style="font-size: 12px" class="nextPage">下一页</a>');
	//         } else {
	//           obj.remove('.nextPage');
	//           obj.append('<span class="disabled">下一页</span>');
	//         }
	//         if (args.current < args.pageCount) {
	//           obj.append('<a href="javascript:;" style="font-size: 12px"  class="prevPage1">尾页</a>');
	//         } else {
	//           obj.append('<a href="javascript:;" style="font-size: 12px;display: none" class="prevPage1">尾页</a>');
	//         }
	//       })();
	//     },
	//     //绑定事件
	//     bindEvent: function (obj, args) {
	//       return (function () {
	//         obj.on("click", "a.tcdNumber", function () {
	//           var current = parseInt($(this).text());
	//           aa = current;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           ms.fillHtml(obj, {
	//             "current": current,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current);
	//           }
	//         });
	//         //首页
	//         obj.on("click", "a.prevPage0", function () {
	//           var current = 1;
	//           aa = current;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           ms.fillHtml(obj, {
	//             "current": current,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current);
	//           }
	//         });
	//         //上一页
	//         obj.on("click", "a.prevPage", function () {
	//           var current = parseInt(obj.children("span.current").text());
	//           aa = current - 1;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           bian(aa);
	//           ms.fillHtml(obj, {
	//             "current": current - 1,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current - 1);
	//           }
	//         });
	//         //下一页
	//         obj.on("click", "a.nextPage", function () {
	//           var current = parseInt(obj.children("span.current").text());
	//           aa = current + 1;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           ms.fillHtml(obj, {
	//             "current": current + 1,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current + 1);
	//           }
	//         });
	//         //末页
	//         obj.on("click", "a.prevPage1", function () {
	//           var current = ye;
	//           aa = current;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           ms.fillHtml(obj, {
	//             "current": current,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current);
	//           }
	//         });
	//         //跳转
	//         $("#zhuan").click(function () {
	//           var tiao = "";
	//           tiao = $('#tiao').val();
	//           if ($('#tiao').val() > ye) {
	//             tiao = ye;
	//             $('#tiao').val(ye);
	//           } else if ($('#tiao').val() < 1) {
	//             tiao = 1;
	//             $('#tiao').val("1");
	//           } else {
	//             tiao = tiao;
	//           }
	//           $(".current").remove('.current');
	//           obj.append('<span style="display:none" href="javascript:;" class="current">' + tiao + '</span>');
	//           var current = parseInt(obj.children("span.current").text());
	//           //console.log(current);
	//           //var current=tiao;
	//           aa = current;
	//           $('#dang').text(aa);
	//           $('#tiao').val(aa)
	//           //console.log(aa);
	//           ms.fillHtml(obj, {
	//             "current": current,
	//             "pageCount": args.pageCount
	//           });
	//           if (typeof (args.backFn) == "function") {
	//             args.backFn(current);
	//           }
	//         })
	//       })();
	//     }
	//   }
	//   $.fn.createPage = function (options) {
	//     var args = $.extend({
	//       pageCount: 10,
	//       current: 1,
	//       backFn: function () {}
	//     }, options);
	//     ms.init(this, args);
	//   }
	// })(jQuery);

!function(a){var e=function(b,c){this.ele=b,this.defaults={currentPage:1,totalPage:10,isShow:!0,count:5,homePageText:"首页",endPageText:"尾页",prevPageText:"上一页",nextPageText:"下一页",callback:function(){}},this.opts=a.extend({},this.defaults,c),this.current=this.opts.currentPage,this.total=this.opts.totalPage,this.init()};e.prototype={init:function(){this.render(),this.eventBind()},render:function(){var a=this.opts,b=this.current,c=this.total,d=this.getPagesTpl(),e=this.ele.empty();this.isRender=!0,this.homePage='<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="1">'+a.homePageText+"</a>",this.prevPage='<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+(b-1)+'">'+a.prevPageText+"</a>",this.nextPage='<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+(b+1)+'">'+a.nextPageText+"</a>",this.endPage='<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+c+'">'+a.endPageText+"</a>",this.checkPage(),this.isRender&&e.html("<div class='ui-pagination-container'>"+this.homePage+this.prevPage+d+this.nextPage+this.endPage+"</div>")},checkPage:function(){var a=this.opts,b=this.total,c=this.current;a.isShow||(this.homePage=this.endPage=""),1===c&&(this.homePage=this.prevPage=""),c===b&&(this.endPage=this.nextPage=""),1===b&&(this.homePage=this.prevPage=this.endPage=this.nextPage=""),1>=b&&(this.isRender=!1)},getPagesTpl:function(){var f,g,h,i,j,k,a=this.opts,b=this.total,c=this.current,d="",e=a.count;if(e>=b)for(k=1;b>=k;k++)d+=k===c?'<a href="javascript:void(0);" class="ui-pagination-page-item active" data-current="'+k+'">'+k+"</a>":'<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+k+'">'+k+"</a>";else if(f=e/2,f>=c)for(k=1;e>=k;k++)d+=k===c?'<a href="javascript:void(0);" class="ui-pagination-page-item active" data-current="'+k+'">'+k+"</a>":'<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+k+'">'+k+"</a>";else for(g=Math.floor(f),h=c+g,i=c-g,j=0==e%2,h>b&&(j?(i-=h-b-1,h=b+1):(i-=h-b,h=b)),j||h++,k=i;h>k;k++)d+=k===c?'<a href="javascript:void(0);" class="ui-pagination-page-item active" data-current="'+k+'">'+k+"</a>":'<a href="javascript:void(0);" class="ui-pagination-page-item" data-current="'+k+'">'+k+"</a>";return d+'<input type="text" style="height:20px;width:50px;margin-top: -4px" placeholder="页码" /><a class="ui-pagination-page-btn" href="javascript:void(0);">跳转</a>'},setPage:function(a,b){return a===this.current&&b===this.total?this.ele:(this.current=a,this.total=b,this.render(),this.ele)},getPage:function(){return{current:this.current,total:this.total}},eventBind:function(){var b=this.total,c=this,d=this.opts.callback;this.ele.off("click").on("click",".ui-pagination-page-item",function(){var b=a(this).data("current");c.current!=b&&(c.current=b,c.render(),d&&"function"==typeof d&&d(b))}).on("click",".ui-pagination-page-btn",function(){var e=parseInt(a(this)[0].parentNode.getElementsByTagName("input")[0].value);e&&"NaN"!=e&&e>0&&c.current!=e&&b>=e&&(c.current=e,c.render(),d&&"function"==typeof d&&d(e))})}},a.fn.pagination=function(a,b,c){if("object"==typeof a){var d=new e(this,a);this.data("pagination",d)}return"string"==typeof a?this.data("pagination")[a](b,c):this}}(jQuery,window,document);
