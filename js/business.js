$(function(){
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //点击其他区域关闭弹框
    $.elseClosePop(pop);
    //获取商家身份状态
    $.customAjax(
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
                        $(".storeIndex").html(`<span>您已是商家</span><a href="businessHTML/shopsOrder.html">
            商家管理>>
        </a>`);
                        break;
                }
            }else if(code==4000){
                $.pleaseLogin(p,pop,closeBtn,"loginRegisterHTML/login.html");
            }else if(code==9000){
                $.loginOtherDevice(p,pop,closeBtn,"loginRegisterHTML/login.html");
            }
        }
    );
});