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
var markdown   = require('markdown').markdown;

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

//编辑文章时候获取是否为当前用户
router.post('/checkIfUser', function(req, res) {
    checkIfUser(req, res, function(err, result){
        var text = JSON.parse(result.text);
        if(text.subject.person_info_id == req.session.userInfo.userId){
            res.send({ code : '0' ,message : text});
        }else{
            res.send({ code : '-1' ,message : 'err'});
        }
    })
});

router.post('/editArticle',  function(req, res) {
    editArticle(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    }); 
});

//获取主题列表
router.post('/getTopics',function(req, res){
    getTopics(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    })
})
//获取文章，首页大图，首页列表，一般列表
router.post('/getArticles',function(req, res){
    getArticleList(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    });
})
//获取某用户的文章,获取自己的检查登录状态，获取别人的直接传id
router.post('/getUserArticles',function(req, res){
    getUserArticles(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    })
})

//获取文章详细
router.post('/articleDetails', function(req, res) {
    getArticleDetails(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    })
});

//新建文章
router.post('/newart', function(req, res){
    newArticle(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    });
})
//删除文章
router.post('/deleteArticle',function(req, res){
    deleteArticle(req, res, function(err, result){
        users.ResultProcessed(req ,res, err, result);
    });
})

//点赞文章
router.post('/greatArticle',function(req, res){
    greatArticle(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    });    
})

//是否点赞过
router.post('/isGreat',function(req, res){
    isGreat(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    });    
})

//是否点收藏过
router.post('/isCollect',function(req, res){
    isCollect(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    });    
})

//收藏文章
router.post('/collect', function(req, res) {
    collectArtice(req, res, function(err, result){
        users.ResultProcessed(req,res, err, result);
    });  
});

//取消收藏文章
router.post('/cancelCollect', function(req, res) {
    cancelCollectArticle(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    });  
});

