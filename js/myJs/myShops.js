$(function(){
    //用户ID
    var uid=sessionStorage.getItem("uid");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //我的推广页处理函数
    function myPromotion(){
        var proList = $("#pro-list");
        //var loadMore=$("#pro-list li.loadMore");
        //var index=1;
        //var pg;

        function promotionLoad(uid,page){
            $.customAjax(
                "http://api.qianjiantech.com/v1/myBusiness",
                {user_id:uid,
                    //page:page,
                    state_code:sessionStorage.getItem("stateCode")},
                function(result){
                    //console.log(result);
                    var code=result.code;
                    //console.log(code);
                    if(code==2000){
                        //pg=result.page;
                        //console.log(page);
                        var info=result.info;
                        //console.log(info);
                        var len=info.length;
                        //len<10?loadMore.html("<div>没有更多了</div>"):loadMore.html("<div>上拉加载更多..</div>");
                        for(var i=0,html=""; i<len; i++){
                            //console.log(i);
                            html+=`
                    <li>
                        <div class="pro-img">
                            <img src="${info[i].head_pic}" alt="" class="img-response"/>
                        </div>
                        <div class="pro-info">
                            <p>${info[i].nikename}</p>
                            <p>${info[i].account}</p>
                        </div>
                    </li>
                    `;
                        }
                        //$(loadMore).before(html);
                        proList.html(html);
                    }else if(code==2001){
                        //loadMore.html("<div>您还没有商家</div>");
                        proList.html("<li class='noData'>您还没有商家</li>")
                    }else if(code==9000){
                        $.loginOtherDevice(p,pop,closeBtn,"../loginRegisterHTML/login.html")
                    }
                }
            );
        }
        promotionLoad(uid);

        //下拉加载更多
        //$('body').scroll(function () {
        //    //console.log(123);
        //    if ($(this).scrollTop() + $(this).height() >= $("#pro-list").height()+50) {
        //        //console.log("哦哦,到底了.");
        //        index+=1;
        //        index<=pg?loadMore.html("<div>加载中...</div>"):loadMore.html("<div>没有更多了</div>");
        //        setTimeout(function(){
        //            index<=pg&&promotionLoad(uid,index);
        //        },1000);
        //    }
        //});
    }
    if(uid)
        myPromotion();
});