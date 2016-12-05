var topicList = [];
$("img.lazy").lazyload();
jQuery(document).ready(function($) {
	setTimeout('Circulation_timeinterval()', 1000);
	$('body').on('click', '.foc_list > img', function(event) {
		event.preventDefault();
		var index = $('.foc_list > img').index(this);
		timeout = true;
		Circulation(index);
		setTimeout(Reload_Circulation, 1000);
	});

	getCirculArt();
	// getTopicList('1');
});

//文章页数
var page = 1;

//首页轮播图
var Curpage = 0;
var timeout = false; //启动及关闭按钮  
function Circulation (index){
	$('.foc_img').css({
		'transition': '0.5s',
		'marginTop' : -index * 370 + 'px'
	});
}
function Reload_Circulation(){
	timeout = false;
}
function Circulation_timeinterval() {  
  if(timeout) {
  	setTimeout("Circulation_timeinterval()",10000);
  }else{
  	Curpage = Curpage + 1;
    if( Curpage == 3){ Curpage = 0 };
    Circulation(Curpage);  
    setTimeout("Circulation_timeinterval()",10000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
  } 
}  
// 获取首页大图
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
				topics : result.page.list
			}
			var html = new EJS({url: '/views/articles/circulTopics.ejs'}).render(data);
			var html2 = new EJS({url: '/views/articles/circulTopicTinyImg.ejs'}).render(data);
			$('.foc_img').empty().html(html);
			$('.foc_list').empty().html(html2);
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
	$('#more_art').html('正在加载...');
	page = page + 1;
	ArticleList();
}
//获取首页文章列表
function ArticleList(){
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
		console.log(result);
		if(result.resultCode == '0'){
			if((result.page.totalPage <= 1) || (result.page.lastPage == true)){
				$('#more_art').remove();
			}else{
				$('#more_art').fadeIn('fast').html('加载更多');
			}
			var data = {
				articles  : result.page.list,
				topicList : topicList
			}
			var html = new EJS({url: '/views/articles/articleList.ejs'}).render(data);
			$('#articles').append(html);
			$("img.lazy").lazyload();
			$('#more_art').html('加载更多');
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
$('body').on('click', '.foc_img > img ', function(){
      var id = $(this).attr('id');
      window.open('/top/'+id,'_blank');})
$('body').on('hover', '.article', function(){
	alert(1);
	$(this).find('.art_user_mess').css('border-bottom','0px')
})