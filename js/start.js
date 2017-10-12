$(function(){
    //轮播盒子
    var carouselBox=$(".carousel-box");
    //首页分类盒子
    var navBox=$("ul.nav-box");
    //公告信息盒子
    var noticeBox=$("div.noticeTxt-box ul");
    //每个公告的width
    var noticeWidth=$("div.noticeTxt-box li").width();
    //移动距离
    var move=0;
    //var city=sessionStorage.getItem("position");
    //if(city)
    //    $(".address").html(city+`<i class="iconfont icon-arrowdownb"></i>`);
    //判断android or ios
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //异步再封装
    //function customAjax(url,data,fn){
    //    //alert(JSON.stringify(arguments));
    //    $.ajax({
    //        type:"post",
    //        url:url,
    //        data:data,
    //        dataType:"json",
    //        success:fn,
    //        error:function(error){
    //            //console.log(error)
    //        },
    //        beforeSend: function(){
    //            $('body').append('<div class="loadingWrap"></div>');
    //        },
    //        complete: function(){
    //            $(".loadingWrap").remove();
    //        }
    //    })
    //}

    //调转到搜索页
    $("#searchDemo").click(function(){
        location.href="smallFeatureHTML/search.html"
    });
    //判断轮播图片加载完成
    //function imgLoadingEnd(boxSelector,fnc,loadingBox){
    //    var imgList = $(boxSelector).find('img');
    //    var callback = function(){
    //        fnc();
    //        $(loadingBox).hide();
    //    };
    //    var check = (function (count, fn){
    //        return function(){
    //            count--;
    //            if(count == 0){
    //                fn();
    //            }
    //        };
    //    })(imgList.length, callback);
    //    imgList.each(function(){
    //        $(this).bind('load', check).attr('src', $(this).attr('data-img')).show();
    //    });
    //}
    ////图片加载完清除占位图
    //function clearPlaceholderShape(){
    //    $(".ui-fb").each(function(k,v){
    //        $(v).load(function(){
    //            $(this).parent().removeClass("ui-lz");
    //        })
    //    });
    //}

    //加载首页分类
    function loadSort(){
        $.customAjax(
            "http://api.qianjiantech.com/v1/class",
            {},
            function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var len=info.length;
                    for(var i= 0,html="";i<len;i++){
                        var jump=info[i].jump;
                        if(len<=4){
                            html+=`
                    <li class="x4">
                        <a href="startHTML/${
                                jump=='house'?'houseHTML/houseIndex':jump=='car'?'carHTML/carIndex':jump=='food'?'caterHTML/caterIndex':jump=='hotel'?'hotelHTML/hotelIndex':jump=='tourism'?'travelHtml/travelIndex':jump=='education'?'educateHTML/educateIndex':jump=='health'?'healthHTML/healthIndex':jump=='Fine'?'boutiqueHTML/boutiqueIndex':jump=='about_us'?'aboutHTML':'moreHTML/moreIndex'}.html" data-classifyClassId="${info[i].id}">
                                <div class="ui-lz rv nav-img">
                                    <img src="${info[i].img_url}" alt="${info[i].class_name}" data-img="${info[i].img_url}" class="ui-fb"/>
                                </div>
                            <span>${info[i].class_name}</span>
                        </a>
                    </li>
                    `
                        }else if(len==5){
                            html+=`
                    <li class="x5">
                        <a href="startHTML/${
                                jump=='house'?'houseHTML/houseIndex':jump=='car'?'carHTML/carIndex':jump=='food'?'caterHTML/caterIndex':jump=='hotel'?'hotelHTML/hotelIndex':jump=='tourism'?'travelHtml/travelIndex':jump=='education'?'educateHTML/educateIndex':jump=='health'?'healthHTML/healthIndex':jump=='Fine'?'boutiqueHTML/boutiqueIndex':jump=='about_us'?'aboutHTML':'moreHTML/moreIndex'}.html" data-classifyClassId="${info[i].id}">
                            <img src="" alt="${info[i].class_name}" data-img="${info[i].img_url}"/>
                            <span>${info[i].class_name}</span>
                        </a>
                    </li>`;
                        }else{
                            html+=`
                    <li class="x5">
                        <a href="startHTML/${
                                jump=='house'?'houseHTML/houseIndex':jump=='car'?'carHTML/carIndex':jump=='food'?'caterHTML/caterIndex':jump=='hotel'?'hotelHTML/hotelIndex':jump=='tourism'?'travelHtml/travelIndex':jump=='education'?'educateHTML/educateIndex':jump=='health'?'healthHTML/healthIndex':jump=='Fine'?'boutiqueHTML/boutiqueIndex':jump=='about_us'?'aboutHTML':'moreHTML/moreIndex'}.html" data-classifyClassId="${info[i].id}">
                            <img src="" alt="${info[i].class_name}" data-img="${info[i].img_url}"/>
                            <span>${info[i].class_name}</span>
                        </a>
                    </li>`;
                            navBox.width(20*len+"%");
                        }
                    }
                    navBox.html(html);
                    $.clearPlaceholderShape();
                }
            }
        );
    }
    loadSort();

    //保存分类ID值
    $(navBox).on("click","li>a",function(){
        sessionStorage.setItem("allClassId",$(this).attr("data-classifyClassId"));
    });

    //公告移动处理函数
    function noticeMove(distance){
        var timer=setInterval(function(){
            var noticeTxt=$("div.noticeTxt-box li");
            //拿到公告盒子 第一条公告
            var no1=$(noticeTxt).eq(0);
            move-=distance;
            if(-move>noticeWidth){
                move=0;
                //将第一条公告移除并添加到末尾
                no1.remove().appendTo(noticeBox);
            }
            $(noticeBox).css({
                "margin-left":move+"px"
            });
        },20);
    }
    noticeMove(1);

    //轮播图
    function carousel(){
        $.customAjax(
            "http://api.qianjiantech.com/v1/rotation",
            {},
            function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var len=info.length;
                    for(var k=0,html='';k<len;k++){
                        html+=`
                        <a href="#" class="swiper-slide">
                           <img src="" class="img-response" data-img="${info[k].img_url}"/>
                        </a>
                    `;
                    }
                    carouselBox.html(html);
                    $.imgLoadingEnd(
                        ".carousel-box",
                        function(){
                            new Swiper('.swiper-container', {
                                //pagination: '.swiper-pagination',
                                scrollbar:'.swiper-scrollbar',
                                scrollbarHide : false,
                                scrollbarDraggable : true ,
                                scrollbarSnapOnRelease : true ,
                                paginationClickable: true,
                                loop: true,
                                autoplayDisableOnInteraction: false,
                                autoplay: 3000
                            })
                        },
                        ".loadingImg1"
                    );

                    //每个轮播图的width
                    //var carouselWidth=$("ul.carousel-box li").width();
                    //var i=0;
                    //var cloneFirst=$("ul.carousel-box li").first().clone();
                    //$(carouselBox).append(cloneFirst);
                    //var num=$("ul.carousel-box li").length;
                    //$(carouselBox).width(100*num+"%");
                    //$("ul.carousel-box li").width((1/num)*100+"%");
                    //
                    //var carouselDotBox=$("ul.carousel-dot");
                    //for(var j=0,html='';j<num-1;j++){
                    //    html+=`
                    //    <li></li>
                    //`;
                    //}
                    //
                    //$(carouselDotBox).html(html);
                    //$("ul.carousel-dot li").first().addClass("activeBg");
                    //
                    //function task(){
                    //    i++;
                    //    if (i == num) {
                    //        i = 1;
                    //        $(carouselBox).css({left: 0});
                    //        $(carouselBox).animate({left: -i * carouselWidth },500);
                    //    }
                    //    $(carouselBox).animate({left: -i * carouselWidth },500);
                    //
                    //    if (i==num-1) {
                    //        $('ul.carousel-dot li').eq(0).addClass('activeBg').siblings().removeClass('activeBg');
                    //    }else{
                    //        $('ul.carousel-dot li').eq(i).addClass('activeBg').siblings().removeClass('activeBg');
                    //    }
                    //}
                    //setInterval(task,4000);
                }
            }
        );
    }
    carousel();

    //进入获取当前城市
        //获取用户所在城市信息
    function showCityInfo() {
        $(".address").html("定位中...");
        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                //maximumAge:60000,
                noIpLocate:3,
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition:'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
            sessionStorage.setItem("userPosition",[data.position.lng,data.position.lat]);
            //sessionStorage.setItem("position",[data.position.lng,data.position.lat]);
            var userCity=data.addressComponent.city;
            sessionStorage.setItem("userDistrict",userCity);
            $(".address").html(`
                        <a>
                            ${userCity}
                            <!--<i class="iconfont icon-arrowdownb"></i>-->
                        </a>
                    `)
        }

        //解析定位错误信息
        function onError(data) {
            //$(".address").html("定位失败");
            var citySearch = new AMap.CitySearch();
            //自动获取用户IP，返回当前城市
            citySearch.getLocalCity(function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.city && result.bounds) {
                        var lngLat=result.rectangle.split(";")[0].split(",");
                        sessionStorage.setItem("userPosition",[lngLat[0],lngLat[1]]);
                        var cityInfo = result.city;
                        $(".address").html(cityInfo);
                        //var cityBounds = result.bounds;
                        //地图显示当前城市
                        //map.setBounds(cityBounds);
                    }
                }
            });
            sessionStorage.setItem("userDistrict","东莞市");
        }
    }
    sessionStorage.getItem("userDistrict")?$(".address").html(sessionStorage.getItem("userDistrict")) : showCityInfo();

    //加载特别推荐
    function loadYouLick(){
        $.customAjax(
            "http://api.qianjiantech.com/v1/recommend",
            {},
            function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var html="";
                    $(info).each(function(k,v){
                        html+=`
                            <li class="productBox rv" data-productId="${v.product_id}" data-shopId="${v.shop_id}" data-classId="${v.product_class_id}">
                                <div class="productPicture rv ui-lz">
                                    <img src="${v.img_url}" alt="${v.product_id}" data-img="${v.img_url}" class="ui-fb"/>
                                </div>
                                <ul class="productDescription">
                                    <li class="productName">${v.product_name}</li>
                                    <li class="productLook em0_8">${v.describe}</li>
                                    <li class="presentIntegral em0_8">赠送积分：${v.market_price.length>4?v.market_price.substring(0,v.market_price.length-4)+"万":v.market_price.length>8?v.market_price.substring(0,v.market_price.length-8)+"亿":v.market_price}</li>
                                    <li class="productPrice em0_9">
                                        <div class="presentPrice">￥${v.shop_price.length>4?v.shop_price.substring(0,v.shop_price.length-4)+"万":v.shop_price.length>8?v.shop_price.substring(0,v.shop_price.length-8)+"亿":v.shop_price}</div>
                                        <div class="sale">已售：${v.sell_count}</div>
                                    </li>
                                </ul>
                            </li>
                        `;
                    });
                    $(".productContainer").html(html);
                    $.clearPlaceholderShape();
                }

            }
        );
    }
    loadYouLick();

    //跳转商品详情页
    $(".productContainer").on("click",".productBox",function(){
        sessionStorage.setItem("productId",$(this).attr("data-productId"));
        if($(this).attr("data-classId")==3){
            sessionStorage.setItem("shopId",$(this).attr("data-shopId"));
            sessionStorage.setItem("allClassId",$(this).attr("data-classId"));
            location.href="startHTML/caterHTML/cpd.html";
        }else
            location.href="startHTML/12/productDetailPage.html";
    })
});