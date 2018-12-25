$(function(){
  		/* var dialoghtml='<div class="mbtngroup">'+
			'<div class="mlinkbox">宽：<input type="text" class="mwidths" /></div>'+
			'<div class="mlinkbox">高：<input type="text" class="mheights" /></div>'+
			'<div class="mlinkbox">链接网址：<input type="text" name="mlink" value="http://"></div>'+
			'<button type="button" class="btn purple maddmylink">添加</button>'+
			'</div>';
  		//添加自定义布局
  		$("#mcustom_module").click(function(){
  			var divhtml='<div class="mmyhtml  clearfix">'+
  			'<div class="mimg_box"><img src=""/></div>'+
  			'<div class="mfixedbtn btn-group-vertical">'+
  			'<a class="btn purple meditpic">编辑图片</a>'+
			'<a class="btn purple maddlinks">添加链接</a>'+
			'<a class="btn purple mdeletemoban">删除模板</a>'+
  			'</div>'+
  			dialoghtml+
  			'</div>';
  			$(".mpagehtml").append(divhtml);
  		}); */
  		//添加链接弹层
  		$(".here").on("click",".meditpic",function(){
			var thisone=$(this);
  			$("#imggroup").dialog({
	  				autoOpen: true,
						resizable: false,
						width:1000,
						height:460,
						modal: true,
						draggable:false,
            buttons:{
            "确定":function(){
				var activeimgurl=$(".activeborder").find("img").attr("src");
				var activeimgheight=$(".activeborder").find("img").siblings(".mimgheight").val();
				thisone.parents(".mmyhtml").find(".mimg_box img").attr("src",activeimgurl);
				thisone.parents(".mmyhtml").find(".mimg_box").css("height",activeimgheight);
				thisone.parents(".mmyhtml").css("height",activeimgheight);
				$(this).dialog('close');
            },
            "取消":function(){$(this).dialog('close');}
            }
       })
  		})
  		//添加图片
  		$(".here").on("click",".maddlinks",function(){
			  $(this).parents(".mmyhtml").find(".mbtngroup").show();
			  $(this).parents(".mmyhtml").find(".mfixedbtn").hide();
		  })
		//删除模板
		$(".here").on("click",".mdeletemoban",function(){
			$(this).parents(".mmyhtml").remove();
		})
  		//添加链接
  		var obj = null ;//定义标签对象的全局变量，目的用于编辑
  		$(".here").on("click",".maddmylink",function(){
  			var mlink = $(this).parent(".mbtngroup").find("input[name=mlink]").val();//取得超链接
		    var mwidths=$(this).parent(".mbtngroup").find(".mwidths").val();
			var mheights=$(this).parent(".mbtngroup").find(".mheights").val();
			var mxiaoneng=$(this).parent(".mbtngroup").find(".mxiaoneng").val();
			var maddview=$(this).parent(".mbtngroup").find(".maddview").val();
			var mviewimg=$(this).parent(".mbtngroup").find(".mviewimg").val();
			var mviewval=$(this).parent(".mbtngroup").find(".mviewval").val();
		   /*  var html = 
		    '<p class="mmaodian" style="width:'+mwidths+'%;height:'+mheights+'%;position:absolute;left:0%;top:0%">'+
		    '<a target="_blank" href="'+mlink+'" style="width:100%;height:100%;display:block">'+
			'</a></p>'; *///组装P标签
			if(mxiaoneng==1 && maddview!=1){//链接到小能并且无视频
				var html = 
				'<p class="mmaodian" style="width:'+mwidths+'%;height:'+mheights+'%;">'+
				'<a onclick="NTKF.im_openInPageChat();">'+
				'</a></p>';//组装P标签
			}else if(mxiaoneng==0 && maddview!=1){//不连接小能并且无视频
				var html = 
				'<p class="mmaodian" style="width:'+mwidths+'%;height:'+mheights+'%;">'+
				'<a target="_blank" href="'+mlink+'">'+
				'</a></p>';//组装P标签
			}else if(mxiaoneng==1 && maddview==0){
				var html = 
				'<p class="mmaodian" style="width:'+mwidths+'%;height:'+mheights+'%;">'+
				'<a onclick="NTKF.im_openInPageChat();">'+
				'</a></p>';//组装P标签
			}else{
				var html=
				'<p class="mmaodian" style="width:'+mwidths+'%;height:'+mheights+'%;">'+
				'<img src="'+mviewimg+'" alt="" class="maddImg lazy">'+
				'<video src="'+mviewval+'" style="object-fit:fill;display:none" width="100%" height="100%" controls="controls" class="madVideo"></video>'+
				'</p>'
			}
			$(this).parents(".mmyhtml").find(".mimg_box").append(html); //添加到img_box div中，即图片的后面
			$(this).parents(".mbtngroup").hide();
			$(this).parents(".mmyhtml").find(".mfixedbtn").show();
  		})
			$("#mhere").delegate(".mmaodian","mousedown",function(e){
					obj = $(this);//把当前标签对象赋值给变量
			    if(obj.setCapture){ //用于兼容非准浏览器
			     obj.setCapture();
				}
				var reletiveheight=parseInt(obj.parents(".mmyhtml").css("height"));
				//console.log(obj.css("width"))
				var _w=obj.css("width").split('px');
				var _h=obj.css("height").split('px');
				obj.parents(".mmyhtml").find("input[name=mlink]").val(obj.find("a").attr("href"));//把点中标签的链接加到链接本框中
				$(".mwidths").val(_w[0]/375*100);
				$(".mheights").val(_h[0]/375*100);
				if(!$(".mmaodian a").attr("href")){
					obj.parents(".mmyhtml").find(".mxiaoneng").val("0");
				}else{
					obj.parents(".mmyhtml").find(".mxiaoneng").val("1");
				}
				if(obj.find("img").hasClass("maddImg")){
					obj.parents(".mmyhtml").find(".maddview").val("1");
					obj.parents(".mmyhtml").find(".mviewimg").val(obj.find("img").attr("src"));
					obj.parents(".mmyhtml").find(".mviewval").val(obj.find("video").attr("src"));

				}
			     var _x = e.pageX - obj.offset().left;//取得鼠标到标签左边left的距离
			     var _y = e.pageY - obj.offset().top; //取得鼠标到标签顶部top的距离
			     var oWidth = $(this).outerWidth(); //取得标签的宽，包括padding
			     var oHeight = $(this).outerHeight();//取得标签的高，包括padding
			     var x=0,y=0; //定义移动的全局变量
			     obj.parents(".mmyhtml").find(".mimg_box").bind("mousemove",function(e){
			      var img_position = obj.parents(".mmyhtml").find(".mimg_box").offset(); //取得图片的位置
			      x = (e.pageX -_x - img_position.left)/375*100; //计算出移动的x值
				  y = (e.pageY -_y - img_position.top)/reletiveheight*100; //计算出移动的y值
			      if(x<0){ //如果移动小于0，证明移到了图片外，应设为0
			       x = 0;
			      }else if(x>(obj.parents(".mmyhtml").find(".mimg_box").width()-oWidth)){
			      //如果移动大于图片的宽度减去标签的宽度，证明移到了图片外，应该设为可用的最大值
			       x = (obj.parents(".mmyhtml").find(".mimg_box").width()-oWidth)/375*100;
			      }
			 
			      if(y<0){ //同上
			       y = 0;
			      }else if(y>(obj.parents(".mmyhtml").find(".mimg_box").height()-oHeight)){
			       y = (obj.parents(".mmyhtml").find(".mimg_box").height()-oHeight)/reletiveheight*100;;
			      }
			      obj.css({"left":x+"%","top":y+"%"});
			     });
			 
			     obj.parents(".mmyhtml").find(".mimg_box").bind("mouseup",function(){ //绑定鼠标左键弹起事件
			      obj.parents(".mmyhtml").find(".mimg_box").unbind("mousemove"); //移动mousemove事件
			      $(this).unbind("mouseup"); //移动mouseup事件
			      if(obj.releaseCapture){ //兼容非标准浏览器
			      obj.releaseCapture();
			     }
			      
			     });
			     return false; //用于选中文字时取消浏览器的默认事件
				 
			})
			 $(".here").delegate(".mmaodian","dblclick",function(){//绑定双击事件
		    $(this).remove(); //删除当前标签
		   })
		 
		   //$("#show").click(function(){//绑定编辑按钮
		     //更新内容到标签
		    //obj.find("a").attr("href",$("input[name=mlink]").val()).css({width:$(".mwidths").val(),height:$(".mheights").val()});
		  // })
		  
		   $(".here").delegate("a","click",function(){ //取消a标签的单击默认事件
		    return false;
		   })  
		    //链接库
			$(".here").on("click",".linkchoose",function(){
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
						thats.siblings(".linkval").val(linkdetail)
						$(this).dialog('close');
					},
					"取消":function(){$(this).dialog('close');}
					}
				})
			})
			//判断是否为小能客服
			$(".here").on("click",".mxiaoneng",function(){
				if($(this).val()==1){
					$(this).parents(".mlinkbox").next().hide();
					$(this).parents(".mbtngroup").find(".maddview").val("0");
					$(this).parents(".mbtngroup").find(".mviewsp").hide();
				}else{
					$(this).parents(".mlinkbox").next().show(); 
				}
			})
			//判断是否有视频
			$(".here").on("click",".maddview",function(){
				if($(this).val()==1){
					$(this).parents(".mbtngroup").find(".mviewsp").show();
				}else{
					$(this).parents(".mbtngroup").find(".mviewsp").hide();
				}
			})
  	})