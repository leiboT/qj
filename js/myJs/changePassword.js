$(function(){
    var warnPop=$("#warnPop");
    function showDiePop(ele,txt,t){
        ele.text(txt).addClass("showWarnPop");
        setTimeout(function(){
            ele.removeClass("showWarnPop")
        },t)
    }

    function judgeEmpty(selector){
        return $(selector).val()
    }
    function judgePwdValue(){
        return /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,12}$/.test($("[name='new_password']").val())
    }
    function judgeTwoPwd(){
        return $("[name='new_password']").val()==$("[name='issure_password']").val()
    }
    $(".submitBtn").click(function(e){
        e=e||window.event;
        e.preventDefault();
        var a=judgeEmpty("[name='password']");
        var b=judgeEmpty("[name='new_password']");
        var c=judgeTwoPwd();
        var d=judgePwdValue();
        a&&b&&c&&d&&$.customAjax(
            "http://api.qianjiantech.com/v1/setPsd",
            $("#changePwdForm").serialize()+"&state_code="+sessionStorage.getItem("stateCode")+"&user_id="+sessionStorage.getItem("uid"),
            function(result){
                //console.log(result);
                switch (result.code){
                    case 2000:
                        showDiePop(warnPop,"修改成功,请重新登录!",1500);
                        $.jump("../../loginRegisterHTML/login.html",1000);
                        sessionStorage.clear();
                        break;
                    case 2001:
                    case 4000:
                        showDiePop(warnPop,"设置失败,请重试",1500);
                        break;
                    case 2002:
                        showDiePop(warnPop,"原密码错误,请重新输入",1500);
                        break;
                    case 2003:
                        showDiePop(warnPop,"两次填写的密码不一致",1500);
                        break;
                    case 9000:
                        showDiePop(warnPop,"已在其他设备上登录",1500);
                        $.jump("../../loginRegisterHTML/login.html",1500);
                        sessionStorage.clear();
                        break;
                }
            }
        );
        if(!a){
            showDiePop(warnPop,"密码不能为空!",1500)
        }else if(!b){
            showDiePop(warnPop,"新密码不能为空!",1500)
        }else if(!c){
            showDiePop(warnPop,"两次填写的密码不一致!",1500)
        }else if(!d){
            showDiePop(warnPop,"密码必须设置为6~12位!",1500)
        }
    })
});