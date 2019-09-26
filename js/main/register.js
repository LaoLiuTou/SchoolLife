var randomCode='';
var bodyParam={};
var image='';
var schoolTree=[];
var firstValue;
var xueyuanKeyArr=[];
var xueyuanValueArr=[];
var zhuanyeKeyArr=[];
var zhuanyeValueArr=[];
var randomCode='';
$(document).ready(function () {

    $('#goback').click(function () {
        window.location.href='#?backToApp=1';
    });

    //入学日期初始化
    var currentDate= new Date();
    // $("#rd_d").prop('placeholder',(currentDate.getFullYear()-4)+'-07-01');
    /*异步加载学校数据*/
    //listSchool();
    // 地区
    $("#city-picker").cityPicker({
        title: "请选择学校",

        onOpen: function(d){
            //console.log(this, d);
        },
        onChange: function(d){
            //console.log(this, d);
        },
        onClose: function(d){
            //console.log( d.value);
            $("#sc_id").val(d.value[2]);
            $("#xueyuan").val("");
            $("#ac_id").val("");
            var bodyParam = {'SC_ID': d.value[2]};
            listAc(bodyParam) ;
        }
    });

    // 性别
    $("#se_lv").picker({
        title: "请选择性别",
        cols: [{
            textAlign: 'center',
            values: ['男', '女']
        }]
    });
    $("#nj_d").picker({
        title: "请选择年级",
        cols: [{
            textAlign: 'center',
            values: ['大一', '大二', '大三', '大四', '研一', '研二', '研三']
        }]
    });

    // 入学日期

    $("#rd_d").datetimePicker({
        title: '请选择入学日期',
        value:(currentDate.getFullYear()-4)+'-07-01',
        times: function () {},
        onChange: function (picker, values, displayValues) {
            console.log(values);
        }
    });

    setTimeout( function(){
        $.modal({
            title: "提示",
            text: "目前在校园app只对在校师生开放注册，独立注册的在校学生需要提供学生证照片（印有学校名称 院系的页面）并填写基本信息。请务必保证提交信息的准确性，管理员将在3天内对提交的信息进行审核，对审核通过的用户以短信方式通知。",
            buttons: [
                { text: "确定", onClick: function(){ /*$.toast("成功！"); */} },
                { text: "取消", className: "default"},
            ]
        });
    }, 5 * 100 );




    $('#idphoto').click(function(){
        $('#std_id_img').click();

    });
    //上传图片
    $("#std_id_img").bind('change', function (e) {


        var src, url = window.URL || window.webkitURL || window.mozURL,
            files = e.target.files;
        for(var i = 0, len = files.length; i < len; ++i) {
            var file = files[i];

            if(url) {
                src = url.createObjectURL(file);
            } else {
                src = e.target.result;
            }

        }
        $('#idphoto').prop('src',src);



    });

    //验证码
    $('#codeBtn').click(function(){
        if(!isPoneAvailable($('#ph_p').val())){
            $.toast("手机号不正确！", "text");
            return;
        }
        else{
            var bodyParam = {'PH_P':$('#ph_p').val()};
            sendIdCode(bodyParam);
            var time = 59;
            $("#codeBtn").attr('disabled',true);
            $("#codeBtn").css('color','#888888');
            $("#codeBtn").text("("+time+"秒" +")重发");
            var timer = setInterval(function(){
                time--;
                $("#codeBtn").text("("+time+"秒" +")重发");
                if(time==0){
                    clearInterval(timer);
                    $("#codeBtn").text("获取验证码");
                    $("#codeBtn").css('color','#27D3D2');
                    $("#codeBtn").attr('disabled',false);
                }
            },1000);

        }

    });
    $('#submitBtn').click(function(){


        if($('#nm_t').val()==''){
            $.toast("请输入学号真实姓名！", "text");
            return;
        }
        if($('#nickname').val()==''){
            $.toast("请输入学号昵称！", "text");
            return;
        }
        if(!isPoneAvailable($('#ph_p').val())){
            $.toast("手机号不正确！", "text");
            return;
        }
        if($('#code').val()==''){
            $.toast("验证码不正确！", "text");
            return;
        }
        if($('#code').val()!=randomCode){
            $.toast("验证码不正确！", "text");
            return;
        }
        /* if($('#ac_id').val()==''){
             $.toast("请选择学院！", "text");
             return;
         }
         if($('#ma_id').val()==''){
             $.toast("请选择专业！", "text");
             return;
         }*/
        if($('#sn_t').val()==''){
            $.toast("请输入学号！", "text");
            return;
        }
        if($('#nj_d').val()==''){
            $.toast("请选择年级！", "text");
            return;
        }



        var file = $("#std_id_img").val();
        if(file.length>0){
            var formData = new FormData();
            var fileArr=$('#std_id_img').prop('files');
            for(var o in fileArr){
                formData.append("image", fileArr[o]);
            }

            $.showLoading("正在提交……");


            $.ajax({
                type: "post",
                url: url +"uploadImg",
                //url: 'http://192.168.1.144/FileUS/filesUpload',
                data: formData,
                contentType: false, // 注意这里应设为false
                processData: false,    //false
                cache: false,    //缓存
                success: function(response){
                    var obj = JSON.parse(response);
                    console.log(response);
                    var code = obj['Code'];
                    if(code=='1'){
                        var result = obj['Result'];
                        image=result;


                        $('#addForm input[t="data"]').each(function () {
                            if($(this).val()!='')
                                bodyParam[$(this).attr('id').toUpperCase()]=$(this).val();
                        });

                        bodyParam['STD_ID_IMG']=image;

                        console.log(bodyParam);
                        register(bodyParam);
                        $.hideLoading();
                    }
                    else{
                        $.hideLoading();
                        $.toast("上传文件失败！", "text");

                    }

                }
            })
        }
        else {
            $.toast("请上传学生证图片！", "text");
            return;
        }


    });






});


