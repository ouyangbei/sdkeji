jQuery(document).ready(function($) {
	getToMyCommen(1, function(err, results){
		var datas = {
			users   : '0',
			results : results.page.list
		}
		if(results.resultCode != '0'){
			return;
		}
		var html  = new EJS({ url:'/views/state/great.ejs' }).render(datas);
		$('#states').append(html);
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
		url: '/user/stateGreat',
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
							users   : '0',
							results : results.page.list
						}
						if(results.resultCode != '0'){
							return;
						}
						var html  = new EJS({ url:'/views/state/great.ejs' }).render(datas);
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

//获取对我的收藏列表
function getToMyCommen(page,callback){
	var data={
		page : page,
		pageSize:12
	}
	$.ajax({
		url: '/user/stateGreat',
		type: 'POST',
		data: data
	})
	.done(function(result) {
				console.log(result);
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

