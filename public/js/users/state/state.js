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