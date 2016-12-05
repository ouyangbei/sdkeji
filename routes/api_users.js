/**
 * Created by xiaobei on .
 */
'use strict';
var AV         = require('leanengine');
var moment     = require('moment');
var router     = require('express').Router();
var parseurl   = require('parseurl');
var session    = require('express-session');
var express    = require('express');
var xss        = require('xss');

// var myredis    = require('./api_redis');
var apis       = require('./apis');
var requestsql = require('./mysqlrequest');
var error      = require('./error');
var province   = require('./province');

var app        = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  userInfo:{},
  cookie: { maxAge :6000000000 }
}))

requestsql.init;

//获取用户信息
router.post('/personInfo',function(req, res){
    GetUserMessage(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//个人信息
router.post('/myInfo',function(req, res){
    myInfo(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//登录
router.post('/login',function(req, res){

    Login(req ,res ,function(err ,result){
        LoginLoadSession(req, res, err, result);
    })
})

//退出登录
router.post('/logout',function(req, res){
    LogoutDecSession(req, res);
})

//手机验证码
router.post('/phoneCode',function(req, res){
    PhoneCode(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//注册
router.post('/register',function(req, res){
    Register(req ,res ,function(err ,result){
        var text  = JSON.parse(result.text);
        if( result.status != 200 ){
            res.send({ code : error['3000']['code'], message : error['3000']['message']});
        }
        else if( text.resultCode != 0 ){
            res.send({ code : error[ text.resultCode ]['code'], message : "注册失败" });
        }else{
            res.send({ code : error[ '0' ]['code'], message : "注册成功"});
        }  
    })
})

//用户名判断是否已经存在
router.post('/validateUsername',function(req, res){
    ValidateUsername(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//更新用户信息
router.post('/updatePersonInfo',function(req, res){
    UpdatePersonInfo(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//搜索用户
router.post('/userSearch',function(req, res) {
    userSearch(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

//关注
router.post('/follow',function(req, res) {
    follow(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

// 取消关注
router.post('/cancelFollow',function(req, res) {
    cancelFollow(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

//关注的人
router.post('/followList',function(req, res){
    followList(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

//粉丝列表
router.post('/followerList',function(req, res){
    followerList(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})
//是否关注了
router.post('/isFollow',function(req, res){
    isFollow(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
})

// 对我的评论
router.post('/stateComment', function(req, res) {
    getToMyComment(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

//找到对于我的赞
router.post('/stateGreat', function(req, res) {
    getToMyGreat(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

//找到我的赞
router.post('/myGreat', function(req, res) {
    getMyGreat(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});

//找到我的评论
router.post('/myComment', function(req, res) {
    getMyComment(req ,res ,function(err ,result){
        ResultProcessed(req, res, err, result);
    })
});
//找到我的评论
function getMyComment(req,res,callback){
    var userInfo = req.session.userInfo;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token        : userInfo.token,
            peronInfoId  : userInfo.userId,
            pageCurrent  : req.body.page,
            pageSize     : req.body.pageSize
        }
    }
    requestsql.request( apis['state']['myComment'], params, 'form', function(err, result){
        return callback(err, result);
    })
}
//找到我的赞
function getMyGreat(req,res,callback){
    var userInfo = req.session.userInfo;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token        : userInfo.token,
            peronInfoId  : userInfo.userId,
            pageCurrent  : req.body.page,
            pageSize     : req.body.pageSize
        }
    }
    requestsql.request( apis['state']['myGreat'], params, 'form', function(err, result){
        return callback(err, result);
    })
}

//找到对于我的赞
function getToMyGreat(req,res,callback){
    var userInfo = req.session.userInfo;
    var userId = req.body.userId;
    var params = { 
        pageCurrent  : req.body.page,
        pageSize     : req.body.pageSize
    }
    if(userId){
        params.peronInfoId = req.body.userId;
    }else{
        params.peronInfoId = userInfo.userId;
    }
    requestsql.request( apis['state']['toGreat'], params, 'form', function(err, result){
        return callback(err, result);
    })
}

//找到对于我的评论
function getToMyComment(req,res,callback){
    var userInfo = req.session.userInfo;
    var userId = req.body.userId;
    var params = { 
        pageCurrent  : req.body.page,
        pageSize     : req.body.pageSize
    }
    if(userId){
        params.peronInfoId = req.body.userId;
    }else{
        params.peronInfoId = userInfo.userId;
    }
    requestsql.request( apis['state']['toComment'], params, 'form', function(err, result){
        return callback(err, result);
    })
}


function isFollow(req, res, callback){
    var userInfo = req.session.userInfo;
    var toUserId = req.body.toUser;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token  : req.session.userInfo.token,
            "relation.from_user_id" : userInfo.userId,
            "relation.to_user_id"  : toUserId
        }
        requestsql.request( apis['user']['isFollow'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}


//粉丝列表
function followerList(req, res, callback){
    var userInfo = req.session.userInfo;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token  : req.session.userInfo.token,
            "person_info_id" : userInfo.userId,
        };
        requestsql.request( apis['user']['followerList'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}


//关注列表
function userSearch(req, res, callback){
    var userInfo = req.session.userInfo;
    if(!userInfo || userInfo == null){
        var params = { 
                "pageCurrent"    : req.body.pageCurrent,
                "pageSize"       : req.body.pageSize,
                "personInfo.nick_name" : req.body.userName,
            };
    }else{
        var params = { 
                token  : req.session.userInfo.token,
                "pageCurrent"    : req.body.pageCurrent,
                "pageSize"       : req.body.pageSize,
                "personInfo.nick_name" : req.body.userName,
            };
    }      
    requestsql.request( apis['user']['userSearch'], params, 'form', function(err, result){
        return callback(err, result);
    })
}

//关注列表
function followList(req, res, callback){
    var userInfo = req.session.userInfo;
    if(!userInfo){
        var params = { 
            "pageCurrent"    : req.body.pageCurrent,
            "pageSize"       : req.body.pageSize,
            "person_info_id" : req.body.userId,
        };
    }else{
        var params = { 
            token  : req.session.userInfo.token,
            "pageCurrent"    : req.body.pageCurrent,
            "pageSize"       : req.body.pageSize,
            "person_info_id" : req.body.userId,
        };
    }       
    requestsql.request( apis['user']['followList'], params, 'form', function(err, result){
        return callback(err, result);
    })
}

//粉丝列表
function followerList(req, res, callback){
    var params = { 
        "pageCurrent"    : req.body.pageCurrent,
        "pageSize"       : req.body.pageSize,
        "person_info_id" : req.body.userId,
    };
    requestsql.request( apis['user']['followerList'], params, 'form', function(err, result){
        return callback(err, result);
    })
}


// 取消关注
function cancelFollow(req, res, callback){
    var userInfo = req.session.userInfo;
    var to_user_id = req.body.toUser;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token  : req.session.userInfo.token,
            "relation.from_user_id" : userInfo.userId,
            "relation.to_user_id"   : to_user_id
        };
        requestsql.request( apis['user']['cancelFollow'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}

// 关注
function follow(req, res, callback){
    var userInfo = req.session.userInfo;
    var to_user_id = req.body.toUser;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { 
            token  : req.session.userInfo.token,
            "relation.from_user_id" : userInfo.userId,
            "relation.to_user_id"   : to_user_id
        };
        requestsql.request( apis['user']['follow'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}

//获取个人信息
function myInfo(req, res, callback){
    var userInfo = req.session.userInfo;
    if(!userInfo){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params = { personInfoId : userInfo.userId };
        requestsql.request( apis['user']['personInfo'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}

//登录
function Login (req, res, callback){
    var username = req.body.username;
    var password = req.body.password;
    if( !username || !password){
        if( !username ){var code = '1000'}
        else if( !password ){ var code = '1003'}   
        return callback( {code : error[code]['code'], message : error[code]['message']},null );
    }
    else{
        var params = { 'account.username' : username, 'account.password' : password  };
        requestsql.request( apis['user']['login'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
//注册
function Register (req, res, callback){
    var username = req.body.username;
    var password = req.body.password;
    var phoneCode = req.body.phoneCode;
    if( !username || !password || !phoneCode ){
        if( !username ){var code = '1000'}
        else if( !password ){ var code = '1003'}
        else if( !phoneCode ){ var code = '3002'};    
        return callback( {code : error[code]['code'], message : error[code]['message']},null );
    }
    else{
        var params = { phoneCode : phoneCode, 'account.username' : username, 'account.password' : password  };
        requestsql.request( apis['user']['register'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
//发送验证码
function PhoneCode (req, res, callback){
    var phoneNumber = req.body.phoneNumber;
    if( !phoneNumber ){
        return callback( {code : error['1001']['code'], message : error['1001']['message']},null );
    }
    else{
        var params = { phoneNumber : phoneNumber };
        requestsql.request( apis['user']['phoneCode'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
//获取用户信息
function GetUserMessage (req, res, callback){
    var personInfoId = req.body.personInfoId;
    if( !personInfoId ){
        return callback( {code : error['3001']['code'], message : error['3001']['message']},null );
    }
    else{
        var params = { personInfoId : personInfoId };
        requestsql.request( apis['user']['personInfo'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
// 后台查询登录用户信息
function checkUserInfo(personInfoId, callback){
    if( !personInfoId ){
        return callback( {code : error['3001']['code'], message : error['3001']['message']},null );
    }
    else{
        var params = { personInfoId : personInfoId };
        requestsql.request( apis['user']['personInfo'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
//查询用户名称是否存在
function ValidateUsername (req, res, callback){
    var username = req.body.username;
    if( !username ){
        return callback( {code : error['1000']['code'], message : error['1000']['message']},null );
    }
    else{
        var params = { username : username };
        requestsql.request( apis['user']['validateUsername'], params, 'form', function(err, result){
            return callback(err, result);
        })
    }
}
//修改人员信息
function UpdatePersonInfo (req, res, callback){
    var nickname = req.body.nickname,
        icon     = req.body.icon,
        introduce= req.body.sign,
        province = req.body.province,
        city     = req.body.city,
        desc     = req.body.desc,
        weixin   = req.body.weixin,
        qq       = req.body.qq,
        work     = req.body.work,
        school   = req.body.school,
        birthday = req.body.birthday,
        sex      = req.body.sex;
        if(nickname){ nickname = nickname.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(introduce){ introduce = introduce.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(province){ province = province.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(city){ city = city.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(desc){ desc = desc.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(weixin){ weixin = weixin.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(school){ school = school.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        if(sex){ sex = sex.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        
        var userInfo = req.session.userInfo;
        if( !userInfo){
            return callback( {code : error['3003']['code'], message : error['3003']['message']}, null );
        }else{
            var params = {
                token  : req.session.userInfo.token,
                'personInfo.nick_name' : nickname,
                'personInfo.icon'      : icon,
                'personInfo.id'        : userInfo.userId,
                'personInfo.introduce' : introduce,
                'personInfo.province'  : province,
                'personInfo.city'      : city,
                'personInfo.work'      : work,
                'personInfo.weixin'    : weixin,
                'personInfo.qq'        : qq,
                'personInfo.desc'      : desc,
                'personInfo.school'    : school,
                'personInfo.birthday'  : birthday,
                'personInfo.sex'       : sex
            };
            requestsql.request( apis['user']['updatePersonInfo'], params, 'form', function(err, result){
                return callback(err, result);
            })
        }   
}
//结果处理发送给前台
function ResultProcessed (req, res, err, result){
        if(err){
            res.send(err);
        }
        else{
            var text  = JSON.parse(result.text);
            if( result.status != 200 ){
                res.send({ code : error['3000']['code'], message : error['3000']['message']});
            }
            else if( (text.resultCode == '401') || (text.resultCode == '403')){
                var userInfo = req.session.userInfo ;
                userInfo = req.session.userInfo = null;
                res.send({ code : error['3003']['code'], message : error['3003']['message']});
            }
            else if( text.resultCode != '0' ){
                res.send({ code : error[ '-1' ]['code'], message : error[ '-1' ]['message']});
            }else{
                res.send(text);
            }
        }
}
//检测用户登录状态
function CheckLogin (req, res){
    var userInfo = req.session.userInfo;
    if (!userInfo) {
        return false;
    }else{
        return true;
    }
}
//登陆后存储用户session
function LoginLoadSession (req, res, err, result){
      var user  = JSON.parse(result.text);
      var personInfo = user.personInfo;
          personInfo  = JSON.parse(personInfo);
      var userInfo = req.session.userInfo;
      if(user.resultCode == '0'){
        if ( !userInfo ) {
            userInfo = req.session.userInfo = {
                    username : personInfo.nick_name,
                    userId   : personInfo.id,
                    token    : user.token   
            };
            res.send({ resultCode:'0', message:'success' });
        }else{
            res.send({ resultCode:'0', message:'success' });
       }
      }else{
        res.send({ code : error[ user.resultCode ]['code'], message : error[ user.resultCode ]['message']});
      }
      
}
//退出登录删除session
function LogoutDecSession (req, res){
    var userInfo = req.session.userInfo;
    if (!userInfo) {
        res.send({ code : error['3003']['code'], message : error['3003']['message']});
    }else{
        userInfo = req.session.userInfo = null;
        res.send({ code : error['0']['code'], message : error['0']['message']});
    }
}

function checkLogin(req, res, url_, type){
  checkUserInfo(req.session.userInfo.userId, function(err, result){
    if(result){
      var userInfo = JSON.parse(result.text);
          userInfo = JSON.parse(userInfo.personInfo);
      res.render(url_,{ 
         type : type, 
         userInfo : userInfo,
      });
    }
  });
}

module.exports = router;
module.exports.ResultProcessed = ResultProcessed;
module.exports.checkUserInfo   = checkUserInfo;
module.exports.CheckLogin      = CheckLogin;
module.exports.followList      = followList;
module.exports.followerList    = followerList;
module.exports.userSearch      = userSearch;
//redis 保存用户注册信息
// Login(req, res, function(err, results){
//     var text_  = JSON.parse(results.text);
//     var userId = text_.personInfoId;
//     AV.Promise.when(
//         myredis.setUserInfo(userId, results.text)
//     ).then(function (r1) {
//         res.send(text_);
//     })
// }) 
