$(function(){
    //我的订单列表盒子
    var orderBox=$(".orderBox");
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
    var loadMore=$(".loadMore");
    var index=1;
    var pg;
    var myOrderLoad=function(page){
        customAjax(
            "http://api.qianjiantech.com/v1/myOrder",
            {
                user_id:sessionStorage.getItem("uid"),
                state_code:sessionStorage.getItem("stateCode"),
                page:page
            },
            function(res){
                //console.log(res);
                switch (res.code){
                    case 2000:
                        //console.log(res.info.info);
                        pg=res.info.count;
                        var len=res.info.info.length;
                        len<5?loadMore.html("<div>没有更多了</div>"):loadMore.html("<div>上拉加载更多..</div>");
                        var html="";
                        $(res.info.info).each(function(k,v){
                            var proHtml="";
                            var number=0;
                            var total=0;
                            $(v.data).each(function(k1,v1){
                                proHtml+=`
                                    <li class="orderProInfo flexRowBox aroundPadding23 em0_8">
                                    <div class="productImg">
                                    <img src="${v1.product_img_url}" alt="" class="img-response"/>
                                    </div>
                                    <ul class="txtLeft">
                                    <li>
                                    【${v1.product_name}】${v1.describe}
                                    </li>
                                    <li>
                                    ${v1.attr}
                                    </li>
                                    <li class="flexRowBox justifyContentSpaceBetween">
                                    <span>￥${v1.product_price}</span>
                                    <span>x${v1.number}</span>
                                    </li>
                                    </ul>
                                    </li>
                                `;
                                number+=Number(v1.number);
                                total+=v1.number*v1.product_price;
                            });
                            html+=`
                            <li class="orderItem borderBottom4" data-orderId="${v.order_id}">
        <ul>
                                    <li class="em0_8 flexRowBox justifyContentSpaceBetween alignItemCenter leftRightPadding3">
                                    <a href="#" class="color252525 flexRowBox alignItemCenter">
                                    <div class="shopImg">
                                    <img src="${v.shop_head_pic}" alt="${v.shop_name}" class="img-response"/>
                                    </div>
                                    <span class="shopName">${v.shop_name}</span>
                                    <i class="iconfont icon-right"></i>
                                    </a>
                                    <span class="colorF35F62">${v.state==0?"未支付":v.state==1?"已支付,待商家确认":v.state==2?"商家确认，待发货":v.state==3?"已发货，配送中":v.state==4?"已签收":v.state==5?"订单完成":v.state==6?"退货":"平台确认,赠送积分"}</span>
                                    </li>
                                    <li>
                                    <ul>
                                    ${proHtml}
                                    </ul>
                                    </li>
                                    <li class="borderBottom1 color252525 em0_8 txtRight rightPadding3">
                                    共${number}件商品 合计:￥${total}(含运费:￥0.00)
                                    </li>
                                    <li class="orderInfoFooter em0_8 txtRight">
                                    <span class="lf orderType">${v.order_type==0?"普通订单":"凭证订单"}</span>
                                    <div class="color252525 returnGood">&nbsp;退货&nbsp;</div>
                                    <div class="colorF35F62 confirmReceive">&nbsp;确认收货&nbsp;</div>
                                    </li>
                                    </ul>
                                    </li>
                            `;
                        });
                        loadMore.before(html);
                        break;
                    case 2001:
                        loadMore.html(`<div>你还没有订单</div>`);
                        break;
                    case 9000:
                        reminderDeal("你已在其他设备登录!");
                        closeBtn.html("即将进入登录页").unbind("click");
                        jump("../loginRegisterHTML/login.html",1500);
                        sessionStorage.clear();
                }
            }
        );
    };
    myOrderLoad(index);

    //下拉加载更多
    $('body').scroll(function () {
        if ($(this).scrollTop() + $(this).height() >= orderBox.height()+50) {
            index+=1;
            index<=pg?loadMore.html("<div>加载中...</div>"):loadMore.html("<div>没有更多了</div>");
            setTimeout(function(){
                index<=pg&&myOrderLoad(index);
            },1000);
        }
    });


    $.fn.scrollTo =function(options){
        var defaults = {
            toT : 0,    //滚动目标位置
            durTime : 500,  //过渡动画时间
            delay : 30,     //定时器时间
            callback:null   //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };
    loadMore.click(function(){
        $("body").scrollTo({toT:0})
    });
});