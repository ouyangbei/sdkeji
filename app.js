'use strict';
var compression = require('compression');
var express     = require('express');
var parseurl    = require('parseurl');
var timeout     = require('connect-timeout');
var path        = require('path');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var AV          = require('leanengine');
var moment      = require('moment');
var url         = require('url');
var session     = require('express-session');

//自定义模块
var api_sms   = require('./routes/api_sms');//验证短信
var api_users = require('./routes/api_users');//用户

var gets  = require('./routes/gets/gets.js');//新进入的页面get到

// var api_redis = require('./routes/api_redis');//redis 缓存
var api_file  = require('./routes/api_file'); //文件上传
var api_article  = require('./routes/api_article');//文章获取，上传，修改，等
var api_imgverify= require('./routes/api_imgverify');//验证码
var api_comment  = require('./routes/api_comment');//评论

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
//gzip压缩
app.use(compression()); 

// 设置默认超时时间
app.use(timeout('60s'));

//检测系统
app.use(function(req,res,next){
  var deviceAgent = req.headers["user-agent"].toLowerCase();
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  if(agentID){
    req.agent = '1';
  }else{
    req.agent = '0';
  }
  next();
})

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  userInfo:{},
  cookie: { maxAge :6000000000 }
}))

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// 可以将一类的路由单独保存在一个文件中
app.use('/sms',api_sms);
app.use('/user',api_users);
// app.use('/redis',api_redis);
app.use('/file',api_file);
app.use('/',gets);
app.use('/article',api_article);
app.use('/comment',api_comment);
app.use('/imgverify',api_imgverify);


function checkLogin(req, res, url_, type){
  api_users.checkUserInfo(req.session.userInfo.userId, function(err, result){
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

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) { // jshint ignore:line
  var statusCode = err.status || 500;
  console.log(err);
  if(statusCode === 500) {
    console.error(err.stack || err);
  }
  if(req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: 'error',
    error: 'error',
    title:'err',
  });
});

module.exports = app;
