
var  selectLabel=[];

//本校1 或者 全部0
var tabIndex=1;
var loadingtab1 = false;
var loadingtab2 = false;
var tab1page=1;
var tab2page=1;

var searchText='';
var labelId='';
var talkId;

//接口真坑缓存label
var labels={};
//新建弹窗缓存
var addpopvalue;
//图片上传
var imageArray=[];

$(document).ready(function () {



    user_id=getUrlParam('user_id');
    //user_name=getUrlParam('user_name');
    /*存user_id*/
    localStorage.setItem('user_id',user_id);
    //localStorage.setItem('user_name',user_name);

    //localStorage.setItem('user_id','3362');
    //localStorage.setItem('user_name','林妹妹2');
    $('#goback').click(function () {
        window.location.href='#?backToApp=1';
    });

    //新建弹窗缓存
    //addpopvalue=$('#publishPop').clone();




    $('.weui-navbar__item').click(function () {

        if($(this).attr('href')=='#tab1'){
            tabIndex=1;
        }
        else if($(this).attr('href')=='#tab2'){
            tabIndex=0;
        }
        console.log(tabIndex);
    });

    $('.weui-tab__bd-item').pullToRefresh().on('pull-to-refresh', function (done) {
        var self = this;
        $(self).find(".weui-loadmore").html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');

        var domId=$(this).attr('id');
        //setTimeout(function() {
        if(domId=='tab1'){
            tab1page=1;
            var bodyParam = {'USER_ID': user_id,'IS_SEE':1,'PAGE':tab1page};
            listTalk(bodyParam,self,'refresh');
        }
        else if(domId=='tab2'){
            tab2page=1;
            var bodyParam = {'USER_ID': user_id,'IS_SEE':0,'PAGE':tab2page};
            listTalk(bodyParam,self,'refresh');
        }

        //}, 1000);

    });

    $(".weui-tab__bd-item").infinite().on("infinite", function() {
        var self = this;
        if(domId=='tab1'&&loadingtab1){
            return;
        }
        else if(domId=='tab2'&&loadingtab2){
            return;
        }

        $(self).find(".weui-loadmore").show();
        if(domId=='tab1'){
            loadingtab1 = true;
        }
        else if(domId=='tab2'){
            loadingtab2 = true;
        }

        var domId=$(this).attr('id');
        //setTimeout(function() {
        if(domId=='tab1'){
            tab1page++;
            var bodyParam = {'USER_ID': user_id,'IS_SEE':1,'PAGE':tab1page};
            listTalk(bodyParam,self,'load');
        }
        else if(domId=='tab2'){
            tab2page++;
            var bodyParam = {'USER_ID': user_id,'IS_SEE':0,'PAGE':tab2page};
            listTalk(bodyParam,self,'load');
        }

        // }, 1000);

    });

    var param = {'USER_ID': user_id};
    listBanners(param);
    listLabel(param);
    listReport();
    getUserInfo(param);

    var bodyParam = {'USER_ID': user_id,'IS_SEE':1,'PAGE':tab1page};
    listTalk(bodyParam,$('#tab1'),'refresh');
    bodyParam = {'USER_ID': user_id,'IS_SEE':0,'PAGE':tab2page};
    listTalk(bodyParam,$('#tab2'),'refresh');

    //发布弹出

    $('body').on('click','#bbqfbbtn',function(e){
            $('.bbqfbtanc').show();
            $('.fbtanbg').height('11rem');
            $('.bbqfbguanb').css({'transform':'rotate(45deg)','transition':'0.2s'})

     });
    $('body').on('click','#bbqtanchide',function(e){

        $('.bbqfbtanc').hide();
    })






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


    //搜索弹窗
    /*$('#searchBtn').click(function(){
        $("#searchPop").popup();

    });
    $('#cancelBtn').click(function () {
        $.closePopup();
    });*/
    //搜索跳转
    $('#searchBtn').click(function(){
        window.location.href='search.html';

    });








    $("#uploaderInput").on("change", function(e) {

            var tmpl = '<li class="weui-uploader__file" imageIndex="#imageIndex#" style="background-image:url(#url#)"></li>',
                $gallery = $("#gallery"),
                $galleryImg = $("#galleryImg"),
                $uploaderInput = $("#uploaderInput"),
                $uploaderFiles = $("#uploaderFiles");


            $("#uploaderInput").removeAttr("capture");
            var src, url = window.URL || window.webkitURL || window.mozURL,
                files = e.target.files;
            for(var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];

                if(url) {
                    src = url.createObjectURL(file);
                } else {
                    src = e.target.result;
                }

                if(imageArray.length>=9){
                    $.toast("最多只能上传9张图片！", "text");
                }
                else{
                    imageArray.push(file);
                    var  index=imageArray.indexOf(file);
                    $uploaderFiles.append($(tmpl.replace('#url#', src).replace('#imageIndex#', index)));
                }
            }
        });
    $("#uploaderFiles").on("click", "li", function() {
        $("#galleryImg").attr("style", this.getAttribute("style"));
        $("#gallery").fadeIn(100);
            $('#delgalleryBtn').attr('imageIndex',$(this).attr("imageIndex"));

        });
    $("#gallery").on("click", function() {
        $("#gallery").fadeOut(100);
        });
        $('#delgalleryBtn').click(function(){
            console.log(imageArray);
            var clickIndex=$(this).attr("imageIndex");
            imageArray.remove(imageArray[clickIndex]);
            $('#uploaderFiles li').each(function(){
                if(clickIndex==$(this).attr("imageIndex")){
                    $(this).remove();
                }
            });
            //console.log(imageArray);
            //$('#uploaderFiles li[imageIndex="'+$(this).attr("imageIndex")+'"]').text();
        });


    //标签选择
    $('#addLabel').on('click','.bbqbiaoq',function(){
        selectLabel=[];
        if($(this).attr('select')=='true'){
            $(this).attr('select','false')
            $(this).css('color','#3d4145');

        }
        else{
            $(this).attr('select','true')
            $(this).css('color','#27D3D2');

        }
        $('#addLabel div[select="true"]').each(function(){
            selectLabel.push($(this).attr('itemId'));
        });
        console.log(selectLabel);

    });

    //搜索
    $('#searchLabel').on('click','.bbqbiaoq',function(){
        /*if($(this).attr('select')=='true'){
            $(this).attr('select','false')
            $(this).css('color','#3d4145');
        }
        else{
            $(this).attr('select','true')
            $(this).css('color','#27D3D2');

        }*/
        if($(this).text()=='#全部'){
            labelId='';
        }
        else{
            labelId=$(this).attr('itemId');
        }

        $.closePopup();
        var bodyParam = {'USER_ID': user_id,'IS_SEE':tabIndex,'PAGE':1};
        if(tabIndex==1){
            listTalk(bodyParam,$('#tab1'),'refresh');
        }
        else if(tabIndex==0){
            listTalk(bodyParam,$('#tab2'),'refresh');
        }

    });
    $('#searchText').bind('search', function () {
        searchText=$(this).val();
        var bodyParam = {'USER_ID': user_id,'IS_SEE':tabIndex,'PAGE':1};
        if(tabIndex==1){
            listTalk(bodyParam,$('#tab1'),'refresh');
        }
        else if(tabIndex==0){
            listTalk(bodyParam,$('#tab2'),'refresh');
        }
        $.closePopup();

    });

    //隐藏新建弹窗
    $('body').on('click','.bbqguanb',function () {
        $.closePopup();
    });


    //新建弹窗
    $('#publish_text').on('click',function(){
        $("#uploaderInput").removeAttr("capture");
        //$("#uploaderInput").prop('capture','');
        $("#publishPop").popup();
        $('#bbqtanchide').click();
    });
    $('#publish_camera').on('click',function(){

        $("#uploaderInput").prop('capture','camera');
        $("#uploaderInput").click();
        $("#publishPop").popup();
        $('#bbqtanchide').click();
    });
    $('#publish_album').on('click',function(){
        $("#uploaderInput").removeAttr("capture");
        //$("#uploaderInput").prop('capture','');
        $("#uploaderInput").click();
        $("#publishPop").popup();
        $('#bbqtanchide').click();
    });

    //发布按钮
    $('body').on('click','#publish',function () {


        if($('#content').val()==''&&imageArray.length==0){
            $.toast("请输入内容或上传图片！", "text");
            return;
        }
        $('#publish').prop("disabled", true);
        $('#publish').css("color", "#999");
        //参数
        var bodyParam ={'USER_ID': user_id};
        if($('#is_see').prop('checked')){
            bodyParam['IS_SEE']='是';
        }
        else{
            bodyParam['IS_SEE']='否';
        }
        if($('#is_hide').prop('checked')){
            bodyParam['IS_HIDE']='是';
        }
        else{
            bodyParam['IS_HIDE']='否';
        }
        bodyParam['TALK_CONTENT']=$('#content').val();
        if(selectLabel.length>0){
            bodyParam['LABEL_IDS']=selectLabel.join(",");
        }

        if(imageArray.length>9){
            $.toast("最多只能上传9张图片！", "text");
        }
        else if(imageArray.length>0&&imageArray.length<=9){
            var formData = new FormData();

            if(imageArray.length==1){
                formData.append("image", imageArray[0]);
            }
            else{
                for(var o in imageArray){
                    formData.append("image[]", imageArray[o]);
                }
            }
            console.log(formData);

            $.ajax({
                type: "post",
                url: url +"uploadImg",
                //url: 'http://192.168.1.144/FileUS/filesUpload',
                data: formData,
                contentType: false, // 注意这里应设为false
                processData: false,    //false
                cache: false,    //缓存
                success: function(response){
                    var obj = JSON.parse(response);
                    var code = obj['Code'];
                    if(code=='1'){
                        var result = obj['Result'];
                        bodyParam['TALK_IMG']=result;
                        //新建
                        addTalk(bodyParam);
                    }
                    else{
                        $('#publish').prop("disabled", false);
                        $('#publish').css("color", "#27d3d2");
                        $.toast("上传文件失败！", "text");
                    }
                },
                error:function(response){

                    $('#publish').prop("disabled", false);
                    $('#publish').css("color", "#27d3d2");
                    $.toast("上传文件失败！", "text");
                }
            })
        }
        else if(imageArray.length==0){
            //新建
            addTalk(bodyParam);
            console.log(bodyParam);
        }

    });


    //item 点击
    $('body').on('click','.bbqlist',function(){
        window.location.href='post_details.html?id='+$(this).attr("itemId");
    });
    $('body').on('click','.bbqlistimg',function(e){
        if($(this).attr("itemId")!='0'){
            window.location.href='user_details.html?id='+$(this).attr("itemId");
        }
        e.stopPropagation();

    });
    $('body').on('click','.bbqindexbiaoq',function(e){

        var labelId=labels[$(this).text()];
        var labelName=$(this).text().replace("#","");

        if(tabIndex==1){
            window.location.href='search-more.html?sltype=firstSearch&searchText='+labelName+'&labelId='+labelId;
        }
        else if(tabIndex==0){
            window.location.href='search-more.html?sltype=secondSearch&searchText='+labelName+'&labelId='+labelId;
        }

        e.stopPropagation();

    });

    $('body').on('click','.bannerItem',function(){
        window.location.href='banner_details.html?id='+$(this).attr("itemId");
    });

});



