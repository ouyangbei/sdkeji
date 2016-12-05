
var title  = getUrl_();
//文章页数
var page = 1;
mainSearchType = "mainSearch_by_user";
jQuery(document).ready(function($) {
	$('#marinSearchTitle').val(decodeURI(title));
	$('.marinSearchUser').html('用户');
});

//获取文章下一页
function moreFollowList(){
	$('#more_art').html('正在加载...');
	page = page + 1;
	UserList();
}

//获取用户列表
function UserList(){
	var data = {
		userName : title,
		pageCurrent    : page,
		pageSize: 6
	}
	$.ajax({
		url: '/user/userSearch',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var data = {
				users : result.page.list,
			}
			if( result.page.totalPage > 1){		
				if(result.page.list.length > 0){
					var html = new EJS({url: '/views/user/followlist.ejs'}).render(data);
					$('#followlist').append(html);
					if(result.page.lastPage == true){
						$('#more_art').remove();
					}
					else{
						$('#more_art').fadeIn('fast').html('加载更多');
					}
				}else {
					$('#more_art').remove();
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

function follow(obj,this_){
	var data = {
		toUser : obj
	}
	$.ajax({
		url: '/user/follow',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var followerCount = $(this_).parent('.isfolles').siblings('.user_messge').find('.user_message_follower').html();
			$(this_).parent('.isfolles').siblings('.user_messge').find('.user_message_follower').html(parseInt(followerCount)+1);
			$(this_).attr({
				'class':'alreadyfollow',
				'onclick':"cancelFollow('"+obj+"',this)"
			}).html('已关注');
		}else{
			message_login();
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

function cancelFollow(obj,this_){
	currentCancel = this_; 
	deleted("您确定要取消关注吗","cancelReal('"+obj+"')");
}

$('body').on('mouseout', '.alreadyfollow', function(event) {
	event.preventDefault();
	$(this).html('已关注');
});
$('body').on('mouseover', '.alreadyfollow', function(event) {
	event.preventDefault();
	$(this).html('取消关注');
});

function cancelReal(obj,this_){
	var data = {
		toUser : obj
	}
	$.ajax({
		url: '/user/cancelFollow',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var followerCount = $(currentCancel).parent('.isfolles').siblings('.user_messge').find('.user_message_follower').html();
			$(currentCancel).parent('.isfolles').siblings('.user_messge').find('.user_message_follower').html(parseInt(followerCount)-1);
			$(currentCancel).attr({
				'class':'notfollow',
				'onclick':"follow('"+obj+"',this)"
			}).html('+关注');
		}else{
			message_login();
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
		message('请输入搜索内容');
		stopevent();
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
