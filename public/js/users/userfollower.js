resize();
var userid = getUrl();
jQuery(document).ready(function($) {
	getUserMessage(userid, function(err, result){
	if(err){

	}
	else{
		var personInfo = JSON.parse(result.personInfo);
		$('.fol_userHead').attr('src', personInfo.icon);
		$('.fol_userName').html(personInfo.nick_name);
		$('.fol_userMessage').fadeIn('fast');
	}
	})	
});
var page = 1;

//更多用户
function moreFollowList(){
	page = page + 1;
	var data = {
		userId:userid,
        pageCurrent:page,
        pageSize:6,
	}
	$.ajax({
		url: '/user/followerList',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		var users = result.page.list;
		if(result.page.list.length <= 0 || result.page.lastPage == true){
			$('#more_art').remove();
			// return;
		}
		var data = {
			users : users
		}
		var html = new EJS({ url : "/views/user/followlist.ejs"}).render(data);
			$('#followlist').append(html);
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
			message_login('请登录')
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
var currentCancel;
function cancelFollow(obj,this_){
	currentCancel = this_; 
	deleted("您确定要取消关注吗","cancelReal('"+obj+"')");
}

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

$('body').on('mouseout', '.alreadyfollow', function(event) {
	event.preventDefault();
	$(this).html('已关注');
});
$('body').on('mouseover', '.alreadyfollow', function(event) {
	event.preventDefault();
	$(this).html('取消关注');
});
