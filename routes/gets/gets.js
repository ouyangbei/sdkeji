'use strict';
var AV     = require('leanengine');
var moment = require('moment');
var express = require('express');
var url    = require('url');
var gm     = require('gm');
var images = require("images");
var busboy = require('connect-busboy');
var session= require('express-session');

var api_article = require('../api_article');
var api_users   = require('../api_users'); //用户
var myMarkdown  = require('../markdown') //自制 markdown;

var router   = require('express').Router();

router.use(busboy());



router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  userInfo:{},
  cookie: { maxAge :6000000000 }
}))

router.get('/test',function(req, res){
   res.render('index',{title:'title',types : '0'});
})

//搜索文章
router.get('/search_article/:id',function(req,res){
  var arg = url.parse(req.url, true).query;
   var title = req.params.id;
   var checkreg = api_users.CheckLogin(req, res);
        req.body = {
          title:title,
          page:1,
          pageSize:12,
        }
   if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            ArticleList(req,res),
            Topics(req,res),
        ]).then(function (r0,r1,r2) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            res.render('article/articleSearch',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              type     : '1',
              title    : '享留学交流社区',
              topicList: text2.topics
            })
        })
    }else{
        AV.Promise.when([
            ArticleList(req,res),
            Topics(req,res),
        ]).then(function (r1,r2) {
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            var viewurl = 'article/articleSearch';
            res.render(viewurl,{
              articles : text.page.list,
              type     : '1',
              userInfo : '1',
              title    : '享留学交流社区',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              topicList: text2.topics
            })
        })
    }     
})
//搜索用户
router.get('/search_user/:id',function(req,res){
   var arg = url.parse(req.url, true).query;
   var username = req.params.id;
   var checkreg = api_users.CheckLogin(req, res);
        req.body = {
          userName:username,
          pageCurrent:1,
          pageSize:6,
        }
   if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            SearchUserList(req,res)
        ]).then(function (r0,r1) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            res.render('users/userSearch',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              users : text.page.list,
              type     : '1',
              title    : '享留学交流社区',
            })
        })
    }else{
        AV.Promise.when([
            SearchUserList(req,res),
        ]).then(function (r1) {
            var text  = JSON.parse(r1.text);
            var viewurl = 'users/userSearch';
            res.render(viewurl,{
              users : text.page.list,
              type     : '1',
              userInfo : '1',
              title    : '享留学交流社区',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
            })
        })
    }     
})

//修改个人信息
router.get('/profile',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    if( checkreg == true){
        checkLogin(req, res,'users/profile', 'personalcenter','享留学交流社区');
    }else{
        res.render('users/login',{type:'home',userInfo : '1',title:'享留学交流社区',types : '0'});
    }
})

//协议
router.get('/agreement',function(req,res){
    res.render('agreement',{
      title : '用户协议——享留学交流社区',
      type  : '1',
      types : '0'
    })
})

//查看个人关注的用户
router.get('/follow/:id',function(req, res){
   var arg = url.parse(req.url, true).query;
   var user_id = req.params.id;
   var checkreg = api_users.CheckLogin(req, res);
          req.body = {
            userId:user_id,
            pageCurrent:1,
            pageSize:6,
          }
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            FollowList(req,res)
        ]).then(function (r0,r1) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            console.log(text);
            res.render('users/followee',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              users : text.page.list,
              type     : '1',
              title    : '享留学交流社区',
            })
        })
    }else{
        AV.Promise.when([
            FollowList(req,res),
        ]).then(function (r1) {
            var text  = JSON.parse(r1.text);
            console.log(text);
            var viewurl = 'users/followee';
            res.render(viewurl,{
              users : text.page.list,
              type     : '1',
              userInfo : '1',
              title    : '享留学交流社区',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
            })
        })
    }
})

//查看个人关注者
router.get('/follower/:id',function(req, res){
   var arg = url.parse(req.url, true).query;
   var user_id = req.params.id;
   var checkreg = api_users.CheckLogin(req, res);
          req.body = {
            userId:user_id,
            pageCurrent:1,
            pageSize:6,
          }
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            FollowerList(req,res)
        ]).then(function (r0,r1) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            console.log(text);
            res.render('users/follower',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              users : text.page.list,
              type     : '1',
              title    : '享留学交流社区',
            })
        })
    }else{
        AV.Promise.when([
            FollowerList(req,res),
        ]).then(function (r1) {
            var text  = JSON.parse(r1.text);
            var viewurl = 'users/follower';
            res.render(viewurl,{
              users : text.page.list,
              type     : '1',
              userInfo : '1',
              title    : '享留学交流社区',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
            })
        })
    }
})

