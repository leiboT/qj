$(function(){
    //余额积分页处理函数
    function balanceScore(){
        var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
        if(userInfo){
            $(".myBalance").html("￥"+userInfo.uMoney);
            $(".myIntegral").html(userInfo.uScore);
        }
    }
    balanceScore();
});