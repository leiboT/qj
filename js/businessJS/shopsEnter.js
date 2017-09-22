$(function(){
    //手机号正则
    var regPhone=/^1[3|5|7|8]\d{9}$/;
    //座机正则
    var regTelephone=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
    //身份证正则（15位）
    var regIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //身份证正则（18位）
    var regIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
    //选择行业模态框
    var selPop=$("#selPop");
    //请选择行业或行业名称盒子
    var industryBtn=$("#industryBtn");
    //行业选择列表
    var industry=$("#industry");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");

    //异步再封装
    function customAjax(url,data,fn){
        $.ajax({
            type:"post",
            url:url,
            data:data,
            dataType:"json",
            success:fn,
            error:function(error){
                //console.log(error)
            }
        })
    }

    //跳转
    function jump(url,t){
        setTimeout(function(){
            location.href=url
        },t)
    }

    //提示弹出框处理函数
    function  reminderDeal(txt){
        p.html(txt);
        pop.addClass("pop-show");
    }

    var input = $("div.inputBeautify input");
    var token,
        userId,
        cls,
        longitude,
        latitude,
        province,
        city,
        district,
        town,
        idCardPic,
        unIdCardPic,
        license,
        storeInfo;

    userId=sessionStorage.getItem("uid");
    token=sessionStorage.getItem("t");

    //根据用户定位获取经纬度及位置
    var addInfo=JSON.parse(sessionStorage.getItem("pcdt"));
    if(addInfo){
        $("[name='address']").val(addInfo.address);
        province=addInfo.province;
        city=addInfo.city;
        district=addInfo.district;
        town=addInfo.town;
        longitude=addInfo.lng;
        latitude=addInfo.lat;
    }
    sessionStorage.removeItem("pcdt");

    //判断是否可进入商家入驻及商家管理
    if(!userId){
        $(".storeIndex a").click(function(e){
            e=e||window.event;
            e.preventDefault();
            reminderDeal("请先登录!");
            closeBtn.text("进入登录页");
            closeBtn.on("click",function(){
                jump("loginRegisterHTML/login.html",0);
            });
        })
    }

    //保存商家入驻 用户输入
    var userInput= JSON.parse(sessionStorage.getItem("userInputInfo")) || [];
    $("li.borderBottom input").blur(function(){
        var val=$(this).val();
        var n=$(this).attr("name");
        //失去焦点获取值
        function judgeInputName(){
            for(var i = 0; i < userInput.length; i++){
                if(userInput[i].name==n){
                    //重复的直接删除
                    userInput.splice(i,i+1);
                }
            }
        }
        judgeInputName();
        userInput.push({"name":n,"val":val});
        sessionStorage.setItem("userInputInfo",JSON.stringify(userInput));
    });

    //键入商家入驻 用户输入
    if(sessionStorage.getItem("userInputInfo")){
        var userInputInfo=JSON.parse(sessionStorage.getItem("userInputInfo"));
        $(userInputInfo).each(function(k,v){
            $("[name="+v.name+"]").val(v.val);
        })
    }

    //验证商家输入
    //验证手机格式
    function judgeShopPhone(){
        var shopPhone=$("[name='shop_phone']").val();
        return regPhone.test(shopPhone)||regTelephone.test(shopPhone);
    }
    function judgeServerPhone(){
        var serverPhone=$("[name='server_phone']").val();
        return regPhone.test(serverPhone)||regTelephone.test(serverPhone);
    }
    function judgeRecommendPhone(){
        var recommendPhone=$("[name='recommend_phone']").val();
        return regPhone.test(recommendPhone);
    }
    //验证是否为空
    function judgeShopNameEmpty(){
        return $("[name='shop_name']").val();
    }
    function judgeAddressEmpty(){
        return $("[name='address']").val();
    }
    function judgeShopBossEmpty(){
        return $("[name='legal']").val();
    }
    function judgeIdCardPicEmpty(){
        return idCardPic
    }
    function judgeUnIdCardPicEmpty(){
        return unIdCardPic
    }
    function judgeLicenseEmpty(){
        return license
    }
    //验证身份证
    function judgeIDCard(){
        var IDCard=$("[name='id_number']").val();
        if(IDCard.length<=15){
            return regIDCard1.test(IDCard)
        }else if(IDCard.length==18){
            return regIDCard2.test(IDCard)
        }
    }
    //验证是否选择行业
    function judgeClass(){
        return industryBtn.html()!="请选择分类&gt;";
    }

    //图片判断及转码
    if ( typeof(FileReader) === 'undefined' ){
        alert("抱歉，您的浏览器不支持FileReader!");
        $(input).attr('disabled','disabled');
    }else{
        $(input).each(function(k,v){
            $(v).change(readFile);
        });
        //$(input).change(readFile);
    }
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
                    img.src = data;
                    img.onload = function () {
                        var m = this.width / this.height;
                        c.height = 600;//该值影响缩放后图片的大小
                        c.width = 600 * m;
                        ctx.drawImage(img, 0, 0, 600 * m, 600);
                        var pic = document.getElementById("myCanvas").toDataURL("image/jpeg");
                        pic = pic.replace(/^data:image\/(png|jpg);base64,/, "");
                        self.name=="idCardPic"?idCardPic=pic:self.name=="unIdCardPic"?unIdCardPic=pic:license=pic;
                        $(self).parent("div").prev("div").html('<img src="' + pic + '" alt=""/>');
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
                data=data.replace(/^data:image\/(png|jpg);base64,/,"");
                self.name=="idCardPic"?idCardPic=data:self.name=="unIdCardPic"?unIdCardPic=data:license=data;
                $(self).parent("div").prev("div").html('<img src="'+data+'" alt=""/>');
            }
        }
    }

    //异步提交处理函数
    function storeAjax(data){
        customAjax(
            "http://api.qianjiantech.com/v1/as",
            data,
            function(result){
                var code=result.code;
                if(code==2005){
                    $.ajax({
                        type:"post",
                        url:"http://api.qianjiantech.com/v1/getToken",
                        data:{
                            user_id:userId,
                            state_code:sessionStorage.getItem("stateCode")
                        },
                        success:function(key){
                            //var startHTML=key.indexOf('"');
                            //var end=key.indexOf('"',startHTML+1);
                            //    token=key.slice(startHTML,end);
                            token=key.info.token;
                            storeAjax(storeInfo+"&token="+token);
                        }
                    })
                }else if(code==2000){
                    reminderDeal("提交成功,请等待审核!");
                    jump("../business.html",1500);
                }else if(code==2001){
                    reminderDeal("推荐人等级不够!");
                }else if(code==2002){
                    reminderDeal("提交失败!");
                }else if(code==4000){
                    reminderDeal("信息不全,重新输入!");
                }else if(code==6000){
                    reminderDeal("推荐人不存在!");
                }else if(code==500){
                    reminderDeal("服务繁忙,请稍后重试!");
                }else if(code==9000){
                    reminderDeal("你已在其他设备登录");
                    closeBtn.text("即将进入登录页").unbind("click");
                    jump("../loginRegisterHTML/login.html",1500);
                    sessionStorage.clear();
                }
            }
        );
    }

    //提交审核
    $("#auditBtn").click(function(e){
        e= e || window.event;
        e.preventDefault();
        storeInfo="user_id="+userId+"&"+$("#businessForm").serialize()+"&class_id="+cls+"&"+"longitude="+longitude+"&"+"latitude="+latitude+"&"+"province="+province+"&"+"city="+city+"&"+"district="+district+"&town="+town+"&"+"id_card_pic="+idCardPic+"&"+"un_id_card_pic="+unIdCardPic+"&"+"license_pic="+license+"&state_code="+sessionStorage.getItem("stateCode");
        var storeAllInfo=storeInfo+"&token="+token;
        var a=judgeShopNameEmpty();
        var b=judgeClass();
        var c=judgeAddressEmpty();
        var d=judgeShopBossEmpty();
        var ee=judgeIDCard();
        var f=judgeShopPhone();
        var g=judgeServerPhone();
        var h=judgeRecommendPhone();
        var i=judgeIdCardPicEmpty();
        var j=judgeUnIdCardPicEmpty();
        var k=judgeLicenseEmpty();
        if(a&&b&&c&&d&&ee&&f&&g&&h&&i&&j&&k&&province){
            storeAjax(storeAllInfo);
        }else if(!userId){
            reminderDeal("请先登录!");
            closeBtn.text("进入登录页");
            closeBtn.on("click",function(){
                jump("../loginRegisterHTML/login.html",0);
            });
        }else if(!a){
            reminderDeal("商家名称不能为空!");
        }else if(!b){
            reminderDeal("请选择行业!");
        }else if(!c){
            reminderDeal("请获取您的位置!");
        }else if(!d){
            reminderDeal("商家法人不能为空!");
        }else if(!$("[name='id_number']").val()){
            reminderDeal("请输入身份证号!")
        }else if(!ee){
            reminderDeal("身份证号格式有误!");
        }else if(!$("[name='shop_phone']").val()){
            reminderDeal("请输入商家电话!")
        }else if(!f){
            reminderDeal("商家电话格式有误!");
        }else if(!$("[name='server_phone']").val()){
            reminderDeal("请输入服务电话!");
        }else if(!g){
            reminderDeal("服务电话格式有误!");
        }else if(!$("[name='recommend_phone']").val()){
            reminderDeal("请输入推荐人手机号!")
        }else if(!h){
            reminderDeal("推荐人手机格式有误!");
        }else if(!i){
            reminderDeal("请上传身份证正面图!");
        }else if(!j){
            reminderDeal("请上传身份证反面图!");
        }else if(!k) {
            reminderDeal("请上传营业执照图!");
        }else if(!province){
            reminderDeal("请获取您的位置!");
        }
    });

    //关闭模态弹出框
    closeBtn.on("click",function(){
        pop.removeClass("pop-show");
    });
    //点击其他区域关闭弹框
    $(pop).mouseup(function(e){
        var _con = $('.pop-box');
        if(_con != e.target && _con.has(e.target).length === 0){
            $(this).removeClass("pop-show");
        }
    });

    //行业分类弹出
    $(industryBtn).click(function(){
        selPop.addClass("pop-show");
        industry.addClass("pop-show");
    });
    //行业分类关闭
    $(selPop).click(function(){
        $(this).removeClass("pop-show");
        industry.removeClass("pop-show");
    });
    //行业选择处理事件
    $(".industrySelectBox").on("click","li",function(){
        $(this).addClass("activeColor").siblings("li").removeClass("activeColor");
        cls=$(this).attr("data-v");
        sessionStorage.setItem("industry",JSON.stringify({"industryId":cls,"industryTxt":$(this).html()}));
        industryBtn.html($(this).html());
        industryBtn.addClass("addPaddingRight");
        selPop.removeClass("pop-show");
        industry.removeClass("pop-show");
    });

    if(sessionStorage.getItem("industry")){
        industryBtn.html(JSON.parse(sessionStorage.getItem("industry")).industryTxt);
        cls=JSON.parse(sessionStorage.getItem("industry")).industryId;
        industryBtn.addClass("addPaddingRight");
    }


    //获取行业分类数据
    function getIndustryList(){
        customAjax(
            "http://api.qianjiantech.com/v1/chooseItem",
            null,
            function(data){
                if(data.code==2000){
                    var html="";
                    $(data.info).each(function(k,v){
                        html+=`
                        <li data-v="${v.id}">${v.class_name}</li>
                        `
                    });
                    $(".industrySelectBox").html(html)
                }
            }
        );
    }
    getIndustryList()
});