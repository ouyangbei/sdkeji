function scrollStop(){var o=getScrollTop();o > 100?$('#usermessage').css({'position':'fixed','right':'auto','margin-left':'890px','top':'55px'}):$('#usermessage').css({'position':'absolute','right':'0px','margin-left':'0px','top':'25px'});o>=70?scrollHoad():cancelScrollHoad(),o>=100?fadeInScroll():fadeOutScroll()}function getScrollTop(){return $(document).scrollTop()}function share(o,t,e){location.href="/share/"+t}function getTopicList(o){$.ajax({url:"/article/getTopics",type:"POST",data:{param1:"value1"}}).done(function(t){if(topicList=t.topics,"0"==t.resultCode){var e={topics:t.topics,topicid:o},n=new EJS({url:BaseUrl+"views/articles/homePageTopiclist.ejs"}).render(e);}}).fail(function(){console.log("error")}).always(function(){console.log("complete")})}function process_to_zero(){$(".process_container").css("display","block"),$("#process").css("width","0%"),$("#percent").html("0%")}function onprogress(o){var t=o.loaded,e=o.total,n=Math.floor(100*t/e);n<100?($("#percent").html("50%"),$("#process").css("width","50%")):($("#process").css("width","80%"),$("#percent").html("80%"))}function wordnum(o){var t=(o.match(/[a-z]+|[\u4E00-\uFA29]/gi)||[]).length;return t}function delete_more_text(o,t,e){t=t.substring(0,e),$(o).val(t)}function strExchange(o){var t=o.replace(/["“”]/gi,'"');return t}function getQueryString(o){var t=new RegExp("(^|&)"+o+"=([^&]*)(&|$)","i"),e=window.location.search.substr(1).match(t);return null!=e?unescape(e[2]):null}function getUrl(){var o=window.location.href.split("/"),t=o.length; var string_ = o[t-1].split('?');return string_[0]}function getUserMessage(o,t){var e={personInfoId:o};$.ajax({url:"/user/personInfo",type:"POST",data:e}).done(function(o){return"0"==o.resultCode?t(null,o):t("err",null)}).fail(function(){console.log("error")}).always(function(){console.log("complete")})}function pleaseLogin(){message("请登录")}function stopevent(){var o=arguments.callee.caller.arguments[0]||event;o&&o.stopPropagation?o.stopPropagation():window.event&&(window.event.cancelBubble=!0)}function scrolltoTop(){$("html,body").animate({scrollTop:"0px"},300),$("#scroll").css({bottom:"-70px"})}function fadeInScroll(){$("#scroll").css({bottom:"30px"})}function fadeOutScroll(){$("#scroll").css({bottom:"-70px"})}function resize(){var o=$(window).height();$("#main_container").css("min-height",o-225+"px")}var BaseUrl="http://"+window.location.host+"/";jQuery(document).ready(function(o){window.onscroll=function(){scrollStop()}}),resize(),$("body").on("click","#process_close",function(){$(".process_container").fadeOut("fast")}),$("body").on("click","#u_mes > div ",function(o){o.preventDefault(),$("#edit_log").toggle("fast");$('.mainSearchChoose').fadeOut('fast');$('.search_type_choose').fadeOut('fast');setTimeout(searchOverflowTure,200);stopevent();}),$("body").on("click","#login",function(o){o.preventDefault(),location.href="/login"}),$("body").on("click","#register",function(o){o.preventDefault(),location.href="/register"}),$("body").on("click","#logout",function(o){o.preventDefault(),$.ajax({url:"/user/logout",type:"POST",data:{param1:"value1"}}).done(function(o){location.href='/'}).fail(function(){console.log("error")}).always(function(){console.log("complete")})}),$("body").on("click",".art_",function(o){o.preventDefault();var t=$(this).attr("id");location.href="/top?id="+t}),$("body").on("keydown","textarea",function(o){if(9==o.keyCode){o.preventDefault();var t="    ",e=this.selectionStart,n=this.selectionEnd,r=window.getSelection().toString();r=t+r.replace(/\n/g,"\n"+t),this.value=this.value.substring(0,e)+r+this.value.substring(n),this.setSelectionRange(e+t.length,e+r.length)}}),$("#scroll").hover(function(){$(this).find("img").attr("src",BaseUrl+"img/scrollred.png")},function(){$(this).find("img").attr("src",BaseUrl+"img/scroll.png")});
var searchContent;
var searchType = 'search_article';//搜索类型初始化
var searchLock = false;  //是否允许搜索

//滚动条超过70则保持不动
function scrollHoad(){
	$(".headerbottom").css({position:"fixed",top:"0px"});
	$('.search').addClass('searchHoad');
}
//取消保持不动
function cancelScrollHoad(){
	$(".headerbottom").css({position:"relative"});
	$('.search').removeClass('searchHoad');
}
$('body').on('click', '.search_type_choose > div', function(event) {
	event.preventDefault();
	var id = $(this).attr('id');
	searchType = id;
	var html = $(this).html();
	$('.check_area > span').html(html);
});
$('body').on('click',function(event){
	$('.mainSearchChoose').fadeOut('fast');
	$('.search_type_choose').fadeOut('fast');
	$('#edit_log').fadeOut();
	var searchTypeChoosedisplay = $('.search_type_choose').css('display');
	if(searchTypeChoosedisplay == 'block'){
		setTimeout(searchOverflowTure,200);
	}else{
		searchOverflowTure();
	}
})

$('body').on('click', '.check_area', function(event) {
	event.preventDefault();
	$('.search_type_choose').toggle('fast');
	stopevent();
});

$('body').on('click', '.input_area', function(event) {
	event.preventDefault();
	stopevent();
});



$('body').on('click', '.search_area', function(event) {
	event.preventDefault();
	$('#edit_log').fadeOut('fast');
	$('.mainSearchChoose').fadeOut('fast');
	if(searchLock == false ){
		$('.search').css('overflow','');
		$('.search_con').addClass('search_focus');
		setTimeout(searchOverflowFalse,200);
	}else{
		searchContent = $('#search_content').val();
		if(!searchContent){
			// message('请输入搜索内容');
			// stopevent();
			// return;
			searchContent = '写作';
		}
		if(searchType == 'search_by_user'){
			location.href="/search_user/"+searchContent;
		}else{
			location.href="/search_article/"+searchContent;
		}
	}
	stopevent();
});

//处理searchoverfloe的问题
function searchOverflowFalse(){
	searchLock = true;
	$('.search').css({'overflow':'visible'});
	
}

//处理searchoverfloe的问题
function searchOverflowTure(){
	searchLock = false;
	$('.search').css('overflow','hidden');
	$('.search_con').removeClass('search_focus');
}

$('body').on('click','.mainSearchTitleContainer',function(event){
	event.preventDefault();
	$('#edit_log').fadeOut();
	setTimeout(searchOverflowTure,200);
	$('.mainSearchChoose').toggle('fast');
	stopevent();
})
$('body').on('click','.hdt_cont>img',function(event){
	event.preventDefault();
	location.href="/";
})
var mainSearchType;
$('body').on('click','.mainSearchChoose > div',function(event){
	event = event || window.event;
	event.preventDefault();
	$('#edit_log').fadeOut();
	setTimeout(searchOverflowTure,200);
	var id = $(this).attr('id');
	mainSearchType = id;
	var html = $(this).html();
	$('.marinSearchUser').html(html);
})

$('body').on('click', '.state_menu > div', function(event) {
	event.preventDefault();
	var id = $(this).attr('id');
	location.href = id;
});
$('.search_area').hover(function() {
	$(this).children('img').attr('src','/img/search_blue.png')
}, function() {
	$(this).children('img').attr('src','/img/search_white.png')
});

$('body').keydown(function(event) {
	if(event.keyCode == 13){
		var hasFocus = $('#search_content').is(':focus');
		if(hasFocus == true){
			searchContent = $('#search_content').val();
			if(!searchContent){
				// message('请输入搜索内容');
				// stopevent();
				// return;
				searchContent = '写作';
			}
			if(searchType == 'search_by_user'){
				location.href="/search_user/"+searchContent;
			}else{
				location.href="/search_article/"+searchContent;
			}
		}
	}
});



function getUrl_(){
	var url = window.location.href.split('/');
	var urllenght = url.length;
	return url[urllenght-1];
}

var loadingDot = '<div class="ob_dot loadmember">'+
                       '<div class="ob_dot_first"></div>'+
                        '<div class="ob_dot_second"></div>'+
                        '<div class="ob_dot_third"></div>'+
                    '</div>';
