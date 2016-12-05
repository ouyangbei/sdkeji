 // 本文件文章详细页进行获取文章详情，
 // 用户详情，获取评论，添加评论，删除评论
// var artid = getQueryString("id");
var artid = getUrl(); 
var uid   ;
var jiathis_config = {
    url: 'http://share.pumpkincat.cn/top/'+artid,
    title: "这篇文章分享给大家，希望大家支持我们 ",
    summary:',享留学，留学社区，分享留学生活，备考经验...',
    imageUrl:'http://share.pumpkincat.cn/img/logo_.png',
    pic:"http://share.pumpkincat.cn/img/logo_.png"
}

jQuery(document).ready(function($) {
	renderAlterall();
	 $("img.lazy").lazyload();
	getArtDetails();
	//获取添加分页
	getComments(artid, 1, 20, function(err, result){
		$('#comment_count > span').html('(共'+result.page.totalRow+'条评论)')
		if(result.page.totalPage > 1 ){
			$(".tcdPageCode").createPage({
		        pageCount:result.page.totalPage,
		        current:1,
		        backFn:function(p){
		        	var loadings = '<div class="loadings">'+loadingDot+'</div>'
		        	$('#comments').empty().html(loadings);
		            getComments(artid, p, 20, function(err, results){
						var data=
	 						{
								results:{
									page          : p,
									comments      : results.page.list,
									commentsCount : results.page.totalRow
								} 
							}
							if(result.userInfo){
								data.results.userInfo = result.userInfo
							}
						var html  = new EJS({ url:'/views/comment/commentlist.ejs' }).render(data);
						$('#comments').empty().html(html);
					})
		        }
		    });
		}
	})
	//获取评论列表
	getComments(artid, 1, 20, function(err, result){
		var data  = {
				results :{
					page          : 1,
					comments      : result.page.list,
					commentsCount : result.page.totalRow,
				} 
			}
		if(result.userInfo){
			data.results.userInfo = result.userInfo
		}
		var html  = new EJS({ url:'/views/comment/commentlist.ejs' }).render(data);
		$('#comments').empty().html(html);
	})
	//是否点赞过
	isGreat();
	isCollect(function(result){
		if((result.resultCode == '0') && (result.resultBoolean == true)){
			$('.collect').html('<img onclick="cancelCollectConfirm()" src="/img/collect.png"> <span>已收藏</span>')
		}else{

		}
	})
});

function cancelCollectConfirm(){
	deleted("您确认要取消收藏吗?","cancelCollect()");
}

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
		if(result.resultCode== '0'){
			uid = result.subject.person_info_id;
			var title = result.subject.title;
			var reply_count = result.subject.reply_count;
			var great_count = result.subject.great_count;
			var type = result.subject.type;
			isFollow(uid, function(folres){
				if(folres.code == '3003'){
					$('.follow>img').attr({'src':'/img/addfollow.png','onclick':"follow()"});
				}else if(folres.resultBoolean == false){
					$('.follow>img').attr({'src':'/img/addfollow.png','onclick':"follow('"+uid+"')"});
				}else if(folres.resultBoolean == true){
					$('.follow>img').attr({'src':'/img/cancelfollow.png','onclick' : "cancelFollow('"+uid+"')"});
				}
			});
			if(type == '0'){
				$('#title > p > span').html('原创作品&nbsp;转载请与作者联系并标明出处');
			}else{
				$('#title > p > span').html('转载');
			}
			$('#great_count > i').html(great_count);
			$('#reply_count > i').html(reply_count);
			$('#title > h3').html(title);
			var data = {
				details : result.details,
			}
			// var html = new EJS({url: '/views/articles/articleDetails.ejs'}).render(data);
			// $('#art_content').html(html);
			// $("img.lazy").lazyload();
			user_mes();
		}else{
			message('请重新登陆');
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
			$('#user_head').attr('id',personInfo.id).addClass('tousercenter');
			$('#username').html(personInfo.nick_name);
			$('#follower > i').html(personInfo.fins);
			$('#follower >span').attr('onclick',"toUserFollower('"+personInfo.id+"')");
			$('#follower >i').attr('onclick',"toUserFollower('"+personInfo.id+"')");
			// followee
			$('#followee > i').html(personInfo.follow);
			$('#followee').attr('onclick',"toUserFollow('"+personInfo.id+"')");
			$('#followee >span').attr('onclick',"toUserFollower('"+personInfo.id+"')");
			$('#followee >i').attr('onclick',"toUserFollower('"+personInfo.id+"')");
			if(personInfo.introduce){
				$('.user_des').html("<span>“</span>"+ personInfo.introduce +"<span>”</span>");
			}
			else{
				$('.user_des').html('这家伙什么都没留下..');
			}
		}
	})
}

