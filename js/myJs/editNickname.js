$(function(){
    var warnPop=$("#warnPop");
    var nickname=$("[name='nike_name']");

    function judgeNicknameEmpty(){
        return nickname.val()
    }
    function judgeNicknameTxt(){
        return /(^[\u4E00-\u9FA5a-zA-Z0-9_]{2,15}$)/.test(nickname.val())
    }
    function showDiePop(ele,txt,t){
        ele.text(txt).addClass("showWarnPop");
        setTimeout(function(){
            ele.removeClass("showWarnPop")
        },t)
    }


    $("[form='nickname_form']").click(function(e){
        e=e||window.event;
        e.preventDefault();
        var a=judgeNicknameEmpty();
        var b=judgeNicknameTxt();
        a&&b&&$.customAjax(
            "http://api.qianjiantech.com/v1/modifyNikeName",
            {
                state_code:sessionStorage.getItem("stateCode"),
                user_id:sessionStorage.getItem("uid"),
                nike_name:nickname.val()
            },
            function(result){
                console.log(result);
                switch (result.code){
                    case 2000:
                        var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
                        userInfo.uName=nickname.val();
                        sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
                        $.jump("../setting.html",0);
                        break;
                    case 2001:
                        showDiePop(warnPop,"修改失败,请重试!",2000);
                        break;
                    case 9000:
                        warnPop.text("已在其他设备登录").addClass("showWarnPop");
                        $.jump("../../loginRegisterHTML/login.html",1500);
                        sessionStorage.clear();
                }
            }
        );
        if(!a){
            showDiePop(warnPop,"昵称不能为空!",2000)
        }else if(!b){
            showDiePop(warnPop,"昵称为2~15位中英文,数字,下划线!",2000)
        }

    })
});