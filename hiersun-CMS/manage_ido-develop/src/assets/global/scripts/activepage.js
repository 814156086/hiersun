$(function(){
  		/* var dialoghtml='<div class="btngroup">'+
			'<div class="linkbox">宽：<input type="text" class="widths" /></div>'+
			'<div class="linkbox">高：<input type="text" class="heights" /></div>'+
			'<div class="linkbox">链接网址：<input type="text" name="link" value="http://"></div>'+
			'<button type="button" class="btn purple addmylink">添加</button>'+
			'</div>'; */
  		//添加自定义布局
  		/* $("#custom_module").click(function(){
  			var divhtml='<div class="myhtml">'+
  			'<div class="img_box"><div class="centerhtml"></div></div>'+
  			'<div class="fixedbtn">'+
  			'<a class="btn purple editpic">编辑图片</a>'+
			'<a class="btn purple addlinks">添加链接</a>'+
			'<a class="btn purple deletemoban">删除模板</a>'+
  			'</div>'+
  			dialoghtml+
  			'</div>';
  			$(".pagehtml").append(divhtml);
  		}); */
  		//添加链接弹层
  		$(".here").on("click",".editpic",function(){
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
				var activeimgheight=$(".activeborder").find("img").siblings(".imgheight").val();
				console.log(activeimgheight)
				thisone.parents(".myhtml").css("background",'url('+activeimgurl+') no-repeat top center')
				thisone.parents(".myhtml").find(".img_box").css("height",activeimgheight);
				thisone.parents(".myhtml").css("height",activeimgheight);
				$(this).dialog('close');
            },
            "取消":function(){$(this).dialog('close');}
            }
       })
  		})
  		//添加图片
  		$(".here").on("click",".addlinks",function(){
  			$(this).parents(".myhtml").find(".btngroup").show();
		  })
		//删除模板
		$(".here").on("click",".deletemoban",function(){
			$(this).parents(".myhtml").remove();
		})
		//隐藏链接
		$(".here").on("click",".cancellink",function(){
			$(this).parents(".btngroup").hide();
		})
  		//添加链接
  		var obj = null ;//定义标签对象的全局变量，目的用于编辑
  		$(".here").on("click",".addmylink",function(){
  			var link = $(this).parent(".btngroup").find("input[name=link]").val();//取得超链接
		    var widths=$(this).parent(".btngroup").find(".widths").val();
			var heights=$(this).parent(".btngroup").find(".heights").val();
			var xiaoneng=$(this).parent(".btngroup").find(".xiaoneng").val();
			var addview=$(this).parent(".btngroup").find(".addview").val();
			var viewimg=$(this).parent(".btngroup").find(".viewimg").val();
			var viewval=$(this).parent(".btngroup").find(".viewval").val();
			if(xiaoneng==1 && addview!=1){//链接到小能并且无视频
				var html = 
				'<p class="maodian" style="width:'+widths+'px;height:'+heights+'px;">'+
				'<a onclick="NTKF.im_openInPageChat();">'+
				'</a></p>';//组装P标签
			}else if(xiaoneng==0 && addview!=1){//不连接小能并且无视频
				var html = 
				'<p class="maodian" style="width:'+widths+'px;height:'+heights+'px;">'+
				'<a target="_blank" href="'+link+'">'+
				'</a></p>';//组装P标签
			}else if(xiaoneng==1 && addview==0){
				var html = 
				'<p class="maodian" style="width:'+widths+'px;height:'+heights+'px;">'+
				'<a onclick="NTKF.im_openInPageChat();">'+
				'</a></p>';//组装P标签
			}else{
				var html=
				'<p class="maodian" style="width:'+widths+'px;height:'+heights+'px;">'+
				'<img src="'+viewimg+'" alt="" class="addImg lazy">'+
				'<video src="'+viewval+'" style="object-fit:fill;display:none" width="100%" height="100%" controls="controls" class="adVideo"></video>'+
				'</p>'
			}
		    
			$(this).parents(".myhtml").find(".img_box").append(html); //添加到img_box div中，即图片的后面
			$(this).parents(".btngroup").hide();
  		})
			$(".here").delegate(".maodian","mousedown",function(e){
					obj = $(this);//把当前标签对象赋值给变量
			    if(obj.setCapture){ //用于兼容非准浏览器
			     obj.setCapture();
				}
				var _w=obj.css("width").split('px');
				var _h=obj.css("height").split('px');
				obj.parents(".myhtml").find("input[ame=link]").val(obj.find("a").attr("href"));//把点中标签的链接加到链接本框中
				$(".widths").val(_w[0]);
				$(".heights").val(_h[0]);
				if(!obj.find("a").attr("href")){
					obj.parents(".myhtml").find(".xiaoneng").val("0");
				}else{
					obj.parents(".myhtml").find(".xiaoneng").val("1");
				}
				if(obj.find("img").hasClass("addImg")){
					obj.parents(".myhtml").find(".addview").val("1");
					obj.parents(".myhtml").find(".viewimg").val(obj.find("img").attr("src"));
					obj.parents(".myhtml").find(".viewval").val(obj.find("video").attr("src"));

				}
			     var _x = e.pageX - obj.offset().left;//取得鼠标到标签左边left的距离
			     var _y = e.pageY - obj.offset().top; //取得鼠标到标签顶部top的距离
			     var oWidth = $(this).outerWidth(); //取得标签的宽，包括padding
			     var oHeight = $(this).outerHeight();//取得标签的高，包括padding
			     var x=0,y=0; //定义移动的全局变量
			     obj.parents(".myhtml").find(".img_box").bind("mousemove",function(e){
			      var img_position = obj.parents(".myhtml").find(".img_box").offset(); //取得图片的位置
			      x = e.pageX -_x - img_position.left; //计算出移动的x值
			      y = e.pageY -_y - img_position.top; //计算出移动的y值
			      if(x<0){ //如果移动小于0，证明移到了图片外，应设为0
			       x = 0;
			      }else if(x>(obj.parents(".myhtml").find(".img_box").width()-oWidth)){
			      //如果移动大于图片的宽度减去标签的宽度，证明移到了图片外，应该设为可用的最大值
			       x = obj.parents(".myhtml").find(".img_box").width()-oWidth;
			      }
			 
			      if(y<0){ //同上
			       y = 0;
			      }else if(y>(obj.parents(".myhtml").find(".img_box").height()-oHeight)){
			       y = obj.parents(".myhtml").find(".img_box").height()-oHeight;
			      }
			      obj.css({"left":x,"top":y});
			     });
			 
			     obj.parents(".myhtml").find(".img_box").bind("mouseup",function(){ //绑定鼠标左键弹起事件
			      obj.parents(".myhtml").find(".img_box").unbind("mousemove"); //移动mousemove事件
			      $(this).unbind("mouseup"); //移动mouseup事件
			      if(obj.releaseCapture){ //兼容非标准浏览器
			      obj.releaseCapture();
			     }
			      
			     });
			     return false; //用于选中文字时取消浏览器的默认事件
				 
			})
			 $(".here").delegate(".maodian","dblclick",function(){//绑定双击事件
		    $(this).remove(); //删除当前标签
		   })
		  
		   $(".here").delegate("a","click",function(){ //取消a标签的单击默认事件
		    return false;
		   })  
		   //链接弹层
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
			$(".here").on("click",".xiaoneng",function(){
				if($(this).val()==1){
					$(this).parents(".linkbox").next().hide();
					$(this).parents(".btngroup").find(".addview").val("0");
					$(this).parents(".btngroup").find(".viewsp").hide();
				}else{
					$(this).parents(".linkbox").next().show(); 
				}
			})
			//判断是否有视频
			$(".here").on("click",".addview",function(){
				if($(this).val()==1){
					$(this).parents(".btngroup").find(".viewsp").show();
				}else{
					$(this).parents(".btngroup").find(".viewsp").hide();
				}
			})
  	})