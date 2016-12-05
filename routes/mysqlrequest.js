/**
 * Created by haoxuanli on 16/5/13.
 */
'use strict';
var AV         = require('leanengine');
var superagent = require('superagent');
var moment     = require('moment');
var router     = require('express').Router();
var Promise_   = require('bluebird');

var BaseUrl    = 'http://115.29.142.97:8183';
// var BaseUrl    = 'http://192.168.9.70:8081';
// var BaseUrl    = 'http://172.17.0.4:8080';
var Timestamp  = undefined;
var Signature  = undefined;
var Nonce      = undefined;
var HEADERS    = {};

exports.init   = function(){
    Timestamp  = Date.parse( new Date() )/1000;
    HEADERS['Nonce']        = Nonce;
    HEADERS['Timestamp']    = Timestamp;
    HEADERS['Signature']    = Signature;
    HEADERS['Content-Type'] = 'application/x-www-form-urlencoded';  
}

exports.request = function(api ,params ,format , callback){
    var fm = 'form';
    if( format == 'json' ){
        fm = 'json';
    }
    if(params.token){
       HEADERS['token']    = params.token; 
    }
    else{
       HEADERS['token']    = null; 
    }
    superagent.agent()
    .post( BaseUrl + api )
    .type( fm )
    .set( HEADERS )
    .send( params )
    .end( function( err, result){
        if(err){
            return callback( err, null);
        }
        else{
            return callback( null, result);
        }
    } )
}