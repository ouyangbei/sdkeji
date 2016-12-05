
function getUserId(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
//是否关注
function isFollow(userid, callback){
	var data = {
		toUser : userid
	}
	$.ajax({
		url: '/user/isFollow',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		return callback(result);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

//关注用户
function follow(userid,this_){
	if(!userid){
		message_login();
		return;
	}
	var data = {
		toUser : userid
	}
	$.ajax({
		url: '/user/follow',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			$('#follower > a > span').html(parseInt($('#follower > a > span').html())+1);
			$('.follow').attr('onclick',"cancelFollow('"+userid+"')").html('取消关注');
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

//取消关注
function cancelFollow(userid){
	deleted("您确定要取消关注吗?","cancelReal('"+userid+"')");
}
function cancelReal(userid){
	var data = {
		toUser : userid
	}
	$.ajax({
		url: '/user/cancelFollow',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			$('#follower > a > span').html(parseInt($('#follower > a > span').html())-1);
			$('.follow').attr("onclick","follow('"+userid+"')").html('+关注');
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

$('body').on('click', '#user_menu > div', function(event){
     $(this).addClass('active');
     var id = $(this).attr('id');
     location.href = id; 
     $(this).siblings('div').removeClass('active');
})
