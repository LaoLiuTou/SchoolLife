var searchText='';
var labelId='';
var sltype='',labelText='';
$(document).ready(function () {
    searchText=getUrlParam('searchText');
    sltype=getUrlParam('sltype');
    labelId=getUrlParam('labelId');
    var param = {'USER_ID': user_id};
    listLabel(param);
    if(labelId==''){
        $('#searchText').val(searchText);
        if(searchText!=''){
            if(sltype=='firstSearch'){
                var bodyParam = {'USER_ID': user_id, 'IS_SEE': '1', 'PAGE': 1};
                listTalk(bodyParam,$('#'+sltype), 'refresh');
            }
            else{
                var bodyParam = {'USER_ID': user_id, 'IS_SEE': '0', 'PAGE': 1};
                listTalk(bodyParam, $('#'+sltype), 'refresh');
            }
        }
    }
    else{
        searchText='#'+searchText;
        labelText=searchText;
        if(sltype=='firstSearch'){
            var bodyParam = {'USER_ID': user_id, 'IS_SEE': '1', 'PAGE': 1};
            listTalk(bodyParam,$('#'+sltype), 'refresh');
        }
        else{
            var bodyParam = {'USER_ID': user_id, 'IS_SEE': '0', 'PAGE': 1};
            listTalk(bodyParam, $('#'+sltype), 'refresh');
        }
    }

    $('#searchText').focus(function () {
        $('#labelDiv').show();
    });

    $('#searchText').bind('search', function () {
        searchText=$(this).val();
        labelId='';
        labelText='';
        if(searchText!='') {

            if(sltype=='firstSearch'){
                var bodyParam = {'USER_ID': user_id, 'IS_SEE': '1', 'PAGE': 1};
                listTalk(bodyParam,$('#'+sltype), 'refresh');
            }
            else{
                var bodyParam = {'USER_ID': user_id, 'IS_SEE': '0', 'PAGE': 1};
                listTalk(bodyParam, $('#'+sltype), 'refresh');
            }
        }

    });
    $('body').on('click','.bbqbiaoq',function(e){
        searchText='';
        $('#searchText').val('');
        labelId=$(this).attr('itemId');
        labelText=$(this).text();
        if(sltype=='firstSearch'){
            var bodyParam = {'USER_ID': user_id, 'IS_SEE': '1', 'PAGE': 1};
            listTalk(bodyParam,$('#'+sltype), 'refresh');
        }
        else{
            var bodyParam = {'USER_ID': user_id, 'IS_SEE': '0', 'PAGE': 1};
            listTalk(bodyParam, $('#'+sltype), 'refresh');
        }
        e.stopPropagation();

    });

    $('body').on('click','.bbqlist',function(){
        window.location.href='post_details.html?id='+$(this).attr("itemId");
    });

    $('body').on('click','.showmore',function(){
        var sltype=$(this).attr('sltype');
        window.location.href='search-more.html?sltype='+sltype+'&searchText='+searchText;
    });

    $('#cancelBtn').click(function(){
        window.history.go(-1);
    });
});

/**
 * 标签列表
 */
function listLabel(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxTalkLab', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        console.log("标签:"+response);
        var obj = JSON.parse(response);
        var data = obj['Result'];
        var htmlsearch='';
        for(var j = 0,len=data.length; j < len; j++) {
            htmlsearch+='<div class="bbqbiaoq" onclick="" itemId="'+data[j].ID+'" select="false">#'+data[j].LABEL_NAME+'</div>';
        }
        $('#searchLabel').html(htmlsearch);


    });
}

/**
 * 话题列表
 */
function listTalk(bodyParam,dom,refreshorload) {
    //var hrt = new HttpRequestRefreshTool(url + 'cxTalkList', 'post', 'text', true, false, bodyParam, 'callBack');

    $('#labelDiv').hide();
    var  frontText='';

    if(labelId!=''){
        bodyParam['LAB_ID']=labelId;
        frontText=labelText;
    }
    else {
        if(searchText!=''){
            bodyParam['KEYBYTE']=searchText;
            frontText=searchText;
        }
    }

    var hrt = new HttpRequestRefreshTool(url + 'cxTalkKeyBYTE', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];
        $(dom).html('');
        if($(dom).attr('id')=='firstSearch'){
            var html='<p class="bbqseartit bbqwid90"><span>'+frontText+'</span>-&nbsp;校园表白墙</p>';
        }
        else{
            var html='<p class="bbqseartit bbqwid90"><span>'+frontText+'</span>-&nbsp;话题广场</p>';
        }


        if(data.length>0){
            for(var j = 0,len=data.length; j < len; j++) {


                var userid='0';
                if(data[j].IS_HIDE=='否'){
                    userid= data[j].TALK_USER_ID;
                }
                if(data[j].I_UPIMG==null){
                    if(data[j].IS_HIDE=='是'){
                        html+='<li class="bbqlist" onclick="" itemId="'+data[j].ID+'">\n' +
                            '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                            '<img src="'+data[j].I_UPIMG+'" >\n' +
                            '</div>\n' ;
                    }
                    else{

                        html+='<li class="bbqlist " onclick="" itemId="'+data[j].ID+'">\n' +
                            '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                            '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                            '</div>\n' ;
                    }

                }
                else{
                    html+='<li class="bbqlist" onclick="" itemId="'+data[j].ID+'">\n' +
                        '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                        '<img src="'+data[j].I_UPIMG+'" >\n' +
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
                if($(dom).attr('id')=='secondSearch'){
                    html+='<span class="bbqtime">\n' +
                        '<img class="bbqwz" src="images/indexwz-icon.png">'+data[j].SC_NM+'\n' +
                        '</span>';
                }
                html+='<p class="bbqneir">'+data[j].TALK_CONTENT+'</p>\n' ;

                var contentImage=data[j].TALK_IMG;
                if(contentImage!=null){
                    html+='<div class="baguetteBoxOne  bbqlistimgs" >\n' ;
                    var contentImages=contentImage.split("|");
                    if(contentImages.length>0){
                        for(i = 0,imagelen=contentImages.length; i< imagelen;i++) {
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
                    html+='</div>\n' ;
                }
                html+='</li>';
            }

            $(dom).html(html);

            //$("img.lazy").lazyload({placeholder : "images/loading.gif", effect: "fadeIn", threshold: 300});
            var listimgs = $('.listimgs').width()==0?100: $('.listimgs').width();
            $('.listimgs').height(listimgs);
            baguetteBox.run('.baguetteBoxOne');
        }




    });
}