//获取收藏列表
router.post('/collectList',function(req, res) {
    collectList(req, res, function(err, result){
        users.ResultProcessed(req, res, err, result);
    }); 
});
//获取收藏列表
function  collectList(req, res, callback){
    var userInfo = req.session.userInfo;
    var pageCurrent = req.body.pageCurrent;
    var pageSize     = req.body.pageSize;
    if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "pageCurrent": pageCurrent,
                "pageSize"   : pageSize,
                "collect.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['collectList'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}


//取消收藏文章
function cancelCollectArticle(req, res, callback){
    var userInfo = req.session.userInfo;
    var targetid = req.body.articleid;
    if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "collect.subject_id": targetid,
                "collect.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['cancelCollect'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}


//收藏文章
function collectArtice(req, res, callback){
    var userInfo = req.session.userInfo;
    var targetid = req.body.articleid;
    if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "collect.subject_id": targetid,
                "collect.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['collect'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}

//判断是否点收藏过
function isCollect(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.articleid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "collect.subject_id": targetid,
                "collect.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['isCollect'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}

//判断是否点赞过
function isGreat(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.articleid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "great.subject_id": targetid,
                "great.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['isGreat'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}

function checkIfUser(req, res, callback){
    var userInfo  = req.session.userInfo;
    var targetid  = req.body.articleid;
    if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        var params  = { id : targetid };
        requestsql.request( apis['article']['getArticleDetails'], params, 'form', function(err, result){
        return callback(err, result);
        })
    }
}


//删除文章
function deleteArticle(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.articleid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "id": targetid,
                "person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['deleteArticle'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}

// 点赞主题
function greatArticle(req, res, callback){
     var userInfo  = req.session.userInfo;
     var targetid  = req.body.articleid;
     if( !userInfo ){
        var code = '3003';   
        return callback( {code : error[code]['code'], message : error[code]['message']},null ); 
     }else{
        var params  = { 
                token  : req.session.userInfo.token,
                "great.subject_id": targetid,
                "great.person_info_id":userInfo.userId
            }
        requestsql.request( apis['article']['greatArticle'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}

//获取主题明细
function getArticleDetails (req, res, callback) {
     var artid = req.body.id;
     if( !artid ){
        var code = '3001';
        return callback( {cood : error[code]['code'], message : error[code]['message']},null );
     }else{
        var params  = { id : artid };
        requestsql.request( apis['article']['getArticleDetails'], params, 'form', function(err, result){
        return callback(err, result);
        })
     }
}

//获取首页轮播图
function getArticleList(req, res, callback){
    var topicId = req.body.topicId;
    var title   = req.body.title;
    var state   = req.body.state;
    var page    = req.body.page;
    var pageSize= req.body.pageSize;
    if( !topicId && !state && !page && !pageSize){
        var code = '3001';
        return callback( {cood : error[code]['code'], message : error[code]['message']},null );
    }else{
        if(topicId){
            var params = {
                "subject.topic_id" : topicId,
                "pageCurrent"      : page,
                "pageSize"         : pageSize
            }
        }else{
            var params = {
                "subject.state"    : state,
                "pageCurrent"      : page,
                "pageSize"         : pageSize
            }
        }
        if(title){
            params["subject.title"] = title;
        }
        requestsql.request( apis['article']['getArticle'], params, 'form', function(err, result){
            return callback(err, result);
        })
    } 
}

// 获取用户文章
function getUserArticles(req, res, callback){
    var userId = req.body.userId;
    var page    = req.body.page;
    var pageSize= req.body.pageSize;
    if(  !page || !pageSize){
        var code = '3001';
        return callback( {cood : error[code]['code'], message : error[code]['message']},null );
    }else{
        if(userId){
            var params = {
                "subject.person_info_id" : userId,
                "pageCurrent"      : page,
                "pageSize"         : pageSize
            }
        }else{
            var userInfo = req.session.userInfo;
            if(!userInfo){
                 var code = '3003';
                 return callback( {cood : error[code]['code'], message : error[code]['message']},null );
            }else{
                var params = {
                    "subject.person_info_id" : userInfo.userId,
                    "pageCurrent"      : page,
                    "pageSize"         : pageSize
                }
            }
            
        }
        requestsql.request( apis['article']['getArticle'], params, 'form', function(err, result){
            return callback(err, result);
        })
    } 
}

//新增文章
function editArticle(req, res, callback){
    var checkreg = users.CheckLogin(req, res);
    var text    = xss(req.body.data);
    var data    = JSON.parse(text);
    if( checkreg == false ){
        var code = '3001';
        return callback( {cood : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        data.personInfoId = req.session.userInfo.userId;
        if( !data.type || !data.title || !data.titleImg || !data.topicId || !data.details){
            if( !data.type ){var code = '3004'}
            else if( !data.title ){ var code = '3005'}   
            else if( !data.titleImg ){ var code = '3006'}
            else if( !data.topicId ){ var code = '3007'}
            else if( !data.details ){ var code = '3008'}      
            return callback( {cood : error[code]['code'], message : error[code]['message']},null );
        }
        else{
            var params = {
               token  : req.session.userInfo.token,
               content : JSON.stringify(data)
            };
            requestsql.request( apis['article']['editArticle'], params, 'form', function(err, result){
                return callback(err, result);
            })
        }
    } 
}
//新增文章
function newArticle(req, res, callback){
    var checkreg = users.CheckLogin(req, res);
    var text    = xss(req.body.data);
    var data    = JSON.parse(text);
    if( checkreg == false ){
        var code = '3001';
        return callback( {cood : error[code]['code'], message : error[code]['message']},null ); 
    }else{
        data.personInfoId = req.session.userInfo.userId;
        if( !data.type || !data.title || !data.titleImg || !data.topicId || !data.details){
            if( !data.type ){var code = '3004'}
            else if( !data.title ){ var code = '3005'}   
            else if( !data.titleImg ){ var code = '3006'}
            else if( !data.topicId ){ var code = '3007'}
            else if( !data.details ){ var code = '3008'}      
            return callback( {cood : error[code]['code'], message : error[code]['message']},null );
        }
        else{
            var params = {
                token  : req.session.userInfo.token,
               content : JSON.stringify(data)
            };
            requestsql.request( apis['article']['newarticle'], params, 'form', function(err, result){
                return callback(err, result);
            })
        }
    } 
}

//获取写作类型分类
function getTopics(req, res, callback){
    var params = {};
    requestsql.request( apis['article']['gettopics'], params, 'form', function(err, result){
        return callback(err, result);
    })
}


function markdownToHtml(str){
    var html = markdown.toHTML(str);
    return html;
}

module.exports = router;
module.exports.getArticleList = getArticleList;
module.exports.getArticleDetails=getArticleDetails;
module.exports.getUserArticles = getUserArticles;
module.exports.getTopics = getTopics;
module.exports.collectList=collectList;
module.exports.markdownToHtml=markdownToHtml;