//其他用户的用户中心
router.get('/users/:id',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    var userId = req.params.id;
      req.body  ={
          page : 1,
          pageSize:12,
          userId : userId,
      }
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            UserArticleList(req,res),
            Topics(req,res),
            getUserInfo(req),
        ]).then(function (r0,r1,r2,r3) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            var text3 = JSON.parse(r3.text);
                text3 = JSON.parse(text3.personInfo);
                if(userId == req.session.userInfo.userId){
                    res.render('users/user',{
                      userInfo : userInfo,
                      usersInfo: '1',
                      totalPage: text.page.totalPage,
                      lastPage : text.page.lastPage,
                      articles : text.page.list,
                      types    : '0',  
                      type     : 'personalcenter',
                      title    : '享留学交流社区',
                      titles   : 'user',
                      topicList: text2.topics
                    })
                }else{
                  res.render('users/others/users',{
                    userInfo : userInfo,
                    totalPage: text.page.totalPage,
                    lastPage : text.page.lastPage,
                    articles : text.page.list,
                    usersInfo: text3,
                    types    : '0',  
                    type     : '1',
                    title    : '享留学交流社区',
                    titles   : 'users',
                    topicList: text2.topics
                  })
                }
        })
    }else{
        AV.Promise.when([
            UserArticleList(req,res),
            Topics(req,res),
            getUserInfo(req),
        ]).then(function (r1,r2,r3) {
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            var text3 = JSON.parse(r3.text);
                text3 = JSON.parse(text3.personInfo);  
            res.render('users/others/users',{
              userInfo : '1',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              usersInfo: text3,
              types    : '0',  
              type     : '1',
              titles   : 'users',
              title    : '享留学交流社区',
              topicList: text2.topics
            })
        })
    }
})

//个人中心
router.get('/user',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    var arg = url.parse(req.url, true).query;
    var userId = arg.id;
    if( checkreg == true){
          req.body  ={
            page : 1,
            pageSize:12
          }
        if(userId){
          req.body.userId = userId
        }
        AV.Promise.when([
            UserInfo(req),
            UserArticleList(req,res),
            Topics(req,res),
        ]).then(function (r0,r1,r2) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            res.render('users/user',{
              userInfo : userInfo,
              usersInfo: '1',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              types    : '0',  
              type     : 'personalcenter',
              title    : '享留学交流社区',
              titles   : 'user',
              topicList: text2.topics
            })
        })
    }else{
        res.render('users/login',{type:'personalcenter', userInfo : '1',title : '享留学交流社区',titles:'user',types : '0'});
    }
})
//主页
router.get('/',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    var data = {
          body : {
            state   : 1,
            page    : 1,
            pageSize: 9
          }
        } 
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            ArticleList(data,res),
            Topics(req,res),
        ]).then(function (r0,r1,r2) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            res.render('homepage/home',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              type     : 'home',
              types    : '0',
              title    : '享留学交流社区',
              topicList: text2.topics
            })
        })
    }else{
        AV.Promise.when([
            ArticleList(data,res),
            Topics(req,res),
        ]).then(function (r1,r2) {
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            if(req.agent == '0'){
              var viewurl = 'homepage/home';
            }else{
              var viewurl = 'phone/home/home';
            }
            res.render(viewurl,{
              articles : text.page.list,
              type     : 'home',
              userInfo : '1',
              types    : '0',
              title    : '享留学交流社区',
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              topicList: text2.topics
            })
        })
    }
})

//topiclist 主题列表
router.get('/share/:id',function(req, res){
    var arg = url.parse(req.url, true).query;
    var topic_id = req.params.id;
    if(topic_id == 'favicon.ico'){
    }else{
    var data = {
      body : {
        state   : 1,
        page    : 1,
        pageSize: 12,
        topicId : topic_id
      }
    }
    var checkreg = api_users.CheckLogin(req, res);
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            ArticleList(data,res),
            Topics(req,res),
        ]).then(function (r0,r1,r2) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            for (var i = 0; i < text2.topics.length; i++) {
                if(text2.topics[i].id==topic_id){
                  var title = text2.topics[i].name;
                  var imgurl = text2.topics[i].url;
                }
            }
            res.render('share/share',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              type     : 'home',
              imgurl   : imgurl,
              title    : title+' - 享留学交流社区',
              topicid  : topic_id,
              topicList: text2.topics
            })
        })
    }else{
        AV.Promise.when([
            ArticleList(data,res),
            Topics(req,res),
        ]).then(function (r1,r2) {
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            if(req.agent == '0'){
              var viewurl = 'share/share';
            }else{
              var viewurl = 'phone/share/share';
            }
            for (var i = 0; i < text2.topics.length; i++) {
                if(text2.topics[i].id==topic_id){
                  var title = text2.topics[i].name;
                  var imgurl = text2.topics[i].url;
                }
            }
            res.render(viewurl,{
              articles : text.page.list,
              type     : 'home',
              userInfo : '1',
              title    : title+' - 享留学交流社区',
              imgurl   : imgurl,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              topicid  : topic_id,
              topicList: text2.topics
            })
        })
    }
  }
})
//编辑文章
router.get('/edit',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    if( checkreg == true){
        checkLogin(req, res,'article/edit', 'personalcenter','享留学交流社区');
    }else{
        res.render('users/login',{type:'home', userInfo : '1',title : '享留学交流社区'});
    }
})

