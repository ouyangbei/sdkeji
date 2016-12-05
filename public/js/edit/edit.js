var artid = getQueryString("id");

jQuery(document).ready(function($) {
	getArtInfo();
});
//原创、分享，类别，封面图，标题文章,内容的初始化
var  articletype = '0' , topicId, titleImg, articletitle,personInfoId,id;
var  details = [];
var  deleteImg=[];

function getArtInfo(){
	var data = {
		articleid : artid
	}
	$.ajax({
		url: '/article/checkIfUser',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		var data = {
			article : result.message
		}
		if(result.code == '0'){
			id = result.message.subject.id;
			articletype = result.message.subject.type;
			topicId = result.message.subject.topic_id;
			titleImg=result.message.subject.title_img;
			personInfoId = result.message.subject.person_info_id;
			var html = new EJS({url : '/views/articles/editArticle.ejs'}).render(data);
			$('#main_container').html(html);
			checkWordNum();
			getTopics(topicId);
			//拖拽功能实现,初始化
	   		$("#content_container").dragsort({ dragSelector: "li", dragBetween: false,dragSelectorExclude:"input,textarea,span", dragEnd: saveOrder, placeHolderTemplate: "<li class='content_hold'><div></div></li>" });	
		}else if(result.code == '3003'){
			message('出错了');
		}else{
			var html = new EJS({url : '/views/error.ejs'}).render(data);
			$('#main_container').html(html);
		}
		
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}


//拖拽之后的东西
function saveOrder() {
	var data = $("#content_container li").map(function() { return $(this).children().html(); }).get();
	$("input[name=list1SortOrder]").val(data.join("|"));
};
//进入页面之后获取话题列表
function getTopics(obj){
	$.ajax({
		url: '/article/getTopics',
		type: 'POST',
		data: {param1: 'value1'},
	})
	.done(function(result) {
		if(result.resultCode == "0"){
			var data = {
				topics : result.topics
			}
			var data2 = {
				topicid : obj
			}
			for (var i = 0; i < result.topics.length; i++) {
				if(obj == result.topics[i].id){
					$('.type').append('<div class="type_cont"><span class="art_type_close">×</span><span id="art_type">'+result.topics[i].name+'</span></div>')
				}
			}
			var html = new EJS({url: '/views/write/topicslist.ejs'}).render(data);
			$('#add_type').html(html);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}
//类别选择
$('body').on('click', '#type_chose', function(event){
	event.preventDefault();
	$('#add_type').toggle('fast');
})
$('body').on('click', '#add_type > div',function(event){
	var html = $(this).html();
	var id   = $(this).attr('id');
	topicId  = id;
	$('#type_chose').css('display', 'none');
	$('#add_type').css('display', 'none');
	$('.type').append('<div class="type_cont"><span class="art_type_close">×</span><span id="art_type">'+html+'</span></div>')
})

$('body').on('click', '#original', function(event) {
	event.preventDefault();
	$(this).addClass('active');
	articeltype = '0';
	$('#reship').removeClass('active');
});

$('body').on('click', '#reship', function(event) {
	event.preventDefault();
	$(this).addClass('active');
	articletype = '1';
	$('#original').removeClass('active');
});
$('body').on('click','.art_type_close',function(event){
	topicId = '';
	$(this).parent('.type_cont').remove();
	$('#type_chose').fadeIn('fast');
})

// //添加视频
// $('body').on('click','#add_video',function(event){
// 	$(this).parent('.add_').siblings('#video').fadeIn('fast');
// })

// //取消添加视频
// $('body').on('click','.video_close',function(event){
// 	$(this).parent('#video').fadeOut('fast');
// })
// $('body').on('click','#video_confirm',function(event){
// 	var src = $(this).siblings('input').val();
// 	var srcstart = src.substring('','http://player.youku.com/player.php');
// 	console.log(srcstart);
// })

//添加模块
$('body').on('click', '#new_content', function(event){
	$(this).slideUp('fast');
    $(this).siblings('#add_cont').slideDown('fast');
})

//取消添加模块
$('body').on('click', '.cancel_newcont', function(event){
	$(this).parent('.appendnew').slideUp('fast');
    $(this).parent('.appendnew').siblings('#new_content').slideDown('fast');
})

//删除模块
$('body').on('click', '.content_text > .text_container > span',  function(event){
	var this_ = this;
	var id = $(this).attr('id');
	if( id ){
		deleteImg .push(id);
	}
	$(this).parent('.text_container').parent('.content_text').slideToggle("slow",function(){
		$(this_).parent('.text_container').parent('.content_text').remove();
	});
})
//添加text
$('body').on('click', '#add_text', function(event){
	var data = {};
	var classname = $(this).parent('#add_').parent('#add_cont').attr('class');
	var text = new EJS({url: 'views/write/textnew.ejs'}).render(data);
	if(classname == 'appendnew'){
		$(this).parent('#add_').parent('#add_cont').slideUp('fast');
		$(this).parent('#add_').parent('#add_cont').siblings('#new_content').slideDown('fast');
		$(this).parent('#add_').parent('#add_cont').parent('li').after(text);
		$("html,body").animate({scrollTop:$(obj).offset().top - 200},500);
	}else{
		$('#content_container').append(text);
		$("html,body").animate({scrollTop:$(".footer").offset().top},500);
	}	
})

//图片上传
$(function () { 
	$('body').on('change', '.photoFileUpload', function(){
    	var this_ = this;
    	fileupload(this_);
	})
	$('body').on('change', '.cover_img', function(){
    	var this_ = this;
    	fileupload(this_);
	})
}); 
//添加图片成功之后执行动作
function imgUploadEnd(obj, classname, url){ 
	$('#percent').html('100%');
	$('.process_container').fadeOut('fast');
	var data = {
		url : url
	};
	var html = new EJS({url: 'views/write/imgnew.ejs'}).render(data);
	if(classname == 'appendnew'){
		$(obj).parent('#myupload').parent('#add_img').parent('#add_').parent('#add_cont').parent('li').after(html);
		$("html,body").animate({scrollTop:$(obj).offset().top - 200},500);
	}else{
		$('#content_container').append(html);
		$("html,body").animate({scrollTop:$(".footer").offset().top},500);
	}
}

//封面上传之后添加动作
function coverUploadEnd(url){
	$('#percent').html('100%');
	$('.process_container').fadeOut('fast');
	$('#cover_img').css({'z-index':'-1','opacity':'0'});
	$('#cover_pre').attr('src',url);
	titleImg = url;
}

//文件上传
function fileupload(this_){
	var classname = $(this_).attr('class');
	if(classname == 'cover_img'){
		var uploadFormDom=$(this_).parent('#cover_img_select');
	}else{
		var imgtype = $(this_).parent('#myupload').parent('#add_img').parent('#add_').parent('#add_cont').attr('class');
		var uploadFormDom =$(this_).parent('#myupload');
	}
	var uploadInputDom = uploadFormDom.find('input[type=file]');
	var files = uploadInputDom[0].files;
	// 创建 formData 对象
	var formData = new window.FormData(uploadFormDom[0]);
	if (files.length) {
		//百分比归零
		process_to_zero();
	    $.ajax({
	      // 注意，这个 url 地址是一个例子，真实使用时需替换为自己的上传接口 url
	      url: '/file',
	      method: 'post',
	      data: formData,
	      processData: false,
	      contentType: false,
	      success:function(data){
	      	if( classname == 'cover_img'){
                coverUploadEnd(data.fileUrl);
	      	}else{
	      		imgUploadEnd(this_, imgtype, data.fileUrl);
	      	}	
	      },
	      xhr: function(){
	　　　　　　var xhr = $.ajaxSettings.xhr();
	　　　　　　if(onprogress && xhr.upload) {
	　　　　　　　　xhr.upload.addEventListener("progress" , onprogress, false);
	　　　　　　　　return xhr;
	　　　　　　}
	　　　　} 
	    });
	  }
}

//字数统计
function textwordnum(obj){
	var str      = $(obj).val();
	var strlength= str.length;
	var classname = $(obj).attr('class');
	if( classname=='text_content' ){
		var length = 1000 - strlength;
	}else{
		var length = 200 - strlength;
	}
	if(length <= 0){
		$(obj).siblings('h4').children('span').html(0);
	}else{
		$(obj).siblings('h4').children('span').html(length);
	}
	if( classname=='text_content' ){
		delete_more_text(obj, str, 1000);
	}else{
		delete_more_text(obj, str, 200);
	}	
}

function send() {
	$('#send').attr('onclick','a()');
	var Title = $('#title').val(); 
	if( !Title ){ 
		$('#send').attr('onclick','send()');
		message("请输入标题");
		return;
	}else if ( !titleImg ) {
		$('#send').attr('onclick','send()');
		message("请选择封面");
		return;
	}else if ( !topicId ) {
		$('#send').attr('onclick','send()');
		message("请选择类型");
		return;
	}
	articletitle = strExchange(Title);
	var contentLength = $('#content_container').children('li').length;
	if( contentLength == 0){
		$('#send').attr('onclick','send()');
		message('什么内容都没有哦！');
		return;
	}
	$('#content_container > li').each( function(index, el) {
		 var contentType = $(el).find('textarea').attr('class');
		 if( contentType == 'img_content' ){
		 	var imgUrl  = $(el).find('#img_url').attr('src');
		 	var content = $(el).find('textarea').val();
		 	var data = {
		 			seq : index,
		 			url : imgUrl,
		 			type: 'img'
		 	    }
		 	if(content){
		 		data.content = strExchange(content);
		 	}
		 	details.push(data);
		 	if(index == contentLength-1){
		 		saveArticle();
		 	} 
		 }else if (contentType == 'text_content' ) {
		 	var title_tiny   = $(el).find('.title_tiny').val();
		 	var content = $(el).find('textarea').val();
		 	if(!content){
		 		$('#send').attr('onclick','send()');
		 		details=[];
		 		message("内容不能为空");
		 		return false;
		 	}else{
		 		var data = {
		 			seq    : index,
		 			content: strExchange(content),
		 			title  : strExchange(title_tiny),
		 			type   : 'txt'
		 	    }
		 		details.push(data);
		 		if(index == contentLength-1){
		 			saveArticle();
		 		} 
		 	}  
		 }
	});
}
function saveArticle(){
	var data = {
		id       : id,
		delImgUrls:deleteImg,
		title    : articletitle,
		type     : articletype,
		topicId  : topicId,
		details  : details,
		titleImg : titleImg,
		personInfoId:personInfoId
	}
	data = JSON.stringify(data);
	$.ajax({
		url: '/article/editArticle',
		type: 'POST',
		data: {data : data}
	})
	.done(function(data) {
		details = [];
		if(data.resultCode == '0'){
			location.href = "/user"
		}else{
			message_login();
		}
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		console.log("complete");
	});
}

function checkWordNum (argument) {
	$('.text_content').each(function(index, ele) {
		 textwordnum(ele);
	});  
	$('.img_content').each(function(index, ele) {
		 textwordnum(ele);
	});  
}


