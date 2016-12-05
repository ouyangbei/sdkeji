/**
 * Created by haoxuanli on 16/5/13.
 */
'use strict';
var AV = require('leanengine');
var moment = require('moment');
var router = require('express').Router();
var Geetest   = require('./gt-sdk');//验证码
 
// 验证码初始化
var pcGeetest = new Geetest({
    geetest_id: 'e55be87d6031bde3aaded9e9a8df3dec',
    geetest_key: '7ce7e1e7c19633905c1674fb81210a7f'
});

// 获取验证码
router.get("/pc-geetest/register", function (req, res) {
// 向极验申请一次验证所需的challenge
    pcGeetest.register(function (data) {
        res.send(JSON.stringify({
            gt: pcGeetest.geetest_id,
            challenge: data.challenge,
            success: data.success
        }));
    });
});

module.exports = router;