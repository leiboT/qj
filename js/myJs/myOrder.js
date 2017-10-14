$(function(){
    //商家订单盒子
    var shopOrderBox=$(".shopsOrderBox");
    //普通订单盒子
    var normalOrder=$(".normalOrder");
    //凭证订单盒子
    var voucherOrder=$(".voucherOrder");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    var loadMore=$(".loadMore");
    var index=1;
    var pg;
    var myOrderLoad=function(page){
        $.customAjax(
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
                        len<=5?loadMore.html("<div>没有更多了</div>"):loadMore.html("<div>上拉加载更多..</div>");
                        var voucherOrderHtml="";
                        var normalOrderHtml="";
                        $(res.info.info).each(function(k,v){
                            if(v.order_type==0){
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
                                normalOrderHtml+=`
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
                                    <span class="colorF35F62">${v.order_type==1?"已上传凭证":v.state==0?"您未付款":v.state==1?"已付款,待商家确认":v.state==2?"商家已确认,待发货":v.state==3?"已发货,配送中":v.state==4?"已签收":v.state==5?"订单完成":v.state==6?"退货":"平台确认,赠送积分"}</span>
                                    </li>
                                    <li>
                                    <ul>
                                    ${proHtml}
                                    </ul>
                                    </li>
                                    ${v.order_type==0?`<li class="borderBottom1 color252525 em0_8 txtRight rightPadding3">
                                    共${number}件商品 合计:￥${total}(含运费:￥0.00)
                                    </li>`:''}
                                    <li class="orderInfoFooter em0_8 txtRight clearFloat" data-totalM="${total}">
                                    <span class="lf orderType">${v.order_type==0?"普通订单":"凭证订单"}</span>
                                    ${v.order_type==1?"":v.state==0?`<div class="goPay">&nbsp;去支付&nbsp;</div>`:v.state==5?`<div class="confirmReceive">&nbsp;确认收货&nbsp;</div>`:v.state>=6?`<div class="returnGood">&nbsp;退货&nbsp;</div>`:""}
                                    </li>
                                    </ul>
                                    </li>
                            `;
                            }else if(v.order_type==1){
                                voucherOrderHtml+=`
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
                                    <span class="colorF35F62">${v.state==0?"已上传凭证":v.state==1?"已确认凭证":v.state==2?"待发货":v.state==3?"已发货,配送中":v.state==4?"买家已签收":v.state==5?"订单完成":v.state==6?"退货":"平台确认,赠送积分"}</span>
                                    <li class="orderInfoFooter em0_8 txtRight clearFloat">
                                    <span class="lf orderType">凭证订单</span>
                                    </li>
                                    </ul>
                                    </li>
                                `;
                            }
                        });
                        normalOrderHtml?normalOrder.append(normalOrderHtml):normalOrder.append(`<li class="normalWarn">您没有普通订单</li>`);
                        voucherOrderHtml?voucherOrder.append(voucherOrderHtml):voucherOrder.append(`<li class="voucherWarn">您没有凭证订单</li>`);
                        normalOrder.children().length>1&&$(".normalWarn").remove();
                        voucherOrder.children().length>1&&$(".voucherWarn").remove();
                        normalOrder.on("click",".orderInfoFooter>div",function(){
                            sessionStorage.setItem("ord",$(this).parent().parent().parent().attr("data-orderId"));
                            sessionStorage.setItem("tmy",$(this).parent().attr("data-totalM"));
                            //console.log($(this)[0].className);
                            switch ($(this)[0].className){
                                case "goPay":
                                    $.reminderDeal(p,pop,"确认去支付?");
                                    cancelConfirmDeal("../startHTML/12/pay.html");
                                    break;
                                case "confirmReceive":
                                    $.reminderDeal(p,pop,"确认收货?");
                                    cancelConfirmDeal();
                                    break;
                                case "returnGood":
                                    $.reminderDeal(p,pop,"确认退货?");
                                    cancelConfirmDeal();
                                    break;
                            }
                        });
                        break;
                    case 2001:
                        loadMore.html(`<div>你还没有订单</div>`);
                        break;
                    case 9000:
                        $.loginOtherDevice(p,pop,closeBtn,"../loginRegisterHTML/login.html");
                        break;
                }
            }
        );
    };
    myOrderLoad(index);
    //点击其他区域关闭弹框
    $.elseClosePop(pop);
    //弹框确认取消处理
    var cancelConfirmDeal = function(path){
        $(".settingWarn").on("click","span",function(e){
            e= e||window.event;
            switch($(e.target).html()){
                case "取消":
                    pop.removeClass("pop-show");
                    $(".settingWarn").unbind("click");
                    break;
                case "确定":
                    sessionStorage.setItem("isMyOrder","111");
                    path&&$.jump(path,200);
                    break;
            }
        });
    };
    //清除ord
    $("header>a").click(function(){
        sessionStorage.removeItem("ord")
    });

    //手势处理
    var startX=0,startY=0,endX=0,endY=0,xDistance=0,yDistance=0,selfLeft=0;
    var topSlideJudge=false,rightSlideJudge=false,bottomSlideJudge=false,leftSlideJudge=false,w=shopOrderBox.width()/2;
    shopOrderBox.on("touchstart",function(e){
        var touch=e.targetTouches[0];
        startX=touch.pageX;
        startY=touch.pageY;
        //console.log(e.touches[0].clientX,e.touches[0].clientY)
        selfLeft=parseInt($(this).css("left"));
    }).on("touchmove",function(e){
        var touch=e.targetTouches[0];
        endX=touch.pageX;
        endY=touch.pageY;
        //上滑
        if(startY>endY&&startY-endY>Math.abs(startX-endX)){
            console.log("上滑");
            //topSlideJudge=true;
            //rightSlideJudge=bottomSlideJudge=leftSlideJudge=false;
            //if(topSlideJudge){
            //    if(selfLeft==-w){
            //        voucherOrder.css("top",(endY-startY)/Math.PI+yDistance);
            //    }else{
            //        normalOrder.css("top",(endY-startY)/Math.PI+yDistance);
            //    }
            //    yDistance=(endY-startY)/Math.PI;
            //}
        }
        //下滑
        if(startY<endY&&endY-startY>Math.abs(startX-endX)){
            console.log("下滑");
            //bottomSlideJudge=true;
            //topSlideJudge=rightSlideJudge=leftSlideJudge=false;
            //if(bottomSlideJudge){
            //    if(selfLeft==-w){
            //        voucherOrder.css("top",(endY-startY)/Math.PI);
            //    }else{
            //        normalOrder.css("top",(endY-startY)/Math.PI);
            //    }
            //}
        }
        //左滑
        if(startX>endX&&startX-endX>Math.abs(startY-endY)){
            console.log("左滑");
            leftSlideJudge=true;
            topSlideJudge=rightSlideJudge=bottomSlideJudge=false;
            if(leftSlideJudge){
                xDistance=-(startX-endX);
                if(selfLeft==-w){
                    $(this).css("left",-w+xDistance/Math.PI);
                }else{
                    $(this).css("left",xDistance/Math.PI);
                }
            }
        }
        //右滑
        if(startX<endX&&endX-startX>Math.abs(startY-endY)){
            console.log("右滑");
            rightSlideJudge=true;
            topSlideJudge=bottomSlideJudge=leftSlideJudge=false;
            if(rightSlideJudge){
                xDistance=-(startX-endX);
                if(selfLeft==-w){
                    $(this).css("left",-w+xDistance/Math.PI);
                }else{
                    $(this).css("left",xDistance/Math.PI);
                }
            }
        }
    }).on("touchend",function(e){
        if(bottomSlideJudge&&selfLeft==-w){
            voucherOrder.css("top",0);
        }else if(bottomSlideJudge&&selfLeft!=-w){
            normalOrder.css("top",0);
        }
        if(topSlideJudge&&selfLeft==-w){
            voucherOrder.css("top",(endY-startY)/Math.PI);
        }else if(topSlideJudge&&selfLeft!=-w){
            normalOrder.css("top",(endY-startY)/Math.PI);
        }
        //console.log(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
        if(rightSlideJudge&&selfLeft==-w&&Math.abs(xDistance)>=w/3){
            $(this).css("left",0);
            document.body.scrollTop = 0;
        }else if(rightSlideJudge&&selfLeft!=-w){
            $(this).css("left",0);
        }else if(rightSlideJudge&&selfLeft==-w&&Math.abs(xDistance)<w/3){
            $(this).css("left",-w);
        }

        if(leftSlideJudge&&selfLeft==-w){
            $(this).css("left",-w);
        }else if(leftSlideJudge&&selfLeft!=-w&&Math.abs(xDistance)<w/3){
            $(this).css("left",0);
        }else if(leftSlideJudge&&selfLeft!=-w&&Math.abs(xDistance)>=w/3){
            $(this).css("left",-w);
            document.body.scrollTop = 0;
        }

    });

    //下拉加载更多
    $('body').scroll(function () {
        if ($(this).scrollTop() + $(this).height() >= normalOrder.height()+50) {
            index+=1;
            index<=pg?loadMore.html("<div>加载中...</div>"):loadMore.html("<div>没有更多了</div>");
            setTimeout(function(){
                index<=pg&&myOrderLoad(index);
            },300);
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