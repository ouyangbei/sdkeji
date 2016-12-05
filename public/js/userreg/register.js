var verified = false;//验证码允许
var phoneverify = false; //手机号允许
var registerverify = false;//注册允许
var wait     = 60;
var phoneNum , password ;
var handlerPopup = function (captchaObj) {
        // 成功的回调
        captchaObj.onSuccess(function () {
            verified = true;
            var validate = captchaObj.getValidate();
        });
        $("#getImgVeri").click(function () {
            captchaObj.show();
        });
        captchaObj.appendTo("#popup-captcha");
    };
$.ajax({
    url: "/imgverify/pc-geetest/register?t=" + (new Date()).getTime(), // 加随机数防止缓存
    type: "get",
    dataType: "json",
    success: function (data) {
        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
            offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        }, handlerPopup);
    }
});
function getvcode(){
    if(verified == false ){
        $('#err').html('请先滑动图片验证')
        return;
    }else{
       var phone = $('#phoneNum').val();
       var checkPhone = checkTel(phone);
       if( checkPhone == false || phoneverify == false){
            $('#getvcode').css('display','none');
            $('#time').html('手机号码有误');
            setTimeout("reload()", 1500);
       }else{
            wait = 60;
            countdown();
            sendcode(phone);
       }
    } 
}

function reload(){
    $('#getvcode').css('display','block');
}
function backtologin(){
    location.href="/login"
}
function register(){
    if(verified==false){
        return ;
    }else{
        
    }
}

function sendcode(phone){
    var data = {
            phoneNumber: phone,
        }
    $.ajax({
        url: '/user/phoneCode',
        type: 'POST',
        data: data,
    })
    .done(function(result) {
         phoneNum = phone;
        if(result.resultCode == '0'){
            registerverify = true;
        }else{
            $('#err').html('验证码发送失败')
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });   
}

function register(){
    var password = $('#password').val();
    var vcode    = $('#vcode').val();
    if(!vcode){
        $('#err').html('请输入验证码');
        $('#register').html('立即注册');
        return;
    }
    if(!password){
        $('#err').html('请输入密码');
        $('#register').html('立即注册');
        return;
    }
    var data = {
        username : phoneNum,
        password : password,
        phoneCode: vcode
    }
    if(registerverify == false || verified == false || phoneverify == false){
        if( registerverify == false ){
            var errmes = "尚未发送验证码";
        }
        if( verified == false ){
            var errmes = "尚未图形验证";
        }
        if( phoneverify == false ){
            var errmes = "手机号有误";
        }
        $('#err').html(errmes)
        return;
    }else{
        $('#register').html('正在注册...');
        $.ajax({
            url: '/user/register',
            type: 'POST',
            data: data,
        })
        .done(function(data) {
            if(data.code == '0'){
                $('#register').html('注册成功');
                setTimeout("backtologin()", 1500);
            }else{
                $('#register').html('注册失败');
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        
    }
}

// 倒计时
function countdown(){     
    if (wait == 0) { 
        $('#getvcode').css("display", 'block');
        wait = 60; 
    } else { 
        $('#getvcode').css("display", 'none'); 
        $('#time').html("重新发送(" + wait + ")"); 
        wait--; 
        setTimeout(function() { 
        countdown(); 
        }, 
        1000)} 
}
//手机号检测
function checkTel(str){
    var strlength=str.length;
    if(strlength != 11){
        return false;
    }else{
        if(!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(str)){
            return false;
        }else {
            return true
        }
    }  
}

function checkPhone(){
    var str = $('#phoneNum').val();
    var phonecheck = checkTel(str);
    if(phonecheck == true){
        var data = {
            username : str
        }
        $.ajax({
            url: '/user/validateUsername',
            type: 'POST',
            data: data,
        })
        .done(function(result) {
            if(result.exist == true){
                $('#err').html('手机号已存在');
                phoneverify = false;
                $('#phoneNum').focus();
            }else{
                phoneverify = true;
                $('#err').html('');
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });   
    }else{
        phoneverify = false;
        $('#err').html('手机号格式错误');
    }
}
$('.tohome').click(function(event) {
    location.href="/";
});