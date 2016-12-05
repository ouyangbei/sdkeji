var BaseUrl = 'http://'+window.location.host+'/';
var topic_id = getUrl();
var topicList = [];
var pagemore  = true; 
var page = 1;
$("img.lazy").lazyload();
jQuery(document).ready(function($) {
	getTopicList(topic_id);
	topicLabelAction('menu');
	window.onscroll = function(){ 
		var scrollTop = $(this).scrollTop();
	　　var scrollHeight = $(document).height();
	　　var windowHeight = $(this).height();
	　　if(scrollTop + windowHeight > scrollHeight-150){
	　　　　moreArticleList();
	　　}	
	}
});
//获取分类列表
function getTopicList(topic_id){
	$.ajax({
		url: '/article/getTopics',
		type: 'POST',
		data: {param1: 'value1'},
	})
	.done(function(result) {
		topicList = result.topics;
		if(result.resultCode == "0"){
			var data = {
				topics : result.topics,
				topicid: topic_id,
				BaseUrl: BaseUrl
			}
			var html = new EJS({url: '/views/phone/homePageTopiclist.ejs'}).render(data);
			$('#menu').append(html);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

//选题标签栏交互
function topicLabelAction(obj){
	var touchMoveLabX=0;
	var touchMoveLabY=0;
	var touchStartLabX=0;
	var touchEndLabX=0;
	var touchStartLabY=0;
	var touchEndLabY=0;
	var slideLabX=0;
	var labWidth=parseInt($("#"+obj).width());
	var move=0;
	var left=-(labWidth-600);
	$("body").on('touchstart', '#'+obj, function(event) {
		/* Act on the event */
		touchStartLabX=event.originalEvent.targetTouches[0].pageX;
		
		touchStartLabY=event.originalEvent.targetTouches[0].pageY;
		touchMoveLabX=0;
	});
	$("body").on('touchmove', '#'+obj, function(event) {
				/* Act on the event */
		var touchEndLabX=event.originalEvent.targetTouches[0].pageX;
		touchEndLabY=event.originalEvent.targetTouches[0].pageY;
		touchMoveLabX=touchEndLabX-touchStartLabX;
		touchMoveLabY=touchEndLabY-touchStartLabY;
		if(Math.abs(touchMoveLabX)>Math.abs(touchMoveLabY)){
			event.preventDefault();
			move=slideLabX+touchMoveLabX;
			if(move>0){
				move=0;
				$(".left-shadow").css({
					display: 'none',
				});	
				$(".right-shadow").css({
					display: 'block',
				});					
			}
			else if(move<=left){
				move=left;
				$(".left-shadow").css({
					display: 'block',
				});	
				$(".right-shadow").css({
					display: 'none',
				});	
			}
			else{
				$(".left-shadow").css({
					display: 'block',
				});	
				$(".right-shadow").css({
					display: 'block',
				});	
			}
			$("#"+obj).css({
				'transform-style': 'preserve-3d',
				'-webkit-backface-visibility':'hidden',
				'transition': '300ms ease-out',
				'transform': 'translateX('+move+'px) translateZ(0px)',
			});	
		}
	});
	$("body").on('touchend', '#'+obj, function(event) {
		// event.preventDefault();
		slideLabX=move;
	});	
}

//点击大图
$('body').on('click', '.foc_img > .item > img ', function(){
      var id = $(this).attr('id');
      location.href='/top/'+id;
})
function share(obj,id,name){
	 location.href="/share/"+id;
}
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function homePhone(){
	location.href="/";
}

//获取文章下一页
function moreArticleList(){
	if(pagemore == true){
		page = page + 1;
		ArticleList();
	}	
}

//获取首页文章列表
function ArticleList(){
	pagemore = false;
	$('.loading').css('display','block');
	var data = {
		state   : '0',
		topicId : topic_id,
		page    : page,
		pageSize: 12
	}
	$.ajax({
		url: '/article/getArticles',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			if((result.page.totalPage <= 1) || (result.page.lastPage == true)){
				$('.loading').css('display','none');
				$('.footer').css('display', 'block');
				return ; 
			}else{
				pagemore = true;
			}
			var data = {
				articles  : result.page.list,
				topicList : topicList,
				BaseUrl   : BaseUrl
			}
			var html = new EJS({url: '/views/phone/articleList.ejs'}).render(data);
			$('#articles').append(html);
			$("img.lazy").lazyload();
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
function getUrl(){
	var url = window.location.href.split('/');
	var urllenght = url.length;
	return url[urllenght-1];
}
