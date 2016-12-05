// 本文件主要完成评论功能
function newComment(contents, targetid, articleid,type, callback){
	var data = {
		content  : contents,
		targetid : targetid,
		articleid: articleid,
		type     : type
	}
	$.ajax({
		url: '/comment/newcomment',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		return callback(null, result);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

//获取评论列表
function getComments(targetid, page, pageCount, callback){
	var data = {
		targetid : targetid,
		page     : page ,
		pageCount: pageCount
	}
	$.ajax({
		url: '/comment/getComments',
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

//字数统计
function commentCount(obj){
	var str       = $(obj).val();
	var strlength = str.length;
	var classname = $(obj).attr('class');
	var length = 300 - strlength;
	if(length <= 0){
		message('内容长度超过限制');
		$(obj).siblings('h3').children('span').html(0);
	}else{
		$(obj).siblings('h3').children('span').html(length);
	}
		delete_more_text(obj, str, 300);
}

$('body').on('click', '#reply', function(event){
	var userHead = $('#login').attr('class');
	console.log(userHead);
	if(userHead){
		message_login();
		return;
	}
   $(this).parent('div').parent('.coment_to').parent('.com_contents').siblings('.reply').children('textarea,.reply_com,#reply_com, #cancel_reply').fadeIn('400');
   $(this).parent('div').parent('.coment_to').parent('.com_contents').parent('.comment').siblings('.comment').find('textarea,.reply_com,#reply_com, #cancel_reply').css('display', 'none');
})

$('body').on('click', '#cancel_reply', function(event){
	$(this).css('display','none');
   $(this).siblings('textarea, #reply_com,.reply_com').css('display','none');
  })
