$(function(){
    var payBtn=$(".payBtn");
    $(".payBtn>span").text(sessionStorage.getItem("tmy"));
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
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }
    payBtn.click(function(){
        customAjax(
            "http://api.qianjiantech.com/JsPay",
            {open_id:sessionStorage.getItem("oid"),order_id:sessionStorage.getItem("ord"),user_id:sessionStorage.getItem("uid")},
            function(res){
                //console.log(typeof JSON.parse(res.info.jsApiParameters));
                function jsApiCall()
                {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        JSON.parse(res.info.jsApiParameters),
                        function(res){
                            //WeixinJSBridge.log(res.err_msg);
                            //alert(res.err_code+res.err_desc+res.err_msg);
                            //alert(res.errMsg+JSON.stringify(res));
                            switch (res.err_msg){
                                case "get_brand_wcpay_request:cancel":
                                    alert("支付取消");
                                    jump("writeOrder.html",0);
                                    break;
                                case "get_brand_wcpay_request:ok":
                                    alert("支付成功");
                                    jump("shoppingCart.html",0);
                                    break;
                            }
                        }
                    );
                }

                function callpay()
                {
                    if (typeof WeixinJSBridge == "undefined"){
                        if( document.addEventListener ){
                            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                        }else if (document.attachEvent){
                            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                        }
                    }else{
                        jsApiCall();
                    }
                }
                callpay();
            }
        )
    })
});