//获取个人动态
router.get('/states/:id',function(req, res){
   var arg = url.parse(req.url, true).query;
   var states = req.params.id;
   var userId = arg.id;
   var statetype= states.split("?");
   var checkreg = api_users.CheckLogin(req, res);
       req.body  ={
            page : 1,
            pageSize:12,
            userId :userId
          }
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            getUserInfo(req),
        ]).then(function (r0,r1) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text2 = JSON.parse(r1.text);
                text2 = JSON.parse(text2.personInfo);
            res.render('users/others/states/'+statetype[0],{
              userInfo : userInfo,
              usersInfo: text2,
              types    : '0',  
              type     : '1',
              title    : '享留学交流社区',
              titles    : 'state',
            })
        })
    }else{
        AV.Promise.when([
            getUserInfo(req),
        ]).then(function (r1) {
            var text2 = JSON.parse(r1.text);
            text2 = JSON.parse(text2.personInfo);
            res.render('users/others/states/'+statetype[0],{
              userInfo : '1',
              usersInfo: text2,
              types    : '0',  
              type     : '1',
              title    : '享留学交流社区',
              titles   : 'state',
            })
        })
    }
})

//获取个人动态
router.get('/state/:id',function(req, res){
   var arg = url.parse(req.url, true).query;
   var articleId = req.params.id;
   var statetype= articleId.split("?");
   var checkreg = api_users.CheckLogin(req, res);
    if( checkreg == true){
          req.body  ={
            page : 1,
            pageSize:12
          }
        AV.Promise.when([
            UserInfo(req),
        ]).then(function (r0) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            res.render('users/state/'+statetype[0],{
              userInfo : userInfo,
              usersInfo: '1',
              types    : '0',  
              type     : 'personalcenter',
              title    : '享留学交流社区',
              titles   : 'state'
            })
        })
    }else{
        res.render('users/login',{type:'personalcenter', userInfo : '1',title : '享留学交流社区',titles:'user',types : '0'});
    }
})

//我的收藏
router.get('/collect',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    var arg = url.parse(req.url, true).query;
    var userId = arg.id;
    if( checkreg == true){
          req.body  ={
            page : 1,
            pageSize:12
          }
        if(userId){
          req.body.userId = userId
        }
        AV.Promise.when([
            UserInfo(req),
            UserCollectArticleList(req,res),
            Topics(req,res),
        ]).then(function (r0,r1,r2) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var text  = JSON.parse(r1.text);
            var text2 = JSON.parse(r2.text);
            res.render('users/collect',{
              userInfo : userInfo,
              totalPage: text.page.totalPage,
              lastPage : text.page.lastPage,
              articles : text.page.list,
              usersInfo: '1',
              types    : '0',  
              type     : 'personalcenter',
              title    : '享留学交流社区',
              titles   : 'collect',
              topicList: text2.topics
            })
        })
    }else{
        res.render('users/login',{type:'personalcenter', userInfo : '1',title : '享留学交流社区',titles:'collect',types : '0'});
    }

})
router.get('/write',function(req, res){
    var checkreg = api_users.CheckLogin(req, res);
    if( checkreg == true){
        checkLogin(req, res,'write', 'write','享留学交流社区');
    }else{
        res.render('users/login',{ type:'home',userInfo : '1' ,title : '享留学交流社区',types:'0'});
    }
})
router.get('/login',function(req, res){
  res.render('users/login',{title:'享留学交流社区',types:'0',});
})

