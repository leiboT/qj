$(function(){
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
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
    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });
    //获取商家身份状态
    customAjax(
        "http://api.qianjiantech.com/v1/shopState",
        {
            user_id:sessionStorage.getItem("uid"),
            state_code:sessionStorage.getItem("stateCode")
        },
        function(result){
            var code=result.code;
            if(code==2000){
                var isShop=result.info.is_shop;
                switch (isShop){
                    case "0"||0:
                        $(".storeIndex").html(`<span>您目前不是商家</span><a href="businessHTML/shopsEnter.html">
            商家入驻>>
        </a>`);
                        break;
                    case "1"||1:
                        $(".storeIndex").html(`<span>审核中...</span><p>入驻申请中</p>`);
                        break;
                    case "2"||2:
                        $(".storeIndex").html(`<span>审核未通过,请重新入驻</span><a href="businessHTML/shopsEnter.html">
            商家入驻>>
        </a>`);
                        break;
                    case "3"||3:
                        $(".storeIndex").html(`<span>您已是商家</span><a href="businessHTML/shopsManage.html">
            商家管理>>
        </a>`);
                        break;
                }
            }else if(code==4000){
                reminderDeal("请先登录!");
                closeBtn.text("进入登录页");
                closeBtn.on("click",function(){
                    jump("loginRegisterHTML/login.html",0);
                });
            }else if(code==9000){
                reminderDeal("您已在其它设备登录");
                closeBtn.unbind("click").html("即将进入登录页");
                jump("loginRegisterHTML/login.html",1500);
            }
        }
    );
});