var page=1;
var loading = false;
$(document).ready(function () {

    $('.detailslist').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');


        setTimeout(function() {
            page=1;
            var bodyParam = {'USER_ID': user_id,'PAGE':page};
            getPaperList(bodyParam,'refresh');
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
            getPaperList(bodyParam,'load');

        }, 1000);

    });

    var bodyParam = {'USER_ID': user_id,'PAGE':'1'};
    getPaperList(bodyParam,'refresh');

    $('body').on('click','.posire',function(){
        $('.bbqweid[itemId="'+$(this).attr("itemId")+'"]').remove();
        window.location.href='paperstrip_details.html?id='+$(this).attr("itemId");
    });

    $('#paperBtn').click(function(){
        window.location.href='push_paperstrip.html';
    });
});

/**
 * 小纸条列表
 */
function getPaperList(bodyParam,refreshorload) {
    console.log(JSON.stringify(bodyParam));
    var hrt = new HttpRequestTool(url + 'getPapers', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        console.log(response);
        var obj = JSON.parse(response);
        var data = obj['Result'];
        if(data.length==0&&refreshorload=='refresh'){
            var html='<div class="bbqzt404 bbqzht-li">\n' +
                '<p style="">还没有收到同学发给您小纸条噢</br>（ps：小纸条传给同学后您当然就看不见啦）</p>\n' +
                '</div>';
            $('#paperList').html(html);
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

                html += '<li class="posire"  onclick="" itemId="' + data[j].FIRST_ID + '">\n' +
                    '<div  class=" bbqzht-li">\n' +
                    '<div class="swipe-delete-element" itemId="' + data[j].ID + '">\n' +
                    '<div class="bbqguanzimg xztma">\n';
                if (data[j].I_UPIMG != null) {
                    html += '<img src="' + data[j].I_UPIMG + '">\n';
                }
                else {
                    html += '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n';
                }
                html += '</div>\n' +
                    '<div class="bbqxztword">\n' +
                    '<p class="">' + data[j].NICKNAME + '</p>\n' +
                    '<p class="">悄悄送给你一张小纸条丨<span>' + data[j].SEND_DT + '</span></p>\n' +
                    '</div>\n' +
                    '<div class="swipe-delete-btn bbqxztbtn" >\n' +
                    '<p >撕掉</p>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</div> \n';
                if (data[j].STATUS == '未读') {
                    html += '<div class="bbqweid" itemId="' + data[j].FIRST_ID + '"></div>\n';
                }
                html += '</li>';

            }

            if(refreshorload=='refresh'){
                $('#paperList').html(html);
                $('.detailslist').pullToRefreshDone();

            }
            else if(refreshorload=='load'){
                $('#paperList').append(html);
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
                    var bodyParam = {'USER_ID': user_id,'PAPER_ID':$(item).attr('itemId')};
                    deletePaper(bodyParam);
                }
            })
        }

    });
}

function deletePaper(bodyParam) {
    var hrt = new HttpRequestTool(url + 'delPaper', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        //var obj = JSON.parse(response);
        //var result = obj['Result'];
        $.toast("小纸条已经被你撕掉！", "text");
        $('.posire[itemId="'+bodyParam["PAPER_ID"]+'"]').remove();

    });
}