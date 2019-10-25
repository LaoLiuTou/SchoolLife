var randomCode='';
var bodyParam={};
var image='';
var zhuanyeKeyArr=[];
var zhuanyeValueArr=[];
var randomCode='';
$(document).ready(function () {

    $('#goback').click(function () {
        window.location.href='#?backToApp=1';
    });

    getTeacherInfo({'fdId':getUrlParam('teacher_id')});


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

        bodyParam={};

        if($('#nm_t').val()==''){
            $.toast("请输入姓名！", "text");
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

        if($('#sn_t').val()==''){
            $.toast("请输入学号！", "text");
            return;
        }
        if($('#cl_id').val()==''){
            $.toast("请选择班级！", "text");
            return;
        }

        //就乱起名
        /*$('#addForm input[t="data"]').each(function () {
            if($(this).val()!='')
                bodyParam[$(this).attr('id').toUpperCase()]=$(this).val();
        });

        $('#addForm select[t="data"]').each(function () {
            if($(this).val()!='')
                bodyParam[$(this).attr('id').toUpperCase()]=$(this).val();
        });*/
        bodyParam['fdId']=getUrlParam('teacher_id');
        bodyParam['name']=$('#nm_t').val();
        bodyParam['sex']=$('#se_lv').val();
        bodyParam['sn']=$('#sn_t').val();
        bodyParam['maId']=$('#ma_id').val();
        bodyParam['clId']=$('#cl_id').val();
        bodyParam['phone']=$('#ph_p').val();
        bodyParam['code']=$('#code').val();
        //console.log(JSON.stringify(bodyParam));
        scanToRegister(bodyParam);


    });


});

/**
 * 辅导员信息
 */
function getTeacherInfo(bodyParam) {
    var hrt = new HttpRequestTool(url + 'getTeacher', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        if(result.I_UPIMG!=null){
            $('#teacher_header').prop('src',result.I_UPIMG);
        }
        $('#teacher_name').text(result.NM_T);
        $('#teacher_school').text(result.SC_NM+'-'+result.AC_NM);
        $('#teacher_phone').text(result.PH_P);

        var ma_array=result.mas;
        var ma_html='';
        for (i = 0, len = ma_array.length; i < len; i++) {
            ma_html+='<option value="'+ma_array[i].id+'">'+ma_array[i].NM_T+'</option>';
        }
        $('#ma_id').html(ma_html);

        var class_array=result.cls;
        var class_html='';
        for (i = 0, len = class_array.length; i < len; i++) {
            class_html+='<option value="'+class_array[i].id+'">'+class_array[i].NM_T+'</option>';
        }
        $('#cl_id').html(class_html);


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
    //randomCode="1234";
}
/**
 * 注册
 */
function scanToRegister(bodyParam) {
    $.ajax({
        url : url+'qrCodeReg',
        type : 'GET',
        //加上这句话
        xhrFields: {
            withCredentials: true
        },
        data : bodyParam,
        success : function(response) {
            if(response['Code']=='1'){
                $.modal({
                    title: "注册成功！",
                    text: response['Point'],
                    buttons: [
                        { text: "确定", className: "default" },
                        { text: "取消", className: "default"},
                    ]
                });
            }
            else{
                $.modal({
                    title: "注册失败！",
                    text: response['Point'],
                    buttons: [
                        { text: "确定", className: "default" },
                        { text: "取消", className: "default"},
                    ]
                });
            }
        },
        error : function(response) {
            $.modal({
                title: "注册失败！",
                text: "系统异常，请联系管理员!",
                buttons: [
                    { text: "确定", className: "default" },
                    { text: "取消", className: "default"},
                ]
            });
        }
    });
}

/*
function scanToRegister(bodyParam) {
    var hrt = new HttpRequestTool(url + 'qrCodeReg', 'post', 'text', true, false, bodyParam, 'callBack');
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
*/

function isPoneAvailable(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
