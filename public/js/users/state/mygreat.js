jQuery(document).ready(function($) {
	getMyGreat(1, function(err, results){
		var datas = {
			users   : '0',
			results : results.page.list
		}
		if(results.resultCode != '0'){
			return;
		}
		var html  = new EJS({ url:'/views/state/mygreat.ejs' }).render(datas);
		$('#states').empty().append(html);
		initList();
	})
});
var page = 1;

function initList(){
	var data={
		page : 1,
		pageSize:12
	}
	$.ajax({
		url: '/user/myGreat',
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
		            getMyGreat(p, function(err, results){
						var datas = {
							users   : '0',
							results : results.page.list
						}
						if(results.resultCode != '0'){
							return;
						}
						var html  = new EJS({ url:'/views/state/mygreat.ejs' }).render(datas);
						$('#states').empty().append(html)
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
function getMyGreat(page,callback){
	var data={
		page : page,
		pageSize:12
	}
	$.ajax({
		url: '/user/myGreat',
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

