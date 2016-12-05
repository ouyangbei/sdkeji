module.exports = {};

function define( key, value ) {
  module.exports[key] = value;
}

define( 'user', {
  'personInfo'      : '/share/api/user/personInfo',
  'phoneCode'       : '/share/api/user/phoneCode', 
  'register'        : '/share/api/user/register',
  'login'           : '/share/api/user/userLogin',
  'follow'          : '/share/api/relation/follow',
  'isFollow'        : '/share/api/relation/isFollow',
  'followList'      : '/share/api/relation/friend',
  'followerList'    : '/share/api/relation/fins',
  'userSearch'      : '/share/api/user/list',
  'cancelFollow'    : '/share/api/relation/cancelFollow',
  'validateUsername': '/share/api/user/validateUsername',
  'updatePersonInfo': '/share/api/user/updatePersonInfo'
} );

define( 'article', {
  'newarticle'       : '/share/api/subject/save',
  'gettopics'        : '/share/api/topic/list',
  'getArticle'   	   : '/share/api/subject/list',
  'collect'          : '/share/api/collect/save',
  'isCollect'        : '/share/api/collect/isCollect',
  'cancelCollect'    : '/share/api/collect/cancle',
  'collectList'      : '/share/api/collect/list',
  'isGreat'          : '/share/api/great/isGreat',
  'greatArticle'     : '/share/api/great/save',
  'editArticle'      : '/share/api/subject/update',
  'deleteArticle'    : '/share/api/subject/delete',
  'getArticleDetails': '/share/api/subject/detail',
} );

define('state', {
  'toComment'        : '/share/api/dynamicReply/otherList',
  'toGreat'          : '/share/api/dynamicCollect/otherList',
  'myComment'        : '/share/api/dynamicReply/list',
  'myGreat'          : '/share/api/dynamicCollect/list',
})

define( 'comment', {
  'newcomment'       : '/share/api/reply/save',
  'getcomments'      : '/share/api/reply/list',
  'greatComment'     : '/share/api/greatReply/save',
  'deleteComment'    : '/share/api/reply/delete'
} );
