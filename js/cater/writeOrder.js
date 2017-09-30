$(function(){
    var orderAddress=$("#orderAddress");
    sessionStorage.removeItem("isOrder");
    var uid=sessionStorage.getItem("uid");
    var stateCode=sessionStorage.getItem("stateCode");
    var token=sessionStorage.getItem("t");
    var shopId=sessionStorage.getItem("shopId");
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
    //关闭模态弹出框
    closeBtn.on("click",function(){
        pop.removeClass("pop-show");
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
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }
    customAjax(
        "http://api.qianjiantech.com/v1/mayCreateOrder",
        {
            user_id:uid,
            state_code:stateCode
        },
        function(res){
            console.log(res);
            switch (res.code){
                case 2000:
                    var html="";
                    $(res.info.data).each(function(k,v){
                        html+=`
                                <div class="aroundPadding23 borderBottom4">
                                    <ul class="flexRowBox justifyContentFlex-start alignItemCenter">
                                    <li class="flex1 flexRowBox alignItemCenter">
                                    <div class="cart-product-cell-1">
                                    <img src="${v.img_url}" alt="" class="cart-photo-thumb"/>
                                    </div>
                                    <ul>
                                    <li class="em0_9 pro-txt color252525">
                                    ${v.describe}
                                    </li>
                                    <li class="em0_8 pro-txt">
                                    ${v.attr}
                                    </li>
                                    <li class="colorF35F62">
                                    ￥${v.price}
                                    </li>
                                    <li class="colorF35F62 em0_8">
                                    数量：${v.count}
                                    </li>
                                    </ul>
                                    </li>
                                    </ul>
                                    </div>
                            `;
                    });
                    var address=res.info.add.address,
                        addressId=res.info.add.address_id,
                        addressUserName=res.info.add.address_user_name,
                        addressPhone=res.info.add.address_phone;
                    if(address&&addressId&&addressUserName&&addressPhone){
                        orderAddress.html(`
                                <div class="flexRowBox justifyContentSpaceBetween alignItemCenter borderBottom4 leftRightPadding3 selectAddress" data-addressId="${addressId}">
                                    <ul class="flex1 leftPadding3">
                                        <li class="topPadding2 txtLeft">
                                            <b class="addressUserName">${addressUserName}</b>
                                            <b class="addressPhone">${addressPhone}</b>
                                        </li>
                                        <li class="em0_8 txtLeft topBottomPadding2 addressInfo">
                                            ${address}
                                        </li>
                                    </ul>
                                    <i class="iconfont icon-right"></i>
                                </div>
                            `);
                    }else{
                        orderAddress.html(`
                                    <div class="flexRowBox justifyContentSpaceBetween alignItemCenter borderBottom4 aroundPadding34 selectAddress" data-addressId="${addressId}">
                                    <ul class="flex1 leftPadding3">
                                        <li class="colorF35F62 em0_9">你还没有收货地址或默认地址, 去创建</li>
                                    </ul>
                                    <i class="iconfont icon-right"></i>
                                </div>
                                `)
                    }
                    $("#orderProBox").html(html);
                    $("#orderTotalMoney").html("总价：￥"+res.info.add.total_money);
                    break;
                case 9000:
                    reminderDeal("已在其他设备登录");
                    closeBtn.html("即将进入登录页").unbind("click");
                    jump("../../loginRegisterHTML/login.html",200);
                    sessionStorage.clear();
                    break;
            }
        }
    );
    //给收货地址设置判断值
    orderAddress.click(function(){
        sessionStorage.setItem("isOrder",1);
    });
    //提交订单处理
    var commitOrder=function(){
        var addressId=$(".selectAddress").attr("data-addressId");
        if(!eval(addressId)){
            reminderDeal("请选择地址")
        }else{
            customAjax(
                "http://api.qianjiantech.com/v1/createOrder",
                {
                    user_id:uid,
                    state_code:stateCode,
                    token:token,
                    shop_id:shopId,
                    address_id:addressId,
                    message:$(".buyerMessage").val()||" "
                },
                function(res){
                    console.log(res);
                    switch (res.code){
                        case 2000:
                            sessionStorage.setItem("ord",res.info.order_id);
                            sessionStorage.setItem("tmy",res.info.total_money);
                            jump("pay.html",0);
                            break;
                        case 2001:
                            reminderDeal("库存不足");
                            break;
                        case 2002:
                            reminderDeal("提交失败,请重试");
                            break;
                        case 2005:
                            customAjax(
                                "http://api.qianjiantech.com/v1/getToken",
                                {
                                    user_id:sessionStorage.getItem("uid"),
                                    state_code:sessionStorage.getItem("stateCode")
                                },
                                function(res){
                                    console.log(res);
                                    res.code==2000&&(token=res.info.token);
                                    commitOrder();
                                }
                            );
                            break;
                        case 4000:
                            console.log("参数不全");
                            break;
                        case 9000:
                            reminderDeal("已在其他设备登录");
                            closeBtn.html("即将进入登录页").unbind("click");
                            jump("../../loginRegisterHTML/login.html",200);
                            break;
                    }
                }
            )
        }
    };

    //提交订单点击
    $(".commitOrder").click(function(){
        commitOrder();
    })
});