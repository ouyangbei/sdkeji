'use strict';
var AV     = require('leanengine');
var moment = require('moment');
var router = require('express').Router();
var url    = require('url');
var gm     = require('gm');
var images = require("images");
var busboy = require('connect-busboy');

router.use(busboy());

router.get('/',function(req,res){
	res.render('test/fileupload',{
		title : 'fileupload',
	})
})
//文件/图片上传
router.post('/', function(req, res) {
  /*optional stuff to do after success */
  uploadFile(req,res);
});
// 上传接口方法（使用时自行配置到 router 中）
// 文件上传
function uploadFile (req, res) {
  if (req.busboy) {
    var base64data = [];
    var pubFileName = '';
    var pubMimeType = '';
    req.busboy.on('file', (fieldname, file, fileName, encoding, mimeType) => {
      var buffer = '';
      pubFileName = fileName;
      pubMimeType = mimeType;
      file.setEncoding('base64');
      file.on('data', function(data) {
        buffer += data;
      }).on('end', function() {
        base64data.push(buffer);
      });
    }).on('finish', function() {
      var f = new AV.File(pubFileName, {
        // 仅上传第一个文件（多个文件循环创建）
        base64: base64data[0]
      });
      try {
        f.save().then(function(fileObj) {
          // 向客户端返回数据
          res.send({
            fileId: fileObj.id,
            fileName: fileObj.name(),
            mimeType: fileObj.metaData().mime_type,
            fileUrl: fileObj.url()
          });
        });
      } catch (error) {
        console.log('uploadFile - ' + error);
        res.status(502);
      }
    })
    req.pipe(req.busboy);
  } else {
    console.log('uploadFile - busboy undefined.');
    res.status(502);
  }
};
module.exports = router;