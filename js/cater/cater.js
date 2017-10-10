$(function(){
    //异步再封装
    function customAjax(url,data,fn){
        //alert(JSON.stringify(arguments));
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                //console.log(error)
            },
            beforeSend: function(){
                $('body').append('<div class="loadingWrap"></div>');
            },
            complete: function(){
                $(".loadingWrap").remove();
            }
        })
    }

    $(".address").html(`
                        <a href="../../smallFeatureHTML/position.html">
                            <i class="iconfont icon-arrowdownb"></i>
                            ${sessionStorage.getItem("userDistrict")||"东莞市"}
                        </a>
                    `);
    //特产筛选项
    customAjax(
        "http://api.qianjiantech.com/v1/specialtyChoose",
        {
            area_name:sessionStorage.getItem("userDistrict"),
            class_id:sessionStorage.getItem("allClassId")
        },
        function(result){
            if(result.code==2000){
                var html="";
                $(result.info).each(function(k,v){
                    k==0?
                    html+=`
                        <li class="em0_9 activeColor" data-classifyid="${v.specialty_choose_id}">
                            ${v.name}
                        </li>
                    `:html+=`
                        <li class="em0_9" data-classifyid="${v.specialty_choose_id}">
                            ${v.name}
                        </li>
                    `;
                });
                $(".classifyNavBox").html(html);
            }
        }
    );

    ////切换分类项目
    $(".classifyNavBox").on("click","li",function(){
        $(this).addClass("activeColor").siblings().removeClass("activeColor");

        //switch (Number($(this).attr("data-classifyid"))){
        //    case 8:
        //        customAjax(
        //            "http://api.qianjiantech.com/v1/show",
        //            {
        //                area_name:sessionStorage.getItem("userDistrict") || "东莞市",
        //                class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
        //                distance_id:8,
        //                longitude:113.619790,
        //                latitude:22.931441
        //            },
        //            function(result){
        //                loadSpecialty(result)
        //            }
        //
        //        );
        //        break;
        //    case 9:
        //        customAjax(
        //            "http://api.qianjiantech.com/v1/show",
        //            {
        //                area_name:sessionStorage.getItem("userDistrict") || "东莞市",
        //                class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
        //                sell_count_id:$(this).attr("data-classifyid")
        //            },
        //            function(result){
        //                loadSpecialty(result)
        //            }
        //        );
        //        break;
        //    case 10:
        //        customAjax(
        //            "http://api.qianjiantech.com/v1/show",
        //            {
        //                area_name:sessionStorage.getItem("userDistrict") || "东莞市",
        //                class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
        //                price_id:$(this).attr("data-classifyid")
        //            },
        //            function(a){
        //                loadSpecialty(a)
        //            }
        //        );
        //        break;
        //    case 11:
        //        customAjax(
        //            "http://api.qianjiantech.com/v1/show",
        //            {
        //                area_name:sessionStorage.getItem("userDistrict") || "东莞市",
        //                class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
        //                hot_id:$(this).attr("data-classifyid")
        //            },
        //            function(a){
        //                loadSpecialty(a)
        //            }
        //        );
        //        break;
        //}
    });

    //加载特产商品处理函数
    function loadSpecialty(result){
        console.log(result);
        if(result.code==2000){
            var html="";
            $(result.info).each(function(k,v){
                console.log(v);
                var htmlGoods="";
                $(v.goods).each(function(k1,v1){
                    htmlGoods+=`
                            <li>
                                <div class="shopProductPic">
                                    <img src="${v1.product_img_url}" alt="${v1.product_name}" class="img-response"/>
                                </div>
                                <p>${v1.product_name}</p>
                                <p class="colorF35F62">￥${v1.shop_price}</p>
                            </li>
                        `;
                });
                html+=`
                        <li class="flexColbox justifyContentSpaceBetween aroundPadding23 borderBottom4" data-shopId="${v.shop_id}">
                <div class="flexRowBox marginBottom4">
                    <div class="shopsPic">
                        <img src="${v.shop_head_image}" alt="${v.shop_name}" class="img-response"/>
                    </div>
                    <ul class="flex1">
                        <li class="color000">
                            ${v.shop_name}
                        </li>
                        <li class="em0_9">
                            距您当前位置${v.distance}千米
                        </li>
                    </ul>
                </div>
                <ul>
                    <li class="overflowAuto">
                        <ul class="shopProductBox flexRowBox justifyContentSpaceBetween txtCenter">
                            ${htmlGoods}
                        </ul>
                    </li>
                </ul>
            </li>
                    `;
            });
            $("#specialtyContainer").html(html);
        }
    }
    //进入即加载距离最近的特产
    customAjax(
        "http://api.qianjiantech.com/v1/show",
        {
            area_name:sessionStorage.getItem("userDistrict") || "东莞市",
            class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
            distance_id:8,
            longitude:sessionStorage.getItem("userPosition")?sessionStorage.getItem("userPosition").split(",")[0] : 113.619790,
            latitude:sessionStorage.getItem("userPosition")?sessionStorage.getItem("userPosition").split(",")[1] : 22.931441
        },
        function(result){
            loadSpecialty(result)
        }

    );

    //跳转商品详情页
    $("#specialtyContainer").on("click","#specialtyContainer>li",function(){
        sessionStorage.setItem("shopId",$(this).attr("data-shopid"));
        location.href="caterDetail.html";
    })
});