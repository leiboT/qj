(function($) {
    //会话储存
    $.sessionControl = function(){
        return {
            uid:sessionStorage.getItem("uid"),
            stateCode:sessionStorage.getItem("stateCode"),
            t:sessionStorage.getItem("t")
        }
    };
    //异步
    $.customAjax = function(url,data,fn){
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                //console.log(error);
                $('body').html('系统繁忙,请稍后重试!')
            },
            beforeSend: function(){
                $('body').append('<div class="loadingWrap"></div>');
            },
            complete: function(){
                $(".loadingWrap").remove();
            }
        })
    };
    //图片加载完清除占位图
    $.clearPlaceholderShape = function(){
        $(".ui-fb").each(function(k,v){
            $(v).on("load", function(){
                $(this).parent().removeClass("ui-lz");
            })
        });
    };
    //判断轮播图片加载完成
    $.imgLoadingEnd = function(boxSelector,fnc,loadingBox){
        var imgList = $(boxSelector).find('img');
        var callback = function(){
            fnc();
            $(loadingBox).hide();
        };
        var check = (function (count, fn){
            return function(){
                count--;
                if(count == 0){
                    fn();
                }
            };
        })(imgList.length, callback);
        imgList.each(function(){
            $(this).bind('load', check).attr('src', $(this).attr('data-img')).show();
        });
    };
    //跳转
    $.jump = function(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    };
    //提示弹出框处理函数
    $.reminderDeal = function(p,pop,txt){
        p.html(txt);
        pop.addClass("pop-show");
    };
    //请先登录处理函数
    $.pleaseLogin = function(p,pop,closeBtn,path){
        $.reminderDeal(p,pop,"请先登录!");
        closeBtn.html("进入登录页");
        closeBtn.on("click",function(){
            $.jump(path,0);
        });
    };
    //已在其他设备登录
    $.loginOtherDevice = function(p,pop,closeBtn,path){
        $.reminderDeal(p,pop,"你已在其他设备登录!");
        closeBtn.html("即将进入登录页").unbind("click");
        $.jump(path,1500);
        sessionStorage.clear();
    };
    //点击其他区域关闭弹框
    $.elseClosePop = function(pop){
        pop.mouseup(function(e){
            var _con = $('.pop-box');
            if(_con != e.target && _con.has(e.target).length === 0){
                $(this).removeClass("pop-show");
            }
        });
    };
    //服务器端图片转base64
    $.imgToBase64 = function(url){
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = "*";
        img.src = url;
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            var dataURL = canvas.toDataURL('image/png');
            return dataURL;
        };
    };
    //如果使用的是zepto，就添加扩展函数
    //if(Zepto){
    //    $.customAjax = customAjax;
    //    $.clearPlaceholderShape=clearPlaceholderShape;
    //    $.imgLoadingEnd=imgLoadingEnd;
    //    $.jump=jump;
    //    $.reminderDeal=reminderDeal;
    //    $.loginOtherDevice=loginOtherDevice;
    //    $.pleaseLogin=pleaseLogin;
    //    //$.sessionControl=sessionControl;
    //    $.elseClosePop=elseClosePop;
    //    $.imgToBase64=imgToBase64;
    //}
})(Zepto);