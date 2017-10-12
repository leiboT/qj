$(function(){
    var hotCityList=$(".hotCityList");
    var str="abcdefghijklmnopqrstuvwxyz";
    for(var i=0,html=""; i<str.length; i++){
        html+=`
            <li id="${str[i]}">
                <div class="pageTitle">${str[i].toUpperCase()}</div>
                <ul class="sortCityList">

                </ul>
             </li>
        `;
    }
    $(hotCityList).html(html);

    //根据分类ID使返回不同页面
    var getBack=$("#cutCity");
    switch (Number(sessionStorage.getItem("allClassId"))){
        case 1:
            getBack.attr("href","../startHTML/houseHTML/houseIndex.html");
            break;
        case 2:
            $(getBack).attr("href","../startHTML/carHTML/carIndex.html");
            break;
        case 3:
            $(getBack).attr("href","../startHTML/caterHTML/caterIndex.html");
            break;
        case 4:
            $(getBack).attr("href","../startHTML/hotelHTML/hotelIndex.html");
            break;
        case 5:
            $(getBack).attr("href","../startHTML/travelHTML/travelIndex.html");
            break;
        case 6:
            $(getBack).attr("href","../startHTML/educateHTML/educateIndex.html");
            break;
        case 7:
            $(getBack).attr("href","../startHTML/healthHTML/healthIndex.html");
            break;
        case 8:
            $(getBack).attr("href","../startHTML/boutiqueHTML/boutiqueIndex.html");

            break;
    }

    $.customAjax(
        "../static/data/cityList.json",
        {},
        function(result){
            var html="";
            $(result).each(function(k,v){
                var py=v.pinyin;
                var initial=py.slice(0,1);
                var city=v.name;
                switch(initial){
                    case "A":
                        $('#a .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "B":
                        $('#b .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "C":
                        $('#c .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "D":
                        $('#d .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "E":
                        $('#e .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "F":
                        $('#f .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "G":
                        $('#g .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "H":
                        $('#h .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "I":
                        $('#i .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "J":
                        $('#j .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "K":
                        $('#k .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "L":
                        $('#l .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "M":
                        $('#m .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "N":
                        $('#n .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "O":
                        $('#o .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "P":
                        $('#p .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "Q":
                        $('#q .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "R":
                        $('#r .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "S":
                        $('#s .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "T":
                        $('#t .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "U":
                        $('#u .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "V":
                        $('#v .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "W":
                        $('#w .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "X":
                        $('#x .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "Y":
                        $('#y .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    case "Z":
                        $('#z .sortCityList').append("<li>"+city+"市</li>");
                        break;
                    default:
                        break;
                }

            });
        }
    );

    function showCityInfo() {
        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    var citybounds = result.bounds;
                    $(".currentCity").html(cityinfo);
                }
            }
        });
    }
    showCityInfo();

    //点击热门城市切换
        //切换城市处理函数
        function cutCity(self){
            $("div.pageContent span").html($(self).html());
            sessionStorage.setItem("userDistrict",$(self).html());
        }

    $("ul.sortCityList").on("click","li",function(){
       cutCity(this);
    });

    //最近访问城市切换
    $(".recentCityList").on("click","li",function(){
        cutCity(this);
    });

    ////字母索引显示或隐藏
    //$(window).scroll(function (){
    //    console.log($(document).scrollTop());
    //    console.log($(".hotCityTitle").offset().top);
    //    $(document).scrollTop()<$(".hotCityTitle").offset().top?$("ul.letterList").attr("class","letterList die"):$("ul.letterList").attr("class","letterList show");
    //})

    //定位当前城市
    function getCurrentCity(){
        $(".currentCity").html("定位中...");
        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                noIpLocate:3,
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition:'RB'
                //GeoLocationFirst:true,
                //useNative:true
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
            var address = data.formattedAddress; //返回地址描述
            var city=data.addressComponent.city;
            $(".currentCity").html(city);
            sessionStorage.setItem("position",city);
        }
        //解析定位错误信息
        function onError(data) {
            $(".currentCity").html("定位失败");
        }
    }

    $(".currentCity").click(function(){
        getCurrentCity();
    })
});