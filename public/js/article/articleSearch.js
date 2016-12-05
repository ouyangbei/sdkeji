var title  = getUrl_();
title = decodeURI(title);
var topicList = [];
	mainSearchType = "mainSearch_by_article";
$("img.lazy").lazyload();
jQuery(document).ready(function($) {
	getTopicList();
	$('#marinSearchTitle').val(decodeURI(title));
	$('.marinSearchUser').html('内容');
});

//文章页数
var page = 1;

//获取文章下一页
function moreArticleList(){
	$('#more_art').html('正在加载...');
	page = page + 1;
	ArticleList();
}

//获取文章列表
function ArticleList(){
	var data = {
		title : title,
		page : page,
		pageSize: 12
	}
	$.ajax({
		url: '/article/getArticles',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		console.log(topicList);
		if(result.resultCode == '0'){
			var data = {
				articles : result.page.list,
				topicList :topicList
			}
			if( result.page.totalPage >= 1){
				if(result.page.list.length > 0){
					var html = new EJS({url: '/views/articles/topicArticleList'}).render(data);
					$('#articles').append(html);
					$("img.lazy").lazyload();
					$('#more_art').fadeIn('fast').html('加载更多');
					if(result.page.lastPage == true){
						$('#more_art').html('沒有更多').attr('onclick','none()').remove();
					}
				}else{
					$('#more_art').html('沒有更多').attr('onclick','none()').remove();
					return;
				}	
			}else{
				$('#more_art').remove();
			}	
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}



function mainSearch(){
	var title = $('#marinSearchTitle').val();
	if(!title){
		return;
	}
	else{
		if(mainSearchType =='mainSearch_by_article'){
			location.href = "/search_article/"+title;
		}else{
			location.href = "/search_user/"+title;
		}		
	}
}

$('body').keydown(function(event) {
	if(event.keyCode == 13){
	var hasFocus_ = $('#marinSearchTitle').is(':focus');
		if(hasFocus_ == true){
			mainSearch();
		}
	}	
});