/**
 * banner
 */
function listBanners(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxBanner', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);

        var data = obj['Result'];
        //防止后台返回null
        if(data==null){
            return;
        }
        var html='';

        for(j = 0,len=data.length; j < len; j++) {
            html+=' <li class="sw-slide bannerItem" itemId="'+data[j].ID+'">\n' +
                '   <img src="'+data[j].BANNER_IMG+'">\n' +
                '   </li>';
        }
        $('.sw-slides').html(html);
        $('#full_feature').swipeslider();
        $('#content_slider').swipeslider({
            transitionDuration: 600,
            autoPlayTimeout: 10000,
            sliderHeight: '300px'
        });
        $('#responsiveness').swipeslider();
        $('#customizability').swipeslider({
            transitionDuration: 1500,
            autoPlayTimeout: 4000,
            timingFunction: 'cubic-bezier(0.38, 0.96, 0.7, 0.07)',
            sliderHeight: '30%'
        });
    });

}

/**
 * 发布话题
 */
function addTalk(bodyParam) {
    var hrt = new HttpRequestTool(url + 'addTalk', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);

        var result = obj['Result'];

        $.toast("发布成功！", "text",function () {
            //$('#publishPop').html(addpopvalue.html());
            $('#publishPop').removeClass('weui-popup__container--visible');
            $('#publishPop').css('display','none');
            //$('.bbqfbtanc').hide();
            $('#content').val('');
            var file = $("#uploaderInput")
            file.after(file.clone().val(""));
            file.remove();
            //$('#uploaderInput').val('');
            imageArray=[];
            $('#is_see').prop('checked',false);
            $('#is_hide').prop('checked',false);

            $('#uploaderFiles').html('');
            selectLabel=[];
            $('#addLabel div').each(function(){
                $(this).attr('select','false')
                $(this).css('color','#3d4145');
            });


            //$.closePopup();
            $('#publish').prop("disabled", false);
            $('#publish').css("color", "#27d3d2");
            window.location.href='post_details.html?id='+result;
        });


    });
}

