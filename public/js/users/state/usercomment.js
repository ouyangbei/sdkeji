jQuery(document).ready(function($) {
	isFollow(userId,function(result){
		if(result.code){

		}else{
			if(result.resultBoolean == true){
				$('.follow').attr("onclick", "cancelFollow('"+userId+"')").html('取消关注');
			}
		}
	})
	getToMyCommen(1, function(err, results){
		var datas = {
			users   : '1',
			results : results.page.list
		}
		if(results.resultCode != '0'){
			return;
		}
		var html  = new EJS({ url:'/views/state/comment.ejs' }).render(datas);
		$('#states').append(html);
		initList();
	})
});
var page = 1;
var userId = getUserId("id"); 
function initList(){
	var data={
		userId:userId,
		page : 1,
		pageSize:12
	}
	$.ajax({
		url: '/user/stateComment',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.page.totalPage > 1 ){
			$(".tcdPageCode").createPage({
		        pageCount:result.page.totalPage,
		        current:1,
		        backFn:function(p){
		        	var loadings = '<div class="loadings">'+loadingDot+'</div>'
		        	$('#states').empty().html(loadings);
		            getToMyCommen(p, function(err, results){
						var datas = {
							users   : '1',
							results : results.page.list
						}
						if(results.resultCode != '0'){
							return;
						}
						var html  = new EJS({ url:'/views/state/comment.ejs' }).render(datas);
						$('#states').empty().append(html);
					})
		        }
		    });
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

//获取对我的评论列表
function getToMyCommen(page_,callback){
	var data={
		userId:userId,
		page : page_,
		pageSize:12
	}
	$.ajax({
		url: '/user/stateComment',
		type: 'POST',
		data: data
	})
	.done(function(result) {

		if(result.resultCode == '0')
		return callback(null,result);
		else 
		return callback(result, null);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

