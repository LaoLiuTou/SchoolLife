var page=1;
var loading = false;
$(document).ready(function () {



    $('#refreshDiv').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');


        setTimeout(function() {
            page=1;
            /*var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id'),'PAGE':page};
            listComment(bodyParam,'refresh');*/
            var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id')};
            detailTalk(bodyParam,'refresh');
        }, 1000);

    });
    $('#refreshDiv').infinite().on("infinite", function() {
        var self = this;
        if(loading) return;
        $(self).find(".weui-loadmore").show();
        loading = true;
        setTimeout(function() {
            page++;
            /*var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id'),'PAGE':page};
            listComment(bodyParam,'load');*/
            var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id')};
            detailTalk(bodyParam,'load');

        }, 1000);

    });


    var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id')};
    detailTalk(bodyParam,'refresh');

    listReport();

    $("body").on('click','.pltiaoz',function(){
        window.location.href='comment_details.html?id='+GetQueryString('id')+'&pid='+$(this).attr('itemId');
    });
    $("body").on('click','.bbqshur',function(){
        window.location.href='comment_tc.html?id='+GetQueryString('id')+'&type=talk';
    });
    $("body").on('click','.addSubComment',function(){
        window.location.href='comment_tc.html?id='+GetQueryString('id')+'&pid='+$(this).attr('itemId')+'&type=comment';
    });


    $('.bbqreturn').click(function(){
        console.log(GetQueryString('step'));
        if(GetQueryString('step')=='3'){
            window.history.go(-3);
        }
        else{
            window.history.go(-1);
        }
        //

    });


    //收藏弹出

    $('body').on('click','.bbqgengdtc',function(e){
        $(".bbqgengdtanc").show();
        $(".bbqqxbtn").click(function(){
            $('.bbqgengdtanc').hide();
        });
        talkId=$(this).attr('itemId');
        e.stopPropagation();
    });

    $(".bbqscbtn").click(function() {
        $('.bbqshoucangtanc').show();
        $('.bbqgengdtanc').hide();
        setTimeout(function() { //定时器
                $(".bbqshoucangtanc").css("display", "none");

            },
            1000);
        var bodyParam = {'USER_ID': user_id,'TALK_ID':talkId,'SAVECEN':'1'};
        saveTalk(bodyParam);

    });




    //举报弹出
    $(".bbqjbbtn").click(function() {

        $('.bbqjubtanc').show();
        $('.bbqgengdtanc').hide();

    });
    $('body').on('click','#cancelJbBtn',function () {
        $('.bbqjubtanc').hide();
    });
    $('body').on('click','.jubaotit',function () {
        $('.jubaotit').removeClass('bbqtcxz');
        $(this).addClass('bbqtcxz');
        if($(this).text()=='其他'){
            $('#jbText').show();
        }
        else{
            $('#jbText').hide();
        }
    });
    $('body').on('click','#addJbBtn',function () {
        if($('#jubaoDiv .bbqtcxz').length==0){
            $.toast("请选择举报原因！", "text");
            return false;
        }

        var bodyParam = {'USER_ID': user_id,'TALK_ID':talkId,'REPORT_REASON_ID':$('.bbqtcxz').attr('itemId')};
        if($('.bbqtcxz').text()=='其他'){
            if($('#jbText').val()==''){
                $.toast("请输入举报原因！", "text");
                return false;
            }
            bodyParam['REPORT_REASON_OTHER']=$('#jbText').val();
        }
        addReport(bodyParam);
        $('.bbqjubtanc').hide();
    });



    //头像点击
    $('body').on('click','.bbqlistimg',function(e){
        if($(this).attr("itemId")!='0'){
            window.location.href='user_details.html?id='+$(this).attr("itemId");
        }
        e.stopPropagation();

    });
    $('body').on('click','.pllistimg',function(e){
        if($(this).attr("itemId")!='0'){
            window.location.href='user_details.html?id='+$(this).attr("itemId");
        }
        e.stopPropagation();

    });
});
/**
 * 话题
 */