/**
 * 话题列表
 */
function listTalk(bodyParam,dom,refreshorload) {
    //var hrt = new HttpRequestRefreshTool(url + 'cxTalkList', 'post', 'text', true, false, bodyParam, 'callBack');

    if(searchText!=''){
        bodyParam['KEYBYTE']=searchText;
    }
    if(labelId!=''){
        bodyParam['LAB_ID']=labelId;
    }
    var hrt = new HttpRequestRefreshTool(url + 'cxTalkKeyBYTE', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);
        var data = obj['Result'];


        var html='';
        if(data.length==0&&refreshorload=='load'){
            if($(dom).attr('id')=='tab1'){
                loadingtab1 = true;
            }
            else if($(dom).attr('id')=='tab2'){
                loadingtab2 = true;
            }

            $(dom).find(".weui-loadmore").show();
            $(dom).find(".weui-loadmore").html('<span class="weui-loadmore__tips">已无更多数据</span>');
        }
        else{
            for(var j = 0,len=data.length; j < len; j++) {

                var userid='0';
                if(data[j].IS_HIDE=='否'){
                    userid= data[j].TALK_USER_ID;
                }

                if(data[j].IS_HIDE=='是'||data[j].I_UPIMG==null){
                    if(data[j].IS_HIDE=='是'){

                    }
                    else{

                    }
                    html+='<li class="bbqlist" onclick="" itemId="'+data[j].ID+'">\n' +
                        '<div class="bbqlistimg" onclick="" itemId="'+userid+'">\n' +
                        '<img src="images/9f10f09c24c4611808bcccd9b5302a3.jpg">\n' +
                        '</div>\n' ;
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

                if($(dom).attr('id')=='tab2'){
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

                            html+='<a class="listimgs lazy-load"  itemId="'+data[j].ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'" style="background-image: url('+contentImages[i]+');" href="'+contentImages[i]+'" >\n' +
                                '</a>\n' ;
                            /*html+='<a class="listimgs lazy-load"  itemId="'+data[j].ID+'" content="'+data[j].TALK_CONTENT+'" good="'+data[j].GOOD_COUNT+
                                '" replay="'+data[j].REPLAYCOUNT+'" like="'+data[j].GOOD+'"  href="'+contentImages[i]+'" >\n' +
                                '<img class="lazy" data-original="'+contentImages[i]+'">'+
                                '</a>\n' ;*/

                        }

                    }
                    html+='</div>\n' ;
                }

                var labels=data[j].LABEL_NAME;
                if(labels!=null){
                    var labelArr=labels.split(",");
                    if(labelArr.length>0){
                        for(var i = 0,labellen=labelArr.length; i< labellen;i++) {

                            html+='<p class="bbqindexbiaoq" onclick="" >#'+labelArr[i]+'</p>\n' ;

                        }

                    }
                }

                html+='<div class="bbqbuttonthree posire">\n';
                if(data[j].GOOD!=null&&data[j].GOOD=='已赞'){
                    html+='<div class="heart hearttalk heartAnimation" itemId="'+data[j].ID+'" rel="unlike" style=""></div>';
                }
                else{
                    html+='<div class="heart hearttalk" itemId="'+data[j].ID+'" rel="like"></div>\n';
                }

                html+='<span class="bbqbuttonspan likespan" >'+data[j].GOOD_COUNT+'</span>\n' +
                    '<span class="locationpl">\n' +
                    '<img src="images/pinglun-icon.png" class="commentImg" onclick=""/>\n' +
                    '<span class="bbqbuttonspan">'+data[j].REPLAYCOUNT+'</span>\n' +
                    '</span>\n' +
                    '<img class="fr bbqgengdtc" onclick="" itemId="'+data[j].ID+'" src="images/gengduo.png" />\n' +
                    '</div>\n' +
                    '</div>\n' ;
                if(data[j].HOTOR!=null&&data[j].HOTOR=='1'){
                    html+='<div class="bbqremen"><img src="images/remen.png"></div>\n';
                }
                html+='</li>';
            }

            if(refreshorload=='refresh'){
                $(dom).find(".bbqul").html(html);
                $(dom).pullToRefreshDone();

            }
            else if(refreshorload=='load'){
                $(dom).find(".bbqul").append(html);
                $(dom).find(".weui-loadmore").hide();
            }
            loading = false;
        }

        var listimgs = $('.listimgs').width()==0?100: $('.listimgs').width();
        $('.listimgs').height(listimgs);
        $('.lazy-load').height(listimgs);


        //$("img.lazy").lazyload({effect: "fadeIn"});
        baguetteBox.run('.baguetteBoxOne');



    });
}


