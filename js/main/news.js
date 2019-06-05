var page=1;
var loading = false;
$(document).ready(function () {

    $('.detailslist').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');


        setTimeout(function() {
            page=1;
            var bodyParam = {'USER_ID': user_id,'PAGE':page};
            getNewsList(bodyParam,'refresh');
        }, 1000);

    });

    $('.detailslist').infinite().on("infinite", function() {
        var self = this;
        if(loading) return;
        $(self).find(".weui-loadmore").show();
        loading = true;

        setTimeout(function() {
            page++;
            var bodyParam = {'USER_ID': user_id,'PAGE':page};
            getNewsList(bodyParam,'load');

        }, 1000);

    });

    $('body').on('click','.newlist-li',function () {
        //var type=$(this).attr('type');
        var bodyParam = {'USER_ID': user_id,'MESS_ID':$(this).attr("itemId")};
        readNews(bodyParam,$(this));



    });
    $('.bbqreturn').click(function(){
        //window.location.href='personal_center.html?step=3';
        /*console.log(GetQueryString('step'));
        if(GetQueryString('step')=='3'){
            window.history.go(-3);
        }
        else{
            window.history.go(-1);
        }*/
        //
        window.location.href='personal_center.html?step=3';
        //window.history.go(-1);

    });
    var bodyParam = {'USER_ID': user_id,'PAGE':'1'};
    getNewsList(bodyParam,'refresh');
});

/**
 * 消息列表
 */
function getNewsList(bodyParam,refreshorload) {
    var hrt = new HttpRequestTool(url + 'getMessage', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        console.log(response);
        var data = obj['Result'];
        if(data.length==0&&refreshorload=='refresh'){
            var html = '<div class="bbq404">\n' +
                ' <img src="images/wuxiaoxi-bg.png">\n' +
                ' <p>同学  您的话题还没有收到其他同学回复哦</p>\n' +
                '</div>';
            $('#contentUl').html(html);
            $('.detailslist').pullToRefreshDone();
        }
        else if(data.length==0&&refreshorload=='load'){
            loading = true;
            $(".weui-loadmore").show();
            $(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
        }
        else {
            var html = '';
            for (j = 0, len = data.length; j < len; j++) {

                html += '<li id="li" class="swipe-delete-element newlist-li" itemId="' + data[j].ID +
                    '" talkId="' + data[j].TALK_ID + '" replyId="' + data[j].REAPLY_ID + '" type="' + data[j].MESSAGE_TYPE + '">\n' +
                    '<div class="con bbqwid90">\n' +
                    '<div class="bbqguanzimg mt03">\n';
                if (data[j].I_UPIMG != null) {
                    html += '<img src="' + data[j].I_UPIMG + '">\n';
                }
                else {
                    html += '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n';
                }
                html += '</div>\n' +
                    '<div class="bbqguanzword widin">\n' +
                    '<div class="bbqguanzname fl">\n' +
                    '<p class="mewsname">' + data[j].MESSAGE_CONTENT + '</p>\n' +
                    '<p class="newstime bbqtime">' + getDateDiff(data[j].SEND_DT) + '</p>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    /* '<div class="bbqguanzword widin">\n' +
                '<p class="newcol fl">赞了您的发表</p>\n' +
                '</div>\n' +*/
                    '<div class="newsimg">\n';
                if (data[j].TALK_IMG != null) {
                    html += '<img src="'+data[j].TALK_IMG+'">\n';
                }
                else {
                    html += data[j].TALK_CONTENT;
                }

                html += '</div>\n' +
                    '</div>\n' +
                    '<div class="swipe-delete-btn newsbtn">\n' +
                    '<img src="images/xiaoxi-sc-icon.png">\n' +
                    '</div>\n';
                if(data[j].READ_STATUS=='未读'){
                    html+='<div class="bbqnewweid" itemId="' + data[j].ID+'"></div>';
                }
                html+='</li>';

            }
            if(refreshorload=='refresh'){
                $('#contentUl').html(html);
                $('.detailslist').pullToRefreshDone();

            }
            else if(refreshorload=='load'){
                $('#contentUl').append(html);
                $(".weui-loadmore").hide();
            }
            loading = false;
        }
        //舒适化滑动
        var i = $(".swipe-delete-element").length;
        for( var j=0;j<i;j++){
            var swipedeletecontent = document.querySelectorAll(".swipe-delete-element")[j];
            var itemId=$(swipedeletecontent).attr('itemId');
            var sa = swipeDelete(swipedeletecontent, {
                direction: 'left',
                deleteFn: function(e) {
                    var item=e.target.parentNode.parentNode;
                    console.log($(item).attr('itemId'));
                    var bodyParam = {'USER_ID': user_id,'MESS_ID':$(item).attr('itemId')};
                    deleteNews(bodyParam);
                }
            })
        }


    });
}
function deleteNews(bodyParam) {
    var hrt = new HttpRequestTool(url + 'delMessage', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        //var obj = JSON.parse(response);
        //var result = obj['Result'];
        $.toast("消息已删除！", "text");
        $('.newlist-li[itemId="'+bodyParam["MESS_ID"]+'"]').remove();

    });
}

function readNews(bodyParam,dom) {
    var hrt = new HttpRequestTool(url + 'updateMessage', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var type=$(dom).attr('type');

        if(type=='话题回复'){
            window.location.href='post_details.html?id='+$(dom).attr("talkId");

        }
        else if(type=='二次回复'){
            window.location.href='comment_details.html?id='+$(dom).attr("talkId")+'&pid='+$(dom).attr("replyId");
        }
        console.log(response);
        //var obj = JSON.parse(response);
        //var result = obj['Result'];
        //$.toast("消息已删除！", "text");
        //var bodyParam = {'USER_ID': user_id,'PAGE':'1'};
        //getNewsList(bodyParam,'refresh');
        $('.bbqnewweid[itemId="'+bodyParam["MESS_ID"]+'"]').remove();

    });
}
