//后台服务地址
var url = 'http://dev.jiubaisoft.com/jida_life/public/api.php/Api/';

//secret key
var sk = 'TTILY';
var user_id,user_name;
$(document).ready(function(){

    user_id=localStorage.getItem('user_id');
    user_name=localStorage.getItem('user_name');
    if(user_id!=null){

    }
});

/**
 * 登录
 */
function login(username,password) {
    $.ajax({
        url : url+'login',
        type : 'POST',
        data : {
            'username' :username,
            'password' :password
        },
        success : function(response) {
            if(response['status']=='0'){
                var token = response['token'];
                var userinfo = JSON.stringify(response['msg']);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('userpwd',password);
                sessionStorage.setItem('userinfo',userinfo);
            }
            else{
                alert(response['msg']);
            }
        },
        error : function(response) {
            alert('登录失败！');
        }
    });
}

/* 网络请求
 *@method 方法名
 *@param{string}url 地址
 *@param{string}type post/get
 *@param{string}dataType text/json
 *@param{bool}async 同步异步true/false
 *@param{bool}cache 缓存true/false
 *@param{string}bodyParam 参数json
*/
function HttpRequestTool(url,type,dataType,asyncType,cacheType,bodyParam){
    this.url = url;
    this.type = type;
    this.dataType = dataType;
    this.asyncType = asyncType;
    this.cacheType = cacheType;
    this.bodyParam = bodyParam;
}
HttpRequestTool.prototype.HttpRequest = function(callBack){
    $.ajax({
        url:this.url,
        type:this.type,
        cache:this.cacheType,
        timeout:30000,
        dataType:this.dataType,
        data :this.bodyParam,
        async:this.asyncType,
        headers: {
            //'content-Type': 'application/json'
            //'source' : 'APP'
        },
        success:function(response) {
            var obj = JSON.parse(response);
            var code = obj['Code'];
            var point = obj['Point'];
            if(code=='1'){
                callBack(response);
            }
            else{
                $.toast(point, "cancel");
            }
        },
        error:function(response){

            $.toast("请求失败！", "cancel");
            return false;
        },
        beforeSend:function(){
            //$.showLoading('加载中...');
        },
        complete:function(){
            //$.hideLoading();
        }
    });

}

function HttpRequestRefreshTool(url,type,dataType,asyncType,cacheType,bodyParam){
    this.url = url;
    this.type = type;
    this.dataType = dataType;
    this.asyncType = asyncType;
    this.cacheType = cacheType;
    this.bodyParam = bodyParam;
}
HttpRequestRefreshTool.prototype.HttpRequest = function(callBack){
    $.ajax({
        url:this.url,
        type:this.type,
        cache:this.cacheType,
        timeout:30000,
        dataType:this.dataType,
        data :this.bodyParam,
        async:this.asyncType,
        headers: {
            //'content-Type': 'application/json'
            //'source' : 'APP'
        },
        success:function(response) {
            var obj = JSON.parse(response);
            var code = obj['Code'];
            var point = obj['Point'];
            //加载更多和刷新
            loading = false;
            $(".weui-loadmore").hide();
            $('.weui-tab__bd-item').pullToRefreshDone();
            loading = false;
            //加载更多和刷新
            if(code=='1'){
                callBack(response);
            }
            else{
                $.toast(point, "cancel");
            }
        },
        error:function(response){
            //加载更多和刷新
            loading = false;
            $(".weui-loadmore").hide();
            $('.weui-tab__bd-item').pullToRefreshDone();
            loading = false;
            //加载更多和刷新
            $.toast("请求失败！", "cancel");
            return false;
        },
        beforeSend:function(){
            //$.showLoading('加载中...');
        },
        complete:function(){
            //$.hideLoading();
        }
    });

}
//获取地址栏参数//可以是英文参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//获取地址栏参数//可以是中文参数
function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function getLevelbyName(name)
{
    var levelArray=['白丁','童生','秀才','举人','贡士','探花','榜眼','状元'];
    var index=levelArray.indexOf(name);
    return index+1;
}
/**************************************时间格式化处理************************************/
function dateFtt(fmt,date) {
    var o = {
        "M+" : date.getMonth()+1,     //月份
        "d+" : date.getDate(),     //日
        "h+" : date.getHours(),     //小时
        "m+" : date.getMinutes(),     //分
        "s+" : date.getSeconds(),     //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S" : date.getMilliseconds()    //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
/**************************************时间转换   XX前***********************************/
function getDateDiff(dateStr) {
    var publishTime = getDateTimeStamp(dateStr) / 1000;
    var mistiming = Math.round(new Date() / 1000)-publishTime;
    var postfix = mistiming>0 ? '前' : '后'
    mistiming = Math.abs(mistiming)
    var arrr = ['年','个月','星期','天','小时','分钟','秒'];
    var arrn = [31536000,2592000,604800,86400,3600,60,1];

    for(var i=0; i<7; i++){
        var inm = Math.floor(mistiming/arrn[i])
        if(inm!=0){
            return inm+arrr[i] + postfix
        }
    }
}

function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
}　
