$(function(){
    var asyncJudge=false;
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");

    function cutMoney(price){
        return price.length>4?price.substring(0,price.length-4)+"万":price.length>8?price.substring(0,price.length-8)+"亿":price;
    }

    $.customAjax(
        "http://api.qianjiantech.com/v1/productInfo",
        {product_id:sessionStorage.getItem("productId")},
        function(result){
            if(result.code==2000){
                var info=result.info;
                //加载商品介绍图片
                var html="";
                $(info.goods_detail).each(function(k,v){
                    html+=`
                            <li class="borderBottom4 productIntroItems rv ui-lz">
                                <img src="${v}" alt="" class="ui-fb"/>
                            </li>
                        `;
                });
                $("#productIntroBox").html(html);
                $.clearPlaceholderShape();
                var address=info.address;
                var describe=info.describe;
                var latitude=info.latitude;
                var longitude=info.longitude;
                var backClassId=info.class_id;
                var backClassItemId=info.class_item_id;
                sessionStorage.setItem("backClassId",backClassId);
                sessionStorage.setItem("backClassItemId",backClassItemId);
                sessionStorage.setItem("HouseClassId",backClassItemId);
                sessionStorage.setItem("allClassId",backClassId);
                var getBack=$("header>a");
                if(backClassItemId==0){
                    switch (Number(backClassId)){
                        case 1:
                            getBack.attr("href","../houseHTML/houseIndex.html");
                            break;
                        case 2:
                            getBack.attr("href","../carHTML/carIndex.html");
                            break;
                        case 3:
                            getBack.attr("href","../caterHTML/caterIndex.html");
                            break;
                        case 4:
                            getBack.attr("href","../hotelHTML/hotelIndex.html");
                            break;
                    }
                }else{
                    switch (Number(backClassId)){
                        case 1:
                            getBack.attr("href","../houseHTML/houseItem.html");
                            break;
                        case 2:
                            getBack.attr("href","../houseHTML/carIndex.html");
                            break;
                        case 3:
                            getBack.attr("href","../houseHTML/caterIndex.html");
                            break;
                        case 4:
                            getBack.attr("href","../houseHTML/hotelIndex.html");
                            break;
                    }
                }

                sessionStorage.setItem("productPosition",longitude+","+latitude);
                var shopId=info.shop_id;
                sessionStorage.setItem("shopId",shopId);
                var shopName=info.shop_name;
                var marketPrice=info.market_price;
                var purchaseNote=info.purchase_note;
                //var shopPhone=info.shop_phone;
                var shopPrice=info.shop_price;
                var salesmanName=info.salesman_name;
                var salesmanPhone=info.salesman_phone;
                $(".productDetailPriceAndScore").html("<li>商家定价:￥"+cutMoney(shopPrice)+"</li>"+"<li>赠送积分:"+cutMoney(marketPrice)+"</li>");
                $(".productDetailInfoBox>li:first-child").html(shopName);
                $(".productDescribe").html(describe);
                $(".productPosition>p").html(address);
                $(".productPosition>h3").html(shopName);
                $("#productConnectPhone p").html(salesmanPhone+"("+salesmanName+")");
                $("#productConnectPhone>a").attr("href","tel:"+salesmanPhone);
                //加载商品详情头部图片
                for(var i= 0,html1="",len=info.goods_rotation.length; i<len; i++){

                    html1+=`
                                <div class="swiper-slide">
                                    <img src="" class="img-response" data-img="${info.goods_rotation[i]}"/>
                                </div>
                            `;
                }
                $(".productDetailImg").html(html1);
                $.imgLoadingEnd(
                    ".productDetailImg",
                    function(){
                        new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination'
                            //loop:true,
                            //loopSlider:10
                            //autoplayDisableOnInteraction : false,
                            //autoplay: 2500
                        })
                    },
                    ".loadingImg1"
                );
                $("#productNoticeTxt").html(purchaseNote);
                asyncJudge=true;
                if(asyncJudge){
                    //点击其他区域关闭弹框
                    $.elseClosePop(pop);
                    var collect=false;
                    //点击切换处理函数
                    function switchToggle(selector){
                        $(selector).click(function(){
                            collect=!collect;
                            collect?$(this).addClass("activeColor"):$(this).removeClass("activeColor")
                        })
                    }
                    switchToggle(".productCollect");

                    //配置微信接口
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open('get', "http://api.qianjiantech.com/getLocation?url="+"http://web.qianjiantech.com/startHTML/12/productDetailPage.html");
                        xhr.onreadystatechange= function() {
                            if (xhr.readyState==4 && xhr.status==200) {
                                try{
                                    var responseData = JSON.parse(xhr.responseText);
                                    wx.config({
                                        debug: false,
                                        appId: responseData.AppId,
                                        timestamp: responseData.timestamp,
                                        nonceStr: responseData.nonce,
                                        signature: responseData.signature,
                                        jsApiList: [
                                            //所有要调用的 API 都要加到这个列表中
                                            'checkJsApi',
                                            'openLocation',
                                            'getLocation'
                                        ]
                                    });
                                }catch (err){
                                    //console.log(err)
                                }
                            }
                        };
                        xhr.send();
                    } catch (e) {
                        //console.log(e)
                    }

                    var NavData={"longitude":113.619790,"latitude":22.931441,"address":"碧桂园"};
                    //点击导航
                    $(".onKeyNav").click(function(){
                        $(this).addClass("activeColor");
                        setTimeout(()=>{
                            $(this).removeClass("activeColor");
                        },2000);
                        try{
                            wx.openLocation({
                                longitude : NavData.longitude, // 经度，浮点数，范围为180 ~ -180。
                                latitude : NavData.latitude, // 纬度，浮点数，范围为90 ~ -90
                                name : '商品位置', // 位置名
                                address : NavData.address, // 地址详情说明
                                scale : 20, // 地图缩放级别,整形值,范围从1~28。默认为最大
                                infoUrl : 'http://weixin.qq.com' // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
                            });
                        }catch(e){
                            //console.log(e)
                        }
                    });

                    //上传购买凭证处理事件
                    $(".buyVoucher").click(function(){
                        if(sessionStorage.getItem("uid")&&sessionStorage.getItem("t")&&sessionStorage.getItem("stateCode")){
                            location.href="buyVoucher.html";
                        }else{
                            $.pleaseLogin(p,pop,closeBtn,"../../loginRegisterHTML/login.html")
                        }
                    });
                }
            }
        }
    );
});