/**
 * 标签列表
 */
function listLabel(bodyParam) {
    var hrt = new HttpRequestTool(url + 'cxTalkLab', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        console.log('Label:'+response);
        var obj = JSON.parse(response);
        var data = obj['Result'];
        var html='';
        for(var j = 0,len=data.length; j < len; j++) {
            labels["#"+data[j].LABEL_NAME]=data[j].ID;
            html+=' <div class="bbqbiaoq" onclick="" itemId="'+data[j].ID+'" select="false">'+data[j].LABEL_NAME+'</div>';
            // htmlsearch+='<div class="bbqbiaoq"  itemId="'+data[j].ID+'" select="false">#'+data[j].LABEL_NAME+'</div>';
        }
        $('#addLabel').html(html);
        //$('#searchLabel').html(htmlsearch);


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

/**
 * 用户信息
 */
function getUserInfo(bodyParam) {
    var hrt = new HttpRequestTool(url + 'getUser', 'post', 'text', true, false, bodyParam, 'callBack');
    hrt.HttpRequest(function (response) {
        var obj = JSON.parse(response);

        var data = obj['Result'];
        if(data!=null){
            //缓存
            user_name=data.NICKNAME;
            localStorage.setItem('user_name',user_name);


            if(data.type=='校园生活'){
                $('#goback').css('visibility','hidden');
            }
            else{

                $('#goback').css('visibility','visible');
            }
        }
    });
}