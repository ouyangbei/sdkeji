
var userId = getUrl();
jQuery(document).ready(function($) {
	getArticleList();
	isFollow(userId,function(result){
		if(result.code){

		}else{
			if(result.resultBoolean == true){
				$('.follow').attr("onclick", "cancelFollow('"+userId+"')").html('取消关注');
			}
		}
	})
});
var page = 1;

function getArticleList(){
	var data = {
			userId:userId,
			page : 1,
			pageSize : 12
		}
		$.ajax({
			url: '/article/getUserArticles',
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
		userId:userId,
		page : page,
		pageSize : pageSize
	}
	$.ajax({
		url: '/article/getUserArticles',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var data = {
				usersInfo: '1',
				articles : result.page.list
			}
			var html = new EJS({ url : "/views/articles/userCenterArticleList.ejs"}).render(data);
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


