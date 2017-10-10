$(function(){
    //二维码图片
    var img=$("#codeBg img");
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
    if(!sessionStorage.getItem("userQRCode")){
        customAjax(
            "http://api.qianjiantech.com/v1/promotion",
            {
                user_id:sessionStorage.getItem("uid"),
                state_code:sessionStorage.getItem("stateCode")
            },
            function(result){
                result.code==2000&&img.attr("src",result.info)&&sessionStorage.setItem("userQRCode",result.info);
            }
        );
    }else{
        img.attr("src",sessionStorage.getItem("userQRCode"))
    }
});