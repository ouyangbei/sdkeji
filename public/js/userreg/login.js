var BaseUrl = 'http://'+window.location.host+'/';
function login(){
	var username = $('#phoneNum').val();
	var password = $('#password').val();
	if(!username){
		$('#err').html('请输入用户名');
		return;
	}else if(!password){
		$('#err').html('请输入密码');
		return;
	}
	$('#register').html('正在登陆..')
	var data = {
		username : username,
		password : password
	}
	$.ajax({
		url: '/user/login',
		type: 'POST',
		data: data
	})
	.done(function(data) {
		if(data.resultCode == '0'){
			var loc = location.href;
			var curloc = GetUrlRelativePath();
			if(curloc == "/login"){
				location.href = BaseUrl;
			}
			else{
				location.href = loc;
			}
		}else{
			$('#register').html('立即登录');
			$('#err').html('账户名或密码错误');
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}
function check(){
	$('#err').html('');
}

function GetUrlRelativePath()
　　{
　　　　var url = document.location.toString();
　　　　var arrUrl = url.split("//");

　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　　　if(relUrl.indexOf("?") != -1){
　　　　　　relUrl = relUrl.split("?")[0];
　　　　}
　　　　return relUrl;
　　}
$('.tohome').click(function(event) {
	location.href="/";
});