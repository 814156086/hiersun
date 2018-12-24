import '../css/public.css';
import '../css/user-center.css';
import $ from 'n-zepto';
import {rand, signName, setSto, getSto, cartCount, allSto, showImgLayer, cancelImgLayer, rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

var ID = getSto("deciveID");
var vipNo = getSto("vipNo");
if (!ID) {
    var rnd = rand(rand(1, 100), rand(1, 10000));
    var timestamp = Date.now() + new Date(rnd);
    var md5_timestamp = md5(timestamp);

    setSto("deciveID", md5_timestamp);
    ID = md5_timestamp;
}

//个人中心展示
(function () {
    var iBtn = true;//控制刚登录时头像显示开关

    if (parseInt(vipNo)) {
        show(vipNo, iBtn);
        $('.user-center-detail>a').css('display', 'block');
    }
})();

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

console.log(allSto());

//购物车数量
cartCount();


//判断登录与否
var vipNo = getSto("vipNo");

if (!vipNo) {//未登录
    //判断参数
    var mobile = GetQueryString('mobile');
    var type = GetQueryString('type');
    // 如果满足条件就直接登陆进去
    if (mobile !== "" && type == "wechat") {
        (function () {
            $.ajax({
                type: 'post',
                url: apiUrl + '/login',
                data: {
                    mobile: mobile,
                    type: type
                },
                success: function (data) {
                    if (data.head.code) {
                        var vipNo = data.body.memberNo;
                        setSto("token", data.body.token);
                        setSto("vipNo", vipNo);
                        setSto("nickname", data.body.nickName);
                        var tab = GetQueryString('tab');
                        if (tab == 'perinfo') {
                            location.href = 'info.html';
                        } else if (tab == 'order') {
                            location.href = 'my-order-all-order.html';
                        }
                    }


                },
                error: function (err) {
                    console.log(err);
                }
            });

        })();

    } else {
        //弹出登录框
        var oLogCon = $('.opacity');
        var oImg = $('.login>li>img');
        var ID = getSto("deciveID");
        oLogCon.css('display', 'block');
        setTimeout(function () {
            oLogCon.css('opacity', 1);
            $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
        }, 50);

    }

}

//判断是否登录点击注册
(function () {
    var oBtn = $('.user-center-info');//头像
    var oBtn2 = $('.custom a');//我的定制栏
    var oBtn3 = $('.info a');//个人信息栏
    var oBtn4 = $('.address a');//收货地址栏
    var oP = $('.opacity');
    var oX = $('.opacity>header a');
    var oImg = $('.login>li>img');

    $(oImg).on('click', function () {
        $(this).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
    });

    oBtn.on('click', function () {
        var vipNo = sessionStorage.getItem("vipNo");
        if (parseInt(vipNo)) {
            return;
        }
        oP.css('display', 'block');
        setTimeout(function () {
            oP.css('opacity', 1);
            $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
        }, 50);
    });

    oBtn2.on('click', function () {
        var vipNo = sessionStorage.getItem("vipNo");
        if (!parseInt(vipNo)) {
            oP.css('display', 'block');
            setTimeout(function () {
                oP.css('opacity', 1);
                $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
            }, 50);
            return false;
        }
    });

    oBtn3.on('click', function () {
        var vipNo = sessionStorage.getItem("vipNo");
        if (!parseInt(vipNo)) {
            oP.css('display', 'block');
            setTimeout(function () {
                oP.css('opacity', 1);
                $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
            }, 50);
            return false;
        }
    });

    oBtn4.on('click', function () {
        var vipNo = sessionStorage.getItem("vipNo");
        if (!parseInt(vipNo)) {
            oP.css('display', 'block');
            setTimeout(function () {
                oP.css('opacity', 1);
                $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
            }, 50);
            return false;
        }
    });
    //关闭注册层
    oX.on('click', function () {
        oP.css('opacity', 0);
        setTimeout(function () {
            oP.css('display', 'none');
        }, 500);
        return false;
    });
})();

var reg = /^((1[0-9]{1})+\d{9})$/;

//登录
(function () {
    var oLogin = $('.login-btn');
    var oImg = $('.login>li>img');
    var oBtn = $('.logout');
    oLogin.on('click', function () {
        var iSign = $('.sign').val();
        var iTel = $('.tel').val();
        var iCode = $('.code').val();
        var oP = $('.opacity');
        var iBtn = false;//控制刚登录时头像显示开关

        if (iTel == '' || iCode == '') {
            alert('手机号或验证码不能为空！');
        } else {
            $.ajax({
                type: 'post',
                url: apiUrl + '/login',
                data: {
                    mobile: iTel,
                    captcha: iCode,
                    captchaNo: iSign,
                    random: ID
                },
                success: function (data) {
                    if (data.head.code) {
                        alert(data.head.message);
                        $(oImg).get(0).src = apiUrl + '/pic?t=' + Date.now() + '&random=' + ID;
                        // return;
                    } else {
                        $(oLogin).attr("disabled", "disabled");
                    }
                    var vipNo = data.body.memberNo;
                    sessionStorage.setItem("token", data.body.token);
                    sessionStorage.setItem("vipNo", vipNo);
                    setSto("firstLogin", 'true');
                    sessionStorage.setItem("nickname", data.body.nickName);
                    iBtn = true;
                    show(vipNo, iBtn);
                    //alert(data.head.message);

                    //购物车数量
                    cartCount();

                    $(oBtn).css('display', 'block');
                    $('.user-center-detail>a').css('display', 'block');

                    oP.css('opacity', 0);
                    setTimeout(function () {
                        oP.css('display', 'none');
                    }, 510);
                    location.href = 'index.html?userStatus=' + data.body.userStatus;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
})();

function show(vipNo, iBtn) {
    var oImg = $('.user-center-info>img');
    var oH = $('.user-center-name>h3');
    var oP = $('.user-center-name>p');
    var oWaitPay = $('.user-center-status li.wait-pay span');
    var oWaitGet = $('.user-center-status li.wait-get span');
    var oUnfinishedCustomNum = $('.user-center-list>li.custom span');
    showImgLayer('数据请求中...');
    var token = getSto('token');
    var vipNo = getSto('vipNo');
    $.ajax({
        type: 'post',
        headers: signName(md5, vipNo, token),
        url: apiUrl + '/member/center',
        data: {
            memberNo: vipNo
        },
        success: function (data) {
            if (data.head.code) {
                if (data.head.code == 71982) {
                    rmSto('nickname');
                    rmSto('timestamp');
                    rmSto('token');
                    rmSto('vipNo');
                    alert('出现错误，请重新登录！');
                    // location.href='user-center.html';
                }
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            //console.log('data::',data);
            cancelImgLayer();
            //个人信息
            if (iBtn) {
                $(oImg).attr('src', data.body.avatar);
            }
            $(oH).html(data.body.nickname);
            $(oP).html(data.body.mobile);
            //订单数量展示
            var data = data.body;
            var waitPayNumL = data.waitPayNum;//待付款
            var waitReceiveNumL = data.waitReceiveNum;//待收货
            var unfinishedCustomNumL = data.unfinishedCustomNum;//定制未完成订单数
            cartCount(oWaitPay, waitPayNumL);
            cartCount(oWaitGet, waitReceiveNumL);
            $('.custom').on('click', function () {
                setSto('redTip', 'false');
            });
            if (!getSto('redTip')) {
                setSto('redTip', 'true');
            }
            if (unfinishedCustomNumL && getSto('redTip') == 'true') {
                $(oUnfinishedCustomNum).css('display', 'block');
            } else if (unfinishedCustomNumL && getSto('redTip') == 'false') {
                $(oUnfinishedCustomNum).css('display', 'none');
            } else if (!unfinishedCustomNumL) {
                $(oUnfinishedCustomNum).css('display', 'none');
            }
        },
        error: function (err) {
            console.log(err);
            cancelImgLayer();
            return;
        }
    });
    function cartCount(obj, num) {
        $(obj).css('display', 'block');
        $(obj).text(num);
        if (num == 0) {
            $(obj).css('display', 'none');
        } else if (num > 9) {//如果数量大于9
            $(obj).addClass('active');
            if (num > 99) {
                $(obj).text('99+');
            }
        } else {
            $(obj).removeClass('active');
        }
    }
}