function detailTalk(bodyParam,refreshorload) {
    var hrt = new HttpRequestTool(url + 'cxTalkIndex', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        console.log(response);
        var data = obj['Result'];
        if(data!=null){
            var html='';
            for(var j = 0,len=data.length; j < len; j++) {

                var userid='0';
                if(data[j].IS_HIDE=='否'){
                    userid= data[j].TALK_USER_ID;
                }

                if (data[j].I_UPIMG == null) {
                    if (data[j].IS_HIDE == '是'){
                        html += '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                            '<img src="' + data[j].I_UPIMG + '">\n' +
                            '</div>\n';
                    }
                    else{
                        html += '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                            '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                            '</div>\n';
                    }
                }
                else {
                    html += '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                        '<img src="' + data[j].I_UPIMG + '">\n' +
                        '</div>\n';
                }
                if (data[j].RZ_STATUS != null && data[j].RZ_STATUS == '已认证' && data[j].IS_HIDE == '否') {
                    html += '<img class="renzicon" src="images/renzheng-left-icon.png">\n' +
                        '<img class="renzicons" src="images/renzheng-right-icon.png">\n';
                }


                if (data[j].SE_LV != null && data[j].SE_LV == '男') {
                    html += '<div class="bbqlistword" >\n' +
                        '<p class="bbqname">' + data[j].NICKNAME + '<img class="bbqxb" src="images/nan-icon.png"></p>\n';
                }
                else {
                    html += '<div class="bbqlistword" >\n' +
                        '<p class="bbqname">' + data[j].NICKNAME + '<img class="bbqxb" src="images/nv-icon.png"></p>\n';
                }

                if (data[j].OPEN_DT != null) {
                    html += '<p class="bbqtime">' + getDateDiff(data[j].OPEN_DT) + '</p>\n';
                }
                html += '<p class="bbqneirdetail">' + data[j].TALK_CONTENT + '</p>\n';
                html += '<div class="baguetteBoxOne  bbqlistimgs" >\n';
                var contentImage = data[j].TALK_IMG;
                if (contentImage != null) {
                    var contentImages = contentImage.split("|");
                    if (contentImages.length > 0) {
                        for (i = 0, imagelen = contentImages.length; i < imagelen; i++) {
                            /*html += '<a class="listimgs" style="background-image: url(' + contentImages[i] + ');" href="' + contentImages[i] + '" >\n' +
                                '</a>\n';*/
                            html+='<a class="listimgs" itemId="'+data[j].ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;

                        }
                    }
                }
                html += '</div>\n';

                var labels=data[j].LABEL_NAME;
                if(labels!=null){
                    var labelArr=labels.split(",");
                    if(labelArr.length>0){
                        for(i = 0,labellen=labelArr.length; i< labellen;i++) {
                            html+='<p class="bbqindexbiaoq" >#'+labelArr[i]+'</p>\n' ;
                        }

                    }
                }

                html += '<div class="bbqbuttonthree posire">\n';
                if(data[j].GOOD!=null&&data[j].GOOD=='已赞'){
                    html+='<div class="heart hearttalk heartAnimation" itemId="'+data[j].ID+'" rel="unlike" style=""></div>';
                }
                else{
                    html+='<div class="heart hearttalk" itemId="'+data[j].ID+'" rel="like"></div>\n';
                }
                html+='<span class="bbqbuttonspan likespan" >' + data[j].GOOD_COUNT + '</span>\n' +
                    '<span class="locationpl"  onclick="">\n' +
                    '<img src="images/pinglun-icon.png" />\n' +
                    '<span class="bbqbuttonspan">' + data[j].REPLAYCOUNT + '</span>\n' +
                    '</span>\n' +
                    '<img class="fr bbqgengdtc" itemId="'+data[j].ID+'" onclick="" src="images/gengduo.png" />\n' +
                    '</div>\n' +
                    '</div>\n';
                if (data[j].HOTOR != null && data[j].HOTOR == '1') {
                    html += '<div class="bbqremen"><img src="images/remen.png"></div>\n';
                }
            }
            $('#detailTalk').html(html);

            ////评论
            var bodyParam = {'USER_ID': user_id,'TALK_ID':GetQueryString('id'),'PAGE':page};
            listComment(bodyParam,refreshorload);
        }
        //console.log(response);
        var listimgs = $('.listimgs').width();
        $('.listimgs').height(listimgs);

        baguetteBox.run('.baguetteBoxOne');
    });
}
/**
 * 评论列表
 */
