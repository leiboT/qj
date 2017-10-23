$(function(){
    //header
    var header=$("header");
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
    var normalLoadMore=$(".normalLoadMore");
    var voucherLoadMore=$(".voucherLoadMore");
    //普通订单多页加载标识
    var normalIndex=1;
    var normalPg;
    //凭证订单多页加载标识
    var voucherIndex=1;
    var voucherPg;
    //点击其他区域关闭弹框
    $.elseClosePop(pop);

    //商家普通订单提示处理
    function normalOrderShopsWarn(v){
        return v.state==0?"买家未付款":v.state==1?"买家已支付,待确认":v.state==2?"待发货":v.state==3?"已发货,配送中":v.state==4?"买家已签收":v.state==5?"买家确认收货":v.state==6?"退货":"平台确认,赠送积分";
    }
    //商家普通订单操作处理
    function normalOrderShopsOperation(v){
           return v.state==1?`<div class="shopsConfirm">&nbsp;确认订单&nbsp;</div>`:v.state==2?`<div class="shipments">&nbsp;确认发货&nbsp;</div>`:"";
    }

    //个人普通订单提示处理
    function normalOrderPersonalWarn(v){
        return v.state==0?"您未付款":v.state==1?"已付款,待商家确认":v.state==2?"商家已确认,待发货":v.state==3?"已发货,配送中":v.state==4?"已签收":v.state==5?"订单完成":v.state==6?"退货":"平台确认,赠送积分";
    }
    //个人普通订单操作处理
    function normalOrderPersonalOperation(v){
        return v.state==0?`<div class="goPay">&nbsp;去支付&nbsp;</div>`:v.state==4?`<div class="confirmReceive">&nbsp;确认收货&nbsp;</div>`:v.state>=6?`<div class="returnGood">&nbsp;退货&nbsp;</div>`:"";
    }

    //普通订单DOM处理
    function normalOrderDomHandle(res,isShops){
        normalPg=res.info.count;
        var len=res.info.info.length;
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
                                    <span class="colorF35F62">${isShops?normalOrderShopsWarn(v):normalOrderPersonalWarn(v)}</span>
                                    </li>
                                    <li>
                                    <ul>
                                    ${proHtml}
                                    </ul>
                                    </li>
                                    <li class="borderBottom1 color252525 em0_8 txtRight rightPadding3">
                                    共${number}件商品 合计:￥${total}(含运费:￥0.00)
                                    </li>
                                    <li class="orderInfoFooter em0_8 txtRight clearFloat" data-totalM="${total}">
                                    <span class="lf orderType">普通订单</span>
                                    ${isShops?normalOrderShopsOperation(v):normalOrderPersonalOperation(v)}
                                    </li>
                                    </ul>
                                    </li>
                            `;
            }
        });
        len==5&&normalPg>1&&normalIndex<normalPg?normalLoadMore.text('上拉加载更多'):normalLoadMore.text('没有更多了');
        normalLoadMore.before(normalOrderHtml);
    }

    //商家凭证订单提示处理
    function voucherOrderShopsWarn(v){
        return v.order_state==1?'买家已上传凭证':'待平台确认审核';
    }
    //商家凭证订单操作处理
    function voucherOrderShopsOperation(v){
        return v.order_state==1?`<div class="confirmVoucher">上传商家凭证</div>`:'';
    }

    //个人凭证订单提示处理
    function voucherOrderPersonalWarn(v){
        return v.order_state==1?'已上传凭证':'待平台确认审核';
    }
    //个人凭证订单操作处理
    function voucherOrderPersonalOperation(v){
        return "";
    }

    //凭证订单DOM处理
    function voucherOrderHandle(res,isShops){
        voucherPg= res.info.count;
        var voucherOrderHtml="";
        var len=res.info.data.length;
        $(res.info.data).each(function(k,v){
            voucherOrderHtml+=`
                                <li class="orderItem borderBottom4" data-orderid="${v.order_id}">
        <ul>
                                    <li class="em0_8 flexRowBox justifyContentSpaceBetween alignItemCenter leftRightPadding3">
                                    <a href="#" class="color252525 flexRowBox alignItemCenter">
                                    <div class="shopImg">
                                    <img src="${v.shop_head_img}" alt="${v.shop_name}" class="img-response">
                                    </div>
                                    <span class="shopName">${v.shop_name}</span>
                                    <i class="iconfont icon-right"></i>
                                    </a>
                                    <span class="colorF35F62">${isShops?voucherOrderShopsWarn(v):voucherOrderPersonalWarn(v)}</span>
                                    </li>
                                    <li>
                                    <ul>
                                    <li class="orderProInfo flexRowBox aroundPadding23 em0_8">
                                    <div class="productImg">
                                    <img src="${v.product_logo}" alt="${v.product_name}" class="img-response">
                                    </div>
                                    <ul class="txtLeft">
                                    <li>
                                    ${v.product_name}
                                    </li>
                                    <li>
                                    ${v.product_describe}
                                    </li>
                                    <li class="flexRowBox justifyContentSpaceBetween">
                                    <span>￥${v.product_price}</span>
                                    <span>x1</span>
                                    </li>
                                    </ul>
                                    </li>
                                    </ul>
                                    </li>
                                    <li class="em0_8">
                                    凭证图片
                                    <div class="flexRowBox justifyContentCenter topBottomPadding2 borderTop1 borderBottom1">
                                    <div class="productImg">
                                    <img src="${v.user_img_prove}" alt="用户凭证" class="img-response">
                                    </div>
                                    ${v.shop_img_prove?`<div class="productImg">
                                    <img src="${v.shop_img_prove}" alt="商家凭证" class="img-response">
                                    </div>`:""}
                                    </div>
                                    </li>
                                    <li class="orderInfoFooter em0_8 txtRight clearFloat" data-totalm="0.01">
                                    <span class="lf orderType">凭证订单</span>
                                    ${isShops?voucherOrderShopsOperation(v):voucherOrderPersonalOperation(v)}
                                    </li>
                                    </ul>
                                    </li>
                            `;
        });
        len==5&&voucherPg>1&&voucherIndex<voucherPg?voucherLoadMore.text('上拉加载更多'):voucherLoadMore.text('没有更多了');
        voucherLoadMore.before(voucherOrderHtml);
    }

    //订单加载处理
    function orderLoadHandle(url,page,whichOrder,whichOrderWarnTXT,isShops,isVoucher){
        $.customAjax(
            url,
            {
                user_id:sessionStorage.getItem("uid"),
                state_code:sessionStorage.getItem("stateCode"),
                page:page
            },
            function(res){
                switch (res.code){
                    case 2000:
                        isVoucher?voucherOrderHandle(res,isShops):normalOrderDomHandle(res,isShops);
                        break;
                    case 2001:
                        whichOrder.text(whichOrderWarnTXT);
                        break;
                    case 9000:
                        $.loginOtherDevice(p,pop,closeBtn,"../loginRegisterHTML/login.html");
                        break;
                }
            }
        )
    }

    //加载商家管理内的普通订单
    function loadShopsNormalOrder(index){
        orderLoadHandle(
            "http://api.qianjiantech.com/v1/shopOrder",
            index,
            normalLoadMore,
            "没有普通订单",
            'isShops'
        );
    }
    //加载商家管理内的凭证订单
    function loadShopsVoucherOrder(index){
        orderLoadHandle(
            "http://api.qianjiantech.com/v1/shopOrderProve",
            index,
            voucherLoadMore,
            "没有凭证订单",
            'isShops',
            'isVoucher'
        );
    }
    //加载我的订单内的普通订单
    function loadPersonNormalOrder(index){
        orderLoadHandle(
            "http://api.qianjiantech.com/v1/myOrder",
            index,
            normalLoadMore,
            '您还没有普通订单'
        );
    }
    //加载我的订单内的凭证订单
    function loadPersonVoucherOrder(index){
        orderLoadHandle(
            "http://api.qianjiantech.com/v1/myOrderProve",
            index,
            voucherLoadMore,
            '您还没有凭证订单',
            null,
            'isVoucher'
        );
    }
    //判断商家管理页面或者我的订单页面再进行加载
    if(header.text().lastIndexOf('商家订单') != -1){
        loadShopsNormalOrder(normalIndex);
        loadShopsVoucherOrder(voucherIndex);
    }else{
        loadPersonNormalOrder(normalIndex);
        loadPersonVoucherOrder(voucherIndex);
    }

    //订单操作修改处理
    function orderOperationAction(self,txt,replaceTxt,html,replaceHtml){
        $(self).parent().parent().parent().html($(self).parent().parent().parent().html().replace(txt,replaceTxt).replace(html,replaceHtml))
    }
    //弹框确认取消处理
    var popConfirmDeal = function(url,orderId,fn,path){
        $(".settingWarn").on("click","span",function(e){
            e= e||window.event;
            switch($(e.target).html()){
                case "取消":
                    pop.removeClass("pop-show");
                    $(".settingWarn").unbind("click");
                    break;
                case "确定":
                    pop.removeClass("pop-show");
                    url&&$.customAjax(
                        url,
                        {user_id:sessionStorage.getItem("uid"), state_code:sessionStorage.getItem("stateCode"),order_id:orderId},
                        fn
                    );
                    if(path){
                        sessionStorage.setItem("isMyOrder","111");
                        $.jump(path,0)
                    }
                    $(".settingWarn").unbind("click");
                    break;
            }
        });
    };

    //上传凭证所需变量
    var imgData,self;
    //订单操作处理
    shopOrderBox.on("click",".orderInfoFooter>div",function(){
        var _self=this;
        //console.log(_self);
        sessionStorage.setItem("ord",$(_self).parent().parent().parent().attr("data-orderId"));
        sessionStorage.setItem("tmy",$(_self).parent().attr("data-totalM"));
        switch ($(_self)[0].className){
            //去支付
            case "goPay":
                $.reminderDeal(p,pop,"确认去支付?");
                popConfirmDeal(
                    null,
                    null,
                    null,
                    "../startHTML/12/pay.html"
                );
                break;
            //收货
            case "confirmReceive":
                $.reminderDeal(p,pop,"确认收货?");
                popConfirmDeal();
                break;
            //退货
            case "returnGood":
                $.reminderDeal(p,pop,"确认退货?");
                popConfirmDeal();
                break;
            //确认订单
            case "shopsConfirm":
                $.reminderDeal(p,pop,"确认该订单?");
                popConfirmDeal(
                    "http://api.qianjiantech.com/v1/shopIsSureOrder",
                    $(_self).parent().parent().parent().attr("data-orderid"),
                    function(res){
                        switch (res.code){
                            case 2000:
                                orderOperationAction(
                                    _self,
                                    '买家已支付,待确认',
                                    '待发货',
                                    '<div class="shopsConfirm">&nbsp;确认订单&nbsp;</div>',
                                    '<div class="shipments">&nbsp;确认发货&nbsp;</div>'
                                );
                                //location.reload();
                                break;
                        }
                    }
                );
                break;
            //确认发货
            case "shipments":
                $.reminderDeal(p,pop,"确认发货?");
                //popConfirmDeal();
                orderOperationAction(
                    _self,
                    '待发货',
                    '已发货',
                    '<div class="shipments">&nbsp;确认发货&nbsp;</div>',
                    ''
                );
                break;
            //上传商家凭证
            case "confirmVoucher":
                self=_self;
                $("#shopsVoucherLoadMak").addClass("show");
                break;
        }
    });

    //***商家上传凭证处理***//
    //关闭清除凭证上传处理
    function closeClear(){
        $("#shopsVoucherLoadMak").removeClass("show");
        $("#shopsVoucherLoadImgBox").html("");
        $("#confirmUploading").removeClass("show");
    }
    //点击除中间区域外其他区域关闭弹框
    $("#shopsVoucherLoadMak").mouseup(function(e){
        var _con = $("#shopsVoucherLoadMak>div");
        if(_con != e.target && _con.has(e.target).length === 0){
            closeClear();
        }
    });
    //图片转base64
    function readFile(){
        var file = this.files[0];
        var type=file.type;
        var imgBase64;
        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
        if(!/[jpeg|png|jpg]$/.test(type)){
            alert("请确保文件为图像类型");
            return false;
        }
        if(file.size>204800){
            if(document.createElement("canvas").getContext){
                var c=document.createElement('canvas');
                var ctx=c.getContext('2d');
                var img=new Image();
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    var data = this.result;
                    img.src = data;
                    img.onload = function () {
                        var m = this.width / this.height;
                        c.height = 600;//该值影响缩放后图片的大小
                        c.width = 600 * m;
                        ctx.drawImage(img, 0, 0, 600 * m, 600);
                        imgBase64 = c.toDataURL("image/jpeg").replace(/^data:image\/(png|jpg);base64,/, "");
                        imgData=imgBase64;
                        $("#shopsVoucherLoadImgBox").html('<img src="' + imgBase64 + '" class="img-response" />');
                        $("#confirmUploading").addClass("show");
                    };
                }
            }else{
                alert("图片尺寸请不要大于200KB");
                return false;
            }

        }else{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                imgBase64 = this.result.replace(/^data:image\/(png|jpg);base64,/,"");
                imgData=imgBase64;
                $("#shopsVoucherLoadImgBox").html('<img src="' + imgBase64 + '" class="img-response" />');
                $("#confirmUploading").addClass("show");
            }
        }
    }
    if ( typeof(FileReader) === 'undefined' ){
        alert("抱歉，您的浏览器不支持FileReader!");
        $("#shopsVoucherFile").attr('disabled','disabled');
    }else{
        $("#shopsVoucherFile").change(readFile);
    }
    //商家确认凭证
    function shopIsSureProveOrder(t){
        imgData && $.customAjax(
            "http://api.qianjiantech.com/v1/shopIsSureProveOrder",
            {
                user_id: sessionStorage.getItem("uid"),
                state_code: sessionStorage.getItem("stateCode"),
                order_id: sessionStorage.getItem("ord"),
                shop_prove_pic: imgData,
                token: t
            },
            function(res){
                switch (res.code){
                    case 2000:
                        //将商家凭证加入
                        $(self).parent().prev().children().append(`<div class="productImg">
                                    <img src="${imgData}" alt="用户凭证" class="img-response">
                                    </div>`);
                        orderOperationAction(
                            self,
                            '买家已上传凭证',
                            '待平台确认审核',
                            '<div class="confirmVoucher">上传商家凭证</div>',
                            ''
                        );
                        closeClear();
                        break;
                    case 2005:
                        $.customAjax(
                            "http://api.qianjiantech.com/v1/getToken",
                            {
                                user_id: sessionStorage.getItem("uid"),
                                state_code: sessionStorage.getItem("stateCode")
                            },
                            function(key){
                                shopIsSureProveOrder(key.info.token)
                            }
                        );
                        break;
                }
            }
        )
    }
    //确认上传
    $("#confirmUploading").click(function(){
        shopIsSureProveOrder(sessionStorage.getItem("t"))
    });

    //清除ord
    $("header>a").click(function(){
        sessionStorage.removeItem("ord")
    });

    //凭证图片放大处理
    voucherOrder.on("click",'.productImg>img',function(){
        var src=$(this).attr("src");
        $("#imgMagnifyMask").addClass("show").click(function(){$(this).removeClass('show')});
        $("#imgMagnifyBox").html(`<img src="${src}" alt="用户凭证" class="img-response"/>`);

    });

    //手势处理
    var startX=0,startY=0,endX=0,endY=0,xDistance=0,selfLeft=0;
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
            //console.log("上滑");
            //topSlideJudge=true;
            //rightSlideJudge=bottomSlideJudge=leftSlideJudge=false;
            //if(topSlideJudge){
            //    if(selfLeft==-w){
            //        voucherOrder.css("top",(endY-startY)/Math.PI);
            //    }else{
            //        normalOrder.css("top",(endY-startY)/Math.PI);
            //    }
            //}
        }
        //下滑
        if(startY<endY&&endY-startY>Math.abs(startX-endX)){
            //console.log("下滑");
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
            //console.log("左滑");
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
            //console.log("右滑");
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
        normalOrder.css("top",0);
        voucherOrder.css("top",0);
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
        }

    });

    //上拉加载更多
    normalOrder.scroll(function () {
        //console.log(document.body.offsetHeight-normalLoadMore.offset().height);
        //console.log($(this).scrollTop(),$(window).height(),normalOrder.height());
        if (document.body.offsetHeight-normalLoadMore.offset().height == Math.round(normalLoadMore.offset().top)) {
            normalIndex+=1;
            if(header.text().lastIndexOf('商家订单') != -1){
                normalIndex<=normalPg&&normalLoadMore.text("加载中...")&&loadShopsNormalOrder(normalIndex);
            }else{
                normalIndex<=normalPg&&normalLoadMore.text("加载中...")&&loadPersonNormalOrder(normalIndex);
            }
        }
    });

    voucherOrder.scroll(function () {
        if (document.body.offsetHeight-voucherLoadMore.offset().height == Math.round(voucherLoadMore.offset().top)) {
            voucherIndex+=1;
            if(header.text().lastIndexOf('商家订单') != -1){
                voucherIndex<=voucherPg&&voucherLoadMore.text("加载中...")&&loadShopsVoucherOrder(normalIndex);
            }else{
                voucherIndex<=voucherPg&&voucherLoadMore.text("加载中...")&&loadPersonVoucherOrder(normalIndex);
            }
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
    //normalLoadMore.click(function(){
    //    $("body").scrollTo({toT:0})
    //});
});