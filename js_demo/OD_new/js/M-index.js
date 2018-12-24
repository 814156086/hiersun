(function(){
    // var arr1 = {};
    // $.ajax({
    //     type : "get",  
    //     url :'http://test.ido-love.com/article-recommend',
    //     dataType: 'jsonp',
    //     jsonp: 'callback',
    //     async : false,
    //     success : function(data) {
    //         var data = data.articles;
    //         var str='';
    //         var indexNum =0;
    //         //  var redata = eval("(" + data + ")");
    //         data.forEach(function(item,index){
    //             arr1+=item;
    //             indexNum++;
    //             str += `<div class="swiper-slide" data-id=${item.id}>${indexNum}</div>`;
    //         })
    //         $('.swiper-wrapper').html(str);
    //     },
    //     error: function(xhr, status, error) {
    //         //alert(xhr.responseText);  
    //     }
    // });
    // console.log(arr1);
    
    // var ajaxRquest = $.ajax('http://test.ido-love.com/article-recommend', {
    //     type: 'get',
    //     dataType: 'jsonp',
    //     jsonp: 'callback',
    //     // crossDomain: true,
    //     async: false,
    //     success: function (data) {
    //         // console.log(data.articles)
    //     arr1.push(data.articles);
    //     console.log(data.articles);
    //     },
    //     error: function(XMLHttpRequest, status) {
    //         switch (status){
    //             case 'error':
    //                 alert("用户名或密码错误");
    //                 break;
    //             case 'timeout':
    //                 alert("连接超时");
    //                 break;
    //             default:
    //                 alert("访问异常，请重新登录！");
    //                 break;
    //         }
    //     }
    // });

 
})()