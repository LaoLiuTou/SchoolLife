
var bodyParam={};
$(document).ready(function () {

    $('#goback').click(function () {
        window.location.href='#?backToApp=1';
    });

    getTeacherAndStudentInfo({'xs_id':getUrlParam('xs_id'),'sc_id':getUrlParam('sc_id'),'sn_t':getUrlParam('sn_t')});

});

/**
 * 辅导员信息
 */
function getTeacherAndStudentInfo(bodyParam) {
    var hrt = new HttpRequestTool(url + 'queryStudentInfo', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var result = obj['Result'];
        console.log(result.NM_T);

        for (var item in result) {
            $('#'+item).val(result[item]);
        }
        if(result.teacher_img!=null){
            $('#teacher_header').prop('src',result.teacher_img);
        }
        if(result.xs_status=='已同意'){
            $('#state_yes').show();
            $('#state_no').hide();
        }
        else{
            $('#state_yes').hide();
            $('#state_no').show();
        }

    });
}


