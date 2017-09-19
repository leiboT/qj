$(function(){
    //注册协议弹出框
    var protocolBox=$("#protocolBox");
    var protocolContentContainer=$(".protocolContent .protocolContent-container");
    //弹出模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$("#pop span");
    //手机号正则
    var regPhone=/^1[3|5|7|8]\d{9}$/;
    //密码正则
    var regPwd=/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,12}$/;
    ////验证码正则
    //var regCode=/^[0-9]{6}$/;
    //成功状态弹出框
    var successPop=$("#successPop");

    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }
    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });

    //验证码处理函数
    function getCode(){
        var userPhone=$("#userPhone").val();
        $.ajax({
            url:"http://api.qianjiantech.com/v1/sm",
            type:"post",
            data:{phone:userPhone},
            dataType:"json",
            success:function(result){
                var code=result.code;
                if(code==2000){
                    reminderDeal("验证码已发送!");
                }else if(code==2001){
                    reminderDeal("验证码发送失败!");
                }else if(code==9999){
                    reminderDeal("未知错误!");
                }else if(code==4000){
                    reminderDeal("信息不全!");
                }
            },
            error:function(error){
                //console.log(error);
            }
        });
    }

    //表单判断处理函数
    function judgePhone(){
        var userPhone=$("#userPhone").val();
        return regPhone.test(userPhone);
    }
    function judgePwd(){
        var userPwd=$("#userPwd").val();
        return regPwd.test(userPwd);
    }
    function judgePwds(){
        var userPwd=$("#userPwd").val();
        var userPwds=$("#userPwds").val();
        return userPwd==userPwds;
    }
    function judgeReferrerPhone(){
        var referrerPhone=$("#referrerPhone").val();
        return regPhone.test(referrerPhone);
    }
    //function judgeCode(){
    //    var code=$("#userCode").val();
    //    return regCode.test(code);
    //}
    function judgeCheck(){
        var protocolCheck=$("#regProtocol input");
        return $(protocolCheck).is(":checked");
    }

    //获取验证码
    $("div.captcha").click(function(){
        if(judgePhone()){
            $("#userCode").removeAttr("readonly");
            $(this).unbind("click");
            getCode();
            var self=this;
            var t=90;
            function task(){
                t-=1;
                $(self).html(t+"S");
                if(t<=0){
                    clearInterval(timer);
                    timer=null;
                    $(self).html("重新获取");
                    if($(self).html()=="重新获取"){
                        //$("#userCode").attr("readonly","readonly");
                        t=90;
                        $(self).bind("click",function(){
                            if(judgePhone()){
                                //$("#userCode").removeAttr("readonly");
                                $(self).unbind("click");
                                timer=setInterval(task,1000);
                                getCode();
                            }else{
                                reminderDeal("请先输入手机号!");
                            }
                        })
                    }
                }
            }
            var timer=setInterval(task,1000);
        }else{
            reminderDeal("请先输入手机号!");
        }
    });

    //弹出注册协议
    $("span.protocolTxt").click(function(){
        $.ajax({
            type:"post",
            url:"http://api.qianjiantech.com/v1/protocol",
            dataType:"json",
            success:function(result){
                var info=result.info;
                var title=info.title;
                var content=info.content;
                protocolContentContainer.html(title+content);
            }
        });
        protocolBox.addClass("pop-show");
    });
    //关闭注册协议
    $(".protocolContent-header span").click(function(){
        protocolBox.removeClass("pop-show");
    });

    //注册提交事件
    $("#register-btn").click(function(e){
        e = e || window.event;
        e.preventDefault();
        var a=judgePhone();
        var b=judgePwd();
        var c=judgePwds();
        var d=judgeReferrerPhone();
        //var f=judgeCode();
        var h=judgeCheck();

        if(a&&b&&c&&d&&$("#userCode").val()&&h){
            var data=$("#reg-form").serialize();
            $.ajax({
                type:"post",
                url:"http://api.qianjiantech.com/v1/register",
                data:data,
                dataType:"json",
                success:function(result){
                    var code=result.code;
                    if(code==2000){
                        successPop.html("注册成功");
                        successPop.show();
                        setTimeout(function(){
                            location.href="http://web.qianjiantech.com/loginRegisterHTML/login.html"
                        },900)
                    }else if(code==2001){
                        reminderDeal("用户已存在!");
                    }else if(code==2002){
                        reminderDeal("推荐人不存在!");
                    }else if(code==3001){
                        reminderDeal("验证码不正确!");
                    }else if(code==3002){
                        reminderDeal("验证码超时!");
                    }else if(code==4000){
                        reminderDeal("信息不全!");
                    }
                }
            })
        }else if(!$("#userPhone").val()){
            reminderDeal("请输入手机号!");
        }else if(!a){
            reminderDeal("手机格式不正确!");
            //$("#userPhone").focus();
        }else if(!$("#userPwd").val()){
            reminderDeal("请输入密码!");
        }else if(!b){
            reminderDeal("密码格式不正确!");
            //$("#userPwd").focus();
        }else if(!$("#userPwds").val()){
            reminderDeal("请再次输入密码!");
        }else if(!c){
            reminderDeal("两次密码输入不匹配!");
            //$("#userPwds").focus();
        }else if(!$("#referrerPhone").val()){
            reminderDeal("请输入推荐人手机!");
        }else if(!d){
            reminderDeal("推荐人手机不正确!");
            //$("#referrerPhone").focus();
        }else if(!$("#userCode").val()){
            reminderDeal("请输入验证码!");
            //$("#userCode").focus();
        }else if(!h){
            reminderDeal("请勾选注册协议!");
        }
    });

    //关闭模态弹出框
    closeBtn.on("click",function(){
        pop.removeClass("pop-show");
    });

    //显示和隐藏密码
    $("[class*='icon-eye']").on("click",function(){
        var cl=$(this).attr("class");
        var input=$(this).prev("input");
        var v=input.val();
        //显示
        if(cl=="iconfont icon-eyeOpen"){
            $(this).attr("class","iconfont icon-eyeClose");
            $(input).attr("type","text").val(v);
        }else{
            $(this).attr("class","iconfont icon-eyeOpen");
            $(input).attr("type","password").val(v);
        }
    });

    //登录
    $("#login-btn").click(function(e){
        e = e || window.event;
        e.preventDefault();
        var a=judgePhone();
        var b=judgePwd();
        if(a&&b){
            var data=$("#login-form").serialize();
            $.ajax({
                type:"post",
                url:"http://api.qianjiantech.com/v1/login",
                data:data,
                dataType:"json",
                success:function(result){
                    var code=result.code;
                    if(code==2000){
                        var statusCode=result.info.state_code;
                        sessionStorage.setItem("stateCode",statusCode);
                        var uid=result.info.id;
                        sessionStorage.setItem("uid",uid);
                        var t=result.info.token;
                        sessionStorage.setItem("t",t);
                        successPop.html("登录成功");
                        successPop.show();
                        setTimeout(function(){
                            location.href="../start.html"
                        },900)
                    }else if(code==2001){
                        reminderDeal("账号或密码错误");
                    }else if(code==4000){
                        reminderDeal("信息不全");
                    }
                },
                error:function(error){
                    //console.log(error)
                }
            })
        }else if(!$("#userPhone").val()){
            reminderDeal("请输入账号!");
        }else if(!a){
            reminderDeal("账号格式错误!");
        }else if(!$("#userPwd").val()){
            reminderDeal("请输入密码!");
        }else if(!b){
            reminderDeal("密码格式错误!");
        }
    });

    //找回密码提交事件
    $("#findBtn").click(function(e){
        e = e || window.event;
        e.preventDefault();
        var a=judgePhone();
        var b=judgePwd();
        //var c=judgeCode();
        if(a&&b){
            var data=$("#find-form").serialize();
            $.ajax({
                type:"post",
                url:"http://api.qianjiantech.com/v1/forgetPsd",
                data:data,
                dataType:"json",
                success:function(result){
                    var code=result.code;
                    if(code==2000){
                        successPop.html("修改成功");
                        successPop.show();
                        setTimeout(function(){
                            location.href="http://web.qianjiantech.com/loginRegisterHTML/login.html"
                        },1000)
                    }else if(code==2001){
                        reminderDeal("修改失败!");
                    }else if(code==2002){
                        reminderDeal("账号不存在");
                    }else if(code==3001){
                        reminderDeal("验证码不正确!");
                    }else if(code==3002){
                        reminderDeal("验证码超时!");
                    }
                },
                error:function(){
                    //console.log("出错了")
                }
            })
        }else if(!$("#userPhone").val()){
            reminderDeal("请输入账号!");
        }else if(!a){
            reminderDeal("账号格式不正确!");
        }else if(!$("#userCode").val()){
            reminderDeal("请输入验证码!");
        }else if(!$("#userPwd").val()){
            reminderDeal("请输入密码!");
        }else if(!b){
            reminderDeal("密码格式不正确!");
        }
    })
});