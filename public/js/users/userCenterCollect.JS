
jQuery(document).ready(function($) {
	getArticleList();
});

function getArticleList(){
	var data = {
			pageCurrent : 1,
			pageSize : 12
		}
		$.ajax({
			url: '/article/collectList',
			type: 'POST',
			data: data
		})
		.done(function(result) {
			if(result.resultCode == '0'){
				if(result.page.totalPage > 1){
					$('#more_art').fadeIn('fast').html('加载更多')
					$(".tcdPageCode").createPage({
				        pageCount:result.page.totalPage,
				        current:1,
				        backFn:function(p){
				            getMyArticle(p, 12);
				        }
			    	});
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
function getMyArticle(page, pageSize){
	var data = {
		pageCurrent : page,
		pageSize : pageSize
	}
	$.ajax({
		url: '/article/collectList',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var data = {
				articles : result.page.list
			}
			var html = new EJS({ url : "/views/articles/userCenterCollectArticleList.ejs"}).render(data);
			$('#articles').empty().append(html);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

$('body').on('click', '#user_menu > div', function(event){
     $(this).addClass('active');
     var id = $(this).attr('id');
     location.href = id; 
     $(this).siblings('div').removeClass('active');
})
