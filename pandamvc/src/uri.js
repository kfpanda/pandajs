/**
 * @comment : uri配置规范实现类
 * @author   : liuhualuo@myhexin.com
 * @create   : 2012-7-18
 */
(function($) {
	
	var URI = function(){
		this.name = 'URI';
		this.version = '2.0.1';
	};
	this.URI = new URI();
	URI = this.URI;
	
	var homeURI = '#/home';
	var templateSuffix = "tpl";
	var uriList = {};
	
	//this.URI = (function(){

	//	return {
	/**
	 * uriList是否包含uri路径
	 * @params {Sting} "#/im/home"
	 */
	URI.hasURI = function(str) {
		if(typeof str != 'string' ||  str.length == 0){
			return false;
		}
		var uri = '';
		try{
			uri = str.substr(2).replace('/', '_') + '_uri'; // #/im/home -> im_home_uri
		}catch(e){}
		return Hexin.isObject(uriList[uri]);
	}
	
	URI.setHomeURI = function(uri) {
		if(this.hasURI(uri)){
			uriList.context.homeURI = uri;
		}
	}
	
	URI.getHomeURI = function(){
		var context = uriList.context || {};
		return context.homeURI || homeURI;
	}
	
	URI.getTemplateSuffix = function(){
		var context = uriList.context || {};
		return context.templateSuffix || templateSuffix;
	}
	
	//获取BeforeController
	URI.getBeforeController = function(){
		var context = uriList.context || {};
		return context.before_controller;
	}
	
	//获取afterController
	URI.getAfterController = function(){
		var context = uriList.context || {};
		return context.after_controller;
	}
	
	URI.isRefresh = function(refreshFlag){
		var context = uriList.context || {};
		if( context.refresh && context.refreshFlag != refreshFlag ){
			return true;//刷新
		}
		return false;//不刷新
	}
	
	/**
	 * @Comments : 获得特定的请求参数。
	 * @param    :  paramName 为参数名, paramType为ParamType对象中属性。
	 * @author   : liuhualuo@myhexin.com
	 * @create   : 2012-7-23
	 */
	URI.getURIS = function(){
		return uriList;
	}
	
	URI.getURI = function(uri){
		return uriList[uri];
	}
	
	URI.addURI = function(uris){
		$.each(uris, function(key, value){
			parentValue = {};
			//如果有继承父类，获取父类继承。
			if( !$.isEmptyObject(value.extend) ){
				parentValue = uris[value.extend];
			}
			uriList[key] = $.extend(true, parentValue, value);
		});
	}
	//	}
	//})();
})(jQuery);