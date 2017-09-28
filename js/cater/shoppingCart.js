$(function(){
    var section=$("section");
    var setWarn=$(".settingWarn");
    var totalFee=$("#total-fee");
    var totalMoney=0;
    var checkItem;
    var goSettlement=$("#goSettlement");
    var checkAll=$("#checkAll");

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
    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });

    customAjax(
        "http://api.qianjiantech.com/v1/myShopCart",
        {
            user_id:sessionStorage.getItem("uid"),
            state_code:sessionStorage.getItem("stateCode"),
            shop_id:sessionStorage.getItem("shopId")
        },
        function(res){
            console.log(res);
            switch (res.code){
                case 2000:
                    var html="";
                    var len=res.info.length;
                    $(res.info).each(function(k,v){
                        html+=`
                            <div class="aroundPadding23 borderBottom4 cartItem" data-cartId="${v.data.cart_id}">
                                <ul class="flexRowBox justifyContentFlex-start alignItemCenter">
                                    <li class="checkItem activeColor" aria-checked="true" data-singleTotal="${v.data.price*v.data.count}">
                                        <i class="iconfont icon-checkedon"></i>
                                    </li>
                                    <li class="flex1 flexRowBox alignItemCenter">
                                        <div class="cart-product-cell-1">
                                            <img src="${v.data.img_url}" alt="${v.data.describe}" class="cart-photo-thumb"/>
                                        </div>
                                        <ul class="flex1">
                                            <li class="em0_9 pro-txt color252525">
                                                ${v.data.describe}
                                            </li>
                                            <li class="em0_8 pro-txt">
                                                ${v.attr}
                                            </li>
                                            <li class="colorF35F62 em0_8" data-price="${v.data.price}">
                                                ￥${v.data.price}
                                            </li>
                                            <li class="color252525 flexRowBox justifyContentSpaceBetween">
                                                <ul class="flexRowBox quantity-wrapper" data-singleTotal="${v.data.price*v.data.count}">
                                                    <li class="border1 txtCenter" data-operation="decrease"> - </li>
                                                    <li class="border1 flexColBox">
                                                        <input type="tel" value="${v.data.count}" class="flex1 width100 txtCenter number" disabled/>
                                                    </li>
                                                    <li class="border1 txtCenter" data-operation="increase"> + </li>
                                                </ul>
                                                <div class="em0_8 cartProDelete" data-operation="cartProDelete">删除</div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        `;
                        totalMoney+=(v.data.price*v.data.count)
                    });
                    section.html(html);
                    //异步完拿到所有子选择
                    checkItem=$(".checkItem");
                    totalFee.text(totalMoney.toFixed(2));
                    enterAccount();
                    accountNumber(len);

                    //删除商品处理
                    var deleteProDel=function(target){
                        //后台删除
                        customAjax(
                            "http://api.qianjiantech.com/v1/deleteShopCart",
                            {
                                user_id:sessionStorage.getItem("uid"),
                                state_code:sessionStorage.getItem("stateCode"),
                                cart_id:$(target).parent().parent().parent().parent().parent().attr("data-cartId")
                            },
                            function(res){
                                //console.log(res);
                                res.code==2000&&--len;
                                len==0&&$("#shoppingCartContainer").html(
                                    `<div class="emptyCart">
                            <p class="color666 em0_8">您的购物车为空</p>
                            <a href="../caterHTML/caterIndex.html" class="color252525 border1 em0_8">去逛逛</a>
                        </div>
                    `);
                            }
                        );
                        //前端删除
                        if(eval($(target).parent().parent().parent().prev().attr("aria-checked"))){
                            totalMoney-=$(target).prev().attr("data-singleTotal");
                            totalFee.text(totalMoney.toFixed(2))
                        }
                        $(target).parent().parent().parent().parent().parent().remove()
                    };

                    //删除商品提示
                    var deleteProWarn=function(target){
                            pop.addClass("pop-show");
                            setWarn.on("click","span",function(e){
                                e= e||window.event;
                                switch($(e.target).text()){
                                    case "取消":
                                        pop.removeClass("pop-show");
                                        setWarn.unbind("click");
                                        break;
                                    case "确定":
                                        deleteProDel(target);
                                        checkItem=$(".checkItem");
                                        radioAllCheck();
                                        enterAccount();
                                        accountNumber();
                                        pop.removeClass("pop-show");
                                        setWarn.unbind("click");
                                        break;
                                }
                            });
                    };

                    //编辑购物车(数量)
                    var editCart=function(target,count){
                        customAjax(
                            "http://api.qianjiantech.com/v1/editShopCart",
                            {
                                user_id:sessionStorage.getItem("uid"),
                                state_code:sessionStorage.getItem("stateCode"),
                                cart_id:$(target).parent().parent().parent().parent().parent().parent().attr("data-cartId"),
                                count:count
                            },
                            function(res){
                                //console.log(res)
                            }
                        )
                    };

                    //操作--数量加减+删除
                    section.on("click","li",function(e){
                        e= e||window.event;
                        var target=e.target;
                        var val,price;
                        switch ($(target).attr("data-operation")){
                            case "decrease":
                                val=$(target).next().children().val();
                                price=Number($(target).parent().parent().prev().attr("data-price"));
                                if(val<=1){
                                    val=1
                                }else{
                                    val--;
                                    $(target).parent().attr("data-singleTotal",val*price);
                                    $(target).parent().parent().parent().parent().prev().attr("data-singleTotal",val*price);
                                    $(target).next().children().val(val);
                                    if(eval($(target).parent().parent().parent().parent().prev().attr("aria-checked"))){
                                        totalMoney-=1*price;
                                        totalFee.text(totalMoney.toFixed(2));
                                    }
                                    editCart(target,val);
                                }
                                break;
                            case "increase":
                                val=$(target).prev().children().val();
                                price=Number($(target).parent().parent().prev().attr("data-price"));
                                val++;
                                $(target).parent().attr("data-singleTotal",val*price);
                                $(target).parent().parent().parent().parent().prev().attr("data-singleTotal",val*price);
                                $(target).prev().children().val(val);
                                if(eval($(target).parent().parent().parent().parent().prev().attr("aria-checked"))){
                                    totalMoney+=1*price;
                                    totalFee.text(totalMoney.toFixed(2));
                                }
                                editCart(target,val);
                                break;
                            case "cartProDelete":
                                deleteProWarn(target);
                                break;
                        }
                    });
                    break;
                case 2001:
                    $("#shoppingCartContainer").html(
                        `<div class="emptyCart">
                            <p class="color666 em0_8">您的购物车为空</p>
                            <a href="../caterHTML/caterIndex.html" class="color252525 border1 em0_8">去逛逛</a>
                        </div>
                    `);
                    break;
                case 9000:
                    console.log("已在其他设备登录!");
                    reminderDeal("已在其他设备登录");
                    closeBtn.text("即将进入登录页!");
                    jump("../../loginRegisterHTML/login.html",1500);
                    sessionStorage.clear();
                    break;
            }
        }
    );

    //商品选择--全选or不全选
    checkAll.click(function(){
        //字符串true or false转boolean
        //!eval($(this).attr("aria-checked"))?$(this).addClass("activeColor").attr("aria-checked",true)&&checkItem.addClass("activeColor").attr("aria-checked",true):$(this).removeClass("activeColor").attr("aria-checked",false)&&checkItem.removeClass("activeColor").attr("aria-checked",false);
        if(!eval($(this).attr("aria-checked"))){
            $(this).addClass("activeColor").attr("aria-checked",true);
            checkItem.addClass("activeColor").attr("aria-checked",true);
            var allCheckMoney=0;
            checkItem.each(function(k,v){
                allCheckMoney+=Number($(v).attr("data-singleTotal"))
            });
            totalMoney=allCheckMoney;
            totalFee.text(totalMoney.toFixed(2));
        }else{
            $(this).removeClass("activeColor").attr("aria-checked",false);
            checkItem.removeClass("activeColor").attr("aria-checked",false);
            totalMoney=0;
            totalFee.text(totalMoney.toFixed(2));
        }
        enterAccount();
        accountNumber();

    });
    //单选or多选
    section.on("click",".checkItem",function(){
        //eval($(this).attr("aria-checked"))?$(this).removeClass("activeColor").attr("aria-checked",false):$(this).addClass("activeColor").attr("aria-checked",true);
        if(eval($(this).attr("aria-checked"))){
            $(this).removeClass("activeColor").attr("aria-checked",false);
            totalMoney-=Number($(this).attr("data-singleTotal"));
            totalFee.text(totalMoney.toFixed(2));
        }else{
            $(this).addClass("activeColor").attr("aria-checked",true);
            totalMoney+=Number($(this).attr("data-singleTotal"));
            totalFee.text(totalMoney.toFixed(2));
        }
        radioAllCheck();
        enterAccount();
        accountNumber();
    });

    //判断单选是否全部选定处理
    var radioAllCheck=function(){
        var judgeItem=true;
        checkItem.each(function(k,v){
            judgeItem = eval($(v).attr("aria-checked")) && judgeItem;
        });
        judgeItem?checkAll.addClass("activeColor").attr("aria-checked",true):checkAll.removeClass("activeColor").attr("aria-checked",false);
    };

    //结算数量处理
    var accountNumber=function(val){
        val = val || $('.checkItem[aria-checked="true"]').length;
        goSettlement.text("去结算("+val+")");
    };

    //进入结算处理
    var enterAccount=function(){
        var judgeCal=false;
        checkItem.each(function(k,v){
            judgeCal = judgeCal || eval($(v).attr("aria-checked"));
        });
        judgeCal?goSettlement.removeClass("disabled").click(function(){
            location.href="writeOrder.html"
        }):goSettlement.addClass("disabled").unbind("click");
    }
});