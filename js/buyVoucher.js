$(function(){
    var loadResult=false;
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$("#pop span");

    //点击其他区域关闭弹框
    $.elseClosePop(pop);
    //接受用户凭证
    var user_prove_pic;

    function readFile(){
        var file = this.files[0];
        var self=this;
        var type=file.type;

        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
        if(!/[jpeg|png|jpg]$/.test(type)){
            alert("请确保文件为图像类型");
            return false;
        }

        if(file.size>204800){
            if(document.createElement("canvas").getContext){
                var c=document.getElementById('myCanvas');
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
                        //self.name=="idCardPic"?idCardPic=pic:self.name=="unIdCardPic"?unIdCardPic=pic:license=pic;
                        $(".buyVoucherImg").html('<img src="' + pic + '" class="img-response" />');
                        loadResult=true;
                    };
                }
            }else{
                alert("图片尺寸请不要大于200KB");
                loadResult=false;
                return false;
            }

        }else{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                var data=this.result;
                user_prove_pic=data;
                data=data.replace(/^data:image\/(png|jpg);base64,/,"");
                //self.name=="idCardPic"?idCardPic=data:self.name=="unIdCardPic"?unIdCardPic=data:license=data;
                $(".buyVoucherImg").html('<img src="'+data+'" class="img-response" />');
                loadResult=true;
            }
        }
    }

    if ( typeof(FileReader) === 'undefined' ){
        alert("抱歉，您的浏览器不支持FileReader!");
        $("#buyVoucherInput").attr('disabled','disabled');
    }else{
        $("#buyVoucherInput").change(readFile);
    }


    var uid=sessionStorage.getItem("uid");
    var token=sessionStorage.getItem("t");
    var stateCode=sessionStorage.getItem("stateCode");
    var productId=sessionStorage.getItem("productId");
    var shopId=sessionStorage.getItem("shopId");

    //提交
    function submitBuyVoucher(){
        $.customAjax(
            "http://api.qianjiantech.com/v1/createProveOrder",
            {
                user_id:uid,
                state_code:stateCode,
                token:token,
                shop_id:shopId,
                product_id:productId,
                user_prove_pic:user_prove_pic
            },
            function(result){
                var code=result.code;
                if(code==2005){
                    $.customAjax(
                        "http://api.qianjiantech.com/v1/getToken",
                        {
                            user_id:uid,
                            state_code:stateCode
                        },
                        function(result){
                            token=result.info.token;
                            sessionStorage.setItem("t",token);
                            submitBuyVoucher();
                        }
                    );
                }else if(code==2000){
                    $.reminderDeal(p,pop,"提交成功,请等待审核!");
                    closeBtn.unbind("click").html("即将返回详情页");
                    setTimeout(function(){
                        location.href="payEnd.html"
                    },1500)
                }else if(code==2001){
                    $.reminderDeal(p,pop,"提交失败!")
                }else if(code==2002){
                    $.reminderDeal(p,pop,"系统正忙!")
                }else if(code==4000){
                    $.reminderDeal(p,pop,"信息不全!")
                }else if(code==9000){
                    $.loginOtherDevice(p,pop,closeBtn,"../loginRegisterHTML/login.html");
                }
            }
        );
    }

    $("#submitCheck").click(function(){
        if(loadResult){
            submitBuyVoucher();
        }else{
            $.reminderDeal(p,pop,"请上传购买凭证!");
        }
    });
    //关闭模态弹出框
    closeBtn.on("click",function(){
        pop.removeClass("pop-show");
    });


});
