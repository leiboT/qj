$(function(){
        //异步再封装
    function customAjax(url,data,fn){
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                console.log(error)
            }
        })
    }
    //加载商品详情
    customAjax(
        "http://api.qianjiantech.com/v1/productInfo",
        {product_id:sessionStorage.getItem("productId")},
        function(res){
            if(res.code==2000){
                var htmlProIntro="";
                $(res.info.goods_detail).each(function(k,v){
                    htmlProIntro+=`
                            <li class="borderBottom4">
                                <img src="${v}" alt="" class="img-response">
                            </li>
                        `;
                });
                $(".productIntroBox").html(htmlProIntro);
                var html="";
                $(res.info.goods_rotation).each(function(k,v){
                    html+=`
                            <div class="swiper-slide">
                                <img src="${v}" alt="" class="img-response"/>
                            </div>
                        `;
                });
                $(".productDetailImg").html(html);
                new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
                $(".shopName").text(res.info.address);
                $(".productTitle").text(res.info.describe);
                $(".sale").text("已售:"+res.info.sell_count);
                $(".presentPrice").text("￥"+res.info.shop_price);
                $(".presentIntegral").text("赠送积分:"+res.info.market_price);
            }
        }
    );

    var addCart=$(".addCart");
    var coverBg=$(".cover-bg");
    var proInfoBox=$(".pro-info-box");
    var proInfoClose=$(".pro-info-close");
    var items=$(".items");
    var proInfoConfirm=$(".pro-info-footer");
    var number=$("#number");
    var muiToast=$(".mui-toast");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }

    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }

    //预载购物车头部信息处理
    var preloadCart=function(ele){
        $(".pro-img").html(`<img src="${ele.attr('data-img')}" class="img-response"/>`);
        $(".price-cart").text("￥"+ele.attr("data-price"));
        $(".inventory-cart").text("库存 "+ele.attr("data-number"))
        $(".classify-cart").text("已选择"+ele.text());
    };

    //点击加入购物车处理
    addCart.click(function(){
        if(sessionStorage.getItem("uid")&&sessionStorage.getItem("stateCode")){
            customAjax(
                "http://api.qianjiantech.com/v1/mayAddShopCart",
                {product_id:sessionStorage.getItem("productId")},
                function(res){
                    console.log(res);
                    if(res.code==2000){
                        console.log(res.info);
                        var html="";
                        $(res.info).each(function(k,v){
                            console.log(v);
                            html+=`
                            <li aria-checked="false" data-number="${v.number}" data-price="${v.price}" data-stockId="${v.stock_id}" data-img="${v.img_url}">
                                ${v.attr}
                            </li>
                        `;
                        });
                        $(".items").html(html);
                        var firstItem=$(".items>li").eq(0);
                        firstItem.addClass("checked").attr("aria-checked",true);
                        preloadCart(firstItem);
                    }
                }
            );
            coverBg.attr("style","display:block;");
            proInfoBox.attr("style","transform: translate3d(0,0,0);");
            //数量复位
            $("#number").val(1)
        }else{
            reminderDeal("请先登录！");
            closeBtn.text("进入登录页");
            closeBtn.on("click",function(){
                jump("../../loginRegisterHTML/login.html",0);
            });
        }
    });

    //请登录
    $(".cart-link").click(function(e){
        if(!sessionStorage.getItem("uid")&&!sessionStorage.getItem("stateCode")){
            e.preventDefault();
            reminderDeal("请先登录！");
            closeBtn.text("进入登录页");
            closeBtn.on("click",function(){
                jump("../../loginRegisterHTML/login.html",0);
            });
        }

    });

    //预载购物车弹出样式处理
    var cartStyleDeal=function(){
        coverBg.attr("style","");
        proInfoBox.attr("style","")
    };

    //关闭预载购物车
    proInfoClose.click(function(){
        cartStyleDeal();
    });

    //点击其他区域关闭预载购物车
    coverBg.mouseup(function(e){
        if(proInfoBox != e.target && proInfoBox.has(e.target).length === 0){
            cartStyleDeal();
        }
    });

    //子选项选择处理
    items.on("click","li",function(){
        $(this).addClass("checked").attr("aria-checked",true).siblings(".checked").removeClass("checked").attr("aria-checked",false);
        preloadCart($(this));
    });

    //购物车加入成功或者错误提示处理
    var addCartWarn=function(txt){
        muiToast.attr("style","display:block;")&&muiToast.html(`<span>${txt}</span>`)&&setTimeout(function(){$(".mui-toast").attr("style","display:none;")},1500);
    };

    //确定可提交处理
    var confirmCanSubmit=function(){
        customAjax(
            "http://api.qianjiantech.com/v1/addShopCart",
            {
                user_id:sessionStorage.getItem("uid"),
                shop_id:sessionStorage.getItem("shopId"),
                product_id:sessionStorage.getItem("productId"),
                state_code:sessionStorage.getItem("stateCode"),
                count: $("#number").val(),
                stock_id: $(".checked").attr("data-stockid")
            },
            function(res){
                console.log(res);
                switch (res.code){
                    case 2000:
                        addCartWarn("加入购物车成功");
                        break;
                    case 2001:
                        addCartWarn("加入失败,请重试");
                        break;
                    case 9000:
                        console.log("已在其他设备登录");
                        reminderDeal("已在其他设备登录");
                        closeBtn.text("即将进入登录页!");
                        jump("../../loginRegisterHTML/login.html",1500);
                        sessionStorage.clear();
                        break;
                }

            }
        )
    };

    //确定按钮处理
    proInfoConfirm.click(function(){
        var judge=false;
        $($(".items>li")).each(function(k,v){
            judge=$(v).attr("aria-checked")!="false" || judge;
        });
        judge?
            confirmCanSubmit() || cartStyleDeal()
            :
            addCartWarn("请选择分类")
    });


    //数量加减
    $(".quantity-wrapper").on("click","li",function(){
        var val=number.val();
        switch ($(this).attr("id")){
            case "decrease":
                val<=1?val=1:val--;
                number.val(val);
                break;
            case "increase":
                val++;
                number.val(val);
                break;
        }
    })
});