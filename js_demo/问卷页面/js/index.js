//在页面上呈现后台传过来的input类型
$.ajax({
    type: 'post',
    headers: signName(md5, vipNo, token),
    url: apiUrl + '/member/questionnaire/query',
    async:false,
    data: {
        memberNo: vipNo
    },
    success: function (data) {
        var data = data.body.quest;
        var obj = eval('(' + data + ')');
        var str = '';
        var i = 0;
        i++
        // console.log(data)
        if(obj == [] || obj == ''){
            $('#sub').css('display','none');
        }
        obj.forEach(function (item, index) {
            if (obj[index].pant != 'checkbox' && obj[index].pant != 'radio') {
                str += `<div titleid=${item.titleId.id} class="textBox distance"  openOption= ${item.titleId.openOption}>${item.titleId.title}:
                    <input type='text' style='border:none;border-bottom:black solid 1px;width: 150px;height: 20px'titleid=${item.titleId.id} id="text1">                  
                    </div>`;
            } else {
                str += `<div class="distance" titleid=${item.titleId.id} openOption= ${item.titleId.openOption}>
                        <h3 class="surveyIN">${item.titleId.title}</h3></div>`;
                item.options.forEach(function (i, ind) {

                    str += `<span titleid="${i.titleId}" ><input titleid="${i.titleId}" type="${item.pant}"class="input_check ${i.titleId}" name="${i.titleId}" id="${i.id}">${i.option}</span>`;
                })
                // //点击后name不同
                // $('.input_check').on('click',function () {
                //     var titleId=$(this).attr('titleid');
                //
                //     var id = $(this).attr('id');
                //     $("div[openoption="+id+"]").each(function () {
                //         str += `<div class="distance" titleid=${item.titleId.id} openOption= ${item.titleId.openOption}>
                //         <h3 class="surveyIN">${item.titleId.title}</h3></div>`;
                //         item.options.forEach(function (i, ind) {
                //             str += `<span titleid="${i.titleId}" ><input titleid="${i.titleId}" type="${item.pant}"class="input_check ${i.titleId}" name="${i.titleId}" id="${i.id}">${i.option}</span>`;
                //         })
                //     })
                // })
                // //点击后name相同
                // $('.input_check').on('click',function () {
                //     var titleId=$(this).attr('titleid');
                //     $("input[titleid="+titleId+"]").each(function (i,itemTitle) {
                //         var idT = $(itemTitle).attr("id");
                //         $(".distance").each(function(i,title){
                //             var openoption = $(title).attr("openoption");
                //             str += `<div class="distance" titleid=${item.titleId.id} openOption= ${item.titleId.openOption}>
                //         <h3 class="surveyIN">${item.titleId.title}</h3></div>`;
                //             item.options.forEach(function (i, ind) {
                //
                //                 str += `<span titleid="${i.titleId}" ><input titleid="${i.titleId}" type="${item.pant}"class="input_check ${i.titleId}" name="cheecked" id="${i.id}">${i.option}</span>`;
                //             })
                //         })
                //     })
                //
                // })





            }
        });
        $('.container').html(str);
        //隐藏‘送宝贝’下面所有的问题跟答案
        $('.container').children().each(function(i,titll){
            if($(this).attr('titleid')==5 || $(this).attr('titleid')==6 || $(this).attr('titleid')==7 || $(this).attr('titleid')==8 ){
                $(this).hide();
            }
        })
        //点击显示
        $('.input_check').on('click',function () {
            var titleId=$(this).attr('titleid');
            $("input[titleid="+titleId+"]").each(function (i,itemTitle) {
                var idT = $(itemTitle).attr("id");
                $(".distance").each(function(i,title){
                    var openoption = $(title).attr("openoption");
                    if(idT==openoption){
                        var idOPEN = $(title).attr('titleid');
                        if($(title).is(":visible")){
                            $(title).hide();
                            $("span[titleid="+idOPEN+"]").hide();

                        }
                    }
                })
            })
            var id = $(this).attr('id');
            $("div[openoption="+id+"]").each(function () {
                var titleid = $(this).attr('titleid')
                $("span[titleid="+titleid+"]").show();
                $(this).show();
            })
        })

        //点击提交问卷
        var radiolen = $('input[type="text"]').attr('value');
        var spCodesTemp = "";
        var item = obj.length;
        // console.log(obj[2].options[0].id)
        $('.sub').on('click',function(){
            //$('.sub').click(function () {
            //将选中的id放到一个input text中
            var checkedItem = false;
            obj.forEach(function (item, index) {
                var checklen = $('input[titleid="'+(index+1)+'"]:checked').length;
                console.log(radiolen);
                // alert(checklen)
                if(checklen==0){
                    checkedItem = true;
                    return false;
                }
            });
            if (!checkedItem) {
                alert('选项不能为空')
            }else {
                testchecked()
                function testchecked() {
                    var spCodesTemp = "";
                    $('input[class="input_check"]:checked').each(function (i) {
                        if (0 == i) {
                            spCodesTemp = $(this).val();
                        } else {
                            // spCodesTemp +=(',' + $('.distance').titleId)
                            spCodesTemp += ("," + $(this).val());//选中了前两个，输出的就是0,1(这里的数字根据数据库数据形式可能由不同的输出)
                            alert(spCodesTemp)
                        }
                    })
                    $("#instructionType").val(spCodesTemp)//这里将选中的id放到一个input text中，并设置隐藏，来方便上传数据
                    console.log($("#instructionType").val(spCodesTemp))
                    // $.ajax({
                    //     type: 'post',
                    //     headers: signName(md5, vipNo, token),
                    //     url: apiUrl + '/member/questionnaire/save',
                    //     data: {
                    //         memberNo: vipNo,
                    //         id: spCodesTemp
                    //     },
                    //     success: function (data) {
                    //         window.location.reload();
                    //
                    //     },
                    //     error: function (err) {
                    //         console.log(err);
                    //     }
                    // });
                }
            }


        })
    },
    error: function (err) {
        console.log(err);
    }
});