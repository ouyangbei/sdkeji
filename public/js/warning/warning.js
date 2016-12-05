//提示框
function message(str){
	var html = '<div class="aler"><div class="warn" style="transition:0.7s;">'+str+'</div>'+'</div>';
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
}
//请登录
function message_login(){
	var html = 	'<div class="worning">'+
					'<div class ="pleaselogin swal">'+
						'<img id="wor_close" src="/img/close.png">'+
						'<div class="logincontainer">'+
							'<div class="login_logo">'+
								'<img src="/img/logo.png">'+
							'</div>'+
							'<h5>最全面的留学经验分享网站</h5>'+
							'<h5>注册即可免费浏览500万留学生的经验分享</h5>'+
							'<div class="pleaseregister">'+
								'<div class="wor_reg">'+
									'<a href="/login">立即登录</a>'+
								'</div>'+
							'</div>'+
							'<div class="pleaseregister">'+
								'<div class="wor_log">'+
									'未有账号?<a href="/register">注册</a>'+
								'</div>'+
							'</div>'+
						'</div>'+	
					'</div>'+	
				'</div>';		
	$('body').prepend(html);
	setTimeout(function(){
		$('.pleaselogin').css({
			"-webkit-transition": "0.7s",
	        "-moz-transition": "0.7s",
	         "-o-transition": "0.7s",
	         "-ms-transition": "0.7s",
	         "transform": "scale(1,1)",
			'opacity' : '1',
		});
	},50);
}
//确认删除吗
function deleted(str,deal){
	this.message = str;
	var html  = '<div class="worning">'+
					'<div class="deleted swal">'+
						'<img id="wor_close_white" src="/img/close_white.png">'+
						'<h4>温馨提示</h4>'+
						'<div class="wor_message">'+
							'<img src="/img/warning.png">'+
							'<div class="war_message">'+this.message+'</div>'+
						'</div>'+
						'<div class="del_bot">'+
							'<div class="confirm" onclick = "'+ deal+'">确认</div>'+
							'<div class="cancel">取消</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	$('body').prepend(html);		
}

$('body').on('click', '#wor_close,#wor_close_white', function(event) {
	event.preventDefault();
	$('.worning').remove();
});
$('body').on('click', '.cancel,.confirm', function(event) {
	event.preventDefault();
	$('.worning').remove();
});