$(function(){
    //用户ID
    var uid=sessionStorage.getItem("uid");
    //用户状态码
    var stateCode=sessionStorage.getItem("stateCode");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");
    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }
    //用户信息
    var userInfo=JSON.parse(sessionStorage.getItem("userInfo"));
    //加载用户信息
    if(userInfo){
        $("#uPic img").attr("src",userInfo.uPic);
        $("#nikeName").html(userInfo.uName);
        $("#uPhone").html(userInfo.uPhone);
    }
    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }
    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });
    //异步再封装
    function customAjax(url,data,fn){
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                console.log(error)
            }
        })
    }
    //用户设置页处理函数
    function userSetting(){
        $("#logOutBtn").click(function(){
            pop.addClass("pop-show");
            $(".settingWarn").on("click","span",function(e){
                e= e||window.event;
                switch($(e.target).html()){
                    case "取消":
                        pop.removeClass("pop-show");
                        $(".settingWarn").unbind("click");
                        break;
                    case "确定":
                        sessionStorage.clear();
                        jump("../loginRegisterHTML/login.html",200);
                        break;
                }
            });
        });
    }
    if(uid)
        userSetting();

    //头像设置
    function readFile(){
        var file = this.files[0];
        var self=this;
        console.log(self);
        var type=file.type;

        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
        if(!/[jpeg|png|jpg]$/.test(type)){
            alert("请确保文件为图像类型");
            return false;
        }

        function avatarAjax(url,uid,stateCode,data){
            customAjax(
                url,
                {
                    state_code:stateCode,
                    user_id:uid,
                    avatar:data
                },
                function(result){
                    console.log(result);
                    switch (result.code){
                        case 2000:
                            $("#uPic").html('<img src="'+data+'" class="img-response" />');
                            userInfo.uPic=data;
                            sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
                            break;
                        case 9000:
                            reminderDeal("你已在其他设备登录!");
                            closeBtn.html("即将进入登录页").unbind("click");
                            jump("../loginRegisterHTML/login.html",1500);
                            sessionStorage.clear();
                            break;
                    }
                }
            );
        }

        if(file.size>204800){
            if(document.createElement("canvas").getContext){
                var c=document.getElementById('myCanvas');
                console.log(c);
                var ctx=c.getContext('2d');
                var img=new Image();
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    var data = this.result;
                    user_prove_pic=data;
                    img.src = data;
                    img.onload = function () {
                        var m = this.width / this.height;
                        c.height = 600;//该值影响缩放后图片的大小
                        c.width = 600 * m;
                        ctx.drawImage(img, 0, 0, 600 * m, 600);
                        var pic = document.getElementById("myCanvas").toDataURL("image/jpeg");
                        pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");
                        avatarAjax(
                            "http://api.qianjiantech.com/v1/modifyAvatar",
                            uid,
                            stateCode,
                            data
                        );
                    };
                }
            }else{
                alert("图片尺寸请不要大于200KB");
                return false;
            }

        }else{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                var data=this.result;
                user_prove_pic=data;
                console.log(this);
                data=data.replace(/^data:image\/(png|jpg);base64,/,"");
                avatarAjax(
                    "http://api.qianjiantech.com/v1/modifyAvatar",
                    uid,
                    stateCode,
                    data
                );
            }
        }
    }
    if ( typeof(FileReader) === 'undefined' ){
        alert("抱歉，您的浏览器不支持FileReader!");
    }else{
        $("#headPortraitFile").change(readFile);
    }
});