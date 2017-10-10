$(function(){
    //用户头像盒子
    var uAvatar=$("div.loginIn-img img");
    //点击登录或用户名称盒子
    var u=$("div.loginIn-info");
    //余额盒子
    var balance=$("li.balance p");
    //积分盒子
    var integral=$("li.integral p");
    //二维码图片
    var img=$("#codeBg img");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //用户ID
    var uid=sessionStorage.getItem("uid");

    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }
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

    //请先登录处理函数
    function pleaseLogin(e){
        e = e || window.event;
        e.preventDefault();
        reminderDeal("请先登录!");
        closeBtn.html("进入登录页");
        closeBtn.on("click",function(){
            jump("loginRegisterHTML/login.html",0);
        });
    }

    if(!uid) {
        $("#my-nav>li").on("click", function () {
            pleaseLogin()
        });
        $("#balance-integral>li").on("click", function () {
            pleaseLogin()
        });
        $("#setting").on("click", function () {
            pleaseLogin()
        });
    }

    //}else if(uid){
    //    $("#my-nav a").click(function(e){
    //        switch($(this).attr("class")){
    //            case "myCode":
    //                //e = e || window.event;
    //                //e.preventDefault();
    //
    //                break;
    //            case "myOrder":
    //                break;
    //            case "myCollection":
    //                break;
    //            case "myStore":
    //                location.href="myHTML/myShops.html";
    //                break;
    //            case "myPromotion":
    //                location.href="myHTML/myPromotion.html";
    //                break;
    //            case "callService":
    //                break;
    //        }
    //    })
    //}

    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });

    //加载用户二维码
    //function loadUserCode(uid){
    //    if(uid){
    //        customAjax(
    //            "http://api.qianjiantech.com/getPromotion",
    //            {user_id:uid},
    //            function(result){
    //                //alert(JSON.stringify(result));
    //                if(result.code==2000){
    //                    $(img).attr("src",result.url);
    //                }else if(result.code==2001){
    //                    customGetAjax(
    //                        result.info,
    //                        function(data){
    //                            console.log(data)
    //                        }
    //                    )
    //                }
    //            }
    //        );
    //    }
    //}
    //if(uid)
    //    loadUserCode(uid);

    //加载用户数据
    function loadUserInfo(uid){
        if(uid){
            customAjax(
                "http://api.qianjiantech.com/v1/myinfo",
                {user_id:uid,state_code:sessionStorage.getItem("stateCode")},
                function(result){
                    var code=result.code;
                    if(code==2000){
                        var info=result.info;
                        var uName=info.nikename;
                        var score=info.score;
                        var money=info.money;
                        var uPic=info.head_pic;
                        var phone=info.phone;
                        sessionStorage.setItem("userInfo",JSON.stringify({"uPic":uPic,"uName":uName,"uPhone":phone,"uMoney":money,"uScore":score}));
                        u.html(uName);
                        uAvatar.attr("src",uPic);
                        balance.html("余额："+money+"元");
                        integral.html("积分："+score+"分");
                    }else if(code==9000){
                        reminderDeal("你已在其他设备登录!");
                        closeBtn.html("即将进入登录页").unbind("click");
                        jump("loginRegisterHTML/login.html",1500);
                        sessionStorage.clear();
                    }
                }
            );
        }
    }
    if(!sessionStorage.getItem("userInfo"))
        loadUserInfo(uid);
    else{
        var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
        u.html(userInfo.uName);
        uAvatar.attr("src",userInfo.uPic);
        balance.html("余额："+userInfo.uMoney+"元");
        integral.html("积分："+userInfo.uScore+"分");
    }

    ////余额积分页处理函数
    //function balanceScore(){
    //    var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
    //    if(userInfo){
    //        $(".myBalance").html("￥"+userInfo.uMoney);
    //        $(".myIntegral").html(userInfo.uScore);
    //    }
    //}
    //balanceScore();

    ////用户设置页处理函数
    //function userSetting(){
    //    $("#logOutBtn").click(function(){
    //        $("#pop").addClass("pop-show");
    //        $(".settingWarn").on("click","span",function(e){
    //            e= e||window.event;
    //            console.log(e.target);
    //            switch($(e.target).html()){
    //                case "取消":
    //                    $("#pop").removeClass("pop-show");
    //                    break;
    //                case "确定":
    //                    sessionStorage.clear();
    //                    setTimeout(function(){
    //                        location.href="../loginRegisterHTML/login.html";
    //                    },500);
    //                    break;
    //            }
    //        });
    //    });
    //
    //    var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
    //    console.log(userInfo);
    //    if(userInfo){
    //        $("#uPic img").attr("src",userInfo.uPic);
    //        $("#nikeName").html(userInfo.uName);
    //        $("#uPhone").html(userInfo.uPhone);
    //    }
    //}
    //if(uid)
    //    userSetting();

    //我的推广页处理函数
    //function myPromotion(){
    //    //$("body").addClass("noPaddingBottom");
    //    var loadMore=$("#pro-list li.loadMore");
    //    var loadMoreShops=$("#pro-list li.loadMoreShops");
    //    var index=1;
    //    var pg;
    //    //用户ID
    //    var uid=sessionStorage.getItem("uid");
    //    console.log(uid);
    //
    //    function promotionLoad(uid,page){
    //        $.ajax({
    //            url:"http://api.qianjiantech.com/v1/mysub",
    //            type:"get",
    //            data:{user_id:uid,page:page,state_code:sessionStorage.getItem("stateCode")},
    //            dataType:"json",
    //            success:function(result){
    //                console.log(result);
    //                var code=result.code;
    //                console.log(code);
    //                if(code==2000){
    //                    pg=result.page;
    //                    console.log(page);
    //                    var info=result.info;
    //                    console.log(info);
    //                    var len=info.length;
    //                    len<10?loadMore.html("<div>没有更多了</div>"):loadMore.html("<div>上拉加载更多..</div>");
    //                    for(var i=0,html=""; i<len; i++){
    //                        console.log(i);
    //                        html+=`
    //                <li>
    //                    <div class="pro-img">
    //                        <img src="${info[i].head_pic}" alt="" class="img-response"/>
    //                    </div>
    //                    <div class="pro-info">
    //                        <p>${info[i].nikename}</p>
    //                        <p>${info[i].account}</p>
    //                    </div>
    //                </li>
    //                `;
    //                    }
    //                    $(loadMore).before(html);
    //                }else if(code==2001){
    //                    loadMore.html("<div>您还没有下线</div>")
    //                }else if(code==9000){
    //                    reminderDeal("你已在其他设备登录!");
    //                    closeBtn.html("即将进入登录页").unbind("click");
    //                    setTimeout(function(){
    //                        location.href="../loginRegisterHTML/login.html";
    //                    },1500);
    //                    sessionStorage.clear();
    //                }
    //            }
    //        })
    //    }
    //
    //    promotionLoad(uid,index);
    //
    //    //下拉加载更多
    //    $(window).scroll(function () {
    //        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
    //            console.log("哦哦,到底了.");
    //            index+=1;
    //            index<=pg?loadMore.html("<div>加载中...</div>"):loadMore.html("<div>没有更多了</div>");
    //            setTimeout(function(){
    //                index<=pg&&promotionLoad(uid,index);
    //            },1000);
    //        }
    //    });
    //}
    //if(uid)
    //    myPromotion();

    ////头像设置
    //function readFile(){
    //    var file = this.files[0];
    //    var self=this;
    //    console.log(self);
    //    var type=file.type;
    //
    //    //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
    //    if(!/[jpeg|png|jpg]$/.test(type)){
    //        alert("请确保文件为图像类型");
    //        return false;
    //    }
    //    console.log(file.size);
    //
    //    if(file.size>204800){
    //        if(document.createElement("canvas").getContext){
    //            var c=document.getElementById('myCanvas');
    //            console.log(c);
    //            var ctx=c.getContext('2d');
    //            var img=new Image();
    //            var reader = new FileReader();
    //            reader.readAsDataURL(file);
    //            reader.onload = function(e) {
    //                var data = this.result;
    //                user_prove_pic=data;
    //                img.src = data;
    //                img.onload = function () {
    //                    var m = this.width / this.height;
    //                    c.height = 600;//该值影响缩放后图片的大小
    //                    c.width = 600 * m;
    //                    ctx.drawImage(img, 0, 0, 600 * m, 600);
    //                    var pic = document.getElementById("myCanvas").toDataURL("image/jpeg");
    //                    pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");
    //                    customAjax(
    //                        "http://api.qianjiantech.com/v1/modifyAvatar",
    //                        {
    //                            state_code:sessionStorage.getItem("stateCode"),
    //                            user_id:uid,
    //                            avatar:data
    //                        },
    //                        function(result){
    //                            console.log(result);
    //                            switch (result.code){
    //                                case 2000:
    //                                    $("#uPic").html('<img src="'+data+'" class="img-response" />');
    //                                    break;
    //                                case 9000:
    //                                    reminderDeal("你已在其他设备登录!");
    //                                    closeBtn.html("即将进入登录页").unbind("click");
    //                                    setTimeout(function(){
    //                                        location.href="../loginRegisterHTML/login.html";
    //                                    },1500);
    //                                    sessionStorage.clear();
    //                                    break;
    //                            }
    //                        }
    //                    );
    //                    //$("#uPic").html('<img src="' + pic + '" class="img-response" />');
    //                };
    //            }
    //        }else{
    //            alert("图片尺寸请不要大于200KB");
    //            return false;
    //        }
    //
    //    }else{
    //        var reader = new FileReader();
    //        reader.readAsDataURL(file);
    //        reader.onload = function(e){
    //            var data=this.result;
    //            user_prove_pic=data;
    //            console.log(this);
    //            data=data.replace(/^data:image\/(png|jpg);base64,/,"");
    //            customAjax(
    //                "http://api.qianjiantech.com/v1/modifyAvatar",
    //                {
    //                    state_code:sessionStorage.getItem("stateCode"),
    //                    user_id:uid,
    //                    avatar:data
    //                },
    //                function(result){
    //                    console.log(result);
    //                    switch (result.code){
    //                        case 2000:
    //                            $("#uPic").html('<img src="'+data+'" class="img-response" />');
    //                            break;
    //                        case 9000:
    //                            reminderDeal("你已在其他设备登录!");
    //                            closeBtn.html("即将进入登录页").unbind("click");
    //                            setTimeout(function(){
    //                                location.href="../loginRegisterHTML/login.html";
    //                            },1500);
    //                            sessionStorage.clear();
    //                            break;
    //                    }
    //                }
    //            );
    //        }
    //    }
    //}
    //if ( typeof(FileReader) === 'undefined' ){
    //    alert("抱歉，您的浏览器不支持FileReader!");
    //}else{
    //    $("#headPortraitFile").change(readFile);
    //}


});