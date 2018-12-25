import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import { NzMessageService } from 'ng-zorro-antd';
declare var $: any;
@Component({
	selector: 'app-groupcms',
	templateUrl: './groupcms.component.html',
	styleUrls: ['./groupcms.component.css']
})
export class GroupcmsComponent implements OnInit {
	pageid: any;          //页面模板id
	ispageid=0;
	public list: any;
	public siteId: any;
	public conthtml: any;
	public id: any;
	public channelId: any;
	public pagemsg: any;
	public page: any;
	public alllinks: any;
	public yxseries: any;
	public imglist: any;
	public pageNo = 1;
	public tplList = [];
	public groupimg: any;
	public tagimg: any;
	public pageList = [1];
	public title: any;
	public keyword: any;
	public description: any;
	public previewurl: any;
	public isHint = false;
	public hintMsg: any;
	public warning = false;
	public color: any;
	public serieslists: any;
	public prolists: any;
	// isAddnew=false; // 选择系列和商品时区分显示的input框
	public msgEnglishs: any;
	public msgTitles: any;
	public imgindex: any;
	public productCode: any;
	public edtiproductcode: any;
	pageCount: any;//总页码
	newproductid = false; //区分单戒对戒
	formModel: FormGroup;
	public headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(private common: CommonService, private router: Router, private http: HttpClient, private route: ActivatedRoute, private el: ElementRef, private renderer2: Renderer2, fb: FormBuilder) {
		this.formModel = fb.group({
			msgTitle: ['', [Validators.required]],
			msgEnglish: ['', [Validators.required]]
		})
	}

