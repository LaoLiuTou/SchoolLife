
var page=1;
var loading = false;
$(document).ready(function () {

    $('body').infinite(100).on("infinite", function() {
        var self = this;
        if(loading) return;
        $(".weui-loadmore").show();
        loading = true;
        setTimeout(function() {
            page++;
            var bodyParam = {'USER_ID': user_id,'ID':GetQueryString('pid'),'PAGE':page};
            listComment(bodyParam,'load');

        }, 1000);

    });

    var bodyParam = {'USER_ID': user_id,'ID':GetQueryString('pid'),'PAGE':page};
    listComment(bodyParam,'refresh');


    $("body").on('click','.bbqshur',function(){
        window.location.href='comment_tc.html?id='+GetQueryString('id')+'&pid='+GetQueryString('pid')+'&type=comment';
    });
    $("body").on('click','.addSubComment',function(){
        window.location.href='comment_tc.html?id='+GetQueryString('id')+'&pid='+$(this).attr('itemId')+'&type=subcomment&fid='+$(this).attr('fid');
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
});



/**
 * 评论列表
 */
function listComment(bodyParam,refreshorload) {
    console.log(JSON.stringify(bodyParam));
    var hrt = new HttpRequestTool(url + 'getReplys', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        console.log(response);
        var data = obj['Result'];
        if(data!=null) {

            var userid='0';
            if(data.IS_HIDE=='否'){
                userid= data.C_ID;
            }

            if(data.I_UPIMG==null){
                if(data.IS_HIDE=='是'){
                    var html = '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                        '<img src="'+data.I_UPIMG+'">\n' +
                        '</div>\n' ;
                }
                else{
                    var html = '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                        '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                        '</div>\n' ;
                }

            }
            else{
                var html = '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                    '<img src="'+data.I_UPIMG+'">\n' +
                    '</div>\n' ;
            }

            if (data.RZ_STATUS != null && data.RZ_STATUS == '已认证' && data.IS_HIDE == '否') {
                html += '<img class="renzicon" src="images/renzheng-left-icon.png">\n' +
                    '<img class="renzicons" src="images/renzheng-right-icon.png">\n';
            }
            html +='<div class="bbqlistword">\n' +
                '<div class="bbqplname">\n' +
                '<p class="plname">'+data.NICKNAME+'</p>\n' +
                '<div class="plbut posire">\n';
            if(data.GOOD!=null&&data.GOOD=='已赞'){
                html+='<div class="heart heartcomment heartAnimation" itemId="'+data.ID+'" rel="unlike" style="right: 1px;left: inherit;top: -18px;"></div>';
            }
            else{
                html+='<div class="heart heartcomment" itemId="'+data.ID+'" rel="like" style="right: 1px;left: inherit;top: -18px;"></div>\n' ;
            }

            html+='<span class="plbutspan" >'+data.GOOD_COUNT+'</span>\n' +
                '</div>\n' +
                '<span class="locationpl" onclick="">\n' +
                '\n' +
                '</span>\n' +
                '</div>\n' +
                '</div>\n' +
                '<p class="bbqtime">'+data.TIME+'</p>\n' +
                '<p class="bbqneir">'+data.REPLY_CONTENT+'</p>\n';

            $('#comment').html(html);
            var subcomment=data.SUN;
            if(subcomment.length==0&&refreshorload=='load'){
                loading = true;
                $(".weui-loadmore").show();
                $(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
            }
            else{
                if(subcomment.length>0){
                    var subHtml='';
                    userid='0';
                    if(data.IS_HIDE=='否'){
                        userid= data.C_ID;
                    }
                    for(var i = 0,sublen=subcomment.length; i< sublen;i++) {


                        if(subcomment[i].I_UPIMG==null){
                            if(subcomment[i].IS_HIDE=='是'){
                                subHtml+='<li class="pllist" itemId="'+subcomment[i].ID+'">\n' +
                                    '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                                    '<img src="'+subcomment[i].I_UPIMG+'" >\n' +
                                    '</div>\n' ;
                            }
                            else{
                                subHtml+='<li class="pllist" itemId="'+subcomment[i].ID+'">\n' +
                                    '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                                    '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                                    '</div>\n' ;
                            }

                        }
                        else{
                            subHtml+='<li class="pllist" itemId="'+subcomment[i].ID+'">\n' +
                                '<div class="pllistimg" onclick="" itemId="'+userid+'">\n' +
                                '<img src="'+subcomment[i].I_UPIMG+'" >\n' +
                                '</div>\n' ;
                        }
                        if (subcomment[i].RZ_STATUS != null && subcomment[i].RZ_STATUS == '已认证' && subcomment[i].IS_HIDE == '否') {
                            subHtml += '<img class="renzdeicon" src="images/renzheng-left-icon.png">\n' +
                                '<img class="renzdeicons" src="images/renzheng-right-icon.png">\n';
                        }
                        subHtml +='<div class="pllistword">\n' +
                            '<div class="bbqplname">\n' +
                            '<p class="plname">'+subcomment[i].NICKNAME+'</p>\n' +
                            '<div class="plbut">\n' +
                            '<span class="plbutspan">'+'</span>\n' +//评论数
                            '<img src="images/pinglun-icon.png" class="addSubComment" onclick="" fid="'+data.ID+'" itemId="'+subcomment[i].ID+'"/>\n' +
                            '<div class="plbut posire">\n' ;
                        if(subcomment[i].GOOD!=null&&subcomment[i].GOOD=='已赞'){
                            subHtml+='<div class="heart heartcomment heartAnimation" itemId="'+subcomment[i].ID+'" rel="unlike" style="right: 1px;left: inherit;top: -18px;"></div>';
                        }
                        else{
                            subHtml+='<div class="heart heartcomment"  itemId="'+subcomment[i].ID+'"  rel="like" style="right: 1px;left: inherit;top: -18px;"></div>\n';
                        }
                        subHtml+='<span class="plbutspan"  >'+subcomment[i].GOOD_COUNT+'</span>\n' +
                            '</div>\n' +
                            '</div>\n' +
                            '</div>\n' +
                            '<p class="bbqtime">'+subcomment[i].TIME+'</p>\n' +
                            '<p class="bbqneirdetail">'+'回复 <font color="#27d3d2">'+subcomment[i].PNAME+'</font> : '+subcomment[i].REPLY_CONTENT+'</p>\n' +
                            '</div>\n' +
                            '</li>';
                    }

                }
                if(refreshorload=='refresh'){
                    $('#subComment').html(subHtml);
                }
                else if(refreshorload=='load'){
                    $('#subComment').append(subHtml);
                }
                loading = false;
                $(".weui-loadmore").hide();
            }






        }
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