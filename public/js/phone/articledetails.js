var BaseUrl = 'http://'+window.location.host+'/';
var artid = getUrl();
var uid   ;
jQuery(document).ready(function($) {
	$('.footer').css('display', 'block');
	renderAlterall();
	getArtDetails();
	getComments();
});
function getArtDetails(){
	var data = {
		id : artid
		}
	$.ajax({
		url: '/article/articleDetails',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			uid = result.subject.person_info_id;
			var title = result.subject.title;
			var reply_count = result.subject.reply_count;
			var great_count = result.subject.great_count;
			var create_date = result.subject.create_date;
			$('.art_username > .updatetime').html(create_date);
			var type = result.subject.type;
			if(type == '0'){
				$('#title > p > span').html('原创作品&nbsp;转载请与作者联系并标明出处');
			}else{
				$('#title > p > span').html('转载');
			}
			$('#title > h2').html(title);
			var data = {
				details : result.details,
			}
			// var html = new EJS({url: '/views/phone/articledetails.ejs'}).render(data);
			// $('#details').html(html);
			$("img.lazy").lazyload();
			user_mes();
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
function user_mes (){
	getUserMessage(uid, function(err, result){
		if(err){}
		else{
			var personInfo = JSON.parse(result.personInfo);
			$('#user_head').attr('src', personInfo.icon);
			$('#username').html(personInfo.nick_name);
		}
	})
}
//获取用户信息
function getUserMessage(userid, callback){
	var data = {
		personInfoId : userid
	}
	$.ajax({
		url: '/user/personInfo',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			return callback(null, result);
		}else{
			return callback('err', null)
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

//获取评论列表
function getComments(){
	var data = {
		targetid : artid,
		page     : 1,
		pageCount: 5
	}
	$.ajax({
		url: '/comment/getComments',
		type: 'POST',
		data: data
	})
	.done(function(results) {
		if(results.page.list.length < 5){
			$('.more').remove();
		}
		var data  = {
					results :{
						page          : 1,
						comments      : results.page.list,
						commentsCount : results.page.totalRow,
					} 
				}
		var html = new EJS({url: '/views/phone/comments.ejs'}).render(data);
		$('#comments').append(html);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

function getUrl(){
	var url = window.location.href.split('/');
	var urllenght = url.length;
    var string_ = url[urllenght-1].split('?')
	return string_[0];
}

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
//总评设置样式
function renderAlterall(){
	var alterAllContent = $('.alter_all').html();
	var newAlterAll = '<div class="alter_all"> <span class="type">总评</span> <span class="alter_all_content"> '+alterAllContent+'</span> </div>'
	$('.alter_all').replaceWith(newAlterAll);
}