function toUserFollower(obj){
	window.open('/follower/'+obj,'_black');
}

function toUserFollow(obj){
	window.open('/follow/'+obj,'_black');
}
//新增评论
function newcomment(){
	var content = $('#comment_are').val();
	if(!content){ message('请输入评论内容！'); return;}
	else{	
		content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		$('#comment_are').val("");
		newComment(content, artid, artid, "subject",function(err, result){
			if((result.resultCode != '0')){
				message_login();
				$('#comment_area > h3 > span').html('300');
			}else{
				if(err){ message(err.message) }
					else{ 
						$('#comments > h2').remove();
						var commentCount = parseInt($('#comment_count > span').html().replace('(共','').replace('条评论)',''))+1;
						$('#comment_count > span').html('(共'+commentCount+'条评论)');
						getUserMessage(result.userId, function(err, results){
							var personInfo = JSON.parse(results.personInfo);
							var data = {
								comment:{
									content    : result.content,
									updatetime : result.updatetime,
									username   : personInfo.nick_name,
									userhead   : personInfo.icon,
								},
								BaseUrl : BaseUrl
							}
							var html = 	new EJS({url: '/views/comment/newcomment.ejs'}).render(data);
							$('#comments').prepend(html);
						});
					}
			}
				
		})
	}
}
//评论的评论
function commentToComment(obj){
	var content = $(obj).siblings('textarea').val();
	var targetid= $(obj).siblings('textarea').attr('id');
	var tousername= $(obj).parent('.reply').siblings('.com_contents').find('.username').html();
	var tocontent = $(obj).parent('.reply').siblings('.com_contents').find('p').html();
	var tocontent2 = $(obj).parent('.reply').siblings('.com_contents').find('.coment_to').find('p').find('.cont').html();
	if(!content){ message('请输入评论内容！');return }
	else{	
		content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		$(obj).siblings('textarea').val("");
		newComment(content, targetid, artid ,"reply",function(err, result){
			$('.comment').find('textarea,.reply_com,#reply_com,#cancel_reply').css('display', 'none');
			if(result.resultCode != '0'){
				message_login();
			}else{
				if(err){ message(err.message) }
				else{ 
					var commentCount = parseInt($('#comment_count > span').html().replace('(共','').replace('条评论)',''))+1;
					$('#comment_count > span').html('(共'+commentCount+'条评论)');
					getUserMessage(result.userId, function(err, results){
						var personInfo = JSON.parse(results.personInfo);
						var data = {
							comment:{
								content    : result.content,
								updatetime : result.updatetime,
								username   : personInfo.nick_name,
								userhead   : personInfo.icon,
								touser     : tousername,
							},
							BaseUrl : BaseUrl
						}
						if(tocontent2){
							data.comment.tocontent = tocontent2;
						}else{ 
							data.comment.tocontent = tocontent 
						}
						var html = 	new EJS({url: '/views/comment/commentToComment.ejs'}).render(data);
						$('#comments').prepend(html);
					});
			}
			}
				
		})
	}
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
//是否收藏过
function isCollect(callback){
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/isCollect',
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
function follow(userid, callback){
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
			$('.follow>img').attr({'src':'../img/cancelfollow.png','onclick' : "cancelFollow('"+userid+"')"})
			$('#follower > i').html(JSON.parse($('#follower > i').html())+1);
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
			$('.follow>img').attr({'src':'../img/addfollow.png','onclick':"follow('"+userid+"')"})
			$('#follower > i').html(JSON.parse($('#follower > i').html())-1);
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
//是否点赞过文章
function isGreat(){
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/isGreat',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.code){
			$('.great').attr('onclick',"message_login()").addClass('ifgreat');
		}else{
			if (result.resultCode == '0' && result.resultBoolean == true) {
				great_remove();
			}else{
				$('.great').addClass('ifgreat')
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

//文章点赞
function greatArticle(obj){
	$('#count_add').css({
		'opacity'   : '1',
		'top'       : '-30px'
	});
	setTimeout("great_remove()", 500);
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/greatArticle',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

//收藏文章
function collectArticle(){
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/collect',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode!='0'){
			if(result.code == "-1"){
				message('已收藏');
			}else{
				message_login();
			}
		}else{
			$('.collect').html('<img onclick="cancelCollectConfirm()" src="/img/collect.png"> <span>已收藏</span>')
			message('收藏成功');
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

//取消收藏文章

function cancelCollect(){
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/cancelCollect',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		$('.collect').html('<img onclick="collectArticle()" src="/img/collect.png"> <span>收藏</span>')
			var html = '<div class="aler"><div class="warn" style="transition:0.7s;">取消收藏成功</div>'+'</div>';
		$('body').prepend(html);
		setTimeout(function(){
			$('.warn').css({
				"-webkit-transition": "0.7s",
		        "-moz-transition": "0.7s",
		         "-o-transition": "0.7s",
		         "-ms-transition": "0.7s",
		         "transform": "scale(1,1)",
				'opacity' : '1',
			});
		},50)
		setTimeout(function(){
			$('.warn').css({'opacity':'0','transition':'0.5s'});
		},1500);
		setTimeout(function(){
			$('.aler').remove();
		},1900);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

//删除文章评论
function deleteComment(obj, obj_){
	var sibp = $(obj_).attr('id');
	if(sibp == 'first_comment'){
		$(obj_).parent('div').siblings('p').children('.cont').html("此条评论已被删除！");
	}
	else{
		$(obj_).parent('div').siblings('p').html("此条评论已被删除！");
	}
	$(obj_).parent('div').remove();
	var data ={
		targetid : obj
	}
	$.ajax({
		url : '/comment/deleteComment',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		console.log(result);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

//点赞评论
function greatComment(obj, obj_){
	var data = {
		targetid : obj
	}
	// $(obj_).attr('onclick','b()');
	$.ajax({
		url: '/comment/greatComment',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		console.log(result)
		if(result.resultCode ){
			var x = parseInt($(obj_).siblings('.great_count').html()) ;
			$(obj_).siblings('.great_count').html(x + 1);
			$(obj_).css({"background":"url('/img/great.png')",'background-size':'100% 100%','background-repeat':'no-repeat'});
		}else if(result.code == '3003'){
			message_login();
		}else{
			message('已点赞');
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}

//取消点赞
function great_remove(){
	$('.great').html('<div style="background:#f1765a;font-size:20px;padding-top:37px;padding-bottom:37px;">已赞</div>').removeClass('ifgreat');
}

//总评设置样式
function renderAlterall(){
	var alterAllContent = $('.alter_all').html();
	var newAlterAll = '<div class="alter_all"> <span class="type ">总评</span> <span class="alter_all_content"> '+alterAllContent+'</span> </div>'
	$('.alter_all').replaceWith(newAlterAll);
}

$('body').on('click', '#reply_count', function(event) {
	event.preventDefault();
	var scrollTop =  $('#comment').offset().top;
	$("html,body").animate({scrollTop:scrollTop - 200},500);
});

$('.rash').hover(function(event) {
	event.preventDefault();
	alert(1);
	$(this).attr('src', '/img/rashnews.png');
}, function() {
	$(this).attr('src', '/img/rash.png');
});

