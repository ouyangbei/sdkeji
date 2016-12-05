/**
 * Created by haoxuanli on 16/5/13.
 */
'use strict';
var AV = require('leanengine');
var moment = require('moment');
var router = require('express').Router();
var TopClient = require('./top_api/topClient').TopClient;
var SmsVerificationCode = AV.Object.extend('SmsVerificationCode');

var client = new TopClient({
    'appkey': '23364268',
    'appsecret': 'ff3ce3ad6635659b06c50d2032c4523d',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
router.post('/sendcode', function (req, res) {
    var response = {
        code:'-1',
        message:'Invalid parameters.'
    };
    if (!req.body.phoneNo) {
        console.log(response);
        res.send(response);
    } else {
        var phoneNoCheck = checkTel(req.body.phoneNo);
        if(phoneNoCheck == true){
            var queryuser= new AV.Query('User');
            queryuser.equalTo('mobileNumber',req.body.phoneNo);
            queryuser.find().then(function(results){
                if(results.length==0){
                var randomNum = MathRand();
                client.execute('alibaba.aliqin.fc.sms.num.send', {
                'extend': req.body.phoneNo,
                'sms_type':'normal',
                'sms_free_sign_name':'注册验证',
                'sms_param':{"code":randomNum,"product":"云猫直播平台"},
                'rec_num':req.body.phoneNo,
                'sms_template_code':'SMS_9260053'
                }, function(error, response) {
                    if (!error) {
                         var data = {
                            message : 'success',
                            code    : randomNum
                        };
                        res.send(data);
                        var smsRecord = new SmsVerificationCode();
                            smsRecord.set('mobileNumber', req.body.phoneNo);
                            smsRecord.set('code', randomNum);
                            smsRecord.set('timeStamp', moment().unix());
                            smsRecord.save();
                        }
                    else {
                        res.send(error);
                    }
                    })
                }else{  //已经注册
                    res.send('phone_exist');
                }
            })
        }else{
            console.log('phone_invalid');
            res.send('phone_invalid')
        }    
    }
});

router.post('/verify', function (req, res) {
    var response = {
        code:'-1',
        message:'Invalid parameters.'
    };
    if (!req.body.phoneNo || !req.body.vcode) {
        console.log(response);
        res.send(response);
    } else {
        var query = new AV.Query('SmsVerificationCode');
        query.equalTo('userPhoneNo', req.body.phoneNo);
        query.find().then(function(result) {
            var resultss=result[result.length-1];
            var now = moment().unix();
            var lastTime = resultss.get('timeStamp');
            if (now - lastTime > 60000000000) {
                response.message = 'code expired'
            } else if (resultss.get('code') === req.body.vcode) {
                response.code = '1';
                response.message = 'success';
            } else {
                response.message = 'invalid code';
            }
            console.log(response);
            res.send(response);
        }).catch(function(error) {
            response.code = '0';
            response.message = error.message;
            console.log(error);
            res.end(JSON.stringify(response));
        });
    }

});

function MathRand() {
    var Num = "";
    for (var i = 0; i < 4; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}
function checkTel(str){
    var strlength=str.length;
    if(strlength < 11){
        return false;
    }else{
    if(!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(str)){
        return false;
    }else {
        return true
    }
    }  
}
module.exports = router;