	ngOnInit() {
		$("#dialog-index").dialog({ autoOpen: false });
		var fixed = '<div class="fixed" style="display:none;width: 100%;height: 100%;position: absolute;top: 0;left: 0;z-index:100;background: rgba(0,0,0,.5)">' +
			'<div class="setTpl" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 120px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >编辑</div>\n' +
			'<div class="delTpl" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 80px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >删除</div>\n' +
			'<div class="up" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 40px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >上移</div>\n' +
			'<div class="down" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 0px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >下移</div>\n' +
			'</div>'
		$("#page .here").droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper)",
			drop: function (event, ui) {
				$(this).find(".placeholder").remove();
				$("<div class='template clearfix' style='position:relative'></div>").html(ui.draggable.html() + fixed).appendTo(this);
				$(".here").find(".htmlcon").show();
				$(".template").find(".templates").show();
				$(".template").find(".tpl").remove();
				$(".template").find(".tmpname").remove();
				$(".template").find(".tmppic").remove();
			}
		}).sortable({
			items: "div.template",
			sort: function () {
				// 获取由 droppable 与 sortable 交互而加入的条目
				// 使用 connectWithSortable 可以解决这个问题，但不允许您自定义 active/hoverClass 选项
				$(this).removeClass("ui-state-default");
			}
		});
		$(window).scroll(function () {
			if ($(document).scrollTop() > $(".modelstemplate").offset().top) {
				$(".modelstemplate").addClass("leftfiexed")
			}
			if ($(document).scrollTop() < 200) {
				$(".modelstemplate").removeClass("leftfiexed")
			}
		})
		//字体大小
		$("#f-slider").slider({
			range: false,
			min: 12,
			max: 50,
			value: $("#amount").val(),
			slide: function (event, ui) {
				$("#amount").val(ui.value);
			}
		});
		$(".ui-droppable").on('mouseover', '.template', function () {
			if (!$(this).find("div").hasClass("myhtml") && !$(this).find("div").hasClass("mmyhtml")) {
				$(this).find('.fixed').show()
			}
			$('.templates').on('click', '.upTpl', function (e) {
				e.stopImmediatePropagation();
				console.log($(this).parents('.template').index())
			})
		})
		$(".ui-droppable").on('mouseout', '.template', function () {
			$(this).find('.fixed').hide()
		})
		//上移
		$(".here").on("click", ".up", function () {
			var currentindex = $(this).parents(".template");
			if (currentindex.index() != 0) {
				currentindex.prev().before(currentindex);
			} else {
				that.warning = true;
				that.isHint = true;
				that.hintMsg = "目前是第一个哦!";
				setTimeout(function () {
					that.isHint = false;
					that.hintMsg = '';
					that.warning = false;
				}, 1500)
			}
		})
		//下移
		$(".here").on("click", ".down", function () {
			var currentindex = $(this).parents(".template");
			var lastt = parseInt($(".here .template").length) - 1;
			if (parseInt(currentindex.index()) != lastt) {
				currentindex.next().after(currentindex);
			} else {
				that.warning = true;
				that.isHint = true;
				that.hintMsg = "已经是最后一个了哦!";
				setTimeout(function () {
					that.isHint = false;
					that.hintMsg = '';
					that.warning = false;
				}, 1500)
			}

		})
		//编辑
		$(".here").on("click", ".setTpl", function () {
			var html = '';
			$(this).parents(".template").find("[typeid]").each(function () {
				var typeid = $(this).attr("typeid");
				if (typeid == 1) {//如果是图片
					if ($(this).parents(".discoloration").attr("c-data") == 3) {//带小花的图文
						if ($(this).parent("a").length > 0) { //判断img的外面是否含有a标签
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 更换图片</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-5">' +
								'<label class="control-label" style="vertical-align:top">图片：</label>' +
								'<img src="' + $(this).attr("src") + '" class="slt-pic imgchoose"/>' +
								'</div>' +
								'<div class="col-md-5">' +
								'<label class="control-label" style="vertical-align:top">链接：</label>' +
								'<input type="text" class="imglink" value="' + $(this).parent("a").attr("href") + '" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
								'</div>' +
								'</div>' +
								'<div class="form-group">' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">位置：</label>' +
								'<select style="margin-top:8px;width:60%" class="series_img_position form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1">居左</option>' +
								'<option value="2">居右</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">是否含有小花图标：</label>' +
								'<select style="margin-top:8px;width:50%" class="flower form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1">是</option>' +
								'<option value="2">否</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-2">' +
								'<label class="control-label" style="vertical-align:top;float:left;">背景颜色：</label>' +
								'<span class="bgcolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:10px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("background") + '"></span>' +
								'</div>' +
								'</div>' +
								'</fieldset>'
						} else {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 更换图片</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-5">' +
								'<label class="control-label" style="vertical-align:top">图片：</label>' +
								'<img src="' + $(this).attr("src") + '" class="slt-pic imgchoose"/>' +
								'</div>' +
								'</div>' +
								'<div class="form-group">' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">位置：</label>' +
								'<select style="margin-top:8px;width:60%" class="series_img_position form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1">居左</option>' +
								'<option value="2">居右</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">是否含有小花图标：</label>' +
								'<select style="margin-top:8px;width:50%" class="flower form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1">是</option>' +
								'<option value="2">否</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-2">' +
								'<label class="control-label" style="vertical-align:top;float:left;">背景颜色：</label>' +
								'<span class="bgcolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:10px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("background") + '"></span>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						}
					} else if ($(this).parents(".template_two").attr("c-data") == 5) {
						$(".showimgpro").hide();
						$(".mlbtshow").hide();
						$(".mlbtshow").hide();
						$(".mshowimgpro").show();
					} else {
						//判断img的外面是否含有a标签
						if ($(this).parent("a").length > 0) {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 更换图片</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-10">' +
								'<label class="control-label" style="width:10%">图片：</label>' +
								'<img src="' + $(this).attr("src") + '" class="slt-pic imgchoose"/>' +
								'</div>' +
								'</div>' +
								'<div class="form-group">' +
								'<div class="col-md-10">' +
								'<label class="control-label" style="width:10%">链接：</label>' +
								'<input type="text"  style="width:72%" class="imglink" value="' + $(this).parent("a").attr("href") + '" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						} else {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 更换图片</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-10">' +
								'<label class="control-label" style="vertical-align:top">图片：</label>' +
								'<img src="' + $(this).attr("src") + '" class="slt-pic imgchoose"/>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						}
					}
				}
				else if (typeid == 2) {//如果是标题
					var fontsize = $(this).css("font-size");
					var fsize = fontsize.substring(0, fontsize.length - 2);
					//判断是否是产品展示
					if ($(this).parents(".lb-box").attr("c-data") == 2) {
						$(".showimgpro").show();
						$(".lbtshow").hide();
						$(".lbtshow2").hide();
						$(".mlbtshow").hide();
						$(".mshowimgpro").hide();
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品描述</legend>' +
							'<div class="form-group style="position:relative">' +
							'<div class="col-md-10">' +
							'<div style="float:left;" class="col-md-10"><label class="control-label" style="width:10%">描述：</label>' +
							'<input type="text" class="onetitle" style="width:90%" value="' + $(this).text() + '"/>' +
							'</div>' +
							'<span class="onecolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:6px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
							'</div>' +
							'</div>' +
							'<div class="form-group style="position:relative">' +
							'<div class="col-md-10">' +
							'<label class="control-label" style="width:10%">大小：</label>' +
							'<input type="text" style="width:71%;padding-left:1%" class="onefont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>px' +
							'</div>' +
							'<span class="fontdemo" style="margin-left:60px;position:absolute;right:10px;top:0px;">H</span>' +
							'</div>' +
							'</fieldset>';

					} else {
						$(".showimgpro").hide();
						$(".lbtshow").hide();
						$(".lbtshow2").hide();
						$(".mlbtshow").hide();
						$(".mshowimgpro").hide();
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品标题</legend>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<div style="float:left" class="col-md-10"><label class="control-label" style="width:10%">标题：</label>' +
							'<input type="text" class="onetitle" style="width:90%" value="' + $(this).text() + '"/>' +
							'</div>' +
							'<span class="onecolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:10px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
							'</div>' +
							'</div>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<label class="control-label" style="width:10%">大小：</label>' +
							'<input type="text" style="width:71%;padding-left:1%" class="onefont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>px' +
							'</div>' +
							'<span class="fontdemo" style="margin-left:60px;position:absolute;right:10px;top:0px;">H</span>' +
							'</div>' +
							'</fieldset>';
					}
				}
				else if (typeid == 3) {//如果是描述
					var fontsize = $(this).css("font-size");
					var fsize = fontsize.substring(0, fontsize.length - 2);
					//判断是否是PC轮播图
					if ($(this).parents("#box").attr("c-data") == 1) {
						$(".lbtshow").show();
						$(".lbtshow2").show();
						$(".showimgpro").hide();
						$(".mlbtshow").hide();
						$(".mshowimgpro").hide();
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品描述</legend>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<div style="float:left;" class="col-md-10"><label class="control-label" style="width:10%">描述：</label>' +
							'<input type="text" class="onetitle" style="width:90%" value="' + $(this).text() + '"/>' +
							'</div>' +
							'<span class="twocolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:6px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
							'</div>' +
							'</div>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<label class="control-label" style="width:10%">大小：</label>' +
							'<input type="text" style="width:71%;padding-left:1%" class="twofont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>px' +
							'</div>' +
							'<div class="col-md-2">' +
							'<button type="button" class="btn red delectimg">删除</button>' +
							'</div>' +
							'<span class="fontdemo" style="margin-left:60px;position:absolute;right:10px;top:0px;">H</span>' +
							'</div>' +
							'</fieldset>';
					} else {
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品描述</legend>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<div style="float:left;" class="col-md-10"><label class="control-label" style="width:10%">描述：</label>' +
							'<input type="text" class="onetitle" style="width:90%" value="' + $(this).text() + '"/>' +
							'</div>' +
							'<span class="twocolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-top:6px;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
							'</div>' +
							'</div>' +
							'<div class="form-group" style="position:relative">' +
							'<div class="col-md-10">' +
							'<label class="control-label" style="width:10%">大小：</label>' +
							'<input type="text" style="width:71%;padding-left:1%" class="twofont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>px' +
							'</div>' +
							'<span class="fontdemo" style="margin-left:60px;position:absolute;right:10px;top:0px;">H</span>' +
							'</div>' +
							'</fieldset>';
					}
				}
				else if (typeid == 4) {//是否有探索此系列
					if ($(this).css("display") == "block") {
						if ($(this).parent(".series_names").hasClass("conTemplate_right")) {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 探索此系列</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="padding-top:0;line-height:30px">探索系列：</label>' +
								'<select style="width:60%" class="series form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1" selected>显示</option>' +
								'<option value="2">隐藏</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-5">' +
								'<label class="control-label col-md-4">系列链接：</label>' +
								'<input type="text" class="serieslink form-control col-md-5" style="width:50%" value="' + $(this).attr("href") + '"/><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
								'</div>' +
								'<div class="col-md-3">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">显示位置：</label>' +
								'<select style="width:60%" class="seriesweizhi form-control">' +
								'<option value="">请选择</option>' +
								'<option value="left">居左</option>' +
								'<option value="center">居中</option>' +
								'<option value="right" selected>居右</option>' +
								'</select>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						} else if ($(this).parent(".series_names").hasClass("conTemplate_center")) {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 探索此系列</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">探索此系列：</label>' +
								'<select style="width:60%" class="series form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1" selected>显示</option>' +
								'<option value="2">隐藏</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-5">' +
								'<label class="control-label col-md-4">系列链接：</label>' +
								'<input type="text" class="serieslink form-control col-md-5" style="width:50%" value="' + $(this).attr("href") + '"/><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
								'</div>' +
								'<div class="col-md-3">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">显示位置：</label>' +
								'<select style="width:60%" class="seriesweizhi form-control">' +
								'<option value="">请选择</option>' +
								'<option value="left">居左</option>' +
								'<option value="center" selected>居中</option>' +
								'<option value="right" >居右</option>' +
								'</select>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						} else {
							html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 探索此系列</legend>' +
								'<div class="form-group">' +
								'<div class="col-md-4">' +
								'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">探索此系列：</label>' +
								'<select style="margin-top:8px;width:60%" class="series form-control">' +
								'<option value="0">请选择</option>' +
								'<option value="1" selected>显示</option>' +
								'<option value="2">隐藏</option>' +
								'</select>' +
								'</div>' +
								'<div class="col-md-5">' +
								'<label class="control-label" style="vertical-align:top">系列链接：</label>' +
								'<input type="text" class="serieslink" value="' + $(this).attr("href") + '"/><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
								'</div>' +
								'<div class="col-md-3">' +
								'<label class="control-label pull-left" style="padding-top:0;line-height:30px;">显示位置：</label>' +
								'<select style="width:60%" class="seriesweizhi form-control">' +
								'<option value="">请选择</option>' +
								'<option value="left" selected>居左</option>' +
								'<option value="center" >居中</option>' +
								'<option value="right" >居右</option>' +
								'</select>' +
								'</div>' +
								'</div>' +
								'</fieldset>';
						}
					} else {
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 探索此系列</legend>' +
							'<div class="form-group">' +
							'<div class="col-md-4">' +
							'<label class="control-label pull-left" style="vertical-align:top;line-height:30px;">探索此系列：</label>' +
							'<select style="margin-top:8px;width:60%" class="series form-control">' +
							'<option value="0">请选择</option>' +
							'<option value="1">显示</option>' +
							'<option value="2" selected>隐藏</option>' +
							'</select>' +
							'</div>' +
							'<div class="col-md-5" style="display:none">' +
							'<label class="control-label" style="vertical-align:top">系列链接：</label>' +
							'<input type="text" class="serieslink"/><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
							'</div>' +
							'<div class="col-md-3">' +
							'<label class="control-label pull-left" style="padding-top:0;line-height:30px;">显示位置：</label>' +
							'<select style="width:60%" class="seriesweizhi form-control">' +
							'<option value="">请选择</option>' +
							'<option value="left">居左</option>' +
							'<option value="center">居中</option>' +
							'<option value="right">居右</option>' +
							'</select>' +
							'</div>' +
							'</div>' +
							'</fieldset>';
					}
				}
				else if (typeid == 5) {//a标签
					if ($(this).find("img").length == 0) {
						html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品链接</legend>' +
							'<div class="form-group">' +
							'<div class="col-md-10">' +
							'<label class="control-label" style="width:10%">链接：</label>' +
							'<input type="text" style="width:72%" class="imglink" value="' + $(this).attr("href") + '" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
							'</div>' +
							'</div>' +
							'</fieldset>';
					}
				}
				else if (typeid == 7) {//一个图片多个连接
					html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 产品链接</legend>' +
						'<div class="form-group">' +
						'<div class="col-md-12">' +
						'<label class="control-label col-md-2" style="vertical-align:top;line-height:30px;padding-top:0">请输入产品链接：</label>' +
						'<input type="text" class="productlink col-md-6" value="' + $(this).attr("href") + '"/><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
						'</div>' +
						'</div>' +
						'</fieldset>';
				} else if (typeid == 8) {//专属定制-小能客服
					html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 商品编码</legend>' +
						'<div class="form-group">' +
						'<div class="col-md-10">' +
						'<label class="control-label" style="width:18%;color:red">请输入商品编码：</label>' +
						'<input type="text" style="width:64%" value="' + $("#stylecodedz").val() + '" class="productcode"/>' +
						'</div>' +
						'</div>' +
						'</fieldset>';
				}
				else if (typeid == 9) {//立即购买-香水
					html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 商品编码</legend>' +
						'<div class="form-group">' +
						'<div class="col-md-10">' +
						'<label class="control-label" style="width:18%;color:red">请输入商品编码：</label>' +
						'<input type="text" style="width:64%" value="' + $("#stylecodegm").val() + '" class="productcodexs"/>' +
						'</div>' +
						'</div>' +
						'</fieldset>';
				}
				else if (typeid == 10) {//小能客服
					html += '<fieldset class="col-md-12 clearfix filedborder"><legend> 商品编码</legend>' +
						'<div class="form-group">' +
						'<div class="col-md-12" style="color:red">' +
						'此链接为小能客服' +
						'</div>' +
						'</div>' +
						'</fieldset>';
				} else if (typeid == 11) {//商品详情页面按钮的未知颜色背景设置
					html += '<fieldset class="col-md-12 clearfix filedborder"><legend>按钮样式</legend>' +
						'<div class="form-group">' +
						'<div class="col-md-12"">' +
						'<div class="col-md-4">' +
						'<span style="display:block;float:left;">按钮颜色：</span>' +
						'<span class="btnbgcolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("background") + '"></span>' +
						'</div>' +
						'<div class="col-md-4">' +
						'<span style="display:block;float:left;">按钮字体颜色：</span>' +
						'<span class="btncolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;float:left;margin-right:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
						'</div>' +
						/* '<div class="col-md-4">' +
						'<span style="display:block;float:left;">按钮位置：</span>'+
						'<select class="fontwz">' +
						'<option value="">请选择</option>' +
						'<option value="left">居左</option>' +
						'<option value="center">居中</option>' +
						'<option value="right">居右</option>' +
						'</select>'+
						'</div>'+ */
						'</div>' +
						'</div>' +
						'</fieldset>';
				}
			})
			$("#dialog-index .dialog-table").html(html);
			var that = $(this);
			$("#dialog-index").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 480,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						//描述
						$(".onetitle").each(function () {
							var hvalue = $(this).val();
							var hindex = $(".onetitle").index(this);
							that.parents(".template").find("[typeid='2']").eq(hindex).html(hvalue);

						})
						$(".onecolor").each(function () {
							var cvalue = $(this).css('background');
							var cindex = $(".onecolor").index(this);
							that.parents(".template").find("[typeid='2']").eq(cindex).css("color", cvalue)
						})
						$(".onefont").each(function () {
							var fvalue = $(this).val();
							var findex = $(".onefont").index(this);
							that.parents(".template").find("[typeid='2']").eq(findex).css("font-size", fvalue + 'px')
						})
						$(".oneweizhi").each(function () {
							var wvalue = $(this).val();
							var windex = $(".oneweizhi").index(this);
							that.parents(".template").find("[typeid='2']").eq(windex).css("text-align", wvalue)
						})
						//副
						$(".twotitle").each(function () {
							var hvalue = $(this).val();
							var hindex = $(".twotitle").index(this);
							that.parents(".template").find("[typeid='3']").eq(hindex).html(hvalue);
						})
						$(".twocolor").each(function () {
							var cvalue = $(this).css('background');
							var cindex = $(".twocolor").index(this);
							that.parents(".template").find("[typeid='3']").eq(cindex).css("color", cvalue)
						})
						$(".twofont").each(function () {
							var fvalue = $(this).val();
							var findex = $(".twofont").index(this);
							that.parents(".template").find("[typeid='3']").eq(findex).css("font-size", fvalue + 'px')
						})
						$(".twoweizhi").each(function () {
							var wvalue = $(this).val();
							var windex = $(".twoweizhi").index(this);
							that.parents(".template").find("[typeid='3']").eq(windex).css("text-align", wvalue)
						})
						//图片
						$(".slt-pic").each(function () {
							var imgvalues = $(this).attr("src");
							var imgindex = $(".slt-pic").index(this);
							that.parents(".template").find("[typeid='1']").eq(imgindex).attr("src", imgvalues)


						})
						$(".imglink").each(function () {
							var imglinkvalue = $(this).val();
							var imglinkindex = $(".imglink").index(this);
							that.parents(".template").find("[typeid='5']").eq(imglinkindex).attr("href", imglinkvalue)
						})
						//探索此系列
						if ($(".series").val() == 1) {
							that.parents(".template").find(".go_series").css("display", "block");
							that.parents(".template").find(".go_series").attr("href", $(".serieslink").val());
							if ($(".seriesweizhi").val() == "left") {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_left")
							} else if ($(".seriesweizhi").val() == "center") {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_center")
							} else {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_right")
							}
						} else {
							that.parents(".template").find(".go_series").css("display", "none");
							if ($(".seriesweizhi").val() == "left") {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_left")
							} else if ($(".seriesweizhi").val() == "center") {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_center")
							} else {
								that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_right")
							}
						}
						//系列小花
						if ($(".flower").val() == 1) {
							that.parents(".template").find(".icon_pic").show()
						} else {
							that.parents(".template").find(".icon_pic").hide()
						}
						//系列
						if ($(".series_img_position").val() == "2") {
							//居右
							that.parents(".template").find(".details_mainPicture_left").css("float", "right")

						} else {
							that.parents(".template").find(".details_mainPicture_left").css("float", "left")
						}
						$(".bgcolor").each(function () {
							var bgcolorvalue = $(this).css("background");
							var bgcolorindex = $(".bgcolor").index(this);
							that.parents(".template").find(".details_mainPicture").css("background", bgcolorvalue)
						})
						//详情页
						$(".productlink").each(function () {
							var wvalue = $(this).val();
							var windex = $(".productlink").index(this);
							$(".template").find("[typeid='7']").eq(windex).attr("href", wvalue)
						})
						if ($(".productcode").val() != "") {
							var myproduct = $(".productcode").val()
							that.edtiproductcode = myproduct;
							$("#stylecodedz").val(that.edtiproductcode);
							console.log($("#stylecodedz").val())
							var htmlpro = '<!--#include virtual="/IdoStudio/ntkf/params/' + myproduct + '.htm" -->'
							$(".xnkf").html(htmlpro)
						}
						if ($(".productcodexs").val() != "") {
							$("#stylecodegm").val($(".productcodexs").val());
							console.log($("#stylecodegm").val())
						}
						//详情头图上的按钮
						$(".btnbgcolor").each(function () {
							var bgcolorvalue = $(this).css("background");
							var bgcolorindex = $(".btnbgcolor").index(this);
							that.parents(".template").find(".btn-dz-detail").css("background", bgcolorvalue)
						})
						$(".btncolor").each(function () {
							var bgcolorvalue = $(this).css("background");
							var bgcolorindex = $(".btncolor").index(this);
							that.parents(".template").find(".btn-dz-detail").css("color", bgcolorvalue)
						})
						/* $(".fontwz").each(function () {
							var fontwz = $(this).val();
							var fontwzindex=$(".fontwz").index(this);
							if(fontwz=='left'){
								that.parents(".template").find(".btn-dz-detail").css("color",bgcolorvalue)
							}else if(fontwz=='right'){

							}else{

							}
						}) */
						$(this).dialog("close").find(".dialog-table").html("");
					},
					"取消": function () {
						$(this).dialog("close");
					}
				}
			});
		})
		//编辑时用的函数
		$(".dialog-table").on("change", ".series", function () {
			if ($(this).val() == 1) {
				$(this).parent().siblings().show();
			} else if ($(this).val() == 2) {
				$(this).parent().next().hide();
			}
		})
		//pc
		$("#dialog-index").on("click", "button", function () {
			var fontsize = $(this).css("font-size");
			var fsize = fontsize.substring(0, fontsize.length - 2);
			if ($(this).hasClass("lbtshow")) {
				var html2 = '<div class="form-group">' +
					'<div class="col-md-5">' +
					'<label class="control-label" style="vertical-align:top">图片：</label>' +
					'<img src="https://img.ido-love.com/ido-logo.png" class="slt-pic imgchoose"/>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">链接：</label>' +
					'<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
					'</div>' +
					'</div>' +
					'<div class="form-group">' +
					'<div class="col-md-4">' +
					'<div style="float:left"><label class="control-label" style="vertical-align:top">描述：</label>' +
					'<input type="text" class="onetitle" style="width:180px" />' +
					'</div>' +
					'<span class="onecolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">大小：</label>' +
					'<input type="text" class="onefont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>' +
					'</div>' +
					'<div class="col-md-2">' +
					'<label class="control-label" style="vertical-align:top">位置：</label>' +
					'<select style="margin-top:8px" class="oneweizhi">' +
					'<option value="">请选择</option>' +
					'<option value="left">居左</option>' +
					'<option value="center">居中</option>' +
					'<option value="right">居右</option>' +
					'</select>' +
					'</div>' +
					'</div>' +
					'<div class="form-group" style="border-bottom:1px solid #ccc">' +
					'<div class="col-md-4">' +
					'<div style="float:left"><label class="control-label" style="vertical-align:top">描述：</label>' +
					'<textarea style="width:180px;" class="twotitle"></textarea>' +
					'</div>' +
					'<span class="twocolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">大小：</label>' +
					'<input type="text" class="twofont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>' +
					'</div>' +
					'<div class="col-md-3">' +
					'<label class="control-label" style="vertical-align:top">位置：</label>' +
					'<select style="margin-top:8px" class="twoweizhi">' +
					'<option value="">请选择</option>' +
					'<option value="left">居左</option>' +
					'<option value="center">居中</option>' +
					'<option value="right">居右</option>' +
					'</select>' +
					'<button type="button" class="btn red delectimg">删除</button>' +
					'</div>' +
					'</div>';
				var lihtml = '<li style="left:100%">' +
					'<a href="#" target="_blank" typeid="5">' +
					'<img src=""  typeid="1">' +
					'<div class="text_box">' +
					'<p class="first " typeid="2"></p>' +
					'<p class="second " typeid="3"></p>' +
					'</div>' +
					'</a>' +
					'</li>';
			} else if ($(this).hasClass("lbtshow2")) {
				var html2 = '<div class="form-group">' +
					'<div class="col-md-5">' +
					'<label class="control-label" style="vertical-align:top">图片：</label>' +
					'<img src="https://img.ido-love.com/ido-logo.png" class="slt-pic imgchoose"/>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">此链接为小能客服</label>' +

					'</div>' +
					'</div>' +
					'<div class="form-group">' +
					'<div class="col-md-4">' +
					'<div style="float:left"><label class="control-label" style="vertical-align:top">描述：</label>' +
					'<input type="text" class="onetitle" style="width:180px" />' +
					'</div>' +
					'<span class="onecolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">大小：</label>' +
					'<input type="text" class="onefont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>' +
					'</div>' +
					'<div class="col-md-2">' +
					'<label class="control-label" style="vertical-align:top">位置：</label>' +
					'<select style="margin-top:8px" class="oneweizhi">' +
					'<option value="">请选择</option>' +
					'<option value="left">居左</option>' +
					'<option value="center">居中</option>' +
					'<option value="right">居右</option>' +
					'</select>' +
					'</div>' +
					'</div>' +
					'<div class="form-group" style="border-bottom:1px solid #ccc">' +
					'<div class="col-md-4">' +
					'<div style="float:left"><label class="control-label" style="vertical-align:top">描述：</label>' +
					'<textarea style="width:180px;" class="twotitle"></textarea>' +
					'</div>' +
					'<span class="twocolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
					'</div>' +
					'<div class="col-md-4">' +
					'<label class="control-label" style="vertical-align:top">大小：</label>' +
					'<input type="text" class="twofont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>' +
					'</div>' +
					'<div class="col-md-3">' +
					'<label class="control-label" style="vertical-align:top">位置：</label>' +
					'<select style="margin-top:8px" class="twoweizhi">' +
					'<option value="">请选择</option>' +
					'<option value="left">居左</option>' +
					'<option value="center">居中</option>' +
					'<option value="right">居右</option>' +
					'</select>' +
					'<button type="button" class="btn red delectimg">删除</button>' +
					'</div>' +
					'</div>';
				var lihtml = '<li style="left:100%">' +
					'<span onclick="NTKF.im_openInPageChat();" typeid="10" style="display:block;cursor:pointer">' +
					'<img src=""  typeid="1">' +
					'<div class="text_box">' +
					'<p class="first " typeid="2"></p>' +
					'<p class="second " typeid="3"></p>' +
					'</div>' +
					'</span>' +
					'</li>';
			}

			//var htmlTable = $(".dialog-table").html();
			$(".dialog-table").append(html2);
			//同时模板中也要增加相对应的点位
			$(".template").find(".list_box").append(lihtml);
			$(".template").find(".list_box li").eq(0).css("left", "0px");
			$(".template").find(".point_box").append("<li></li>");
		})
		$(".dialog-table").on("click", ".delectimg", function () {
			var numbe = Math.ceil($(this).parents(".form-group").index() / 3);
			$(".template").find(".list_box li").eq(numbe - 1).remove();
			$(".template").find(".point_box li").eq(numbe - 1).remove();
			$(this).parents(".form-group").prev("div").prev("div").remove();
			$(this).parents(".form-group").prev("div").remove();
			$(this).parents(".form-group").remove();
		})
		//产品至少5张图片pc
		$("#dialog-index").on("click", ".addproimg", function () {
			var fontsize = $(this).css("font-size");
			var fsize = fontsize.substring(0, fontsize.length - 2);
			var html2 = '<div class="form-group">' +
				'<div class="col-md-4">' +
				'<div style="float:left"><label class="control-label" style="vertical-align:top">描述：</label>' +
				'<input type="text" class="onetitle" style="width:180px" />' +
				'</div>' +
				'<span class="onecolor mycolor" data-toggle="modal" data-target="#myModal" style="float:left;border:1px solid #ccc;margin-left:10px;display:block;width:20px;height:20px;background:' + $(this).css("color") + '"></span>' +
				'</div>' +
				'<div class="col-md-3">' +
				'<label class="control-label" style="vertical-align:top">大小：</label>' +
				'<input type="text" class="onefont myfont" data-toggle="modal" data-target="#myModal" value="' + fsize + '"/>' +
				'</div>' +
				'<div class="col-md-3">' +
				'<label class="control-label" style="vertical-align:top">位置：</label>' +
				'<select style="margin-top:8px" class="oneweizhi">' +
				'<option value="">请选择</option>' +
				'<option value="left">居左</option>' +
				'<option value="center">居中</option>' +
				'<option value="right">居右</option>' +
				'</select>' +
				'<button type="button" class="btn red delectproimg">删除</button>' +
				'</div>' +
				'</div>' +
				'<div class="form-group">' +
				'<div class="col-md-5">' +
				'<label class="control-label" style="vertical-align:top">图片：</label>' +
				'<img src="http://img.ido-love.com/ido-logo.png" class="slt-pic imgchoose"/>' +
				'</div>' +
				'<div class="col-md-4">' +
				'<label class="control-label" style="vertical-align:top">链接：</label>' +
				'<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
				'</div>' +
				'</div>';

			var lihtml = '<a class="imgbox" typeid="5">' +
				'<p class="bg">' +
				'<span class="bg_text conTemplate_dark_grey"  typeid="2"></span>' +
				'</p>' +
				'<img src="" alt="" typeid="1" class="lazy">' +
				'</a>';
			$(".dialog-table").append(html2);
			//同时模板中也要增加相对应的点位
			$(".template").find("#movebox").append(lihtml);
		})
		$(".dialog-table").on("click", ".delectproimg", function () {
			$(this).parents(".form-group").next("div").remove();
			$(this).parents(".form-group").remove();
		})

		//删除
		$(".here").on("click", ".delTpl", function () {
			$(this).parents(".template").remove();
		})
		//链接库
		$(".dialog-table").on("click", ".linkchoose", function () {
			var thats = $(this);
			$("#modallink").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 600,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var linkdetail = $("input[name='linkradio']:checked").parents("tr").find(".linkdetail").text();
						thats.siblings("input").val(linkdetail)
						$(this).dialog('close');
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})

		$(".dialog-table").on("click", ".deleteval", function () {
			$(this).siblings("input").val("")
		})
		//图片库
		$(".dialog-table").on("click", ".imgchoose", function () {
			var thats = $(this);
			thats.addClass("selectimgs");
			$("#imggroup").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 800,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var imglurl = $(".chooseimgname").val();
						thats.attr("src", imglurl)
						$(this).dialog('close');
						thats.removeClass("selectimgs")
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})
		//自定义选择图片
		$(".here").on("click", ".imgchoose", function () {
			console.log("aaa")
			var thats = $(this);
			thats.addClass("selectimgs");
			$("#imggroup").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 800,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var imglurl = $(".activeborder").find("img").attr("src");
						thats.siblings(".viewimg").val(imglurl);
						$(this).dialog('close');
						thats.removeClass("selectimgs")
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})
		//添加链接弹层
		$(".here").on("click", ".editpic", function () {
			var thisone = $(this);
			thisone.addClass("myimgs");
			$("#imggroup").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 600,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var activeimgurl = $(".activeborder").find("img").attr("src");
						var activeimgheight = $(".activeborder").find("img").siblings(".imgheight").val();
						console.log(activeimgheight)
						//thisone.parents(".myhtml").css("background", 'url(' + activeimgurl + ') no-repeat top center')
						if (thisone.parents(".myhtml").find(".centerhtml").find("img").length != 0) {
							console.log("1111")
							thisone.parents(".myhtml").find(".centerhtml").find("img").attr("src", activeimgurl)
						} else {
							console.log("222")
							thisone.parents(".myhtml").find(".centerhtml").append("<img src='" + activeimgurl + "'/>")
						}
						//thisone.parents(".myhtml").find(".img_box").css("height", activeimgheight);
						//thisone.parents(".myhtml").css("height", activeimgheight);
						$(this).dialog('close');
						thisone.removeClass("myimgs")
					},
					"取消": function () {
						$(this).dialog('close');
						thisone.removeClass("myimgs")
					}
				}
			})
		})
		//添加图片
		$(".here").on("click", ".addlinks", function () {
			$(this).parents(".myhtml").find(".btngroup").show();
		})
		//删除模板
		$(".here").on("click", ".deletemoban", function () {
			$(this).parents(".template").remove();
		})
		//隐藏链接
		$(".here").on("click", ".cancellink", function () {
			$(this).parents(".btngroup").hide();
		})
		//添加链接
		var obj = null;//定义标签对象的全局变量，目的用于编辑
		$(".here").on("click", ".addmylink", function () {
			var link = $(this).parent(".btngroup").find("input[name=link]").val();//取得超链接
			var widths = $(this).parent(".btngroup").find(".widths").val();
			var heights = $(this).parent(".btngroup").find(".heights").val();
			var xiaoneng = $(this).parent(".btngroup").find(".methods").val();
			var addview = $(this).parent(".btngroup").find(".addview").val();
			var viewimg = $(this).parent(".btngroup").find(".viewimg").val();
			var viewval = $(this).parent(".btngroup").find(".viewval").val();
			var imgaddress = $(this).parent(".btngroup").find(".picadress").val();
			var linkadress = $(this).parent(".btngroup").find(".linkadress").val();
			console.log('宽度和高度' + widths, heights)
			if (xiaoneng == 1) {//链接到小能
				var html =
					'<p class="maodian kefuer" style="width:' + widths + '%;height:' + heights + '%;">' +
					'<a onclick="NTKF.im_openInPageChat();" style="width:100%;height:100%;">' +
					'</a></p>';//组装P标签
			} else if (xiaoneng == 0) {//链接到网址
				var html =
					'<p class="maodian webadress" style="width:' + widths + '%;height:' + heights + '%;">' +
					'<a target="_blank" href="' + link + '" style="width:100%;height:100%;">' +
					'</a></p>';//组装P标签
			} else if (xiaoneng == 2) { //链接到视频
				var html =
					'<p class="maodian viewweb" style="width:' + widths + '%;height:' + heights + '%;">' +
					'<img src="' + viewimg + '" alt="" class="addImg lazy" style="width:' + widths + '%;height:' + heights + '%;">' +
					'<video src="' + viewval + '" style="object-fit:fill;display:none" width="100%" height="100%" controls="controls" class="adVideo"></video>' +
					'</p>'
			} else { //链接到图片
				var html =
					'<p class="maodian picter" style="width:' + widths + '%;height:' + heights + '%;">' +
					'<a target="_blank" href="' + linkadress + '" style="width:100%;height:100%;">' +
					'<img src="' + imgaddress + '" alt="" class="addImg lazy" style="width:' + widths + '%;height:' + heights + '%;">' +
					'</a>' +
					'</p>'
			}

			$(this).parents(".myhtml").find(".img_box").append(html); //添加到img_box div中，即图片的后面
			$(this).parents(".btngroup").hide();
		})
		//颜色选择
		$(".dialog-table").on("click", ".mycolor", function () {
			var thats = $(this);
			$("#cModal").dialog({
				autoOpen: true,
				resizable: false,
				width: 450,
				height: 500,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var colorval = $(".colorc").css("background");
						thats.css("background", colorval);
						thats.parents(".form-group").find(".fontdemo").css("color", colorval);
						$(this).dialog('close');
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})
		//字体大小选择
		$(".dialog-table").on("click", ".myfont", function () {
			var thats = $(this);
			$("#fModal").dialog({
				autoOpen: true,
				resizable: false,
				width: 300,
				height: 400,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var fontval = $("#amount").val();
						thats.val(fontval);
						thats.parents(".form-group").find(".fontdemo").css("font-size", fontval + 'px')
						$(this).dialog('close');
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})
		$(".here").delegate(".maodian", "mousedown", function (e) {
			obj = $(this);//把当前标签对象赋值给变量
			if (obj.setCapture) { //用于兼容非准浏览器
				obj.setCapture();
			}
			var reletiveheight = parseInt(obj.parents(".myhtml").css("height"));
			var _w = obj.css("width").split('px');
			var _h = obj.css("height").split('px');
			obj.parents(".myhtml").find("input[ame=link]").val(obj.find("a").attr("href"));//把点中标签的链接加到链接本框中
			$(".widths").val(_w[0] / 1920 * 100);
			$(".heights").val(_h[0] / 1920 * 100);
			if (obj.hasClass("kefuer")) {//客服
				obj.parents(".myhtml").find(".methods").val("1");
				$(".imgaddress").hide();
				$('.viewsp').hide();
				$('.weblink').hide();
			}
			if (obj.hasClass("webadress")) {//网址
				obj.parents(".myhtml").find(".methods").val("0");
				obj.parents(".myhtml").find(".linkval").val(obj.find("a").attr("href"));
				$(".imgaddress").hide();
				$('.viewsp').hide();
				$('.weblink').show();
			}
			if (obj.hasClass("viewweb")) {//视频
				obj.parents(".myhtml").find(".methods").val("2");
				obj.parents(".myhtml").find(".viewimg").val(obj.find("img").attr("src"));
				obj.parents(".myhtml").find(".viewval").val(obj.find("video").attr("src"));
				$(".imgaddress").hide();
				$('.viewsp').show();
				$('.weblink').hide();
			}
			if (obj.hasClass("picter")) {//图片
				obj.parents(".myhtml").find(".methods").val("3");
				obj.parents(".myhtml").find(".picadress").val(obj.find("img").attr("src"));
				obj.parents(".myhtml").find(".linkadress").val(obj.find("a").attr("href"));
				$(".imgaddress").show();
				$('.viewsp').hide();
				$('.weblink').hide();
			}
			var _x = e.pageX - obj.offset().left;//取得鼠标到标签左边left的距离
			var _y = e.pageY - obj.offset().top; //取得鼠标到标签顶部top的距离
			var oWidth = $(this).outerWidth(); //取得标签的宽，包括padding
			var oHeight = $(this).outerHeight();//取得标签的高，包括padding
			var x = 0, y = 0; //定义移动的全局变量
			obj.parents(".myhtml").find(".img_box").bind("mousemove", function (e) {
				var img_position = obj.parents(".myhtml").find(".img_box").offset(); //取得图片的位置
				var img_positionw = obj.parents(".myhtml").find(".img_box").width();
				var img_positionh = obj.parents(".myhtml").find(".img_box").height();
				x = (e.pageX - _x - img_position.left) / img_positionw * 100; //计算出移动的x值
				y = (e.pageY - _y - img_position.top) / img_positionh * 100; //计算出移动的y值
				console.log(x, y)
				if (x < 0) { //如果移动小于0，证明移到了图片外，应设为0
					x = 0;
				} else if (x > (obj.parents(".myhtml").find(".img_box").width() - oWidth)) {
					//如果移动大于图片的宽度减去标签的宽度，证明移到了图片外，应该设为可用的最大值
					x = (obj.parents(".myhtml").find(".img_box").width() - oWidth) / 1920 * 100;
				}

				if (y < 0) { //同上
					y = 0;
				} else if (y > (obj.parents(".myhtml").find(".img_box").height() - oHeight)) {
					y = (obj.parents(".myhtml").find(".img_box").height() - oHeight) / img_positionh * 100;;
				}
				obj.css({ "left": x + "%", "top": y + "%" });
			});

			obj.parents(".myhtml").find(".img_box").bind("mouseup", function () { //绑定鼠标左键弹起事件
				obj.parents(".myhtml").find(".img_box").unbind("mousemove"); //移动mousemove事件
				$(this).unbind("mouseup"); //移动mouseup事件
				if (obj.releaseCapture) { //兼容非标准浏览器
					obj.releaseCapture();
				}

			});
			return false; //用于选中文字时取消浏览器的默认事件

		})
		$(".here").delegate(".maodian", "dblclick", function () {//绑定双击事件
			$(this).remove(); //删除当前标签
		})

		$(".here").delegate("a", "click", function () { //取消a标签的单击默认事件
			return false;
		})
		//链接弹层
		//链接库
		$(".here").on("click", ".linkchoose", function () {
			var thats = $(this);
			$("#modallink").dialog({
				autoOpen: true,
				resizable: false,
				width: 1000,
				height: 600,
				modal: true,
				draggable: false,
				buttons: {
					"确定": function () {
						var linkdetail = $("input[name='linkradio']:checked").parents("tr").find(".linkdetail").text();
						thats.siblings("input").val(linkdetail)
						$(this).dialog('close');
					},
					"取消": function () { $(this).dialog('close'); }
				}
			})
		})
		//链接方式
		$(".here").on("click", ".methods", function () {
			if ($(this).val() == 0) {
				$(".weblink").show();
				$(".viewsp").hide();
				$(".imgaddress").hide();
			} else if ($(this).val() == 1) {
				$(".weblink").hide();
				$(".viewsp").hide();
				$(".imgaddress").hide();
			} else if ($(this).val() == 2) {
				$(".weblink").hide();
				$(".viewsp").show();
				$(".imgaddress").hide();
			} else {
				$(".imgaddress").show();
				$(".weblink").hide();
				$(".viewsp").hide();
			}
		})
		var that = this;
		this.route.queryParams.subscribe(function (data) {
			console.log(data)
			that.siteId = data.siteId;
			that.id = data.id;
			that.channelId = data.channelId;
			that.productCode = data.productCode;
			if (that.id != "") {
				$(".pagedesec a").click();
			}
		})
		//获取页面模板id
		var pageurl = "/api/cms/page/pageTemplId/" + that.siteId;
		this.http.get(pageurl).subscribe(function (data) {
			that.pageid = data['body'];
			console.log(that.pageid )
		}, function (err) {
			console.log(err)
		})
		var imggroup = "/api/cms/pictureGroup/list";
		this.http.get(imggroup).subscribe(function (data) {
			that.groupimg = data['body'];
		}, function (err) {
			console.log(err)
		})
		var imgtag = "/api/cms/pictureTag/list";
		this.http.get(imgtag).subscribe(function (data) {
			that.tagimg = data['body'];
		}, function (err) {
			console.log(err)
		})
		//站点id
		if (this.siteId) {
			var url = '/api/cms/segmentTmpl/list?siteId=' + this.siteId;
			var that = this;
			this.http.get(url).subscribe(function (data) {
				that.list = data['body'];
				setTimeout(function () {
					$("#catalog>ul>li").draggable({
						appendTo: "body",
						helper: "clone",
						cursor: "Move"
					});
				}, 2000)

			}, function (err) {
				console.log(err)
			})

			//链接库
			var urllink = '/api/cms/page/publish-list?siteId=' + this.siteId;
			var that = this;
			this.http.get(urllink).subscribe(function (data) {
				that.alllinks = data['body'];
			}, function (err) {
				console.log(err)
			})
			//系列名称
			var serieslink = '/api/cms/page/series-list?siteId=' + this.siteId;
			var that = this;
			this.http.get(serieslink).subscribe(function (data) {
				that.yxseries = data['body'];
			}, function (err) {
				console.log(err)
			})
			//图片库
			var url = '/api/cms/picture/page-list-siteid?pageNo=' + this.pageNo + '&pageSize=' + 28 + "&siteId=" + this.siteId;
			this.http.get(url).subscribe(function (data) {
				that.tplList = data['body'].list;
				that.pageNo = data['body'].pageNo;
				/* for (var i = 0; i < data['body'].pageCount - 1; i++) {
					that.pageList.push(1)
				} */
				that.pageCount = data['body'].pageCount;
				$("#pagination1").pagination({
					currentPage: that.pageNo,
					totalPage: that.pageCount,
					callback: function (current) {
						that.pageNo = current;
						that.pagenumber(that.pageNo)
					}
				});
			}, function (err) {
				console.log(err)
			})
			//系列管理
			var that = this;
			var serieslist = "/api/cms/page/series-list?siteId=" + this.siteId;
			this.http.get(serieslist).subscribe(function (data) {
				that.serieslists = data['body'];
			}, function (err) {
				console.log(err)
			})
			// 商品管理
			if (this.productCode != "" || this.productCode != undefined) {
				var prolist = "/api/cms/page/product-list?siteId=" + this.siteId + '&code=' + this.productCode;
			}
			if (this.productCode == "" || this.productCode == undefined) {
				var prolist = "/api/cms/page/product-list?siteId=" + this.siteId;
			}
			this.http.get(prolist).subscribe(function (data) {
				that.prolists = data['body'];
			}, function (err) {
				console.log(err)
			})
		}
		//页面ID,编辑模板
		if (this.id) {
			var url = '/api/cms/page/desc/' + this.id;
			this.http.get(url).subscribe(
				function (data) {
					console.log(data)
					if (data['body'].state != 1 || data['body'].state != 0) {
						$(".preview").show();
					}
					that.pagemsg = data['body'];
					that.page = {
						comm: that.pagemsg.comm,
						content: that.pagemsg.content,
						description: that.pagemsg.description,
						fileName: that.pagemsg.fileName,
						fkCode: that.pagemsg.fkCode,
						id: that.pagemsg.id,
						keyword: that.pagemsg.keyword,
						pageTmplId: that.pagemsg.pageTmplId,
						pageType: that.pagemsg.pageType,
						priviewUrl: that.pagemsg.priviewUrl,
						siteId: that.pagemsg.siteId,
						state: that.pagemsg.state,
						title: that.pagemsg.title,
						url: that.pagemsg.url,
						channelId: that.pagemsg.channelId
					}
					that.title = that.pagemsg.title;
					that.keyword = that.pagemsg.keyword;
					that.description = that.pagemsg.description;
					that.previewurl = that.pagemsg.priviewUrl;
					that.msgTitles = that.pagemsg.comm;
					that.msgEnglishs = that.pagemsg.fileName;
					if ($(".here").find("#stylecodedz")) {
						$("#stylecodedz").val(decodeURIComponent(that.pagemsg.productCode));
					}
					if ($(".here").find("#stylecodegm")) {
						$("#stylecodegm").val(decodeURIComponent(that.pagemsg.productCode));
					}

					$(".edithtml").html(that.pagemsg.content);
					$(".edithtml img").each(function (index, item) {
						//console.log($(".edithtml img").attr("data-original"));
						if ($(".edithtml img").find("[data-original]")) {
							//console.log("aaa");
							var src = $(item).attr("data-original");
							$(item).attr("src", src);
						}
					});
					$(".edithtml").find(".fixedbtn").show();
					$(".edithtml .maodian").css({ "background": "#000", "opacity": "0.4" });
					$(".here").html($(".edithtml").html());
					$(".edithtml").css("display", "none");
					if (that.page.pageTmplId != that.pageid) {
						$("#pageModal").modal('show');
						that.ispageid=2;
					}

				}, function (err) {
					console.log(err)
				})
		} else {
			that.page = {
				comm: "",
				content: "",
				description: "",
				fileName: "",
				fkCode: "",
				id: "",
				keyword: "",
				pageTmplId: "",
				pageType: "",
				priviewUrl: "",
				siteId: that.siteId,
				state: "",
				title: "",
				url: "",
				channelId: that.channelId
			}
		}
	}
	//确认页面模板id
	surepageid(){
		let that=this;
		that.page.pageTmplId=that.pageid;
		that.ispageid=1;
		$("#pageModal").modal('hide');
		console.log(that.pageid)
	}
	tmpzcsave(status) {
		var that = this;
		var url = '/api/cms/page/temporary-or-save';
		$(".here img").each(function (index, item) {
			var src = $(item).attr("src");
			if ($(item).attr("data-original") != undefined) {
				$(item).attr("data-original", src);
				$(item).attr("src", "https://img.ido-love.com/ido-logo.png")
			} else {
				$(item).attr("src", src)
			}
		});
		$(".here a").each(function (index, item) {
			if ($(item).attr("href") == "" || $(item).attr("href") == undefined || $(item).attr("href") == " ") {
				$(item).attr("href", "javascript:void()")
			}
		});
		$(".here").find(".fixedbtn").hide();
		$(".here").find(".btngroup").hide();
		$(".here .maodian").css("background", "none");
		if ($(".here .maodian").find("img").hasClass("addImg")) {
			$(".here .maodian").css("opacity", "1");
		}
		var pagehtml = $('.here').html();
		var arr = [];
		$('.here a').each(function (index, item) {
			if ($(item).attr("href") != "" || $(item).attr("href") != "#" || $(item).attr("href") != "undefined") {
				arr.push($(item).attr("href"))
			}
		})
		this.page.comm = $('input[name="newChildCn"]').val();
		this.page.content = pagehtml;
		this.page.description = $(".mydescription").val();
		this.page.fileName = $('input[name="newChildEn"]').val();
		this.page.linkUrls = arr;
		this.page.title = $(".mytitle").val();
		this.page.keyword = $(".mykeyword").val();
		console.log(that.ispageid)
		if(that.ispageid==0 || that.ispageid==1){  //0新增，1确认  2，取消
			this.page.pageTmplId = that.pageid;
		}
		
		if (status == 1) {
			this.page.state = 1;
		} else if (status == 2) {
			this.page.state = 2;
		} else if (status == 3) {
			this.page.state = 3;
		}
		var code = $('input[name="newChildEn"]').val().split('-')[1];
		if (this.newproductid) {
			code = $.trim(code).replace(" ", "%20");

		}
		if ($(".template").find(".go_shopping").attr("typeid") == "8") {
			console.log("定制")
			this.page.productCode = $("#stylecodedz").val();
		} else {
			console.log("购买")
			this.page.productCode = $("#stylecodegm").val();
		}

		console.log("productCode", this.page.productCode)
		console.log(this.page)
		 this.http.post(url, this.page).subscribe(function (data) {
			if (data['header'].code == 200) {
				console.log(data)
				if (status == 1) {
					$(".preview").hide();
					that.isHint = true;
					that.hintMsg = "暂存成功";
					setTimeout(function () {
						that.isHint = false;
						that.hintMsg = '';
					}, 1500)
				} else if (status == 2) {
					$(".preview").show();
					that.isHint = true;
					that.hintMsg = "保存成功,可进行预览";
					setTimeout(function () {
						that.isHint = false;
						that.hintMsg = '';
					}, 1500)
					history.replaceState(null, null, "/cms/groupcms?siteId=" + data['body'].siteId + "&id=" + data['body'].id + "&channelId=" + data['body'].channelId)
					window.location.reload();
				} else if (status == 3) {
					$(".preview").show();
					that.isHint = true;
					that.hintMsg = "发布成功";
					setTimeout(function () {
						that.isHint = false;
						that.hintMsg = '';
					}, 1500)
					window.location.reload();
				} else {
					that.common.closewin();
				}
				that.previewurl = data['body'].priviewUrl;

			} else {
				alert("系统异常，请稍后再试");
			}
		}, function (err) {
			console.log(err)
		})

	}
	//预览
	preview(status) {
		//window.open(this.previewurl)
		var that = this;
		var url = '/api/cms/page/temporary-or-save';
		$(".here img").each(function (index, item) {
			var src = $(item).attr("src");
			if ($(item).attr("data-original") != undefined) {
				$(item).attr("data-original", src);
				$(item).attr("src", "https://img.ido-love.com/ido-logo.png")
			} else {
				$(item).attr("src", src)
			}
		});
		$(".here a").each(function (index, item) {
			if ($(item).attr("href") == "" || $(item).attr("href") == undefined || $(item).attr("href") == " ") {
				$(item).attr("href", "javascript:void()")
			}
		});
		$(".here").find(".fixedbtn").hide();
		$(".here").find(".btngroup").hide();
		$(".here .maodian").css("background", "none");
		if ($(".here .maodian").find("img").hasClass("addImg")) {
			$(".here .maodian").css("opacity", "1");
		}
		var pagehtml = $('.here').html();
		var arr = [];
		$('.here a').each(function (index, item) {
			if ($(item).attr("href") != "" || $(item).attr("href") != "#" || $(item).attr("href") != "undefined") {
				arr.push($(item).attr("href"))
			}
		})
		this.page.comm = $('input[name="newChildCn"]').val();
		this.page.content = pagehtml;
		this.page.description = $(".mydescription").val();
		this.page.fileName = $('input[name="newChildEn"]').val();
		this.page.linkUrls = arr;
		this.page.title = $(".mytitle").val();
		this.page.keyword = $(".mykeyword").val();
		if(that.ispageid==0 || that.ispageid==1){  //0新增，1确认  2，取消
			this.page.pageTmplId = that.pageid;
		}
		if (status == 1) {
			this.page.state = 1;
		} else if (status == 2) {
			this.page.state = 2;
		} else if (status == 3) {
			this.page.state = 3;
		}
		var code = $('input[name="newChildEn"]').val().split('-')[1];
		if (this.newproductid) {
			code = $.trim(code).replace(" ", "%20");

		}
		if ($(".go_shopping").attr("typeid") == 8) {
			this.page.productCode = $("#stylecodedz").val();
		} else if ($(".go_shopping").attr("typeid") == 9) {
			this.page.productCode = $("#stylecodegm").val();
		}
		this.http.post(url, this.page).subscribe(function (data) {
			if (data['header'].code == 200) {
				that.previewurl = data['body'].priviewUrl;
				console.log(that.previewurl)
				console.log(data)
				if (status == 2) {
					window.location.reload();
					window.open(that.previewurl);
				}

			} else {
				alert("系统异常，请稍后再试");
			}
		}, function (err) {
			console.log(err)
		})
	}
	searchlink() {
		var urllink = '/api/cms/page/publish-list?siteId=' + this.siteId + '&enName=' + $(".pageeng").val() + '&pageType=' + $(".pagelx").val() + '&seriesCode=' + $(".seriesname").val();
		var that = this;
		this.http.get(urllink).subscribe(function (data) {
			that.alllinks = data['body'];
		}, function (err) {
			console.log(err)
		})
	}
	//图片库分页
	/* goPage(item) {
		$('.next').removeClass('disabled')
		$('.previous').removeClass('disabled')
		if (this.pageNo == item + 1) {
			return
		}
		if (item == 9999) {
			this.pageNo -= 1
		} else if (item == -1) {
			this.pageNo += 1
		} else {
			this.pageNo = item + 1
		}
		if (this.pageNo < 1) {
			$('.previous').addClass('disabled')
			this.pageNo = 1
			return
		}
		if (this.pageNo > this.pageList.length) {
			$('.next').addClass('disabled')
			this.pageNo = this.pageList.length
			return
		}
		var that = this
		var url = '/api/cms/picture/page-list-siteid?pageNo=' + this.pageNo + '&pageSize=' + 28 + "&siteId=" + this.siteId;
		this.http.get(url).subscribe(function (data) {
			console.log(data)
			that.tplList = data['body'].list;
			that.pageNo = data['body'].pageNo;
		}, function (err) {
			console.log(err)
		})
	} */
	pagenumber(pagenumber) {
		var that = this
		var url = '/api/cms/picture/page-list-siteid?pageNo=' + pagenumber + '&pageSize=' + 28 + "&siteId=" + this.siteId;
		this.http.get(url).subscribe(function (data) {
			console.log(data)
			that.tplList = data['body'].list;
		}, function (err) {
			console.log(err)
		})
	}
	pagefuction() {
		var that = this
		var url = '/api/cms/picture/page-list-siteid?pageNo=' + this.pageNo + '&pageSize=' + 28 + "&siteId=" + this.siteId;
		this.http.get(url).subscribe(function (data) {
			console.log(data)
			that.tplList = data['body'].list;
			that.pageNo = data['body'].pageNo;
			that.pageCount = data['body'].pageCount;
			$("#pagination1").pagination({
				currentPage: that.pageNo,
				totalPage: that.pageCount,
				callback: function (current) {
					that.pageNo = current;
					that.pagenumber(that.pageNo)
				}
			});
		}, function (err) {
			console.log(err)
		})
	}
	mypic(i) {
		$(".maximg").hide();
		$(".listimg li").eq(i).find("div").addClass("activeborder");
		$(".listimg li").eq(i).siblings("li").find("div").removeClass("activeborder");
		$('.chooseimgname').val($(".activeborder").find("img").attr('src'));
		$(".activeborder").find(".maximg").css("display", "block");
		setTimeout(function () {
			$(".maximg").hide()
		}, 5000)
	}
	searchpro() {
		var that = this;
		var prolist = "/api/cms/page/product-list?siteId=" + that.siteId + '&code=' + $(".ksbm").val() + '&name=' + $(".chinesaname").val() + '&seriesCodes=' + $(".profl").val();
		this.http.get(prolist).subscribe(function (data) {
			that.prolists = data['body'];
		}, function (err) {
			console.log(err)
		})
	}
	searchimg() {
		var that = this;
		var url = '/api/cms/picture/page-list-siteid?pageNo=' + this.pageNo + '&pageSize=' + 28 + "&siteId=" + this.siteId + '&picName=' + $(".picnames").val();
		this.http.get(url).subscribe(function (data) {
			console.log(data)
			that.tplList = data['body'].list;
			/* for (var i = 0; i < data['body'].pageCount - 1; i++) {
				that.pageList.push(1)
			} */
			that.pageNo = data['body'].pageNo;
			that.pageCount = data['body'].pageCount;
			$("#pagination1").pagination({
				currentPage: that.pageNo,
				totalPage: that.pageCount,
				callback: function (current) {
					that.pageNo = current;
					that.pagenumber(that.pageNo)
				}
			});
		}, function (err) {
			console.log(err)
		})
	}
	//选择系列
	seriesmanage() {
		var seriescode = $("input[name='series']:checked").parents("td").siblings(".seriescode").text()
		var seriesdesc = $("input[name='series']:checked").parents("td").siblings(".seriesdesc").text()
		//console.log(seriescode+seriesdesc)
		let repeatUrl = '/api/cms/page/repeat-name?siteId=' + this.siteId + '&pageId=' + this.id + '&fileName=series-' + seriescode;
		this.http.get(repeatUrl).subscribe(
			data => {
				console.log(data);
				if (data['body']) {
					$('.namerepeat').text("英文名称重复")
					return false;
				} else {
					this.msgEnglishs = 'series-' + seriescode;
					this.msgTitles = seriesdesc;
					$('#smyModal').hide();
					$(".modal-backdrop").hide()
				}
			},
			err => { console.log(err) }
		)

	}
	//选择商品
	productmanage() {
		var kuanshicode = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find("span").text();
		var kuanshidouble = $("input[name='product']:checked").parents("td").siblings(".kuanshicode").find(".double").val();
		console.log(kuanshicode + kuanshidouble)
		var nameeng;
		if (kuanshidouble == "true") {
			nameeng = 'lastCommodityDouble-' + kuanshicode;
		} else {
			nameeng = 'lastCommodity-' + kuanshicode;
		}
		let repeatUrl = '/api/cms/page/repeat-name?siteId=' + this.siteId + '&pageId=' + this.id + '&fileName=' + nameeng;
		this.http.get(repeatUrl).subscribe(
			data => {
				console.log(data);
				if (data['body']) {
					$('.enamerepeat').text("英文名称重复")
					return false;
				} else {
					if (kuanshidouble == "true") {
						this.msgEnglishs = 'lastCommodityDouble-' + kuanshicode;
					} else {
						this.msgEnglishs = 'lastCommodity-' + kuanshicode;
					}
					$('#proModal').hide();
					$(".modal-backdrop").hide()
				}
			},
			err => { console.log(err) }
		)


	}
	//双击图片进行图片的选择
	selectpic(e) {
		if ($(".imgchoose").hasClass("selectimgs")) {
			var imglurl = $(".activeborder").find("img").attr("src");
			//$(".selectimgs").siblings("input").val(imglurl);
			$(".selectimgs").attr("src", imglurl);
			$(".selectimgs").prev("input").val(imglurl);
			$("#imggroup").dialog('close');
			$(".imgchoose").removeClass("selectimgs")
		} else {
			var activeimgurl = $(".activeborder").find("img").attr("src");
			var activeimgheight = $(".activeborder").find("img").siblings(".imgheight").val();
			if ($(".myimgs").parents(".myhtml").find(".centerhtml").find("img").length != 0) {
				$(".myimgs").parents(".myhtml").find(".centerhtml").find("img").attr("src", activeimgurl)
			} else {
				$(".myimgs").parents(".myhtml").find(".centerhtml").append("<img src='" + activeimgurl + "'/>")
			}
			$("#imggroup").dialog('close');
			$(".editpic").removeClass("myimgs")

		}

	}

}
