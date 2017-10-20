$(function(){
    var areaContainer=$("#areaContainer");
    var uid=sessionStorage.getItem("uid");
    var stateCode=sessionStorage.getItem("stateCode");
    var shippingAddressBox=$("#shippingAddress");
    //输入提交提示模态框元素
    var pop=$("#pop");
    var p=$("#pop p");
    var closeBtn=$(".pop-box>span").length?$(".pop-box>span"):$("#pop>div>div");

    //点击其他区域关闭弹框
    $.elseClosePop(pop);

    //设为默认地址
    var setDefaultAdd=function(ele){
        $.customAjax(
            "http://api.qianjiantech.com/v1/setDefault",
            {
                user_id:uid,
                address_id:$(ele).attr("data-addressid"),
                state_code:stateCode,
                is_default:1
            },
            function(result){
                switch (result.code){
                    case 9000:
                        $.loginOtherDevice(p,pop,closeBtn,"../../loginRegisterHTML/login.html");
                        break;
                }
            }
        )
    };

    shippingAddressBox.on("click",".defaultAddressBox",function(){
        $(".defaultAddressBox").each(function(k,v){
            $(v).removeClass("activeDefault");
        });
        $(this).addClass("activeDefault").parent().parent().parent().addClass("addressYesDefault");
        setDefaultAdd(this);
    });

    //判断地址是否有null
    function judgeAddressNull(addressName){
        return addressName!="null"?addressName:"";
    }

    //加载我的收货地址处理函数
    function loadShippingAddress(result){
        var code=result.code;
        if(code==2000){
            var info=result.info;
            var shippingAddress={};
            var html="";
            $(info).each(function(k,v){
                shippingAddress[v.address_id]=v;
                html+=`<li class="leftRightPadding3 borderBottom4 flexRowBox alignItemCenter addressItems ${v.id_default==1&&'addressYesDefault'}" data-addressId="${v.address_id}">
            <ul class="flex1">
                <li class="flexRowBox topPadding2">
                    <b class="marginRight1">${v.name}</b>
                    <b>${v.phone}</b>
                </li>
                <li class="em0_8 txtLeft topBottomPadding2">
                    ${judgeAddressNull(v.province)}${judgeAddressNull(v.city)}${judgeAddressNull(v.district)}${judgeAddressNull(v.address)}
                </li>
                <li class="borderTop1 flexRowBox justifyContentSpaceBetween alignItemCenter addressEditList">
                    <div class="defaultAddressBox activeDefault" data-addressId="${v.address_id}">
                        <i class="iconfont icon-checkedon"></i>
                        设为默认地址
                    </div>
                    <ul class="addressManipulate">
                        <li class="border1 addressEdit topBottomPadding2" data-addressId="${v.address_id}">&nbsp;编&nbsp;辑&nbsp;</li>
                        <li class="border1 addressDelete topBottomPadding2" data-addressId="${v.address_id}">&nbsp;删&nbsp;除&nbsp;</li>
                    </ul>
                </li>
            </ul>
            <i class="iconfont icon-yes addressYes"></i>
        </li>`;
            });
            sessionStorage.setItem("shippingAddress",JSON.stringify(shippingAddress));
            shippingAddressBox.html(html);
            //如果是从订单进入收获地址
            if(sessionStorage.getItem("isOrder")){
                $(".addressDelete").remove();
                //改变回退
                $(".shippingAddressHeader>a").attr("href","../../startHTML/12/writeOrder.html");
                //点击切换地址同时设为默认并跳转回结算
                shippingAddressBox.on("click",".addressItems",function(){
                    $(this).addClass("addressYesDefault").siblings(".addressYesDefault").removeClass("addressYesDefault");
                    setDefaultAdd(this);
                    $.jump("../../startHTML/12/writeOrder.html",100);
                })
            }else{
                $(".addressYes").remove();
            }
        }else if(code==2001){
            shippingAddressBox.html(`<li>你的收货地址为空</li>`);
        }else if(code==9000){
            $.loginOtherDevice(p,pop,closeBtn,"../../loginRegisterHTML/login.html");
        }
    }
    $.customAjax(
        "http://api.qianjiantech.com/v1/myAddress",
        {
            user_id:uid,
            state_code:stateCode
        },
        function(result){
            loadShippingAddress(result);
        }
    );

    //收货地址删除操作
    shippingAddressBox.on("click",".addressManipulate>li",function(){
        var _self=this;
        if($(_self).hasClass("addressDelete")){
            pop.addClass("pop-show");
            $(".settingWarn").on("click","span",function(){
                pop.removeClass("pop-show");
                if($(this).html()=="确定"){
                    $.customAjax(
                        "http://api.qianjiantech.com/v1/deleteAddress",
                        {
                            user_id:uid,
                            state_code:stateCode,
                            address_id:$(_self).attr("data-addressID")
                        },
                        function(result){
                            $(".settingWarn").unbind("click");
                            result.code==2000&&$(_self).parent().parent().parent().parent().remove();
                            shippingAddressBox.html()||shippingAddressBox.html(`<li>你的收货地址为空</li>`)&&$("#addressEditBtn").remove();
                        }
                    )
                }else{
                    $(".settingWarn").unbind("click");
                }
            });
        }else if($(_self).hasClass("addressEdit")){
            //当前为编辑
            sessionStorage.setItem("editAddress","editAddress");
            sessionStorage.setItem("addressId",$(_self).attr("data-addressID"));
            location.href="addEditAddress.html"
        }
    });

    //根据点击获取相应收货地址信息
    if(sessionStorage.getItem("editAddress")){
        var addressId=sessionStorage.getItem("addressId");
        var addressInfo=JSON.parse(sessionStorage.getItem("shippingAddress"))[addressId];
        $("[name='name']").val(addressInfo.name);
        $("[name='phone']").val(addressInfo.phone);
        $("[name='address']").val(addressInfo.address);
        $(".userSelectArea").attr("val",addressInfo.value);
        areaContainer.attr("data-province",addressInfo.province);
        areaContainer.attr("data-city",addressInfo.city);
        areaContainer.attr("data-county",addressInfo.district);
        if(addressInfo.district=="null"){
            $(".userSelectArea").text(addressInfo.province+","+addressInfo.city);
        }else{
            $(".userSelectArea").text(addressInfo.province+","+addressInfo.city+","+addressInfo.district);
        }
    }

    //当前为新增
    $(".addReceiveAddress").click(function(){
        sessionStorage.removeItem("editAddress")
    });


    //新增收货地址处理
    function judgeEmpty(selector){
        return $(selector).val()||$(selector).text()
    }
    function judgeShippingName(){
        return $("#shippingName").val().length>1
    }
    function judgeShippingPhone(){
        return $("#shippingPhone").val().length==11
    }
    function judgeDetailAddressEmpty(){
        return $("#detailAddress").val()!="详细地址"
    }
    function judgeDetailAddress(){
        return $("#detailAddress").val().length>4
    }

    function addEditSubmit(){
        if(uid){
            var a=judgeEmpty("#shippingName");
            var b=judgeEmpty("#shippingPhone");
            var c=judgeEmpty(".userSelectArea");
            var d=judgeDetailAddressEmpty();
            var f=judgeShippingName();
            var g=judgeShippingPhone();
            var h=judgeDetailAddress();
            if(c){
                var province=areaContainer.attr("data-province");
                var city=areaContainer.attr("data-city");
                var county=areaContainer.attr("data-county");
            }
            if(a&&b&&c&&d&&f&&g&&h){
                var url=sessionStorage.getItem("editAddress")?"http://api.qianjiantech.com/v1/editAddress":"http://api.qianjiantech.com/v1/addAddress";
                var data=sessionStorage.getItem("editAddress")?$("#shippingAddressForm").serialize()+"&user_id="+uid+"&state_code="+sessionStorage.getItem("stateCode")+"&province="+province+"&city="+city+"&district="+county+"&value="+$(".userSelectArea").attr("val")+"&address_id="+sessionStorage.getItem("addressId"):$("#shippingAddressForm").serialize()+"&user_id="+uid+"&state_code="+sessionStorage.getItem("stateCode")+"&province="+province+"&city="+city+"&district="+county+"&value="+$(".userSelectArea").attr("val");
                $.customAjax(
                    url,
                    data,
                    function(result){
                        switch (result.code){
                            case 2001:
                            case 2000:
                                location.href="shippingAddress.html";
                                sessionStorage.removeItem("editAddress");
                                break;
                            case 9000:
                                $.loginOtherDevice(p,pop,closeBtn,"../../loginRegisterHTML/login.html");
                                break;
                        }
                    }
                )
            }else{
                $("#inputWarnBox").addClass("show");
                setTimeout(function(){
                    $("#inputWarnBox").removeClass("show");
                },1500)
            }
            function addInputWarn(index,txt){
                $("[data-t='"+index+"']").text(txt)
            }
            function deleteInputWarn(index){
                $("[data-t='"+index+"']").text("");
            }

            if(!a){
                addInputWarn(1,"未填写收货人");
            }else if(!f){
                addInputWarn(1,"姓名最短为两个字");
            }else if(a&&f){
                deleteInputWarn(1)
            }

            if(!b){
                addInputWarn(2,"未填写手机号码")
            }else if(!g){
                addInputWarn(2,"手机号码为11位")
            }else if(b&&g){
                deleteInputWarn(2)
            }

            if(!c){
                addInputWarn(3,"未选择区域")
            }else{
                deleteInputWarn(3)
            }
            if(!d){
                addInputWarn(4,"未填写详细地址")
            }else if(!h){
                addInputWarn(4,"详细地址最短为5个字")
            }else if(d&&h){
                deleteInputWarn(4)
            }
        }
    }
    $("#shippingAddressBtn").click(function(e){
        e = e || window.event;
        e.preventDefault();
        addEditSubmit();
    });

    //编辑完成切换
    var toggle=true;
    $("#addressEditBtn").click(function(){
        toggle?$(".addressEditList").attr("style","height:100%;")&&$(this).text("完成")&&$(".addressYes").attr("style","display:none;"):$(".addressEditList").attr("style","")&&$(this).text("管理")&&$(".addressYes").attr("style","display:block;");
        toggle=!toggle;
    });
});