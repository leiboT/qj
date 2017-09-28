$(function(){
    //动态更改头部
    var header=$("header");
    function loadHeader(txt){
        header.children("a").after(txt);
    }
    var houseClassId=sessionStorage.getItem("HouseClassId")||sessionStorage.getItem("backClassItemId");
    //if(sessionStorage.getItem("HouseClassId")!=sessionStorage.getItem("backClassItemId")){
    //    houseClassId=sessionStorage.getItem("backClassItemId")
    //}
    switch (Number(houseClassId)){
        case 11:
            loadHeader("商品房");
            break;
        case 12:
            loadHeader("");
            break;
        case 13:
            loadHeader("别墅");
            break;
        case 14:
            loadHeader("写字楼");
            break;
        case 15:
            loadHeader("");
            break;
        case 16:
            loadHeader("小产权房");
            break;
        case 17:
            loadHeader("土地转让");
            break;
    }

    //异步再封装
    function customAjax(url,data,fn){
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                //console.log(error)
            }
        })
    }
    //图片加载完清除占位图
    function clearPlaceholderShape(){
        $(".ui-fb").each(function(k,v){
            $(v).load(function(){
                $(this).parent().removeClass("ui-lz");
            })
        });
    }
    var primaryHtml=[];

    function cutMoney(price){
        return price.length>4?price.substring(0,price.length-4)+"万":price.length>8?price.substring(0,price.length-8)+"亿":price;
    }

    //动态加载商品列表及显示结果个数处理函数
    function loadProduct(result){
        if(result.code==2000){
            var info=result.info;
            var html="";
            $(info).each(function(k,v){
                html+=`
                           <li class="productBox" data-productId="${v.product_id}">
                                <div class="productPicture rv ui-lz">
                                    <img src="${v.img_url}" alt="${v.product_id}" class="ui-fb"/>
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
            $("section").html("<div class='inlineBlock' style='width: 90%'><ul class='productContainer'>"+html+"</ul></div>");
            $(".searchResult").html("共"+result.info.length+"个结果")
        }else if(result.code==2001){
            $("section").html(`<p class="txtCenter aroundPadding23 borderBottom1">未找到匹配资源</p>`);
            $(".searchResult").html("没有结果")
        }
        clearPlaceholderShape()
    }

    var classifyBig=[];
    //加载分类item
    customAjax(
        "http://api.qianjiantech.com/v1/filterItem",
        {
            class_id:sessionStorage.getItem("allClassId")||sessionStorage.getItem("backClassId"),
            class_item_id:houseClassId,
            area_name:sessionStorage.getItem("userDistrict") || "东莞市"
        },
        function(result){
            var code=result.code;
            if(code==2000){
                var info=result.info;
                var len=info.length;
                //大筛选项
                var classifyHtml="";
                //筛选下item盒子
                var classifyItemBoxHtml="";
                $(info).each(function(k,v){
                    if(k<3){
                        classifyBig.push(v.attr_name+'<i class="iconfont icon-arrowdownb"></i>');
                        classifyHtml+=`
                     <li>${v.attr_name}<i class="iconfont icon-arrowdownb"></i></li>
                    `;
                        var firstClassify="";
                        var onlyFirstClassify="";
                        var secondClassifyBox="";
                        //进行再循环解析一级二级分类
                        $(v.data).each(function(k1,v1){
                            //加载二级分类列表
                            if(v1.attr_item_value){
                                var secondClassifyItem="";
                                $(v1.attr_item_value).each(function(k2,v2){
                                    k2==0?secondClassifyItem+=`
                                    <li class="activeColor" data-classifyId="${v2.attr_value_id}">${v2.attr_value}</li>`:secondClassifyItem+=`<li data-classifyId="${v2.attr_value_id}">${v2.attr_value}</li>`;
                                });
                            }

                            if(v1.attr_item_name){
                                //动态创建一级分类列表
                                k1==0?firstClassify+=`<li class="activeColor">${v1.attr_item_name}</li>`:firstClassify+=`<li>${v1.attr_item_name}</li>`;
                                //创建二级分类盒子
                                k1==0? secondClassifyBox+=`<ul class="childName">${secondClassifyItem}</ul>`:secondClassifyBox+=`<ul class="childName die">${secondClassifyItem}</ul>`
                            }else if(v1.attr_value){
                                //创建只有一级分类的列表
                                k1==0?onlyFirstClassify+=`<li class="activeColor" data-classifyId="${v1.attr_value_id}">${v1.attr_value}</li>`:onlyFirstClassify+=`<li data-classifyId="${v1.attr_value_id}">${v1.attr_value}</li>`;
                            }
                        });

                        //动态创建分类整体架子
                        if(v.data){
                            v.data[0].attr_item_name?
                                classifyItemBoxHtml+=`
                        <div class="childClassifyBox ab">
                            <div class="rv flexRowBox justifyContentSpaceBetween">
                                <i class="iconfont icon-trianglet markTriangle"></i>
                                <ul class="childClassifyItem">
                                    ${firstClassify}
                                </ul>
                                <div class="flex1 em0_9">
                                    ${secondClassifyBox}
                                </div>
                            </div>
                        </div>`:classifyItemBoxHtml+=`
                        <div class="childClassifyBox ab">
                            <i class="iconfont icon-trianglet markTriangle"></i>
                            <ul class="childClassifyItem">
                                ${onlyFirstClassify}
                            </ul>
                         </div>`;
                        }
                    }
                });
                $(".classifyNavBox").html(classifyHtml).after(classifyItemBoxHtml);
            }
        }
    );

    //进入根据分类ID加载商品数据
        //查询索引
    var areaId=0,totalPriceId=0,priceId=0,proportionId=0,subwayId=0;
    customAjax(
        "http://api.qianjiantech.com/v1/chooseGoods",
        {
            class_id:houseClassId,
            city:sessionStorage.getItem("userDistrict"),
            area_id:areaId,
            price_id:priceId,
            proportion_id:proportionId,
            subway_id:subwayId},
        function(result){
            loadProduct(result)
        }
    );


    //根据点击获取分类类型
    $(".classifyNavBox").on("click","li",function(){
        if($(this).children("i").hasClass("icon-arrowupb")){
            $(this).children("i").attr("class","iconfont icon-arrowdownb");
            $("#selPop").removeClass("show");
            $(".classifyNav>div").eq($(this).index()).removeClass("show");
        }else{
            $("#selPop").addClass("show");
            $(this).children("i").attr("class","iconfont icon-arrowupb");
            $(this).siblings().children("i").attr("class","iconfont icon-arrowdownb");
            var index=$(this).index();
            $(".classifyNav>div").eq(index).addClass("show").siblings().removeClass("show");
        }
    });

    //切换一级分类处理函数
    function cutClassify(self){
        $(self).addClass("activeColor").siblings().removeClass("activeColor");
        $(self).parent("ul").next("div").children("ul").eq($(self).index()).addClass("show").siblings().removeClass("show").addClass("die");
    }


    //二级分类处理函数
    function cutClassifyItem(self){
        var classifyNavBoxLiList=$(".classifyNavBox>li");
        $("#selPop").removeClass("show");
        $(".classifyNav>div").removeClass("show");
        classifyNavBoxLiList.children("i").attr("class","iconfont icon-arrowdownb");

        if($(self).parent("ul").parent("div").prev("ul").children("li").eq($(self).parent("ul").index()).html()){
            var commonIndex=$(self).parent("ul").parent("div").parent("div").parent("div").index();
            //将选择的分类item放入大分类盒子中
            $(self).attr("data-classifyid")!=0?
            classifyNavBoxLiList.eq(commonIndex-1).html($(self).text()+'<i class="iconfont icon-arrowdownb"></i>'):classifyNavBoxLiList.eq(commonIndex-1).html(classifyBig[commonIndex-1]);
            //根据二级盒子的下标找寻键值对应的分类ID
            switch ($(self).parent("ul").parent("div").prev("ul").children("li").eq($(self).parent("ul").index()).html()){
                case "地区":
                    areaId=$(self).attr("data-classifyid");
                    break;
                case "地铁":
                    subwayId=$(self).attr("data-classifyid");
                    break;
                case "总价":
                    totalPriceId=$(self).attr("data-classifyid");
                    break;
                case "单价":
                    priceId=$(self).attr("data-classifyid");
                    break;
            }
        }else{//特殊一级分类
            var specialIndex=$(self).parent("ul").parent("div").index();
            if(classifyBig[specialIndex-1].indexOf("面积")!=-1){
                proportionId=$(self).attr("data-classifyid")
            }
            //将选择的分类item放入大分类盒子中
            $(self).attr("data-classifyid")==0?classifyNavBoxLiList.eq(specialIndex-1).html(classifyBig[specialIndex-1]):
                classifyNavBoxLiList.eq(specialIndex-1).html($(self).text()+'<i class="iconfont icon-arrowdownb"></i>');
        }
        customAjax(
            "http://api.qianjiantech.com/v1/chooseGoods",
            {class_id:houseClassId,
                city:sessionStorage.getItem("userDistrict"),
                area_id:areaId,
                total_price_id:totalPriceId,
                price_id:priceId,
                proportion_id:proportionId,
                subway_id:subwayId
            },
            function(result){
                loadProduct(result);
            }
        );
    }

    //利用冒泡为一级二级分类添加点击切换事件
    $(".classifyNav").on("click",".childClassifyBox>div>.childClassifyItem>li",function(){//一级分类
        cutClassify(this);
    }).on("click",".childClassifyBox>.childClassifyItem>li",function(){//特殊一级分类（只有一级）
        $(this).addClass("activeColor").siblings("li").removeClass("activeColor");
        cutClassifyItem(this);
    }).on("click",".childName>li",function(){//二级分类
        $(this).addClass("activeColor").siblings("li").removeClass("activeColor");
        cutClassifyItem(this);
    });


    //点击关闭分类选择框
    $(document).mouseup(function(e){
        var _con = $('.classifyNav');
        if(_con != e.target && _con.has(e.target).length === 0){
            $("#selPop").removeClass("show");
            $(".classifyNav>div").removeClass("show");
            $(".classifyNavBox>li").children("i").attr("class","iconfont icon-arrowdownb");
        }
    });

    //跳转商品详情页
    $("section").on("click",".productContainer>li",function(){
        sessionStorage.setItem("productId",$(this).attr("data-productid"));
        location.href="../12/productDetailPage.html";
    })
});