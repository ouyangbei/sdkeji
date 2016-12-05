jQuery(document).ready(function($) {
	initProvince();
	$.ms_DatePicker({ 
            YearSelector: ".sel_year", 
            MonthSelector: ".sel_month", 
            DaySelector: ".sel_day" 
    }); 
});

var icon ;

//省份初始化
function initProvince(){
	for (var i = 0; i < country.length; i++) {
		$('#province').append('<option value='+ country[i].value +'>'+country[i].text+'</option>');
	}
	myInfo();
}
$(function () {
	$('body').on('change', '#photoFileUpload', function(){
    	var this_ = this;
    	fileupload(this_);
	})
})
//省份选择
function provinceSelect(obj){
	var type= $("#province").find("option:selected").attr('value');
		$('#city').empty();
	for (var i = 0; i < country_[type].children.length; i++) {
		$('#city').append('<option value='+ country_[type].children[i].value +'>'+country_[type].children[i].text+'</option>');
	}
}

function nick_name(obj)  {
	 var str       = $(obj).val()
	 var strlength = str.length;
	 if(strlength > 20 ){
	 	delete_more_text(obj, str, 20);
	 }
}
//输入字数判断	
function descCount(obj){
	var str = $('#u_descript').val();
	var count =str.length;
	$(obj).siblings('h3').find('span').html(100-count);
	if(count > 100)
	delete_more_text(obj, str, 100);
}
// 头像上传
function fileupload(this_){
	var uploadFormDom = $('#upload-file-form');
	var uploadInputDom = uploadFormDom.find('input[type=file]');
	var files = uploadInputDom[0].files;
	if(window.FileReader) {  
        var fr = new FileReader();  
        fr.onloadend = function(e) { 
        	$('#u_head').attr('src',e.target.result);
        };  
        fr.readAsDataURL(files[0]);  
    } 
	//创建 formData 对象
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
	      	icon = data.fileUrl;
	      	$('#process').css('width', '100%');
	      	$('.process_container').fadeOut('fast');
	      	$('#u_head').attr('src', data.fileUrl);
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

function myInfo(){
	$.ajax({
		url: '/user/myInfo',
		type: 'POST',
		data: {}
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			var userInfo = JSON.parse(result.personInfo);
			var city     = userInfo.city;
			var province = userInfo.province;
			var sex      = userInfo.sex; 
			var birthday = userInfo.birthday;
			icon = userInfo.icon;
			if(province){
				$("#province").val(province); 
				for (var i = 0; i < country_[province].children.length; i++) {
					$('#city').append('<option value='+ country_[province].children[i].value +'>'+country_[province].children[i].text+'</option>');
				}
				$("#city").val(city);
			}
			
			if( birthday ){
                birthday = birthday.split('-');
                $('.sel_year').val(birthday[0]);
				$('.sel_month').val(birthday[1]);
				$('.sel_day').val(birthday[2]);
			}
			
			if(sex){
				$("#u_sex input[value="+sex+"]").attr("checked","checked");
			}
			
			$('#u_head').attr('src',userInfo.icon);
			$('#u_name').val(userInfo.nick_name);
			$('#u_job').val(userInfo.work);
			$('#u_sign').val(userInfo.introduce);
			$('#u_school').val(userInfo.school);
			$('#u_qq').val(userInfo.qq);
			$('#u_weixin').val(userInfo.weixin);
			$('#u_descript').val(userInfo.desc);
			if(userInfo.desc){
				var ob = $('#u_descript');
				descCount(ob);
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

$('body').on('click', '#savepro', function(event) {
	event.preventDefault();
	var nickname = $('#u_name').val();
	var nicknaleLenght = nickname.length;
	if(!nickname){
		message('请输入昵称');
		return;
	}
	if(!$('#u_sign').val()){
		message('请输入个性签名');
		return;
	}
	if($('#u_job').val().length > 20){
		message('工作请输入小于20个字符');
		return;
	}
	if($('#u_sign').val().length > 35){
		message('个性签名请输入小于25个字符');
		return;
	}
	if($('#u_school').val().length >30){
		message('学校请输入小于30个字符');
		return;
	}
	if($('#u_qq').val().length >15){
		message('qq请输入小于15个字符');
		return;
	}
	if($('#u_weixin').val().length > 25){
		message('微信请输入小于25个字符');
		return;
	}
	if($('#u_weixin').val()){
		var regs = /^[a-zA-Z\d_]{5,}$/;
		if(regs.test($('#u_weixin').val())){
			
		}
		else{
			message('微信号非法');
			return;
		}
	}
	if(nicknaleLenght > 15){
		message('昵称请小于15个字符');
		return;
	}
	var sex = $('#u_sex input[name="Fruit"]:checked ').val();
    var year= $(".sel_year").find("option:selected").attr('value');
	var month= $(".sel_month").find("option:selected").attr('value');
	var day= $(".sel_day").find("option:selected").attr('value');
	var birthday = year + '-' + month + '-' + day;
	var data = {
		sex      : $('#u_sex input[name="Fruit"]:checked ').val(),
		province : $("#province").find("option:selected").attr('value'),
		city     : $("#city").find("option:selected").attr('value'),
		nickname : nickname,
		birthday : birthday,
		icon     : icon,
		work     : $('#u_job').val(),
		sign     : $('#u_sign').val(),
		school   : $('#u_school').val(),
		qq       : $('#u_qq').val(),
		weixin   : $('#u_weixin').val(),
		desc     : $('#u_descript').val(),
	}
	var sign = $('#u_sign').val();
	
	$.ajax({
		url: 'user/updatePersonInfo',
		type: 'POST',
		data: data
	})
	.done(function(result) {
		if(result.resultCode == '0'){
			location.href = location.href;
		}else{
			$('#savepro').html('保存失败');
			message("会话已过期！请重新登陆");
			setTimeout("reloadsavepro()", 2000)
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
});

function reloadsavepro(){
	$('#savepro').html('保存修改');
}

function checkProLength(this_,length_){
	var length = $(this_).val().length;
	if(length>=length_) {
		message('输入长度超过限制');
	}
}