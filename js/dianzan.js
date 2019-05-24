$(document).ready(function () {

    $('body').on("click", '.hearttalk', function (e) {

        var A = $(this).attr("id");
        //var B=A.split("like");
        //var messageID=B[1];
        var C = parseInt($(this).next().text());
        $(this).css("background-position", "")
        var D = $(this).attr("rel");

        if (D === 'like') {
            $(this).next().text(C + 1);
            $(this).addClass("heartAnimation").attr("rel", "unlike");

            var bodyParam = {'USER_ID': user_id,'TALK_ID':$(this).attr('itemId'),'GOOD_CANCEL':'1'};
            admireTalk(bodyParam);

        }
        else {
            $(this).next().text(C - 1);
            $(this).removeClass("heartAnimation").attr("rel", "like");
            $(this).css("background-position", "left");

            var bodyParam = {'USER_ID': user_id,'TALK_ID':$(this).attr('itemId'),'GOOD_CANCEL':'0'};
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
