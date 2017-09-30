$(function(){
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }
    //切换商品和商家介绍
    $("#shopProAndInfo>li").click(function(){
        $(this).addClass("activeColor").siblings().removeClass("activeColor");
        console.log($(this).index());
        $("#shopProAndInfoDetail>ul").eq($(this).index()).addClass("show").siblings().addClass("die").removeClass("show");
    });
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
    //加载商家信息
    customAjax(
        "http://api.qianjiantech.com/v1/shopIntroduction",
        {shop_id:sessionStorage.getItem("shopId")},
        function(res){
            console.log(res);
            if(res.code==2000){
                $(".shopName").html(res.info.shop_name);
                $(".shopAddress").html(res.info.address);
                $(".shopIntro").html(res.info.ad);
                var html="";
                $(res.info.show.rotation).each(function(k,v){
                    html+=`
                            <div class="swiper-slide">
                                <img src="${v}" alt="" class="img-response"/>
                            </div>
                        `;
                });
                $(".productDetailImg").html(html);
                new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    loop:true,
                    loopSlider:10,
                    autoplayDisableOnInteraction : false,
                    autoplay: 2500
                });
            }
        }
    );
    //加载商家产品
    customAjax(
        "http://api.qianjiantech.com/v1/shopGoods",
        {
            user_id:sessionStorage.getItem("uid"),
            state_code:sessionStorage.getItem("stateCode"),
            shop_id:sessionStorage.getItem("shopId")
        },
        function(res){
            console.log(res);
            if(res.code==2000){
                var html="";
                $(res.info).each(function(k,v){
                    html+=`
                            <li class="productBox" data-proId="${v.product_id}">
                                <div class="productPicture">
                                    <img src="${v.img_url}" alt=""/>
                                </div>
                                <ul class="productDescription">
                                    <li class="productName">厚街香肠</li>
                                    <li class="productLook em0_8">${v.describe}</li>
                                    <li class="presentIntegral em0_8">赠送积分:${v.market_price}</li>
                                    <li class="productPrice em0_9">
                                        <div class="presentPrice">￥${v.shop_price}</div>
                                        <div class="sale">已售：${v.count}</div>
                                    </li>
                                </ul>
                            </li>
                        `;
                });
                $(".productContainer").html(html);
            }else if(res.code==9000){
                reminderDeal("你已在其他设备登录!");
                closeBtn.html("即将进入登录页").unbind("click");
                jump("../../loginRegisterHTML/login.html",1500);
                sessionStorage.clear();
            }
        }
    );
    //进入商品详情页
    $(".productContainer").on("click",".productBox",function(){
        sessionStorage.setItem("productId",$(this).attr("data-proId"));
        location.href="cpd.html";
    })
});