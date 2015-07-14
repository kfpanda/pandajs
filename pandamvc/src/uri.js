/**
 * @comment : uri配置规范实现类
 * @author   : liuhualuo@163.com
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
		if( typeof uriList[uri] == "object" ){
			return true;
		}
		return false;
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
	//获取url的参数
	URI.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null){
			return unescape(r[2]);
		}
		return null;
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
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-23
	 */
	URI.getURIS = function(){
		return uriList;
	}
	
	URI.getURI = function(uri){
		if(uri && uri != ""){
			return uriList[uri];
		}else{
			return URI.getLocationURI();
		}
	}
	/**
	 * @Comments : 通过地址栏uri，获取对应的item。
	 * @author   : liuhualuo@163.com
	 * @create   : 2015-7-14
	 */
	URI.getLocationURI = function(){
		//url中#后面的一段参数
		var hash = window.location.hash;
		if(hash && hash != ""){
			return uriList[hash];
		}
		//window.location.pathname 为url 不带?的url
		return uriList[window.location.pathname];
	}
	
	URI.addURI = function(uris){
		$.each(uris, function(key, value){
			parentValue = {};
			//如果有继承父类，获取父类继承。
			if( !$.isEmptyObject(value.extend) ){
				parentValue = uris[value.extend];
			}
			if(key == "context"){
				uriList[key] = $.extend(true, parentValue, value);
			}else{
				uriList[value.uri] = $.extend(true, parentValue, value);
			}
		});
	}
	//	}
	//})();
})(jQuery);