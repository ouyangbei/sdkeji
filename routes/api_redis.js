'use strict';
var AV = require('leanengine');
var moment = require('moment');
var router = require('express').Router();
var redis  = require('redis'),
    RDS_PORT = 6379,    //端口号
    RDS_HOST = '127.0.1.1', //服务器IP
    RDS_PWD = 'foobared',
    RDS_OPTS = {auth_pass:RDS_PWD};      //设置项
var Promise_ = require('bluebird');
    Promise_.promisifyAll(redis.RedisClient.prototype);
    Promise_.promisifyAll(redis.Multi.prototype); 
var client = Promise_.promisifyAll(redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS));      
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    client.on("ready", function () {
        console.log("准备完毕");
    });
    client.on("connect", function () {
        console.log("连接成功");
    }); 
function getUserInfo(userId){
    var promise = new AV.Promise(function(resolve,reject){
        client.getAsync('User' + userId).then(function(result){
            console.log(result);
            if(result){
                resolve(result);
            }else{
                resolve(null);
            }
        })
    });
    return promise;
}
function setUserInfo(userId, text){
    var promise = new AV.Promise(function(resolve,reject){
        client.setAsync('User' + userId, text).then(function(res){
            return client.getAsync('User' + userId);
        }).then(function(res){
            resolve(res);
        })
    });
    return promise;
}
function updateUserInfo(userId, text){
    var promise = new AV.Promise(function(resolve,reject){
        client.getAsync('User' + userId).then(function(res){
            return client.delAsync('User' + userId);
        }).then(function(res){
            return client.setAsync('User' + userId, text);
        }).then(function(ress){
           resolve('success');
        })
    });
    return promise;
} 
module.exports = router;
module.exports.getUserInfo    = getUserInfo;
module.exports.setUserInfo    = setUserInfo;
module.exports.updateUserInfo = updateUserInfo;