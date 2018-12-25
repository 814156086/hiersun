$(function() {
	$( "#catalog>ul>li" ).draggable({
		appendTo: "body",
		helper: "clone",
		cursor: "Move"
	});
    $( "#dialog-index" ).dialog({autoOpen: false});
    var fixed ='<div class="fixed" style="display:none;width: 100%;height: 100%;position: absolute;top: 0;left: 0;z-index:100;background: rgba(0,0,0,.5)">' +
              '<div class="setTpl" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 0px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >编辑</div>\n' +
              '<div class="delTpl" style="width: 40px;height: 20px;background: rgba(255,255,255,.4);position: absolute;top: 0;right: 40px;text-align: center;line-height: 20px;color: #fff;border: 1px dotted #fff;cursor:pointer;" >删除</div>\n' +
			  '</div>'
    $( "#page .here" ).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
		$( "<div class='template clearfix' style='position:relative'></div>" ).html( ui.draggable.html()+ fixed).appendTo( this );
		$(".here").find(".htmlcon").show();
        $(".template").find(".templates").show();
		$(".template").find(".tpl").remove();
		$(".template").find(".tmpname").remove();
		$(".template").find(".tmppic").remove();
      }
    }).sortable({
      items: "div.template",
      sort: function() {
        // 获取由 droppable 与 sortable 交互而加入的条目
        // 使用 connectWithSortable 可以解决这个问题，但不允许您自定义 active/hoverClass 选项
        $( this ).removeClass( "ui-state-default" );
      }
    });
    $(".ui-droppable").on('mouseover','.template',function () {
		if(!$(this).find("div").hasClass("myhtml") && !$(this).find("div").hasClass("mmyhtml")){
			$(this).find('.fixed').show()
		}
      $('.templates').on('click','.upTpl',function (e) {
        e.stopImmediatePropagation();
        console.log($(this).parents('.template').index())
      })
    })
    $(".ui-droppable").on('mouseout','.template',function () {
          $(this).find('.fixed').hide()
    })
    //编辑
    $(".here").on("click",".setTpl", function() {
      var html = '';
	  $(this).parents(".template").find("[typeid]").each(function() {
		var typeid = $(this).attr("typeid");
		if(typeid==1){
			if($(this).parents(".discoloration").attr("c-data") == 3){//带小花的图文
				if($(this).parent("a").length > 0) { //判断img的外面是否含有a标签
					html += '<tr>' +
						'<td>' +
						'图片：<img src="'+$(this).attr("src")+'" class="slt-pic"/><input type="text" class="imgsrc" value="' + $(this).attr("src") + '" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
						'</td>' +
						'<td>链接：<input type="text" class="imglink" value="' + $(this).parent("a").attr("href") + '" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
						'<td>位置：'+
						'<select class="series_img_position">'+
						'<option value="0">请选择</option>' +
						'<option value="1">居左</option>' +
						'<option value="2">居右</option>' +
						'</select>'+
						'</td>'+
						'<td>'+
						'背景颜色：<input type="text" class="bgcolor"/>'
						'</td>'+
						'</tr>';
				} else {
					html += '<tr>' +
						'<td>' +
						'图片：<img src="'+$(this).attr("src")+'" class="slt-pic"/><input type="text" class="imgsrc" value="' + $(this).attr("src") + '" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
						'</td>' +
						'<td>链接：<input type="text" class="imglink" value="" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
						'<td>'+
						'<select>'+
						'<option value="">请选择</option>' +
						'<option value="left">居左</option>' +
						'<option value="right">居右</option>' +
						'</select>'+
						'</td>'+
						'<td>'+
						'背景颜色：<input type="text" class="bgcolor"/>'
						'</td>'+
						'</tr>';
				}
			}else if($(this).parents(".template_two").attr("c-data") == 5){
					$(".showimgpro").hide();
					$(".mlbtshow").hide();
					$(".mlbtshow").hide();
					$(".mshowimgpro").show();
			}else{
					//判断img的外面是否含有a标签
					if($(this).parent("a").length > 0) {
						html += '<tr>' +
							'<td colspan="2">' +
							'图片：<img src="'+$(this).attr("src")+'" class="slt-pic"/><input type="text" class="imgsrc" value="' + $(this).attr("src") + '" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
							'</td>' +
							'<td colspan="2">链接：<input type="text" class="imglink" value="' + $(this).parent("a").attr("href") + '" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
							'</tr>';
					} else {
						html += '<tr>' +
							'<td colspan="2">' +
							'图片：<img src="'+$(this).attr("src")+'" class="slt-pic"/><input type="text" class="imgsrc" value="' + $(this).attr("src") + '" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
							'</td>' +
							'<td colspan="2">链接：<input type="text" class="imglink" value="" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
							'</tr>';
					}
			}
		}
		else if(typeid==2){
			//判断是否是产品展示
			if($(this).parents(".lb-box").attr("c-data") == 2) {
				$(".showimgpro").show();
				$(".lbtshow").hide();
				$(".mlbtshow").hide();
				$(".mshowimgpro").hide();
				html += '<tr>' +
				'<td>' +
				'标题：<input type="text" class="onetitle" value="' + $(this).text() + '"/>' +
				'</td>' +
				'<td>颜色：<input type="text" class="onecolor" /></td>' +
				'<td>大小：<input type="text" class="onefont" /></td>' +
				'</tr>';
			}else{
				html += '<tr>' +
				'<td>' +
				'标题：<input type="text" class="onetitle" value="' + $(this).text() + '"/>' +
				'</td>' +
				'<td>颜色：<input type="text" class="onecolor" /></td>' +
				'<td>大小：<input type="text" class="onefont" /></td>' +
				'</tr>';
			}
		}
		else if(typeid==3){
			//判断是否是PC轮播图
			if($(this).parents("#box").attr("c-data") == 1) {
				$(".lbtshow").show();
				$(".showimgpro").hide();
				$(".mlbtshow").hide();
				$(".mshowimgpro").hide();
				html += '<tr>' +
					'<td>' +
					'副标题：<input type="text" class="twotitle" value="' + $(this).text() + '" />' +
					'</td>' +
					'<td>颜色：<input type="text" class="twocolor" /></td>' +
					'<td>大小：<input type="text" class="twofont" /></td>' +
					'<td>' +
					'<button type="button" class="btn red delectimg">删除</button>'
				'</td>' +
				'</tr>';
			}else  if($(this).parents(".template_lunbo").attr("c-data") == 4){//手机轮播图
				$(".lbtshow").hide();
				$(".showimgpro").hide();
				$(".mlbtshow").show();
				html += '<tr>' +
					'<td>' +
					'副标题：<input type="text" class="twotitle" value="' + $(this).text() + '" />' +
					'</td>' +
					'<td>颜色：<input type="text" class="twocolor" /></td>' +
					'<td>大小：<input type="text" class="twofont" /></td>' +
					'<td>' +
					'<button type="button" class="btn red delectimg">删除</button>'
				'</td>' +
				'</tr>';
			} else {
				html += '<tr>' +
					'<td>' +
					'副标题：<input type="text" class="twotitle" value="' + $(this).text() + '" />' +
					'</td>' +
					'<td>颜色：<input type="text" class="twocolor" /></td>' +
					'<td>大小：<input type="text" class="twofont" /></td>' +
					'</tr>';
			}
		}
		else if(typeid==4){
			if($(this).css("display") == "block") {
				if($(this).parent(".series_names").hasClass("conTemplate_right")) {
					html += '<tr>' +
						'<td>探索此系列：' +
						'<select class="series">' +
						'<option value="0">请选择</option>' +
						'<option value="1" selected>显示</option>' +
						'<option value="2">隐藏</option>' +
						'</select>' +
						'</td>' +
						'<td>系列链接：<input type="text" class="serieslink" value="' + $(this).attr("href") + '"/></td>' +
						'<td colspan="2">显示位置：' +
						'<select class="seriesweizhi">' +
						'<option value="">请选择</option>' +
						'<option value="left">居左</option>' +
						'<option value="center">居中</option>' +
						'<option value="right" selected>居右</option>' +
						'</select>' +
						'</td>' +
						'</tr>';
				} else if($(this).parent(".series_names").hasClass("conTemplate_center")) {
					html += '<tr>' +
						'<td>探索此系列：' +
						'<select class="series">' +
						'<option value="0">请选择</option>' +
						'<option value="1" selected>显示</option>' +
						'<option value="2">隐藏</option>' +
						'</select>' +
						'</td>' +
						'<td>系列链接：<input type="text" class="serieslink" value="' + $(this).attr("href") + '"/></td>' +
						'<td colspan="2">显示位置：' +
						'<select class="seriesweizhi">' +
						'<option value="">请选择</option>' +
						'<option value="left">居左</option>' +
						'<option value="center" selected>居中</option>' +
						'<option value="right" >居右</option>' +
						'</select>' +
						'</td>' +
						'</tr>';
				} else {
					html += '<tr>' +
						'<td>探索此系列：' +
						'<select class="series">' +
						'<option value="0">请选择</option>' +
						'<option value="1" selected>显示</option>' +
						'<option value="2">隐藏</option>' +
						'</select>' +
						'</td>' +
						'<td>系列链接：<input type="text" class="serieslink" value="' + $(this).attr("href") + '"/></td>' +
						'<td colspan="2">显示位置：' +
						'<select class="seriesweizhi">' +
						'<option value="">请选择</option>' +
						'<option value="left" selected>居左</option>' +
						'<option value="center" >居中</option>' +
						'<option value="right" >居右</option>' +
						'</select>' +
						'</td>' +
						'</tr>';
				}
			} else {
				html += '<tr>' +
					'<td>探索此系列：' +
					'<select class="series">' +
					'<option value="0">请选择</option>' +
					'<option value="1">显示</option>' +
					'<option value="2" selected>隐藏</option>' +
					'</select>' +
					'</td>' +
					'<td style="display:none">系列链接：<input type="text" class="serieslink"/></td>' +
					'<td colspan="2" style="display:none">显示位置：' +
					'<select class="seriesweizhi">' +
					'<option value="">请选择</option>' +
					'<option value="left">居左</option>' +
					'<option value="center">居中</option>' +
					'<option value="right">居右</option>' +
					'</select>' +
					'</td>' +
					'</tr>';
			}
		}
		else if(typeid==7){
			html += '<tr>' +
						'<td colspan="4">请输入产品链接：<input type="text" class="productlink"/></td>' +
					'</tr>';
		}
	})
	$("#dialog-index .dialog-table").html(html);
		var that=$(this);
			$( "#dialog-index" ).dialog({
			autoOpen: true,
			resizable: false,
			width:1000,
			height:460,
			modal: true,
			draggable:false,
			buttons: {
				"确定": function() {
					//标题
				$(".onetitle").each(function() {
					var hvalue = $(this).val();
					var hindex = $(".onetitle").index(this);
					that.parents(".template").find("[typeid='2']").eq(hindex).html(hvalue);

				})
				$(".onecolor").each(function() {
					var cvalue = $(this).val();
					var cindex = $(".onecolor").index(this);
					that.parents(".template").find("[typeid='2']").eq(cindex).css("color", cvalue)
				})
				$(".onefont").each(function() {
					var fvalue = $(this).val();
					var findex = $(".onefont").index(this);
					that.parents(".template").find("[typeid='2']").eq(findex).css("font-size", fvalue)
				})
				$(".oneweizhi").each(function() {
						var wvalue = $(this).val();
						var windex = $(".oneweizhi").index(this);
						that.parents(".template").find("[typeid='2']").eq(windex).css("text-align", wvalue)
					})
					//描述
				$(".twotitle").each(function() {
					var hvalue = $(this).val();
					var hindex = $(".twotitle").index(this);
					that.parents(".template").find("[typeid='3']").eq(hindex).html(hvalue);
				})
				$(".twocolor").each(function() {
					var cvalue = $(this).val();
					var cindex = $(".twocolor").index(this);
					that.parents(".template").find("[typeid='3']").eq(cindex).css("color", cvalue)
				})
				$(".twofont").each(function() {
					var fvalue = $(this).val();
					var findex = $(".twofont").index(this);
					that.parents(".template").find("[typeid='3']").eq(findex).css("font-size", fvalue)
				})
				$(".twoweizhi").each(function() {
						var wvalue = $(this).val();
						var windex = $(".twoweizhi").index(this);
						that.parents(".template").find("[typeid='3']").eq(windex).css("text-align", wvalue)
					})
				//图片
				$(".imgsrc").each(function() {
					var imgvalues = $(this).val();
					var imgindex = $(".imgsrc").index(this);
					that.parents(".template").find("[typeid='1']").eq(imgindex).attr("src", imgvalues)
				
					
				})
				$(".imglink").each(function() {
						var imglinkvalue = $(this).val();
						var imglinkindex = $(".imglink").index(this);
						that.parents(".template").find("[typeid='5']").eq(imglinkindex).attr("href", imglinkvalue)
					})
					//探索此系列
				if($(".series").val() == 1) {
					that.parents(".template").find(".go_series").css("display", "block");
					that.parents(".template").find(".go_series").attr("href", $(".serieslink").val());
					if($(".seriesweizhi").val() == "left") {
						that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_left")
					} else if($(".seriesweizhi").val() == "center") {
						that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_center")
					} else {
						that.parents(".template").find(".series_names").removeClass().addClass("series_names conTemplate_right")
					}
				} else {
					that.parents(".template").find(".go_series").css("display", "none")
				}
				//系列小花
				//系列
				if($(".series_img_position").val()=="2"){
					//居右
					that.parents(".template").find(".details_mainPicture_left").css("float","right")
					
				}else{
					that.parents(".template").find(".details_mainPicture_left").css("float","left")
				}
				$(".bgcolor").each(function() {
					var bgcolorvalue = $(this).val();
					var bgcolorindex = $(".bgcolor").index(this);
					that.parents(".template").find(".details_mainPicture").css("background",bgcolorvalue)
				})
				//详情页
				$(".productlink").each(function() {
					var wvalue = $(this).val();
					var windex = $(".productlink").index(this);
					$(".template").find("[typeid='7']").eq(windex).attr("href",wvalue)
				})
				$(this).dialog("close").find(".dialog-table").html("");
	        },
	        "取消": function() {
	          $( this ).dialog( "close" );
					}
	      }
	    });
    })
	//编辑时用的函数
	$(".dialog-table").on("change",".series",function(){
		if($(this).val() == 1) {
			$(this).parent().siblings("td").show();
		  } else if($(this).val() == 2) {
			$(this).parent().siblings("td").hide();
		  }
	})
	//pc轮播图
	$("#dialog-index").on("click",".lbtshow",function(){
			var html2 = '<tr>' +
			'<td colspan="2">' +
			'图片：<img src="" class="slt-pic"/><input type="text" class="imgsrc" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
			'</td>' +
			'<td colspan="2">链接：<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
			'</tr>' +
			'<tr>' +
			'<td>' +
			'标题：<input type="text" class="onetitle" />' +
			'</td>' +
			'<td>颜色：<input type="text" class="onecolor" /></td>' +
			'<td>大小：<input type="text" class="onefont" /></td>' +
			'<td>位置：' +
			'<select class="oneweizhi">' +
			'<option value="">请选择</option>' +
			'<option value="left">居左</option>' +
			'<option value="center">居中</option>' +
			'<option value="right">居右</option>' +
			'</select>' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td>' +
			'副标题：<input type="text" class="twotitle"/>' +
			'</td>' +
			'<td>颜色：<input type="text" class="twocolor" /></td>' +
			'<td>大小：<input type="text" class="twofont" /></td>' +
			'<td>位置：' +
			'<select class="twoweizhi">' +
			'<option value="">请选择</option>' +
			'<option value="left">居左</option>' +
			'<option value="center">居中</option>' +
			'<option value="right">居右</option>' +
			'</select>' +
			'<button type="button" class="btn red delectimg">删除</button>' +
			'</td>' +
			'</tr>';
		var lihtml = '<li>' +
			'<a href="" target="_blank">' +
			'<img src=""  typeid="1" class="lazy">' +
			'<div class="text_box">' +
			'<p class="first " typeid="2"></p>' +
			'<p class="second " typeid="3"></p>' +
			'</div>' +
			'</a>' +
			'</li>';
		//var htmlTable = $(".dialog-table").html();
		$(".dialog-table").prepend(html2);
		//同时模板中也要增加相对应的点位
		$(".template").find(".list_box").append(lihtml);
		$(".template").find(".point_box").append("<li></li>");
	})
	//手机的轮播图
	$("#dialog-index").on("click",".mlbtshow",function(){
		var html2 = '<tr>' +
		'<td colspan="2">' +
		'图片：<img src="" class="slt-pic"/><input type="text" class="imgsrc" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
		'</td>' +
		'<td colspan="2">链接：<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
		'</tr>' +
		'<tr>' +
		'<td>' +
		'标题：<input type="text" class="onetitle" />' +
		'</td>' +
		'<td>颜色：<input type="text" class="onecolor" /></td>' +
		'<td>大小：<input type="text" class="onefont" /></td>' +
		'<td>位置：' +
		'<select class="oneweizhi">' +
		'<option value="">请选择</option>' +
		'<option value="left">居左</option>' +
		'<option value="center">居中</option>' +
		'<option value="right">居右</option>' +
		'</select>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td>' +
		'副标题：<input type="text" class="twotitle"/>' +
		'</td>' +
		'<td>颜色：<input type="text" class="twocolor" /></td>' +
		'<td>大小：<input type="text" class="twofont" /></td>' +
		'<td>位置：' +
		'<select class="twoweizhi">' +
		'<option value="">请选择</option>' +
		'<option value="left">居左</option>' +
		'<option value="center">居中</option>' +
		'<option value="right">居右</option>' +
		'</select>' +
		'<button type="button" class="btn red delectimg">删除</button>' +
		'</td>' +
		'</tr>';
		var lihtml = '<a href="#" target="_blank" class="swiper-slide" typeid="5">'+
					'<img src="" alt="" typeid="1">'+
					'<div class="lb_text">'+
					'<h2 class="first pit_white" typeid="2">I Do TOWER系列</h2>'+
					'<p class="second pit_white" typeid="3">演绎法式浪漫风情</p>'+
					'</div>'+
					'</a>';
		//var htmlTable = $(".dialog-table").html();
		$(".dialog-table").prepend(html2);
		//同时模板中也要增加相对应的点位
		$(".template").find(".swiper-wrapper").append(lihtml);
	})
	$(".dialog-table").on("click",".delectimg",function(){
		var numbe = Math.ceil($(this).parents("tr").index() / 3);
		$(".template").find(".list_box li").eq(numbe - 1).remove();
		$(".template").find(".point_box li").eq(numbe - 1).remove();
		$(this).parents("tr").prev("tr").prev("tr").remove();
		$(this).parents("tr").prev("tr").remove();
		$(this).parents("tr").remove();
	})
	//产品至少5张图片pc
	$("#dialog-index").on("click",".addproimg",function(){
			var html2 = '<tr>' +
			'<td>' +
			'标题：<input type="text" class="onetitle" />' +
			'</td>' +
			'<td>颜色：<input type="text" class="onecolor" /></td>' +
			'<td>大小：<input type="text" class="onefont" /></td>' +
			'<td>位置：' +
			'<select class="oneweizhi">' +
			'<option value="">请选择</option>' +
			'<option value="left">居左</option>' +
			'<option value="center">居中</option>' +
			'<option value="right">居右</option>' +
			'</select>' +
			'<button type="button" class="btn red delectimg">删除</button>' +
			'</td>' +
			'</tr>'+
			'<tr  class="trborder">' +
			'<td colspan="2">' +
			'图片：<input type="text" class="imgsrc" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
			'</td>' +
			'<td colspan="2">链接：<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
			'</tr>';
			
		var lihtml ='<a class="imgbox" typeid="5">'+
						'<p class="bg">'+
						'<span class="bg_text conTemplate_dark_grey"  typeid="2"></span>'+
						'</p>'+
							'<img src="" alt="" typeid="1" class="lazy">'+
						'</a>';
		$(".dialog-table").prepend(html2);
		//同时模板中也要增加相对应的点位
		$(".template").find("#movebox").append(lihtml);
	})
	//手机至少五张
	$("#dialog-index").on("click",".maddproimg",function(){
		var html2 ='<tr  class="trborder">' +
		'<td colspan="2">' +
		'图片：<input type="text" class="imgsrc" /><a class="imgchoose"><i class="fa fa-file-image-o" data-toggle="modal" data-target="#myModal"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a>' +
		'</td>' +
		'<td colspan="2">链接：<input type="text" class="imglink" /><a class="linkchoose"><i class="fa fa-paper-plane"></i></a><a class="deleteval"><i class="fa fa-trash-o"></i></a></td>' +
		'</tr>';
		var lihtml ='<a href="">'+
					'<img src="" alt="" typeid="1">'+
					'</a>';
		$(".dialog-table").prepend(html2);
		//同时模板中也要增加相对应的点位
		$(".template").find(".template_two .img_box").append(lihtml);
	})
	$(".dialog-table").on("click",".delectproimg",function(){
		$(this).parents("tr").next("tr").remove();
		$(this).parents("tr").remove();
	})

    //删除
    $(".here").on("click",".delTpl", function() {
      $(this).parents(".template").remove();
		})
		//链接库
		$(".dialog-table").on("click",".linkchoose",function(){
			var thats=$(this);
			$("#modallink").dialog({
				autoOpen: true,
				resizable: false,
				width:1000,
				height:460,
				modal: true,
				draggable:false,
				buttons:{
				"确定":function(){
					var linkdetail=$("input[name='linkradio']:checked").parents("tr").find(".linkdetail").text();
					thats.siblings(".imglink").val(linkdetail)
					$(this).dialog('close');
				},
				"取消":function(){$(this).dialog('close');}
				}
			})
		})
		$(".dialog-table").on("click",".deleteval",function(){
			$(this).siblings("input").val("")
		})
		//图片库
		$(".dialog-table").on("click",".imgchoose",function(){
			var thats=$(this);
			$("#imggroup").dialog({
				autoOpen: true,
				resizable: false,
				width:1000,
				height:600,
				modal: true,
				draggable:false,
				buttons:{
				"确定":function(){
					var imglurl=$(".activeborder").find("img").attr("src");
					thats.siblings(".imgsrc").val(imglurl);
					thats.siblings(".slt-pic").attr("src",imglurl)
					$(this).dialog('close');
				},
				"取消":function(){$(this).dialog('close');}
				}
			})
		})
})
window.onload = function () {
	$( "#catalog>ul>li" ).draggable({
		appendTo: "body",
		helper: "clone",
		cursor: "Move"
	});
  var count = 0;
    $('.lb-left').on('click',function  () {
      $('.lb-right').show();
      if(count == 0){
        count == 0;
        $(this).hide();
      }else(
        count++
      )
      var moveWidth = $(window).innerWidth()/5 * count;
      $('#movebox').animate({'left':moveWidth});
    })
    $('.lb-right').on('click',function  () {
      $('.lb-left').show();
      if(count <= -($('.imgbox').length-5)){
        count = -($('.imgbox').length-5);
        $(this).hide();
      }else{
        count--;
      }
      var moveWidth = $(window).innerWidth()/5 * count;
      $('#movebox').animate({'left':moveWidth});
    })
    $("#movebox").on("mouseover","a",function(){
		$(this).find("p").css('display','block')
	})
	$("#movebox").on("mouseout","a",function(){
		$(this).find("p").css('display',' none')
	})
    $(".modelandfour_right a").hover(function(){
		if($('.four_bg_text').html() !== ""){
            $(this).find("p").css('display','block')
        }
    },function(){
        $(this).find("p").css('display','none')
    });
};