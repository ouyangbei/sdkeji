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

var apis       = require('./apis');
var requestsql = require('./mysqlrequest');
var error      = require('./error');
var users      = require('./api_users');

var app        = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge :6000000000 }
}))

requestsql.init;

//新增评论
router.post('/newComment', function(req, res){
    newComment(req, res, function(err, result){
        if(err){
            res.send(err);
        }
        else{
            var text  = JSON.parse(result.text);
            if( result.status != 200 ){
                res.send({ code : error['3000']['code'], message : error['3000']['message']});
            }
            else if( text.resultCode != '0' ){
                var userInfo  = req.session.userInfo;
                    userInfo  = req.session.userInfo = null;
                res.send({ code:'3003', message:'请重新登陆'});
            }else{
                 var data = {
                    resultCode : '0',
                    content    : xss(req.body.content),
                    message    : 'success',
                    updatetime : getTimeString(),
                    userId     : req.session.userInfo.userId
                }
                res.send(data);
            }
        }
    })
})

//获取文章评论列表
router.post('/getComments', function(req, res){
    getComments(req, res, function(err, result){
       if(err){
            res.send(err);
        }
        else{
            var text  = JSON.parse(result.text);
            if( result.status != 200 ){
                res.send({ code : error['3000']['code'], message : error['3000']['message']});
            }
            else if( text.resultCode != 0 ){
                res.send({ code : error[ '-1' ]['code'], message : error[ '-1' ]['message']});
            }else{
                var userInfo = req.session.userInfo;
                if(userInfo){
                    var data = {
                        userInfo     : userInfo,
                        page         : text.page,
                        resultCode   : text.resultCode,
                        resultBoolean: text.resultBoolean,
                        resultMessage: text.resultMessage
                    }
                    res.send(data);
                }else{
                    res.send(text);
                } 
            }
        }
    })
})

//评论点赞
router.post('/greatComment',function(req, res){
    greatComment(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    })
})


//删除评论
router.post('/deleteComment',function(req, res){
    deleteComment(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    })
})

function deleteComment(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.targetid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "id": targetid,
                "person_info_id":userInfo.userId
            }
        requestsql.request( apis['comment']['deleteComment'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}

function greatComment(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.targetid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                "greatReply.reply_id": targetid,
                "greatReply.person_info_id":userInfo.userId
            }
        requestsql.request( apis['comment']['greatComment'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}
//新增评论
function newComment (req, res, callback) {
     var content = req.body.content;
         content = xss(content);
     var articleid = req.body.articleid;    
     var type    = req.body.type;    
     var targetid= req.body.targetid;
     var userId  = req.session.userInfo;
     if( !content || !userId || !type || !targetid || !articleid){
        if(!userId){
            var code = '3003';   
        }else if (!content || !targetid || !type || !articleid){
            var code = '3001';
        }
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "reply.content"  : content,
                "reply.target_id": targetid,
                "reply.subject_id":articleid,
                "reply.type"     : type,
                "reply.person_info_id":userId.userId
            }
        requestsql.request( apis['comment']['newcomment'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}
//获取文章评论
function getComments (req, res, callback){
    var targetid = req.body.targetid;
    var page     = req.body.page;
    var pageCount= req.body.pageCount;
    if(!targetid || !page || !pageCount){
        var code = '3001';
         return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params  = { 
                "reply.subject_id":targetid,
                "pageCurrent"    : page,
                "pageSize"       : pageCount
            }
        requestsql.request( apis['comment']['getcomments'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}

function getTimeString() {
    return moment().format('YYYY-MM-DD, HH:mm:ss');
}

module.exports = router;