var topic_id  = getUrl();
var topicList = [];
$("img.lazy").lazyload();
jQuery(document).ready(function($) {
	getTopicList(topic_id);
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
		topicId : topic_id,
		state   : '0',
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
			var data = {
				articles : result.page.list,
				topicList :topicList
			}
			if( result.page.totalPage > 1){
				if(result.page.list.length > 0){
					$('#more_art').fadeIn('fast').html('加载更多');
					if(result.page.lastPage == true){
						$('#more_art').remove();
					}
				}else{
					$('#more_art').html('沒有更多').attr('onclick','none()').remove();
					return;
				}	
			}else{
				$('#more_art').remove();
			}
			var html = new EJS({url: '/views/articles/topicArticleList.ejs'}).render(data);
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
