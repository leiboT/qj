$(function(){
    //轮播盒子
    var carouselBox=$(".carousel-box");
    //首页分类盒子
    var navBox=$(".nav-box");
    var city=sessionStorage.getItem("position");
    if(city)
        $(".address").html(`<i class="iconfont icon-arrowdownb"></i>`+city);

    //加载首页分类
    function loadSort(){
        $.ajax({
            type:"post",
            url:"http://api.qianjiantech.com/v1/itemClass",
            data:{class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId")},
            dataType:"json",
            success:function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var len=info.length;
                    for(var i= 0,html="";i<len;i++){
                        var itemId=info[i].item_id;
                        if(len<=4){
                            html+=`
                    <li class="x4">
                        <a href="houseItem.html" data-classId="${itemId}" class="em0_9">
                            <img src="${info[i].item_url}" alt="${info[i].item_name}"/>
                            ${info[i].item_name}
                        </a>
                    </li>
                    `
                        }else if(len==5){
                            html+=
                    `<li class="x5">
                        <a href="houseItem.html" data-classId="${itemId}" class="em0_8">
                            <img src="${info[i].item_url}" alt="${info[i].item_name}"/>
                            ${info[i].item_name}
                        </a>
                    </li>
                    `;
                        }else{
                            html+=
                                `<li class="x5">
                        <a href="houseItem.html" class="em0_8">
                            <img src="${info[i].item_url}" alt="${info[i].item_name}"/>
                            ${info[i].item_name}
                        </a>
                    </li>
                    `;
                            navBox.width(20*len+"%");
                        }
                    }
                    navBox.html(html);
                }
            }
        })
    }
    loadSort();
    //保存房产当前分类ID值
    $(navBox).on("click","li>a",function(){
        sessionStorage.setItem("HouseClassId",$(this).attr("data-classId"));
    });

    //轮播图
    function carousel(){
        $.ajax({
            type:"post",
            url:"http://api.qianjiantech.com/v1/itemBanner",
            data:{class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId")},
            dataType:"json",
            success:function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var len=info.length;
                    for(var k=0,html='';k<len;k++){
                        html+=`
                        <a href="#" class="swiper-slide">
                            <img src="${info[k].img_url}" class="img-response"/>
                        </a>
                    `;
                    }
                    carouselBox.html(html);
                    new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true
                    });
                    //每个轮播图的width
                    //var carouselWidth=$(".carousel-box li").width();
                    //var i=0;
                    //var cloneFirst=$(".carousel-box li").first().clone();
                    //$(carouselBox).append(cloneFirst);
                    //var num=$(".carousel-box li").length;
                    //$(carouselBox).width(100*num+"%");
                    //$(".carousel-box li").width((1/num)*100+"%");
                    //
                    //var carouselDotBox=$(".carousel-dot");
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
        });
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
            var userCity=data.addressComponent.city;
            sessionStorage.setItem("userDistrict",userCity);
            $(".address").html(`
                        <a href="../../smallFeatureHTML/position.html">
                            <i class="iconfont icon-arrowdownb"></i>
                            ${userCity}
                        </a>
                    `)
        }
        //解析定位错误信息
        function onError(data) {
            $(".address").html("定位失败");
        }
    }
    //showCityInfo();

    $(".address").html(`
                        <a href="../../smallFeatureHTML/position.html">
                            <i class="iconfont icon-arrowdownb"></i>
                            ${sessionStorage.getItem("userDistrict")||"东莞市"}
                        </a>
                    `);

    function cutMoney(price){
        if(price){
            return price.length>4?price.substring(0,price.length-4)+"万":price.length>8?price.substring(0,price.length-8)+"亿":price;
        }
    }
    //加载猜你喜欢
    function loadYouLick(){
        $.ajax({
            type:"post",
            url:"http://api.qianjiantech.com/v1/rp",
            data:{class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId") },
            dataType:"json",
            success:function(result){
                var code=result.code;
                if(code==2000){
                    var info=result.info;
                    var html="";
                    $(info).each(function(k,v){
                        html+=`
                            <li class="productBox" data-productId="${v.product_id}">
                                <div class="productPicture">
                                    <img src="${v.img_url}" alt="${v.product_id}"/>
                                </div>
                                <ul class="productDescription">
                                    <li class="productName">${v.product_name}</li>
                                    <li class="productLook em0_8">${v.describe}</li>
                                    <li class="presentIntegral em0_8">赠送积分：${cutMoney(v.market_price)}</li>
                                    <li class="productPrice em0_9">
                                        <div class="presentPrice">￥${cutMoney(v.shop_price)}</div>
                                        <div class="sale">已售：${v.sell_count}</div>
                                    </li>
                                </ul>
                            </li>
                        `;
                    });
                    $(".productContainer").html(html);
                }

            }
        })
    }
    loadYouLick();

    //跳转商品详情页
    $(".productContainer").on("click",".productDescription",function(){
        sessionStorage.setItem("productId",$(this).parent().attr("data-productid"));
        location.href="../12/productDetailPage.html";
    })
});