webpackJsonp([43], {
    0: function (e, t, a) {
        e.exports = a(31)
    }, 31: function (e, t, a) {
        "use strict";

        function s(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function o(e, t, a) {
            return t in e ? Object.defineProperty(e, t, {
                value: a,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = a, e
        }

        function l(e, t, a) {
            switch (e) {
                case"y ":
                    return a.setFullYear(a.getFullYear() + t), a;
                case"q ":
                    return a.setMonth(a.getMonth() + 3 * t), a;
                case"m ":
                    return a.setMonth(a.getMonth() + t), a;
                case"w ":
                    return a.setDate(a.getDate() + 7 * t), a;
                case"d ":
                    return a.setDate(a.getDate() + t), a;
                case"h ":
                    return a.setHours(a.getHours() + t), a;
                case"m ":
                    return a.setMinutes(a.getMinutes() + t), a;
                case"s ":
                    return a.setSeconds(a.getSeconds() + t), a;
                default:
                    return a.setDate(d.getDate() + t), a
            }
        }

        a(2), a(82);
        var n = a(3), i = s(n), r = a(1), c = s(r), u = a(4), f = s(u);
        (0, r.getSto)("vipNo"), !function () {
            var e = (0, r.getSto)("prevurl", (0, r.prevUrl)());
            e ? (0, i.default)("header>a").attr("href", e) : ((0, i.default)("header>a").attr("href", (0, r.prevUrl)()), (0, r.setSto)("prevurl", (0, r.prevUrl)()))
        }(), function () {
            (0, i.default)(".normal>span").on("click", function () {
                location.href = "jump.html"
            })
        }(), function () {
            var e = ((0, i.default)(".order-detail>.goods-detail>img"), (0, i.default)(".style"), (0, i.default)(".material"), (0, i.default)(".size"), (0, i.default)(".lettering"), (0, i.default)(".order-num")),
                t = (0, i.default)(".order-date"), a = (0, i.default)(".geter span"), s = (0, i.default)(".geter em"),
                d = (0, i.default)(".detail-adress p"), n = (0, i.default)(".tips"), u = (0, i.default)(".express"),
                p = (0, i.default)(".express-name"), m = (0, i.default)(".express-num"),
                h = (0, i.default)(".express-step"), y = (0, i.default)(".express-step ul"),
                v = (0, i.default)(".status-bar>ul"), g = (0, i.default)(".goods-price em"),
                k = (0, i.default)(".coupon-price em"), x = (0, i.default)(".need-pay em"),
                b = (0, i.default)(".comments li.comments-detail>div >p"),
                S = (window.location.search, sessionStorage.getItem("vipNo")), N = sessionStorage.getItem("token"),
                L = (0, i.default)(".goods-wrap"), C = "", N = (0, r.getSto)("token");
            i.default.ajax({
                type: "post",
                headers: (0, r.signName)(f.default, S, N),
                url: c.default + "/shoporder/detail",
                data: {memberNo: S, orderNo: (0, r.url_search)().orderNo, statusCode: (0, r.url_search)().statusCode},
                success: function (D) {
                    var w = D.body.dzCreated;
                    (0, i.default)("#dzdate1").html(w);
                    var z = new Date((0, i.default)("#dzdate1").html()), j = l("d ", 3, z), T = j.toLocaleDateString(),
                        _ = "" + T;
                    (0, i.default)("#dzdate2").html(_);
                    var z = new Date((0, i.default)("#dzdate2").html()), j = l("d ", 3, z), I = j.toLocaleDateString(),
                        _ = "" + I;
                    (0, i.default)("#dzdate3").html(_);
                    var z = new Date((0, i.default)("#dzdate3").html()), j = l("d ", 3, z), P = j.toLocaleDateString(),
                        _ = "" + P;
                    (0, i.default)("#dzdate4").html(_);
                    var z = new Date((0, i.default)("#dzdate4").html()), j = l("d ", 3, z), M = j.toLocaleDateString(),
                        _ = "" + M;
                    (0, i.default)("#dzdate5").html(_);
                    var z = new Date((0, i.default)("#dzdate5").html()), j = l("d ", 3, z), E = j.toLocaleDateString(),
                        _ = "" + E;
                    (0, i.default)("#dzdate6").html(_);
                    var z = new Date((0, i.default)("#dzdate6").html()), j = l("d ", 3, z), U = j.toLocaleDateString(),
                        _ = "" + U;
                    (0, i.default)("#dzdate7").html(_);
                    var z = new Date((0, i.default)("#dzdate7").html()), j = l("d ", 3, z), A = j.toLocaleDateString(),
                        _ = "" + A;
                    (0, i.default)("#dzdate8").html(_);
                    var z = new Date((0, i.default)("#dzdate8").html()), j = l("d ", 3, z), B = j.toLocaleDateString(),
                        _ = "" + B;
                    (0, i.default)("#dzdate9").html(_);
                    var z = new Date((0, i.default)("#dzdate9").html()), j = l("d ", 3, z), F = j.toLocaleDateString(),
                        _ = "" + F;
                    (0, i.default)("#dzdate10").html(_);
                    var z = new Date((0, i.default)("#dzdate10").html()), j = l("d ", 3, z), H = j.toLocaleDateString(),
                        _ = "" + H;
                    (0, i.default)("#dzdate11").html(_);
                    var z = new Date((0, i.default)("#dzdate11").html()), j = l("d ", 3, z), Y = j.toLocaleDateString(),
                        _ = "" + Y;
                    (0, i.default)("#dzdate12").html(_);
                    var z = new Date((0, i.default)("#dzdate12").html()), j = l("d ", 3, z), q = j.toLocaleDateString(),
                        _ = "" + q;
                    if ((0, i.default)("#dzdate13").html(_), D.head.code) return 71982 == D.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(D.head.message);
                    var J, D = D.body, O = D.address, G = D.express, K = D.statusAxis, Q = D.goodsList,
                        R = (D.dates, 10), w = D.dzCreated;
                    switch (R > 13 && (R = 13), J = (0, i.default)("li", "#leftContent").each(function (e) {
                        e < R && ((0, i.default)(".Pink", this).css("opacity", 1), (0, i.default)(".gary", this).css("opacity", 1), (0, i.default)(".progress li span", this).css("opacity", 1))
                    }), document.getElementsByTagName("li"), document.getElementById("leftContent"), console.log((0, r.url_search)()), 20 != (0, r.url_search)().statusCode ? (0, i.default)(".progress").css("display", "none") : (0, i.default)(".progress").css("display", "black"), R) {
                        case 1:
                            J = (0, i.default)("#uniteLi-23").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "20px");
                            break;
                        case 2:
                            J = (0, i.default)("#uniteLi-22").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "80px");
                            break;
                        case 3:
                            J = (0, i.default)("#uniteLi-3").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "140px");
                            break;
                        case 4:
                            J = (0, i.default)("#uniteLi-4").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "210px");
                            break;
                        case 5:
                            J = (0, i.default)("#uniteLi-5").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "280px");
                            break;
                        case 6:
                            J = (0, i.default)("#uniteLi-6").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "340px");
                            break;
                        case 7:
                            J = (0, i.default)("#uniteLi-7").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "410px");
                            break;
                        case 8:
                            J = (0, i.default)("#uniteLi-8").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "470px");
                            break;
                        case 9:
                            J = (0, i.default)("#uniteLi-9").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "540px");
                            break;
                        case 10:
                            J = (0, i.default)("#uniteLi-10").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "600px");
                            break;
                        case 11:
                            J = (0, i.default)("#uniteLi-11").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "670px");
                            break;
                        case 12:
                            J = (0, i.default)("#uniteLi-12").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "730px");
                            break;
                        case 13:
                            J = (0, i.default)("#uniteLi-13").css("opacity", 1), J = (0, i.default)(".pinkLine").css("height", "790px")
                    }
                    (0, i.default)(k).text("-￥" + D.creditPrice), (0, i.default)(g).text("￥" + D.orderPrice), (0, i.default)(x).text("￥" + D.payPrice), (0, i.default)(e).text(D.orderNo), (0, i.default)(t).text(D.created), "" != D.orderComment ? (0, i.default)(b).html(D.orderComment) : (0, i.default)(".comments-detail").css("display", "none"), D.invoiceContent ? (0, i.default)(".invoice-name").html(D.invoiceContent) : (0, i.default)(".invoice-detail").css("display", "none"), (0, i.default)(p).text(G.no), (0, i.default)(m).html('<a href="tel:95543">95543</a>'), (0, i.default)(a).text("收货人：" + O.consignee), (0, i.default)(s).text(O.mobile), (0, i.default)(d).text(O.detail), "" == O.consignee && ((0, i.default)("#gater").css("display", "none"), (0, i.default)("#address").css("display", "none")), Q.forEach(function (e, t) {
                        C += '<div class="pic-info" data-goodsid=' + e.goodsId + ">\n\t                <img src=" + e.picture + ' alt="">\n\t                <ul>\n\t                    <li class="style"><p>' + e.longName + "</p></li>", "" != e.accessoryName && (C += '<li class="ornament"><span>配件：</span><em>' + e.accessoryName + "</em></li>"), C += '<li class="price"><span>￥' + e.salePrice + "</span><em><i>x</i>" + e.goodsNum + "</em></li>", e.comment && (C += '<li class="ornament"><span>备注：</span><em>' + e.comment + "</em></li>"), C += "</ul>\n\t            </div>"
                    }), (0, i.default)(L).html(C), G.infos.length ? (G.infos.forEach(function (e, t) {
                        _ += 0 == t ? '<li class="active"><div class="line-dot"><i></i><span></span></div>' : '<li><div class="line-dot"><i></i><span></span></div>', _ += '<div class="status-detail"><p>' + e.content + "</p><p>" + e.createTime + "</p></div>", _ += "</li>"
                    }), y.html(_)) : ((0, i.default)(".express-step").css({
                        height: "1rem",
                        "line-height": "1rem",
                        "text-align": "center",
                        color: "#000",
                        "font-size": ".14rem"
                    }), (0, i.default)(".express-step").html("暂无物流信息！")), _ = "";
                    var V = 0;
                    if (K) {
                        V = K.length, 2 == V ? (0, i.default)(v).attr("class", "two") : 3 == V ? (0, i.default)(v).attr("class", "three") : 4 == V ? (0, i.default)(v).attr("class", "four") : 5 == V ? (0, i.default)(v).attr("class", "five") : 6 == V ? (0, i.default)(v).attr("class", "six") : 7 == V && (0, i.default)(v).attr("class", "seven");
                        for (var W = 0; W < V; W++) _ += "enable" == K[W][1] ? '<li class="active"><span>' + (W + 1) + "</span><p>" + K[W][0] + "</p></li>" : '<li class=""><span>' + (W + 1) + "</span><p>" + K[W][0] + "</p></li>";
                        v.html(_)
                    }
                    10 == D.statusCode && (0, i.default)(".comments").css("display", "block"), 20 == D.statusCode && (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款："), 21 == D.statusCode && (0, i.default)(".comments").css("display", "block"), 40 != D.statusCode && 30 != D.statusCode || ((0, i.default)(h).css("display", "block"), (0, i.default)(u).css("display", "block"), (0, i.default)(y).css("display", "block"), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 41 == D.statusCode && ((0, i.default)(n).css("display", "block"), (0, i.default)(".tips>h2").text("您的退款已完成，请注意查看付款账户。"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".refund-date").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 31 == D.statusCode && ((0, i.default)(n).css("display", "block"), (0, i.default)(".tips>h2").text("您的退款申请已发出，请耐心等待。"), (0, i.default)(".bottom-btn").css("display", "none"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".refund-date").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 50 == D.statusCode && ((0, i.default)(".sold-server").css("display", "block"), (0, i.default)(".sold-server p").text("售后中"), (0, i.default)(".address").css("display", "none"), (0, i.default)(".status-bar").css("display", "none"), (0, i.default)(".bottom-btn").css("display", "none"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".order-time span").text("申请时间"), (0, i.default)(".order-time em").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 60 == D.statusCode && ((0, i.default)(".sold-server").css("display", "block"), (0, i.default)(".sold-server p").text("售后处理中"), (0, i.default)(".address").css("display", "none"), (0, i.default)(".status-bar").css("display", "none"), (0, i.default)(".bottom-btn").css("display", "none"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".order-time span").text("申请时间"), (0, i.default)(".order-time em").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 61 == D.statusCode && ((0, i.default)(".sold-server").css("display", "block"), (0, i.default)(".sold-server p").text("售后不成立"), (0, i.default)(".address").css("display", "none"), (0, i.default)(".status-bar").css("display", "none"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".order-time span").text("申请时间"), (0, i.default)(".order-time em").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), 70 == D.statusCode && ((0, i.default)(".sold-server").css("display", "block"), (0, i.default)(".sold-server p").text("售后成功"), (0, i.default)(".address").css("display", "none"), (0, i.default)(".status-bar").css("display", "none"), (0, i.default)(".wrap").css("bottom", 0), (0, i.default)(".order-time span").text("申请时间"), (0, i.default)(".order-time em").text(D.date), (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：")), D.invoiceContent || "" != D.orderComment || (0, i.default)(".comments").css("display", "none"), _ = "";
                    var X = D.statusCode, Z = (0, i.default)(".bottom-btn");
                    switch (X) {
                        case 10:
                            _ += '<a href="javascript:;" data-type="cancel" class="s cancel-order" >取消订单</a><em class="pay-money">去支付</em>';
                            break;
                        case 20:
                            _ += '<a href="javascript:;" class="s" ></a><em class="refund">申请退款</em>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 21:
                            _ += '<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a><em class="again-buy">再次购买</em>';
                            break;
                        case 30:
                            _ += '<a href="javascript:;" class="s active" ></a><em class="ok">确认收货</em>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 40:
                            _ += '<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a><em class="again-buy">再次购买</em><em class="server-support">申请售后</em>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 60:
                            _ += '<a href="javascript:;" class="s active" >联系客服</a>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 61:
                            _ += '<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 70:
                            _ += '<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 80:
                            _ += '<a href="javascript:;" class="s active" >联系客服</a>';
                            break;
                        case 31:
                            _ += '<a href="javascript:;" class="s" >联系客服</a><span class="refund">申请退款</span>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        case 41:
                            _ += '<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>', (0, i.default)(".pay-detail>ul>li.need-pay>span").text("实付款：");
                            break;
                        default:
                            _ += '<a href="javascript:;" class="s active" >联系客服</a>'
                    }
                    (0, i.default)(Z).html(_), D.aftersale ? (0, i.default)(".server-support").css("display", "none") : (0, i.default)(".server-support").css("display", "block"), function () {
                        var e = (0, i.default)(".pay-money");
                        e.on("click", function (e) {
                            var t = (0, r.getSto)("token");
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, S, t),
                                url: c.default + "/shoporder/pay",
                                data: {orderNo: (0, r.url_search)().orderNo, memberNo: S},
                                success: function (e) {
                                    if (e.head.code) return 71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message);
                                    var t = e.body.form;
                                    _AP.pay(t)
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        }), event.stopPropagation()
                    }(), function () {
                        var e = (0, i.default)(".again-buy"), t = (0, r.getSto)("token");
                        (0, i.default)(e).on("click", function () {
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, S, t),
                                url: c.default + "/shoporder/buyagain",
                                data: {memberNo: S, orderNo: (0, r.url_search)().orderNo},
                                success: function (e) {
                                    return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : void(location.href = "cart.html?from=index")
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        })
                    }(), function () {
                        function e(e, t) {
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, t, N),
                                url: c.default + "/shoporder/cancel",
                                data: {orderNo: e, memberNo: t},
                                success: function (e) {
                                    return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : void a()
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        }

                        function t(e, t) {
                            l.attr("data-order", e), l.attr("data-type", t), o.css("display", "block"), setTimeout(function () {
                                o.css("opacity", 1)
                            }, 50)
                        }

                        function a() {
                            o.css("opacity", 0), setTimeout(function () {
                                o.css("display", "none"), location.reload()
                            }, 500)
                        }

                        var s = (0, i.default)(".cancel-order"), o = (0, i.default)(".opacity"),
                            l = (0, i.default)(".opacity .con li:last-of-type"),
                            d = (0, i.default)(".opacity .con li:first-of-type");
                        s.on("click", function () {
                            (0, i.default)(".opacity .con a").css("display", "none"), (0, i.default)(".opacity .con h2").text("取消订单"), (0, i.default)(".opacity .con p").text("是否确认取消订单？"), (0, i.default)(".opacity .con").addClass("cancel"), t((0, r.url_search)().orderNo, (0, i.default)(this).get(0).dataset.type)
                        }), l.on("click", function () {
                            var t = sessionStorage.getItem("vipNo");
                            "cancel" == (0, i.default)(this).get(0).dataset.type && e((0, i.default)(this).get(0).dataset.order, t)
                        }), d.on("click", function () {
                            a()
                        })
                    }(), function () {
                        function e(e, t) {
                            var a, s = (0, r.getSto)("token");
                            i.default.ajax((a = {
                                type: "post",
                                headers: (0, r.signName)(f.default, t, s)
                            }, o(a, "headers", (0, r.signName)(f.default, t, s)), o(a, "url", c.default + "/shoporder/delete"), o(a, "data", {
                                orderNo: e,
                                memberNo: t
                            }), o(a, "success", function (e) {
                                return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : void(location.href = (0, i.default)("header>a").attr("href"))
                            }), o(a, "error", function (e) {
                                console.log(e)
                            }), a))
                        }

                        function t(e, t) {
                            d.attr("data-order", e), d.attr("data-type", t), l.css("display", "block"), setTimeout(function () {
                                l.css("opacity", 1)
                            }, 50)
                        }

                        function a() {
                            l.css("opacity", 0), setTimeout(function () {
                                l.css("display", "none"), location.reload()
                            }, 500)
                        }

                        var s = (0, i.default)(".delete-order"), l = (0, i.default)(".opacity"),
                            d = (0, i.default)(".opacity .con li:last-of-type"),
                            n = (0, i.default)(".opacity .con li:first-of-type");
                        s.on("click", function () {
                            (0, i.default)(".opacity .cancel a").css("display", "none"), (0, i.default)(".opacity .con h2").text("删除订单"), (0, i.default)(".opacity .con p").text("是否确认删除订单？"), (0, i.default)(".opacity .con").addClass("cancel"), t((0, r.url_search)().orderNo, (0, i.default)(this).get(0).dataset.type)
                        }), d.on("click", function () {
                            var t = sessionStorage.getItem("vipNo");
                            "delete" == (0, i.default)(this).get(0).dataset.type && e((0, i.default)(this).get(0).dataset.order, t)
                        }), n.on("click", function () {
                            a()
                        })
                    }(), function () {
                        function e(e, t, s) {
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, t, N),
                                url: c.default + "/shoporder/refund",
                                data: {orderNo: e, memberNo: t, reason: s},
                                success: function (e) {
                                    return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : void a()
                                },
                                error: function (e) {
                                    console.log(e), alert(e)
                                }
                            })
                        }

                        function t(e, t) {
                            l.attr("data-order", e), l.attr("data-type", t), o.css("display", "block"), setTimeout(function () {
                                o.css("opacity", 1)
                            }, 50)
                        }

                        function a() {
                            o.css("opacity", 0), setTimeout(function () {
                                o.css("display", "none"), location.reload()
                            }, 500)
                        }

                        var s = (0, i.default)(".refund"), o = (0, i.default)(".opacity"),
                            l = (0, i.default)(".opacity .con li:last-of-type"),
                            d = (0, i.default)(".opacity .con li:first-of-type");
                        s.on("click", function () {
                            (0, i.default)(".opacity .con").addClass("reason"), t((0, r.url_search)().orderNo, (0, i.default)(this).get(0).className)
                        }), l.on("click", function () {
                            var t = sessionStorage.getItem("vipNo"), a = (0, i.default)(".opacity .reason input").val();
                            "refund" == (0, i.default)(this).get(0).dataset.type && e((0, i.default)(this).get(0).dataset.order, t, a)
                        });
                        var n = "", u = (0, i.default)(".opacity input");
                        (0, i.default)(u).on("input", function () {
                            (0, i.default)(this).val().length >= 140 ? ((0, i.default)(this).val(n), alert("字数不能超过140字")) : n = (0, i.default)(this).val()
                        }), d.on("click", function () {
                            a()
                        })
                    }(), function () {
                        function e(e, t, s) {
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, t, N),
                                url: c.default + "/shoporder/aftersale",
                                data: {orderNo: e, memberNo: t, reason: s},
                                success: function (e) {
                                    return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : (a(), void setTimeout(function () {
                                        location.reload(), location.href = "jump.html"
                                    }, 500))
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        }

                        function t(e, t) {
                            l.attr("data-order", e), l.attr("data-type", t), o.css("display", "block"), setTimeout(function () {
                                o.css("opacity", 1)
                            }, 50)
                        }

                        function a() {
                            o.css("opacity", 0), setTimeout(function () {
                                o.css("display", "none"), location.reload()
                            }, 500)
                        }

                        var s = (0, i.default)(".server-support"), o = (0, i.default)(".opacity"),
                            l = (0, i.default)(".opacity .con li:last-of-type"),
                            d = (0, i.default)(".opacity .con li:first-of-type");
                        s.on("click", function () {
                            (0, i.default)(".opacity .con").addClass("reason"), (0, i.default)(".opacity .con h2").text("申请售后"), (0, i.default)(".opacity .con p").text("请在输入框中填写申请售后理由"), t((0, r.url_search)().orderNo, (0, i.default)(this).get(0).className)
                        }), l.on("click", function () {
                            var t = sessionStorage.getItem("vipNo"), a = (0, i.default)(".opacity .reason input").val();
                            "server-support" == (0, i.default)(this).get(0).dataset.type && e((0, i.default)(this).get(0).dataset.order, t, a)
                        });
                        var n = "", u = (0, i.default)(".opacity input");
                        (0, i.default)(u).on("input", function () {
                            console.log(56), (0, i.default)(this).val().length >= 140 ? ((0, i.default)(this).val(n), alert("字数不能超过140字")) : n = (0, i.default)(this).val()
                        }), d.on("click", function () {
                            a()
                        })
                    }(), function () {
                        function e(e, t) {
                            var s = (0, r.getSto)("token");
                            i.default.ajax({
                                type: "post",
                                headers: (0, r.signName)(f.default, t, s),
                                url: c.default + "/shoporder/confirm",
                                data: {orderNo: e, memberNo: t},
                                success: function (e) {
                                    return e.head.code ? (71982 == e.head.code && ((0, r.rmSto)("nickname"), (0, r.rmSto)("timestamp"), (0, r.rmSto)("token"), (0, r.rmSto)("vipNo"), alert("出现错误，请重新登录！"), location.href = "user-center.html"), void alert(e.head.message)) : void a()
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        }

                        function t(e, t) {
                            l.attr("data-order", e), l.attr("data-type", t), o.css("display", "block"), setTimeout(function () {
                                o.css("opacity", 1)
                            }, 50)
                        }

                        function a() {
                            o.css("opacity", 0), setTimeout(function () {
                                o.css("display", "none"), location.reload()
                            }, 500)
                        }

                        var s = (0, i.default)(".ok"), o = (0, i.default)(".opacity"),
                            l = (0, i.default)(".opacity .con li:last-of-type"),
                            d = (0, i.default)(".opacity .con li:first-of-type");
                        s.on("click", function () {
                            (0, i.default)(".opacity .con").removeClass("reason"), (0, i.default)(".opacity .con").removeClass("cancel"), (0, i.default)(".opacity .con input").css("display", "none"), (0, i.default)(".opacity .con h2").text("确认收货"), (0, i.default)(".opacity .con p").text("是否确认已经收到货品？"), t((0, r.url_search)().orderNo, (0, i.default)(this).get(0).className)
                        }), l.on("click", function () {
                            var t = sessionStorage.getItem("vipNo");
                            "ok" == (0, i.default)(this).get(0).dataset.type && e((0, i.default)(this).get(0).dataset.order, t, (0, i.default)(this).get(0).dataset.index)
                        }), d.on("click", function () {
                            a()
                        })
                    }(), "#express" == location.hash && (0, i.default)(".wrap").scrollTop((0, i.default)("#express").offset().top)
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }(), function () {
            (0, i.default)(".normal>span").on("click", function () {
                location.href = "jump.html"
            })
        }()
    }, 82: 2
});