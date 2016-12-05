jQuery(document).ready(function($) {
	getTopics();
	//拖拽功能实现,初始化
	$("#content_container").dragsort({ dragSelector: "li", dragBetween: false,dragSelectorExclude:"input,textarea,span", dragEnd: saveOrder, placeHolderTemplate: "<li class='content_hold'><div></div></li>" });	
});
//原创、分享，类别，封面图，标题文章,内容的初始化
var articletype = '0' , topicId, titleImg, articletitle;
var  details = [];

//拖拽之后的东西
function saveOrder() {
	var data = $("#content_container li").map(function() { return $(this).children().html(); }).get();
	$("input[name=list1SortOrder]").val(data.join("|"));
};
//进入页面之后获取话题列表
function getTopics(){
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
$('#type_chose').click(function(event){ $('#add_type').toggle('fast'); })
$('body').on('click', '#add_type > div',function(event){
	var html = $(this).html();
	var id   = $(this).attr('id');
	topicId  = id;
	$('#type_chose').css('display', 'none');
	$('#add_type').css('display', 'none');
	$('.type').append('<div class="type_cont"><span class="art_type_close">×</span><span id="art_type">'+html+'</span></div>')
})

//原创还是转载切换
$('#original').click(function(event){
	$(this).addClass('active');
	articeltype = '0';
	$('#reship').removeClass('active');
})
$('#reship').click(function(event){
	$(this).addClass('active');
	articletype = '1';
	$('#original').removeClass('active');
})
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
		$("html,body").animate({scrollTop:$(this).offset().top - 200},500);
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
	var html = new EJS({url: '/views/write/imgnew.ejs'}).render(data);
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
	// $('.cover_pre').html('<img src='+url+'?imageView/2/w/450/h/400/q/100'+'>');
	titleImg = url;
}

//文件上传
function fileupload(this_){
	var classname = $(this_).attr('class');
	if(classname == 'cover_img'){
		var uploadFormDom=$(this_).parent('#cover_img_select');
		var uploadInputDom = uploadFormDom.find('input[type=file]');
		var files = uploadInputDom[0].files;
		if(window.FileReader) {  
	        var fr = new FileReader();  
	        fr.onloadend = function(e) { 
	        	$('#cover_img').css({'z-index':'-1','opacity':'0'});
				$('.cover_pre').html('<img src='+e.target.result+'>');
	        };  
	        fr.readAsDataURL(files[0]);  
    	} 
	}else{
		var imgtype = $(this_).parent('#myupload').parent('#add_img').parent('#add_').parent('#add_cont').attr('class');
		var uploadFormDom =$(this_).parent('#myupload');
		var uploadInputDom = uploadFormDom.find('input[type=file]');
		var files = uploadInputDom[0].files;
	}
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
	      		console.log(data);
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
	var strlength= wordnum(str);
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
	if( Title.length > 35){
		message('标题长度请小于35个字符');
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
		title   : articletitle,
		type    : articletype,
		topicId : topicId,
		details : details,
		titleImg: titleImg,
		personInfoId:"0bc36d3f-29fb-4493-ba36-471ef625e35f"
	}
	data = JSON.stringify(data);
	$.ajax({
		url: '/article/newart',
		type: 'POST',
		data: {data : data}
	})
	.done(function(data) {
		console.log(data);
		details = [];
		if(data.resultCode == '0'){
			location.href = "/user";
		}else if(data.code == '3003'){
			message_login();
		}else{
			message('请重新登录');
		}
	})
	.fail(function(err) {
		console.log(err);
	})
	.always(function() {
		console.log("complete");
	});
}

function reloadNameLength(){
	
}
