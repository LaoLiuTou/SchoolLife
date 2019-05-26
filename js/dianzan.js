$(document).ready(function () {

    $('body').on("click", '.hearttalk', function (e) {

        var talkLikeId=$(this).attr('itemId');

        var A = $(this).attr("id");
        //var B=A.split("like");
        //var messageID=B[1];
        var C = parseInt($(this).next().text());
        $(this).css("background-position", "")
        var D = $(this).attr("rel");

        if (D === 'like') {
            //$(this).next().text(C + 1);
            $('.hearttalk[itemId="'+talkLikeId+'"]').next().text(C + 1);
            $('.hearttalk[itemId="'+talkLikeId+'"]').addClass("heartAnimation").attr("rel", "unlike");
            //弹窗点赞数变化
            $('.listimgs[itemId="'+talkLikeId+'"]').attr('good',C+1);
            $('.listimgs[itemId="'+talkLikeId+'"]').attr('like','已赞');

            var bodyParam = {'USER_ID': user_id,'TALK_ID':talkLikeId,'GOOD_CANCEL':'1'};

            admireTalk(bodyParam);

        }
        else {
            //$(this).next().text(C - 1);
            $('.hearttalk[itemId="'+talkLikeId+'"]').next().text(C - 1);
            $('.listimgs[itemId="'+talkLikeId+'"]').attr('good',C-1);
            $('.listimgs[itemId="'+talkLikeId+'"]').attr('like','');
            $('.hearttalk[itemId="'+talkLikeId+'"]').removeClass("heartAnimation").attr("rel", "like");
            $('.hearttalk[itemId="'+talkLikeId+'"]').css("background-position", "left");

            var bodyParam = {'USER_ID': user_id,'TALK_ID':talkLikeId,'GOOD_CANCEL':'0'};
            admireTalk(bodyParam);
        }
        e.stopPropagation();

    });
    $('body').on("click", '.heartcomment', function (e) {

        var A = $(this).attr("id");
        //var B=A.split("like");
        //var messageID=B[1];
        var C = parseInt($(this).next().text());
        $(this).css("background-position", "")
        var D = $(this).attr("rel");

        if (D === 'like') {
            $(this).next().text(C + 1);
            $(this).addClass("heartAnimation").attr("rel", "unlike");

            var bodyParam = {'USER_ID': user_id,'REPLY_ID':$(this).attr('itemId'),'GOOD_CANCEL':'1'};
            admireComment(bodyParam);
        }
        else {
            if(C>0){
                $(this).next().text(C - 1);
            }
            $(this).removeClass("heartAnimation").attr("rel", "like");
            $(this).css("background-position", "left");

            var bodyParam = {'USER_ID': user_id,'REPLY_ID':$(this).attr('itemId'),'GOOD_CANCEL':'0'};
            admireComment(bodyParam);
        }
        e.stopPropagation();

    });


});
