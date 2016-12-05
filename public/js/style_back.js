var BaseUrl = 'http://'+window.location.host+'/';
jQuery(document).ready(function($) {
	window.onscroll = function(){ 
		scrollStop ();
	}    
});
resize();
function scrollStop(){
		var scroTop = getScrollTop();
		if(scroTop >= 70){
			$('.headerbottom').css({'position':'fixed', 'top' : '0px'});
		}else{
			$('.headerbottom').css({'position':'relative'});
		}
		if(scroTop >= 100){
			fadeInScroll();
		}else{
			fadeOutScroll();
		}
}
function getScrollTop(){
	return $(document).scrollTop();
}
//进入不同类型文章页
function share(title_img, topic_id,title){
	location.href = '/share/'+topic_id;
}
//获取分类列表
function getTopicList(topicid){
	$.ajax({
		url: '/article/getTopics',
		type: 'POST',
		data: {param1: 'value1'},
	})
	.done(function(result) {
		topicList = result.topics;
		// ArticleList();
		if(result.resultCode == "0"){
			var data = {
				topics : result.topics,
				topicid: topicid
			}
			var html = new EJS({url: BaseUrl+'views/articles/homePageTopiclist.ejs'}).render(data);
			$('#menu').append(html);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}
//关闭进度条
$('body').on('click', '#process_close', function(){
	$('.process_container').fadeOut('fast');
})
//进度条归零
function process_to_zero(){
	$('.process_container').css('display','block');
	$('#process').css('width', '0%');
	$('#percent').html('0%');
}
// 进度处理
function onprogress(evt){
　　var loaded = evt.loaded;  //已经上传大小情况 
 	var tot    = evt.total;      //附件总大小 
 	var per    = Math.floor(100*loaded/tot);  //已经上传的百分比 
 	if(per < 100){
 		$('#percent').html('50%');
 		$('#process').css('width', 50+'%');
 	}else{
 		$('#process').css('width', 80+'%');
 		$('#percent').html(80+'%');
 	}
}
// 字数统计
function wordnum(str){
    var cn=(str.match(/[a-z]+|[\u4E00-\uFA29]/ig)||[]).length;
    return cn;
}

function delete_more_text(obj, objString, num){
	objString = objString.substring(0,num);
	$(obj).val(objString);
}
//字符串处理
function strExchange(str){
	var text=str.replace(/["“”]/ig,"\"");
	return text;
}

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function getUrl(){
	var url = window.location.href.split('/');
	var urllenght = url.length;
	return url[urllenght-1];
}
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

$('body').on('click', '#u_mes ',function(event){
	event.preventDefault();
	$('#edit_log').toggle('fast');
})
$('body').on('click', '#login',function(event){
	event.preventDefault();
	location.href="/login"
})
$('body').on('click', '#register',function(event){
	event.preventDefault();
	location.href="/register"
})

$('body').on('click', '#logout',function(event){
	event.preventDefault();
	$.ajax({
		url: '/user/logout',
		type: 'POST',
		data: {param1: 'value1'},
	})
	.done(function(result) {
		location.href = location.href;
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
})
function pleaseLogin(){
    swal('请登录')
}

$('body').on('click', '.art_', function(event) {
	event.preventDefault();
	var id  = $(this).attr('id');
	location.href='/top?id=' + id;
});

// $('body').on('click', '.article > img', function(event) {
// 	event.preventDefault();
// 	var id  = $(this).parent('.article').attr('id');
// 	location.href='/top?id=' + id;
// });


function stopevent(){
    var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
    if (e && e.stopPropagation) { 
    // this code is for Mozilla and Opera
    e.stopPropagation(); 
    } else if (window.event) { 
    // this code is for IE 
    window.event.cancelBubble = true; 
    } 
}

//滚动到顶部
function scrolltoTop(){
	$("html,body").animate({scrollTop: '0px' },300);
	$("#scroll").css({bottom: '-70px' });
}
//将滚动按钮显示
function fadeInScroll(){
	$("#scroll").css({bottom: '30px' });
}

//将滚动按钮隐藏
function fadeOutScroll(){
	$("#scroll").css({bottom: '-70px' });
}

//输入框tab可按
$('body').on('keydown', 'textarea', function(e){
	    if(e.keyCode == 9){
        e.preventDefault();
        var indent = '    ';
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var selected = window.getSelection().toString();
        selected = indent + selected.replace(/\n/g,'\n'+indent);
        this.value = this.value.substring(0,start) + selected + this.value.substring(end);
        this.setSelectionRange(start+indent.length,start+selected.length);
    }
})
//滚动条hover
$('#scroll').hover(function() {
	$(this).find('img').attr('src',BaseUrl+'img/scrollred.png');
}, function() {
	$(this).find('img').attr('src',BaseUrl+'img/scroll.png');
});
function resize(){
	var winheight = $(window).height();
	$('#main_container').css('min-height',winheight - 225 + 'px')
}