var page=1;
var loading = false;
var talkId;
$(document).ready(function () {

    $('.detailslist').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');


        setTimeout(function() {
            page=1;
            var bodyParam = {'USER_ID': user_id,'PAGE':page};
            listSave(bodyParam,'refresh');
        }, 1000);

    });

    $(".detailslist").infinite().on("infinite", function() {
        var self = this;
        if(loading) return;
        $(self).find(".weui-loadmore").show();
        loading = true;

        setTimeout(function() {
            page++;
            var bodyParam = {'USER_ID': user_id,'PAGE':page};
            listSave(bodyParam,'load');

        }, 1000);

    });

    var bodyParam= {'USER_ID': user_id,'PAGE':page};
    listSave(bodyParam,'refresh');


    //item 点击
    $('body').on('click','.bbqlist',function(){
        window.location.href='post_details.html?id='+$(this).attr("itemId");
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
    $("#deleteBtn").click(function() {

        $('.bbqgengdtanc').hide();

        var bodyParam = {'USER_ID': user_id,'TALK_ID':talkId,'SAVECEN':'0'};
        saveTalk(bodyParam);

    });


    //头像点击
    $('body').on('click','.bbqlistimg',function(e){
        if($(this).attr("itemId")!='0'){
            window.location.href='user_details.html?id='+$(this).attr("itemId");
        }
        e.stopPropagation();

    });



});





/**
 * 话题列表
 */
function listSave(bodyParam,refreshorload) {

    var hrt = new HttpRequestRefreshTool(url + 'MySave', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];

        console.log(response);
        var html='';

        if(data.length==0&&refreshorload=='refresh'){
            html='<div class="bbq404">\n' +
                '<img src="images/wushoucang-bg.png">\n' +
                '<p>明明有那么多优秀的话题，为什么同学您一个都没有搜藏(╥﹏╥)</p>\n' +
                '</div>';
            $("#contentUl").html(html);
            $('.detailslist').pullToRefreshDone();
        }
        else if(data.length==0&&refreshorload=='load'){
            loading = true;
            $(".weui-loadmore").show();
            $(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
        }
        else{
            for(var j = 0,len=data.length; j < len; j++) {

                var userid='0';
                if(data[j].IS_HIDE=='否'){
                    userid= data[j].TALK_USER_ID;
                }

                if(data[j].I_UPIMG==null){
                    if(data[j].IS_HIDE=='是'){
                        html+='<li class="bbqlist mb1"   onclick="" itemId="'+data[j].TALK_ID+'">\n' +
                            '<div class="bbqlistimg"  onclick="" itemId="'+userid+'">\n' +
                            '<img src="'+data[j].I_UPIMG+'"  >\n' +
                            '</div>\n' ;
                    }
                    else{

                        html+='<li class="bbqlist mb1"  onclick="" itemId="'+data[j].TALK_ID+'">\n' +
                            '<div class="bbqlistimg"  onclick="" itemId="'+userid+'">\n' +
                            '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                            '</div>\n' ;
                    }

                }
                else{
                    html+='<li class="bbqlist mb1"   onclick="" itemId="'+data[j].TALK_ID+'">\n' +
                        '<div class="bbqlistimg"  onclick="" itemId="'+userid+'">\n' +
                        '<img src="'+data[j].I_UPIMG+'"  >\n' +
                        '</div>\n' ;
                }
                if(data[j].RZ_STATUS!=null&&data[j].RZ_STATUS=='已认证'&&data[j].IS_HIDE=='否'){
                    html+='<img class="renzicon" src="images/renzheng-left-icon.png">\n' +
                        '<img class="renzicons" src="images/renzheng-right-icon.png">\n';
                }
                if(data[j].SE_LV!=null&&data[j].SE_LV=='男'){
                    html+='<div class="bbqlistword" >\n'+
                        '<p class="bbqname">'+data[j].NICKNAME+'<img class="bbqxb" src="images/nan-icon.png"></p>\n';
                }
                else{
                    html+='<div class="bbqlistword" >\n'+
                        '<p class="bbqname">'+data[j].NICKNAME+'<img class="bbqxb" src="images/nv-icon.png"></p>\n';
                }

                if(data[j].OPEN_DT!=null){
                    html+='<p class="bbqtime">'+getDateDiff(data[j].OPEN_DT)+'</p>\n';
                }
                html+='<p class="bbqneir">'+data[j].TALK_CONTENT+'</p>\n' ;
                html+='<div class="baguetteBoxOne  bbqlistimgs" >\n' ;
                var contentImage=data[j].TALK_IMG;
                if(contentImage!=null){
                    var contentImages=contentImage.split("|");
                    if(contentImages.length>0){
                        for(var i = 0,imagelen=contentImages.length; i< imagelen;i++) {
                            /*html+='<a class="listimgs" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;*/
                            html+='<a class="listimgs" itemId="'+data[j].TALK_ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;
                            /*html+='<a class="listimgs"  itemId="'+data[j].TALK_ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                  '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'"  href="'+contentImages[i]+'" >\n' +
                                   '<img class="lazy" data-original="'+contentImages[i]+'"></a>\n' ;*/
                        }

                    }
                }
                html+='</div>\n' ;

                html+='<div class="bbqbuttonthree posire">\n' ;
                if(data[j].GOOD=='已赞'){
                    html+='<div class="heart hearttalk heartAnimation" itemId="'+data[j].TALK_ID+'" rel="unlike" ></div>';
                }
                else{
                    html+="<div class='heart hearttalk' itemId='"+data[j].TALK_ID+"'  rel='like'></div>";
                }
                html+='<span class="bbqbuttonspan likespan">'+data[j].GOOD_COUNT+'</span>\n' +
                    '<span class="locationpl" >\n' +
                    '<img src="images/pinglun-icon.png" class="commentImg" onclick=""/>\n' +
                    '<span class="bbqbuttonspan">'+data[j].REPLAYCOUNT+'</span>\n' +
                    '</span>\n' +
                    '<img class="fr bbqgengdtc"  onclick="" itemId="'+data[j].TALK_ID+'" src="images/gengduo.png" />\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</li>';


            }

            if(refreshorload=='refresh'){
                $("#contentUl").html(html);
                $('.detailslist').pullToRefreshDone();

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
 * 话题收藏
 */
function saveTalk(bodyParam) {
    console.log(JSON.stringify(bodyParam));
    var hrt = new HttpRequestTool(url + 'TalkSaveCancel', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);
        $.toast("删除成功！", "text");
        $('.bbqlist[itemId="'+talkId+'"]').remove();

    });
}
/**
 * 话题点赞
 */
function admireTalk(bodyParam) {
    console.log(JSON.stringify(bodyParam));
    var hrt = new HttpRequestTool(url + 'GoodCancel', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        console.log(response);


    });
}