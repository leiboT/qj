$(function(){
    //余额
    var myBalance = $(".myBalance>span");
    //提现按钮
    var withdrawBtn = $('.withdrawBtn');
    //提现模态框
    var withdrawMak = $("#withdrawMak");
    //提现输入框
    var moneyInput = $(".moneyInput>input");
    //提醒吐司框
    var warnPop = $("#warnPop");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //余额积分页处理函数
    function balanceScore(){
        var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
        if(userInfo){
            myBalance.text(userInfo.uMoney);
            $(".myIntegral").html(userInfo.uScore);
        }
    }
    balanceScore();

    withdrawBtn.click(function(){
        withdrawMak.addClass('show');
        moneyInput.focus();
    });
    //点击其他区域关闭
    withdrawMak.mouseup(function(e){
        var _con = $("#withdrawBox");
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("show")
        }
    });
    //显示隐藏提示框
    function showDiePop(ele,txt,t){
        ele.text(txt).addClass("show");
        setTimeout(function(){
            ele.removeClass("show")
        },t)
    }
    //为提现框下的取消确定做事件处理
    $(".withdrawOperate").on("click","span",function(){
        switch ($(this).text()){
            case '取消':
                withdrawMak.removeClass("show");
                break;
            case '确定':
                var money = Number(moneyInput.val());
                if(money >= 100){
                    $.customAjax(
                        "http://api.qianjiantech.com/v1/withDraw",
                        {
                            user_id: sessionStorage.getItem("uid"),
                            state_code: sessionStorage.getItem("stateCode"),
                            score: money
                        },
                        function(res){
                            switch (res.code){
                                case 2000:
                                    withdrawMak.removeClass("show");
                                    myBalance.text(Number(myBalance.text())-money);
                                    showDiePop(warnPop,"提现操作成功",1500);
                                    break;
                                case 2001:
                                    withdrawMak.removeClass("show");
                                    showDiePop(warnPop,"提现申请失败",1500);
                                    break;
                                case 2002:
                                    withdrawMak.removeClass("show");
                                    showDiePop(warnPop,"提现金额必须大于等于100",1500);
                                    break;
                                case 2003:
                                    withdrawMak.removeClass("show");
                                    showDiePop(warnPop,"您的余额不足",1500);
                                    break;
                                case 4000:
                                    withdrawMak.removeClass("show");
                                    showDiePop(warnPop,"所需信息不全",1500);
                                    break;
                                case 9000:
                                    withdrawMak.removeClass("show");
                                    $.loginOtherDevice(p,pop,closeBtn,"../loginRegisterHTML/login.html");
                                    break;
                            }
                        }
                    )
                }else{
                    showDiePop(warnPop,"提现金额必须大于等于100",1500);
                }
                break;
        }
    })
});