router.get('/top/:id',function(req, res){
  var arg = url.parse(req.url, true).query;
  var articleId = req.params.id;
  var articleIds= articleId.split("?");
      articleId = articleIds[0];
  if(articleId == 'favicon.ico'){

  }else{
      var checkreg = api_users.CheckLogin(req, res);
      var data = {
        body:{
          id : articleId
        }
      }
    if( checkreg == true){
        AV.Promise.when([
            UserInfo(req),
            getArticleDetails(data,res),
        ]).then(function (r0,r1) {
            var userInfo = JSON.parse(r0.text);
                userInfo = JSON.parse(userInfo.personInfo);
            var article  = JSON.parse(r1.text);
            var person_info_id = article.subject.person_info_id;
            var title    = article.subject.title;
            var details  = article.details;
            res.render('article/articledetails',{
              userInfo : userInfo,
              details  : details,
              person_info_id:person_info_id,
              type     : 'top',
              types    : '1',
              title    : title+' - 享留学交流社区',
            })
        })
    }else{
        AV.Promise.when([
            getArticleDetails(data,res),
        ]).then(function (r1) {
            var article  = JSON.parse(r1.text);
            var title    = article.subject.title;
            var person_info_id = article.subject.person_info_id;
            var details  = article.details;
            if(req.agent == '0'){
              var viewurl = 'article/articledetails';
            }else{
              var viewurl = 'phone/topic/details';
            }
            res.render(viewurl,{
              details  : details,
              userInfo : 1,
              person_info_id:person_info_id,
              type     : 'top',
              types    : '1',
              title    : title+' - 享留学交流社区',
            })
        })
    }
  }
})
router.get('/register',function(req, res){
  var checkreg = api_users.CheckLogin(req, res);
  res.render('users/register',{title:'享留学交流社区',types : '0'});
})

//获取主题信息
function Topics(req,res){
   var promise = new AV.Promise(function(resolve, reject){
      api_article.getTopics(req,res,function(err,result){
        if(err){
          resolve(err);
        }
        else{
          resolve(result);
        }
      })
   })
   return promise ;
}

//获取某一用户的信息
function getUserInfo(req){
  var promise = new AV.Promise(function(resolve, reject){
      api_users.checkUserInfo(req.body.userId, function(err, result){
          if(result){
            resolve(result);
          }else{
            resolve(err);
          }
      })
    })
    return promise ;
}

//获取用户信息
function UserInfo (req){
    var promise = new AV.Promise(function(resolve, reject){
      api_users.checkUserInfo(req.session.userInfo.userId, function(err, result){
          if(result){
            resolve(result);
          }else{
            resolve(err);
          }
      })
    })
    return promise ;
}

//获取我的文章

function UserArticleList(req,res){
    var promise = new AV.Promise(function(resolve, reject){
      api_article.getUserArticles(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}

//获取我收藏的文章
function UserCollectArticleList(req,res){
  var promise = new AV.Promise(function(resolve, reject){
      api_article.collectList(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}

function getArticleDetails(req,res){
   var promise = new AV.Promise(function(resolve, reject){
      api_article.getArticleDetails(req,res,function(err,result){
        if(result){
          var article  = JSON.parse(result.text);
          var details  = article.details; 
          for (var i = 0; i < details.length; i++) {
            if(details[i].type == 'txt'){
              details[i].content = myMarkdown.toHtml(details[i].content);
            }   
          }
          article.details = details; 
          result.text = JSON.stringify(article);       
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}

//获取文章
function ArticleList(req,res){
    var promise = new AV.Promise(function(resolve, reject){
      api_article.getArticleList(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;

}

//获取关注的人列表
function FollowList(req,res){
    var promise = new AV.Promise(function(resolve, reject){
      api_users.followList(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}

//获取关注的人列表
function FollowerList(req,res){
    var promise = new AV.Promise(function(resolve, reject){
      api_users.followerList(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}

//搜索用户列表
function SearchUserList(req,res){
    var promise = new AV.Promise(function(resolve, reject){
      api_users.userSearch(req,res,function(err,result){
        if(result){
          resolve(result);
        }
        else{
          resolve(err);
        }
      })
    })
    return promise ;
}
//检测登录
function checkLogin(req, res, url_, type,title){
  api_users.checkUserInfo(req.session.userInfo.userId, function(err, result){
    if(result){
      var userInfo = JSON.parse(result.text);
          userInfo = JSON.parse(userInfo.personInfo);
        res.render(url_,{ 
         type : type, 
         title:title,
         types : '0',
         userInfo : userInfo,
        });
    }
  });
}

function getUrl(obj){
  var url = obj.split('/');
  var urllenght = url.length;
  var icocount  = url.indexOf('ico');
  if((urllenght == 3) && (icocount == -1)){
    return url[urllenght-1];
  }
  else{
    return false;
  }
}
module.exports = router;
module.exports.ArticleList = ArticleList;
module.exports.Topics = Topics;