var page=1;
var loading = false;
var talkId;
$(document).ready(function () {

    $('.detailslists').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');


        setTimeout(function() {
            page=1;
            var bodyParam = {'USER_ID': user_id,'OTHER_ID':GetQueryString('id'),'PAGE':page};
            listTalkHistory(bodyParam,'refresh');
        }, 1000);

    });

    $(".detailslists").infinite().on("infinite", function() {
        var self = this;
        if(loading) return;
        $(self).find(".weui-loadmore").show();
        loading = true;

        setTimeout(function() {
            page++;
            var bodyParam = {'USER_ID': user_id,'OTHER_ID':GetQueryString('id'),'PAGE':page};
            listTalkHistory(bodyParam,'load');

        }, 1000);

    });

    $('body').on('click','#followBtn',function(){
        var bodyParam = {'USER_ID':user_id,'ATT_USER_ID': GetQueryString('id'),'SAVECEN':'1'};
        follow(bodyParam);
    });


    $('body').on('click','#unfollowBtn',function(){
        var bodyParam = {'USER_ID':user_id,'ATT_USER_ID': GetQueryString('id'),'SAVECEN':'0'};
        follow(bodyParam);
    });
    $('#paperBtn').click(function(){
        window.location.href='push_paperstrip.html?id='+ GetQueryString('id')+'&name='+$('#nickname').text();
    });

    var bodyParam = {'USER_ID': user_id,'OTHER_ID':GetQueryString('id')};
    getUserInfo(bodyParam);
    bodyParam = {'USER_ID': user_id,'OTHER_ID':GetQueryString('id'),'PAGE':page};
    listTalkHistory(bodyParam,'refresh');
    listReport();

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
    //item 点击
    $('body').on('click','.bbqdetalistbg',function(){
        window.location.href='post_details.html?id='+$(this).attr("itemId");
    });

});

/**
 * 用户信息
 */
function getUserInfo(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxXsList', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);
        if(data!=null){
            $('#navtext').text(data['NICKNAME']);
            $('#nickname').text(data['NICKNAME']);
            $('#sc_nm').text(data['NM_T']);
            if(data['LEVEL_NAME']!=null) {
                $('#level_name').text(data['LEVEL_NAME']);
                $('#level_name_icon').text( getLevelbyName(data['LEVEL_NAME']));
            }
            var header='images/9f10f09c24c4611808bcccd9b5302a3.jpg';
            if(data['I_UPIMG']!=null){
                header=data['I_UPIMG'];
            }
            $('#i_upimg').prop('src',header);
            if(data['GZ_STATUS']=='未关注'){

                $('.followBtn').prop('id','followBtn');
                $('.followBtn').html('<img src="images/guanzhu-icon.png">');

            }
            else{
                $('.followBtn').prop('id','unfollowBtn');
                $('.followBtn').html('<img src="images/yiguanzhu-icon.png">');
            }

        }
    });
}


/**
 * 话题列表
 */
function listTalkHistory(bodyParam,refreshorload) {

    var hrt = new HttpRequestRefreshTool(url + 'cxTalkHistory', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];

        console.log(response);
        var html='';

        if(data.length==0&&refreshorload=='load'){
            loading = true;
            $(".weui-loadmore").show();
            $(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
        }
        else{
            for(j = 0,len=data.length; j < len; j++) {


                var dates=data[j].OPEN_DT.split(" ")[0].split("-");
                //var date=new Date(data[j].OPEN_DT);
                html+='<li class="bbqdetalistbg" onclick="" itemId="'+data[j].ID+'">\n' +
                    '<p class="detailstime"><span>'+dates[1]+'</span>/<span>'+dates[2]+'</span></p>\n' +
                    '<div class="detailsborder"></div>\n' +
                    '<div class="bbqdetalist ">\n' +
                    '<p class="bbqneir">'+data[j].TALK_CONTENT+'</p>\n' ;
                html+='<div class="baguetteBoxOne  bbqlistimgs" >\n';
                var contentImage=data[j].TALK_IMG;
                if(contentImage!=null){
                    var contentImages=contentImage.split("|");
                    if(contentImages.length>0){
                        for(var i = 0,imagelen=contentImages.length; i< imagelen;i++) {
                            /*html+='<a class="listimgs" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;*/
                            html+='<a class="listimgs" itemId="'+data[j].ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;
                            /*html+='<a class="listimgs"  itemId="'+data[j].ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'"  href="'+contentImages[i]+'" >\n' +
                                '<img class="lazy" data-original="'+contentImages[i]+'"></a>\n' ;*/
                        }
                    }
                }
                html+='    </div>';
                html+='<div class="bbqbuttonthree posire">\n' ;
                if(data[j].GOOD=='已赞'){
                    html+='<div class="heart hearttalk heartAnimation" itemId="'+data[j].ID+'" rel="unlike" ></div>';
                }
                else{
                    html+="<div class='heart hearttalk' itemId='"+data[j].ID+"'  rel='like'></div>";
                }
                html+='<span class="bbqbuttonspan likespan">'+data[j].GOOD_COUNT+'</span>\n' +
                    '<span class="locationpl"  >\n' +
                    '<img src="images/pinglun-icon.png" class="commentImg" onclick="" />\n' +
                    '<span class="bbqbuttonspan">'+data[j].REPLAYCOUNT+'</span>\n' +
                    '</span>\n' +
                    '<img class="fr bbqgengdtc" onclick="" itemId="'+data[j].ID+'" src="images/gengduo.png" />\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</li>';


            }

            if(refreshorload=='refresh'){
                $("#contentUl").html(html);
                $('.detailslists').pullToRefreshDone();

            }
            else if(refreshorload=='load'){
                $("#contentUl").append(html);
                $(".weui-loadmore").hide();
            }
            loading = false;
        }
        //$("img.lazy").lazyload({placeholder : "images/loading.gif", effect: "fadeIn", threshold: 300});
        var listimgs = $('.listimgs').width();
        $('.listimgs').height(listimgs);
        baguetteBox.run('.baguetteBoxOne');
    });
}

/**
 * 关注
 */
function follow(bodyParam) {
    var hrt = new HttpRequestTool(url + 'AttendCancel', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);

        if(bodyParam['SAVECEN']=='0'){
            $('.followBtn').prop('id','followBtn');
            $('.followBtn').html('<img src="images/guanzhu-icon.png">');
            $.toast("已取消关注！", "text");
        }
        else{
            $('.followBtn').prop('id','unfollowBtn');
            $('.followBtn').html('<img src="images/yiguanzhu-icon.png">');
            $.toast("关注成功！", "text");
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
            html+=' <div class="tit jubaotit" onclick="" itemId="'+data[j].ID+'">'+data[j].NM_T+'</div>\n';
        }
        html+=' <textarea class="tittext" placeholder="请输入举报内容" id="jbText" style="display: none;"></textarea>\n' +
            ' <div class="titbtn" id="cancelJbBtn" onclick="">取消</div>\n' +
            ' <div class="titbtn bbqgreen" id="addJbBtn" onclick="">完成</div>\n' ;

        $('#jubaoDiv').html(html);




    });
}