function listComment(bodyParam,refreshorload) {
    var hrt = new HttpRequestTool(url + 'getTalkReply', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);
        if(data!=null) {
            var html = '';

            if(data.length==0&&refreshorload=='load'){
                loading = true;
                $(".weui-loadmore").show();
                $(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
            }
            else{
                for (var j = 0, len = data.length; j < len; j++) {

                    var good_count= data[j].GOOD_COUNT==null?0:data[j].GOOD_COUNT;

                    var userid='0';
                    if(data[j].IS_HIDE=='否'){
                        userid= data[j].C_ID;
                    }
                    if(data[j].I_UPIMG==null){
                        if(data[j].IS_HIDE=='是'){
                            html+='<li class="pllist" itemId="'+data[j].ID+'">\n' +
                                '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                                '<img src="'+data[j].I_UPIMG+'" >\n' +
                                '</div>\n' ;
                        }
                        else{
                            html+='<li class="pllist" itemId="'+data[j].ID+'">\n' +
                                '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                                '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                                '</div>\n' ;
                        }

                    }
                    else{
                        html+='<li class="pllist" itemId="'+data[j].ID+'">\n' +
                            '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                            '<img src="'+data[j].I_UPIMG+'" >\n' +
                            '</div>\n' ;
                    }

                    if (data[j].RZ_STATUS != null && data[j].RZ_STATUS == '已认证' && data[j].IS_HIDE == '否') {
                        html += '<img class="renzdeicon" src="images/renzheng-left-icon.png">\n' +
                            '<img class="renzdeicons" src="images/renzheng-right-icon.png">\n';
                    }
                    html+='<div class="pllistword">\n' +
                        '<div class="bbqplname">\n' +
                        '<p class="plname">'+data[j].NICKNAME+'</p>\n' +
                        '<div class="plbut">\n' +
                        '<span class="plbutspan">'+data[j].TOTAL+'</span>\n' +
                        '<img class="addSubComment" itemId="'+data[j].ID+'" onclick="" src="images/pinglun-icon.png" />\n' +
                        '<div class="plbut posire">\n';
                    if(data[j].GOOD!=null&&data[j].GOOD=='已赞'){
                        html+='<div class="heart heartcomment heartAnimation" itemId="'+data[j].ID+'" rel="unlike" style="right: -5px;left: inherit;top: -18px;"></div>';
                    }
                    else{
                        html+='<div class="heart heartcomment"  itemId="'+data[j].ID+'"  rel="like" style="right: -5px;left: inherit;top: -18px;"></div>\n';
                    }
                    html+='<span class="plbutspan" id="">'+good_count+'</span>\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '<p class="bbqtime">'+data[j].TIME+'</p>\n' +
                        '<p class="bbqneirdetail">'+data[j].REPLY_CONTENT+'</p>\n';

                    var subcomment=data[j].SUN;

                    if(subcomment.length>0){
                        html+='<div class="pltwo">\n' ;
                        for(i = 0,sublen=subcomment.length; i< sublen;i++) {
                            html+='<p><span class="bbqbla">'+subcomment[i].NICKNAME+':</span>'+subcomment[i].REPLY_CONTENT+'</p>\n' ;
                            /*html+='<p><span class="bbqbla">'+subcomment[i].NICKNAME+' 回复 '+
                                data[j].NICKNAME+'：</span>'+subcomment[i].REPLY_CONTENT+'</p>\n' ;*/
                        }
                        html+='<span class="pltiaoz" onclick="" itemId="'+data[j].ID+'">查看全部<span>'+data[j].TOTAL+'</span>条评论></span>\n'+
                            '</div>\n' ;
                    }

                    html+='</div>\n' +
                        '</li>';
                }

                if(refreshorload=='refresh'){
                    $('#listComment').html(html);
                    $('#refreshDiv').pullToRefreshDone();

                }
                else if(refreshorload=='load'){
                    $('#listComment').append(html);

                }
                loading = false;
                $(".weui-loadmore").hide();
            }

        }
    });
}
/**
 * 话题点赞
 */
function admireTalk(bodyParam) {
    var hrt = new HttpRequestTool(url + 'GoodCancel', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);


    });
}
/**
 * 评论点赞
 */
function admireComment(bodyParam) {
    var hrt = new HttpRequestTool(url + 'GoodCancelReply', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);

    });
}

/**
 * 话题收藏
 */
function saveTalk(bodyParam) {
    var hrt = new HttpRequestTool(url + 'TalkSaveCancel', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);


    });
}
/**
 * 举报
 */
function addReport(bodyParam) {
    var hrt = new HttpRequestTool(url + 'TalkReport', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);
        $.toast("已提交举报信息！", "text");
    });
}
function listReport(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxReportReason', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        var html='';
        for(j = 0,len=data.length; j < len; j++) {
            html+=' <div class="tit jubaotit"  onclick="" itemId="'+data[j].ID+'">'+data[j].NM_T+'</div>\n';
        }
        html+=' <textarea class="tittext" placeholder="请输入举报内容" id="jbText" style="display: none;"></textarea>\n' +
            ' <div class="titbtn" id="cancelJbBtn"  onclick="">取消</div>\n' +
            ' <div class="titbtn bbqgreen" id="addJbBtn"  onclick="">完成</div>\n' ;

        $('#jubaoDiv').html(html);




    });
}