//限制数字
function astrict() {
    var tarea = document.getElementById("weui-textarea");
    var maxlength = 200;
    var length = tarea.value.length;
    var count = maxlength - length;

    var sp = document.getElementById("astrict-sl");
    sp.innerHTML = count;
    if(count <= 25) {
        sp.style.color = "red";
    } else {
        sp.removeAttribute("style");
    }
}


/**
 * 学校
 */
function listSchool(bodyParam) {
    var hrt = new HttpRequestTool(url + 'getScs', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        schoolTree = obj['Result'];
        if(schoolTree.length>0){
            var first=schoolTree[0].name;
            var second=schoolTree[0].sub[0].name;
            var third=schoolTree[0].sub[0].sub[0].name;
            firstValue=first+" "+second+" "+third;
        }

    });
}
/**
 * 院系
 */
function listAc(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxAC', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        $("#zhuanye").val("");
        $('#ma_id').val("");
        xueyuanKeyArr=Object.keys(result);
        xueyuanValueArr=Object.values(result);
        $xueyuan= $("#xueyuan");
        $parent=$("#xueyuan").parent();
        $xueyuan.remove();
        $parent.append($xueyuan);
        $("#xueyuan").picker({
            title: "请选择学院",
            cols: [{
                textAlign: 'center',
                values: xueyuanValueArr
            }]
            ,
            onOpen: function(d){
                //console.log(xueyuanValueArr);
            },
            onChange: function(d){
                //console.log(this, d);
            },
            onClose: function(d){
                var xueyuanKey=xueyuanKeyArr[xueyuanValueArr.indexOf($("#xueyuan").val())];
                $('#ac_id').val(xueyuanKey);
                var bodyParam = {'AC_ID': xueyuanKey};
                listMA(bodyParam);
            }

        });



    });
}
/**
 * 专业
 */
function listMA(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxMA', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        zhuanyeKeyArr=Object.keys(result);
        zhuanyeValueArr=Object.values(result);
        $xueyuan= $("#zhuanye");
        $parent=$("#zhuanye").parent();
        $xueyuan.remove();
        $parent.append($xueyuan);
        $("#zhuanye").picker({
            title: "请选择专业",
            cols: [{
                textAlign: 'center',
                values: zhuanyeValueArr
            }]
            ,
            onOpen: function(d){
                //console.log(this, d);
            },
            onChange: function(d){
                //console.log(this, d);

            },
            onClose: function(d){
                var zhuanyeKey=zhuanyeKeyArr[zhuanyeValueArr.indexOf($("#zhuanye").val())];
                $('#ma_id').val(zhuanyeKey);
            }

        });
    });
}
/**
 * 发送验证码
 */
function sendIdCode(bodyParam) {
    var hrt = new HttpRequestTool(url + 'checkCode', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        console.log(result);
        randomCode=result;
    });
}
/**
 * 注册
 */
function register(bodyParam) {
    var hrt = new HttpRequestTool(url + 'regLife', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        if(result.length>0){
            $.modal({
                title: "注册成功！",
                text: "管理员将在3天内对提交的信息进行审核，对审核通过的用户以短信方式通知。",
                buttons: [
                    { text: "确定", className: "default" },
                    { text: "取消", className: "default"},
                ]
            });
        }

    });
}

function isPoneAvailable(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
