jQuery(document).ready(function($) {
	var url = getUrl();
	if(url == 'user'){
		getArticleList();
	}
});
function getArticleList(){
	var data = {
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
				usersInfo:'1',
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

function editArt(obj){
	location.href =	'edit?id='+obj;
}

function deleteArt(obj){
	deleted("您确认要删除吗？","deleteReal('"+obj+"')");
	stopevent();
}

function deleteReal(obj){
	var data = {
		articleid : obj
	}
	$.ajax({
		url: '/article/deleteArticle',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode != '0'){
			message('会话已过期！请重新登陆')
		}else{
			$('#'+obj+'').remove(); 
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
