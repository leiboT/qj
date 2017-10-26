$(function(){
    //提示元素
    var warnPop = $("#warnPop");
    //银行卡号输入框
    var bank_card_number = $("#bank_card_number");
    //银行卡号再次输入框
    var bank_card_number1 = $("#bank_card_number1");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //如果从余额页进来
    if(sessionStorage.getItem("isBalance")){
        $("header>a").attr("href","../myBalance.html");
    }
    $("header>a").click(function(){
        sessionStorage.removeItem("isBalance");
    });
    //判断输入是否完成
    function judgeFinish(){
        var judge = true;
        $("#bankForm input").each(function(k,v){
            judge = judge && $(v).val() != "";
        });
        return judge;
    }
    //提示处理
    function hint(ele,txt,t){
        ele.text(txt).addClass("showWarnPop");
        setTimeout(function(){
            ele.removeClass("showWarnPop")
        },t)
    }
    //验证两次输入是否一致
    function judgeBankCardTwoInput(){
        if(bank_card_number.val() && bank_card_number1.val()){
            return bank_card_number.val() != bank_card_number1.val()
        }
    }
    $(".submitConfirmBtn").click(function(e){
        e = e || window.event;
        e.preventDefault();
        if(judgeFinish()){
            $.customAjax(
                "http://api.qianjiantech.com/v1/bankInfo",
                $("#bankForm").serialize()+"&user_id="+sessionStorage.getItem("uid")+"&state_code="+sessionStorage.getItem("stateCode"),
                function(res){
                    console.log(res);
                    switch (res.code){
                        case 2000:
                            hint(warnPop,"信息提交成功",1500);
                            sessionStorage.getItem("isBalance")? $.jump("../myBalance.html",1000) : $.jump("../setting.html",1000);
                            sessionStorage.removeItem("isBalance");
                            break;
                        case 2001:
                            hint(warnPop,"信息提交失败",1500);
                            break;
                        case 4000:
                            hint(warnPop,"信息不全",1500);
                            break;
                        case 9000:
                            $.loginOtherDevice(p,pop,closeBtn,"../../loginRegisterHTML/login.html");
                            break;
                    }
                }
            )
        }else if(judgeBankCardTwoInput()){
            hint(warnPop,"两次输入卡号不一致",1500);
        }else{
            hint(warnPop,"请先填写完信息",1500);
        }
    })
});