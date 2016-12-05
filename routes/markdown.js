/*
  自制  markdown
  语法不是太好
*/
'use strict';
var  alterall 		  = new RegExp("#####", "g"),  //总评
	 paragraphComment = new RegExp("####", "g"),   //段落建议
	 suggest 		  = new RegExp("###", "g"),    //段落建议每一条的开头
	 paragraphCom     = new RegExp('##','g'),		//段落点评
	 parComCont 	  = new RegExp("#", "g"),	   //段落点评具体内容
	 parComContRed 	  = new RegExp("```", "g"),		//红色字体点评
	 spanend 		  = new RegExp("/&&", "g"),     //标签结尾
	 tohtml_alterall  = '<span class="alter_all">', //总评
	 tohtml_spanend	  = '</span>',
	 tohtml_paragraphCom='<span class="paramcomment">',
	 tohtml_paragraphComment = '<span class="paramcommentelm">',
	 tohtml_suggest	  = '<span class="suggest">',
	 tohtml_parComContRed='<span class="param_comment_content_red">',
	 tohtml_parComCont= '<span class="param_comment_content">';
function toHtml(obj){
	return  obj.replace(alterall,tohtml_alterall).
	replace(paragraphComment,tohtml_paragraphCom).
	replace(suggest,tohtml_suggest).
	replace(paragraphCom,tohtml_paragraphComment).
	replace(spanend,tohtml_spanend).
	replace(parComCont,tohtml_parComCont).
	replace(parComContRed,tohtml_parComContRed);
}
module.exports.toHtml = toHtml;