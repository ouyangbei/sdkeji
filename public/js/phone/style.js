var BaseUrl = 'http://'+window.location.host+'/';
$("img.lazy").lazyload();
jQuery(document).ready(function($) {
	topicLabelAction("menu");
	DY_scroll('#focus','.left_shadow','.right_shadow','.foc_img',5,true);// true为自动播放，不加此参数或false就默认不自动 
	$('.item > img').click(function(event) {
		location.href="/";
	});
	window.onscroll = function(){ 
		var scrollTop = $(this).scrollTop();
	　　var scrollHeight = $(document).height();
	　　var windowHeight = $(this).height();
	　　if(scrollTop + windowHeight > scrollHeight-150){
	　　　　moreArticleList();
	　　}	
	}
	getCirculArt();
	getTopicList('1');
});
var circount=0;
var topicList=[];
var page = 1;
var pagemore = true;
var touchEndX;
var touchStartX;
var touchEndY;
var touchStartY;
var touchMoveX;
var slideX = 0;
var flag = "left"; 
function DY_scroll(wraper,prev,next,img,speed,or){ 
	var wraper = $(wraper); 
	var prev = $(prev); 
	var next = $(next); 
	var img = $('.foc_img');
	var w = img.find('.item').outerWidth(true); 
	var s = speed; 
		next.click(function(event){ 
			img.animate({'margin-left':-w},function(){ 
			img.find('.item').eq(0).appendTo(img); 
			img.css({'margin-left':0}); 
			}); 
			flag = "left"; 
		}); 
		prev.click(function(event){ 
			img.find('.item:last').prependTo(img); 
			img.css({'margin-left':-w}); 
			img.animate({'margin-left':0}); 
			flag = "right"; 
		}); 
		if (or == true){ 
			ad = setInterval(function() { circount = circount+1; if(circount == 3){circount = 0};cirimg(circount); flag == "left" ? next.click() : prev.click()},s*1000); 
			wraper.hover(function(){clearInterval(ad);},function(){ad = setInterval(function() {circount = circount+1; if(circount == 3){circount = 0};cirimg(circount);flag == "left" ? next.click() : prev.click()},s*1000);}); 
		}
		$("body").on('touchstart', '.slide', function(event) {
		clearInterval(ad);
	    touchStartX = parseInt(event.originalEvent.targetTouches[0].pageX);
	    touchStartY = parseInt(event.originalEvent.targetTouches[0].pageY);	
	});	
	$("body").on('touchmove', '.slide', function(event) {
        touchEndX = parseInt(event.originalEvent.targetTouches[0].pageX);
        touchEndY = parseInt(event.originalEvent.targetTouches[0].pageY);
        touchMoveX=touchEndX-touchStartX;
        touchMoveY=touchEndY-touchStartY;
        if(Math.abs(touchMoveX)>=Math.abs(touchMoveY)){
        	event.preventDefault();        
        }
	});
	$("body").on('touchend', '.slide', function(event) {
		if(Math.abs(touchMoveX)>100){
			if(touchMoveX<-50){
				slideX=slideX-620;
				circount = circount+1; if(circount == 3){circount = 0};
				next.click();		
			}
			else if(touchMoveX>50){
				slideX=slideX+620;
				circount = circount-1; if(circount == -1){circount = 2};
				prev.click();
			}	
		}
		cirimg(circount);
		setTimeout(function() {ad = setInterval(function() {circount = circount+1; if(circount == 3){circount = 0};cirimg(circount);flag == "left" ? next.click() : prev.click()},s*1000);}, 5000);
		
	}); 
	} 
function cirimg(count){
	$('.foc_list > img').eq(2-count).attr('src','img/phone/circlered.png')
	$('.foc_list > img').eq(2-count).siblings('img').attr('src','img/phone/circle.png');
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
//获取首页大图
function getCirculArt(){
	var data = {
		topicId : '1',
		pageSize: 3,
		page    : 1
	}
	$.ajax({
		url: '/article/getArticles',
		type: 'POST',
		data: data,
	})
	.done(function(result) {
		if(result.resultCode == "0"){
			var data = {
				topics : result.page.list,
				BaseUrl: BaseUrl
			}
			var html = new EJS({url: '/views/phone/circulTopics.ejs'}).render(data);
			$('.foc_img').empty().html(html);
		}else{
			getCirculArt();
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

//获取文章下一页
function moreArticleList(){
	if(pagemore == true){
		page = page + 1;
		ArticleList();
	}	
}

//获取分类列表
function getTopicList(topicid){
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
				topicid: topicid
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
//点击大图
$('body').on('click', '.foc_img > .item > img ', function(){
      var id = $(this).attr('id');
      location.href='/top/'+id;
})
function share(obj,id,name){
	 location.href="/share/"+id;
}

//获取首页文章列表
function ArticleList(){
	pagemore = false;
	$('.loading').css('display','block');
	var data = {
		state   : 1,
		page    : page,
		pageSize: 9
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
		}
		var html = new EJS({url: '/views/phone/articleList.ejs'}).render(data);
			$('#articles').append(html);
			$("img.lazy").lazyload();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

